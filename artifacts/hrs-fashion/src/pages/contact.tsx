import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const infoItems = [
  {
    icon: MapPin,
    label: "Visit Us",
    lines: ["123 Rosemont Avenue, Suite 400", "New York, NY 10012"],
  },
  {
    icon: Phone,
    label: "Call Us",
    lines: ["+1 (212) 555-0199"],
  },
  {
    icon: Mail,
    label: "Email Us",
    lines: ["hello@hrsfashion.com"],
  },
  {
    icon: Clock,
    label: "Hours",
    lines: ["Mon – Fri: 10am – 7pm", "Saturday: 10am – 6pm", "Sunday: 12pm – 5pm"],
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We will get back to you within 24 hours.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative pt-40 pb-24 text-center bg-secondary/20 border-b border-border">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.25em] text-primary mb-5"
        >
          We'd Love to Hear from You
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-5xl md:text-6xl font-serif text-foreground mb-6"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-lg mx-auto leading-relaxed"
        >
          Questions about our collections, styling advice, or bridal fittings — we are always here for you.
        </motion.p>
      </div>

      <div className="container mx-auto px-8 max-w-6xl py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Form — takes 3 cols */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <div className="bg-card border border-border p-10 md:p-14">
              <h2 className="font-serif text-3xl mb-10 text-foreground">Send a Message</h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl mb-3 text-foreground">Thank You</h3>
                  <p className="text-muted-foreground">We have received your message and will be in touch within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <div className="space-y-2.5">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">First Name</label>
                      <Input
                        required
                        className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12 text-sm"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Last Name</label>
                      <Input
                        required
                        className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12 text-sm"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email Address</label>
                    <Input
                      type="email"
                      required
                      className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12 text-sm"
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Subject</label>
                    <Input
                      className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12 text-sm"
                      data-testid="input-subject"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Message</label>
                    <Textarea
                      required
                      rows={6}
                      className="rounded-none border-border bg-transparent focus-visible:ring-primary resize-none text-sm"
                      data-testid="input-message"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-none h-14 uppercase tracking-widest text-xs bg-primary hover:bg-primary/90 text-white"
                    data-testid="button-send-message"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Info — takes 2 cols */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-8"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {infoItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex gap-5 p-7 bg-secondary/20 border border-border"
                data-testid={`info-item-${i}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2.5">{item.label}</p>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-foreground text-sm leading-[1.8]">{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Map Placeholder */}
            <motion.div
              variants={fadeUp}
              className="flex-grow min-h-[200px] bg-secondary/30 border border-border flex items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, hsl(340 65% 65%) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="text-center text-muted-foreground relative z-10">
                <MapPin className="w-8 h-8 mx-auto mb-3 text-primary/40" />
                <p className="text-[10px] uppercase tracking-[0.2em]">123 Rosemont Avenue</p>
                <p className="text-[10px] uppercase tracking-[0.2em]">New York, NY</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
