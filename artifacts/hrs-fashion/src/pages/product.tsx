import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft, Heart, Check, ChevronDown } from "lucide-react";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
        <p className="font-serif text-3xl text-foreground">Piece Not Found</p>
        <Link href="/collections">
          <Button variant="outline" className="rounded-none uppercase tracking-widest">
            Back to Collection
          </Button>
        </Link>
      </div>
    );
  }

  const images = product.images ?? [product.image];

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Breadcrumb */}
      <div className="container mx-auto px-8 py-6">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          data-testid="link-back-to-collections"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Collections
        </Link>
      </div>

      <div className="container mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex gap-4"
          >
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-col gap-3 w-20 shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-[3/4] overflow-hidden bg-muted border-2 transition-all duration-200 ${
                      activeImage === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    data-testid={`button-image-thumb-${i}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 relative aspect-[3/4] bg-muted overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="w-full h-full object-cover"
                  data-testid="img-product-main"
                />
              </AnimatePresence>

              {product.isNew && (
                <span className="absolute top-5 left-5 bg-white/95 px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
                  New Arrival
                </span>
              )}
              {product.category === "Bridal" && (
                <span className="absolute top-5 left-5 bg-primary text-white px-3 py-1 text-[10px] uppercase tracking-widest font-medium">
                  Bridal
                </span>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="lg:sticky lg:top-28 flex flex-col"
          >
            <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.25em] text-primary mb-3">
              {product.category}
            </motion.p>

            <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-5xl text-foreground mb-4 leading-tight">
              {product.name}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-2xl text-primary font-medium mb-8">
              ₹{product.price.toLocaleString()}
            </motion.p>

            <motion.p variants={fadeUp} className="text-muted-foreground leading-[1.9] text-base mb-10 border-b border-border pb-10">
              {product.description}
            </motion.p>

            {/* Size Selection */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-widest font-medium text-foreground">
                  Select Size
                </p>
                <button className="text-xs text-muted-foreground uppercase tracking-widest underline underline-offset-2 hover:text-primary transition-colors">
                  Size Guide
                </button>
              </div>

              <AnimatePresence>
                {sizeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-500 mb-3 uppercase tracking-widest"
                  >
                    Please select a size to continue
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`w-14 h-14 border text-sm font-medium uppercase tracking-wide transition-all duration-200 ${
                      selectedSize === size
                        ? "border-primary bg-primary text-white"
                        : "border-border text-foreground hover:border-primary hover:text-primary bg-background"
                    }`}
                    data-testid={`button-size-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={fadeUp} className="flex gap-3 mb-10">
              <Button
                onClick={handleAddToBag}
                className={`flex-1 rounded-none h-14 uppercase tracking-widest text-xs transition-all duration-300 ${
                  added
                    ? "bg-green-600 hover:bg-green-600 text-white"
                    : sizeError
                    ? "bg-red-100 text-red-600 border border-red-300 hover:bg-red-100"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
                data-testid="button-add-to-bag"
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Added to Bag
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Bag
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              <button
                onClick={() => setWishlist(!wishlist)}
                className={`w-14 h-14 border flex items-center justify-center transition-all duration-200 ${
                  wishlist
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
                data-testid="button-wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlist ? "fill-primary" : ""}`} />
              </button>
            </motion.div>

            {/* Product Details Accordion */}
            <motion.div variants={fadeUp} className="border-t border-border">
              <button
                onClick={() => setDetailsOpen(!detailsOpen)}
                className="w-full flex items-center justify-between py-5 text-left"
                data-testid="button-details-toggle"
              >
                <span className="text-xs uppercase tracking-widest font-medium text-foreground">
                  Product Details
                </span>
                <motion.div animate={{ rotate: detailsOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence>
                {detailsOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden space-y-3 pb-6"
                  >
                    {product.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Shipping note */}
            <motion.div variants={fadeUp} className="border-t border-border pt-6">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Complimentary shipping on orders over $300. Free returns within 14 days. Need help?{" "}
                <Link href="/contact" className="text-primary underline underline-offset-2 hover:no-underline">
                  Contact us
                </Link>
                .
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* You May Also Like */}
        <div className="mt-28 pt-16 border-t border-border">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Continue Browsing</p>
            <h2 className="font-serif text-4xl text-foreground">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
            {products
              .filter((p) => p.id !== product.id && p.category === product.category)
              .slice(0, 2)
              .concat(products.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 2))
              .slice(0, 4)
              .map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="group cursor-pointer"
                    data-testid={`card-related-${p.id}`}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-muted mb-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{p.category}</p>
                      <h3 className="font-serif text-base text-foreground mb-1">{p.name}</h3>
                      <p className="text-primary text-sm">₹{p.price}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
