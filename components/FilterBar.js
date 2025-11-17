'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FilterBar({ onFilterChange }) {
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('novedad');
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    setPriceRange(newRange);
    onFilterChange?.({ priceRange: newRange, sortBy });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onFilterChange?.({ priceRange, sortBy: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 bg-gradient-to-r from-white/80 via-red-50/80 to-blue-50/80 backdrop-blur-xl rounded-2xl shadow-xl border border-red-200/50 overflow-hidden"
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-red-100/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🔍</span>
          <span className="font-bold text-gray-800">Filtros y Orden</span>
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl"
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Expandable content */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price Range */}
          <div className="space-y-4">
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-700">
              <span className="text-lg">💰</span>
              <span>Rango de Precio</span>
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">Mínimo</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="w-full h-2 bg-gradient-to-r from-red-400 to-blue-400 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <div className="text-center mt-1">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                      {priceRange[0]}€
                    </span>
                  </div>
                </div>
                <span className="text-gray-400">-</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">Máximo</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="w-full h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg appearance-none cursor-pointer accent-pink-600"
                  />
                  <div className="text-center mt-1">
                    <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-bold">
                      {priceRange[1]}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-4">
            <label className="flex items-center space-x-2 text-sm font-bold text-gray-700">
              <span className="text-lg">📊</span>
              <span>Ordenar Por</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'novedad', label: 'Novedad', icon: '🆕' },
                { value: 'precio-asc', label: 'Precio ↑', icon: '💸' },
                { value: 'precio-desc', label: 'Precio ↓', icon: '💰' },
                { value: 'nombre', label: 'Nombre', icon: '🔤' },
                { value: 'popularidad', label: 'Popular', icon: '⭐' },
                { value: 'descuento', label: 'Ofertas', icon: '🔥' }
              ].map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                    sortBy === option.value
                      ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg shadow-red-500/50'
                        : 'bg-white text-gray-700 hover:bg-red-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-xs">{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="px-6 pb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-600">Filtros activos:</span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold"
          >
            💰 {priceRange[0]}€ - {priceRange[1]}€
          </motion.span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-bold"
          >
            📊 {sortBy === 'novedad' ? 'Novedad' : sortBy === 'precio-asc' ? 'Precio ↑' : sortBy === 'precio-desc' ? 'Precio ↓' : sortBy === 'nombre' ? 'Nombre' : sortBy === 'popularidad' ? 'Popular' : 'Ofertas'}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
