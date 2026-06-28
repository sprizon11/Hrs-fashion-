import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { adminApi, type AnalyticsSummary, type RevenueRow, type ApiOrder } from "@/lib/api";
import { ShoppingBag, Package, TrendingUp, Clock, ArrowRight, Plus, IndianRupee } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

function formatCurrency(n: number) {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatMonth(m: string) {
  const [y, mo] = m.split("-");
  return new Date(Number(y), Number(mo) - 1).toLocaleDateString("en-US", { month: "short" });
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
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
      setOrders(o.slice(0, 6));
      setLoading(false);
    };
    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const s = summary;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h2 className="text-xl font-serif text-slate-800">{greeting()}, Admin 👋</h2>
        </div>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-xl text-xs font-medium transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {/* Revenue highlight card */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-5 text-white shadow-lg shadow-rose-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-rose-100 text-xs uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">{s ? formatCurrency(s.totalRevenue) : "₹0"}</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-rose-100">
          <TrendingUp className="w-4 h-4" />
          <span>This month: <span className="text-white font-semibold">{s ? formatCurrency(s.monthRevenue) : "₹0"}</span></span>
        </div>
      </div>

      {/* Stat cards 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center mb-3">
            <ShoppingBag className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Total Orders</p>
          <p className="text-2xl font-bold text-slate-800 mt-0.5">{s?.totalOrders ?? 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Pending</p>
          <p className="text-2xl font-bold text-amber-500 mt-0.5">{s?.pendingOrders ?? 0}</p>
        </div>

        <div className="col-span-2 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center">
              <Package className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Products</p>
              <p className="text-2xl font-bold text-slate-800">{s?.totalProducts ?? 0}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin/products")}
            className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium"
          >
            Manage <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest">Revenue Trend</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Last 12 months</p>
          </div>
        </div>
        {revenue.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-slate-300">
            <TrendingUp className="w-8 h-8 mb-2" />
            <p className="text-xs text-slate-400">Orders will appear here</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenue.map((r) => ({ ...r, month: formatMonth(r.month) }))} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 11, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-50">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-widest">Recent Orders</p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center gap-2">
            <ShoppingBag className="w-8 h-8 text-slate-200" />
            <p className="text-slate-400 text-sm">No orders yet</p>
            <p className="text-slate-300 text-xs">Orders will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 px-4 py-3">
                {/* Avatar initial */}
                <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-rose-400">
                    {order.customerName?.[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate leading-tight">{order.customerName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-800">{formatCurrency(order.total)}</p>
                  <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-500"}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        <button
          onClick={() => navigate("/admin/products")}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-left hover:border-rose-200 transition-colors"
        >
          <Package className="w-5 h-5 text-rose-400 mb-2" />
          <p className="text-sm font-medium text-slate-700">Products</p>
          <p className="text-[11px] text-slate-400">Manage catalogue</p>
        </button>
        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-left hover:border-rose-200 transition-colors"
        >
          <ShoppingBag className="w-5 h-5 text-violet-400 mb-2" />
          <p className="text-sm font-medium text-slate-700">Orders</p>
          <p className="text-[11px] text-slate-400">View all orders</p>
        </button>
      </div>

    </div>
  );
}
