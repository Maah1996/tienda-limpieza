/* =========================================================================
   LÓGICA DEL SITIO: catálogo, filtros, carrito, WhatsApp y pago online.
   No necesitas editar este archivo para uso normal.
   Para cambiar productos -> js/productos.js
   Para cambiar datos/WhatsApp/pago -> js/config.js
   ========================================================================= */

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

// Formatea un número como pesos chilenos: 8990 -> "$8.990"
function clp(valor) {
  return "$" + Math.round(valor).toLocaleString("es-CL");
}

// Precio con IVA incluido
function conIVA(precioNeto) {
  return precioNeto * (1 + CONFIG.iva);
}

// Atajo para seleccionar elementos
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));


/* ------------------------------------------------------------------ */
/* CARRITO (persistido en localStorage)                               */
/* ------------------------------------------------------------------ */

const CARRITO_KEY = "carrito_limpieza";

// Carga el carrito guardado. Estructura: { idProducto: cantidad, ... }
function leerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CARRITO_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(id, cantidad = 1) {
  const carrito = leerCarrito();
  carrito[id] = (carrito[id] || 0) + cantidad;
  if (carrito[id] < 1) delete carrito[id];
  guardarCarrito(carrito);
  animarIconoCarrito();
  mostrarToast("Producto agregado al carrito");
}

function cambiarCantidad(id, cantidad) {
  const carrito = leerCarrito();
  carrito[id] = cantidad;
  if (carrito[id] < 1) delete carrito[id];
  guardarCarrito(carrito);
  renderCarrito();
}

function quitarDelCarrito(id) {
  const carrito = leerCarrito();
  delete carrito[id];
  guardarCarrito(carrito);
  renderCarrito();
}

function vaciarCarrito() {
  guardarCarrito({});
  renderCarrito();
}

// Devuelve un array con los productos del carrito + cantidad
function itemsCarrito() {
  const carrito = leerCarrito();
  return Object.keys(carrito).map(id => {
    const prod = PRODUCTOS.find(p => p.id == id);
    return prod ? { ...prod, cantidad: carrito[id] } : null;
  }).filter(Boolean);
}

function totalUnidades() {
  const carrito = leerCarrito();
  return Object.values(carrito).reduce((a, b) => a + b, 0);
}

function actualizarContadorCarrito() {
  const cont = totalUnidades();
  const badge = $("#contador-carrito");
  if (badge) {
    badge.textContent = cont;
    badge.style.display = cont > 0 ? "flex" : "none";
  }
}

function animarIconoCarrito() {
  const icono = $("#btn-carrito");
  if (!icono) return;
  icono.classList.remove("bump");
  // Forzar reflow para reiniciar la animación
  void icono.offsetWidth;
  icono.classList.add("bump");
}


/* ------------------------------------------------------------------ */
/* RENDER DEL CATÁLOGO                                                 */
/* ------------------------------------------------------------------ */

let filtroCategoria = "Todas";
let filtroFormato = "Todos";
let textoBusqueda = "";

// Lista de formatos únicos a partir de los productos
function formatosDisponibles() {
  return [...new Set(PRODUCTOS.map(p => p.formato))];
}

function productosFiltrados() {
  return PRODUCTOS.filter(p => {
    const okCat = filtroCategoria === "Todas" || p.categoria === filtroCategoria;
    const okForm = filtroFormato === "Todos" || p.formato === filtroFormato;
    const txt = textoBusqueda.toLowerCase();
    const okTxt = !txt ||
      p.nombre.toLowerCase().includes(txt) ||
      p.descripcion.toLowerCase().includes(txt) ||
      p.categoria.toLowerCase().includes(txt);
    return okCat && okForm && okTxt;
  });
}

