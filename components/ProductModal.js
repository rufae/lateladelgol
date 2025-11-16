'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function ProductModal({ producto, isOpen, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (!producto) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative h-96 md:h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
                  {(producto.imagen || producto.imagenURL) ? (
                    <>
                      <Image
                        src={producto.imagen || producto.imagenURL}
                        alt={producto.nombre || 'Producto'}
                        fill
                        className={`object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onLoad={() => setImageLoaded(true)}
                      />
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                      Sin imagen disponible
                    </div>
                  )}

                  {/* Close Button - Mobile */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors md:hidden"
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col">
                  {/* Close Button - Desktop */}
                  <button
                    onClick={onClose}
                    className="hidden md:flex self-end w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full items-center justify-center transition-colors mb-4"
                  >
                    <span className="text-xl">✕</span>
                  </button>

                  {/* Category Badge */}
                  {producto.categoria && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4 self-start"
                    >
                      <span>{producto.categoria}</span>
                    </motion.div>
                  )}

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-black text-gray-900 mb-4"
                  >
                    {producto.nombre || 'Sin nombre'}
                  </motion.h2>

                  {/* Price */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-baseline space-x-2 mb-6"
                  >
                    {producto.precio > 0 ? (
                      <>
                        <span className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                          €{producto.precio}
                        </span>
                        <span className="text-sm text-gray-500">IVA incluido</span>
                      </>
                    ) : (
                      <span className="text-2xl text-gray-400">Precio no disponible</span>
                    )}
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Descripción</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {producto.descripcion || 'Producto deportivo de alta calidad. Diseño moderno y confortable, perfecto para entrenamientos y uso casual. Materiales premium que garantizan durabilidad y estilo.'}
                    </p>
                  </motion.div>

                  {/* Quantity selector (no stock shown) */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center space-x-4 mb-6"
                  >
                    <span className="text-sm text-gray-600">Cantidad</span>
                    <div className="inline-flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <div className="px-4 py-2 text-center w-16">{quantity}</div>
                      <button
                        onClick={() => setQuantity(q => Math.min(99, q + 1))}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </motion.div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    <button
                      onClick={() => {
                        const id = producto.id || producto.public_id || producto._id || producto.nombre;
                        const item = {
                          id,
                          nombre: producto.nombre || 'Producto',
                          precio: producto.precio || 0,
                          imagen: producto.imagen || producto.imagenURL || '',
                          quantity
                        };
                        try {
                          addItem(item);
                          toast.success('Añadido al carrito');
                          onClose?.();
                        } catch (e) {
                          toast.error('No se pudo añadir al carrito');
                        }
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
                    >
                      🛒 Añadir al Carrito
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Seguir Comprando
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
