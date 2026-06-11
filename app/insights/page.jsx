"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BatteryCharging,
  BrainCircuit,
  Building2,
  CircleDollarSign,
  Clock3,
  Cpu,
  Gauge,
  Globe2,
  HeartPulse,
  Layers3,
  LineChart as LineChartIcon,
  MapPin,
  PackageCheck,
  Radar as RadarIcon,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import SiteShell from "@/components/SiteShell";

const orange = "#F97316";
const orangeSoft = "#FDBA74";
const green = "#22C55E";
const red = "#EF4444";
const blue = "#38BDF8";
const purple = "#A78BFA";

const months = [
  { month: "Jan", revenue: 8.2, forecast: 8.4, orders: 132, battery: 28, solar: 44, cctv: 18 },
  { month: "Feb", revenue: 9.1, forecast: 9.2, orders: 141, battery: 30, solar: 48, cctv: 20 },
  { month: "Mar", revenue: 10.4, forecast: 10.2, orders: 158, battery: 38, solar: 52, cctv: 22 },
  { month: "Apr", revenue: 11.8, forecast: 11.5, orders: 176, battery: 46, solar: 58, cctv: 25 },
  { month: "May", revenue: 12.7, forecast: 12.4, orders: 189, battery: 51, solar: 63, cctv: 27 },
  { month: "Jun", revenue: 13.9, forecast: 13.7, orders: 207, battery: 58, solar: 67, cctv: 32 },
  { month: "Jul", revenue: 15.4, forecast: 15.1, orders: 231, battery: 64, solar: 73, cctv: 36 },
  { month: "Aug", revenue: 14.8, forecast: 15.2, orders: 218, battery: 61, solar: 70, cctv: 35 },
  { month: "Sep", revenue: 16.2, forecast: 16.4, orders: 247, battery: 68, solar: 76, cctv: 39 },
  { month: "Oct", revenue: 17.5, forecast: 17.3, orders: 263, battery: 73, solar: 84, cctv: 42 },
  { month: "Nov", revenue: 18.9, forecast: 18.4, orders: 281, battery: 79, solar: 89, cctv: 45 },
  { month: "Dec", revenue: 21.4, forecast: 20.7, orders: 316, battery: 88, solar: 102, cctv: 51 }
];

const forecast = [
  { month: "Jan", actual: 21.4, lower: 20.1, predicted: 22.2, upper: 24.1 },
  { month: "Feb", lower: 20.8, predicted: 23.5, upper: 25.8 },
  { month: "Mar", lower: 21.4, predicted: 24.8, upper: 27.9 },
  { month: "Apr", lower: 22.6, predicted: 26.2, upper: 29.5 },
  { month: "May", lower: 23.9, predicted: 27.6, upper: 31.4 },
  { month: "Jun", lower: 25.4, predicted: 29.1, upper: 33.2 },
  { month: "Jul", lower: 26.8, predicted: 31.5, upper: 35.9 },
  { month: "Aug", lower: 27.2, predicted: 32.1, upper: 36.6 },
  { month: "Sep", lower: 28.1, predicted: 33.8, upper: 38.2 },
  { month: "Oct", lower: 29.4, predicted: 35.6, upper: 40.5 },
  { month: "Nov", lower: 31.2, predicted: 37.8, upper: 43.1 },
  { month: "Dec", lower: 33.6, predicted: 41.4, upper: 47.5 }
];

const categoryRevenue = [
  { name: "Solar Panels", value: 34 },
  { name: "Batteries", value: 27 },
  { name: "Inverters", value: 18 },
  { name: "CCTV", value: 13 },
  { name: "Lighting", value: 8 }
];

const regionRevenue = [
  { region: "Nairobi", revenue: 42, installs: 520 },
  { region: "Mombasa", revenue: 24, installs: 286 },
  { region: "Kisumu", revenue: 18, installs: 214 },
  { region: "Nakuru", revenue: 16, installs: 198 },
  { region: "Eldoret", revenue: 12, installs: 151 },
  { region: "Machakos", revenue: 9, installs: 119 }
];

