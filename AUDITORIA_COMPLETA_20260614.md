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

## Actualizacion de auditoria - Puesta en produccion integral

Fecha de actualizacion: 2026-07-07  
Referencia: plan "Rustico Barber - Web / Correccion y Puesta en Produccion"  
Estado recomendado: listo como sitio estatico comercial; pendiente como sistema integrado.

### Alcance real del proyecto

El portal web ya puede operar como landing comercial con reservas via WhatsApp. Sin embargo, para considerarlo un modulo web integrado al ecosistema Rustico, todavia debe conectarse con:

- API publica de reservas.
- Base de datos MySQL central.
- Panel administrativo.
- PWA de barberos.
- Automatizaciones de WhatsApp.
- Agenda con disponibilidad real.

### Estado funcional actualizado

Funciona actualmente:

- Landing page responsive.
- Informacion de servicios y barberia.
- Videos locales optimizados.
- Botones y formularios de reserva via WhatsApp.
- Paginas legales basicas.
- SEO local base.
- Medicion preparada para GA4/GTM.
- Servidor local con headers de seguridad.

No funciona todavia como sistema integrado:

- Reserva persistida en base de datos.
- Consulta de disponibilidad real.
- Seleccion de barbero conectada a agenda.
- Confirmacion automatica de cita.
- Recordatorios automaticos.
- Sincronizacion con administrador.
- Vista de agenda por barbero en PWA.
- WhatsApp API con plantillas.

### Prioridades de correccion

Prioridad 1 - Arquitectura frontend:

- Separar `index.html` en archivos mantenibles cuando se pase de landing a aplicacion.
- Extraer CSS a `assets/css/style.css`.
- Extraer JS a modulos como `main.js`, `booking.js`, `calendar.js` y `validation.js`.
- Mantener `index.html` como entrada publica, no como unico contenedor de toda la logica.

Prioridad 2 - API publica:

- Crear `POST /api/public/reservar.php` para registrar citas.
- Crear `GET /api/public/disponibilidad.php` para horarios disponibles.
- Crear `GET /api/public/servicios.php` para servicios activos.
- Crear `GET /api/public/barberos.php` para barberos disponibles.

Prioridad 3 - Reserva real:

- Guardar cada solicitud con cliente, telefono, correo, servicio, barbero, fecha, hora, estado, origen y fecha de creacion.
- Estado inicial recomendado: `pendiente`.
- Origen recomendado: `WEB`.
- WhatsApp debe ser canal de confirmacion, no el unico almacenamiento de la reserva.

Prioridad 4 - Agenda inteligente:

- El usuario no debe escribir horas manualmente en produccion.
- La web debe consultar horario laboral, duracion del servicio, barbero, citas existentes, bloqueos y vacaciones.
- Mostrar solo franjas realmente disponibles.

Prioridad 5 - Integracion con administrador:

- Las citas creadas desde la web deben aparecer automaticamente en agenda diaria, semanal y mensual.
- El administrador debe recibir notificacion de nueva cita.
- El cambio de estado debe reflejarse en web, admin y PWA.

Prioridad 6 - PWA de barberos:

- Cada barbero debe ver solo sus citas.
- La vista minima debe incluir hora, cliente, servicio, observaciones y estado.
- La PWA no debe exponer agendas de otros barberos salvo permisos administrativos.

Prioridad 7 - WhatsApp:

- Flujo recomendado: reserva en web, guardado en BD, confirmacion por WhatsApp API, recordatorio 24 horas, recordatorio 2 horas y solicitud de calificacion.
- Mantener `wa.me` como fallback mientras no exista WhatsApp API.
- Definir plantillas oficiales antes de pasar a produccion automatizada.

Prioridad 8 - Validaciones:

- Frontend: nombre obligatorio, telefono obligatorio, longitud de telefono, correo valido, servicio obligatorio, fecha valida y hora valida.
- Backend: repetir todas las validaciones en servidor.
- Nunca confiar en datos enviados desde el navegador.

Prioridad 9 - Seguridad:

