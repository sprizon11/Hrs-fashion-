import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/data";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero.png" 
            alt="Elegant evening gown hero" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <motion.div 
          className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.h1 
            variants={fadeIn}
            className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 text-white"
          >
            Timeless Elegance
          </motion.h1>
          <motion.p 
            variants={fadeIn}
            className="text-lg md:text-xl font-light tracking-wide mb-10 max-w-2xl mx-auto"
          >
            Discover curated, feminine style for the modern romantic. Every piece crafted to make you feel beautifully confident.
          </motion.p>
          <motion.div variants={fadeIn}>
            <Link href="/collections">
              <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-none px-10 py-6 text-sm uppercase tracking-widest">
                Explore Collection
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-8 text-foreground">The Softness of Luxury</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              HRS Fashion is more than a boutique. It's a feeling. We believe in the power of a perfect fit, the romance of delicate fabrics, and the confidence that comes from wearing something truly special. Step into a world of blush tones, gentle drapes, and uncompromising quality.
            </p>
            <Link href="/about" className="inline-block border-b border-primary text-primary pb-1 uppercase tracking-widest text-sm hover:text-foreground transition-colors">
              Our Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">New Arrivals</h2>
            <Link href="/collections" className="hidden md:block uppercase tracking-widest text-sm text-muted-foreground hover:text-primary transition-colors">
              View All
            </Link>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={fadeIn} className="group cursor-pointer">
                <Link href="/collections">
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
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
                  </div>
                  <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">${product.price}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-12 text-center md:hidden">
            <Link href="/collections">
              <Button variant="outline" className="rounded-none uppercase tracking-widest">
                View All
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/banner.png" 
            alt="Soft fabric banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/40" />
        </div>
        <motion.div 
          className="relative z-10 text-center px-6 max-w-2xl bg-background/80 backdrop-blur-sm p-12 m-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">The Bridal Edit</h2>
          <p className="text-muted-foreground mb-8">
            Discover our curated selection of breathtaking gowns for your most unforgettable moments. Soft lace, flowing tulle, and timeless silhouettes.
          </p>
          <Link href="/collections">
            <Button className="rounded-none px-8 uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90">
              Shop Bridal
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-serif mb-4 text-foreground">Join the List</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to receive updates on new arrivals, exclusive invitations, and style inspiration.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12"
              />
              <Button type="submit" className="rounded-none h-12 px-8 uppercase tracking-widest shrink-0">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
