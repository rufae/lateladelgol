'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function FeaturedCarousel({ productos }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % productos.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + productos.length) % productos.length);
  };

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % productos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [productos.length]);

  if (!productos || productos.length === 0) return null;

  const currentProduct = productos[currentIndex];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5
      }
    })
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-r from-red-900 via-slate-900 to-blue-900 rounded-3xl overflow-hidden shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative h-full flex items-center justify-between px-8">
        {/* Previous Button */}
        <motion.button
          onClick={handlePrev}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          className="z-20 w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg hover:bg-white/30 transition-all"
        >
          <span className="text-2xl">←</span>
        </motion.button>

        {/* Carousel Content */}
        <div className="flex-1 h-full relative overflow-hidden mx-8">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex items-center space-x-8 max-w-4xl mx-auto">
                {/* Product Image */}
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="relative w-72 h-72 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 bg-white"
                >
                  <Image
                    src={currentProduct.imagenURL || currentProduct.imagen || '/placeholder.png'}
                    alt={currentProduct.nombre}
                    fill
                    className="object-cover"
                  />
                  {currentProduct.oferta && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg">
                      🔥 -{currentProduct.descuento}% OFF
                    </div>
                  )}
                </motion.div>

                {/* Product Info */}
                <div className="flex-1 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-4">
                      ⭐ Destacado
                    </span>
                    <h3 className="text-4xl font-black mb-4 line-clamp-2">
                      {currentProduct.nombre}
                    </h3>
                    <p className="text-lg text-white/80 mb-6 line-clamp-3">
                      {currentProduct.descripcion}
                    </p>
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-5xl font-black"
                      >
                        {currentProduct.precio}€
                      </motion.div>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all"
                      >
                        Ver Detalles →
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Button */}
        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          className="z-20 w-14 h-14 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg hover:bg-white/30 transition-all"
        >
          <span className="text-2xl">→</span>
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
        {productos.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleDotClick(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`rounded-full transition-all ${
              index === currentIndex
                ? 'w-12 h-3 bg-white'
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        key={currentIndex}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 5, ease: 'linear' }}
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-red-600 origin-left"
        style={{ transformOrigin: '0% 50%' }}
      />
    </div>
  );
}
