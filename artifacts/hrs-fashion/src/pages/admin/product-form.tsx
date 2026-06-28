import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { adminApi, type ApiProduct } from "@/lib/api";
import { ArrowLeft, Plus, X, Save } from "lucide-react";

const CATEGORIES = ["Evening", "Casual", "Formal", "Summer", "Bridal", "Bags", "Accessories"];
const DRESS_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const BAG_SIZES = ["One Size"];

const EMPTY: Partial<ApiProduct> = {
  name: "",
  price: 0,
  originalPrice: undefined,
  category: "Evening",
  image: "",
  images: [],
  isNew: false,
  isActive: true,
  description: "",
  details: [],
  sizes: [],
  stock: 100,
};

export default function ProductForm() {
  const [, navigate] = useLocation();
  const [matchEdit, paramsEdit] = useRoute("/admin/products/:id/edit");
  const isEdit = matchEdit;
  const productId = paramsEdit?.id;

  const [form, setForm] = useState<Partial<ApiProduct>>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [detailInput, setDetailInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  useEffect(() => {
    const init = async () => {
      const me = await adminApi.me().catch(() => ({ authenticated: false }));
      if (!me.authenticated) { navigate("/admin/login"); return; }
      if (isEdit && productId) {
        setLoading(true);
        const all = await adminApi.getProducts().catch(() => []);
        const p = all.find((x) => x.id === productId);
        if (p) setForm({ ...p });
        setLoading(false);
      }
    };
    init();
  }, [isEdit, productId, navigate]);

  const set = (key: keyof ApiProduct, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addDetail = () => {
    if (!detailInput.trim()) return;
    set("details", [...(form.details ?? []), detailInput.trim()]);
    setDetailInput("");
  };

  const removeDetail = (i: number) =>
    set("details", (form.details ?? []).filter((_, idx) => idx !== i));

  const addImage = () => {
    if (!imageInput.trim()) return;
    set("images", [...(form.images ?? []), imageInput.trim()]);
    setImageInput("");
  };

  const removeImage = (i: number) =>
    set("images", (form.images ?? []).filter((_, idx) => idx !== i));

  const toggleSize = (size: string) => {
    const current = form.sizes ?? [];
    set("sizes", current.includes(size) ? current.filter((s) => s !== size) : [...current, size]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image || !form.category || !form.description) {
      setError("Please fill in all required fields (name, price, image, category, description).");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        stock: Number(form.stock) || 0,
        images: form.images ?? [],
        details: form.details ?? [],
        sizes: form.sizes ?? [],
      };
      if (isEdit && productId) {
        await adminApi.updateProduct(productId, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError((err as Error).message ?? "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const availableSizes = form.category === "Bags" || form.category === "Accessories" ? BAG_SIZES : DRESS_SIZES;

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate("/admin/products")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <h2 className="text-2xl font-serif text-slate-800 mb-8">{isEdit ? "Edit Product" : "Add New Product"}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Basic Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Product Name *</label>
              <input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors" placeholder="e.g. Aura Silk Slip Dress" data-testid="input-product-name" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Category *</label>
              <select value={form.category ?? "Evening"} onChange={(e) => { set("category", e.target.value); set("sizes", []); }} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors bg-white" data-testid="select-product-category">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Stock</label>
              <input type="number" min="0" value={form.stock ?? 0} onChange={(e) => set("stock", e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors" data-testid="input-product-stock" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Price (₹) *</label>
              <input type="number" min="0" step="0.01" value={form.price ?? ""} onChange={(e) => set("price", e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors" placeholder="350" data-testid="input-product-price" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Original Price (for sale)</label>
              <input type="number" min="0" step="0.01" value={form.originalPrice ?? ""} onChange={(e) => set("originalPrice", e.target.value || undefined)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors" placeholder="Leave empty if not on sale" data-testid="input-product-original-price" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Description *</label>
            <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} required rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors resize-none" placeholder="Describe the product..." data-testid="textarea-product-description" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="isNew" checked={form.isNew ?? false} onChange={(e) => set("isNew", e.target.checked)} className="w-4 h-4 accent-rose-500" data-testid="checkbox-product-isnew" />
            <label htmlFor="isNew" className="text-sm text-slate-600">Mark as "New Arrival"</label>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Images</h3>
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Main Image URL *</label>
            <input value={form.image ?? ""} onChange={(e) => set("image", e.target.value)} required className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors" placeholder="/images/dress1.png or https://..." data-testid="input-product-image" />
          </div>
          {form.image && (
            <img src={form.image} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
          )}
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Additional Images</label>
            <div className="flex gap-2">
              <input value={imageInput} onChange={(e) => setImageInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); }}} className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors" placeholder="Image URL" data-testid="input-product-image-extra" />
              <button type="button" onClick={addImage} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {(form.images ?? []).map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Sizes & Details</h3>
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-3">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${(form.sizes ?? []).includes(size) ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-600 border-slate-200 hover:border-rose-300"}`}
                  data-testid={`button-size-${size}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Product Details</label>
            <div className="flex gap-2 mb-3">
              <input value={detailInput} onChange={(e) => setDetailInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDetail(); }}} className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors" placeholder="e.g. 100% pure silk charmeuse" data-testid="input-product-detail" />
              <button type="button" onClick={addDetail} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
              {(form.details ?? []).map((detail, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-2.5 text-sm text-slate-700 group">
                  <span className="flex-1">{detail}</span>
                  <button type="button" onClick={() => removeDetail(i)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

        <div className="flex gap-3 pb-8">
          <button type="button" onClick={() => navigate("/admin/products")} className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-3.5 rounded-xl text-sm font-medium transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white py-3.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2" data-testid="button-save-product">
            <Save className="w-4 h-4" />{saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
