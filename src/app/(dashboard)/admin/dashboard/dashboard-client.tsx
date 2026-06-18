"use client";

import {
  IndianRupee,
  Users,
  ShoppingBag,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";

/* ─── types ───────────────────────────────────────────────────── */
interface Stats {
  revenue: number;
  users: number;
  orders: number;
  pending: number;
}

interface ChartPoint {
  name: string;
  sales: number;
}

interface Activity {
  id: string;
  userName: string;
  amount: number;
  status: string;
  createdAt: string;
}

/* ─── status config ───────────────────────────────────────────── */
const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  DELIVERED: {
    label: "Delivered",
    className: "text-emerald-700 bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 size={10} />,
  },
  PENDING: {
    label: "Pending",
    className: "text-zinc-600 bg-zinc-50 border-zinc-200",
    icon: <Loader2 size={10} />,
  },
  PROCESSING: {
    label: "Processing",
    className: "text-blue-700 bg-blue-50 border-blue-200",
    icon: <Clock size={10} />,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "text-red-600 bg-red-50 border-red-200",
    icon: <XCircle size={10} />,
  },
};

/* ─── custom tooltip ──────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl border border-zinc-100 bg-white px-4 py-3 shadow-xl"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-1">
        {label}
      </p>
      <p className="text-sm font-black text-zinc-900">
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

/* ─── main component ──────────────────────────────────────────── */
export default function AdminDashboardClient({
  stats,
  chartData,
  recentActivity,
}: {
  stats: Stats;
  chartData: ChartPoint[];
  recentActivity: Activity[];
}) {
  const weekTotal = chartData.reduce((a, b) => a + b.sales, 0);

  return (
    <div
      className="space-y-7"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Page header ── */}
      
      <PageHeader subtitle="Admin Console" title="Dashboard" description="Platform overview — live stats and recent activity."/>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<IndianRupee size={17} strokeWidth={2} />}
          label="Total Revenue"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          sub="From delivered orders"
          iconClass="bg-zinc-100 text-zinc-500"
        />
        <StatCard
          icon={<Users size={17} strokeWidth={2} />}
          label="Registered Users"
          value={stats.users.toLocaleString("en-IN")}
          sub="Distributors & customers"
          iconClass="bg-zinc-100 text-zinc-500"
        />
        <StatCard
          icon={<ShoppingBag size={17} strokeWidth={2} />}
          label="Orders Today"
          value={stats.orders.toString()}
          sub="Since midnight"
          iconClass="bg-zinc-100 text-zinc-500"
        />
        {/* KYC pending — emerald warning */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-900 p-6 shadow-xl">
          <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-emerald-400/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={13} className="text-emerald-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                KYC Pending
              </p>
            </div>
            <p
              className="text-4xl font-black text-emerald-100 leading-none"
            >
              {stats.pending}
            </p>
            <p className="text-[10px] font-bold text-emerald-700 mt-2">
              Awaiting verification
            </p>
          </div>
        </div>
      </div>

      {/* ── Chart + Activity ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
        {/* Sales chart */}
        <div className="rounded-[2rem] border border-zinc-100 bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-1">
                Weekly Sales
              </p>
              <p
                className="text-2xl font-black text-zinc-900"
              >
                ₹{weekTotal.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 px-3 py-1.5">
              <TrendingUp size={12} className="text-emerald-600" strokeWidth={2.5} />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.12em]">
                This Week
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fontWeight: 700, fill: "#a1a1aa", fontFamily: "'DM Sans', system-ui" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fontWeight: 700, fill: "#a1a1aa", fontFamily: "'DM Sans', system-ui" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#f4f4f5", strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fill="url(#salesGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#f59e0b", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="rounded-[2rem] border border-zinc-100 bg-white overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/60 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-400">
              <Clock size={12} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Recent Orders
            </span>
          </div>

          <div className="divide-y divide-zinc-50">
            {recentActivity.map((item) => {
              const s = STATUS_CONFIG[item.status] ?? {
                label: item.status,
                className: "text-zinc-500 bg-zinc-50 border-zinc-200",
                icon: null,
              };
              const initials = item.userName
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50/60 transition-colors"
                >
                  {/* Avatar */}
                  <div className="h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] font-black text-zinc-500 shrink-0">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-black text-zinc-900 truncate">
                      {item.userName}
                    </p>
                    <p className="text-[10px] font-medium text-zinc-400">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.1em] border rounded-full px-2 py-0.5 shrink-0",
                      s.className
                    )}
                  >
                    {s.icon}
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom quick links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Manage Products", sub: "Catalog & inventory", icon: <Package size={16} />, href: "/admin/products" },
          { label: "Review KYC", sub: `${stats.pending} pending`, icon: <ShieldAlert size={16} />, href: "/admin/kyc", emerald: true },
          { label: "All Orders", sub: "Track & manage", icon: <ShoppingBag size={16} />, href: "/admin/orders" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={cn(
              "flex items-center gap-4 rounded-[2rem] border px-6 py-5 transition-all duration-150 group hover:shadow-sm",
              link.emerald
                ? "border-emerald-200 bg-emerald-50 hover:bg-emerald-100/60"
                : "border-zinc-100 bg-white hover:bg-zinc-50"
            )}
          >
            <div
              className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                link.emerald
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-zinc-100 text-zinc-500"
              )}
            >
              {link.icon}
            </div>
            <div>
              <p className={cn("text-sm font-black", link.emerald ? "text-emerald-900" : "text-zinc-900")}>
                {link.label}
              </p>
              <p className={cn("text-[11px] font-medium", link.emerald ? "text-emerald-600" : "text-zinc-400")}>
                {link.sub}
              </p>
            </div>
            <span className={cn("ml-auto text-lg", link.emerald ? "text-emerald-400" : "text-zinc-300")}>›</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── stat card ──────────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  sub,
  iconClass = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconClass?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm flex items-center gap-4">
      <div
        className={cn(
          "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0",
          iconClass
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 mb-0.5">
          {label}
        </p>
        <p className="text-xl font-black text-zinc-900 leading-tight truncate">
          {value}
        </p>
        {sub && (
          <p className="text-[10px] font-medium text-zinc-400 mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}