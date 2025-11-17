'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function ProductCardList({ producto, onClick }) {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagenURL: producto.imagenURL,
      quantity: 1
    });
  };

  const getCategoryColor = (cat) => {
    const colors = {
      retro: 'from-red-600 to-blue-700',
      camisetas: 'from-blue-600 to-blue-800',
      chaquetas: 'from-red-600 to-red-800',
      chandals: 'from-slate-700 to-slate-900',
      moda: 'from-red-500 to-blue-600'
    };
    return colors[cat] || 'from-gray-600 to-gray-800';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(producto)}
      className="bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-gray-800 flex flex-col sm:flex-row"
    >
      {/* Image Section */}
      <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-900">
        <Image
          src={producto.imagenURL || '/placeholder.png'}
          alt={producto.nombre}
          fill
          className="object-cover"
        />
        {producto.descuento && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
          >
            🔥 -{producto.descuento}%
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Category Badge */}
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(producto.categoria)} mb-3`}
          >
            {producto.categoria}
          </motion.span>

          {/* Title */}
          <h3 className="text-xl font-black text-white mb-2 line-clamp-2">
            {producto.nombre}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-300 mb-4 line-clamp-2">
            {producto.descripcion}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="flex flex-col">
            {producto.precioOriginal && (
              <span className="text-sm text-gray-400 line-through">
                {producto.precioOriginal}€
              </span>
            )}
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {producto.precio}€
            </motion.span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Quick View Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClick(producto);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
              title="Ver detalles"
            >
              <span className="text-xl">👁️</span>
            </motion.button>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="px-5 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all"
            >
              <span className="mr-2">🛒</span>
              Añadir
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