const rankedProducts = [
  ["Lithium Battery 5kWh", "KSh 38.6M", "+24%"],
  ["540W Mono Solar Panel", "KSh 32.1M", "+18%"],
  ["Hybrid Inverter 5kVA", "KSh 24.8M", "+11%"],
  ["AI CCTV Camera Kit", "KSh 18.3M", "+31%"],
  ["Solar Street Light", "KSh 13.7M", "+9%"]
];

const packages = [
  { subject: "Home Backup", A: 88 },
  { subject: "Business Hybrid", A: 76 },
  { subject: "School Solar", A: 64 },
  { subject: "CCTV Bundle", A: 72 },
  { subject: "Street Lighting", A: 58 },
  { subject: "Commercial Grid-Tie", A: 91 }
];

const segments = [
  { name: "Homeowners", value: 44, color: orange },
  { name: "Businesses", value: 28, color: blue },
  { name: "Schools", value: 15, color: purple },
  { name: "Contractors", value: 13, color: orangeSoft }
];

const trafficSources = [
  { source: "Organic Search", visitors: 18300 },
  { source: "WhatsApp", visitors: 12100 },
  { source: "Paid Ads", visitors: 9200 },
  { source: "Referrals", visitors: 7600 },
  { source: "Direct", visitors: 6100 }
];

const funnelData = [
  { name: "Visitors", value: 54800, fill: "rgba(249,115,22,0.95)" },
  { name: "Product Views", value: 21800, fill: "rgba(253,186,116,0.85)" },
  { name: "Quote Requests", value: 4200, fill: "rgba(56,189,248,0.85)" },
  { name: "Sales", value: 980, fill: "rgba(34,197,94,0.9)" }
];

const pipeline = [
  ["New Lead", 612, 100],
  ["Qualified", 438, 72],
  ["Proposal Sent", 241, 39],
  ["Negotiation", 126, 21],
  ["Won", 78, 13]
];

const inventory = [
  { item: "Batteries", stock: 18, demand: 92, value: 14.2 },
  { item: "Panels", stock: 64, demand: 84, value: 18.8 },
  { item: "Inverters", stock: 29, demand: 68, value: 9.4 },
  { item: "CCTV Kits", stock: 47, demand: 76, value: 7.1 },
  { item: "Lighting", stock: 83, demand: 52, value: 5.6 }
];

const counties = [
  { county: "Nairobi", x: 50, y: 58, revenue: "KSh 42M", density: 94, installs: 520 },
  { county: "Mombasa", x: 76, y: 82, revenue: "KSh 24M", density: 72, installs: 286 },
  { county: "Kisumu", x: 20, y: 55, revenue: "KSh 18M", density: 61, installs: 214 },
  { county: "Nakuru", x: 41, y: 44, revenue: "KSh 16M", density: 58, installs: 198 },
  { county: "Eldoret", x: 32, y: 28, revenue: "KSh 12M", density: 42, installs: 151 },
  { county: "Machakos", x: 59, y: 64, revenue: "KSh 9M", density: 36, installs: 119 }
];

const sentiment = [
  { name: "Positive", value: 78, fill: green },
  { name: "Neutral", value: 15, fill: orangeSoft },
  { name: "Negative", value: 7, fill: red }
];

const topics = [
  ["Installation Speed", 94],
  ["Product Quality", 87],
  ["Customer Service", 81],
  ["Pricing", 62],
  ["Technical Support", 58],
  ["Battery Backup", 54],
  ["WhatsApp Response", 48],
  ["Warranty", 42]
];

const aiInsights = [
  "Revenue from commercial customers increased 18% this quarter.",
  "Battery sales show strong growth in Nairobi and Mombasa.",
  "Customers frequently mention installation speed as a competitive advantage.",
  "Quote requests are highest between 8AM and 11AM.",
  "CCTV products have the highest conversion rate."
];

function Card({ children, className = "" }) {
  return <div className={`glass rounded-[1.65rem] p-5 ${className}`}>{children}</div>;
}

