import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { products } from "@/lib/data";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";

const saleProducts = products.filter((p) => p.originalPrice !== undefined);

function getDiscountPct(price: number, original: number) {
  return Math.round(((original - price) / original) * 100);
}

export default function Sale() {
  const { items: wishlistItems, toggleWishlist } = useWishlist();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative pt-40 pb-20 text-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50" />
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.3em] text-primary mb-4"
          >
            Limited Time
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="text-5xl md:text-6xl font-serif text-foreground mb-5"
          >
            The Edit — Sale
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-muted-foreground max-w-lg mx-auto leading-relaxed"
          >
            Curated pieces at exceptional prices. Once they're gone, they're gone — shop now before the edit ends.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 inline-block bg-primary text-white text-xs uppercase tracking-widest px-6 py-2"
          >
            {saleProducts.length} Pieces — Final Sale
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-16 pb-28">
        {saleProducts.length === 0 ? (
          <div className="text-center py-28">
            <p className="font-serif text-2xl text-foreground mb-3">No sale items right now</p>
            <p className="text-muted-foreground mb-8">Check back soon for exclusive offers.</p>
            <Link href="/collections">
              <button className="bg-primary text-white px-8 h-12 text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors">
                Shop Full Collection
              </button>
            </Link>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7 gap-y-14"
          >
            <AnimatePresence mode="popLayout">
              {saleProducts.map((product, i) => {
                const discount = getDiscountPct(product.price, product.originalPrice!);
                const isWishlisted = wishlistItems.includes(product.id);
                return (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="group flex flex-col"
                    onMouseEnter={() => setHoveredId(product.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    data-testid={`card-sale-${product.id}`}
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-5 cursor-pointer">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Discount badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-white px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                            -{discount}%
                          </span>
                        </div>

                        {/* Wishlist */}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                          className="absolute top-4 right-4 w-9 h-9 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                          data-testid={`button-wishlist-sale-${product.id}`}
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-primary text-primary" : ""}`} />
                        </button>

                        {/* Hover CTA */}
                        {product.category !== "Bags" && (
                          <AnimatePresence>
                            {hoveredId === product.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 12 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-x-0 bottom-0 p-4"
                              >
                                <div className="w-full bg-white text-foreground uppercase tracking-widest text-xs h-11 flex items-center justify-center font-medium shadow-lg hover:bg-primary hover:text-white transition-colors duration-200">
                                  Select Size
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>

                      <div className="text-center px-1">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">
                          {product.category}
                        </p>
                        <h3 className="font-serif text-lg text-foreground mb-2 leading-tight">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-center gap-3">
                          <p className="text-primary font-semibold text-lg">₹{product.price}</p>
                          <p className="text-muted-foreground line-through text-sm">₹{product.originalPrice}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
