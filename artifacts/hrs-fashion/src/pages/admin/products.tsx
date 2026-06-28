import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { adminApi, type ApiProduct } from "@/lib/api";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search, Package } from "lucide-react";

export default function AdminProducts() {
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    const me = await adminApi.me().catch(() => ({ authenticated: false }));
    if (!me.authenticated) { navigate("/admin/login"); return; }
    const data = await adminApi.getProducts().catch(() => []);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    setDeleting(id);
    await adminApi.deleteProduct(id).catch(() => {});
    await load();
    setDeleting(null);
  };

  const handleToggleActive = async (product: ApiProduct) => {
    await adminApi.updateProduct(product.id, { ...product, isActive: !product.isActive }).catch(() => {});
    await load();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Loading products...
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-serif text-slate-800 leading-tight">Products</h2>
          <p className="text-slate-400 text-xs mt-0.5">{products.length} total products</p>
        </div>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap"
          data-testid="button-add-product"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-400 transition-colors shadow-sm"
          data-testid="input-search-products"
        />
      </div>

      {/* Product List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No products found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((p) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors ${!p.isActive ? "opacity-50" : ""}`}
              >
                {/* Image */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate leading-tight">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">
                      {p.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">₹{p.price}</span>
                    {p.originalPrice && (
                      <span className="text-[11px] text-slate-400 line-through">₹{p.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Stock: {p.stock ?? 0}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`p-2 rounded-lg transition-colors ${p.isActive ? "text-emerald-500 hover:bg-emerald-50" : "text-slate-300 hover:bg-slate-100"}`}
                    title={p.isActive ? "Hide from store" : "Show in store"}
                    data-testid={`button-toggle-${p.id}`}
                  >
                    {p.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                    data-testid={`button-edit-${p.id}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                    data-testid={`button-delete-${p.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
