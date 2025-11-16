'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, productos = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = productos
        .filter(p => 
          (p.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.categoria || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, productos]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const handleSuggestionClick = (producto) => {
    setSearchTerm(producto.nombre || '');
    setShowSuggestions(false);
    if (onSearch) onSearch(producto.nombre || '');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <span className="text-gray-400 text-xl">🔍</span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar productos, categorías..."
          className="w-full pl-14 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-lg"
        />
        {searchTerm && (
          <button
            onClick={() => handleSearch('')}
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-xl">✕</span>
          </button>
        )}
      </motion.div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-10"
        >
          {suggestions.map((producto, index) => (
            <motion.button
              key={producto.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSuggestionClick(producto)}
              className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
            >
              <span className="text-xl">🏷️</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">{producto.nombre}</div>
                <div className="text-xs text-gray-500">{producto.categoria}</div>
              </div>
              {producto.precio > 0 && (
                <div className="text-sm font-bold text-blue-600">€{producto.precio}</div>
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
