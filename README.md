# Rustico Barber & Concept Shop

Sitio web estatico para Rustico Barber & Concept Shop en Bogota.

Sitio publicado: https://cetesagn-cyber.github.io/rustico-web/

## Ejecutar localmente

```bash
npm install
npm run start
```

Abrir:

```text
http://127.0.0.1:8090/
```

## Validar antes de publicar

```bash
npm run validate
npm run quality
```

La validacion revisa archivos requeridos, titulos, meta descriptions, scripts inline, IDs duplicados, assets locales, enlaces internos, favicon y texto roto por codificacion. El detalle de auditoria queda en `QUALITY_CHECKLIST.md`.

## Publicacion en GitHub Pages

El repositorio de produccion es `cetesagn-cyber/rustico-web` y se publica desde la rama `main` en la carpeta `/root`.

## Datos administrativos pendientes

Antes de cerrar la revision legal o activar medicion, confirmar:

- NIT o identificacion oficial.
- Correo legal/corporativo.
- ID de GA4 o GTM si se va a medir con Google.

## Archivos principales

- `index.html`: sitio principal.
- `privacidad.html`: politica de privacidad.
- `cookies.html`: politica de cookies.
- `terminos.html`: aviso legal y terminos.
- `robots.txt`: reglas para rastreadores.
- `sitemap.xml`: mapa del sitio.
- `serve-static.mjs`: servidor local con headers de seguridad.
- `.nojekyll`: compatibilidad con GitHub Pages.
