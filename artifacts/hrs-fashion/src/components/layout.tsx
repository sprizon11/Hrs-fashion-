import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Instagram, Facebook, Twitter, Heart, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { CartDrawer } from "@/components/cart-drawer";
import { NewsletterPopup } from "@/components/newsletter-popup";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen, location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: "Lookbook", path: "/lookbook" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Sale", path: "/sale", special: true },
  ];

  const isHome = location === "/";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled || !isHome
            ? "bg-background/95 backdrop-blur-md shadow-sm py-4 border-b border-border"
            : "bg-transparent py-7"
        }`}
      >
        <div className="container mx-auto px-8 flex items-center justify-between">
          <Link href="/" className={`text-2xl font-serif font-semibold tracking-wide transition-colors duration-300 ${isScrolled || !isHome ? "text-foreground" : "text-white"}`} data-testid="link-home-logo">
            HRS Fashion
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-xs uppercase tracking-widest font-medium transition-colors duration-300 relative group ${
                  link.special 
                    ? "text-red-500 hover:text-red-600" 
                    : location === link.path
                    ? "text-primary"
                    : isScrolled || !isHome
                    ? "text-foreground/70 hover:text-primary"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-full h-px ${link.special ? "bg-red-500" : "bg-primary"} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${location === link.path ? "scale-x-100" : ""}`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/search" className={`relative p-2.5 transition-colors duration-300 ${isScrolled || !isHome ? "text-foreground hover:text-primary" : "text-white hover:text-white/70"}`}>
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/wishlist" className={`hidden md:block relative p-2.5 transition-colors duration-300 ${isScrolled || !isHome ? "text-foreground hover:text-primary" : "text-white hover:text-white/70"}`}>
              <Heart className="w-5 h-5" />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-semibold"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              onClick={openCart}
              className={`relative p-2.5 transition-colors duration-300 ${isScrolled || !isHome ? "text-foreground hover:text-primary" : "text-white hover:text-white/70"}`}
              data-testid="button-open-cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {totalCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-semibold"
                    data-testid="text-cart-count"
                  >
                    {totalCount > 9 ? "9+" : totalCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              className={`md:hidden p-2.5 transition-colors duration-300 ${isScrolled || !isHome ? "text-foreground" : "text-white"}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-28 px-8 md:hidden"
          >
            <nav className="flex flex-col gap-0">
              {[...navLinks, {name: "Wishlist", path: "/wishlist"}].map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block font-serif text-3xl py-5 border-b border-border/50 ${
                      link.special ? "text-red-500" : location === link.path ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">{children}</main>

      <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border">
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif font-semibold mb-5">HRS Fashion</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              Curated elegance for the modern woman. Timeless, feminine style designed to make you feel beautiful and confident.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-6 uppercase tracking-widest text-foreground">Shop</h4>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li><Link href="/collections" className="hover:text-primary transition-colors">All Collections</Link></li>
              <li><Link href="/lookbook" className="hover:text-primary transition-colors">Lookbook</Link></li>
              <li><Link href="/sale" className="hover:text-primary transition-colors text-red-500">Sale</Link></li>
              <li><Link href="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-6 uppercase tracking-widest text-foreground">Company</h4>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-6 uppercase tracking-widest text-foreground">Newsletter</h4>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Early access to new collections, exclusive styling tips, and invitations to private events.
            </p>
            <div className="flex border border-border">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button className="px-4 py-3 bg-primary text-white text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>
        
        {/* Secure Payment */}
        <div className="container mx-auto px-8 mb-8 flex gap-3 opacity-60">
           <span className="text-[10px] border border-border px-2 py-1 uppercase tracking-widest">Visa</span>
           <span className="text-[10px] border border-border px-2 py-1 uppercase tracking-widest">Mastercard</span>
           <span className="text-[10px] border border-border px-2 py-1 uppercase tracking-widest">PayPal</span>
        </div>

        <div className="container mx-auto px-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HRS Fashion. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      <CartDrawer />
      <NewsletterPopup />
    </div>
  );
}
