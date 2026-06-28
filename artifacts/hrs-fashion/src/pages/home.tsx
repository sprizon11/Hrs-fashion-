import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Star } from "lucide-react";
import { products } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const testimonials = [
  {
    name: "Sophia Laurent",
    role: "Fashion Editor",
    text: "HRS Fashion is my go-to for pieces that feel truly special. The quality is impeccable and every dress makes me feel like myself — only better.",
    rating: 5,
  },
  {
    name: "Amara Chen",
    role: "Interior Designer",
    text: "I wore the Ivory Lace Bridal gown on my wedding day and received so many compliments. The craftsmanship is beyond anything I expected.",
    rating: 5,
  },
  {
    name: "Isabella Russo",
    role: "Art Director",
    text: "A boutique that genuinely understands the modern woman. Elegant, romantic, and always flattering. I return every season.",
    rating: 5,
  },
];

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative h-[100dvh] w-full flex items-end justify-start overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.png"
            alt="HRS Fashion hero"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <motion.div
          className="relative z-10 px-10 md:px-20 pb-20 md:pb-28 max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="text-white/70 text-xs uppercase tracking-[0.3em] mb-5">
            New Collection 2026
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-7 leading-[1.0]"
          >
            Timeless<br />Elegance
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-lg font-light leading-relaxed mb-10 max-w-md"
          >
            Feminine style for the modern romantic. Every piece crafted to make you feel beautifully confident.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link href="/collections">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 rounded-none px-10 h-14 text-xs uppercase tracking-widest"
                data-testid="button-hero-explore"
              >
                Explore Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/10 rounded-none px-10 h-14 text-xs uppercase tracking-widest bg-transparent"
                data-testid="button-hero-story"
              >
                Our Story
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 right-12 z-10 flex flex-col items-center gap-2"
        >
          <div className="w-px h-16 bg-white/40 animate-pulse" />
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.25em] text-primary mb-6">Our Philosophy</motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif mb-8 text-foreground leading-tight">
                The Softness<br />of Luxury
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground text-base leading-[1.85] mb-8">
                HRS Fashion is more than a boutique — it's a feeling. We believe in the power of a perfect fit, the romance of delicate fabrics, and the confidence that comes from wearing something truly special.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground text-base leading-[1.85] mb-10">
                Step into a world of blush tones, gentle drapes, and uncompromising quality. Each piece is curated not for trends, but for the woman who knows her own style.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link href="/about" className="inline-flex items-center gap-3 text-xs uppercase tracking-widest text-primary hover:gap-5 transition-all duration-300">
                  Discover Our Story <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img src="/images/dress3.png" alt="Elegant dress" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-secondary border border-border flex flex-col items-center justify-center text-center p-4 shadow-lg">
                <p className="font-serif text-3xl text-foreground mb-1">8+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Curated<br />Collections</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-28 bg-secondary/20">
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Just Arrived</p>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground">New Arrivals</h2>
            </div>
            <Link
              href="/collections"
              className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-view-all"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={fadeUp} className="group cursor-pointer" data-testid={`card-featured-${product.id}`}>
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.isNew && (
                      <span className="absolute top-4 left-4 bg-white/95 px-3 py-1 text-[10px] uppercase tracking-widest text-foreground font-medium">
                        New
                      </span>
                    )}
                    {product.category !== "Bags" && (
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="w-full bg-white text-foreground uppercase tracking-widest text-[11px] h-11 flex items-center justify-center font-medium shadow-lg hover:bg-primary hover:text-white transition-colors duration-200">
                          Select Size
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1.5">{product.category}</p>
                    <h3 className="font-serif text-base text-foreground mb-1">{product.name}</h3>
                    <p className="text-primary font-medium text-sm">₹{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-14 text-center md:hidden">
            <Link href="/collections">
              <Button variant="outline" className="rounded-none uppercase tracking-widest border-primary text-primary hover:bg-primary hover:text-white">
                View All Pieces
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bridal Banner */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/banner.png"
            alt="Bridal collection"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>
        <motion.div
          className="relative z-10 text-center px-6 max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="text-white/70 text-xs uppercase tracking-[0.3em] mb-6">
            Exclusively Curated
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-serif mb-7 text-white leading-tight">
            The Bridal Edit
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/80 mb-10 leading-relaxed max-w-md mx-auto">
            Breathtaking gowns for your most unforgettable moment. Soft lace, flowing tulle, and silhouettes made to be remembered.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/collections">
              <Button className="rounded-none px-10 h-14 bg-white text-foreground hover:bg-white/90 uppercase tracking-widest text-xs" data-testid="button-shop-bridal">
                Shop Bridal
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">What They Say</p>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">Loved by Women</h2>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-secondary/30 border border-border p-9 flex flex-col"
                data-testid={`card-testimonial-${i}`}
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-8 flex-grow font-light italic text-base">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-serif text-base text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-primary/8 border-y border-primary/15">
        <div className="container mx-auto px-8 max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.25em] text-primary mb-5">
              Stay in the Loop
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-serif mb-4 text-foreground">
              Join the List
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mb-10 leading-relaxed">
              Subscribe for new arrivals, exclusive invitations, and style inspiration delivered to your inbox.
            </motion.p>
            <motion.form
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border border-border"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                className="rounded-none border-0 bg-white focus-visible:ring-0 h-14 text-sm flex-1"
                data-testid="input-newsletter-email"
              />
              <Button
                type="submit"
                className="rounded-none h-14 px-8 uppercase tracking-widest text-xs shrink-0 bg-primary hover:bg-primary/90"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </Button>
            </motion.form>
            <motion.p variants={fadeUp} className="text-xs text-muted-foreground mt-4">
              No spam, ever. Unsubscribe at any time.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
