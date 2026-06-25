import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { storeApi } from "@/lib/api";
import { CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const order = await storeApi.createOrder({
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        notes: form.notes || undefined,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          productImage: item.image,
          size: item.selectedSize,
          quantity: item.quantity,
          price: item.price,
        })),
      });
      setOrderId(order.id);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError((err as Error).message ?? "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-md w-full p-10 text-center shadow-xl"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="font-serif text-3xl text-foreground mb-3">Order Placed!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
            Thank you for your order. We've received your request and will be in touch shortly.
          </p>
          <p className="text-xs text-muted-foreground mb-8">
            Order ID: <span className="font-mono text-foreground">{orderId.slice(0, 8).toUpperCase()}</span>
          </p>
          <Link href="/collections">
            <button className="w-full bg-primary text-white py-4 text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Continue Shopping
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-20 px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="font-serif text-2xl text-foreground mb-3">Your cart is empty</p>
          <Link href="/collections">
            <button className="bg-primary text-white px-8 h-12 text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28">
      <div className="container mx-auto px-4 sm:px-8 py-12 pb-24 max-w-5xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>

        <h1 className="font-serif text-4xl text-foreground mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-border p-6 sm:p-8 space-y-5">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Full Name *</label>
                  <input value={form.name} onChange={(e) => set("name", e.target.value)} required className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="Jane Smith" data-testid="input-checkout-name" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="jane@example.com" data-testid="input-checkout-email" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Phone</label>
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="+1 234 567 8900" data-testid="input-checkout-phone" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-border p-6 sm:p-8 space-y-5">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Address</label>
                  <input value={form.address} onChange={(e) => set("address", e.target.value)} className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="123 Rose Street" data-testid="input-checkout-address" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">City</label>
                  <input value={form.city} onChange={(e) => set("city", e.target.value)} className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="New York" data-testid="input-checkout-city" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-border p-6 sm:p-8 space-y-5">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Order Notes</h2>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Special instructions, gift message..." data-testid="textarea-checkout-notes" />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">{error}</div>}

            <button type="submit" disabled={submitting} className="w-full bg-primary text-white py-4 text-xs uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-colors" data-testid="button-place-order">
              {submitting ? "Placing Order..." : "Place Order"}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              By placing your order you agree to our terms and privacy policy. Payment on delivery or via invoice.
            </p>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-white border border-border p-6 sticky top-28">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                    <div className="w-16 h-16 overflow-hidden bg-muted flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span><span className="text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between font-serif text-lg text-foreground pt-2 border-t border-border">
                  <span>Total</span><span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
