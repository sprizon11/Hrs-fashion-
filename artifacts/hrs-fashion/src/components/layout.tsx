import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X, Facebook, Instagram, Twitter } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/90 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-semibold text-foreground tracking-wide">
            HRS Fashion
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm uppercase tracking-widest hover:text-primary transition-colors ${
                  location === link.path ? "text-primary font-medium" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-serif border-b border-border pb-4 ${
                  location === link.path ? "text-primary" : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">{children}</main>

      <footer className="bg-secondary/50 pt-20 pb-10 mt-20 border-t border-border">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-serif font-semibold mb-6">HRS Fashion</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Curated elegance for the modern woman. Timeless, feminine style designed to make you feel beautiful, confident, and romantic.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-6 uppercase tracking-widest text-sm">Shop</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/collections" className="hover:text-primary transition-colors">All Collections</Link></li>
              <li><Link href="/collections" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/collections" className="hover:text-primary transition-colors">Evening Wear</Link></li>
              <li><Link href="/collections" className="hover:text-primary transition-colors">Bridal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-6 uppercase tracking-widest text-sm">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-6 uppercase tracking-widest text-sm">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
            <p className="text-sm text-muted-foreground">Subscribe to our newsletter for early access to new collections.</p>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HRS Fashion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
