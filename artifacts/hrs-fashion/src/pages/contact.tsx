import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We will get back to you shortly.",
    });
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif mb-6 text-foreground"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Whether you have a question about our collections, need styling advice, or want to inquire about a bridal fitting, we're here for you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-card p-8 md:p-12 border border-border">
              <h2 className="font-serif text-2xl mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm uppercase tracking-widest text-muted-foreground">First Name</label>
                    <Input required className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm uppercase tracking-widest text-muted-foreground">Last Name</label>
                    <Input required className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">Email</label>
                  <Input type="email" required className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">Message</label>
                  <Textarea required rows={5} className="rounded-none border-border bg-transparent focus-visible:ring-primary resize-none" />
                </div>
                <Button type="submit" className="w-full rounded-none h-14 uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90">
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-serif text-xl mb-6">Boutique</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">123 Rosemont Avenue<br />Suite 400<br />New York, NY 10012</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-muted-foreground">+1 (212) 555-0199</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-muted-foreground">hello@hrsfashion.com</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-serif text-xl mb-6">Hours</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-muted-foreground">
                      <p className="mb-2"><strong className="text-foreground font-medium">Mon - Fri:</strong> 10am - 7pm</p>
                      <p className="mb-2"><strong className="text-foreground font-medium">Saturday:</strong> 10am - 6pm</p>
                      <p><strong className="text-foreground font-medium">Sunday:</strong> 12pm - 5pm</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex-grow min-h-[300px] bg-secondary/50 border border-border flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-10 h-10 mx-auto mb-4 opacity-50" />
                <p className="uppercase tracking-widest text-sm">Interactive Map Placeholder</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
