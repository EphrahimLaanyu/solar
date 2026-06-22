# ST Light Intelligence Warehouse

A local-first analytics warehouse that converts ST Light's legacy HTML reports into clean, analysis-ready data and an executive React dashboard.

## Run it

```powershell
python scripts\build_warehouse.py --source "D:\Data"
npm run dev
```

Open [http://localhost:3000/warehouse](http://localhost:3000/warehouse).

The refresh command reads the required reports from `D:\Data`, then generates:

- `public/data/inventory_clean.csv`
- `public/data/purchases_clean.csv`
- `public/data/sales_clean.csv`
- `public/data/insights.json`

No company data is uploaded. The full pipeline runs locally.

## What the model does

- Cleans legacy Windows-1252 HTML and normalizes dates, currency, names, codes, and blank values.
- Resolves inventory, category, price, VAT, purchasing, and sales/payment entities.
- Removes duplicate transactions and reports source-specific quality exceptions.
- Calculates inventory capital, retail-value ceiling, reorder exposure, payment mix, supplier concentration, ABC/Pareto classes, IQR anomalies, and a three-month purchasing baseline.
- Exposes the cleaned tables as downloadable CSV files from the dashboard.

## Important decision boundary

The supplied sales report covers one day and contains payment summaries rather than product line items. It supports that day's tender mix and ticket analysis, but it cannot honestly support product demand, customer churn, stock aging, or realized gross-margin analysis. Add item-level sales exports with transaction date, product code, quantity, unit price, discount, cost, and customer/account ID to unlock those models.

## CEO conversation starter

Use the dashboard as evidence of an operating system, not just a portfolio piece:

> I converted nine disconnected operational exports into a repeatable local data pipeline and decision dashboard. It already exposes inventory capital concentration, reorder exceptions, supplier dependency, pricing anomalies, and data-quality gaps. With access to item-level sales, I would extend it into demand forecasting, sell-through, dead-stock aging, and purchasing recommendations.

That framing makes the business value, the current evidence, and the next 90-day opportunity explicit without overstating what the data can prove.
