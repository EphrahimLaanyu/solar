"""Build the ST Light analytics warehouse from legacy HTML report exports.

Usage:
    python scripts/build_warehouse.py --source "D:\\Data"

The script is intentionally deterministic and local: it does not upload company data.
It cleans and joins the reports, writes analysis-ready CSV files, and creates the JSON
snapshot consumed by the React dashboard at /warehouse.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import re
import statistics
from collections import Counter, defaultdict
from datetime import date, datetime
from pathlib import Path
from typing import Any, Iterable

from lxml import html


SPACE_RE = re.compile(r"\s+")
DATE_RE = re.compile(r"^\d{1,2}/\d{1,2}/\d{4}$")


def clean_text(value: Any) -> str:
    return SPACE_RE.sub(" ", str(value or "").replace("\xa0", " ")).strip()


def number(value: Any) -> float | None:
    text = clean_text(value).replace(",", "").replace("KSh", "").replace("%", "")
    text = text.strip("() ")
    if not text or text in {"-", "N/A", "None"}:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def rounded(value: float | None, digits: int = 2) -> float:
    return round(float(value or 0), digits)


def rows(path: Path) -> Iterable[list[str]]:
    document = html.parse(str(path), parser=html.HTMLParser(encoding="windows-1252"))
    for tr in document.xpath("//tr"):
        values = [clean_text(" ".join(cell.itertext())) for cell in tr.xpath("./td|./th")]
        values = [value for value in values if value]
        if values:
            yield values


def parse_date(value: str) -> date | None:
    try:
        return datetime.strptime(value, "%m/%d/%Y").date()
    except ValueError:
        return None


def parse_price_list(path: Path) -> tuple[list[dict], int]:
    records, seen, duplicates = [], set(), 0
    for values in rows(path):
        if len(values) < 7 or values[0].lower() in {"code", "itemcode"}:
            continue
        buy, wholesale, retail = map(number, values[4:7])
        qty = number(values[2])
        if qty is None or buy is None or wholesale is None or retail is None:
            continue
        code = clean_text(values[0]).upper()
        if code in seen:
            duplicates += 1
            continue
        seen.add(code)
        records.append({
            "code": code,
            "name": clean_text(values[1]).upper(),
            "quantity": qty,
            "reorder_level": number(values[3]) or 0,
            "buying_price": buy,
            "wholesale_price": wholesale,
            "retail_price": retail,
        })
    return records, duplicates


def parse_grouped_stock(path: Path) -> tuple[list[dict], int]:
    records, seen, duplicates = [], set(), 0
    category, expect_category = "UNCLASSIFIED", False
    for values in rows(path):
        if values == ["Item Category"]:
            expect_category = True
            continue
        if expect_category and len(values) == 1:
            category = clean_text(values[0]).upper()
            expect_category = False
            continue
        if len(values) < 6 or values[0].lower() in {"itemcode", "code"}:
            continue
        qty, buy, stock_value = number(values[3]), number(values[4]), number(values[5])
        if qty is None or buy is None or stock_value is None:
            continue
        code = clean_text(values[0]).upper()
        if code in seen:
            duplicates += 1
            continue
        seen.add(code)
        records.append({
            "code": code,
            "name": clean_text(values[1]).upper(),
            "category": category,
            "reorder_level": number(values[2]) or 0,
            "quantity": qty,
            "buying_price": buy,
            "stock_value": stock_value,
        })
    return records, duplicates


def parse_vat(path: Path) -> tuple[list[dict], int]:
    records, seen, duplicates = [], set(), 0
    for values in rows(path):
        if len(values) < 4 or values[0].lower() == "code":
            continue
        buy, vat_rate = number(values[2]), number(values[3])
        if buy is None or vat_rate is None:
            continue
        code = clean_text(values[0]).upper()
        if code in seen:
            duplicates += 1
            continue
        seen.add(code)
        records.append({
            "code": code,
            "name": clean_text(values[1]).upper(),
            "vat_buying_price": buy,
            "vat_rate": vat_rate,
        })
    return records, duplicates


def parse_sales(path: Path) -> tuple[list[dict], int]:
    records, seen, duplicates = [], set(), 0
    cashier, pay_mode = "UNASSIGNED", "UNSPECIFIED"
    for values in rows(path):
        if len(values) >= 2 and values[0].lower() == "user a/c":
            cashier = clean_text(values[1]).upper()
            continue
        if len(values) >= 2 and values[0].lower() == "pay mode":
            pay_mode = clean_text(values[1]).upper()
            continue
        if len(values) < 6 or not DATE_RE.match(values[0]):
            continue
        amount = number(values[2])
        parsed = parse_date(values[0])
        if amount is None or parsed is None:
            continue
        sale_no = clean_text(values[1])
        key = (sale_no, pay_mode, cashier)
        if key in seen:
            duplicates += 1
            continue
        seen.add(key)
        records.append({
            "date": parsed.isoformat(),
            "sale_no": sale_no,
            "amount": amount,
            "reference_no": clean_text(values[3]),
            "department": clean_text(values[4]).upper(),
            "staff_reference": clean_text(values[5]).upper(),
            "cashier": cashier,
            "pay_mode": pay_mode,
        })
    return records, duplicates


def parse_purchases(path: Path) -> tuple[list[dict], int]:
    records, seen, duplicates = [], set(), 0
    current_date: date | None = None
    for values in rows(path):
        if len(values) >= 2 and values[0].lower() == "date" and DATE_RE.match(values[1]):
            current_date = parse_date(values[1])
            continue
        if len(values) < 5 or values[0].lower() in {"supplier", "no. of transactions"}:
            continue
        amount = number(values[2])
        if amount is None or current_date is None:
            continue
        reference = clean_text(values[3])
        supplier = clean_text(values[0]).upper()
        key = (current_date.isoformat(), supplier, reference, amount)
        if key in seen:
            duplicates += 1
            continue
        seen.add(key)
        records.append({
            "date": current_date.isoformat(),
            "supplier": supplier,
            "delivery_mode": clean_text(values[1]).upper(),
            "amount": amount,
            "purchase_reference": reference,
            "user_account": clean_text(values[4]).upper(),
        })
    return records, duplicates


def percentile(values: list[float], p: float) -> float:
    if not values:
        return 0
    ordered = sorted(values)
    index = (len(ordered) - 1) * p
    lower, upper = math.floor(index), math.ceil(index)
    if lower == upper:
        return ordered[lower]
    return ordered[lower] * (upper - index) + ordered[upper] * (index - lower)


def iqr_outliers(records: list[dict], field: str, label: str, limit: int = 8) -> list[dict]:
    values = [float(r[field]) for r in records if r.get(field) is not None]
    q1, q3 = percentile(values, 0.25), percentile(values, 0.75)
    threshold = q3 + 1.5 * (q3 - q1)
    outliers = [r for r in records if float(r.get(field) or 0) > threshold]
    outliers.sort(key=lambda r: float(r[field]), reverse=True)
    return [{"label": clean_text(r.get(label)), "value": rounded(r[field]), "threshold": rounded(threshold)} for r in outliers[:limit]]


def linear_forecast(monthly: list[dict], periods: int = 3) -> list[dict]:
    usable = monthly[-12:]
    if len(usable) < 3:
        return []
    ys = [float(point["amount"]) for point in usable]
    xs = list(range(len(ys)))
    xbar, ybar = statistics.mean(xs), statistics.mean(ys)
    denominator = sum((x - xbar) ** 2 for x in xs) or 1
    slope = sum((x - xbar) * (y - ybar) for x, y in zip(xs, ys)) / denominator
    intercept = ybar - slope * xbar
    last = datetime.strptime(usable[-1]["month"] + "-01", "%Y-%m-%d").date()
    result = []
    for offset in range(1, periods + 1):
        month_number = last.month + offset
        year = last.year + (month_number - 1) // 12
        month = (month_number - 1) % 12 + 1
        value = max(0, intercept + slope * (len(ys) - 1 + offset))
        result.append({"month": f"{year:04d}-{month:02d}", "amount": rounded(value)})
    return result


def write_csv(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not records:
        path.write_text("", encoding="utf-8")
        return
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(records[0]))
        writer.writeheader()
        writer.writerows(records)


def find_report(source: Path, needle: str) -> Path:
    matches = [p for p in source.glob("*.html") if needle.lower() in p.name.lower()]
    if not matches:
        raise FileNotFoundError(f"Could not find a report matching '{needle}' in {source}")
    return matches[0]


def build(source: Path, output: Path) -> dict:
    price_rows, price_dupes = parse_price_list(find_report(source, "PRICE LIST.htm"))
    stock_rows, stock_dupes = parse_grouped_stock(find_report(source, "GROUPED BY CATEGORY"))
    vat_rows, vat_dupes = parse_vat(find_report(source, "VATABLE"))
    sales_rows, sales_dupes = parse_sales(find_report(source, "SALES 1"))
    purchase_rows, purchase_dupes = parse_purchases(find_report(source, "PURCHASES FROM 2022"))

    price_by_code = {r["code"]: r for r in price_rows}
    stock_by_code = {r["code"]: r for r in stock_rows}
    vat_by_code = {r["code"]: r for r in vat_rows}
    codes = sorted(set(price_by_code) | set(stock_by_code) | set(vat_by_code))
    inventory = []
    for code in codes:
        price, stock, vat = price_by_code.get(code, {}), stock_by_code.get(code, {}), vat_by_code.get(code, {})
        qty = stock.get("quantity", price.get("quantity", 0)) or 0
        buying = stock.get("buying_price", price.get("buying_price", vat.get("vat_buying_price", 0))) or 0
        retail = price.get("retail_price", 0) or 0
        wholesale = price.get("wholesale_price", 0) or 0
        reorder = stock.get("reorder_level", price.get("reorder_level", 0)) or 0
        stock_value = stock.get("stock_value", qty * buying) or 0
        gross_profit = max(0, retail - buying)
        margin_pct = (gross_profit / retail * 100) if retail > 0 else 0
        inventory.append({
            "code": code,
            "name": stock.get("name") or price.get("name") or vat.get("name") or "UNNAMED ITEM",
            "category": stock.get("category", "UNCLASSIFIED"),
            "quantity": rounded(qty),
            "reorder_level": rounded(reorder),
            "buying_price": rounded(buying),
            "wholesale_price": rounded(wholesale),
            "retail_price": rounded(retail),
            "stock_value": rounded(stock_value),
            "potential_retail_value": rounded(max(qty, 0) * retail),
            "unit_gross_profit": rounded(gross_profit),
            "margin_pct": rounded(margin_pct, 1),
            "vat_rate": rounded(vat.get("vat_rate", 0), 1) if vat else None,
            "reorder_flag": qty <= reorder,
            "negative_stock_flag": qty < 0,
        })

    positive_stock = sorted([r for r in inventory if r["stock_value"] > 0], key=lambda r: r["stock_value"], reverse=True)
    total_stock_value = sum(r["stock_value"] for r in positive_stock)
    cumulative = 0.0
    abc_counts = Counter()
    for item in positive_stock:
        cumulative += item["stock_value"]
        share = cumulative / total_stock_value if total_stock_value else 0
        item["abc_class"] = "A" if share <= 0.80 else "B" if share <= 0.95 else "C"
        abc_counts[item["abc_class"]] += 1
    for item in inventory:
        item.setdefault("abc_class", "C")

    category_groups: dict[str, list[dict]] = defaultdict(list)
    for item in inventory:
        category_groups[item["category"]].append(item)
    categories = []
    for category, items in category_groups.items():
        value = sum(i["stock_value"] for i in items)
        potential = sum(i["potential_retail_value"] for i in items)
        categories.append({
            "category": category,
            "sku_count": len(items),
            "stock_value": rounded(value),
            "potential_retail_value": rounded(potential),
            "potential_gross_profit": rounded(max(0, potential - value)),
            "reorder_count": sum(bool(i["reorder_flag"]) for i in items),
            "negative_count": sum(bool(i["negative_stock_flag"]) for i in items),
        })
    categories.sort(key=lambda row: row["stock_value"], reverse=True)

    supplier_groups: dict[str, list[dict]] = defaultdict(list)
    for row in purchase_rows:
        supplier_groups[row["supplier"]].append(row)
    suppliers = [{
        "supplier": supplier,
        "spend": rounded(sum(r["amount"] for r in records)),
        "transactions": len(records),
        "average_order": rounded(statistics.mean(r["amount"] for r in records)),
    } for supplier, records in supplier_groups.items()]
    suppliers.sort(key=lambda row: row["spend"], reverse=True)

    monthly_groups: dict[str, list[float]] = defaultdict(list)
    for row in purchase_rows:
        monthly_groups[row["date"][:7]].append(row["amount"])
    monthly_purchases = [{"month": month, "amount": rounded(sum(amounts)), "transactions": len(amounts)} for month, amounts in sorted(monthly_groups.items())]

    pay_groups: dict[str, list[dict]] = defaultdict(list)
    for row in sales_rows:
        pay_groups[row["pay_mode"]].append(row)
    payment_modes = [{
        "mode": mode,
        "amount": rounded(sum(r["amount"] for r in records)),
        "transactions": len(records),
    } for mode, records in pay_groups.items()]
    payment_modes.sort(key=lambda row: row["amount"], reverse=True)

    sales_total = sum(r["amount"] for r in sales_rows)
    positive_sales = [r for r in sales_rows if r["amount"] > 0]
    purchase_total = sum(r["amount"] for r in purchase_rows)
    supplier_hhi = sum((s["spend"] / purchase_total) ** 2 for s in suppliers) * 10000 if purchase_total else 0
    reorder_items = [r for r in inventory if r["reorder_flag"]]
    negative_items = [r for r in inventory if r["negative_stock_flag"]]
    zero_stock_items = [r for r in inventory if r["quantity"] == 0]
    invalid_price_items = [r for r in inventory if r["retail_price"] and r["retail_price"] < r["buying_price"]]
    source_files = sorted(p.name for p in source.glob("*.html"))

    executive_insights = []
    if categories:
        top = categories[0]
        executive_insights.append({"tone": "opportunity", "title": "Capital concentration", "text": f"{top['category']} holds KSh {top['stock_value']:,.0f}, the largest category inventory position. Give it a weekly sell-through and aging review."})
    if suppliers:
        top = suppliers[0]
        share = top["spend"] / purchase_total * 100 if purchase_total else 0
        executive_insights.append({"tone": "risk", "title": "Supplier dependency", "text": f"{top['supplier']} represents {share:.1f}% of recorded purchasing. Benchmark lead time, pricing and alternatives before the next large order."})
    executive_insights.append({"tone": "action", "title": "Replenishment control", "text": f"{len(reorder_items):,} SKUs are at or below their configured reorder level; {len(negative_items):,} show negative stock and need immediate stock-count reconciliation."})
    executive_insights.append({"tone": "quality", "title": "Decision boundary", "text": "The sales export is a one-day payment summary, not item-level sales history. Revenue mix is reliable for that day; product demand, churn and sell-through require line-item sales exports."})

    snapshot = {
        "meta": {
            "company": "ST Light",
            "generated_at": datetime.now().astimezone().isoformat(timespec="seconds"),
            "source_directory": str(source),
            "source_files": source_files,
            "report_count": len(source_files),
            "sales_period": {"from": min((r["date"] for r in sales_rows), default=None), "to": max((r["date"] for r in sales_rows), default=None)},
            "purchase_period": {"from": min((r["date"] for r in purchase_rows), default=None), "to": max((r["date"] for r in purchase_rows), default=None)},
        },
        "kpis": {
            "sku_count": len(inventory),
            "stock_units": rounded(sum(max(0, r["quantity"]) for r in inventory)),
            "stock_value": rounded(total_stock_value),
            "potential_retail_value": rounded(sum(r["potential_retail_value"] for r in inventory)),
            "potential_gross_profit": rounded(sum(max(0, r["potential_retail_value"] - r["stock_value"]) for r in inventory)),
            "reorder_count": len(reorder_items),
            "negative_stock_count": len(negative_items),
            "zero_stock_count": len(zero_stock_items),
            "purchase_spend": rounded(purchase_total),
            "purchase_transactions": len(purchase_rows),
            "supplier_count": len(suppliers),
            "supplier_hhi": rounded(supplier_hhi),
            "sales_snapshot": rounded(sales_total),
            "sales_transactions": len(sales_rows),
            "average_positive_ticket": rounded(statistics.mean(r["amount"] for r in positive_sales)) if positive_sales else 0,
            "zero_value_sales": len(sales_rows) - len(positive_sales),
        },
        "quality": {
            "duplicate_rows_removed": price_dupes + stock_dupes + vat_dupes + sales_dupes + purchase_dupes,
            "duplicates_by_source": {"prices": price_dupes, "stock": stock_dupes, "vat": vat_dupes, "sales": sales_dupes, "purchases": purchase_dupes},
            "unclassified_skus": sum(r["category"] == "UNCLASSIFIED" for r in inventory),
            "missing_vat_skus": sum(r["vat_rate"] is None for r in inventory),
            "invalid_price_count": len(invalid_price_items),
            "negative_stock_count": len(negative_items),
            "coverage_score": rounded(100 * sum(bool(r["category"] != "UNCLASSIFIED" and r["buying_price"] >= 0 and r["retail_price"] >= 0) for r in inventory) / len(inventory), 1) if inventory else 0,
        },
        "categories": categories[:20],
        "suppliers": suppliers[:20],
        "monthly_purchases": monthly_purchases,
        "purchase_forecast": linear_forecast(monthly_purchases),
        "payment_modes": payment_modes,
        "abc": [{"class": key, "items": abc_counts[key]} for key in ["A", "B", "C"]],
        "top_inventory": [{key: item[key] for key in ["code", "name", "category", "quantity", "stock_value", "retail_price", "abc_class"]} for item in positive_stock[:15]],
        "reorder_watchlist": [{key: item[key] for key in ["code", "name", "category", "quantity", "reorder_level", "stock_value"]} for item in sorted(reorder_items, key=lambda r: (r["quantity"] - r["reorder_level"], -r["stock_value"]))[:15]],
        "anomalies": {
            "large_purchases": iqr_outliers(purchase_rows, "amount", "supplier"),
            "high_value_inventory": iqr_outliers(inventory, "stock_value", "name"),
        },
        "executive_insights": executive_insights,
        "methods": [
            {"name": "ETL & entity resolution", "detail": "Normalizes Windows-1252 HTML, numeric/currency fields, dates and product names; joins report domains on product code."},
            {"name": "Descriptive KPI mining", "detail": "Profiles inventory capital, pricing headroom, purchasing, payment mix and data quality."},
            {"name": "ABC / Pareto segmentation", "detail": "Classifies SKUs by cumulative inventory-value contribution (80/15/5 control bands)."},
            {"name": "Concentration analysis", "detail": "Calculates supplier spend share and the Herfindahl-Hirschman Index (HHI)."},
            {"name": "Anomaly detection", "detail": "Uses the interquartile-range rule to surface unusually large purchases and inventory positions."},
            {"name": "Time-series trend", "detail": "Aggregates purchasing monthly and produces a clearly labelled three-month linear baseline forecast."},
            {"name": "Rule-based risk mining", "detail": "Flags reorder breaches, zero/negative stock, price inversions and missing master-data coverage."},
        ],
    }

    output.mkdir(parents=True, exist_ok=True)
    write_csv(output / "inventory_clean.csv", inventory)
    write_csv(output / "purchases_clean.csv", purchase_rows)
    write_csv(output / "sales_clean.csv", sales_rows)
    (output / "insights.json").write_text(json.dumps(snapshot, indent=2, ensure_ascii=False), encoding="utf-8")
    return snapshot


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=Path(r"D:\Data"), help="Directory containing the HTML exports")
    parser.add_argument("--output", type=Path, default=Path("public/data"), help="Warehouse output directory")
    args = parser.parse_args()
    snapshot = build(args.source.resolve(), args.output.resolve())
    print(json.dumps({"status": "ok", "output": str(args.output.resolve()), "kpis": snapshot["kpis"], "quality": snapshot["quality"]}, indent=2))


if __name__ == "__main__":
    main()
