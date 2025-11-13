# 🔐 GUÍA COMPLETA DE CONFIGURACIÓN - LaTelaDelGol

## ✅ CHECKLIST DE FUNCIONALIDAD

### ¿Qué falta para que el proyecto sea 100% funcional?

#### 1. ✅ Código implementado (COMPLETO)
- ✅ Sistema de autenticación con Email/Password y Google
- ✅ Validación de usuarios autorizados (whitelist)
- ✅ CRUD completo de productos
- ✅ Integración con Cloudinary para imágenes
- ✅ Catálogo público con búsqueda y filtros
- ✅ Panel de administración completo
- ✅ Botón admin en esquina superior derecha

#### 2. ⚠️ Configuración externa requerida

**Firebase:**
- [ ] Habilitar Authentication (Email/Password y Google)
- [ ] Crear base de datos Firestore
- [ ] Configurar reglas de Firestore
- [ ] Añadir usuarios autorizados a Firestore

**Cloudinary:**
- [ ] Crear cuenta
- [ ] Crear Upload Preset (tipo: unsigned)
- [ ] Copiar credenciales al .env.local

**Variables de entorno:**
- [ ] Completar archivo .env.local con credenciales reales

---

## 📋 PASO 1: CONFIGURAR FIREBASE AUTHENTICATION

### 1.1 Habilitar métodos de autenticación

1. Ve a: https://console.firebase.google.com/
2. Selecciona tu proyecto: **lateladelgol**
3. Click en **Authentication** en el menú lateral
4. Click en **Get Started** (si es la primera vez)
5. Ve a la pestaña **Sign-in method**

### 1.2 Habilitar Email/Password

1. Click en **Email/Password**
2. Activa el switch de **Enable**
3. Click en **Save**

### 1.3 Habilitar Google Sign-In

1. Click en **Google**
2. Activa el switch de **Enable**
3. Selecciona un email de soporte (tu email)
4. Click en **Save**

### 1.4 Crear usuarios administradores

1. Ve a la pestaña **Users** en Authentication
2. Click en **Add user**
3. Ingresa el email del primer administrador (ej: `admin@lateladelgol.com`)
4. Ingresa una contraseña segura
5. Click en **Add user**
6. Repite para el segundo administrador si lo necesitas

**⚠️ IMPORTANTE:** Estos usuarios NO tendrán acceso aún. Necesitas añadirlos a la whitelist en Firestore.

---

## 📋 PASO 2: CONFIGURAR FIRESTORE DATABASE

### 2.1 Crear la base de datos

1. En Firebase Console, click en **Firestore Database**
2. Click en **Create database**
3. Selecciona **Start in production mode**
4. Elige la ubicación más cercana (ej: `europe-west1`)
5. Click en **Enable**

### 2.2 Configurar reglas de seguridad

1. Ve a la pestaña **Rules**
2. Reemplaza el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de productos: lectura pública, escritura solo autenticados
    match /productos/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Colección de usuarios autorizados: solo lectura para autenticados
    match /usuarios_autorizados/{email} {
      allow read: if request.auth != null;
      allow write: if false; // Solo añadir manualmente desde la consola
    }
  }
}
```

3. Click en **Publish**

### 2.3 Crear colección de usuarios autorizados

1. En Firestore, click en **Start collection**
2. **Collection ID:** `usuarios_autorizados`
3. Click en **Next**

### 2.4 Añadir el primer usuario autorizado

1. **Document ID:** El email del administrador (ej: `admin@lateladelgol.com`)
   - ⚠️ IMPORTANTE: Usa el email COMPLETO como ID del documento
2. **Campo 1:**
   - Field: `email`
   - Type: `string`
   - Value: `admin@lateladelgol.com`
3. **Campo 2:**
   - Field: `autorizado`
   - Type: `boolean`
   - Value: `true` ✅
4. **Campo 3:**
   - Field: `nombre`
   - Type: `string`
   - Value: `Administrador Principal`
5. **Campo 4:**
   - Field: `fechaCreacion`
   - Type: `timestamp`
   - Value: (click en el icono del reloj para usar fecha actual)
6. Click en **Save**

### 2.5 Añadir el segundo usuario autorizado

Repite el paso 2.4 con el email del segundo administrador.

**Ejemplo visual de la estructura:**

```
usuarios_autorizados (colección)
  └── admin@lateladelgol.com (documento)
        ├── email: "admin@lateladelgol.com"
        ├── autorizado: true
        ├── nombre: "Administrador Principal"
        └── fechaCreacion: November 13, 2025 at 10:00:00 AM UTC+1
  
  └── admin2@lateladelgol.com (documento)
        ├── email: "admin2@lateladelgol.com"
        ├── autorizado: true
        ├── nombre: "Administrador Secundario"
        └── fechaCreacion: November 13, 2025 at 10:05:00 AM UTC+1
