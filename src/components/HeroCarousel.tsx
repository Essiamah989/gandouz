"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface HeroCarouselProps {
  images: string[];
}

export default function HeroCarousel({ images }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) {
    return (
      <div className="w-72 h-72 lg:w-96 lg:h-96 relative flex items-center justify-center bg-white/5 border border-white/10 rounded-full p-8 backdrop-blur-md shadow-2xl">
        <div className="absolute inset-0 rounded-full bg-[#F5D800]/5 blur-3xl animate-pulse" />
        <Image
          src="/logo.png"
          alt="Gandouz Logo"
          width={250}
          height={250}
          className="object-contain filter invert brightness-0 drop-shadow-[0_10px_30px_rgba(245,216,0,0.25)]"
          priority
        />
      </div>
    );
  }

  return (
    <div className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#06091F]/80 to-transparent z-10 opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[#F5D800]/5 blur-3xl z-0" />
      <div className="overflow-hidden w-full h-full relative z-10" ref={emblaRef}>
        <div className="flex w-full h-full">
          {images.map((src, index) => (
            <div className="relative flex-[0_0_100%] min-w-0 w-full h-full" key={index}>
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: index === selectedIndex ? 1 : 1.1, opacity: index === selectedIndex ? 1 : 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src={src}
                  alt={`Hero ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination Indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`transition-all duration-500 rounded-full ${
              index === selectedIndex
                ? "w-8 h-2 bg-[#F5D800] shadow-[0_0_10px_rgba(245,216,0,0.6)]"
                : "w-2 h-2 bg-white/40 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
