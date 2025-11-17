'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import ProductCardPremium from '@/components/ProductCardPremium';
import ProductCardList from '@/components/ProductCardList';
import ProductModal from '@/components/ProductModal';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ priceRange: [0, 200], sortBy: 'novedad' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
    
    // Price filter
    const precio = Number(producto.precio) || 0;
    const dentroRangoPrecio = precio >= filters.priceRange[0] && precio <= filters.priceRange[1];
    
    return coincideBusqueda && coincideCategoria && dentroRangoPrecio;
  });

  // Apply sorting
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (filters.sortBy) {
      case 'precio-asc':
        return (Number(a.precio) || 0) - (Number(b.precio) || 0);
      case 'precio-desc':
        return (Number(b.precio) || 0) - (Number(a.precio) || 0);
      case 'nombre':
        return (a.nombre || '').localeCompare(b.nombre || '');
      case 'popularidad':
        return (Number(b.ventas) || 0) - (Number(a.ventas) || 0);
      case 'descuento':
        return (Number(b.descuento) || 0) - (Number(a.descuento) || 0);
      case 'novedad':
      default:
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    }
  });

  const getCategoryName = (catId) => {
    const names = {
      'todas': 'Todos los Productos',
      'camisetas': 'Camisetas',
      'chaquetas': 'Chaquetas',
      'chandals': 'Chándals',
      'retro': 'Retro',
      'moda': 'Moda'
    };
    return names[catId] || catId.charAt(0).toUpperCase() + catId.slice(1);
  };

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white via-blue-50 to-slate-50 animate-gradient-slow">
      {/* Navbar with Hamburger Menu */}
      <Navbar onCategoryChange={setCategoriaActiva} onSearch={setBusqueda} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-blue-600/10 to-slate-900/10 dark:from-red-900/20 dark:via-blue-900/20 dark:to-black/30 animate-pulse-slow"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl font-black mb-6 tracking-tight"
            >
              <motion.span 
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="bg-gradient-to-r from-red-600 via-blue-600 via-red-700 to-blue-700 dark:from-red-500 dark:via-blue-500 dark:to-red-600 bg-clip-text text-transparent bg-[length:200%_auto]"
                  className="bg-gradient-to-r from-red-600 via-blue-600 via-red-700 to-blue-700 bg-clip-text text-transparent bg-[length:200%_auto]"
              >
                LaTelaDelGol
              </motion.span>
              <motion.span 
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="ml-3 inline-block"
              >⚽</motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto font-medium"
            >
              Estilo premium, calidad excepcional y pasión deportiva en cada prenda
            </motion.p>

            {/* Search Bar with Autocomplete */}
            <SearchBar onSearch={setBusqueda} productos={productos} />
          </motion.div>

          {/* Featured Carousel */}
          {!loading && productos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <FeaturedCarousel productos={productos.slice(0, 5)} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-4">
        <FilterBar onFilterChange={setFilters} />
      </section>

      {/* Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-black text-gray-900 mb-2">Categorías Destacadas</h2>
          <p className="text-gray-600">Explora nuestra selección premium</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'camisetas', name: 'Camisetas', icon: '👕', gradient: 'from-blue-600 via-blue-700 to-blue-800', ring: 'ring-blue-400' },
            { id: 'chaquetas', name: 'Chaquetas', icon: '🧥', gradient: 'from-red-600 via-red-700 to-red-800', ring: 'ring-red-400' },
            { id: 'chandals', name: 'Chándals', icon: '🏃', gradient: 'from-slate-700 via-slate-800 to-slate-900', ring: 'ring-slate-400' },
            { id: 'retro', name: 'Retro', icon: '📼', gradient: 'from-red-500 via-blue-600 to-slate-800', ring: 'ring-red-400' }
          ].map((cat, index) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ 
                scale: 1.08, 
                y: -8,
                rotateY: 5,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-xl hover:shadow-2xl transition-all overflow-hidden group`}
            >
              <motion.div 
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-4xl mb-2 relative z-10"
              >{cat.icon}</motion.div>
              <div className="font-bold text-lg relative z-10">{cat.name}</div>
              <div className={`absolute inset-0 rounded-2xl ${cat.ring} ring-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
            />
            <p className="mt-4 text-gray-600 font-bold">Cargando productos increíbles...</p>
          </div>
        ) : productosOrdenados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
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
              {busqueda ? '🔍' : '🎯'}
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-black bg-gradient-to-r from-red-600 via-blue-600 to-slate-800 bg-clip-text text-transparent mb-3"
            >
              {busqueda ? 'No encontramos productos' : `No hay productos de la categoría "${getCategoryName(categoriaActiva)}" aún`}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 font-medium"
            >
              {busqueda ? 'Intenta con otra búsqueda' : 'Próximamente... ⏳✨'}
            </motion.p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex justify-between items-center"
            >
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  {categoriaActiva === 'todas' ? 'Todos los Productos' : categoriaActiva.charAt(0).toUpperCase() + categoriaActiva.slice(1)}
                </h2>
                <p className="text-gray-600">
                  {productosOrdenados.length} {productosOrdenados.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-lg border border-gray-200">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <span className="mr-2">▦</span>
                  Grid
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <span className="mr-2">☰</span>
                  Lista
                </motion.button>
              </div>
            </motion.div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {productosOrdenados.map((producto, index) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  {viewMode === 'grid' ? (
                    <ProductCardPremium
                      producto={producto}
                      onClick={handleProductClick}
                    />
                  ) : (
                    <ProductCardList
                      producto={producto}
                      onClick={handleProductClick}
                    />
                  )}
                </motion.div>
              ))}
            </div>
            {/* CTA for camisetas: let users ask for any shirt even if not listed */}
            {categoriaActiva === 'camisetas' && (
              <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 text-center">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">¿No encuentras la camiseta que buscas?</h3>
                <p className="text-gray-700 mb-4">Si buscas alguna camiseta concreta que no aparece en el catálogo, escríbenos y la intentamos conseguir para ti.</p>
                <Link href="/contacto" className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700">Pregúntanos por una camiseta</Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Product Modal */}
      <ProductModal
        producto={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
