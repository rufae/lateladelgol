const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar firebase-admin
function initFirebase() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Buscar credenciales (service account)
  const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || 
                              process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                              path.resolve(__dirname, '../lib/serviceAccountKey.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    console.error('❌ No se encontró serviceAccountKey.json. Asegúrate de tenerlo en lib/ o configurar SERVICE_ACCOUNT_PATH');
    process.exit(1);
  }
}

async function exportarFirestore() {
  try {
    initFirebase();
    const db = admin.firestore();

    console.log('📦 Exportando productos desde Firestore...');
    
    const snapshot = await db.collection('productos').get();
    
    if (snapshot.empty) {
      console.log('⚠️  No hay productos en Firestore');
      return;
    }

    const productos = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      productos.push({
        id: doc.id,
        ...data,
        // Convertir Timestamp a string si existe
        fechaCreacion: data.fechaCreacion?.toDate?.()?.toISOString() || data.fechaCreacion
      });
    });

    // Crear backup con timestamp
    const timestamp = Date.now();
    const backupPath = path.resolve(process.cwd(), `products-firestore.backup.${timestamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(productos, null, 2), 'utf8');
    console.log(`✅ Backup creado: ${path.basename(backupPath)}`);

    // Sobrescribir products-firestore.json
    const outputPath = path.resolve(process.cwd(), 'products-firestore.json');
    fs.writeFileSync(outputPath, JSON.stringify(productos, null, 2), 'utf8');
    
    console.log(`✅ Exportados ${productos.length} productos a products-firestore.json 🎉`);
    
    return productos;
  } catch (error) {
    console.error('❌ Error exportando desde Firestore:', error.message || error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  exportarFirestore();
}

module.exports = { exportarFirestore };
