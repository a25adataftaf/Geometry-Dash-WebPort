/* =========================================================================
   Geometry Dash · Web Port (fan-made)
   Script del sitio: lanzar el juego, avisos del navegador y modo local.
   Sin dependencias ni compilación: se carga con <script src="./app.js" defer>.
   ========================================================================= */

(function () {
  'use strict';

  var playButton = document.getElementById('play-button');
  var playLabel = document.getElementById('play-button-label');
  var banner = document.getElementById('status-banner');
  var localStatus = document.getElementById('local-status');
  var yearSlot = document.getElementById('year');

  var leaving = false;

  /* ----------------------------------------------------------- lanzar ---- */

  function play() {
    if (leaving) return;
    leaving = true;
    playButton.disabled = true;
    playButton.classList.add('is-loading');
    if (playLabel) playLabel.textContent = 'CARGANDO…';
    // ./play/ es la carpeta del juego (play/index.html).
    window.location.href = new URL('./play/', window.location.href).href;
  }

  if (playButton) {
    playButton.addEventListener('click', play);

    window.addEventListener(
      'keydown',
      function (event) {
        if (leaving) return;
        if (event.code !== 'Enter' && event.code !== 'Space' && event.code !== 'NumpadEnter') return;
        var target = event.target;
        // Deja que enlaces y controles hagan lo suyo.
        if (target && target.closest && target.closest('a, button, input, textarea, select')) return;
        event.preventDefault();
        play();
      },
      { passive: false }
    );
  }

  /* --------------------------------------------- comprobación navegador -- */

  var problems = [];

  var hasWebgl2 = false;
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

  var hasJspi = false;
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
      problems
        .map(function (problem) {
          return '<li>' + problem + '</li>';
        })
        .join('') +
      '</ul>';
    banner.hidden = false;
  }

  /* -------------------------------------------------------- modo local --- */

  var MENSAJE_CDN =
    'Modo CDN: los ficheros se descargarán del CDN de GitHub. Ejecuta «bash descargar-juego.sh» para tenerlos en local (' +
    'carpeta geo/).';

  function setLocalStatus(text, isLocal) {
    if (!localStatus) return;
    localStatus.textContent = text;
    localStatus.classList.toggle('is-local', Boolean(isLocal));
  }

  try {
    fetch('./geo/gd_web.data.part1', { method: 'HEAD', cache: 'no-store' })
      .then(function (response) {
        var length = parseInt(response.headers.get('Content-Length') || '0', 10);
        if (response.ok && length > 1000000) {
          setLocalStatus(
            'Modo local listo: los ficheros del juego están en la carpeta geo/, no hará falta el CDN.',
            true
          );
        } else {
          setLocalStatus(MENSAJE_CDN, false);
        }
      })
      .catch(function () {
        setLocalStatus(MENSAJE_CDN, false);
      });
  } catch (error) {
    setLocalStatus(MENSAJE_CDN, false);
  }

  if (yearSlot) {
    yearSlot.textContent = String(new Date().getFullYear());
  }
})();
