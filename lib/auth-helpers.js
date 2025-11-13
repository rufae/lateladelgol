// lib/auth-helpers.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Verifica si un usuario está autorizado para acceder al panel de administración
 * @param {string} email - Email del usuario
 * @returns {Promise<boolean>} - true si está autorizado, false si no
 */
export async function isUserAuthorized(email) {
  try {
    // Buscar en la colección 'usuarios_autorizados'
    const userDoc = await getDoc(doc(db, 'usuarios_autorizados', email));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.autorizado === true;
    }
    
    return false;
  } catch (error) {
    console.error('Error verificando autorización:', error);
    return false;
  }
}
