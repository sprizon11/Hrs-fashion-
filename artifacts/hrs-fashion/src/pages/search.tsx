import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Search as SearchIcon, X, Heart } from "lucide-react";
import { products } from "@/lib/data";
import { useWishlist } from "@/lib/wishlist-context";

export default function Search() {
  const [query, setQuery] = useState("");
  const { items: wishlistItems, toggleWishlist } = useWishlist();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background pt-28">
      {/* Search Bar */}
      <div className="border-b border-border sticky top-[73px] bg-background/95 backdrop-blur-md z-30">
        <div className="container mx-auto px-8 py-6">
          <div className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dresses, bags, collections..."
              autoFocus
              className="w-full pl-8 pr-10 py-3 bg-transparent border-b border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-lg transition-colors"
              data-testid="input-search"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-clear-search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-12 pb-28">
        {/* Results summary */}
        <motion.p
          key={query}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground uppercase tracking-widest mb-10"
        >
          {query
            ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
            : `${results.length} pieces`}
        </motion.p>

        {/* Popular searches (when empty) */}
        {!query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 mb-14"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground w-full mb-2">Popular</p>
            {["Evening", "Bridal", "Bags", "Summer", "Formal", "Silk", "Sale"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-5 py-2 border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
                data-testid={`button-popular-${tag.toLowerCase()}`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        )}

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {results.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7 gap-y-14"
            >
              {results.map((product, i) => {
                const isWishlisted = wishlistItems.includes(product.id);
                return (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    className="group flex flex-col"
                    data-testid={`card-search-${product.id}`}
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-5 cursor-pointer">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="bg-white/95 px-3 py-1 text-[10px] uppercase tracking-widest font-medium">New</span>
                          )}
                          {product.originalPrice && (
                            <span className="bg-primary text-white px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
                              Sale
                            </span>
                          )}
                        </div>

                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                          className="absolute top-4 right-4 w-9 h-9 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                          data-testid={`button-wishlist-search-${product.id}`}
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-primary text-primary" : ""}`} />
                        </button>

                        {product.category !== "Bags" && (
                          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div className="w-full bg-white text-foreground uppercase tracking-widest text-xs h-11 flex items-center justify-center font-medium shadow-lg hover:bg-primary hover:text-white transition-colors duration-200">
                              Select Size
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-center px-1">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2">{product.category}</p>
                        <h3 className="font-serif text-lg text-foreground mb-1.5">{product.name}</h3>
                        {product.originalPrice ? (
                          <div className="flex items-center justify-center gap-2">
                            <p className="text-primary font-medium">${product.price}</p>
                            <p className="text-muted-foreground line-through text-sm">${product.originalPrice}</p>
                          </div>
                        ) : (
                          <p className="text-primary font-medium">${product.price}</p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <p className="font-serif text-3xl text-foreground mb-4">No results found</p>
              <p className="text-muted-foreground mb-8">
                Try a different search term or browse our full collection.
              </p>
              <button
                onClick={() => setQuery("")}
                className="bg-primary text-white px-8 h-12 text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
