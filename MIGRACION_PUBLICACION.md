# Migracion y publicacion - Rustico Web

## Estado

Sitio estatico listo para migrar y publicar.

Incluye:

- `index.html` con estilos, scripts y experiencia completa.
- Carpeta `Rustico/` con imagenes, logos, favicon y videos MP4 optimizados.
- Paginas legales: `privacidad.html`, `cookies.html`, `terminos.html`.
- SEO base: `robots.txt`, `sitemap.xml`, canonical, Open Graph, Twitter Card y Schema `Barbershop`.
- Servidor local opcional: `serve-static.mjs`.
- Documentacion de auditoria y publicacion.

## Validaciones ejecutadas

```bash
npm.cmd run validate
npm.cmd run quality
```

Resultado:

- Archivos requeridos presentes.
- Sin referencias locales faltantes.
- Sin IDs duplicados.
- Sin enlaces internos rotos.
- Sin placeholders.
- Sin mojibake detectado por el validador.
- Servidor local respondiendo `200 OK`.

## Restaurar en otro equipo

1. Descomprimir el backup final en una carpeta nueva.
2. Abrir terminal en esa carpeta.
3. Si se incluye `node_modules`, se puede ejecutar directamente:

```bash
node serve-static.mjs 8090
```

4. Abrir:

```text
http://127.0.0.1:8090/
```

Si no se desea usar Node, tambien se puede publicar como sitio estatico subiendo estos archivos al hosting:

- `.nojekyll`
- `index.html`
- `privacidad.html`
- `cookies.html`
- `terminos.html`
- `robots.txt`
- `sitemap.xml`
- `Rustico/`

## Publicar en GitHub Pages

1. Subir los archivos del sitio a la rama `main`.
2. Ir a `Settings > Pages`.
3. Seleccionar `Deploy from a branch`.
4. Branch: `main`.
5. Folder: `/root`.
6. Guardar.

## No publicar

No subir:

- `_backups/`
- `node_modules/` si el hosting no lo necesita.
- `.git/`
- `.abacusai/`
- `.agents/`
- `.claude/`
- `MIGRACION_RUSTICO_*/`
- `MIGRACION_RUSTICO_FULL_*/`
- `MIGRACION_RUSTICO_PORTABLE_*/`
- `n8n-workflows/`
- logs `*.log`
- masters pesados de logo.

## Pendientes antes de SEO final

- Confirmar dominio final.
- Reemplazar URL local por dominio final si aplica.
- Confirmar NIT o identificacion oficial.
- Agregar ID real de GA4 o GTM si se va a medir trafico.
