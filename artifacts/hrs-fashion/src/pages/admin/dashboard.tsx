import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { adminApi, type AnalyticsSummary, type RevenueRow, type ApiOrder } from "@/lib/api";
import { ShoppingBag, Package, TrendingUp, Clock, ArrowRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatMonth(m: string) {
  const [y, mo] = m.split("-");
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [revenue, setRevenue] = useState<RevenueRow[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const me = await adminApi.me().catch(() => ({ authenticated: false }));
      if (!me.authenticated) { navigate("/admin/login"); return; }
      const [s, r, o] = await Promise.all([
        adminApi.getSummary().catch(() => null),
        adminApi.getRevenue().catch(() => []),
        adminApi.getOrders().catch(() => []),
      ]);
      setSummary(s);
      setRevenue(r);
      setOrders(o.slice(0, 8));
      setLoading(false);
    };
    load();
  }, [navigate]);

  const statCards = summary ? [
    { label: "Total Revenue", value: formatCurrency(summary.totalRevenue), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "This Month", value: formatCurrency(summary.monthRevenue), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Total Orders", value: summary.totalOrders.toLocaleString(), icon: ShoppingBag, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
    { label: "Pending Orders", value: summary.pendingOrders.toLocaleString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Active Products", value: summary.totalProducts.toLocaleString(), icon: Package, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-serif text-slate-800 mb-1">Dashboard</h2>
        <p className="text-slate-500 text-sm">Welcome back — here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`bg-white rounded-2xl p-5 border ${card.border} shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-1 text-sm uppercase tracking-widest">Monthly Revenue</h3>
          <p className="text-slate-400 text-xs mb-6">Last 12 months</p>
          {revenue.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No revenue data yet — orders will appear here</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenue.map((r) => ({ ...r, month: formatMonth(r.month) }))}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={2.5} fill="url(#revGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-1 text-sm uppercase tracking-widest">Orders Volume</h3>
          <p className="text-slate-400 text-xs mb-6">Monthly orders</p>
          {revenue.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No orders yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenue.map((r) => ({ ...r, month: formatMonth(r.month) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="orders" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-widest">Recent Orders</h3>
          <button onClick={() => navigate("/admin/orders")} className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">No orders yet — they will appear here when customers place orders</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {orders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{order.customerName}</p>
                  <p className="text-xs text-slate-400 truncate">{order.customerEmail}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-800">{formatCurrency(order.total)}</p>
                  <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
