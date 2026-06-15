/**
 * Gallery processor — Rústico Barber
 * Jimp v1 API correcta:
 *   - brightness() toma escala absoluta → NO USAR. Usar darken/lighten en color().
 *   - contrast(val) funciona correctamente con -1..1.
 *   - color([{apply, params}]): params siempre >= 0.
 *     · darken(N)     = oscurecer N% (0-100)
 *     · lighten(N)    = aclarar N% (0-100)
 *     · desaturate(N) = quitar saturación N%
 *     · saturate(N)   = añadir saturación N%
 *     · blue(N)       = añadir N al canal azul (0-255)
 *     · red(N)        = añadir N al canal rojo (0-255)
 */

import { Jimp, JimpMime } from 'jimp';
import { mkdirSync, writeFileSync } from 'fs';

const BASE = 'c:/Users/Gnino/OneDrive - CEMENTOS TEQUENDAMA S.A.S. - CETESA S.A.S/Rustico Web/Rustico';
const OUT  = `${BASE}/gallery`;

mkdirSync(OUT, { recursive: true });

const images = [
  {
    // HERO — Familia en sofá bajo letrero Rústico.
    // Luz interior muy ámbar. Oscurecer ligeramente, añadir frescura azul moderada,
    // bajar saturación para armonizar con la paleta navy/gold del sitio.
    src: `${BASE}/WhatsApp Image 2026-05-27 at 11.03.40 AM (10).jpeg`,
    out: `${OUT}/g1.jpg`,
    label: 'g1 — Familia bajo logo (HERO)',
    contrast: 0.18,
    color: [
      { apply: 'darken',     params: [6]  },
      { apply: 'blue',       params: [8]  },   // frío moderado
      { apply: 'desaturate', params: [8]  }
    ]
  },
  {
    // Fade dorado desde atrás. El cabello dorado es el protagonista.
    // Aumentar saturación para que el oro brille. Leve oscurecimiento.
    src: `${BASE}/WhatsApp Image 2026-05-27 at 11.03.40 AM (11).jpeg`,
    out: `${OUT}/g2.jpg`,
    label: 'g2 — Fade dorado (craft shot)',
    contrast: 0.20,
    color: [
      { apply: 'darken',   params: [4]  },
      { apply: 'saturate', params: [20] }
    ]
  },
  {
    // Niño riendo en silla Chesterfield. Pared de ladrillo, buena luz.
    // Leve enfriamiento para coherencia de paleta, mantener la energía.
    src: `${BASE}/WhatsApp Image 2026-05-27 at 11.03.40 AM (12).jpeg`,
    out: `${OUT}/g3.jpg`,
    label: 'g3 — Niño riendo en silla',
    contrast: 0.14,
    color: [
      { apply: 'darken',     params: [4]  },
      { apply: 'blue',       params: [6]  },
      { apply: 'desaturate', params: [5]  }
    ]
  },
  {
    // Afeitado clásico con espuma. Bokeh de fondo con barber pole.
    // Muy cinematográfico. Oscurecer más para efecto editorial nocturno.
    src: `${BASE}/WhatsApp Image 2026-05-27 at 11.03.40 AM (9).jpeg`,
    out: `${OUT}/g4.jpg`,
    label: 'g4 — Afeitado clásico',
    contrast: 0.25,
    color: [
      { apply: 'darken',   params: [10] },
      { apply: 'saturate', params: [8]  }
    ]
  },
  {
    // Guantes de boxing colgados. Pared amarilla muy intensa domina.
    // Desaturar con firmeza para tono moody que case con la web.
    src: `${BASE}/WhatsApp Image 2026-05-27 at 11.03.40 AM (8).jpeg`,
    out: `${OUT}/g5.jpg`,
    label: 'g5 — Guantes boxing (ambiente)',
    contrast: 0.16,
    color: [
      { apply: 'darken',     params: [8]  },
      { apply: 'desaturate', params: [22] },
      { apply: 'blue',       params: [7]  }
    ]
  },
  {
    // Bebé en silla con pulgar arriba. Recortar lado derecho (equipo médico).
    // Tono cálido y acogedor — esta foto transmite carácter familiar del local.
    src: `${BASE}/WhatsApp Image 2026-05-27 at 11.03.40 AM (13).jpeg`,
    out: `${OUT}/g6.jpg`,
    label: 'g6 — Bebé en silla (thumbs up)',
    cropRight: 0.73,
    contrast: 0.13,
    color: [
      { apply: 'lighten',  params: [4]  },
      { apply: 'red',      params: [8]  },   // calidez
      { apply: 'saturate', params: [10] }
    ]
  }
];

const MAX_DIM = 1440;

async function processImage(cfg) {
  process.stdout.write(`  ${cfg.label}... `);
  const img = await Jimp.read(cfg.src);

  const origW = img.bitmap.width;
  const origH = img.bitmap.height;

  // 1. Recorte opcional (eliminar zonas distractivas)
  if (cfg.cropRight) {
    img.crop({ x: 0, y: 0, w: Math.floor(origW * cfg.cropRight), h: origH });
  }

  // 2. Limitar resolución al lado mayor
  const cw = img.bitmap.width;
  const ch = img.bitmap.height;
  if (cw > MAX_DIM || ch > MAX_DIM) {
    if (cw >= ch) img.resize({ w: MAX_DIM });
    else           img.resize({ h: MAX_DIM });
  }

  // 3. Contraste (funciona correctamente en v1)
  if (cfg.contrast !== undefined) img.contrast(cfg.contrast);

  // 4. Color grading (darken/lighten/saturate/desaturate/blue/red — todos positivos)
  if (cfg.color && cfg.color.length) img.color(cfg.color);

  // 5. Exportar JPEG calidad 88
  const buf = await img.getBuffer(JimpMime.jpeg, { quality: 88 });
  writeFileSync(cfg.out, buf);
  console.log(`✓  (${img.bitmap.width}×${img.bitmap.height})`);
}

console.log('\n🎨  Rústico Gallery — procesando imágenes\n');
for (const cfg of images) {
  await processImage(cfg);
}
console.log('\n✅  Listo — imágenes en Rustico/gallery/\n');
