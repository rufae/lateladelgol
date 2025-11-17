'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import Navbar from '@/components/Navbar';
import ProductCardPremium from '@/components/ProductCardPremium';
import ProductModal from '@/components/ProductModal';
import Footer from '@/components/Footer';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <Navbar />

      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="text-5xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-red-600 via-blue-600 to-slate-800 bg-clip-text text-transparent"
            >
              ❤️ Mi Lista de Deseos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 font-medium"
            >
              {wishlist.length} {wishlist.length === 1 ? 'producto guardado' : 'productos guardados'}
            </motion.p>
          </motion.div>

          {/* Clear All Button */}
          {wishlist.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end mb-6"
            >
              <motion.button
                onClick={clearWishlist}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-red-500/50 transition-all"
              >
                <span className="mr-2">🗑️</span>
                Limpiar Lista
              </motion.button>
            </motion.div>
          )}

          {/* Empty State */}
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20 bg-gradient-to-br from-white via-red-50 to-blue-50 rounded-3xl shadow-2xl border-2 border-red-200"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6"
              >
                💔
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-black bg-gradient-to-r from-red-600 via-blue-600 to-slate-800 bg-clip-text text-transparent mb-3"
              >
                Tu lista está vacía
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 font-medium mb-6"
              >
                Añade productos que te gusten pulsando el corazón 🤍
              </motion.p>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-red-500/50 transition-all"
              >
                <span className="mr-2">🛍️</span>
                Explorar Productos
              </motion.a>
            </motion.div>
          ) : (
            /* Products Grid */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {wishlist.map((producto, index) => (
                  <motion.div
                    key={producto.id}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{
                      delay: index * 0.05,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20
                    }}
                    layout
                  >
                    <ProductCardPremium
                      producto={producto}
                      onClick={handleProductClick}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <ProductModal
            producto={selectedProduct}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
