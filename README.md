# Micalú Animaciones — Landing

Landing page de **Micalú Animaciones** (animación infantil y experiencias creativas, Buenos Aires).
Sitio estático, sin frameworks ni build step: se abre directamente en el navegador o se sube tal cual a cualquier hosting estático.

---

## v1.1 — Resumen de modificaciones

Refactor de arquitectura: se pasó de **un único archivo** (todo el CSS y JS embebido dentro de `Landing.html`) a una estructura **modular por responsabilidades**, sin cambiar ni el diseño, ni el comportamiento, ni el responsive.

### Qué cambió
- **CSS extraído** del `<style>` a `css/` (3 archivos por tipo).
- **JS extraído** de los `<script>` a `js/` (5 módulos por funcionalidad).
- **Carpeta `img/`** creada como espacio reservado para las fotos reales (hoy todas las imágenes son placeholders CSS / SVG inline).
- `Landing.html` pasó de **2539 → 824 líneas**.

### Qué NO cambió (igual a v1.0)
- Diseño, tipografías, colores, animaciones y blobs decorativos.
- Comportamiento responsive en todos los breakpoints.
- Lógica JS: efecto 3D al scrollear, parallax, slideshows, carrusel de galería, modal de complementos, formulario de reserva (calendario + dropdown + validación + envío a WhatsApp), acordeón de FAQ y menú hamburguesa.
- SEO: meta tags, Open Graph, Twitter Card y datos estructurados JSON-LD (siguen inline en el `<head>`).

### Verificación (sin regresiones)
La extracción se hizo por script y se validó equivalencia:
- **CSS:** las 414 reglas presentes; conjunto de reglas idéntico al original.
- **JS:** las 10 secciones (IIFE) byte-idénticas; solo cambió su agrupación en módulos.
- Sin `<style>` ni `<script>` inline sobrantes; llaves balanceadas en todos los archivos.

---

## Estructura

```
landing-micaluanimaciones/
├── Landing.html          # marcado + JSON-LD inline + enlaces a css/ y js/
├── css/
│   ├── styles.css        # base, layout y estilos de componentes (orden original)
│   ├── animations.css    # @keyframes (resueltos por nombre, sin orden)
│   └── responsive.css    # todos los @media (se carga ÚLTIMO)
├── js/
│   ├── animations.js     # cards 3D al scroll, parallax de blobs, tilt del hero, reveal-on-scroll
│   ├── carousel.js       # carrusel de galería + slideshows de las propuestas
│   ├── modal.js          # modal de detalle de "Complementos"
│   ├── booking.js        # formulario de reserva (dropdown, calendario, validación, envío WhatsApp)
│   └── ui.js             # acordeón FAQ + menú hamburguesa mobile
├── img/
│   └── README.md         # carpeta reservada para fotos reales
└── README.md             # este archivo
```

### Orden de carga (importante para el CSS)
`styles.css` → `animations.css` → `responsive.css`.
`responsive.css` se enlaza al final para que los overrides de cada breakpoint sigan ganando como en v1.0.
Los `<script>` van al final del `<body>` (mismo timing que antes: el DOM ya está parseado).

---

## Cómo usar

- **Ver localmente:** abrir `Landing.html` en el navegador, o servir la carpeta:
  ```bash
  python3 -m http.server 8000   # luego http://localhost:8000/Landing.html
  ```
- **Editar estilos:** un componente → `css/styles.css`; una animación → `css/animations.css`; un ajuste mobile/breakpoint → `css/responsive.css`.
- **Editar lógica:** ubicar el módulo por funcionalidad en `js/`.

---

## Notas

- **Imágenes:** hoy no hay archivos raster; los "FOTO · …" son placeholders CSS. Ver `img/README.md` para convenciones al sumar fotos reales (usar `webp`, rutas relativas `img/<archivo>`, `loading="lazy"`).
- **`og-image.jpg`:** referenciada con URL **absoluta** en los meta tags. No moverla a `img/` (los crawlers de redes sociales necesitan URL absoluta).
- **Pendiente opcional:** renombrar `Landing.html` → `index.html` (estándar web). No se hizo para no romper posibles referencias/deploys existentes.

## Pendientes del backlog (desde v1.0)
Fotos reales (hero, Cami, galería, propuestas), info de precios, video en hero, prellenado del formulario desde los botones de servicio, `og:image` 1200×630, Google Business, y typos menores ("Taller creativos" → "Talleres creativos", "Educación fisica" → "Educación física").
