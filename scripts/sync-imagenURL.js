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
    const snapshot = await db.collection('productos').get();
    if (snapshot.empty) { console.log('No hay documentos en la colección productos.'); process.exit(0); }
    let updated = 0;
    const batchLimit = 500;
    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += batchLimit) {
      const batch = db.batch();
      const slice = docs.slice(i, i + batchLimit);
      slice.forEach(doc => {
        const data = doc.data();
        if ((!data.imagenURL || data.imagenURL === '') && data.imagen) {
          batch.update(doc.ref, { imagenURL: data.imagen });
          updated++;
        }
      });
      await batch.commit();
      console.log(`Procesados ${Math.min(i+batchLimit, docs.length)}/${docs.length} documentos...`);
    }
    console.log(`Sincronización completada. Documentos actualizados: ${updated}`);
  } catch (err) {
    console.error('Error sincronizando imagenURL:', err.message || err);
    process.exit(1);
  }
})();
