'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  { id: 'todas', name: 'Todas', icon: '🏆' },
  { id: 'camisetas', name: 'Camisetas', icon: '👕' },
  { id: 'chaquetas', name: 'Chaquetas', icon: '🧥' },
  { id: 'sudaderas', name: 'Sudaderas', icon: '👔' },
  { id: 'chandals', name: 'Chándals', icon: '🏃' },
  { id: 'calcetines', name: 'Calcetines', icon: '🧦' },
  { id: 'accesorios', name: 'Accesorios', icon: '🎒' },
  { id: 'zapatillas', name: 'Zapatillas', icon: '👟' },
  { id: 'equipaciones', name: 'Equipaciones', icon: '⚽' },
  { id: 'retro', name: 'Retro', icon: '📼' },
  { id: 'ediciones-limitadas', name: 'Ed. Limitadas', icon: '💎' },
  { id: 'porteros', name: 'Porteros', icon: '🥅' },
  { id: 'ninos', name: 'Niños', icon: '👶' },
  { id: 'mujer', name: 'Mujer', icon: '👩' },
  { id: 'ofertas', name: 'Ofertas Flash', icon: '⚡' },
  { id: 'recomendados', name: 'Recomendados', icon: '⭐' },
];

export default function Navbar({ onCategoryChange, onSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const cartCount = (items || []).reduce((s, it) => s + (Number(it.quantity || 0)), 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuVariants = {
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const overlayVariants = {
    closed: { opacity: 0, pointerEvents: 'none' },
    open: { opacity: 1, pointerEvents: 'auto' }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, type: 'spring', stiffness: 300, damping: 24 }
    })
  };

  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="text-2xl font-black bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 bg-clip-text text-transparent">
                  LaTelaDelGol
                </div>
                <span className="text-2xl">⚽</span>
              </motion.div>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  <span>🔐</span>
                  <span>Admin</span>
                </motion.button>
              </Link>

              <Link href="/cart" className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white/10 text-white rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-shadow">
                <span>🛒</span>
                <span>{cartCount > 0 ? cartCount : ''}</span>
              </Link>

              {/* Hamburger Button */}
              <motion.button
                onClick={toggleMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-red-500 text-white shadow-lg"
              >
                <motion.div
                  animate={isMenuOpen ? 'open' : 'closed'}
                  className="w-5 h-5 flex flex-col justify-center items-center"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: -4 },
                      open: { rotate: 45, y: 0 }
                    }}
                    className="w-5 h-0.5 bg-white absolute"
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 }
                    }}
                    className="w-5 h-0.5 bg-white absolute"
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 4 },
                      open: { rotate: -45, y: 0 }
                    }}
                    className="w-5 h-0.5 bg-white absolute"
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.aside
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 bottom-0 w-80 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Menu Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
                    Menú
                  </h2>
                  <p className="text-sm text-gray-400">Explora nuestro catálogo</p>
                </motion.div>

                {/* Categories */}
                <div className="space-y-2">
                  <motion.div
                    custom={0}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    className="mb-6"
                  >
                    <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Categorías</h3>
                  </motion.div>

                  {CATEGORIES.map((cat, index) => (
                    <motion.button
                      key={cat.id}
                      custom={index + 1}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      onClick={() => {
                        if (onCategoryChange) onCategoryChange(cat.id);
                        toggleMenu();
                      }}
                      whileHover={{ x: 8, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors text-left group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <span className="font-medium text-gray-100 group-hover:text-white">{cat.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Menu Links */}
                <motion.div
                  custom={CATEGORIES.length + 1}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  className="mt-8 pt-6 border-t border-white/10 space-y-4"
                >
                  <Link href="/">
                    <motion.div
                      whileHover={{ x: 8 }}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="text-xl">🏠</span>
                      <span>Inicio</span>
                    </motion.div>
                  </Link>
                  <Link href="/sobre-nosotros">
                    <motion.div
                      whileHover={{ x: 8 }}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="text-xl">ℹ️</span>
                      <span>Sobre Nosotros</span>
                    </motion.div>
                  </Link>
                  <Link href="/contacto">
                    <motion.div
                      whileHover={{ x: 8 }}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="text-xl">📧</span>
                      <span>Contacto</span>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
