#!/usr/bin/env node
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno desde .env.local sin imprimirlas
const envPath = path.resolve(process.cwd(), '.env.local');
const result = dotenv.config({ path: envPath });
if (result.error) {
  // No mostramos valores ni errores detallados de las credenciales
  console.warn('No se cargó .env.local. Asegúrate de tener el archivo con las credenciales.');
}

// Ejecutar export
const { exportar } = require('./export');

(async () => {
  try {
    await exportar();
  } catch (err) {
    console.error('Error ejecutando la exportación:', err.message || err);
    process.exitCode = 1;
  }
})();