function Section({ eyebrow, title, children, action }) {
  return (
    <section className="mx-auto w-[min(1420px,calc(100%-32px))] py-8">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-orange-glow">{eyebrow}</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-white md:text-4xl">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ChartFrame({ title, icon: Icon, children, className = "" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className={className}>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-energy/15 text-orange-glow">
            <Icon size={19} />
          </span>
          <h3 className="font-heading text-lg font-semibold">{title}</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-mist">Live model</span>
      </div>
      <div className="h-72 min-h-72 min-w-0">
        {mounted ? (
          children
        ) : (
          <div className="h-full animate-pulse rounded-[1.2rem] border border-white/10 bg-white/[0.04]" />
        )}
      </div>
    </Card>
  );
}

function LoadingLayer({ active }) {
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-night/95 backdrop-blur-xl">
      <div className="text-center">
        <div className="mx-auto mb-5 h-16 w-16 animate-spin rounded-full border border-orange-energy/20 border-t-orange-energy" />
        <p className="font-heading text-2xl font-semibold">Calibrating Insights Center</p>
        <p className="mt-2 text-sm text-mist">Synthesizing fictional ST Light intelligence layers</p>
      </div>
    </div>
  );
}

function ExecutiveOverview() {
  const kpis = [
    ["Total Revenue", "KSh 168.3M", "+12%", CircleDollarSign, true],
    ["Monthly Revenue Growth", "18.4%", "+8%", TrendingUp, true],
    ["Total Orders", "2,659", "-3%", ShoppingCart, false],
    ["Average Order Value", "KSh 63,300", "+14%", Gauge, true],
    ["New Leads", "612", "+21%", Users, true],
    ["Conversion Rate", "16.8%", "+5%", Activity, true],
    ["Satisfaction Score", "94/100", "+6%", HeartPulse, true],
    ["Website Traffic", "54.8K", "+28%", Globe2, true]
  ];

  return (
    <Section eyebrow="Executive Overview" title="ST Light Performance Command Center">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value, trend, Icon, positive], index) => (
          <motion.div key={label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.045 }}>
            <Card className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-orange-energy/15 blur-2xl" />
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-orange-glow">
                  <Icon size={21} />
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${positive ? "bg-green-500/12 text-green-300" : "bg-red-500/12 text-red-300"}`}>
                  {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
                </span>
              </div>
              <p className="mt-7 text-sm text-mist">{label}</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{value}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function RevenueAnalytics() {
  return (
    <Section eyebrow="Revenue Analytics" title="Revenue, Category, Region, And Forecast Intelligence">
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartFrame title="Revenue by Month" icon={LineChartIcon}>
          <ResponsiveContainer>
            <AreaChart data={months}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={orange} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={orange} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Area dataKey="revenue" type="monotone" stroke={orange} fill="url(#revenueGradient)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame title="Revenue by Product Category" icon={BarChart3}>
          <ResponsiveContainer>
            <BarChart data={categoryRevenue}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                {categoryRevenue.map((entry, index) => <Cell key={entry.name} fill={[orange, orangeSoft, blue, purple, green][index]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame title="Revenue by Region" icon={MapPin}>
          <ResponsiveContainer>
            <BarChart data={regionRevenue} layout="vertical">
              <CartesianGrid stroke="rgba(255,255,255,0.07)" horizontal={false} />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="region" type="category" stroke="#9CA3AF" width={80} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Bar dataKey="revenue" fill={orange} radius={[0, 12, 12, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame title="Revenue Forecast Next 12 Months" icon={BrainCircuit}>
          <ResponsiveContainer>
            <ComposedChart data={forecast}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Area dataKey="upper" fill={orange} stroke="none" fillOpacity={0.08} />
              <Area dataKey="lower" fill="#0A0A0A" stroke="none" fillOpacity={0.8} />
              <Line dataKey="predicted" stroke={orangeSoft} strokeWidth={3} dot={false} />
              <Line dataKey="actual" stroke={green} strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
    </Section>
  );
}

function SalesIntelligence() {
  const heat = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <Section eyebrow="Sales Intelligence" title="Product Momentum And Demand Signals">
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <h3 className="font-heading text-xl font-semibold">Top Selling Products</h3>
          <div className="mt-5 grid gap-3">
            {rankedProducts.map(([name, value, trend], index) => (
              <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-energy/15 text-sm font-bold text-orange-glow">{index + 1}</span>
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-mist">Fictional trailing 90-day sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading text-lg font-semibold">{value}</p>
                  <p className="text-sm text-green-300">{trend}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <ChartFrame title="Most Requested Solar Packages" icon={RadarIcon}>
          <ResponsiveContainer>
            <RadarChart data={packages}>
              <PolarGrid stroke="rgba(255,255,255,0.12)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <Radar dataKey="A" stroke={orange} fill={orange} fillOpacity={0.28} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartFrame>

        <Card className="xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-heading text-xl font-semibold">Seasonal Demand Heatmap</h3>
            <span className="text-sm text-mist">Darker cells indicate stronger demand</span>
          </div>
          <div className="grid grid-cols-6 gap-2 md:grid-cols-12">
            {heat.map((month, index) => (
              <div key={month} className="rounded-2xl p-4 text-center" style={{ background: `rgba(249,115,22,${0.14 + index * 0.045})` }}>
                <p className="text-xs text-white/70">{month}</p>
                <p className="mt-2 font-heading text-xl font-semibold">{62 + index * 4}%</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function CustomerIntelligence() {
  return (
    <Section eyebrow="Customer Intelligence" title="Segments, Value, Sources, And Personas">
      <div className="grid gap-5 xl:grid-cols-3">
        <ChartFrame title="New vs Returning Customers" icon={Users}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={[{ name: "New", value: 62 }, { name: "Returning", value: 38 }]} innerRadius={68} outerRadius={100} paddingAngle={8} dataKey="value">
                <Cell fill={orange} />
                <Cell fill={blue} />
              </Pie>
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame title="Customer Segments" icon={Building2}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={segments} dataKey="value" outerRadius={104} label>
                {segments.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartFrame>

        <Card>
          <h3 className="font-heading text-xl font-semibold">Customer Personas</h3>
          <div className="mt-5 grid gap-3">
            {segments.map((segment) => (
              <div key={segment.name} className="rounded-2xl bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{segment.name}</p>
                  <p className="font-heading text-xl font-semibold text-orange-glow">{segment.value}%</p>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/8">
                  <div className="h-2 rounded-full" style={{ width: `${segment.value}%`, background: segment.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function WebsiteAnalytics() {
  return (
    <Section eyebrow="Website Analytics" title="Digital Journey And Conversion Intelligence">
      <div className="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
        <ChartFrame title="Traffic Sources" icon={Globe2}>
          <ResponsiveContainer>
            <BarChart data={trafficSources}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="source" stroke="#9CA3AF" tick={{ fontSize: 10 }} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Bar dataKey="visitors" fill={orange} radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFrame>

        <ChartFrame title="Conversion Funnel" icon={Layers3}>
          <ResponsiveContainer>
            <FunnelChart>
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Funnel dataKey="value" data={funnelData} isAnimationActive />
            </FunnelChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-4">
        {["Home", "Products", "Projects", "Quote Form"].map((page, index) => (
          <Card key={page}>
            <p className="text-sm text-mist">Most Viewed Page</p>
            <p className="mt-2 font-heading text-2xl font-semibold">{page}</p>
            <p className="mt-4 text-sm text-orange-glow">{[18400, 13900, 9200, 4100][index].toLocaleString()} visits</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function LeadDashboard() {
  return (
    <Section eyebrow="Lead Generation" title="Pipeline Velocity And Source Quality">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h3 className="font-heading text-xl font-semibold">Lead Pipeline Stages</h3>
          <div className="mt-6 grid gap-4">
            {pipeline.map(([stage, count, width]) => (
              <div key={stage}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{stage}</span>
                  <span className="text-mist">{count} leads</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-white/8">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${width}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="h-full rounded-full bg-orange-energy" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <ChartFrame title="Leads by Source" icon={Zap}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={[{ name: "WhatsApp", value: 36 }, { name: "Website", value: 31 }, { name: "Referrals", value: 21 }, { name: "Ads", value: 12 }]} dataKey="value" innerRadius={55} outerRadius={105} paddingAngle={5}>
                {[orange, blue, green, purple].map((color) => <Cell key={color} fill={color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
    </Section>
  );
}

function InventoryIntelligence() {
  return (
    <Section eyebrow="Inventory Intelligence" title="Stock Health, Risk, And Supplier Readiness">
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartFrame title="Inventory Demand vs Stock" icon={PackageCheck}>
          <ResponsiveContainer>
            <ComposedChart data={inventory}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="item" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Bar dataKey="stock" fill={blue} radius={[10, 10, 0, 0]} />
              <Line dataKey="demand" stroke={orange} strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartFrame>
        <Card>
          <h3 className="font-heading text-xl font-semibold">Low Stock And Overstock Risk</h3>
          <div className="mt-5 grid gap-3">
            {inventory.map((item) => (
              <div key={item.item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{item.item}</p>
                  <span className={`rounded-full px-3 py-1 text-xs ${item.stock < 30 ? "bg-red-500/15 text-red-300" : item.stock > 75 ? "bg-amber-500/15 text-amber-200" : "bg-green-500/15 text-green-300"}`}>
                    {item.stock < 30 ? "Low stock" : item.stock > 75 ? "Overstock watch" : "Healthy"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-mist">Inventory value: KSh {item.value}M</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function GeographicIntelligence() {
  const [active, setActive] = useState(counties[0]);
  return (
    <Section eyebrow="Geographic Intelligence" title="Kenya Regional Performance Model">
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="relative min-h-[520px] overflow-hidden">
          <div className="absolute inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.15),transparent_62%)]" />
          <svg viewBox="0 0 100 100" className="relative h-[460px] w-full">
            <path d="M44 8 L61 13 L72 28 L83 45 L78 68 L63 89 L42 94 L26 79 L15 60 L20 36 L31 18 Z" fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
            {counties.map((county) => (
              <g key={county.county} onMouseEnter={() => setActive(county)} className="cursor-pointer">
                <circle cx={county.x} cy={county.y} r={5 + county.density / 18} fill="rgba(249,115,22,0.18)" />
                <circle cx={county.x} cy={county.y} r="3.2" fill={active.county === county.county ? orangeSoft : orange} />
                <text x={county.x + 4} y={county.y - 3} fill="white" fontSize="3.2">{county.county}</text>
              </g>
            ))}
          </svg>
        </Card>
        <Card>
          <p className="text-sm text-mist">Selected county</p>
          <h3 className="mt-2 font-heading text-5xl font-semibold">{active.county}</h3>
          <div className="mt-8 grid gap-4">
            {[
              ["Revenue", active.revenue],
              ["Installations", active.installs],
              ["Customer Density", `${active.density}%`],
              ["Service Requests", Math.round(active.installs * 0.18)]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-sm text-mist">{label}</p>
                <p className="mt-1 font-heading text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function FeedbackIntelligence() {
  return (
    <Section eyebrow="Customer Feedback Intelligence" title="AI-Powered Sentiment, Topics, And Review Signals">
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <ChartFrame title="Sentiment Analysis" icon={HeartPulse}>
          <ResponsiveContainer>
            <RadialBarChart innerRadius="28%" outerRadius="100%" data={sentiment} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={16} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartFrame>
        <Card>
          <h3 className="font-heading text-xl font-semibold">Most Mentioned Topics</h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {topics.map(([topic, score]) => (
              <span key={topic} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-3" style={{ fontSize: `${12 + score / 14}px`, color: score > 80 ? orangeSoft : "rgba(255,255,255,0.72)" }}>
                {topic}
              </span>
            ))}
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {sentiment.map((item) => (
              <div key={item.name} className="rounded-2xl bg-white/[0.04] p-4">
                <p className="text-sm text-mist">{item.name}</p>
                <p className="mt-1 font-heading text-3xl font-semibold" style={{ color: item.fill }}>{item.value}%</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function AIInsights() {
  return (
    <Section eyebrow="AI Insights Panel" title="AI Business Recommendations">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {aiInsights.map((insight, index) => (
          <motion.div key={insight} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
            <Card className="relative h-full overflow-hidden">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-orange-energy/15 blur-2xl" />
              <BrainCircuit className="text-orange-glow" size={28} />
              <p className="mt-8 text-lg leading-7 text-white/86">{insight}</p>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-mist">Recommendation {index + 1}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function PredictiveAnalytics() {
  return (
    <Section eyebrow="Predictive Analytics" title="Forecast Models With Confidence Intervals">
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartFrame title="Revenue Forecast" icon={TrendingUp}>
          <ResponsiveContainer>
            <LineChart data={forecast}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Line dataKey="upper" stroke="rgba(249,115,22,0.25)" strokeWidth={2} dot={false} />
              <Line dataKey="predicted" stroke={orange} strokeWidth={3} dot={false} />
              <Line dataKey="lower" stroke="rgba(249,115,22,0.25)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartFrame>
        <ChartFrame title="Demand Forecast by Product" icon={BatteryCharging}>
          <ResponsiveContainer>
            <AreaChart data={months}>
              <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 }} />
              <Area dataKey="solar" stackId="1" stroke={orange} fill={orange} fillOpacity={0.35} />
              <Area dataKey="battery" stackId="1" stroke={blue} fill={blue} fillOpacity={0.28} />
              <Area dataKey="cctv" stackId="1" stroke={purple} fill={purple} fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartFrame>
      </div>
    </Section>
  );
}

function ExecutiveSummary() {
  return (
    <section className="mx-auto w-[min(1420px,calc(100%-32px))] pb-20 pt-8">
      <Card className="relative overflow-hidden p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.18),transparent_28rem)]" />
        <div className="relative grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-glow">Executive Summary</p>
            <h2 className="mt-4 font-heading text-5xl font-semibold md:text-6xl">Business Health Score</h2>
            <div className="mt-8 inline-flex items-end gap-2">
              <span className="font-heading text-8xl font-semibold text-orange-glow">87</span>
              <span className="pb-4 text-2xl text-mist">/100</span>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Strengths", ["Strong customer satisfaction", "Growing commercial segment", "High repeat customer rate"], BadgeCheck],
              ["Risks", ["Inventory shortages in battery category", "Declining conversion rate from paid ads"], AlertTriangle],
              ["Opportunities", ["Expand commercial solar offerings", "Increase inventory in high-demand products"], Sparkles]
            ].map(([title, items, Icon]) => (
              <div key={title} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                <Icon className="text-orange-glow" />
                <h3 className="mt-5 font-heading text-2xl font-semibold">{title}</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/72">
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}

export default function InsightsPage() {
  const [loading, setLoading] = useState(true);
  const timestamp = useMemo(() => new Date().toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" }), []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SiteShell>
      <LoadingLayer active={loading} />
      <section className="relative overflow-hidden px-6 pb-10 pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(249,115,22,0.24),transparent_30rem),radial-gradient(circle_at_78%_8%,rgba(56,189,248,0.10),transparent_22rem)]" />
        <div className="relative mx-auto w-[min(1420px,100%)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/78 backdrop-blur-xl">
                <Cpu size={16} className="text-orange-glow" /> Prototype intelligence layer
              </div>
              <h1 className="font-heading text-5xl font-semibold tracking-tight md:text-7xl">Insights Center</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-mist">
                A fictional executive BI command center showing how ST Light could unify website behavior, sales channels, customer inquiries, inventory, marketing, and AI analytics into one decision platform.
              </p>
            </div>
            <Card className="min-w-[280px]">
              <p className="text-sm text-mist">Board-ready snapshot</p>
              <p className="mt-2 font-heading text-2xl font-semibold">{timestamp}</p>
              <p className="mt-4 text-sm text-orange-glow">All data is fictional for prototype presentation.</p>
            </Card>
          </div>
        </div>
      </section>

      <ExecutiveOverview />
      <RevenueAnalytics />
      <SalesIntelligence />
      <CustomerIntelligence />
      <WebsiteAnalytics />
      <LeadDashboard />
      <InventoryIntelligence />
      <GeographicIntelligence />
      <FeedbackIntelligence />
      <AIInsights />
      <PredictiveAnalytics />
      <ExecutiveSummary />
    </SiteShell>
  );
}
