/* =========================================================================
   CATÁLOGO DE PRODUCTOS
   -------------------------------------------------------------------------
   👉 ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR PARA AGREGAR PRODUCTOS.

   Copia y pega un bloque { ... }, cambia los datos y listo.

   Campos de cada producto:
     id          -> número único (no repetir)
     nombre      -> nombre comercial del producto
     categoria   -> debe coincidir con una de las CATEGORÍAS de abajo
     descripcion -> texto corto que aparece en la tarjeta y el modal
     usos        -> array de usos recomendados (se muestran como lista)
     formato     -> presentación / envase (ej: "Bidón 5 L")
     precioNeto  -> precio NETO en CLP, sin IVA (solo número, sin puntos)
     imagen      -> ruta a la foto (reemplaza los archivos en /img)
     fichaPDF    -> ruta a la ficha técnica/seguridad en /productos (o "" si no tienes)
     destacado   -> true para que salga marcado como destacado, false si no
   ========================================================================= */

/* Categorías disponibles para el filtro.
   Si agregas una categoría nueva aquí, el filtro se actualiza solo. */
const CATEGORIAS = [
  "Desengrasantes",
  "Desinfectantes",
  "Limpiadores de pisos",
  "Cocina",
  "Vidrios",
  "Baño",
  "Ambientadores",
  "Ecológicos",
  "Industriales"
];

const PRODUCTOS = [
  {
    id: 1,
    nombre: "Desengrasante Industrial Concentrado",
    categoria: "Desengrasantes",
    descripcion: "Desengrasante de alto poder para grasa pesada en cocinas industriales, talleres y maquinaria.",
    usos: [
      "Campanas y cocinas industriales",
      "Pisos con grasa adherida",
      "Piezas de maquinaria y motores",
      "Diluible hasta 1:20 según suciedad"
    ],
    formato: "Bidón 5 L",
    precioNeto: 8990,
    imagen: "img/producto-1.svg",
    fichaPDF: "productos/desengrasante-industrial.pdf",
    destacado: true
  },
  {
    id: 2,
    nombre: "Desinfectante Amonio Cuaternario",
    categoria: "Desinfectantes",
    descripcion: "Desinfectante de superficies de amplio espectro. Elimina bacterias, hongos y virus.",
    usos: [
      "Superficies de contacto en hostelería",
      "Baños y áreas comunes",
      "Oficinas y salas de espera",
      "Apto para uso profesional con factura"
    ],
    formato: "Bidón 5 L",
    precioNeto: 12500,
    imagen: "img/producto-2.svg",
    fichaPDF: "productos/desinfectante-cuaternario.pdf",
    destacado: true
  },
  {
    id: 3,
    nombre: "Limpiador de Pisos Aroma Lavanda",
    categoria: "Limpiadores de pisos",
    descripcion: "Limpiador perfumado para todo tipo de pisos. Limpia, perfuma y deja brillo sin enjuague.",
    usos: [
      "Cerámica, porcelanato y baldosas",
      "Pisos flotantes y vinílicos",
      "Áreas de alto tránsito",
      "Rinde hasta 200 m² por litro diluido"
    ],
    formato: "Bidón 5 L",
    precioNeto: 6490,
    imagen: "img/producto-3.svg",
    fichaPDF: "productos/limpiador-pisos-lavanda.pdf",
    destacado: false
  },
  {
    id: 4,
    nombre: "Limpiavidrios Profesional Antiempañante",
    categoria: "Vidrios",
    descripcion: "Limpiavidrios de secado rápido sin marcas ni residuos. Ideal para grandes superficies.",
    usos: [
      "Vitrinas y ventanales",
      "Espejos y mamparas",
      "Acero inoxidable y aluminio",
      "Listo para usar con gatillo"
    ],
    formato: "Galón 4 L",
    precioNeto: 5990,
    imagen: "img/producto-4.svg",
    fichaPDF: "productos/limpiavidrios-profesional.pdf",
    destacado: false
  },
  {
    id: 5,
    nombre: "Cloro Gel Desinfectante Baño",
    categoria: "Baño",
    descripcion: "Cloro en gel que se adhiere a las superficies para desinfectar y blanquear con mayor contacto.",
    usos: [
      "Inodoros, urinarios y lavamanos",
      "Juntas y cerámicas de baño",
      "Elimina sarro y manchas orgánicas",
      "Acción desinfectante y blanqueadora"
    ],
    formato: "Bidón 5 L",
    precioNeto: 7290,
    imagen: "img/producto-5.svg",
    fichaPDF: "productos/cloro-gel-bano.pdf",
    destacado: true
  },
  {
    id: 6,
    nombre: "Detergente Multiuso Ecológico Biodegradable",
    categoria: "Ecológicos",
    descripcion: "Limpiador multiuso biodegradable, sin fosfatos. Eficaz y amigable con el medio ambiente.",
    usos: [
      "Superficies en general",
      "Espacios con niños o mascotas",
      "Empresas con certificación ambiental",
      "100% biodegradable"
    ],
    formato: "Bidón 5 L",
    precioNeto: 9900,
    imagen: "img/producto-6.svg",
    fichaPDF: "productos/multiuso-ecologico.pdf",
    destacado: false
  }
];
