import { defineConfig } from 'vite';
import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Vite no resuelve `/carpeta/` → `/carpeta/index.html` cuando el fichero está en
 * `public/`, así que lo resolvemos aquí para poder lanzar el juego desde `./play/`.
 * (Al desplegar en un hosting estático normal —GitHub Pages, Netlify…— esto ya
 * funciona solo; el middleware es para `npm run dev` y `npm run preview`.)
 */
function servirIndicesDeCarpeta() {
  const reescribir = (dir) => (req, _res, next) => {
    try {
      if (req.url && req.url !== '/') {
        const url = new URL(req.url, 'http://localhost');
        if (url.pathname.endsWith('/')) {
          const indice = path.join(dir, decodeURIComponent(url.pathname), 'index.html');
          if (indice.startsWith(dir) && existsSync(indice)) {
            req.url = `${url.pathname}index.html${url.search}`;
          }
        }
      }
    } catch {
      // Si la URL es rara, que siga el flujo normal de Vite.
    }
    next();
  };

  return {
    name: 'servir-indices-de-carpeta',
    configureServer(server) {
      server.middlewares.use(reescribir(path.resolve(server.config.root, server.config.publicDir)));
    },
    configurePreviewServer(server) {
      server.middlewares.use(
        reescribir(path.resolve(server.config.root, server.config.build.outDir))
      );
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [servirIndicesDeCarpeta()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
