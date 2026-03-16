import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "motion/react";

const SKILLS = [
  "Photoshop",
  "InDesign",
  "Lightroom",
  "Premiere Pro",
  "AutoCAD",
  "Autodesk Revit",
  "Photography / Videography",
];

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img
              src="/assets/uploads/PIC04262-Edit-Edit-8.jpg"
              alt="Portfolio work"
              className="w-full object-cover aspect-[4/5] shadow-architectural"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-accent opacity-60" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase mb-4">
              About
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight mb-8">
              Jarod Robledo
            </h2>

            <p className="text-muted-foreground leading-relaxed mb-8">
              Jarod Robledo is a detail-oriented designer and visual storyteller
              based in California, with a background in architectural
              photography, graphic communications, and CAD. Proficient in Adobe
              Creative Suite, AutoCAD, and Autodesk Revit.
            </p>

            <div className="mb-10">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                Skills &amp; Tools
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="border-border text-muted-foreground font-sans text-xs tracking-wide rounded-none px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <a href="/assets/uploads/Resume-update-01-05-2026-1.pdf" download>
              <Button
                data-ocid="resume.button"
                className="bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-none px-8 py-3 text-xs tracking-widest uppercase gap-2"
              >
                <Download size={14} />
                Download Résumé
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