```

---

## 📋 PASO 3: CONFIGURAR CLOUDINARY

Ya tienes las credenciales en tu `.env.local`, pero verifica:

### 3.1 Crear/Verificar Upload Preset

1. Ve a: https://cloudinary.com/console
2. Click en **Settings** (⚙️)
3. Ve a la pestaña **Upload**
4. Scroll hasta **Upload presets**
5. Si no existe, click en **Add upload preset**:
   - **Preset name:** `lateladelgol_products` (o el que prefieras)
   - **Signing Mode:** **Unsigned** ⚠️ (MUY IMPORTANTE)
   - **Folder:** `lateladelgol` (opcional, para organizar)
   - Click en **Save**

### 3.2 Actualizar .env.local

Asegúrate de que tu archivo `.env.local` tenga:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name_real
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset_real
```

**Para encontrar tu Cloud Name:**
- Ve al Dashboard de Cloudinary
- Lo verás en la parte superior: "Cloud name: **tu_cloud_name**"

---

## 📋 PASO 4: VERIFICAR VARIABLES DE ENTORNO

Tu archivo `.env.local` debe verse así (con TUS valores reales):

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDjo5LvQpzhvNXDAix4VS9Q9hdrLGGvcYw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lateladelgol.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lateladelgol
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lateladelgol.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=725861455190
NEXT_PUBLIC_FIREBASE_APP_ID=1:725861455190:web:9e7f7dbab62b2ff97ef2f7
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-8869DX1V28

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name_real_aqui
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset_real_aqui
```

⚠️ **DESPUÉS DE ACTUALIZAR:** Reinicia el servidor de desarrollo:
```bash
Ctrl+C (detener servidor)
npm run dev (reiniciar)
```

---

## 📋 PASO 5: PROBAR LA APLICACIÓN

### 5.1 Test de autenticación

1. Ve a http://localhost:3000
2. Click en el botón **🔐 Admin** (esquina superior derecha)
3. **Prueba 1 - Email/Password:**
   - Ingresa el email del admin que creaste
   - Ingresa la contraseña
   - Click en "Iniciar Sesión"
   - ✅ Debería entrar al panel
   
4. **Prueba 2 - Google:**
   - Cierra sesión
   - Click en "Iniciar con Google"
   - Selecciona una cuenta de Google autorizada
   - ✅ Si el email está en la whitelist, entrará
   - ❌ Si no está, mostrará: "No tienes permisos..."

### 5.2 Test de creación de productos

1. En el panel de admin, click en **+ Nuevo Producto**
2. Completa el formulario:
   - **Nombre:** Chaqueta Nike Pro
   - **Categoría:** chaquetas
   - **Precio:** 49.99
   - **Descripción:** Chaqueta deportiva de alta calidad
   - **Imagen:** Selecciona una imagen de tu PC
3. Click en **Crear Producto**
4. ✅ Deberías ver:
   - Notificación de éxito
   - El producto aparece en la lista
   - La imagen se subió a Cloudinary

### 5.3 Test del catálogo público

1. Ve a http://localhost:3000
2. ✅ Deberías ver el producto que acabas de crear
3. Prueba el buscador
4. Prueba los filtros de categoría

---

## 🔒 SISTEMA DE SEGURIDAD

### ¿Cómo funciona la whitelist?

1. **Usuario intenta iniciar sesión** (Email o Google)
2. **Firebase autentica** las credenciales
3. **La app verifica** si el email está en `usuarios_autorizados`
4. **Si está autorizado:** Accede al panel
5. **Si NO está autorizado:** Se cierra la sesión automáticamente

### ¿Cómo añadir más administradores?

**Opción 1: Desde Firebase Console (recomendado)**

1. Ve a Firestore Database
2. Abre la colección `usuarios_autorizados`
3. Click en **Add document**
4. **Document ID:** email_del_nuevo_admin@ejemplo.com
5. Añade los campos:
   ```
   email: "email_del_nuevo_admin@ejemplo.com"
   autorizado: true
   nombre: "Nombre del Admin"
   fechaCreacion: (timestamp actual)
   ```
6. Click en **Save**

**Opción 2: Por código (avanzado)**

Podrías crear un script para añadir usuarios, pero por seguridad es mejor hacerlo manualmente desde la consola.

---

## ✅ CHECKLIST FINAL

Antes de considerar el proyecto 100% funcional:

- [ ] Firebase Authentication configurado (Email + Google)
- [ ] Usuarios creados en Firebase Authentication
- [ ] Firestore Database creado
- [ ] Reglas de Firestore publicadas
- [ ] Colección `usuarios_autorizados` creada
- [ ] Al menos 1 usuario añadido a la whitelist
- [ ] Cloudinary Upload Preset configurado (unsigned)
- [ ] Variables de entorno en .env.local completas
- [ ] Servidor reiniciado después de actualizar .env.local
- [ ] Probado login con Email/Password ✅
- [ ] Probado login con Google ✅
- [ ] Probado crear producto ✅
- [ ] Probado que la imagen se sube a Cloudinary ✅
- [ ] Probado que el producto aparece en Firestore ✅
- [ ] Probado que el producto se ve en el catálogo público ✅

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "No tienes permisos para acceder"

**Causa:** El email no está en la whitelist de Firestore
**Solución:**
1. Ve a Firestore Database
2. Verifica que existe la colección `usuarios_autorizados`
3. Verifica que el email del usuario está como ID del documento
4. Verifica que el campo `autorizado` es `true` (boolean)

### Error al subir imágenes a Cloudinary

**Causa 1:** Upload preset no es "unsigned"
**Solución:** Ve a Cloudinary Settings → Upload → Edita el preset → Signing Mode: **Unsigned**

**Causa 2:** Credenciales incorrectas en .env.local
**Solución:** Verifica `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` y `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

