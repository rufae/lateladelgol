'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProductCard({ producto, isAdmin, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        { (producto.imagen || producto.imagenURL) ? (
          <Image
            src={producto.imagen || producto.imagenURL}
            alt={producto.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-gray-400">No image</div>
        )}
        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          €{producto.precio}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {producto.categoria}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
          {producto.nombre}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {producto.descripcion}
        </p>

        {isAdmin && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(producto)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(producto.id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
