"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Database,
  FileCheck2,
  Gauge,
  Layers3,
  Menu,
  PackageSearch,
  Search,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  SunMedium,
  TrendingUp,
  Truck,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import data from "@/public/data/insights.json";
import styles from "./warehouse.module.css";

const nav = [
  ["Overview", Gauge],
  ["Inventory", Boxes],
  ["Procurement", Truck],
  ["Data quality", FileCheck2],
];

const money = (value) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
const integer = (value) => new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(value || 0);
const pct = (value) => `${Number(value || 0).toFixed(1)}%`;

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <span>{label}</span>
      <strong>{money(payload[0].value)}</strong>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, note, accent = false }) {
  return (
    <article className={`${styles.kpi} ${accent ? styles.kpiAccent : ""}`}>
      <div className={styles.kpiTop}><span className={styles.iconBox}><Icon size={17} /></span><span>LIVE MODEL</span></div>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className={styles.sectionTitle}>
      <div><span>{eyebrow}</span><h2>{title}</h2></div>
      {action}
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.code || row.supplier || row.label}-${index}`}>
              {columns.map((column) => <td key={column.key}>{column.render ? column.render(row[column.key], row) : row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PurchaseTrend() {
  const chartData = useMemo(() => {
    const actual = data.monthly_purchases.slice(-24).map((point) => ({ ...point, actual: point.amount }));
    const last = actual.at(-1);
    const forecast = data.purchase_forecast.map((point, index) => ({ ...point, forecast: point.amount, actual: index === 0 ? last?.amount : undefined }));
    return [...actual, ...forecast];
  }, []);
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <div><span>PROCUREMENT PULSE</span><h3>Monthly purchasing run-rate</h3></div>
        <div className={styles.legend}><i /> Actual <i className={styles.forecastDot} /> Baseline forecast</div>
      </div>
      <div className={styles.chartHeight}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 12, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="purchaseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c6f36b" stopOpacity={0.38} /><stop offset="100%" stopColor="#c6f36b" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid stroke="#ffffff0a" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#77807b", fontSize: 10 }} axisLine={false} tickLine={false} minTickGap={32} />
            <YAxis tickFormatter={(v) => `${Math.round(v / 1000000)}m`} tick={{ fill: "#77807b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<Tip />} />
            <Area type="monotone" dataKey="actual" stroke="#c6f36b" strokeWidth={2.5} fill="url(#purchaseFill)" connectNulls={false} />
            <Area type="monotone" dataKey="forecast" stroke="#9e87ff" strokeDasharray="5 5" strokeWidth={2} fill="transparent" connectNulls />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className={styles.chartNote}>Forecast is a directional linear baseline from the latest 12 monthly observations—not a purchasing commitment.</p>
    </div>
  );
}

function Overview() {
  const categoryData = data.categories.slice(0, 7).map((row) => ({ ...row, short: row.category.length > 13 ? `${row.category.slice(0, 12)}…` : row.category }));
  return (
    <>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}><Sparkles size={13} /> EXECUTIVE INTELLIGENCE</span>
          <h1>Your inventory is worth <em>{money(data.kpis.stock_value)}</em>.<br />Here’s where the leverage is.</h1>
          <p>A decision layer across {integer(data.kpis.sku_count)} SKUs, {integer(data.kpis.purchase_transactions)} purchases and {integer(data.kpis.sales_transactions)} payment records.</p>
        </div>
        <div className={styles.heroSignal}>
          <div className={styles.ring}><strong>{data.quality.coverage_score}%</strong><span>model coverage</span></div>
          <small><CheckCircle2 size={14} /> Refreshed from {data.meta.report_count} source reports</small>
        </div>
      </section>

      <section className={styles.kpiGrid}>
        <Kpi icon={Layers3} label="Inventory capital" value={money(data.kpis.stock_value)} note={`${integer(data.kpis.stock_units)} physical units recorded`} accent />
        <Kpi icon={TrendingUp} label="Retail value ceiling" value={money(data.kpis.potential_retail_value)} note={`${money(data.kpis.potential_gross_profit)} indicative gross-profit headroom`} />
        <Kpi icon={ShieldAlert} label="Reorder exposure" value={integer(data.kpis.reorder_count)} note={`${integer(data.kpis.negative_stock_count)} negative • ${integer(data.kpis.zero_stock_count)} at zero`} />
        <Kpi icon={ShoppingCart} label="Sales snapshot" value={money(data.kpis.sales_snapshot)} note={`${integer(data.kpis.sales_transactions)} records on 11 Jun 2026`} />
      </section>

      <section className={styles.insightSection}>
        <SectionTitle eyebrow="CEO BRIEF" title="Four decisions hiding in the data" />
        <div className={styles.insightGrid}>
          {data.executive_insights.map((insight, index) => (
            <article className={styles.insight} key={insight.title}>
              <span>0{index + 1}</span><div><small>{insight.tone}</small><h3>{insight.title}</h3><p>{insight.text}</p></div><ChevronRight size={18} />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.twoThirds}>
        <PurchaseTrend />
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}><div><span>TENDER MIX</span><h3>Payment modes</h3></div></div>
          <div className={styles.donutWrap}>
            <div className={styles.donut}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={data.payment_modes.slice(0, 6)} dataKey="amount" nameKey="mode" innerRadius={68} outerRadius={92} paddingAngle={2}>{["#c6f36b", "#9e87ff", "#45c6b5", "#f3ad5a", "#6886f5", "#e76e8b"].map((color) => <Cell key={color} fill={color} />)}</Pie><Tooltip formatter={(value) => money(value)} /></PieChart>
              </ResponsiveContainer>
              <div><strong>{money(data.kpis.sales_snapshot)}</strong><span>one-day total</span></div>
            </div>
            <div className={styles.modeList}>{data.payment_modes.slice(0, 5).map((mode, index) => <div key={mode.mode}><i style={{ background: ["#c6f36b", "#9e87ff", "#45c6b5", "#f3ad5a", "#6886f5"][index] }} /><span>{mode.mode}</span><strong>{pct(mode.amount / data.kpis.sales_snapshot * 100)}</strong></div>)}</div>
          </div>
        </div>
      </section>

      <section className={styles.fullCard}>
        <SectionTitle eyebrow="CAPITAL MAP" title="Categories carrying the balance sheet" action={<span className={styles.subtle}>Top 7 by buying value</span>} />
        <div className={styles.categoryChart}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ left: 5, right: 28 }}>
              <CartesianGrid stroke="#ffffff09" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="short" type="category" width={118} tick={{ fill: "#aab1ad", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="stock_value" fill="#c6f36b" radius={[0, 5, 5, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}

function Inventory() {
  const [query, setQuery] = useState("");
  const items = [...data.top_inventory, ...data.reorder_watchlist.filter((item) => !data.top_inventory.some((top) => top.code === item.code))];
  const filtered = items.filter((item) => `${item.code} ${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase()));
  const columns = [
    { key: "name", label: "Product", render: (v, row) => <div className={styles.productCell}><span>{v}</span><small>{row.code} · {row.category}</small></div> },
    { key: "abc_class", label: "Class", render: (v) => v ? <span className={styles.abc}>{v}</span> : "—" },
    { key: "quantity", label: "On hand", render: (v) => integer(v) },
    { key: "reorder_level", label: "Reorder", render: (v) => v === undefined ? "—" : integer(v) },
    { key: "stock_value", label: "Stock value", render: (v) => money(v) },
  ];
  return (
    <>
      <SectionTitle eyebrow="INVENTORY CONTROL" title="Turn stock into working capital" />
      <section className={styles.kpiGrid}>
        <Kpi icon={Boxes} label="Active catalogue" value={integer(data.kpis.sku_count)} note={`${data.abc[0].items} class-A value drivers`} accent />
        <Kpi icon={CircleDollarSign} label="Capital on shelves" value={money(data.kpis.stock_value)} note="Buying-price valuation" />
        <Kpi icon={AlertTriangle} label="At / below reorder" value={integer(data.kpis.reorder_count)} note={`${pct(data.kpis.reorder_count / data.kpis.sku_count * 100)} of the catalogue`} />
        <Kpi icon={PackageSearch} label="Count exceptions" value={integer(data.kpis.negative_stock_count)} note="Negative balances to reconcile" />
      </section>
      <section className={styles.fullCard}>
        <div className={styles.tableHeader}>
          <div><span>CONTROL TOWER</span><h3>High-value & reorder watchlist</h3></div>
          <label className={styles.search}><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search code or product" /></label>
        </div>
        <DataTable columns={columns} rows={filtered.slice(0, 24)} />
      </section>
      <section className={styles.fullCard}>
        <SectionTitle eyebrow="ABC SEGMENTATION" title="Focus control where value concentrates" />
        <div className={styles.abcGrid}>{data.abc.map((band, index) => <div key={band.class}><span className={styles.abcBig}>{band.class}</span><strong>{integer(band.items)} SKUs</strong><p>{["~80% of inventory value — count and review weekly.", "Next ~15% — review monthly and rationalise excess.", "Final ~5% — simplify, bundle or discontinue selectively."][index]}</p></div>)}</div>
      </section>
    </>
  );
}