### Error: "Firebase: Error (auth/popup-closed-by-user)"

**Causa:** El usuario cerró la ventana de Google antes de completar el login
**Solución:** Es normal, no es un error real. Intenta de nuevo.

### Los productos no se guardan en Firestore

**Causa:** Las reglas de Firestore bloquean la escritura
**Solución:** Verifica que las reglas permitan `allow write: if request.auth != null;`

---

## 🎉 ¡PROYECTO COMPLETO Y FUNCIONAL!

Una vez completados todos los pasos, tu aplicación estará 100% funcional:

✅ **Catálogo público** visible para todos
✅ **Panel de admin** solo para usuarios autorizados
✅ **Login con Email/Password y Google**
✅ **Validación de whitelist automática**
✅ **Subida de imágenes a Cloudinary**
✅ **Almacenamiento de productos en Firestore**
✅ **CRUD completo** (Crear, Leer, Actualizar, Eliminar)

---

## 📞 RESUMEN DE CREDENCIALES NECESARIAS

### Firebase (Ya tienes)
- API Key ✅
- Auth Domain ✅
- Project ID ✅
- Storage Bucket ✅
- Messaging Sender ID ✅
- App ID ✅
- Measurement ID ✅

### Cloudinary (Faltan actualizar)
- Cloud Name ⚠️ (actualizar en .env.local)
- Upload Preset ⚠️ (actualizar en .env.local)

### Usuarios autorizados
- Email 1: admin@lateladelgol.com (o el que uses)
- Email 2: (opcional, el segundo admin)

---

**¡Ahora tienes toda la información para poner en marcha tu aplicación!** 🚀⚽