function tarjetaProducto(p, indice = 0) {
  const precioConIva = conIVA(p.precioNeto);
  return `
    <article class="card reveal" data-id="${p.id}" style="--i:${indice}">
      ${p.destacado ? '<span class="badge-destacado">★ Destacado</span>' : ''}
      <button class="card-img" onclick="abrirModal(${p.id})" aria-label="Ver ${p.nombre}">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy"
             onerror="this.src='img/placeholder.svg'">
      </button>
      <div class="card-body">
        <span class="card-cat">${p.categoria}</span>
        <h3 class="card-titulo">${p.nombre}</h3>
        <p class="card-formato">${p.formato}</p>
        <div class="card-precios">
          <span class="precio-neto">${clp(p.precioNeto)} <small>neto</small></span>
          <span class="precio-iva">${clp(precioConIva)} <small>c/IVA</small></span>
        </div>
        <div class="card-acciones">
          <button class="btn btn-primario" onclick="agregarAlCarrito(${p.id})">
            Agregar al carrito
          </button>
          <button class="btn btn-whatsapp" onclick="cotizarWhatsAppProducto(${p.id})">
            Cotizar por WhatsApp
          </button>
        </div>
      </div>
    </article>`;
}

function renderCatalogo() {
  const cont = $("#grilla-productos");
  if (!cont) return;
  const lista = productosFiltrados();
  if (lista.length === 0) {
    cont.innerHTML = `<p class="sin-resultados">No se encontraron productos con esos filtros.</p>`;
    return;
  }
  cont.innerHTML = lista.map((p, i) => tarjetaProducto(p, i)).join("");
  observarReveal(); // activa la aparición animada de las nuevas tarjetas
}

// Construye los botones de filtro de categoría
function renderFiltros() {
  const contCat = $("#filtros-categoria");
  if (contCat) {
    const todas = ["Todas", ...CATEGORIAS];
    contCat.innerHTML = todas.map(cat => `
      <button class="chip ${cat === filtroCategoria ? 'chip-activo' : ''}"
              onclick="setFiltroCategoria('${cat}')">${cat}</button>
    `).join("");
  }

  const selForm = $("#filtro-formato");
  if (selForm && selForm.options.length <= 1) {
    formatosDisponibles().forEach(f => {
      const opt = document.createElement("option");
      opt.value = f;
      opt.textContent = f;
      selForm.appendChild(opt);
    });
  }
}

function setFiltroCategoria(cat) {
  filtroCategoria = cat;
  renderFiltros();
  renderCatalogo();
}


/* ------------------------------------------------------------------ */
/* MODAL DE PRODUCTO                                                   */
/* ------------------------------------------------------------------ */

function abrirModal(id) {
  const p = PRODUCTOS.find(x => x.id == id);
  if (!p) return;
  const modal = $("#modal-producto");
  $("#modal-contenido").innerHTML = `
    <button class="modal-cerrar" onclick="cerrarModal()" aria-label="Cerrar">&times;</button>
    <div class="modal-grid">
      <div class="modal-img">
        <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='img/placeholder.svg'">
      </div>
      <div class="modal-info">
        <span class="card-cat">${p.categoria}</span>
        <h2 id="modal-titulo">${p.nombre}</h2>
        <p class="modal-desc">${p.descripcion}</p>

        <h4>Usos recomendados</h4>
        <ul class="modal-usos">
          ${p.usos.map(u => `<li>${u}</li>`).join("")}
        </ul>

        <p class="modal-formato"><strong>Formato:</strong> ${p.formato}</p>

        <div class="card-precios modal-precios">
          <span class="precio-neto">${clp(p.precioNeto)} <small>neto</small></span>
          <span class="precio-iva">${clp(conIVA(p.precioNeto))} <small>c/IVA 19%</small></span>
        </div>

        <div class="modal-acciones">
          <button class="btn btn-primario" onclick="agregarAlCarrito(${p.id})">Agregar al carrito</button>
          <button class="btn btn-whatsapp" onclick="cotizarWhatsAppProducto(${p.id})">Cotizar por WhatsApp</button>
        </div>

        ${p.fichaPDF ? `<a class="link-ficha" href="${p.fichaPDF}" target="_blank" rel="noopener">📄 Ver ficha técnica / seguridad (PDF)</a>` : ''}
      </div>
    </div>`;
  modal.classList.add("abierto");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  const modal = $("#modal-producto");
  modal.classList.remove("abierto");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}


/* ------------------------------------------------------------------ */
/* PANEL DEL CARRITO                                                   */
/* ------------------------------------------------------------------ */

