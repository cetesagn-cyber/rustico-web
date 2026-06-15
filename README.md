# Rustico Barber & Concept Shop

Sitio web estatico para Rustico Barber & Concept Shop en Bogota.

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
```

La validacion revisa archivos requeridos, titulos, meta descriptions, scripts inline y IDs duplicados.

## Publicar en GitHub Pages

1. Crear un repositorio en GitHub.
2. Subir los archivos del proyecto respetando `.gitignore`.
3. En GitHub: `Settings > Pages`.
4. Seleccionar `Deploy from a branch`.
5. Branch: `main`.
6. Folder: `/root`.
7. Guardar y esperar la URL de GitHub Pages.

## Ajustes finales obligatorios

Antes de indexar en Google o conectar Search Console, reemplazar `http://127.0.0.1:8090` por la URL real de produccion en:

- `index.html`
- `privacidad.html`
- `cookies.html`
- `terminos.html`
- `robots.txt`
- `sitemap.xml`

Tambien completar en paginas legales:

- NIT o identificacion oficial.
- Correo legal/corporativo.
- Dominio final.
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
