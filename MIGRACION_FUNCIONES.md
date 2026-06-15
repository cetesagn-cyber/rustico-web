# Rústico Web - Lista de funciones para migración

Fecha de preparación: 2026-06-10

## Resumen

Sitio web estático para Rústico Barber & Concept Shop. La aplicación principal vive en `index.html`, usa assets locales dentro de `Rustico/` y puede servirse directamente con `file://` o con el servidor estático local `serve-static.mjs`.

## Entradas principales

- `index.html`: página completa con estilos CSS y JavaScript embebidos.
- `serve-static.mjs`: servidor estático endurecido para publicar `index.html` y assets dentro de `Rustico/`.
- `package.json`: dependencia directa `jimp`, usada para scripts de procesamiento de imágenes.
- `Rustico/`: imágenes, logos, galería y videos del sitio.
- `n8n-workflows/`: flujos JSON de automatización relacionados con citas.

## Funciones visibles del sitio

- Header con topbar de ubicación, horarios, Instagram y WhatsApp.
- Navbar sticky con logo sólido limpio y enlaces de navegación.
- Menú móvil tipo overlay.
- Hero principal con foto estática, overlay azul oscuro y botones de reserva/servicios.
- Cinta animada de servicios y marca.
- Sección “Cómo funciona” con video de fondo, difuminado azul y tres pasos de reserva.
- Sección “Quiénes somos” con foto principal y video pequeño decorativo.
- Sección de servicios con tarjetas, precios, duración y botones de reserva.
- Menú completo de precios.
- Galería con fotos y dos tiles de video.
- Estadísticas de marca.
- Equipo.
- Testimonios.
- Ventajas del sistema de reservas.
- Sección de reserva por WhatsApp.
- Mapa embebido de Google Maps.
- Footer con logo, navegación, servicios, contacto y redes.
- Bottom nav móvil con acceso rápido a inicio, servicios, reserva, galería y contacto.
- Modal móvil/desktop para finalizar reserva por WhatsApp.
- Botones flotantes de WhatsApp y agenda en desktop.

## Funciones JavaScript

- `onScroll`: aplica clase visual al navbar al hacer scroll.
- `syncAmbientVideos`: reproduce o pausa videos según `prefers-reduced-motion`.
- `toggleMobileNav`: abre/cierra navegación móvil.
- `closeMobileNav`: cierra navegación móvil.
- IntersectionObserver para animaciones `sr` al entrar en viewport.
- IntersectionObserver para contadores animados.
- `enviarReservaWA`: arma mensaje de WhatsApp desde formulario de reserva desktop.
- Smooth scroll para enlaces internos `#`.
- Bottom nav activo según sección visible.
- `abrirReserva`: abre modal de reserva con servicio/precio desde tarjeta.
- `abrirReservaGeneral`: abre modal de reserva sin servicio preseleccionado.
- `cerrarReserva`: cierra modal de reserva.
- `confirmarWhatsApp`: arma mensaje de WhatsApp desde modal de reserva.

## Integraciones externas

- Google Fonts:
  - Playfair Display
  - Raleway
  - Cinzel
- WhatsApp:
  - Número usado: `+57 313 3930398`
  - Enlaces `wa.me/573133930398`
- Instagram:
  - `https://www.instagram.com/rusticobarbershop_official`
- Google Maps:
  - Dirección: `Cra. 13 #78-17, Bogotá D.C, Colombia`
  - Iframe con `sandbox` y `referrerpolicy`.

## Assets clave

- Logo actual del sitio:
  - `Rustico/logo-rustico-4k-solid-clean.png`
- Logo preview:
  - `Rustico/logo-rustico-4k-solid-clean-preview-dark.png`
- Foto hero:
  - `Rustico/Rusticofoto2.jpeg`
- Videos:
  - `Rustico/Videos/WhatsApp Video 2026-06-03 at 6.53.07 PM.mp4`
  - `Rustico/Videos/WhatsApp Video 2026-06-03 at 6.53.10 PM.mp4`
- Galería procesada:
  - `Rustico/gallery/g1.jpg` a `Rustico/gallery/g6.jpg`

## Seguridad y servidor local

`serve-static.mjs` solo publica:

- `/index.html`
- archivos bajo `/Rustico/`

Bloquea archivos internos como:

- `package.json`
- `serve-static.mjs`
- `.git/config`

Headers configurados:

- `Content-Security-Policy`
- `Cross-Origin-Resource-Policy`
- `Permissions-Policy`
- `Referrer-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`

## Cómo ejecutar localmente

Desde la raíz del proyecto:

```bash
node serve-static.mjs 8090
```

Abrir:

```text
http://127.0.0.1:8090/
```

También puede abrirse directamente:

```text
file:///.../Rustico Web/index.html
```

## Consideraciones para migración

- Mantener la carpeta `Rustico/` junto a `index.html`; las rutas son relativas.
- Si se publica en hosting estático, subir `index.html` y toda la carpeta `Rustico/`.
- Si se usa servidor propio, replicar los headers de `serve-static.mjs` en Nginx/Apache/CDN.
- El sitio depende de Google Fonts y Google Maps; requiere internet para esos recursos.
- Los videos son MP4 locales y deben conservar nombres/rutas exactas o actualizar referencias.
- Si se cambia el número de WhatsApp, actualizar todas las ocurrencias de `573133930398`.

## Estado visual actual

- Hero con foto estática y difuminado azul.
- “Cómo funciona” con video de fondo y overlay azul aclarado.
- Logo sólido limpio sin brillo/difuminado.
- Video de “Quiénes somos” reducido y desplazado hacia abajo para mostrar más foto.
