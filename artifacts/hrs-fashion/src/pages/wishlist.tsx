import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { products } from "@/lib/data";
import { useWishlist } from "@/lib/wishlist-context";

export default function Wishlist() {
  const { items: wishlistIds, toggleWishlist } = useWishlist();
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="pt-40 pb-20 text-center bg-secondary/20 border-b border-border">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.25em] text-primary mb-4"
        >
          Your Saved Pieces
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="text-5xl md:text-6xl font-serif text-foreground mb-5"
        >
          Wishlist
        </motion.h1>
        {wishlistProducts.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-muted-foreground"
          >
            {wishlistProducts.length} saved piece{wishlistProducts.length !== 1 ? "s" : ""}
          </motion.p>
        )}
      </div>

      <div className="container mx-auto px-8 py-16 pb-28">
        {wishlistProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-28 flex flex-col items-center gap-6"
          >
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
              <Heart className="w-10 h-10 text-primary/40" />
            </div>
            <div>
              <p className="font-serif text-3xl text-foreground mb-3">Your wishlist is empty</p>
              <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Save pieces you love by tapping the heart icon on any product.
              </p>
            </div>
            <Link href="/collections">
              <button
                className="mt-4 bg-primary text-white px-10 h-14 text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
                data-testid="button-explore-from-wishlist"
              >
                Explore Collection
              </button>
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7 gap-y-14"
            >
              <AnimatePresence mode="popLayout">
                {wishlistProducts.map((product, i) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                    transition={{ delay: i * 0.06 }}
                    className="group flex flex-col"
                    data-testid={`card-wishlist-${product.id}`}
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-5 cursor-pointer">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {product.isNew && (
                          <span className="absolute top-4 left-4 bg-white/95 px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
                            New
                          </span>
                        )}
                        {product.originalPrice && (
                          <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
                            Sale
                          </span>
                        )}

                        {/* Remove from wishlist */}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                          className="absolute top-4 right-4 w-9 h-9 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
                          data-testid={`button-remove-wishlist-${product.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Shop hover */}
                        {product.category !== "Bags" && (
                          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div className="w-full bg-white text-foreground uppercase tracking-widest text-xs h-11 flex items-center justify-center gap-2 font-medium shadow-lg hover:bg-primary hover:text-white transition-colors duration-200">
                              <ShoppingBag className="w-3.5 h-3.5" /> Select Size
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-center px-1">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">
                          {product.category}
                        </p>
                        <h3 className="font-serif text-lg text-foreground mb-1.5 leading-tight">
                          {product.name}
                        </h3>
                        {product.originalPrice ? (
                          <div className="flex items-center justify-center gap-2">
                            <p className="text-primary font-medium">₹{product.price}</p>
                            <p className="text-muted-foreground line-through text-sm">₹{product.originalPrice}</p>
                          </div>
                        ) : (
                          <p className="text-primary font-medium">₹{product.price}</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-16 text-center"
            >
              <Link href="/collections">
                <button className="border border-primary text-primary px-10 h-12 text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-colors" data-testid="button-continue-shopping-wishlist">
                  Continue Shopping
                </button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
