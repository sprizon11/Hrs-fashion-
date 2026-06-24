import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] lg:aspect-square bg-muted"
          >
            <img 
              src="/images/dress6.png" 
              alt="Model wearing champagne wrap dress" 
              className="object-cover w-full h-full"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl"
          >
            <h2 className="text-xs uppercase tracking-widest text-primary mb-4">Our Story</h2>
            <h1 className="text-4xl md:text-5xl font-serif mb-8 text-foreground leading-tight">
              A commitment to <br />timeless femininity.
            </h1>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2024, HRS Fashion was born from a simple desire: to create a space where women could find pieces that felt genuinely special. We believe that getting dressed should be a romantic ritual, an expression of inner beauty.
              </p>
              <p>
                Every silhouette, every fabric choice, every delicate detail is considered. We curate our collections not based on fleeting trends, but on enduring elegance. From the soft drape of silk against the skin to the perfect blush tone of a summer dress, our pieces are designed to be loved and lived in.
              </p>
              <p>
                Welcome to our boutique. We hope you find something beautiful.
              </p>
            </div>
            
            <div className="mt-12 pt-12 border-t border-border">
              <h3 className="font-serif text-2xl mb-6">Our Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 mr-4 shrink-0" />
                  <span className="text-foreground"><strong>Considered Craftsmanship:</strong> We prioritize quality construction and luxurious, comfortable fabrics.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 mr-4 shrink-0" />
                  <span className="text-foreground"><strong>Enduring Style:</strong> Designing pieces that will be as beautiful in ten years as they are today.</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 mr-4 shrink-0" />
                  <span className="text-foreground"><strong>The Feminine Spirit:</strong> Celebrating softness, romance, and confidence in every design.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="aspect-square bg-muted overflow-hidden">
            <img src="/images/dress4.png" alt="Detail shot" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="aspect-square bg-muted overflow-hidden">
            <img src="/images/dress5.png" alt="Detail shot" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="aspect-square bg-muted overflow-hidden">
            <img src="/images/dress8.png" alt="Detail shot" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
