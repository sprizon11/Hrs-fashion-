import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const values = [
  {
    title: "Considered Craftsmanship",
    desc: "We prioritize quality construction and luxurious, comfortable fabrics that feel as beautiful as they look.",
  },
  {
    title: "Enduring Style",
    desc: "Designing pieces that will be as beautiful in ten years as they are today — never chasing trends.",
  },
  {
    title: "The Feminine Spirit",
    desc: "Celebrating softness, romance, and confidence in every design, for every woman.",
  },
  {
    title: "Sustainable Curation",
    desc: "We choose thoughtfully and carefully, building a wardrobe of meaningful, lasting pieces.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative pt-40 pb-24 text-center overflow-hidden bg-secondary/20 border-b border-border">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.25em] text-primary mb-5"
        >
          Our Story
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-5xl md:text-6xl font-serif text-foreground mb-6"
        >
          A Commitment to<br />Timeless Femininity
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-lg mx-auto leading-relaxed"
        >
          Founded on the belief that every woman deserves to feel beautifully herself.
        </motion.p>
      </div>

      {/* Story Section */}
      <section className="py-28">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src="/images/dress6.png"
                  alt="Champagne wrap dress"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-primary p-8 max-w-[180px]">
                <p className="font-serif text-white text-4xl mb-1">2024</p>
                <p className="text-white/80 text-xs uppercase tracking-widest">Founded</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.25em] text-primary mb-5">
                Who We Are
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-serif mb-8 text-foreground leading-tight">
                More than a boutique.<br />It is a feeling.
              </motion.h2>
              <motion.div variants={fadeUp} className="space-y-5 text-muted-foreground leading-[1.9]">
                <p>
                  HRS Fashion was born from a simple desire: to create a space where women could find pieces that felt genuinely special — not mass-produced, not trend-chasing, but truly curated.
                </p>
                <p>
                  Every silhouette, every fabric choice, every delicate detail is considered with intention. We source only from makers who share our dedication to quality and craftsmanship.
                </p>
                <p>
                  From the soft drape of silk to the perfect blush tone of a summer dress, our pieces are designed to be loved and lived in — season after season.
                </p>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-10">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-3 text-xs uppercase tracking-widest text-primary hover:gap-5 transition-all duration-300"
                  data-testid="link-explore-collection"
                >
                  Explore the Collection <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">What Guides Us</p>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground">Our Values</h2>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-background border border-border p-8 flex flex-col"
                data-testid={`card-value-${i}`}
              >
                <div className="w-10 h-px bg-primary mb-8" />
                <h3 className="font-serif text-xl mb-4 text-foreground leading-snug">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-[1.8]">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-28">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">The Edit</p>
            <h2 className="text-4xl font-serif text-foreground">From the Boutique</h2>
          </div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {[
              { src: "/images/dress1.png", span: "row-span-2", aspect: "aspect-[3/5]" },
              { src: "/images/dress4.png", span: "", aspect: "aspect-square" },
              { src: "/images/dress5.png", span: "", aspect: "aspect-square" },
              { src: "/images/dress8.png", span: "col-span-2", aspect: "aspect-[16/9]" },
            ].map((img, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={`${img.span} overflow-hidden bg-muted ${img.aspect}`}
              >
                <img
                  src={img.src}
                  alt="Boutique editorial"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary/8 border-t border-primary/15 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="container mx-auto px-8"
        >
          <motion.h2 variants={fadeUp} className="text-4xl font-serif mb-5 text-foreground">
            Ready to Find Your Piece?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground mb-8 max-w-md mx-auto">
            Explore our full collection and discover the dress that was made for you.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link href="/collections">
              <button className="bg-primary text-white px-10 h-14 text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors" data-testid="button-about-cta">
                Shop Now
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
