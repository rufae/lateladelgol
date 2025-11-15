#!/usr/bin/env node
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function findServiceAccount() {
  const envPath = process.env.SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (envPath && fs.existsSync(envPath)) return envPath;
  const local = path.join(__dirname, '..', 'lib', 'serviceAccountKey.json');
  if (fs.existsSync(local)) return local;
  return null;
}

(async function main(){
  const svc = findServiceAccount();
  if (svc) {
    admin.initializeApp({ credential: admin.credential.cert(require(svc)) });
  } else {
    try { admin.initializeApp(); } catch (err) { console.error('No credentials for admin SDK:', err.message || err); process.exit(1); }
  }

  const db = admin.firestore();
  try {
    const snapshot = await db.collection('productos').orderBy('fechaCreacion','desc').limit(1).get();
    if (snapshot.empty) { console.log('No hay productos.'); process.exit(0); }
    const doc = snapshot.docs[0];
    const data = doc.data();
    const imagen = data.imagen;
    console.log('Probar imagen:', imagen);
    if (!imagen) { console.error('No hay campo imagen'); process.exit(1); }

    // Use fetch (Node 18+) to check
    const res = await fetch(imagen, { method: 'GET' });
    console.log('Status:', res.status);
    if (res.status === 404) {
      const text = await res.text();
      console.log('Body snippet:', text.slice(0,300));
    }
  } catch (err) {
    console.error('Error comprobando imagen:', err.message || err);
    process.exit(1);
  }
})();
