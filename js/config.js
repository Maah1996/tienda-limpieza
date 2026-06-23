/* =========================================================================
   CONFIGURACIÓN GENERAL DEL SITIO
   -------------------------------------------------------------------------
   👉 EDITA AQUÍ tus datos: WhatsApp, correo, enlace de pago, etc.
   Todo lo que cambies aquí se refleja en toda la página automáticamente.
   ========================================================================= */

const CONFIG = {
  // ----- DATOS DE LA EMPRESA -----
  empresa: "AquaClean Magallanes",          // 👉 Nombre de tu empresa
  ciudad: "Punta Arenas, Magallanes",        // 👉 Ciudad / zona de despacho
  direccion: "Av. Bulnes 1234, Punta Arenas", // 👉 Dirección física

  // ----- CONTACTO -----
  // Número de WhatsApp en formato internacional SIN "+" ni espacios.
  // Ejemplo Chile: 56912345678
  whatsapp: "56912345678",                   // 👉 CAMBIA por tu número
  correo: "ventas@aquaclean.cl",             // 👉 Tu correo de ventas
  telefono: "+56 9 1234 5678",               // 👉 Teléfono (opcional, visual)

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
