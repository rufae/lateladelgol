#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(process.cwd(), 'products.json');
if (!fs.existsSync(filePath)) {
  console.error('No se encontró products.json en la raíz del proyecto');
  process.exit(1);
}

const backupPath = path.resolve(process.cwd(), `products.backup.${Date.now()}.json`);
fs.copyFileSync(filePath, backupPath);

const raw = fs.readFileSync(filePath, 'utf8');
let products;
try {
  products = JSON.parse(raw);
} catch (e) {
  console.error('Error parseando products.json:', e.message || e);
  process.exit(1);
}

function determineCategory(nombre, public_id) {
  const s = (nombre || public_id || '').toLowerCase();

  // Chaquetas / Abrigos
  if (/chaqueta|chaqueton|chaquetón|abrigo|parkas?|parka/.test(s)) return 'chaquetas';

  // Chándales
  if (/chandal|chándal|chándales|chandals?/.test(s)) return 'chandals';

  // Camisetas
  if (/camiseta|camsieta|cami(s|set)?|equipaci[oó]n|jersey|tee|shirt|retro/.test(s)) {
    // We include 'retro' in camisetas
    return 'camisetas';
  }

  // Conjuntos, sets, abrigos que no matched above -> moda
  if (/conjunto|set|pack|bebe|bebes|baby|infantil/.test(s)) return 'moda';

  // Default to "moda"
  return 'moda';
}

let changed = 0;
const counts = { chaquetas: 0, chandals: 0, camisetas: 0, moda: 0 };
const samples = { chaquetas: [], chandals: [], camisetas: [], moda: [] };

for (const p of products) {
  const newCat = determineCategory(p.nombre, p.public_id);
  if (p.categoria !== newCat) {
    p.categoria = newCat;
    changed++;
  }
  if (counts[newCat] !== undefined) counts[newCat]++;
  if (samples[newCat].length < 3) samples[newCat].push(p.nombre || p.public_id);
}

fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');

console.log(`Backup guardado en: ${backupPath}`);
console.log(`Categorías actualizadas en products.json. Productos modificados: ${changed}`);
console.log('Resumen por categoría:');
for (const k of Object.keys(counts)) {
  console.log(`  - ${k}: ${counts[k]}`);
  if (samples[k].length) console.log(`    Ejemplos: ${samples[k].join(' | ')}`);
}