function abrirCarrito() {
  renderCarrito();
  $("#panel-carrito").classList.add("abierto");
  $("#overlay-carrito").classList.add("visible");
  document.body.style.overflow = "hidden";
}

function cerrarCarrito() {
  $("#panel-carrito").classList.remove("abierto");
  $("#overlay-carrito").classList.remove("visible");
  document.body.style.overflow = "";
}

function renderCarrito() {
  const cont = $("#items-carrito");
  const items = itemsCarrito();

  if (items.length === 0) {
    cont.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío.</p>`;
    $("#resumen-carrito").innerHTML = "";
    return;
  }

  cont.innerHTML = items.map(p => `
    <div class="item-carrito">
      <img src="${p.imagen}" alt="${p.nombre}" onerror="this.src='img/placeholder.svg'">
      <div class="item-info">
        <p class="item-nombre">${p.nombre}</p>
        <p class="item-formato">${p.formato}</p>
        <p class="item-precio">${clp(p.precioNeto)} neto c/u</p>
      </div>
      <div class="item-controles">
        <div class="cantidad">
          <button onclick="cambiarCantidad(${p.id}, ${p.cantidad - 1})" aria-label="Restar">−</button>
          <span>${p.cantidad}</span>
          <button onclick="cambiarCantidad(${p.id}, ${p.cantidad + 1})" aria-label="Sumar">+</button>
        </div>
        <button class="item-quitar" onclick="quitarDelCarrito(${p.id})" aria-label="Quitar">Quitar</button>
      </div>
    </div>
  `).join("");

  const neto = items.reduce((s, p) => s + p.precioNeto * p.cantidad, 0);
  const iva = neto * CONFIG.iva;
  const total = neto + iva;

  $("#resumen-carrito").innerHTML = `
    <div class="resumen-fila"><span>Neto</span><span>${clp(neto)}</span></div>
    <div class="resumen-fila"><span>IVA (19%)</span><span>${clp(iva)}</span></div>
    <div class="resumen-fila resumen-total"><span>Total</span><span>${clp(total)}</span></div>
    <button class="btn btn-pagar" onclick="pagarOnline()">💳 Pagar online</button>
    <button class="btn btn-whatsapp btn-block" onclick="cotizarWhatsAppCarrito()">🟢 Cotizar todo por WhatsApp</button>
    <button class="btn btn-texto" onclick="vaciarCarrito()">Vaciar carrito</button>
  `;
}


/* ------------------------------------------------------------------ */
/* FLUJO 1: PAGO ONLINE (checkout externo)                            */
/* ------------------------------------------------------------------ */

function pagarOnline() {
  if (itemsCarrito().length === 0) {
    mostrarToast("Tu carrito está vacío");
    return;
  }
  // 👉 El enlace de pago se configura en js/config.js (pagoOnlineURL)
  if (!CONFIG.pagoOnlineURL) {
    alert(
      "El pago online aún no está configurado.\n\n" +
      "Para activarlo, pega tu enlace de Mercado Pago / Flow / Khipu / Webpay " +
      "en el archivo js/config.js (campo pagoOnlineURL).\n\n" +
      "Mientras tanto, puedes cotizar por WhatsApp."
    );
    return;
  }
  // Redirige al checkout externo que tú configures.
  window.location.href = CONFIG.pagoOnlineURL;
}


/* ------------------------------------------------------------------ */
/* FLUJO 2: COTIZAR POR WHATSAPP                                       */
/* ------------------------------------------------------------------ */

// Abre WhatsApp con un mensaje prellenado
function abrirWhatsApp(mensaje) {
  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  // "noopener,noreferrer": evita que la pestaña de WhatsApp pueda manipular esta página
  window.open(url, "_blank", "noopener,noreferrer");
}

// Cotizar un solo producto desde su tarjeta o modal
function cotizarWhatsAppProducto(id) {
  const p = PRODUCTOS.find(x => x.id == id);
  if (!p) return;
  const msg =
    `Hola ${CONFIG.empresa}, quiero cotizar:\n\n` +
    `• ${p.nombre}\n` +
    `  Formato: ${p.formato}\n` +
    `  Precio ref.: ${clp(p.precioNeto)} neto\n\n` +
    `¿Me confirman precio por volumen y despacho? Gracias.`;
  abrirWhatsApp(msg);
}

// Cotizar todo el carrito por WhatsApp
function cotizarWhatsAppCarrito() {
  const items = itemsCarrito();
  if (items.length === 0) {
    mostrarToast("Tu carrito está vacío");
    return;
  }
  let msg = `Hola ${CONFIG.empresa}, quiero cotizar el siguiente pedido:\n\n`;
  let neto = 0;
  items.forEach(p => {
    const sub = p.precioNeto * p.cantidad;
    neto += sub;
    msg += `• ${p.cantidad} x ${p.nombre} (${p.formato}) — ${clp(sub)} neto\n`;
  });
  const total = neto * (1 + CONFIG.iva);
  msg += `\nSubtotal neto: ${clp(neto)}`;
  msg += `\nTotal con IVA: ${clp(total)}`;
  msg += `\n\n¿Me confirman disponibilidad, precio por volumen y despacho? Gracias.`;
  abrirWhatsApp(msg);
}


/* ------------------------------------------------------------------ */
/* FORMULARIO DE COTIZACIÓN PARA EMPRESAS                              */
/* ------------------------------------------------------------------ */

function enviarCotizacionEmpresa(e) {
  e.preventDefault();
  const f = e.target;
  const empresa = f.empresa.value.trim();
  const contacto = f.contacto.value.trim();
  const correo = f.correo.value.trim();
  const detalle = f.detalle.value.trim();

  const msg =
    `*Solicitud de cotización (Empresas)*\n\n` +
    `Empresa: ${empresa}\n` +
    `Contacto: ${contacto}\n` +
    `Correo: ${correo}\n\n` +
    `Detalle / productos:\n${detalle}`;

  // Por defecto envía por WhatsApp. Si prefieres mailto, descomenta la línea de abajo.
  abrirWhatsApp(msg);
  // window.location.href = `mailto:${CONFIG.correo}?subject=Cotización empresa&body=${encodeURIComponent(msg)}`;

  mostrarToast("Abriendo WhatsApp con tu solicitud…");
  f.reset();
}


/* ------------------------------------------------------------------ */
/* TOAST (mensaje flotante)                                            */
/* ------------------------------------------------------------------ */

let toastTimer;
function mostrarToast(texto) {
  let toast = $("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = texto;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2500);
}


/* ------------------------------------------------------------------ */
/* INYECTAR DATOS DE CONFIG EN EL HTML                                */
/* ------------------------------------------------------------------ */

function inyectarDatosEmpresa() {
  $$("[data-empresa]").forEach(el => el.textContent = CONFIG.empresa);
  $$("[data-ciudad]").forEach(el => el.textContent = CONFIG.ciudad);
  $$("[data-correo]").forEach(el => {
    el.textContent = CONFIG.correo;
    if (el.tagName === "A") el.href = "mailto:" + CONFIG.correo;
  });
  $$("[data-telefono]").forEach(el => el.textContent = CONFIG.telefono);
  $$("[data-direccion]").forEach(el => el.textContent = CONFIG.direccion);
  $$("[data-anio]").forEach(el => el.textContent = new Date().getFullYear());

  // Enlaces de WhatsApp generales
  $$("[data-wa]").forEach(el => {
    const msg = el.getAttribute("data-wa") || `Hola ${CONFIG.empresa}, quiero más información.`;
    el.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  });

  // Redes sociales
  const ig = $("#link-instagram");
  const fb = $("#link-facebook");
  if (ig) { CONFIG.instagram ? ig.href = CONFIG.instagram : ig.style.display = "none"; }
  if (fb) { CONFIG.facebook ? fb.href = CONFIG.facebook : fb.style.display = "none"; }
}


/* ------------------------------------------------------------------ */
/* ANIMACIONES AL HACER SCROLL (aparición de elementos)               */
/* ------------------------------------------------------------------ */

// Observa los elementos con clase .reveal y les agrega .visible al entrar en pantalla
let _observer;
function observarReveal() {
  if (!("IntersectionObserver" in window)) {
    // Navegador antiguo: mostrar todo sin animación
    $$(".reveal").forEach(el => el.classList.add("visible"));
    return;
  }
  if (!_observer) {
    _observer = new IntersectionObserver((entradas) => {
      entradas.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          _observer.unobserve(e.target); // se anima una sola vez
        }
      });
    }, { threshold: 0.12 });
  }
  $$(".reveal:not(.visible)").forEach(el => _observer.observe(el));
}


/* ------------------------------------------------------------------ */
/* CARRUSEL DEL HERO (rotación automática + flechas + puntos)          */
/* ------------------------------------------------------------------ */

function iniciarCarrusel() {
  const slides = $$(".hero-carrusel .slide");
  const dots = $("#carrusel-dots") || $(".carrusel-dots");
  if (slides.length === 0) return;

  let actual = 0;
  let timer;
  const INTERVALO = 6000; // milisegundos entre cambios de lámina

  // Crear los puntos según la cantidad de láminas
  if (dots) {
    dots.innerHTML = "";
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Ir a la lámina " + (i + 1));
      b.addEventListener("click", () => irA(i));
      dots.appendChild(b);
    });
  }
  const puntos = dots ? $$("button", dots) : [];

  function mostrar(i) {
    slides.forEach((s, n) => s.classList.toggle("activa", n === i));
    puntos.forEach((p, n) => p.classList.toggle("activo", n === i));
    actual = i;
  }
  function irA(i) {
    mostrar((i + slides.length) % slides.length);
    reiniciarTimer();
  }
  function siguiente() { irA(actual + 1); }
  function anterior() { irA(actual - 1); }

  function reiniciarTimer() {
    clearInterval(timer);
    timer = setInterval(siguiente, INTERVALO);
  }

  // Flechas
  $(".flecha-next")?.addEventListener("click", siguiente);
  $(".flecha-prev")?.addEventListener("click", anterior);

  // Pausar al pasar el mouse por encima
  const carrusel = $(".hero-carrusel");
  carrusel?.addEventListener("mouseenter", () => clearInterval(timer));
  carrusel?.addEventListener("mouseleave", reiniciarTimer);

  // Deslizar con el dedo en móvil
  let x0 = null;
  carrusel?.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true });
  carrusel?.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) (dx < 0 ? siguiente() : anterior());
    x0 = null;
  });

  mostrar(0);
  reiniciarTimer();
}


/* ------------------------------------------------------------------ */
/* INICIALIZACIÓN                                                      */
/* ------------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  inyectarDatosEmpresa();
  renderFiltros();
  renderCatalogo();
  actualizarContadorCarrito();
  observarReveal(); // activa animaciones de aparición al hacer scroll
  iniciarCarrusel(); // arranca el carrusel del hero

  // Sombra del header al desplazar la página
  const header = $(".header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    }, { passive: true });
  }

  // Buscador
  const buscador = $("#buscador");
  if (buscador) {
    buscador.addEventListener("input", e => {
      textoBusqueda = e.target.value;
      renderCatalogo();
    });
  }

  // Filtro de formato
  const selForm = $("#filtro-formato");
  if (selForm) {
    selForm.addEventListener("change", e => {
      filtroFormato = e.target.value;
      renderCatalogo();
    });
  }

  // Botón carrito
  $("#btn-carrito")?.addEventListener("click", abrirCarrito);
  $("#cerrar-carrito")?.addEventListener("click", cerrarCarrito);
  $("#overlay-carrito")?.addEventListener("click", cerrarCarrito);

  // Formulario empresas
  $("#form-empresa")?.addEventListener("submit", enviarCotizacionEmpresa);

  // Cerrar modal al hacer clic fuera del contenido
  $("#modal-producto")?.addEventListener("click", e => {
    if (e.target.id === "modal-producto") cerrarModal();
  });

  // Cerrar con tecla Escape (accesibilidad)
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { cerrarModal(); cerrarCarrito(); }
  });

  // Menú móvil
  $("#btn-menu")?.addEventListener("click", () => {
    $("#menu-principal")?.classList.toggle("abierto");
  });
  // Cerrar menú móvil al hacer clic en un enlace
  $$("#menu-principal a").forEach(a =>
    a.addEventListener("click", () => $("#menu-principal")?.classList.remove("abierto"))
  );
});
