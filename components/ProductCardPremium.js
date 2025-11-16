'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function ProductCardPremium({ producto, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick && onClick(producto)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
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
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Ver Detalles Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute inset-x-0 bottom-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-colors">
            Ver Detalles
          </button>
        </motion.div>

        {/* Price Badge */}
        {producto.precio > 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full shadow-lg font-bold text-lg"
          >
            €{producto.precio}
          </motion.div>
        )}

        {/* Category Badge */}
        {producto.categoria && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-md"
          >
            {producto.categoria}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {producto.nombre || 'Sin nombre'}
        </h3>

        {producto.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {producto.descripcion}
          </p>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <span>🚚</span>
            <span>Envío rápido</span>
          </span>
          <motion.span
            whileHover={{ scale: 1.1 }}
            className="flex items-center space-x-1 text-blue-600 font-semibold cursor-pointer"
          >
            <span>Ver más</span>
            <span>→</span>
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
