"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useRouter } from 'next/navigation';

export default function CartDrawer({ isOpen, onClose }) {
  const { items = [], total = 0, updateQuantity, removeItem, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const overlay = { closed: { opacity: 0 }, open: { opacity: 1 } };
  const drawer = { closed: { x: "100%" }, open: { x: 0 } };

  const handleCheckout = () => {
    if (!items || items.length === 0) {
      toast.warn("Tu carrito está vacío");
      return;
    }
    onClose && onClose();
    try { router.push('/cart'); } catch (e) { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div variants={overlay} initial="closed" animate="open" exit="closed" onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

          <motion.div variants={drawer} initial="closed" animate="open" exit="closed" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 right-0 bottom-0 w-full sm:w-[520px] md:w-[680px] bg-white shadow-2xl z-60 flex flex-col border-l border-gray-100">
            <div className="p-8 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Tu Carrito 🛒</h2>
                <p className="text-sm text-gray-600">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center hover:bg-red-700">✕</button>
            </div>

            {/* Content: make sure this area is scrollable and has a sensible min height */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[50vh]">
              {items.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <div className="text-6xl mb-4">🛍️</div>
                  <div className="text-lg font-semibold">Tu carrito está vacío</div>
                  <div className="text-sm">Añade productos para verlos aquí</div>
                </div>
              ) : (
                items.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ delay: i * 0.03 }} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      {item.imagen || item.imagenURL ? (
                        <Image src={item.imagen || item.imagenURL} alt={item.nombre} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{item.nombre}</h3>
                      {item.talla && <p className="text-xs text-gray-600 mb-1">Talla: {item.talla}</p>}
                      <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))} className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center font-bold hover:bg-gray-100 text-black">−</button>
                        <span className="text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, Math.min(99, (item.quantity || 1) + 1))} className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center font-bold hover:bg-gray-100 text-black">+</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-black">€{(((item.precio || 0) * (item.quantity || 1)) || 0).toFixed(2)}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { removeItem(item.id); toast.info('Producto eliminado'); }} className="text-red-500 hover:text-red-700">🗑️</button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="sticky bottom-0 border-t border-gray-200 p-6 space-y-4 bg-gray-50">
                <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Subtotal</span><span className="font-semibold">€{Number(total || 0).toFixed(2)}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Envío</span><span className="font-semibold text-green-600">GRATIS</span></div>
                <div className="h-px bg-gray-300" />
                <div className="flex justify-between items-center"><span className="text-lg font-bold text-black">Total</span><span className="text-2xl font-black text-black">€{Number(total || 0).toFixed(2)}</span></div>

                <div className="space-y-3">
                  <button onClick={handleCheckout} className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-xl font-bold text-lg">Ir al carrito / Checkout</button>
                  <button onClick={() => { clear(); toast.info('Carrito vaciado'); onClose && onClose(); }} className="w-full py-2 text-red-600 font-semibold">Vaciar carrito</button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