function Procurement() {
  const supplierColumns = [
    { key: "supplier", label: "Supplier" },
    { key: "transactions", label: "Orders", render: integer },
    { key: "average_order", label: "Average order", render: money },
    { key: "spend", label: "Total spend", render: money },
  ];
  return (
    <>
      <SectionTitle eyebrow="PROCUREMENT" title="Spend intelligence, supplier leverage" />
      <section className={styles.kpiGrid}>
        <Kpi icon={CircleDollarSign} label="Recorded spend" value={money(data.kpis.purchase_spend)} note={`${data.meta.purchase_period.from} → ${data.meta.purchase_period.to}`} accent />
        <Kpi icon={Truck} label="Supplier base" value={integer(data.kpis.supplier_count)} note={`${integer(data.kpis.purchase_transactions)} purchase records`} />
        <Kpi icon={BarChart3} label="Concentration HHI" value={integer(data.kpis.supplier_hhi)} note="Below 1,500 is generally unconcentrated" />
        <Kpi icon={TrendingUp} label="Next-month baseline" value={money(data.purchase_forecast[0]?.amount)} note="Linear directional estimate" />
      </section>
      <PurchaseTrend />
      <section className={styles.twoCols}>
        <div className={styles.fullCard}><SectionTitle eyebrow="SUPPLIER POWER" title="Top partners by spend" /><DataTable columns={supplierColumns} rows={data.suppliers.slice(0, 10)} /></div>
        <div className={styles.fullCard}><SectionTitle eyebrow="ANOMALY QUEUE" title="Purchases outside the normal range" /><div className={styles.anomalyList}>{data.anomalies.large_purchases.map((row, index) => <div key={`${row.label}-${index}`}><span>{index + 1}</span><div><strong>{row.label}</strong><small>Above IQR threshold {money(row.threshold)}</small></div><b>{money(row.value)}</b></div>)}</div></div>
      </section>
    </>
  );
}

