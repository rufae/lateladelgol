# LaTelaDelGol ⚽

**Catálogo Deportivo Interactivo con Next.js + Firebase + Cloudinary**

Una aplicación web moderna e inmersiva para gestionar un catálogo de prendas deportivas con diseño elegante inspirado en los colores azul, rojo y negro.

---

## 🚀 Características

- ✨ **Catálogo Interactivo** con 4 categorías: Chaquetas, Chándales, Camisetas y Moda
- 🔍 **Búsqueda en tiempo real** y filtrado por categoría
- 🎨 **Animaciones fluidas** con Framer Motion
- 🔐 **Panel de Administración** con Firebase Authentication
- 📦 **CRUD completo** para productos (Crear, Leer, Actualizar, Eliminar)
- 🖼️ **Gestión de imágenes** con Cloudinary
- 📱 **Diseño responsive** y mobile-first
- 🎯 **Notificaciones elegantes** con React Toastify y SweetAlert2

---

## 🛠️ Tecnologías

- **Frontend**: Next.js 16 + React 19
- **Estilos**: TailwindCSS 4
- **Animaciones**: Framer Motion
- **Backend/Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Authentication
- **Almacenamiento de imágenes**: Cloudinary
- **Notificaciones**: React Toastify + SweetAlert2

---

## 📋 Requisitos previos

1. **Node.js** (v18 o superior)
2. **Cuenta de Firebase** con proyecto creado
3. **Cuenta de Cloudinary** con upload preset configurado

---

## 🔧 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto (usa `.env.local.example` como referencia):

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
```

### 3. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Firestore Database** (modo producción)
4. Habilita **Authentication** con el método Email/Password
5. Crea un usuario administrador en Authentication
6. Copia las credenciales del proyecto a tu `.env.local`

**Reglas de Firestore recomendadas:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Configurar Cloudinary

1. Ve a [Cloudinary](https://cloudinary.com/)
2. Crea una cuenta o inicia sesión
3. Ve a Settings → Upload
4. Crea un **Upload Preset** (tipo: unsigned)
5. Copia el Cloud Name y Upload Preset a tu `.env.local`

---

## 🚀 Ejecutar la aplicación

### Modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Modo producción

```bash
npm run build
npm start
```

---

## 📱 Uso de la aplicación

### Para usuarios (Catálogo público)

1. Visita la página principal: `/`
2. Explora los productos por categorías
3. Usa el buscador para encontrar productos específicos
4. Filtra por: Chaquetas, Chándales, Camisetas o Moda

### Para administradores

1. Haz clic en **"🔐 Acceso Administrador"** o ve a `/admin`
2. Inicia sesión con tus credenciales de Firebase
3. **Crear productos**: Click en "+ Nuevo Producto"
   - Completa el formulario
   - Sube una imagen (se guardará automáticamente en Cloudinary)
   - Click en "Crear Producto"
4. **Editar productos**: Click en "Editar" en cualquier producto
5. **Eliminar productos**: Click en "Eliminar" (requiere confirmación)
6. **Cerrar sesión**: Click en "Cerrar Sesión"

---

## 📁 Estructura del proyecto

```
lateladelgol/
├── app/
│   ├── admin/
│   │   └── page.js          # Página de administración
│   ├── globals.css          # Estilos globales
│   ├── layout.js            # Layout principal
│   └── page.js              # Página principal (catálogo)
├── components/
│   ├── AdminPanel.js        # Panel CRUD de productos
│   ├── LoginForm.js         # Formulario de login
│   └── ProductCard.js       # Tarjeta de producto
├── lib/
│   ├── cloudinary.js        # Configuración de Cloudinary
│   └── firebase.js          # Configuración de Firebase
├── public/                  # Archivos estáticos
├── .env.local               # Variables de entorno (NO SUBIR A GIT)
├── .env.local.example       # Ejemplo de variables de entorno
├── next.config.mjs          # Configuración de Next.js
├── tailwind.config.js       # Configuración de TailwindCSS
└── package.json             # Dependencias
```

---

## 🗄️ Estructura de datos (Firestore)

**Colección**: `productos`

```javascript
{
  id: string,              // ID autogenerado por Firebase
  nombre: string,          // Nombre del producto
  descripcion: string,     // Descripción detallada
  categoria: string,       // "chaquetas" | "chandals" | "camisetas" | "moda"
  precio: number,          // Precio en euros
  imagenURL: string,       // URL de Cloudinary
  fechaCreacion: Timestamp // Fecha de creación
}
```

---

## 🎨 Paleta de colores

- **Azul principal**: `#2563eb` (blue-600)
- **Rojo principal**: `#dc2626` (red-600)
- **Negro/Oscuro**: `#0f172a` (slate-900)
- **Fondo degradado**: De slate-900 → blue-900 → slate-900

---

## 🚀 Despliegue en Vercel

1. Push tu código a GitHub
2. Ve a [Vercel](https://vercel.com/)
3. Importa tu repositorio
4. Configura las variables de entorno en Vercel (Settings → Environment Variables)
5. Deploy automático ✅

---

## 🔒 Seguridad

- Las variables de entorno NUNCA deben incluirse en el control de versiones
- Las reglas de Firestore deben configurarse para que solo usuarios autenticados puedan escribir
- El upload preset de Cloudinary debe ser tipo "unsigned" para uploads desde el cliente

---

## 📝 Notas importantes

1. **Primera ejecución**: Asegúrate de crear un usuario administrador en Firebase Authentication
2. **Cloudinary**: El upload preset debe ser "unsigned" para funcionar desde el navegador
3. **Firebase**: Las reglas de Firestore deben permitir lectura pública pero escritura solo autenticada

---

## 🐛 Solución de problemas

### Error: Firebase not initialized
- Verifica que todas las variables de entorno estén configuradas correctamente
- Reinicia el servidor de desarrollo

### Error al subir imágenes
- Verifica el Cloud Name y Upload Preset de Cloudinary
- Asegúrate de que el Upload Preset sea tipo "unsigned"

### No puedo iniciar sesión
- Verifica que el usuario exista en Firebase Authentication
- Verifica que el método Email/Password esté habilitado

---

## 👨‍💻 Desarrollado por

LaTelaDelGol - 2025

---

## 📄 Licencia

Este proyecto es privado y está protegido por derechos de autor.

---

¡Disfruta de **LaTelaDelGol**! ⚽🔥
