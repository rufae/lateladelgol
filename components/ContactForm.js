"use client";

import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

  const validate = () => {
    if (!name.trim()) return 'Introduce tu nombre';
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Introduce un e-mail válido';
    if (!message.trim()) return 'Escribe tu pregunta o mensaje';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) return setError(v);
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error || 'Error del servidor';
        throw new Error(msg);
      }
      setSuccess(true);
      setServerMessage(data?.message || (data?.sent === false ? 'Recibimos tu mensaje pero no se pudo enviar correo automático.' : 'Mensaje enviado correctamente.'));
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setError(typeof err === 'string' ? err : err.message || 'No se pudo enviar. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg p-6 bg-green-50 border border-green-200 text-center">
        <h4 className="text-lg font-bold text-green-800 mb-2">¡Mensaje recibido!</h4>
        <p className="text-sm text-green-700">{serverMessage || 'Gracias por escribirnos. Te responderemos a la mayor brevedad.'}</p>
        <button onClick={() => { setSuccess(false); setServerMessage(''); }} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Enviar otro</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 text-black placeholder-gray-400"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 text-black placeholder-gray-400"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Pregunta / Mensaje</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 text-black placeholder-gray-400"
          placeholder="Escribe aquí tu pregunta"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60"
        >
          {loading ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </div>
    </form>
  );
}
