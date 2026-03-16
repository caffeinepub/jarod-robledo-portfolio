import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

interface LightboxProps {
  photos: { src: string; title: string; category: string }[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({
  photos,
  initialIndex,
  onClose,
}: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  }, [photos.length]);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i < photos.length - 1 ? i + 1 : 0));
  }, [photos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  const current = photos[index];

  return (
    <AnimatePresence>
      <motion.div
        data-ocid="lightbox.modal"
        className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        {/* Close */}
        <button
          type="button"
          data-ocid="lightbox.close_button"
          onClick={onClose}
          className="absolute top-6 right-6 text-primary-foreground/60 hover:text-primary-foreground transition-colors z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Prev */}
        <button
          type="button"
          data-ocid="lightbox.pagination_prev"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-4 md:left-8 text-primary-foreground/60 hover:text-primary-foreground transition-colors z-10 p-2"
          aria-label="Previous"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Next */}
        <button
          type="button"
          data-ocid="lightbox.pagination_next"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-4 md:right-8 text-primary-foreground/60 hover:text-primary-foreground transition-colors z-10 p-2"
          aria-label="Next"
        >
          <ChevronRight size={32} />
        </button>

        {/* Image */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl max-h-[85vh] px-16 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.src}
              alt={current.title}
              className="max-h-[75vh] max-w-full object-contain shadow-architectural"
            />
            <div className="mt-4 text-center">
              <p className="text-primary-foreground/40 text-xs tracking-widest uppercase">
                {current.category}
              </p>
              <p className="text-primary-foreground font-display text-lg mt-1">
                {current.title}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground/40 text-xs tracking-widest">
          {index + 1} / {photos.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
