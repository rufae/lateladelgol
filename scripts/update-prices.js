#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(process.cwd(), 'products.json');
if (!fs.existsSync(filePath)) {
  console.error('No se encontró products.json en la raíz del proyecto');
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf8');
let products;
try {
  products = JSON.parse(raw);
} catch (e) {
  console.error('Error parseando products.json:', e.message || e);
  process.exit(1);
}

function determinePrice(nombre) {
  const s = nombre.toLowerCase();
  // Prioridad: conjuntos bebe, conjuntos entrenamiento, chaquetas retro, chaquetas, chandal, camisetas retro, camisetas, abrigos
  if (/conjunto/.test(s) && /bebe|bebes|beb[eé]s|baby/.test(s)) return 15;
  if (/conjunto/.test(s) && /entrenamiento/.test(s)) return 30;
  if (/chaqueta/.test(s) && /retro/.test(s)) return 37;
  if (/chaqueta/.test(s) || /chaqueton/.test(s)) return 35;
  if (/chandal/.test(s) || /chándal/.test(s)) return 39;
  if (/camiseta/.test(s) || /camsieta/.test(s) || /camsieta/.test(s)) {
    if (/retro/.test(s)) return 20;
    return 18;
  }
  if (/cami?s?eta/.test(s)) {
    if (/retro/.test(s)) return 20;
    return 18;
  }
  if (/abrigo/.test(s)) return 49;
  // Also check for 'conjunto' generic -> training/sets
  if (/conjunto/.test(s)) return 30;

  return 0; // default leave 0
}

let changed = 0;
for (const p of products) {
  const newPrice = determinePrice(p.nombre || p.public_id || '');
  if (p.precio !== newPrice) {
    p.precio = newPrice;
    changed++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Precios actualizados en products.json. Productos modificados: ${changed}`);
