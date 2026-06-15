# Auditoria PM + Desarrollo - Rustico Barber

Fecha: 2026-06-13  
URL local auditada: http://127.0.0.1:8090/  
Archivo principal: `index.html`

## Resumen ejecutivo

La pagina esta visualmente avanzada y ya funciona como vitrina/reserva por WhatsApp. El punto mas importante para publicar con disciplina de negocio es que todavia no esta lista para medicion tipo Google: no hay GA4, Google Tag Manager, Consent Mode, capa de eventos ni eventos de conversion para entender consumo, reservas o rendimiento comercial.

Desde el lado tecnico, el servidor local responde correctamente y tiene headers de seguridad basicos. Los riesgos principales estan en medicion, rendimiento por activos pesados, SEO estructurado y accesibilidad de algunos controles.

## Pruebas realizadas

- Servidor local: `GET http://127.0.0.1:8090/` respondio `200`.
- Sintaxis del servidor: `node --check serve-static.mjs` sin errores.
- Dependencias instaladas: solo `jimp@1.6.1`.
- Busqueda de medicion: no se encontraron `gtag`, `googletagmanager`, `dataLayer`, `GTM-`, `G-` ni `AW-` reales en `index.html`.
- Headers observados:
  - `Content-Security-Policy`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: SAMEORIGIN`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Nota: no se ejecuto Lighthouse completo porque no hay Chrome/Edge disponible como comando local en este entorno.

## Hallazgos criticos

### 1. No hay medicion Google implementada

Estado: critico para pauta, SEO analitico y decisiones comerciales.

Evidencia:
- No existe GA4 ni GTM en `index.html`.
- No existe `dataLayer`.
- No hay eventos para reservas, WhatsApp, clicks de contacto, consumo de video, scroll o secciones vistas.

Impacto:
- No se puede medir bien el consumo de la pagina.
- No se puede saber que servicios generan mas interes.
- No se puede separar trafico organico, Instagram, WhatsApp, Google Ads o referidos.
- No se puede optimizar conversion de visitas a reservas.

Recomendacion:
- Crear cuenta GA4 y/o contenedor GTM.
- Implementar Consent Mode v2 antes de cargar medicion con cookies.
- Medir el funnel completo con eventos propios.

Referencias utiles:
- GA4 eventos recomendados y personalizados: https://developers.google.com/analytics/devguides/collection/ga4/events
- Google tag y Consent Mode: https://developers.google.com/tag-platform/security/guides/consent

### 2. Falta consentimiento de usuario para analitica

Estado: alto.

La pagina no tiene banner ni estado de consentimiento. Para una implementacion responsable con Google, la pagina deberia iniciar con analitica/ads en estado denegado y actualizar el consentimiento cuando el usuario acepte.

Eventos de consentimiento recomendados:
- `analytics_storage`
- `ad_storage`
- `ad_user_data`
- `ad_personalization`

### 3. Activos demasiado pesados para web

Estado: alto.

Evidencia:
- `Rustico/logo-rustico-4k-solid-clean.png` se usa en navbar y footer.
- El logo 4K pesa varios MB y se muestra en tamanos pequenos.
- Hay videos con `preload="auto"` en varias secciones.

Impacto:
- Mayor consumo de datos.
- Riesgo de mala puntuacion en Core Web Vitals.
- Carga inicial mas pesada, especialmente en celular.

Recomendacion:
- Mantener el logo 4K como master/impresion.
- Crear versiones web optimizadas:
  - `logo-rustico-web.png` o `.webp` para navbar/footer.
  - `logo-rustico-og.png` para redes.
- Cambiar videos secundarios a `preload="metadata"` o lazy-load.
- Dejar `preload="auto"` solo si el video es protagonista de la seccion.

Referencia:
- Core Web Vitals: https://web.dev/vitals/

### 4. SEO incompleto para negocio local

Estado: medio-alto.

Correcto:
- Hay `<title>`.
- Hay `meta description`.
- Hay `lang="es"`.

Falta:
- `canonical`.
- Open Graph para compartir en WhatsApp/Facebook.
- Twitter/X card.
- JSON-LD de negocio local tipo `Barbershop` o `LocalBusiness`.
- Imagen social optimizada.

Impacto:
- Peor presentacion al compartir enlaces.
- Menos claridad para Google sobre direccion, telefono, horarios y tipo de negocio.

Referencia:
- Datos estructurados LocalBusiness: https://developers.google.com/search/docs/appearance/structured-data/local-business

### 5. Accesibilidad con detalles mejorables

Estado: medio.

Evidencia:
- El menu hamburguesa es un `div role="button"` con `onclick`, pero no se observo manejo dedicado de Enter/Espacio.
- Los modales tienen `role="dialog"` y `aria-modal`, pero no hay focus trap completo.
- Hay videos decorativos correctamente silenciados, pero conviene mantenerlos ocultos a lectores si no aportan contenido.

Recomendacion:
- Convertir hamburguesa a `<button>`.
- Agregar focus trap en modal y menu mobile.
- Revisar contraste despues de los overlays azules.

### 6. Seguridad: buena base, falta endurecimiento de produccion

Estado: medio.

Correcto:
- Servidor local restringe rutas a `/index.html` y `/Rustico/*`.
- Hay CSP, `nosniff`, `Referrer-Policy` y bloqueo de permisos sensibles.
- Links externos usan `rel="noopener"`.

Riesgo:
- La CSP permite `'unsafe-inline'` para scripts y estilos porque la pagina esta en un solo HTML.

Recomendacion:
- Para produccion fuerte: separar CSS/JS a archivos, usar hashes/nonces o eliminar inline scripts.
- Agregar politica de cache diferenciada para imagenes/videos.

## Eventos recomendados para medir consumo y conversion

Eventos GA4/GTM sugeridos:

- `page_view`: vista inicial.
- `section_view`: cuando el usuario ve `inicio`, `como_funciona`, `nosotros`, `servicios`, `galeria`, `equipo`, `reservar`, `contacto`.
- `cta_click`: clicks en botones principales.
- `service_select`: cuando abre reserva desde una tarjeta de servicio.
- `booking_modal_open`: apertura del modal de reserva.
- `booking_whatsapp_submit`: click final para WhatsApp.
- `desktop_booking_submit`: envio desde formulario de escritorio.
- `whatsapp_click`: clicks directos a WhatsApp.
- `instagram_click`: clicks a Instagram.
- `map_click`: clicks a Google Maps.
- `video_impression`: video visible.
- `video_play`: video intenta reproducirse.
- `video_pause`: pausa por preferencias de movimiento o usuario.
- `scroll_depth`: 25%, 50%, 75%, 90%.

Parametros utiles:

- `section`
- `service_name`
- `service_price`
- `cta_location`
- `video_name`
- `device_type`
- `booking_source`

## KPIs PM recomendados

- Porcentaje de visitantes que llegan a servicios.
- Porcentaje de visitantes que abren reserva.
- Porcentaje de visitantes que terminan en WhatsApp.
- Servicio mas solicitado.
- Clicks a Instagram.
- Clicks a Google Maps.
- Consumo de video por seccion.
- Scroll depth promedio.
- LCP, CLS, INP.
- Peso total transferido en primera carga.

## Prioridad de accion

1. Pedir/crear ID de GA4 o GTM.
2. Agregar Consent Mode v2 y banner de consentimiento.
3. Agregar `dataLayer` y eventos de negocio.
4. Optimizar logo web sin perder el master 4K.
5. Cambiar preload de videos secundarios para reducir consumo.
6. Agregar SEO local: canonical, OG, JSON-LD.
7. Mejorar accesibilidad de menu y modales.
8. Ejecutar Lighthouse/PageSpeed en ambiente publicado.

## Decision recomendada

Para lanzar con medicion seria, recomiendo usar Google Tag Manager. Da mas control al negocio sin tocar codigo cada vez que se quiera ajustar GA4, Ads, conversiones, remarketing o eventos.

Si se busca simplicidad, GA4 directo tambien sirve, pero GTM es mejor para escalar.

Datos que faltan para implementarlo:

- ID de GA4: formato `G-XXXXXXXXXX`.
- Opcional ID de GTM: formato `GTM-XXXXXXX`.
- Dominio final de publicacion para `canonical` y medicion.
- Confirmacion de politica de privacidad/cookies.
