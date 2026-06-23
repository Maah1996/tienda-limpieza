# AquaClean — Sitio web de productos de limpieza (B2B)

Sitio web profesional y responsivo para una empresa que vende líquidos y productos
de limpieza, orientado a empresas (hostelería, oficinas, industria, restaurantes,
aseo) y también a particulares.

Hecho con **HTML + CSS + JavaScript puro** (sin frameworks). Se puede subir tal cual
a **GitHub Pages**.

---

## 📁 Estructura de archivos

```
tienda-limpieza/
├── index.html          ← página principal
├── css/
│   └── styles.css      ← estilos (aquí cambias los COLORES)
├── js/
│   ├── config.js       ← 👉 WhatsApp, correo, enlace de pago, datos empresa
│   ├── productos.js    ← 👉 catálogo (aquí agregas/editas productos)
│   └── app.js          ← lógica (carrito, filtros, WhatsApp) — no necesitas tocarlo
├── img/                ← imágenes (reemplaza los .svg por tus fotos)
└── productos/          ← fichas técnicas/seguridad en PDF
```

---

## ✏️ Qué editar (lo único importante)

### 1) Tus datos y WhatsApp → `js/config.js`
- `whatsapp`: tu número en formato internacional **sin + ni espacios** (ej: `56912345678`).
- `correo`, `telefono`, `direccion`, `empresa`, `ciudad`.
- `pagoOnlineURL`: pega aquí tu enlace de **Mercado Pago / Flow / Khipu / Webpay**.
  Mientras esté vacío, el botón "Pagar online" avisará que falta configurarlo
  (el flujo de WhatsApp funciona igual).

### 2) Productos → `js/productos.js`
Copia un bloque `{ ... }`, cambia los datos y listo. Campos:
`id, nombre, categoria, descripcion, usos, formato, precioNeto, imagen, fichaPDF, destacado`.
El **precio se pone NETO** (sin IVA); el sitio calcula y muestra el valor con IVA 19% solo.

### 3) Colores → `css/styles.css`
Al inicio del archivo, en `:root`, cambia `--color-primario`, `--color-secundario`, etc.

### 4) Imágenes → carpeta `img/`
Reemplaza los archivos `.svg` por tus fotos (puedes usar `.jpg` o `.png`;
si cambias la extensión, actualiza la ruta `imagen` en `productos.js`).
Tamaño recomendado de foto de producto: **800×600 px**.

### 5) Fichas PDF → carpeta `productos/`
Sube los PDF con el mismo nombre que pusiste en `fichaPDF`.

---

## 🛒 Doble flujo de compra
- **Pagar online:** carrito → botón "Pagar online" → redirige a tu checkout externo (`pagoOnlineURL`).
- **Cotizar por WhatsApp:** arma un mensaje con productos, cantidades y formato, y abre `wa.me`.
  Ideal para ventas por volumen a empresas.

---

## 🚀 Cómo subirlo a GitHub Pages (gratis)

1. Crea un repositorio nuevo en GitHub (ej: `tienda-limpieza`).
2. Sube **todos los archivos** de esta carpeta a la raíz del repositorio
   (puedes arrastrarlos en *Add file → Upload files*, o usar git).
3. En el repo ve a **Settings → Pages**.
4. En **Source** elige la rama `main` y carpeta `/root`. Guarda.
5. Espera ~1 minuto. Tu sitio quedará publicado en:
   `https://TUUSUARIO.github.io/tienda-limpieza/`

### Con git (opcional)
```bash
git init
git add .
git commit -m "Sitio web productos de limpieza"
git branch -M main
git remote add origin https://github.com/TUUSUARIO/tienda-limpieza.git
git push -u origin main
```

Luego activa Pages como en los pasos 3–5.

---

## ✅ Incluye
- Header fijo con menú, buscador y carrito con contador.
- Hero con propuesta de valor y 3 sellos de confianza.
- Catálogo filtrable por categoría y formato, con 6 productos de ejemplo.
- Modal de producto con usos, formato, precio neto + IVA y botón de ficha PDF.
- Sección "Para empresas" con formulario de cotización (envía por WhatsApp).
- Nosotros, Contacto (con espacio para mapa) y Footer.
- Carrito en `localStorage`, SEO básico y diseño responsivo (móvil primero).
