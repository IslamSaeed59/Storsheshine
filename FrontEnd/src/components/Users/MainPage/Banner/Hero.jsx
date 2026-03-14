import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "../../../common/OptimizedImage";

// Default slides in case no data is fetched
const defaultSlides = [
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    title: "New Arrivals",
    subtitle: "Spring Collection 2026",
    description: "Discover the latest trends in women's fashion, curated for the modern aesthetic.",
    buttonText: "Shop Collection",
    buttonLink: "/products",
  },
  {
    src: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=2070&auto=format&fit=crop",
    title: "Timeless Beauty",
    subtitle: "Premium Cosmetics",
    description: "Elevate your daily routine with our exclusive range of skincare and makeup.",
    buttonText: "Explore Beauty",
    buttonLink: "/products?category=beauty",
  },
  {
    src: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2070&auto=format&fit=crop",
    title: "Chic Accessories",
    subtitle: "The Perfect Details",
    description: "Complete your look with our handpicked selection of bags and jewelry.",
    buttonText: "View Accessories",
    buttonLink: "/products?category=accessories",
  },
];

const Hero = ({ heroData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Determine which slides to show
  let slides = defaultSlides;
  if (heroData && heroData.HeroImage && heroData.HeroImage.length > 0) {
    slides = heroData.HeroImage.map(imageSrc => ({
      src: imageSrc,
      title: heroData.HeroName || "Welcome to SheShine",
      subtitle: "Featured",
      description: heroData.HeroDescription || "Explore our collection",
      buttonText: heroData.HeroButton || "Shop Now",
      buttonLink: "/products",
    }));
  }

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[100vh] min-h-[600px] overflow-hidden bg-gray-900">
      <AnimatePresence initial={false}>
        <motion.div

          key={currentIndex}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.8, 0.25, 1] }}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <OptimizedImage
            src={slides[currentIndex].src}
            alt={slides[currentIndex].title}
            className="w-full h-full"
            style={{ position: 'absolute' }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4 max-w-5xl mx-auto">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <span className="mb-4 text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-white/90">
            {slides[currentIndex].subtitle}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-6 leading-tight">
            {slides[currentIndex].title}
          </h1>
          <p className="max-w-2xl text-lg md:text-xl font-light text-white/90 mb-10 leading-relaxed">
            {slides[currentIndex].description}
          </p>
          <a
            href={slides[currentIndex].buttonLink}
            className="group relative px-8 py-4 bg-white text-gray-900 overflow-hidden rounded-none font-medium tracking-wide transition-all"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              {slides[currentIndex].buttonText}
            </span>
            <div className="absolute inset-0 h-full w-full bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </a>
        </motion.div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 text-white/70 hover:text-white transition-colors focus:outline-none"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={40} strokeWidth={1} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 text-white/70 hover:text-white transition-colors focus:outline-none"
        aria-label="Next Slide"
      >
        <ChevronRight size={40} strokeWidth={1} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 transition-all duration-300 ${
              currentIndex === index ? "w-10 bg-white" : "w-4 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
