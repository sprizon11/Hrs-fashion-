import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("hrs_newsletter_seen");
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hrs_newsletter_seen", "true");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-background w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 shadow-2xl overflow-hidden"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white text-foreground rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="hidden md:block bg-muted">
              <img src="/images/dress6.png" alt="Newsletter" className="w-full h-full object-cover" />
            </div>
            <div className="p-10 md:p-14 flex flex-col justify-center text-center">
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Welcome</p>
              <h3 className="font-serif text-3xl md:text-4xl mb-4 text-foreground leading-tight">
                Get 15% off your first order
              </h3>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Join our exclusive list for early access to new collections and private events.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); setIsOpen(false); }} className="flex flex-col gap-3">
                <Input
                  type="email"
                  placeholder="Email address"
                  className="rounded-none h-12 border-border focus-visible:ring-primary"
                  required
                />
                <Button type="submit" className="rounded-none h-12 uppercase tracking-widest text-xs">
                  Subscribe
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
