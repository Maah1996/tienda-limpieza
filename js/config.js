/* =========================================================================
   CONFIGURACIÓN GENERAL DEL SITIO
   -------------------------------------------------------------------------
   👉 EDITA AQUÍ tus datos: WhatsApp, correo, enlace de pago, etc.
   Todo lo que cambies aquí se refleja en toda la página automáticamente.
   ========================================================================= */

const CONFIG = {
  // ----- DATOS DE LA EMPRESA -----
  empresa: "MAAH Clean",                     // 👉 Nombre de tu empresa
  ciudad: "Punta Arenas, Magallanes",        // 👉 Ciudad / zona de despacho
  direccion: "Calle Norte 3, Villa Pudeto, Punta Arenas", // 👉 Dirección física (provisoria, cámbiala luego)

  // ----- CONTACTO -----
  // Número de WhatsApp en formato internacional SIN "+" ni espacios.
  // Ejemplo Chile: 56912345678
  whatsapp: "56990774683",                   // 👉 Tu número real (+56 9 9077 4683)
  correo: "",                                // 👉 Pendiente: lo ponemos al elegir el nombre/correo
  telefono: "+56 9 9077 4683",               // 👉 Mismo número (no tienes fijo)

  // ----- IVA -----
  iva: 0.19,                                 // IVA Chile 19% (no cambiar salvo necesidad)

  // ----- PAGO ONLINE (CHECKOUT EXTERNO) -----
  // Pega aquí el enlace de tu botón de pago (Mercado Pago / Flow / Khipu / Webpay).
  // El carrito redirige a este enlace al presionar "Pagar online".
  // Si lo dejas vacío (""), el botón avisará que debes configurarlo.
  pagoOnlineURL: "",                         // 👉 Ej: "https://mpago.la/xxxxxx"

  // ----- REDES SOCIALES (footer). Deja "" para ocultar -----
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/"
};
