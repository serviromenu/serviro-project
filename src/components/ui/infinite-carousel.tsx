"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";

interface InfiniteCarouselProps {
  templates: {
    id: string;
    name: string;
    description: string;
    image: string;
  }[];
}

export default function InfiniteCarousel({ templates }: InfiniteCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % templates.length);
  }, [templates.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + templates.length) % templates.length);
  }, [templates.length]);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, 4000);
  };

  useEffect(() => {
    if (!isHovered && templates.length > 1) {
      startAutoPlay();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, templates.length, nextSlide]);

  const template = templates[currentIndex];

  return (
    <div
      className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-2xl aspect-[21/9] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={template.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={template.image}
            alt={template.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h3 className="text-2xl font-light">{template.name}</h3>
            <p className="text-sm text-white/70 mt-1 line-clamp-1">
              {template.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* دکمه قبلی (چپ) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/40"
      >
        <HiOutlineChevronLeft className="text-xl" />
      </button>

      {/* دکمه بعدی (راست) */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/40"
      >
        <HiOutlineChevronRight className="text-xl" />
      </button>
    </div>
  );
}