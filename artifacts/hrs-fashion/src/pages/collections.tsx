import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/data";
import { Heart } from "lucide-react";
import { Link } from "wouter";

const categories = ["All", "Evening", "Casual", "Formal", "Summer", "Bridal", "Bags"];

export default function Collections() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="relative pt-40 pb-20 text-center bg-secondary/20 border-b border-border">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.25em] text-primary mb-4"
        >
          HRS Fashion
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-5xl md:text-6xl font-serif text-foreground mb-5"
        >
          The Collection
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed"
        >
          Carefully curated dresses designed for every woman and every moment.
        </motion.p>
      </div>

      <div className="container mx-auto px-8 py-16">
        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-1 mb-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-7 py-2.5 text-xs uppercase tracking-[0.2em] transition-all duration-300 font-medium ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
              data-testid={`button-filter-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Product Count */}
        <motion.p
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground uppercase tracking-widest text-center mb-12"
        >
          {filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""}
        </motion.p>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-7 sm:gap-y-14"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                key={product.id}
                className="group flex flex-col"
                data-testid={`card-product-${product.id}`}
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-5 cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-foreground font-medium">
                          New
                        </span>
                      )}
                      {product.category === "Bridal" && (
                        <span className="bg-primary/90 text-white px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
                          Bridal
                        </span>
                      )}
                    </div>

                    {/* Wishlist */}
                    <button
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
                      data-testid={`button-wishlist-${product.id}`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${wishlist.includes(product.id) ? "fill-primary text-primary" : ""}`}
                      />
                    </button>

                    {/* View Details overlay */}
                    {product.category !== "Bags" && (
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="w-full bg-white text-foreground hover:bg-primary hover:text-white uppercase tracking-widest text-xs h-11 flex items-center justify-center font-medium shadow-lg transition-colors duration-200">
                          Select Size
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
                    <p className="text-primary font-medium">₹{product.price.toLocaleString()}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-28 text-muted-foreground">
            <p className="font-serif text-2xl mb-3">No pieces found</p>
            <p className="text-sm">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