function Quality() {
  return (
    <>
      <SectionTitle eyebrow="TRUST LAYER" title="Know what the model knows" />
      <section className={styles.qualityHero}>
        <div className={styles.score}><span>{data.quality.coverage_score}</span><small>/ 100</small></div>
        <div><span className={styles.eyebrow}><CheckCircle2 size={13} /> READY FOR DECISION SUPPORT</span><h2>Strong master-data coverage.<br />Transaction depth is the next unlock.</h2><p>Product, stock, price, category and VAT data reconcile cleanly. Item-level sales history is still required for demand forecasting, true margin and dead-stock aging.</p></div>
      </section>
      <section className={styles.kpiGrid}>
        <Kpi icon={Database} label="Rows de-duplicated" value={integer(data.quality.duplicate_rows_removed)} note="Across source report overlaps" accent />
        <Kpi icon={ShieldAlert} label="Price inversions" value={integer(data.quality.invalid_price_count)} note="Retail below buying price" />
        <Kpi icon={Boxes} label="Negative balances" value={integer(data.quality.negative_stock_count)} note="Physical count candidates" />
        <Kpi icon={FileCheck2} label="Unclassified SKUs" value={integer(data.quality.unclassified_skus)} note="Category join coverage" />
      </section>
      <section className={styles.twoCols}>
        <div className={styles.fullCard}><SectionTitle eyebrow="MINING PLAYBOOK" title="Techniques applied" /><div className={styles.methodList}>{data.methods.map((method, index) => <div key={method.name}><span>0{index + 1}</span><div><strong>{method.name}</strong><p>{method.detail}</p></div></div>)}</div></div>
        <div className={styles.fullCard}><SectionTitle eyebrow="LINEAGE" title="Warehouse source map" /><div className={styles.lineage}><div className={styles.lineNode}><Database size={20} /><span>D:\Data</span><small>{data.meta.report_count} legacy HTML reports</small></div><ArrowRight /><div className={styles.lineNode}><Sparkles size={20} /><span>Clean model</span><small>3 analysis-ready tables</small></div><ArrowRight /><div className={styles.lineNode}><Gauge size={20} /><span>Decision layer</span><small>KPIs, risks & forecasts</small></div></div><div className={styles.sourceList}>{data.meta.source_files.map((file) => <div key={file}><FileCheck2 size={14} /><span>{file}</span><CheckCircle2 size={14} /></div>)}</div></div>
      </section>
    </>
  );
}

