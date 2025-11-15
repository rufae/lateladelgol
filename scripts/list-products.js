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
    const snapshot = await db.collection('productos').orderBy('fechaCreacion','desc').limit(10).get();
    if (snapshot.empty) {
      console.log('No hay documentos en la colección productos.');
      process.exit(0);
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log('ID:', doc.id);
      console.log('  nombre:', data.nombre || '<sin nombre>');
      console.log('  imagen:', data.imagen || '<sin imagen>');
      console.log('  public_id:', data.public_id || '<sin public_id>');
      console.log('  categoria:', data.categoria || '<sin categoria>');
      console.log('---');
    });
  } catch (err) {
    console.error('Error leyendo Firestore:', err.message || err);
    process.exit(1);
  }
})();
