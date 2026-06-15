# Checklist de calidad - Rustico Web

Fecha de revision: 15 de junio de 2026

## Diseno y UX

- [x] Responsive probado en navegador integrado:
  - Android compacto: 360 x 800
  - iPhone moderno: 390 x 844
  - Tablet: 768 x 1024
  - Desktop: 1366 x 768
- [x] Sin overflow horizontal real en los viewports probados.
- [x] Menu inferior mobile visible en Android/iPhone/tablet.
- [x] Botones y CTAs principales con area tactil minima de 44 px.
- [x] Titulos principales corregidos para lectura accesible: sin palabras pegadas por saltos visuales.
- [ ] Prueba manual pendiente en Safari real y Firefox real. En Windows se probo con navegador integrado Chromium; Safari requiere iPhone/iPad/Mac real.

## Funcionalidad tecnica

- [x] `npm.cmd run quality` pasa sin errores.
- [x] `npm.cmd run validate` pasa sin errores.
- [x] 104 referencias locales revisadas; 0 assets faltantes.
- [x] 0 anchors internos rotos.
- [x] 0 enlaces `href="#"`.
- [x] Paginas legales locales verificadas: privacidad, cookies y terminos.
- [x] Formulario de reserva presente, con 7 opciones de servicio.
- [x] Modal mobile de reserva probado: abre correctamente y actualiza estado accesible.
- [ ] Envio real de WhatsApp pendiente de prueba manual para evitar transmitir mensajes desde automatizacion.
- [x] Pasarela de pago: no aplica, el sitio no tiene pagos ni carrito.

## Contenido y legal

- [x] Sin `Lorem Ipsum`.
- [x] Sin mojibake detectado.
- [x] Paginas legales existentes:
  - Politica de Privacidad
  - Politica de Cookies
  - Aviso Legal y Terminos
- [ ] Pendiente externo: completar correo legal y NIT/identificacion oficial del titular.

## Rendimiento y SEO

- [x] Title y meta description en todas las paginas HTML.
- [x] Canonical en todas las paginas HTML.
- [x] Open Graph y Twitter image con URL absoluta de produccion.
- [x] Favicon y Apple Touch Icon instalados.
- [x] Sitemap y robots apuntan a la URL publicada.
- [x] Logo optimizado generado desde el logo adjunto:
  - `Rustico/logo-rustico-navbar-gold.png`
  - `Rustico/logo-rustico-footer-gold.png`
  - `Rustico/logo-rustico-og-gold.png`
  - `Rustico/favicon-gold.png`
  - `Rustico/apple-touch-icon-gold.png`
- [ ] PageSpeed Insights: intento realizado, API respondio `429 Too Many Requests`. Ejecutar nuevamente desde https://pagespeed.web.dev/ cuando el limite lo permita.

## Seguridad y analitica

- [x] Produccion publicada por GitHub Pages con HTTPS.
- [x] Servidor local incluye headers de seguridad para pruebas locales.
- [x] Banner de cookies y consentimiento de analytics implementado.
- [ ] Pendiente externo: instalar ID real de GA4 o GTM. El sitio tiene `gtag`/eventos preparados, pero no hay medicion hasta agregar el ID.
