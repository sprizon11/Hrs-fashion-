import { useEffect, useRef, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { adminApi, type ApiProduct } from "@/lib/api";
import { ArrowLeft, Plus, X, Save, Upload, Image } from "lucide-react";

const DEFAULT_CATEGORIES = ["Evening", "Casual", "Formal", "Summer", "Bridal", "Bags", "Accessories"];
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

async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "X-Admin-Token": "admin123" },
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json() as { url: string };
  return data.url;
}

function ImageUploadBox({
  value,
  onChange,
  placeholder = "image",
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      onChange(url);
      setShowUrl(false);
    } catch {
      setShowUrl(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={value} alt="Preview" className="h-40 w-auto object-contain block" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-2 right-2 text-xs bg-white/90 px-3 py-1.5 rounded-lg shadow hover:bg-slate-100 transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center cursor-pointer hover:border-rose-300 hover:bg-rose-50/30 transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-600 font-medium">Click to upload {placeholder}</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowUrl(!showUrl)}
            className="text-xs text-slate-400 hover:text-rose-500 transition-colors underline underline-offset-2"
          >
            {showUrl ? "Hide URL input" : "Or paste an image URL instead"}
          </button>
          {showUrl && (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors"
              placeholder="https://... or /images/product.jpg"
            />
          )}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}

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
  const [uploadingExtra, setUploadingExtra] = useState(false);

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");

  const extraImageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const me = await adminApi.me().catch(() => ({ authenticated: false }));
      if (!me.authenticated) { navigate("/admin/login"); return; }
      if (isEdit && productId) {
        setLoading(true);
        const all = await adminApi.getProducts().catch(() => []);
        const p = all.find((x) => x.id === productId);
        if (p) {
          setForm({ ...p });
          if (!DEFAULT_CATEGORIES.includes(p.category)) {
            setCategories((prev) => [...prev, p.category]);
          }
        }
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

  const handleExtraImageUpload = async (file: File) => {
    setUploadingExtra(true);
    try {
      const url = await uploadImageFile(file);
      set("images", [...(form.images ?? []), url]);
    } catch {
      // silent
    } finally {
      setUploadingExtra(false);
    }
  };

  const removeImage = (i: number) =>
    set("images", (form.images ?? []).filter((_, idx) => idx !== i));

  const toggleSize = (size: string) => {
    const current = form.sizes ?? [];
    set("sizes", current.includes(size) ? current.filter((s) => s !== size) : [...current, size]);
  };

  const addCategory = () => {
    const cat = newCategoryInput.trim();
    if (!cat) return;
    if (!categories.includes(cat)) setCategories((prev) => [...prev, cat]);
    set("category", cat);
    set("sizes", []);
    setNewCategoryInput("");
    setAddingCategory(false);
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

  const availableSizes = (form.category === "Bags" || form.category === "Accessories") ? BAG_SIZES : DRESS_SIZES;

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Loading...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <button onClick={() => navigate("/admin/products")} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>
      <h2 className="text-2xl font-serif text-slate-800 mb-8">{isEdit ? "Edit Product" : "Add New Product"}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Images */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Images</h3>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-3">Main Image *</label>
            <ImageUploadBox
              value={form.image ?? ""}
              onChange={(url) => set("image", url)}
              placeholder="main product image"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-3">Additional Images</label>
            <div
              onClick={() => !uploadingExtra && extraImageRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-rose-300 hover:bg-rose-50/30 transition-colors"
            >
              {uploadingExtra ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-slate-500">Uploading...</p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Image className="w-5 h-5" />
                  <p className="text-sm">Click to add more images</p>
                </div>
              )}
            </div>
            <input
              ref={extraImageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleExtraImageUpload(f); e.target.value = ""; }}
            />
            {(form.images ?? []).length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {(form.images ?? []).map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Basic Information</h3>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Product Name *</label>
            <input
              value={form.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors"
              placeholder="e.g. Aura Silk Slip Dress"
              data-testid="input-product-name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Category *</label>
              {addingCategory ? (
                <div className="flex gap-2">
                  <input
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }}
                    autoFocus
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                    placeholder="New category name"
                  />
                  <button type="button" onClick={addCategory} className="px-3 bg-rose-500 text-white rounded-xl text-sm">Add</button>
                  <button type="button" onClick={() => { setAddingCategory(false); setNewCategoryInput(""); }} className="px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-colors">✕</button>
                </div>
              ) : (
                <select
                  value={form.category ?? "Evening"}
                  onChange={(e) => {
                    if (e.target.value === "__add__") {
                      setAddingCategory(true);
                    } else {
                      set("category", e.target.value);
                      set("sizes", []);
                    }
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors bg-white"
                  data-testid="select-product-category"
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                  <option value="__add__">＋ Add new category...</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock ?? 0}
                onChange={(e) => set("stock", e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                data-testid="input-product-stock"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Price (₹) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price ?? ""}
                onChange={(e) => set("price", e.target.value)}
                required
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                placeholder="350"
                data-testid="input-product-price"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Original Price (for sale)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.originalPrice ?? ""}
                onChange={(e) => set("originalPrice", e.target.value || undefined)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                placeholder="Leave empty if not on sale"
                data-testid="input-product-original-price"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Description *</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              required
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors resize-none"
              placeholder="Describe the product..."
              data-testid="textarea-product-description"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isNew"
              checked={form.isNew ?? false}
              onChange={(e) => set("isNew", e.target.checked)}
              className="w-4 h-4 accent-rose-500"
              data-testid="checkbox-product-isnew"
            />
            <label htmlFor="isNew" className="text-sm text-slate-600">Mark as "New Arrival"</label>
          </div>
        </div>

        {/* Sizes & Details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Sizes & Details</h3>
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-3">Available Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${(form.sizes ?? []).includes(size) ? "bg-rose-500 text-white border-rose-500" : "bg-white text-slate-600 border-slate-200 hover:border-rose-300"}`}
                  data-testid={`button-size-${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Product Details</label>
            <div className="flex gap-2 mb-3">
              <input
                value={detailInput}
                onChange={(e) => setDetailInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDetail(); } }}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 transition-colors"
                placeholder="e.g. 100% pure silk charmeuse"
                data-testid="input-product-detail"
              />
              <button type="button" onClick={addDetail} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {(form.details ?? []).map((detail, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-2.5 text-sm text-slate-700 group">
                  <span className="flex-1">{detail}</span>
                  <button type="button" onClick={() => removeDetail(i)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        <div className="flex gap-3 pb-8">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 py-3.5 rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white py-3.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            data-testid="button-save-product"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
