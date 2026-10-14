import '@fontsource/press-start-2p/latin-400.css';
import '@fontsource/kalam/latin-700.css';
import './style.css';

const loadButton = document.getElementById('load-button');
let loading = false;

function loadWebPort() {
  if (loading) return;
  loading = true;
  loadButton.disabled = true;
  loadButton.textContent = 'Loading…';
  window.location.assign(new URL('./geometry-dash-webport.html', window.location.href));
}

loadButton.addEventListener('click', loadWebPort);
window.addEventListener('keydown', (event) => {
  if (loading || (event.code !== 'Enter' && event.code !== 'Space')) return;
  const focusedButton = event.target instanceof Element && event.target.closest('button');
  if (focusedButton) return; // Let the focused button produce its native click.
  event.preventDefault();
  loadWebPort();
}, { passive: false });