- Usar consultas preparadas.
- Sanitizar entradas.
- Validar CSRF en formularios sensibles.
- Agregar rate limit por IP y telefono.
- Agregar honeypot antispam.
- Evaluar reCAPTCHA invisible si aumenta el spam.
- Registrar errores sin exponer detalles tecnicos al usuario.

Prioridad 10 - Optimizacion:

- Mantener imagenes publicas por debajo de 250 KB cuando sea viable.
- Convertir imagenes pesadas a WebP.
- Usar lazy loading en recursos fuera del primer viewport.
- Minificar CSS y JS cuando se separen.
- Mantener videos comprimidos y con `preload="metadata"`.

Prioridad 11 - SEO y publicacion:

- Definir dominio final.
- Agregar `canonical` definitivo.
- Convertir `og:image` a URL absoluta.
- Mantener `robots.txt`, `sitemap.xml`, Open Graph, Twitter Card y JSON-LD.
- Crear `manifest.json` si se desea comportamiento PWA.

Prioridad 12 - Accesibilidad:

- Revisar `alt` en todas las imagenes.
- Mantener controles como botones reales.
- Revisar foco visible, contraste, etiquetas y navegacion por teclado.
- Evitar `tabindex` innecesario; usarlo solo cuando mejore el flujo real.

Prioridad 13 - Produccion:

- Crear `.env` para credenciales.
- Crear `config.php` para conexion centralizada.
- Definir logs, backups y manejo de errores.
- Versionar cambios de base de datos.
- Separar configuracion local, pruebas y produccion.

### Modelo de datos minimo recomendado

Tablas base:

- `clientes`
- `barberos`
- `servicios`
- `agenda`
- `citas`
- `usuarios`
- `roles`
- `configuracion`
- `recordatorios`
- `mensajes`

Tablas posteriores, cuando exista venta o caja:

- `pagos`
- `ventas`
- `caja`
- `productos`
- `inventario`

### Checklist operativo

Arquitectura:

- [ ] Separar HTML, CSS y JS.
- [ ] Crear modulos de reservas, calendario y validacion.
- [ ] Documentar estructura publica y privada.

Backend:

- [ ] Crear API de reservas.
- [ ] Crear API de servicios.
- [ ] Crear API de disponibilidad.
- [ ] Crear API de barberos.

Base de datos:

- [ ] Crear esquema MySQL.
- [ ] Guardar reservas.
- [ ] Crear indices para fecha, barbero, estado y cliente.
- [ ] Preparar migraciones o scripts versionados.

Integraciones:

- [ ] Conectar administrador.
- [ ] Conectar PWA de barberos.
- [ ] Conectar WhatsApp API.

Seguridad:

- [ ] Prepared statements.
- [ ] Validaciones backend.
- [ ] CSRF.
- [ ] Rate limit.
- [ ] Honeypot o captcha.

SEO y rendimiento:

- [ ] Dominio final.
- [ ] Canonical.
- [ ] Lighthouse sobre produccion.
- [ ] Imagenes optimizadas.
- [ ] JS/CSS separados y minificados.

QA:

- [ ] Chrome.
- [ ] Firefox.
- [ ] Edge.
- [ ] Android.
- [ ] iPhone.
- [ ] Flujo completo de reserva.
- [ ] Flujo de error y reintento.

### Definicion de terminado

El modulo Web solo debe marcarse como finalizado para produccion integral cuando:

- Las reservas se almacenen en MySQL.
- La disponibilidad se consulte en tiempo real.
- El administrador vea inmediatamente las nuevas citas.
- Cada barbero vea solo su agenda desde la PWA.
- WhatsApp envie confirmaciones y recordatorios automaticos.
- Lighthouse supere 90 en Performance, Accessibility, Best Practices y SEO.
- La carga inicial movil este por debajo de 2 segundos en produccion.
- Existan controles de seguridad contra spam, CSRF, entradas invalidas e inyeccion SQL.
- El sistema use una unica base de datos MySQL para web, admin y PWA.
