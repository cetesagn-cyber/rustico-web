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
- `.gitignore`.
- `.nojekyll` para GitHub Pages.

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
http://127.0.0.1:8090
```

por la URL final de GitHub Pages o dominio propio.

Completar:

- NIT o identificacion oficial.
- Correo legal.
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
