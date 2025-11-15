const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Soporta variables específicas del servidor o las de NEXT_PUBLIC como fallback
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUD_API_KEY = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUD_API_SECRET = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_API_SECRET) {
  console.warn('Aviso: faltan variables de Cloudinary en el entorno. Revisa .env.local');
}

// Configura Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME || 'TU_CLOUD_NAME',
  api_key: CLOUD_API_KEY || 'TU_API_KEY',
  api_secret: CLOUD_API_SECRET || 'TU_API_SECRET',
});

// Cambia esto si tienes carpetas como "camisetas", "chaquetas", etc.
const CATEGORIAS = ['camisetas', 'chaquetas', 'chandals', 'moda'];

async function exportar() {
  try {
    const maxResults = parseInt(process.env.EXPORT_MAX_RESULTS || '500', 10);

    const result = await cloudinary.search
      .expression('resource_type:image') // solo imágenes
      .max_results(maxResults) // configurable por env
      .execute();

    const productos = result.resources.map((item) => {
      const url = item.secure_url;

      // Detectar categoría según carpeta en el public_id o la url
      const categoria =
        CATEGORIAS.find((c) => (item.public_id || url).toLowerCase().includes(`/${c}/`)) || 'sin_categoria';

      return {
        nombre: (item.public_id || '').split('/').pop().replace(/_/g, ' '),
        imagen: item.secure_url,
        public_id: item.public_id,
        categoria,
        precio: 0,
        stock: 0,
        width: item.width,
        height: item.height,
        format: item.format,
        bytes: item.bytes,
      };
    });

    fs.writeFileSync(path.resolve(process.cwd(), 'products.json'), JSON.stringify(productos, null, 2), 'utf8');

    console.log('products.json generado con éxito 🎉');
  } catch (error) {
    console.error('Error exportando imágenes:', error);
  }
}

if (require.main === module) {
  exportar();
}

module.exports = { exportar };
