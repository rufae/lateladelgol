'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CATEGORIAS = [
  { id: 'todas', nombre: 'Todas', icono: '🏆' },
  { id: 'chaquetas', nombre: 'Chaquetas', icono: '🧥' },
  { id: 'chandals', nombre: 'Chándales', icono: '👕' },
  { id: 'camisetas', nombre: 'Camisetas', icono: '👔' },
  { id: 'moda', nombre: 'Moda', icono: '👟' }
];

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'productos'));
      const productosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProductos(productosData);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = productos.filter(producto => {
    const nombre = (producto.nombre || '').toString();
    const descripcion = (producto.descripcion || '').toString();
    const termino = (busqueda || '').toString().toLowerCase();
    const coincideBusqueda = nombre.toLowerCase().includes(termino) || descripcion.toLowerCase().includes(termino);
    const coincideCategoria = categoriaActiva === 'todas' || producto.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Botón Admin - Esquina superior derecha */}
      <Link href="/admin">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-300"
        >
          🔐 Admin
        </motion.button>
      </Link>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-red-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white mb-6 tracking-tight">
              La<span className="text-blue-400">Tela</span>Del<span className="text-red-500">Gol</span> ⚽
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Tu destino deportivo. Estilo, calidad y pasión en cada prenda.
            </p>
            
            {/* Buscador */}
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filtros de Categoría */}
      <section className="bg-white/5 backdrop-blur-md border-y border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIAS.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setCategoriaActiva(cat.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  categoriaActiva === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                {cat.icono} {cat.nombre}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo de Productos */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-gray-300">
              {busqueda ? '🔍 No se encontraron productos' : '📦 No hay productos disponibles'}
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 text-center"
            >
              <p className="text-gray-300 text-lg">
                {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''} encontrado{productosFiltrados.length !== 1 ? 's' : ''}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto, index) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard producto={producto} isAdmin={false} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md border-t border-white/10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2025 LaTelaDelGol ⚽ - Todos los derechos reservados
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Desarrollado con Next.js, Firebase y Cloudinary
          </p>
        </div>
      </footer>
    </div>
  );
}
