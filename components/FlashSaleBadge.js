'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function FlashSaleBadge({ endDate, discount }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!endDate) return { hours: 0, minutes: 0, seconds: 0 };
    
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!endDate) return;

    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setIsExpired(true);
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isExpired) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      className="absolute top-3 left-3 z-10"
    >
      <motion.div
        animate={{
          rotate: [0, -2, 2, -2, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 2
        }}
        className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white px-3 py-2 rounded-xl shadow-lg backdrop-blur-sm"
      >
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center space-x-1 mb-1"
          >
            <span className="text-lg">🔥</span>
            <span className="font-black text-sm">OFERTA</span>
          </motion.div>
          
          {discount && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
              className="text-2xl font-black"
            >
              -{discount}%
            </motion.div>
          )}

          {endDate && !isExpired && (
            <motion.div 
              className="text-xs font-bold mt-1 flex items-center space-x-1 bg-black/30 px-2 py-0.5 rounded"
              animate={{
                boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 8px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)']
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span>⏰</span>
              <span>
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
