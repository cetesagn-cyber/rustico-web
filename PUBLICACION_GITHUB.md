# Checklist de publicacion en GitHub

## Estado actual

La web esta lista para subir como sitio estatico. Incluye:

- Home principal.
- Paginas legales.
- Banner de cookies.
- Schema `Barbershop`.
- `robots.txt`.
- `sitemap.xml`.
- Servidor local opcional.
- Logo web optimizado.
- Videos locales optimizados para hero, seccion de ambiente y galeria.
- Sistema de reservas por WhatsApp en escritorio y modal de servicios.
- Validaciones basicas en formularios de reserva.
- Servidor local con headers de seguridad y soporte `GET`/`HEAD`.
- Fondo navy restaurado como color principal de marca.
- Seccion "Como funciona" pulida con video en pantalla 16:9, marco premium y pasos en tarjetas.
- `.gitignore`.
- `.nojekyll` para GitHub Pages.

## Cambios recientes

Commit de referencia: `880cd1b Preparar reservas y videos optimizados`.

- Se agregaron videos MP4 optimizados:
  - `Rustico/Videos/rustico-video-hero-1080p.mp4`
  - `Rustico/Videos/rustico-video-ambiente-1080p.mp4`
- Se reemplazaron los nombres largos de videos de WhatsApp en `index.html` por rutas limpias y estables.
- Se actualizo el hero de experiencia, la seccion "sobre nosotros" y dos piezas de galeria para usar los videos optimizados.
- Se convirtio el bloque de reserva de escritorio en un formulario real dentro de `#cal-booking`.
- Se agregaron campos de reserva: nombre, servicio, fecha, hora y nota opcional.
- Se agrego envio a WhatsApp para reservas desde escritorio y desde el modal de servicios.
- Se centralizo la URL de WhatsApp en `WHATSAPP_BOOKING_URL`.
- Se agrego fecha minima igual al dia actual para evitar reservas con fechas pasadas.
- Se agrego resaltado de campos invalidos y limpieza del estado visual al reintentar.
- Se mantuvieron eventos de analitica para reservas y clics a WhatsApp.
- Se ajustaron textos de mensajes de WhatsApp para evitar caracteres especiales innecesarios en la URL.
- Se actualizaron `privacidad.html` y `terminos.html` para usar WhatsApp como canal oficial de contacto.
- Se quitaron referencias a correo legal pendiente en las paginas legales.
- Se reforzo `serve-static.mjs` con:
  - restriccion de metodos a `GET` y `HEAD`;
  - header `Strict-Transport-Security`;
  - directiva `upgrade-insecure-requests`;
  - headers de seguridad tambien en respuestas `403` y `404`;
  - respuesta sin cuerpo para peticiones `HEAD`.
- Se normalizo `package-lock.json` con nombre `rustico-web` y version `1.0.0`.
- Se restauro el fondo azul/navy del sitio para evitar apariencia negra plana.
- Se rediseño la seccion "Como funciona":
  - video dentro del flujo de la seccion;
  - pantalla 16:9 centrada;
  - borde dorado, marco interno y sombra;
  - mejor contraste, saturacion y brillo del video;
  - pasos en tarjetas con fondo translcido y mejor legibilidad;
  - ajustes responsive para tablet y movil.
- Se agrego `_backups/` al `.gitignore` para no publicar paquetes locales de migracion por accidente.

## No subir manualmente

Si se sube por arrastrar archivos al navegador, no incluir:

- `node_modules/`
- carpetas `MIGRACION_RUSTICO_*`
- `.abacusai/`
- `.claude/`
- `n8n-workflows/`
- backups `index.backup-*.html`
- logs `*.log`
- masters pesados de logo `Rustico/logo-rustico-4k*.png`

## Comando recomendado

```bash
npm run validate
```

## Pendientes antes de SEO final

Reemplazar URL local:

```text
http://127.0.0.1:52015
```

por la URL final de GitHub Pages o dominio propio.

Completar:

- NIT o identificacion oficial.
- ID de Google Analytics 4 o Google Tag Manager.

## Archivos que deben estar en el repo

- `.gitignore`
- `.nojekyll`
- `README.md`
- `index.html`
- `privacidad.html`
- `cookies.html`
- `terminos.html`
- `robots.txt`
- `sitemap.xml`
- `serve-static.mjs`
- `package.json`
- `package-lock.json`
- `Rustico/`
