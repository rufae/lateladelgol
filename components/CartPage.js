'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCheckout(e) {
    e.preventDefault();
    if (!name || !email) return toast.error('Completa nombre y email');
    setLoading(true);
    try {
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, items, total })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Pedido enviado correctamente');
        clear();
        setName('');
        setEmail('');
      } else {
        toast.error(data?.error || 'Error al enviar el pedido');
      }
    } catch (err) {
      toast.error('Error de red al enviar el pedido');
    } finally {
      setLoading(false);
    }
  }

  if (!items || items.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-600">Añade productos para poder tramitar un pedido.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6">Tu carrito</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.map(it => (
            <div key={it.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-24 h-24 relative bg-gray-100 rounded overflow-hidden">
                {it.imagen ? (
                  <Image src={it.imagen} alt={it.nombre} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No image</div>
                )}
              </div>
                <div className="flex-1">
                  <div className="font-medium">{it.nombre}</div>
                  {it.talla ? (
                    <div className="text-sm text-gray-600">Talla: {it.talla}</div>
                  ) : null}
                  <div className="text-sm text-gray-600">{it.quantity} x <span className="text-black font-semibold">{it.precio} €</span></div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => updateQuantity(it.id, Math.max(1, (it.quantity || 1) - 1))} className="px-3 py-2 bg-gray-100 rounded">−</button>
                <div className="w-12 text-center">{it.quantity}</div>
                <button onClick={() => updateQuantity(it.id, Math.min(99, (it.quantity || 1) + 1))} className="px-3 py-2 bg-gray-100 rounded">+</button>
              </div>
              <div className="w-28 text-right font-semibold">€{(Number(it.precio || 0) * Number(it.quantity || 1)).toFixed(2)}</div>
              <button onClick={() => removeItem(it.id)} className="ml-4 text-sm text-red-600">Eliminar</button>
            </div>
          ))}
        </div>

        <aside className="p-4 border rounded-lg h-fit">
          <div className="text-sm text-gray-600">Resumen</div>
          <div className="text-2xl font-bold my-4">€{total.toFixed(2)}</div>

          <form onSubmit={handleCheckout} className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre completo" className="w-full p-2 border rounded" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold">
              {loading ? 'Enviando...' : 'Tramitar pedido'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
