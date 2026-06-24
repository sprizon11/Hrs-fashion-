import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalCount, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={closeCart}
          />
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-background z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-7 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-xl text-foreground">Shopping Bag</h2>
                {totalCount > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {totalCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                data-testid="button-close-cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center gap-4"
                >
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                    <ShoppingBag className="w-9 h-9 text-primary/50" />
                  </div>
                  <p className="font-serif text-lg text-foreground">Your bag is empty</p>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Add pieces from our collection to begin your look.
                  </p>
                  <Button
                    onClick={closeCart}
                    variant="outline"
                    className="mt-2 rounded-none uppercase tracking-widest text-xs border-primary text-primary hover:bg-primary hover:text-white"
                    data-testid="button-continue-shopping"
                  >
                    Explore Collection
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.selectedSize}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-5 pb-6 border-b border-border last:border-none"
                        data-testid={`cart-item-${item.id}-${item.selectedSize}`}
                      >
                        <div className="w-24 h-28 shrink-0 overflow-hidden bg-muted">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{item.category}</p>
                            <h4 className="font-serif text-base text-foreground leading-snug">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-primary font-medium">${item.price}</p>
                              <span className="text-muted-foreground text-xs">·</span>
                              <span className="text-xs text-muted-foreground uppercase tracking-widest">Size {item.selectedSize}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 border border-border">
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                data-testid={`button-decrease-${item.id}-${item.selectedSize}`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-foreground" data-testid={`text-quantity-${item.id}`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                data-testid={`button-increase-${item.id}-${item.selectedSize}`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id, item.selectedSize)}
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                              data-testid={`button-remove-${item.id}-${item.selectedSize}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 py-7 border-t border-border bg-secondary/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground uppercase tracking-widest">Subtotal</span>
                  <span className="font-serif text-xl text-foreground">${totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">Shipping & taxes calculated at checkout</p>
                <Button
                  className="w-full rounded-none h-14 bg-foreground text-background hover:bg-primary uppercase tracking-widest text-sm transition-colors duration-300"
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
                <button
                  onClick={closeCart}
                  className="w-full text-center mt-4 text-xs text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors"
                  data-testid="button-continue-from-footer"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
