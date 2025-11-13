# Proyecto: LaTelaDelGol ⚽  
## Catálogo Deportivo Interactivo con Next.js + Firebase + Cloudinary

---

### 🏆 Descripción general

Quiero crear una aplicación web moderna, inmersiva y elegante llamada **LaTelaDelGol**, inspirada visualmente en el logotipo oficial (paleta azul, rojo y negro, estilo deportivo y dinámico).  
El objetivo principal es ofrecer un **catálogo de prendas deportivas** con las secciones: **Chaquetas, Chándales, Camisetas y Moda**, donde los usuarios puedan explorar los productos, y el administrador (yo) pueda iniciar sesión, añadir nuevos artículos, editarlos o eliminarlos.

---

### 🧠 Objetivo técnico

Desarrollar una aplicación **Next.js** con interfaz fluida y visual (usando **TailwindCSS** y **Framer Motion**) que se conecte a:

- **Firebase Firestore** → para guardar los datos de los productos.  
- **Firebase Authentication** → para el login del administrador.  
- **Cloudinary** → para almacenar las imágenes de los productos y obtener sus URLs públicas.  
- **Vercel** → para desplegar el frontend (sin backend propio).

Todo el proyecto debe funcionar únicamente con tecnologías frontend, aprovechando servicios externos (Firebase + Cloudinary) para mantener la arquitectura limpia, gratuita y fácilmente desplegable.

---

### 🧩 Estructura del catálogo

El catálogo debe tener cuatro secciones principales:
- Chaquetas  
- Chándales  
- Camisetas  
- Moda  

Cada producto incluirá:
- Imagen (subida a Cloudinary y mostrada desde su URL)  
- Nombre  
- Descripción  
- Precio  
- Categoría  
- Fecha de creación  

Además, debe permitir búsquedas, filtrado por categoría y mostrar animaciones suaves al interactuar con los productos.

---

### 🔐 Zona de administrador

El administrador podrá:
- Iniciar sesión con Firebase Authentication.  
- Crear nuevos productos (rellenando un formulario con nombre, descripción, precio, categoría e imagen).  
- Editar productos existentes.  
- Eliminar productos del catálogo.  

El panel debe ser simple, visual y coherente con el diseño general de la web, mostrando alertas visuales (por ejemplo, con **SweetAlert2** o **React Toastify**) para confirmar acciones.

---

### 💾 Base de datos (Firebase Firestore)

Estructura del documento de producto:

```js
{
  id: string,
  nombre: string,
  descripcion: string,
  categoria: "chaquetas" | "chandals" | "camisetas" | "moda",
  precio: number,
  imagenURL: string,
  fechaCreacion: Timestamp
}


### ACLARACIONES

☁️ Almacenamiento de imágenes (Cloudinary)

Las imágenes no deben guardarse en Firebase Storage, sino en Cloudinary, usando su API desde el frontend.
Al subir una imagen, la función debe devolver la URL segura (secure_url) que se almacenará en Firestore junto al producto.

Ejemplo del flujo:

El administrador selecciona una imagen.

La imagen se sube a Cloudinary mediante un fetch POST con FormData.

Cloudinary devuelve la URL pública (secure_url).

Esa URL se guarda en Firestore como imagenURL.

Ejemplo de función de subida:

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "tu_upload_preset");

  const res = await fetch("https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
};

💻 Tecnologías principales
Funcionalidad	Tecnología
Frontend	Next.js (React Framework)
Estilos	TailwindCSS
Animaciones	Framer Motion
Autenticación	Firebase Authentication
Base de datos	Firebase Firestore
Almacenamiento de imágenes	Cloudinary
Despliegue	Vercel
🎨 Estilo visual

El diseño debe reflejar la estética del logotipo:

Fondo oscuro o con gradientes azul/rojo.

Tipografía moderna y deportiva.

Tarjetas con bordes redondeados y animaciones al hacer hover.

Secciones separadas visualmente por categorías.

Transiciones suaves al navegar entre páginas.

Cabecera con el logo “LaTelaDelGol” y pie con créditos simples.

📱 Funcionalidades clave

Catálogo dinámico con carga desde Firestore.

Paginación o carga progresiva de productos.

Filtros por categoría.

Buscador de productos por nombre o descripción.

Animaciones fluidas al mostrar o eliminar productos.

Panel de administración con CRUD completo.

Login/logout con Firebase Authentication.

Confirmaciones visuales con SweetAlert2 o Toastify.

🚀 Despliegue

El proyecto debe estar listo para desplegarse en Vercel, con las variables de entorno necesarias:

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=


El despliegue no requiere backend propio ni servidor adicional.
Todo el flujo (auth, BD y subida de imágenes) se gestiona desde el frontend.

✅ Resultado esperado

Una aplicación totalmente funcional, elegante, responsive e intuitiva que sirva como catálogo profesional de ropa deportiva LaTelaDelGol, lista para ser presentada o utilizada en producción.

La app debe combinar:

La estética del logotipo (deportivo y moderno).

Una UX fluida y cuidada.

Un panel de administración simple pero completo.

Código modular, limpio y escalable.