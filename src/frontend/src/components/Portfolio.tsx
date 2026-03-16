import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useGetAllPhotos } from "../hooks/useQueries";
import Lightbox from "./Lightbox";

const DEMO_PHOTOS = [
  {
    src: "/assets/uploads/unnamed-2-2.jpg",
    title: "Pavilion Structure",
    category: "Architecture",
  },
  {
    src: "/assets/uploads/unnamed-1-3.jpg",
    title: "Interior Render — Kitchen",
    category: "Interior Design",
  },
  {
    src: "/assets/uploads/unnamed-4.jpg",
    title: "Kitchen Angle II",
    category: "Interior Design",
  },
  {
    src: "/assets/uploads/pict210224_1104330000-5.jpg",
    title: "Architectural Render",
    category: "Renders",
  },
  {
    src: "/assets/uploads/02-16-2020-csc-design-8507-Mill-station-rd-5-of-33--6.jpg",
    title: "Kitchen Study",
    category: "Photography",
  },
  {
    src: "/assets/uploads/PIC04235-Edit-7.jpg",
    title: "Interior Bathroom",
    category: "Photography",
  },
  {
    src: "/assets/uploads/PIC04262-Edit-Edit-8.jpg",
    title: "Bedroom with View",
    category: "Photography",
  },
  {
    src: "/assets/uploads/02-16-2020-csc-design-8507-Mill-station-rd-20-of-33--9.jpg",
    title: "Staircase Detail",
    category: "Photography",
  },
  {
    src: "/assets/uploads/PIC04113-Edit-10.jpg",
    title: "Kitchen Detail",
    category: "Photography",
  },
  {
    src: "/assets/uploads/Healsburg-home-4-3-11.jpg",
    title: "Healdsburg Exterior",
    category: "Architecture",
  },
];

const CATEGORIES = [
  "All",
  "Architecture",
  "Interior Design",
  "Renders",
  "Photography",
];

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

type LightboxItem = { src: string; title: string; category: string };

export default function Portfolio() {
  const { data: photos, isLoading } = useGetAllPhotos();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const hasRealPhotos = photos && photos.length > 0;

  const items: LightboxItem[] = hasRealPhotos
    ? photos.map((p) => ({
        src: p.blobKey.getDirectURL(),
        title: p.title,
        category: p.category,
      }))
    : DEMO_PHOTOS;

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((p) => p.category === activeCategory);

  return (
    <section
      id="work"
      className="py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase mb-4">
          Selected Work
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          Portfolio
        </h2>
        {!hasRealPhotos && (
          <p className="mt-3 text-sm text-muted-foreground">
            Showing sample projects — log in as admin to upload your work.
          </p>
        )}
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            data-ocid="portfolio.tab"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs tracking-widest uppercase font-medium transition-all border ${
              activeCategory === cat
                ? "bg-foreground text-primary-foreground border-foreground"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="portfolio.loading_state"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {SKELETON_KEYS.map((k, i) => (
            <Skeleton
              key={k}
              className={`w-full ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div
          data-ocid="portfolio.empty_state"
          className="py-24 text-center border border-dashed border-border"
        >
          <p className="text-muted-foreground text-sm">
            No work in this category yet.
          </p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <motion.div
          layout
          className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.src}
                data-ocid={`portfolio.item.${i + 1}`}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="break-inside-avoid mb-4 group cursor-pointer relative overflow-hidden"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-300 flex items-end">
                  <div className="p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-primary-foreground text-xs tracking-widest uppercase font-medium">
                      {photo.category}
                    </p>
                    <p className="text-primary-foreground/80 text-sm font-display">
                      {photo.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={filtered}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
