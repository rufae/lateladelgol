#!/usr/bin/env node
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno desde .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.warn('⚠️  No se cargó .env.local. Asegúrate de tener el archivo configurado.');
}

// Ejecutar export desde Firestore
const { exportarFirestore } = require('./export-firestore');

(async () => {
  try {
    await exportarFirestore();
  } catch (err) {
    console.error('❌ Error ejecutando la exportación:', err.message || err);
    process.exitCode = 1;
  }
})();
