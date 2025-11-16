'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">
              LaTelaDelGol ⚽
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu destino deportivo de confianza. Calidad, estilo y pasión en cada prenda.
            </p>
            <div className="flex space-x-4 pt-4">
              {['📘', '📷', '🐦', '▶️'].map((icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-xl transition-colors"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Shop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold">Tienda</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Camisetas', 'Chaquetas', 'Chándals', 'Ofertas', 'Novedades', 'Más Vendidos'].map((item, i) => (
                <li key={i}>
                  <Link href="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold">Información</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Sobre Nosotros', 'Contacto', 'Envíos', 'Devoluciones', 'Política de Privacidad', 'Términos y Condiciones'].map((item, i) => (
                <li key={i}>
                  <Link href="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold">Newsletter</h4>
            <p className="text-sm text-gray-400">Suscríbete y recibe ofertas exclusivas</p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Tu email"
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 rounded-xl font-semibold transition-all shadow-lg"
              >
                Suscribirme
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-sm text-gray-400">
            © {currentYear} LaTelaDelGol. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-6 text-xs text-gray-400">
            <span>Desarrollado con Next.js, Firebase y Cloudinary</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
