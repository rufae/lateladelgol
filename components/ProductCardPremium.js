'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import FlashSaleBadge from './FlashSaleBadge';

export default function ProductCardPremium({ producto, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(producto.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -12, 
        rotateY: 5,
        rotateX: 2,
        scale: 1.02
      }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      onClick={() => onClick && onClick(producto)}
      className="group relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform-gpu"
      style={{ perspective: '1000px' }}
    >
      {/* Image Container */}
      <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-red-700 via-blue-700 to-slate-900 animate-gradient-slow">
        {/* Flash Sale Badge */}
        {producto.oferta && (
          <FlashSaleBadge 
            endDate={producto.ofertaFin} 
            discount={producto.descuento} 
          />
        )}

        {(producto.imagen || producto.imagenURL) ? (
          <>
            <Image
              src={producto.imagen || producto.imagenURL}
              alt={producto.nombre || 'Producto'}
              fill
              className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sin imagen
          </div>
        )}

        {/* Gradient Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-blue-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Wishlist Heart Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(producto);
          }}
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
          title={inWishlist ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
        >
          <motion.span
            key={inWishlist ? 'filled' : 'empty'}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-2xl"
          >
            {inWishlist ? '❤️' : '🤍'}
          </motion.span>
        </motion.button>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* Ver Detalles Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-red-700 via-blue-700 to-slate-900 text-white py-3 rounded-xl font-bold shadow-2xl hover:shadow-red-500/50 transition-all relative overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-white/20"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10">Ver Detalles 👀</span>
          </motion.button>
        </motion.div>

        {/* Price Badge */}
        {producto.precio > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            className="absolute top-4 right-4 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 text-white px-5 py-2.5 rounded-full shadow-2xl font-black text-lg ring-4 ring-white/50"
          >
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              €{producto.precio}
            </motion.span>
          </motion.div>
        )}

        {/* Category Badge */}
        {producto.categoria && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: -10 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className={`absolute top-4 left-4 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-xl ring-2 ${
              producto.categoria === 'retro' ? 'bg-purple-500/90 text-white ring-purple-300' :
              producto.categoria === 'camisetas' ? 'bg-blue-500/90 text-white ring-blue-300' :
              producto.categoria === 'chaquetas' ? 'bg-red-500/90 text-white ring-red-300' :
              producto.categoria === 'chandals' ? 'bg-green-500/90 text-white ring-green-300' :
              'bg-white/90 text-gray-800 ring-gray-300'
            }`}
          >
            {producto.categoria}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 transition-colors">
          {producto.nombre || 'Sin nombre'}
        </h3>

        {producto.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {producto.descripcion}
          </p>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <motion.span 
            whileHover={{ scale: 1.05, x: 2 }}
            className="flex items-center space-x-1.5 text-green-600 font-semibold"
          >
            <motion.span
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >🚚</motion.span>
            <span>Envío rápido</span>
          </motion.span>
          <motion.span
            whileHover={{ scale: 1.1, x: 3 }}
            className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-black cursor-pointer"
          >
            <span>Ver más</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >→</motion.span>
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
