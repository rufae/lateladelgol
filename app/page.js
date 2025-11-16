'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import ProductCardPremium from '@/components/ProductCardPremium';
import ProductModal from '@/components/ProductModal';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Navbar with Hamburger Menu */}
      <Navbar onCategoryChange={setCategoriaActiva} onSearch={setBusqueda} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-red-600/5 to-blue-600/5"></div>
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
              <span className="bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 bg-clip-text text-transparent">
                LaTelaDelGol
              </span>
              <span className="ml-3">⚽</span>
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
        </div>
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
            { id: 'camisetas', name: 'Camisetas', icon: '👕', gradient: 'from-blue-500 to-blue-600' },
            { id: 'chaquetas', name: 'Chaquetas', icon: '🧥', gradient: 'from-red-500 to-red-600' },
            { id: 'chandals', name: 'Chándals', icon: '🏃', gradient: 'from-green-500 to-green-600' },
            { id: 'retro', name: 'Retro', icon: '📼', gradient: 'from-purple-500 to-purple-600' }
          ].map((cat, index) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`p-6 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-xl hover:shadow-2xl transition-all`}
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="font-bold text-lg">{cat.name}</div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando productos...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-lg"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {busqueda ? 'No encontramos productos' : 'No hay productos disponibles'}
            </p>
            <p className="text-gray-600">
              {busqueda ? 'Intenta con otra búsqueda' : 'Vuelve pronto para ver novedades'}
            </p>
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
                  {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto, index) => (
                <ProductCardPremium
                  key={producto.id}
                  producto={producto}
                  onClick={handleProductClick}
                />
              ))}
            </div>
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
