import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const looks = [
  {
    id: "1",
    title: "The Romantic Evening",
    subtitle: "Evening Collection",
    description: "Silk against skin, candlelight overhead. A night made for beauty.",
    image: "/images/dress1.png",
    productId: "1",
    align: "left",
  },
  {
    id: "2",
    title: "Golden Afternoon",
    subtitle: "Summer Collection",
    description: "Warmth, ease, and the kind of dress that makes afternoons feel endless.",
    image: "/images/dress2.png",
    productId: "2",
    align: "right",
  },
  {
    id: "3",
    title: "After Dark",
    subtitle: "Formal Collection",
    description: "When the occasion demands more — lace, structure, and unforgettable presence.",
    image: "/images/dress3.png",
    productId: "3",
    align: "left",
  },
  {
    id: "4",
    title: "Garden Romance",
    subtitle: "Casual Collection",
    description: "Florals in the morning light. Effortless and every bit as lovely.",
    image: "/images/dress4.png",
    productId: "4",
    align: "right",
  },
  {
    id: "5",
    title: "The Bridal Moment",
    subtitle: "Bridal Collection",
    description: "For the day you have dreamed of your entire life. Nothing less than perfect.",
    image: "/images/dress8.png",
    productId: "8",
    align: "left",
  },
  {
    id: "6",
    title: "Champagne Toast",
    subtitle: "Evening Collection",
    description: "Celebrations call for silk, sparkle, and a dress worth remembering.",
    image: "/images/dress6.png",
    productId: "6",
    align: "right",
  },
];

export default function Lookbook() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative pt-40 pb-24 text-center bg-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/hero.png" alt="" className="w-full h-full object-cover object-top" />
        </div>
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.3em] text-white/60 mb-5"
          >
            Season 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="text-6xl md:text-7xl font-serif text-white mb-6 leading-none"
          >
            The Lookbook
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-white/60 max-w-md mx-auto leading-relaxed"
          >
            An editorial journey through the HRS Fashion 2026 collection. Each look tells a story.
          </motion.p>
        </div>
      </div>

      {/* Looks */}
      <div className="overflow-hidden">
        {looks.map((look, i) => (
          <motion.div
            key={look.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9 }}
            className={`grid grid-cols-1 lg:grid-cols-2 min-h-[85vh] ${i % 2 === 0 ? "" : ""}`}
            data-testid={`look-${look.id}`}
          >
            {/* Image side */}
            <div className={`relative overflow-hidden ${look.align === "right" ? "lg:order-2" : "lg:order-1"}`}>
              <motion.div
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-full min-h-[60vh] lg:min-h-full"
              >
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm px-4 py-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary">{look.subtitle}</p>
              </div>
            </div>

            {/* Text side */}
            <div
              className={`flex items-center justify-center p-12 md:p-20 bg-background ${
                look.align === "right" ? "lg:order-1" : "lg:order-2"
              } ${i % 2 === 0 ? "bg-background" : "bg-secondary/20"}`}
            >
              <motion.div
                initial={{ opacity: 0, x: look.align === "right" ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-md"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">Look {String(i + 1).padStart(2, "0")}</p>
                <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6 leading-tight">
                  {look.title}
                </h2>
                <p className="text-muted-foreground text-base leading-[1.9] mb-10">
                  {look.description}
                </p>
                <Link
                  href={`/product/${look.productId}`}
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-widest text-foreground border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors group"
                  data-testid={`link-shop-look-${look.id}`}
                >
                  Shop This Look
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <section className="py-28 bg-foreground text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-6">The Full Collection</p>
          <h2 className="font-serif text-5xl text-white mb-8">Discover Every Piece</h2>
          <Link href="/collections">
            <button
              className="bg-white text-foreground px-12 h-14 text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-colors duration-300"
              data-testid="button-lookbook-cta"
            >
              Shop All Styles
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
