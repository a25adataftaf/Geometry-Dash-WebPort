#!/usr/bin/env node
/**
 * Descarga los ficheros que necesita el webport (los mismos que usa
 * public/play/index.html) desde GitHub a public/geo/, para poder jugar
 * sin depender del CDN.
 *
 *   npm run juego:descargar            # trae lo que falte
 *   npm run juego:descargar -- --forzar   # vuelve a bajarlo todo
 *
 * Variables de entorno opcionales:
 *   GD_REPO=AlexBoops/geometry-dash-webport
 *   GD_REF=c6ac9417ff93ea957425b23ee87f1ed290663ebb   (commit, tag o rama)
 *   GITHUB_TOKEN=...                                  (sube el límite de la API)
 *
 * Los ficheros pesan unos 370 MB en total y NO se suben a Git (public/geo/
 * está en .gitignore). El port los detecta solo al abrir la pantalla de inicio.
 */
import { createWriteStream } from 'node:fs';
import { mkdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const REPO = process.env.GD_REPO ?? 'AlexBoops/geometry-dash-webport';
const REF = process.env.GD_REF ?? 'c6ac9417ff93ea957425b23ee87f1ed290663ebb';
const DEST = path.resolve(process.cwd(), 'public/geo');
const FORZAR = process.argv.includes('--forzar') || process.argv.includes('--force');

const DATA_PARTS = 16;
const WASM_PARTS = 4;

const FICHEROS = [
  'gd_web.js',
  ...Array.from({ length: DATA_PARTS }, (_, i) => `gd_web.data.part${i + 1}`),
  ...Array.from({ length: WASM_PARTS }, (_, i) => `gd_web.wasm.part${i + 1}`),
];

const CABECERAS = {
  'User-Agent': 'geometry-dash-webport-setup',
  Accept: 'application/vnd.github.raw',
};
if (process.env.GITHUB_TOKEN) {
  CABECERAS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

async function tamañosDelRepo() {
  const url = `https://api.github.com/repos/${REPO}/git/trees/${REF}?recursive=1`;
  const res = await fetch(url, {
    headers: { ...CABECERAS, Accept: 'application/vnd.github+json' },
  });
  if (res.status === 403 || res.status === 429) {
    throw new Error(
      'GitHub ha limitado las peticiones de la API. Espera un rato o lanza el script con GITHUB_TOKEN=tu_token.'
    );
  }
  if (!res.ok) {
    throw new Error(`no puedo leer la lista de ficheros del repo (${res.status} ${res.statusText})`);
  }
  const datos = await res.json();
  const tamaños = new Map();
  for (const entrada of datos.tree ?? []) {
    if (entrada.type === 'blob') tamaños.set(entrada.path, entrada.size);
  }
  return tamaños;
}

async function yaEstaLimpio(destino, esperado) {
  try {
    const info = await stat(destino);
    return esperado ? info.size === esperado : info.size > 0;
  } catch {
    return false;
  }
}

async function descargar(fichero, esperado) {
  const destino = path.join(DEST, fichero);
  const temporal = `${destino}.parcial`;
  const url = `https://api.github.com/repos/${REPO}/contents/${fichero}?ref=${REF}`;
  const res = await fetch(url, { headers: CABECERAS });

  if (res.status === 403 || res.status === 429) {
    throw new Error(
      'GitHub ha limitado las peticiones de la API. Espera un rato o lanza el script con GITHUB_TOKEN=tu_token.'
    );
  }
  if (!res.ok) {
    throw new Error(`${fichero}: ${res.status} ${res.statusText}`);
  }

  await pipeline(Readable.fromWeb(res.body), createWriteStream(temporal));
  const escrito = (await stat(temporal)).size;

  if (esperado && escrito !== esperado) {
    await rm(temporal, { force: true });
    throw new Error(`${fichero}: descarga incompleta (${escrito} de ${esperado} bytes)`);
  }

  await rename(temporal, destino);
  return escrito;
}

async function main() {
  console.log(`\nGeometry Dash Webport · descargando ficheros del juego`);
  console.log(`  repo:    ${REPO}`);
  console.log(`  versión: ${REF}`);
  console.log(`  destino: ${path.relative(process.cwd(), DEST)}\n`);

  await mkdir(DEST, { recursive: true });
  const tamaños = await tamañosDelRepo();

  let bajados = 0;
  let saltados = 0;
  let total = 0;
  let totalPrevisto = 0;

  for (const fichero of FICHEROS) {
    const esperado = tamaños.get(fichero) ?? 0;
    totalPrevisto += esperado;

    if (!FORZAR && (await yaEstaLimpio(path.join(DEST, fichero), esperado))) {
      saltados += 1;
      total += esperado;
      console.log(`  = ${fichero} (ya estaba, ${mb(esperado)})`);
      continue;
    }

    process.stdout.write(`  ↓ ${fichero} (${mb(esperado)})…`);
    const bytes = await descargar(fichero, esperado);
    bajados += 1;
    total += bytes;
    process.stdout.write(` ok\n`);
  }

  console.log(`\nListo: ${bajados} fichero(s) descargado(s), ${saltados} ya presentes.`);
  console.log(`Total en public/geo/: ${mb(total)} de ${mb(totalPrevisto)}.`);
  if (total < totalPrevisto) {
    console.log('Ojo: falta algún trozo; vuelve a lanzar el script para completarlo.');
  }
  console.log(
    '\nEl port detecta los ficheros locales al abrir la pantalla de inicio (verás «ficheros locales»).'
  );
  console.log('Si publicas el sitio con `npm run build`, public/geo/ se copia a dist/geo/.\n');
}

main().catch((error) => {
  console.error(`\n✗ ${error.message}`);
  console.error('Puedes reintentar el script: lo ya descargado se conserva.\n');
  process.exitCode = 1;
});
