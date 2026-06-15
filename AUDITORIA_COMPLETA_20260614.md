# Auditoria completa - Rustico Barber

Fecha: 2026-06-14  
URL local publicada: http://127.0.0.1:8090/  
Archivo principal: `index.html`  
Servidor local: `serve-static.mjs`

## Estado ejecutivo

La pagina quedo reforzada para una revision tecnica seria: mejor rendimiento, mejor base SEO, mejor seguridad local, mejor accesibilidad y una capa de medicion lista para Google Analytics 4 o Google Tag Manager.

No se instalo todavia la etiqueta real de Google porque falta el ID oficial (`G-XXXXXXXXXX` o `GTM-XXXXXXX`). La pagina ya tiene `dataLayer`, Consent Mode por defecto en denegado, banner de consentimiento y eventos propios para medir consumo y conversion.

## Mejoras aplicadas

### Rendimiento

- Se creo `Rustico/logo-rustico-web.png` para uso real en navbar/footer.
- Se creo `Rustico/logo-rustico-og.png` para compartir en redes.
- Se dejo el logo 4K como master, pero ya no se carga en la interfaz.
- Se cambio `preload="auto"` por `preload="metadata"` en videos para reducir consumo inicial.
- Se agrego cache fuerte para assets estaticos en el servidor local.

Resultado de peso:

- Logo 4K master: 7.17 MB.
- Logo web: 39.5 KB.
- Logo social/OG: 70 KB.

### Medicion Google-ready

- Se agrego `window.dataLayer`.
- Se agrego funcion global `trackEvent`.
- Se agrego Consent Mode por defecto:
  - `analytics_storage: denied`
  - `ad_storage: denied`
  - `ad_user_data: denied`
  - `ad_personalization: denied`
- Se agrego banner de consentimiento con aceptar/rechazar.
- Se agregaron eventos:
  - `section_view`
  - `scroll_depth`
  - `video_impression`
  - `video_play`
  - `video_pause`
  - `cta_click`
  - `menu_open`
  - `desktop_booking_submit`
  - `booking_modal_open`
  - `booking_whatsapp_submit`
  - `whatsapp_click`
  - `instagram_click`
  - `map_click`
  - `consent_update`

Referencias:

- GA4 eventos: https://developers.google.com/analytics/devguides/collection/ga4/events
- Consent Mode: https://developers.google.com/tag-platform/security/guides/consent

### SEO y negocio local

- Se agregaron metadatos Open Graph.
- Se agrego Twitter Card.
- Se agrego `robots`.
- Se agrego `theme-color`.
- Se agrego JSON-LD tipo `Barbershop` con nombre, descripcion, telefono, direccion, redes y horarios.
- Se agrego preload de la imagen hero.

Pendiente por dependencia externa:

- Agregar `canonical` cuando exista dominio final.
- Cambiar `og:image` a URL absoluta cuando exista dominio final.

Referencia:

- Datos estructurados para negocios locales: https://developers.google.com/search/docs/appearance/structured-data/local-business

### Seguridad

- Se mantuvo restriccion de rutas publicas: solo `/index.html` y `/Rustico/*`.
- Se reforzo CSP para compatibilidad futura con GA4/GTM.
- Se mantiene:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: SAMEORIGIN`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Cross-Origin-Resource-Policy: same-origin`
- Se mantiene sandbox en Google Maps.
- Enlaces externos importantes usan `rel="noopener"`.

Riesgo residual:

- La CSP aun permite `'unsafe-inline'` porque la pagina usa CSS y JS dentro del HTML. Para endurecimiento maximo de produccion, separar CSS/JS a archivos o usar hashes/nonces.

### Accesibilidad y UX

- El menu hamburguesa paso de `div role="button"` a `<button>`.
- Se agrego `aria-controls` y `aria-expanded`.
- Se agrego control de foco basico en menu mobile y modal.
- Se mantiene cierre con Escape.
- Se agrego consentimiento visible sin invadir la estetica.

## Pruebas ejecutadas

- `node --check serve-static.mjs`: sin errores.
- `GET http://127.0.0.1:8090/`: `200 OK`.
- `GET /Rustico/logo-rustico-web.png`: `200 OK`.
- Headers finales verificados:
  - CSP con dominios Google listos para medicion.
  - `Cache-Control: public, max-age=31536000, immutable` para assets.
  - `X-Content-Type-Options: nosniff`.
  - `Referrer-Policy`.
  - `Permissions-Policy`.
- Validacion de IDs HTML: 40 IDs, 0 duplicados.
- Busqueda de problemas corregidos:
  - Sin referencias a `logo-rustico-4k-solid-clean.png` en la interfaz.
  - Sin `preload="auto"` en videos.
  - Sin `div.hamburger` no semantico.

## Pendientes antes de publicacion final

1. Entregar ID de GA4 (`G-XXXXXXXXXX`) o GTM (`GTM-XXXXXXX`).
2. Definir dominio final para `canonical` y URLs absolutas de Open Graph.
3. Publicar politica de privacidad y cookies real.
4. Ejecutar Lighthouse/PageSpeed sobre el dominio publicado.
5. Revisar textos legales y tratamiento de datos segun la operacion real.

## Recomendacion PM

Para operar la pagina como canal comercial, recomiendo usar Google Tag Manager con GA4. Asi se pueden ajustar conversiones, audiencias, eventos y pauta sin editar el codigo cada vez.

El funnel principal debe medirse asi:

1. Vista de pagina.
2. Vista de seccion servicios.
3. Apertura de reserva.
4. Envio a WhatsApp.
5. Click a Maps.
6. Click a Instagram.
7. Consumo de video.

Con eso se puede responder: que seccion vende, que servicio interesa, donde se pierde la gente y que contenido realmente consume el visitante.
