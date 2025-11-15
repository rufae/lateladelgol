const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
// products.json is located at the project root
const productsPath = path.join(__dirname, '..', 'products.json');
if (!fs.existsSync(productsPath)) {
  console.error('No se encontró products.json en la raíz del proyecto:', productsPath);
  process.exit(1);
}
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

function findServiceAccount() {
  // Priority: SERVICE_ACCOUNT_PATH -> GOOGLE_APPLICATION_CREDENTIALS -> ./serviceAccountKey.json
  const envPath = process.env.SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (envPath && fs.existsSync(envPath)) return envPath;
  const local = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(local)) return local;
  return null;
}

const serviceAccount = findServiceAccount();
if (serviceAccount) {
  try {
    admin.initializeApp({ credential: admin.credential.cert(require(serviceAccount)) });
    console.log('Inicializado firebase-admin con:', serviceAccount);
  } catch (err) {
    console.error('Error inicializando firebase-admin con el archivo de servicio:', err.message || err);
    process.exit(1);
  }
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // ADC may be configured in the environment
  try {
    admin.initializeApp();
    console.log('Inicializado firebase-admin con Application Default Credentials');
  } catch (err) {
    console.error('No se pudo inicializar firebase-admin con ADC:', err.message || err);
    process.exit(1);
  }
} else {
  console.error('No se encontró credencial de servicio para firebase-admin.');
  console.error('Opciones:\n 1) Colocar JSON de cuenta de servicio en ./lib/serviceAccountKey.json\n 2) Establecer env SERVICE_ACCOUNT_PATH con la ruta al JSON\n 3) Establecer GOOGLE_APPLICATION_CREDENTIALS apuntando al JSON');
  process.exit(1);
}

const db = admin.firestore();

async function uploadProducts() {
  if (!Array.isArray(products) || products.length === 0) {
    console.log('No hay productos en products.json para subir.');
    return;
  }

  const batchLimit = 500; // Firestore limit per batch
  let uploaded = 0;
  try {
    for (let i = 0; i < products.length; i += batchLimit) {
      const batch = db.batch();
      const slice = products.slice(i, i + batchLimit);
      slice.forEach((product) => {
        const ref = db.collection('productos').doc();
        const doc = Object.assign({}, product, { fechaCreacion: admin.firestore.FieldValue.serverTimestamp() });
        batch.set(ref, doc);
      });
      await batch.commit();
      uploaded += slice.length;
      console.log(`Subidos ${uploaded}/${products.length} productos`);
    }
    console.log('Todos los productos fueron subidos correctamente.');
  } catch (err) {
    console.error('Error durante la subida:', err.message || err);
    process.exit(1);
  }
}

uploadProducts().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
