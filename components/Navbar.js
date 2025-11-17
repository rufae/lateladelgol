'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CartDrawer from './CartDrawer';

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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCart();
  const { wishlist } = useWishlist();
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
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/90 via-red-50/90 to-blue-50/90 backdrop-blur-xl border-b border-red-200/50 shadow-lg"
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
                <motion.div 
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="text-2xl font-black bg-gradient-to-r from-red-600 via-blue-600 via-red-700 to-blue-700 dark:from-red-500 dark:via-blue-400 dark:to-red-600 bg-clip-text text-transparent bg-[length:200%_auto]"
                >
                  LaTelaDelGol
                </motion.div>
                <motion.span 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="text-2xl"
                >⚽</motion.span>
              </motion.div>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Dark mode removed */}

              {/* Wishlist Button */}
              <Link href="/wishlist">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:shadow-red-500/50 transition-all relative"
                  title="Lista de deseos"
                >
                  <span className="text-lg">❤️</span>
                  {wishlist.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-white"
                    >
                      {wishlist.length}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-slate-800 via-slate-900 to-black text-white rounded-full text-sm font-bold shadow-xl hover:shadow-2xl hover:shadow-slate-700/50 transition-all relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10">🔐</span>
                  <span className="relative z-10">Admin</span>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                id="nav-cart-button"
                aria-label="Abrir carrito"
                onClick={() => setIsCartOpen(true)}
                className="hidden sm:flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:shadow-blue-500/50 transition-all relative"
              >
                <span className="text-lg">🛍️</span>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
              <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

              {/* Hamburger Button */}
              <motion.button
                onClick={toggleMenu}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ 
                  backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 0.2 },
                  rotate: { duration: 0.3 }
                }}
                className="relative w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-blue-600 to-slate-800 bg-[length:200%_auto] text-white shadow-xl hover:shadow-2xl"
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
              className="fixed top-0 left-0 bottom-0 w-80 bg-gradient-to-br from-slate-900 via-purple-900 via-pink-900 to-slate-900 text-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Menu Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-blue-400 via-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
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
                      whileHover={{ 
                        x: 10, 
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        scale: 1.02
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all text-left group relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/20 to-purple-500/0"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <motion.span 
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="text-2xl group-hover:scale-110 transition-transform relative z-10"
                      >{cat.icon}</motion.span>
                      <span className="font-semibold text-gray-100 group-hover:text-white relative z-10">{cat.name}</span>
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
