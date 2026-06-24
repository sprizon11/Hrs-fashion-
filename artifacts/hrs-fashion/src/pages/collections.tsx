import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = ["All", "Evening", "Casual", "Formal", "Summer", "Bridal"];

export default function Collections() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { toast } = useToast();

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleAddToCart = (name: string) => {
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your shopping bag.`,
    });
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif mb-6 text-foreground"
          >
            The Collection
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Explore our carefully curated selection of dresses designed for elegance, comfort, and undeniable beauty.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 text-sm uppercase tracking-widest transition-all duration-300 ${
                activeCategory === category 
                  ? "border-b border-primary text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={product.id}
                className="group flex flex-col"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-6">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  {product.isNew && (
                    <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider">
                      New
                    </span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <Button 
                      className="w-full rounded-none bg-background text-foreground hover:bg-primary hover:text-white uppercase tracking-widest text-xs h-12"
                      onClick={() => handleAddToCart(product.name)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">{product.category}</p>
                  <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                  <p className="text-foreground">${product.price}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
