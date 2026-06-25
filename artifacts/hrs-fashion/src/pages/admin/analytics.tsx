import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import { adminApi, type RevenueRow, type TopProduct, type AnalyticsSummary } from "@/lib/api";
import { TrendingUp, ShoppingBag, Package, Clock } from "lucide-react";

const PIE_COLORS = ["#f43f5e", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a78bfa", "#f472b6"];

function formatCurrency(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatMonth(m: string) {
  const [y, mo] = m.split("-");
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export default function AdminAnalytics() {
  const [, navigate] = useLocation();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenueRow[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<{ status: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const me = await adminApi.me().catch(() => ({ authenticated: false }));
      if (!me.authenticated) { navigate("/admin/login"); return; }
      const [s, r, tp, obs] = await Promise.all([
        adminApi.getSummary().catch(() => null),
        adminApi.getRevenue().catch(() => []),
        adminApi.getTopProducts().catch(() => []),
        adminApi.getOrdersByStatus().catch(() => []),
      ]);
      setSummary(s);
      setRevenue(r);
      setTopProducts(tp);
      setOrdersByStatus(obs);
      setLoading(false);
    };
    load();
  }, [navigate]);

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading analytics...</div>;

  const kpis = summary ? [
    { label: "Total Revenue", value: formatCurrency(summary.totalRevenue), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "This Month", value: formatCurrency(summary.monthRevenue), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: summary.totalOrders.toLocaleString(), icon: ShoppingBag, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Pending Orders", value: summary.pendingOrders.toLocaleString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Active Products", value: summary.totalProducts.toLocaleString(), icon: Package, color: "text-rose-600", bg: "bg-rose-50" },
  ] : [];

  const avgOrder = summary && summary.totalOrders > 0
    ? summary.totalRevenue / summary.totalOrders
    : 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-serif text-slate-800 mb-1">Analytics</h2>
        <p className="text-slate-500 text-sm">Business performance overview</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className={`w-8 h-8 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">{k.label}</p>
            <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
          </div>
        ))}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-pink-600" />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">Avg. Order</p>
          <p className="text-lg font-bold text-pink-600">{formatCurrency(avgOrder)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">Revenue Trend</h3>
          <p className="text-slate-400 text-xs mb-5">Monthly revenue — last 12 months</p>
          {revenue.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-slate-300 text-sm">No revenue data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenue.map((r) => ({ ...r, month: formatMonth(r.month) }))}>
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={2.5} fill="url(#rg)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">Orders Volume</h3>
          <p className="text-slate-400 text-xs mb-5">Monthly order count</p>
          {revenue.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-slate-300 text-sm">No orders data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenue.map((r) => ({ ...r, month: formatMonth(r.month) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">Top Selling Products</h3>
          <p className="text-slate-400 text-xs mb-5">By units sold</p>
          {topProducts.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-slate-300 text-sm">No sales data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topProducts.slice(0, 6)} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="productName" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={110} tickFormatter={(v: string) => v.length > 16 ? v.slice(0, 15) + "…" : v} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                  <Bar dataKey="totalSold" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {topProducts.slice(0, 5).map((p, i) => (
                  <div key={p.productId} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                    <img src={p.productImage} alt={p.productName} className="w-8 h-8 object-cover rounded-lg" />
                    <p className="text-sm text-slate-700 flex-1 truncate">{p.productName}</p>
                    <p className="text-sm font-semibold text-slate-800">{formatCurrency(p.totalRevenue)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">Orders by Status</h3>
          <p className="text-slate-400 text-xs mb-5">Current order distribution</p>
          {ordersByStatus.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-slate-300 text-sm">No orders data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={ordersByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {ordersByStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend formatter={(v) => <span className="text-xs capitalize text-slate-600">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
