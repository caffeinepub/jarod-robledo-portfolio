import { Mail, Phone } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase mb-4">
            Get In Touch
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight mb-12">
            Contact
          </h2>

          <div className="flex flex-col gap-6">
            <a
              href="mailto:Jarodrobledo28@gmail.com"
              className="group flex items-center gap-4 text-foreground hover:text-accent transition-colors"
            >
              <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-accent transition-colors">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-0.5">
                  Email
                </p>
                <p className="font-medium">Jarodrobledo28@gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+17073249474"
              className="group flex items-center gap-4 text-foreground hover:text-accent transition-colors"
            >
              <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:border-accent transition-colors">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-0.5">
                  Phone
                </p>
                <p className="font-medium">(707) 324-9474</p>
              </div>
            </a>
          </div>

          <div className="mt-16 h-px w-full bg-border" />
          <p className="mt-6 text-muted-foreground text-sm leading-relaxed">
            Based in California. Available for architectural photography, design
            collaboration, and visual communications projects.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
