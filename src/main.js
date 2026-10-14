import '@fontsource/press-start-2p/latin-400.css';
import '@fontsource/kalam/latin-700.css';
import './style.css';

/* ------------------------------------------------------------------ lanzar */

const playButton = document.getElementById('play-button');
const playLabel = document.getElementById('play-button-label');
const banner = document.getElementById('status-banner');
const localStatus = document.getElementById('local-status');
const yearSlot = document.getElementById('year');

let leaving = false;

function play() {
  if (leaving) return;
  leaving = true;
  playButton.disabled = true;
  playButton.classList.add('is-loading');
  playLabel.textContent = 'CARGANDO…';
  // `./play/` apunta al port de Lollipop (public/play/index.html)
  window.location.assign(new URL('./play/', window.location.href).href);
}

playButton.addEventListener('click', play);

window.addEventListener(
  'keydown',
  (event) => {
    if (leaving) return;
    if (event.code !== 'Enter' && event.code !== 'Space' && event.code !== 'NumpadEnter') return;
    const target = event.target;
    // Deja que enlaces y controles hagan lo suyo.
    if (target instanceof Element && target.closest('a, button, input, textarea, select')) return;
    event.preventDefault();
    play();
  },
  { passive: false }
);

/* -------------------------------------------------- comprobación navegador */

const problems = [];

let hasWebgl2 = false;
try {
  hasWebgl2 = Boolean(document.createElement('canvas').getContext('webgl2'));
} catch (error) {
  hasWebgl2 = false;
}
if (!hasWebgl2) {
  problems.push(
    '<strong>WebGL 2 no disponible.</strong> Activa la aceleración por hardware en el navegador; sin WebGL 2 el juego se queda en negro.'
  );
}

let hasJspi = false;
try {
  hasJspi = typeof WebAssembly === 'object' && 'Suspending' in WebAssembly;
} catch (error) {
  hasJspi = false;
}
if (!hasJspi) {
  problems.push(
    '<strong>JSPI desactivado.</strong> El motor lo necesita: abre <code>chrome://flags</code>, activa «Experimental WebAssembly JavaScript Promise Integration (JSPI)» y reinicia el navegador (Chrome o Edge).'
  );
}

if (problems.length && banner) {
  banner.innerHTML =
    '<strong>Este navegador puede tener problemas para arrancar el port:</strong><ul>' +
    problems.map((problem) => `<li>${problem}</li>`).join('') +
    '</ul>';
  banner.hidden = false;
}

/* --------------------------------------------------------------- modo local */

function setLocalStatus(text, isLocal) {
  if (!localStatus) return;
  localStatus.textContent = text;
  localStatus.classList.toggle('is-local', Boolean(isLocal));
}

try {
  fetch('./geo/gd_web.data.part1', { method: 'HEAD', cache: 'no-store' })
    .then((response) => {
      const length = Number.parseInt(response.headers.get('Content-Length') ?? '0', 10);
      if (response.ok && length > 1_000_000) {
        setLocalStatus(
          'Modo local listo: los ficheros del juego están en public/geo/, no hará falta el CDN.',
          true
        );
      } else {
        setLocalStatus(
          'Modo CDN: los ficheros se descargarán del CDN de GitHub. Ejecuta «npm run juego:descargar» para tenerlos en local.',
          false
        );
      }
      return null;
    })
    .catch(() => {
      setLocalStatus(
        'Modo CDN: los ficheros se descargarán del CDN de GitHub. Ejecuta «npm run juego:descargar» para tenerlos en local.',
        false
      );
    });
} catch (error) {
  setLocalStatus('Modo CDN activo.', false);
}

if (yearSlot) {
  yearSlot.textContent = String(new Date().getFullYear());
}