export default function WarehousePage() {
  const [active, setActive] = useState("Overview");
  const [open, setOpen] = useState(false);
  const views = { Overview: <Overview />, Inventory: <Inventory />, Procurement: <Procurement />, "Data quality": <Quality /> };
  return (
    <div className={styles.app}>
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}><span><SunMedium size={20} /></span><div><strong>ST LIGHT</strong><small>INTELLIGENCE</small></div><button aria-label="Close navigation" onClick={() => setOpen(false)}><X size={18} /></button></div>
        <div className={styles.workspace}><small>WORKSPACE</small><strong>CEO Decision Room</strong><span><i /> Live snapshot</span></div>
        <nav>{nav.map(([label, Icon]) => <button key={label} className={active === label ? styles.active : ""} onClick={() => { setActive(label); setOpen(false); }}><Icon size={18} /><span>{label}</span>{active === label && <ChevronRight size={15} />}</button>)}</nav>
        <div className={styles.downloads}><small>CLEAN DATA</small><a href="/data/inventory_clean.csv" download><ArrowDownToLine size={15} /> Inventory CSV</a><a href="/data/purchases_clean.csv" download><ArrowDownToLine size={15} /> Purchases CSV</a><a href="/data/sales_clean.csv" download><ArrowDownToLine size={15} /> Sales CSV</a></div>
        <div className={styles.sideFooter}><Database size={16} /><div><span>{integer(data.kpis.sku_count)} SKUs indexed</span><small>Local data • never uploaded</small></div></div>
      </aside>
      <main className={styles.main}>
        <header className={styles.topbar}>
          <button aria-label="Open navigation" className={styles.menuButton} onClick={() => setOpen(true)}><Menu size={20} /></button>
          <div><span>ST LIGHT /</span> {active.toUpperCase()}</div>
          <div className={styles.topActions}><span><i /> MODEL CURRENT</span><small>Built {new Date(data.meta.generated_at).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}</small><Link href="/">Company site <ArrowRight size={14} /></Link></div>
        </header>
        <div className={styles.content}>{views[active]}</div>
      </main>
    </div>
  );
}
