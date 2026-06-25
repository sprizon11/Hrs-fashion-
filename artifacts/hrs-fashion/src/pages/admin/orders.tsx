import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { adminApi, type ApiOrder } from "@/lib/api";
import { Search, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

function formatCurrency(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AdminOrders() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    const me = await adminApi.me().catch(() => ({ authenticated: false }));
    if (!me.authenticated) { navigate("/admin/login"); return; }
    const data = await adminApi.getOrders().catch(() => []);
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    await adminApi.updateOrderStatus(orderId, status).catch(() => {});
    await load();
    setUpdating(null);
  };

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.customerEmail.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }), {} as Record<string, number>);

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading orders...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-serif text-slate-800 mb-1">Orders</h2>
        <p className="text-slate-500 text-sm">{orders.length} total orders</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setStatusFilter("all")} className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${statusFilter === "all" ? "bg-slate-800 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-colors border ${statusFilter === s ? STATUS_STYLES[s] + " font-semibold" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            {s} ({statusCounts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, ID..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-400 transition-colors" data-testid="input-search-orders" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No orders found</p>
            <p className="text-slate-300 text-xs mt-1">Orders will appear here when customers check out</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((order) => (
              <div key={order.id}>
                <div className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-800">{order.customerName}</p>
                        <span className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border font-medium ${STATUS_STYLES[order.status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{order.customerEmail} · {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                      {order.address && <p className="text-xs text-slate-400 mt-0.5">{order.address}{order.city ? `, ${order.city}` : ""}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-base font-bold text-slate-800">{formatCurrency(order.total)}</p>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-rose-400 bg-white disabled:opacity-50 capitalize"
                        data-testid={`select-status-${order.id}`}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                      <button onClick={() => setExpanded(expanded === order.id ? null : order.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                        {expanded === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="px-6 pb-4 bg-slate-50/50">
                    <div className="pl-0 pt-3 border-t border-slate-100">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Order Items</p>
                      {(order.items ?? []).length === 0 ? (
                        <p className="text-sm text-slate-400">No items data</p>
                      ) : (
                        <div className="space-y-2">
                          {(order.items ?? []).map((item) => (
                            <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-100">
                              <img src={item.productImage} alt={item.productName} className="w-10 h-10 object-cover rounded-lg" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{item.productName}</p>
                                <p className="text-xs text-slate-400">Size: {item.size} · Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-semibold text-slate-800">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {order.notes && <p className="mt-3 text-xs text-slate-500 italic">Note: {order.notes}</p>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
