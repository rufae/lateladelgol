'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import useFlyToCart from './useFlyToCart';
import { fireConfetti } from './confetti';

export default function ProductModal({ producto, isOpen, onClose }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  // Start quantity at 0 so the user must explicitly choose a quantity
  const [quantity, setQuantity] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCart();
  const imageRef = useRef(null);
  const flyToCart = useFlyToCart();


  // Support multiple images
  const images = producto?.imagenes || [producto?.imagen || producto?.imagenURL];
  const tallas = producto?.tallas || [];

  // Normalize tallas into an array in case they come as a string like "S,M,L"
  let tallasArray = [];
  if (Array.isArray(tallas) && tallas.length > 0) {
    tallasArray = tallas.map(t => (t || '').toString().trim()).filter(Boolean);
  } else if (typeof tallas === 'string' && tallas.trim().length > 0) {
    tallasArray = tallas.split(/[;,|\/]+|\s+/).map(t => t.trim()).filter(Boolean);
  }


  // If the product doesn't include sizes but belongs to a category
  // that typically has sizes, show a sensible default set so the
  // user can still select a talla.
  const SIZE_CATEGORIES = new Set([
    'camisetas',
    'chaquetas',
    'sudaderas',
    'chandals',
    'porteros',
    'ninos',
    'mujer',
    'retro',
    'equipaciones'
  ]);

  const defaultTallas = ['S', 'M', 'L', 'XL', 'XXL'];
  const productoCategoriaRaw = (producto?.categoria || '').toString();
  // Normalize category to remove accents and ensure lowercase matching (e.g. 'Chándals' -> 'chandals')
  const productoCategoria = productoCategoriaRaw
    .normalize ? productoCategoriaRaw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : productoCategoriaRaw.toLowerCase();

  // Deduplicate and use array from above
  const displayedTallas = (tallasArray && tallasArray.length > 0)
    ? Array.from(new Set(tallasArray))
    : (SIZE_CATEGORIES.has(productoCategoria) ? defaultTallas : []);

  // Reset selected size and quantity when modal opens for a different product
  useEffect(() => {
    if (isOpen) {
      setSelectedSize('');
      setQuantity(0);
      setImageLoaded(false);
      setCurrentImageIndex(0);
    }
  }, [producto?.id, isOpen]);

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
  if (!producto) return null;

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
                <div ref={imageRef} className="relative h-96 md:h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
                  {images && images.length > 0 ? (
                    <>
                      <Image
                        src={images[currentImageIndex] || '/placeholder.png'}
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
                      
                      {/* Image Gallery Thumbnails */}
                      {images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 px-4">
                          {images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                idx === currentImageIndex ? 'border-white scale-110' : 'border-white/50 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <Image src={img} alt={`Vista ${idx + 1}`} width={64} height={64} className="object-cover" />
                            </button>
                          ))}
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
                    className="mb-6 space-y-4"
                  >
                    {/* Size Selector */}
                    {displayedTallas && displayedTallas.length > 0 && (
                      <div>
                        <span className="text-sm font-semibold text-gray-700 mb-2 block">Talla *</span>
                        <div className="flex flex-wrap gap-2">
                          {displayedTallas.map((talla) => (
                            <button
                              key={talla}
                              onClick={() => setSelectedSize(talla)}
                              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                                selectedSize === talla
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {talla}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Quantity */}
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Cantidad</span>
                      <div className="inline-flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setQuantity(q => Math.max(0, q - 1))}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-black font-bold text-lg"
                          aria-label="Disminuir cantidad"
                        >
                          −
                        </button>
                          <div className="px-4 py-2 text-center w-16 text-black font-semibold">{quantity}</div>
                        <button
                          onClick={() => setQuantity(q => Math.min(99, q + 1))}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-black font-bold text-lg"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
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
                    {/* Add to cart: require quantity > 0 and talla selected if sizes exist */}
                    <button
                      onClick={() => {
                        // Validate quantity
                        if (!quantity || quantity <= 0) {
                          toast.error('Por favor, selecciona la cantidad');
                          return;
                        }

                        // Validate size selection if sizes exist (use displayedTallas)
                        if (displayedTallas && displayedTallas.length > 0 && !selectedSize) {
                          toast.error('Por favor, selecciona una talla');
                          return;
                        }

                        const baseId = producto.id || producto.public_id || producto._id || producto.nombre;
                        // Use a composite id including talla so identical products with
                        // different sizes are treated as separate cart items.
                        const itemId = selectedSize ? `${baseId}::${selectedSize}` : baseId;
                        const item = {
                          id: itemId,
                          productId: baseId,
                          nombre: producto.nombre || 'Producto',
                          precio: producto.precio || 0,
                          imagen: producto.imagen || producto.imagenURL || '',
                          quantity,
                          talla: selectedSize || undefined
                        };
                        try {
                          addItem(item);
                          // trigger flying animation to cart
                          try { flyToCart(item.imagen || images[currentImageIndex] || '', imageRef.current); } catch (e) {}
                          // small confetti burst near the cart icon (desktop-first)
                          try {
                            const cartBtn = document.getElementById('nav-cart-button');
                            if (cartBtn && window.innerWidth > 520) {
                              const r = cartBtn.getBoundingClientRect();
                              const cx = r.left + r.width / 2;
                              const cy = r.top + r.height / 2;
                              fireConfetti({ x: cx, y: cy, count: 26, spread: 100 });
                            } else {
                              // fallback: center of viewport
                              fireConfetti({ count: 18 });
                            }
                          } catch (e) {}
                          toast.success(`Añadido al carrito${selectedSize ? ` (Talla: ${selectedSize})` : ''}`);
                          onClose?.();
                        } catch (e) {
                          toast.error('No se pudo añadir al carrito');
                        }
                      }}
                      // visually disable when invalid
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${(!quantity || (displayedTallas && displayedTallas.length > 0 && !selectedSize)) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'}`}
                      aria-disabled={!quantity || (displayedTallas && displayedTallas.length > 0 && !selectedSize)}
                      disabled={!quantity || (displayedTallas && displayedTallas.length > 0 && !selectedSize)}
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
