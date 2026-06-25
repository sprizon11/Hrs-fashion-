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
    if (!window.confirm("Archive this product? It will be hidden from the store.")) return;
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
    return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading products...</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-serif text-slate-800 mb-1">Products</h2>
          <p className="text-slate-500 text-sm">{products.length} total products</p>
        </div>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          data-testid="button-add-product"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-rose-400 transition-colors"
              data-testid="input-search-products"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No products found</p>
          </div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 px-6 py-3 text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-50">
              <span>Image</span><span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Actions</span>
            </div>
            <div className="divide-y divide-slate-50">
              {filtered.map((p) => (
                <div key={p.id} className={`flex flex-col md:grid md:grid-cols-[auto_1fr_auto_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors ${!p.isActive ? "opacity-50" : ""}`}>
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-400 truncate md:hidden">{p.category} · ${p.price}</p>
                  </div>
                  <span className="hidden md:block text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full whitespace-nowrap">{p.category}</span>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-slate-800">${p.price}</p>
                    {p.originalPrice && <p className="text-xs text-slate-400 line-through">${p.originalPrice}</p>}
                  </div>
                  <p className="hidden md:block text-sm text-slate-600 text-center">{p.stock ?? 0}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(p)}
                      className={`p-1.5 rounded-lg transition-colors ${p.isActive ? "text-emerald-500 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-100"}`}
                      title={p.isActive ? "Hide from store" : "Show in store"}
                      data-testid={`button-toggle-${p.id}`}
                    >
                      {p.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                      data-testid={`button-edit-${p.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                      data-testid={`button-delete-${p.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
