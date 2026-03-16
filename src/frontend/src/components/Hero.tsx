import { motion } from "motion/react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/uploads/unnamed-2-2.jpg"
          alt="Architectural work"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-20 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-primary-foreground/50 text-xs tracking-[0.3em] uppercase mb-6 font-sans">
            Portfolio — Architecture & Design
          </p>
          <h1 className="font-display text-primary-foreground text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight mb-6">
            Jarod
            <br />
            <em className="not-italic text-accent">Robledo</em>
          </h1>
          <p className="font-sans text-primary-foreground/60 text-base md:text-lg max-w-md leading-relaxed">
            Architectural Design &amp; Visual Storytelling
          </p>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-16 flex items-center gap-3"
        >
          <div className="h-px w-12 bg-primary-foreground/30" />
          <span className="text-primary-foreground/30 text-xs tracking-[0.2em] uppercase">
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}
