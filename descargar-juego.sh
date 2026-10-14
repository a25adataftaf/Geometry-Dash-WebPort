#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Geometry Dash · Web Port — descarga de los ficheros del juego
#
# Trae a geo/ los ficheros que necesita play/index.html (unos 370 MB) desde
# GitHub, para poder jugar sin depender del CDN. No hace falta Node ni nada
# instalado más que curl (o wget).
#
#   bash descargar-juego.sh              # baja lo que falte
#   bash descargar-juego.sh --forzar     # lo vuelve a bajar todo
#
# Variables opcionales:
#   GD_REPO=AlexBoops/geometry-dash-webport
#   GD_REF=c6ac9417ff93ea957425b23ee87f1ed290663ebb   (commit, tag o rama)
#   GITHUB_TOKEN=...                                  (sube el límite de la API)
#
# La carpeta geo/ está en .gitignore: si publicas el sitio, ábrelo desde un
# servidor (por ejemplo `python3 -m http.server`) para que el juego la vea.
# ---------------------------------------------------------------------------
set -euo pipefail

REPO="${GD_REPO:-AlexBoops/geometry-dash-webport}"
REF="${GD_REF:-c6ac9417ff93ea957425b23ee87f1ed290663ebb}"
DEST="$(cd "$(dirname "$0")" && pwd)/geo"
FORZAR=0

for arg in "$@"; do
  case "$arg" in
    --forzar|--force) FORZAR=1 ;;
    -h|--help)
      sed -n '2,20p' "$0"
      exit 0
      ;;
  esac
done

if command -v curl >/dev/null 2>&1; then
  DESCARGADOR="curl"
elif command -v wget >/dev/null 2>&1; then
  DESCARGADOR="wget"
else
  echo "✗ Hace falta curl o wget para descargar los ficheros." >&2
  exit 1
fi

FICHEROS=("gd_web.js")
for i in $(seq 1 16); do FICHEROS+=("gd_web.data.part$i"); done
for i in $(seq 1 4);  do FICHEROS+=("gd_web.wasm.part$i"); done

AUTH=()
if [ -n "${GITHUB_TOKEN:-}" ]; then
  AUTH=(-H "Authorization: Bearer ${GITHUB_TOKEN}")
fi

descargar() {
  # $1 = fichero, $2 = destino
  local url="https://api.github.com/repos/${REPO}/contents/$1?ref=${REF}"
  if [ "$DESCARGADOR" = "curl" ]; then
    curl -fsSL --retry 3 --retry-delay 2 \
      -H "Accept: application/vnd.github.raw" \
      -H "User-Agent: geometry-dash-webport-setup" \
      "${AUTH[@]}" "$url" -o "$2"
  else
    wget -q --tries=3 --header="Accept: application/vnd.github.raw" \
      --header="User-Agent: geometry-dash-webport-setup" \
      ${GITHUB_TOKEN:+--header="Authorization: Bearer ${GITHUB_TOKEN}"} \
      -O "$2" "$url"
  fi
}

tamano_esperado() {
  # Consulta el tamaño del fichero sin descargarlo (HEAD a la API).
  local url="https://api.github.com/repos/${REPO}/contents/$1?ref=${REF}"
  local cabecera
  if [ "$DESCARGADOR" = "curl" ]; then
    curl -fsSLI -H "Accept: application/vnd.github+json" \
      -H "User-Agent: geometry-dash-webport-setup" "${AUTH[@]}" "$url" 2>/dev/null \
      | tr -d '\r' | awk 'tolower($1)=="content-length:" {print $2}' | tail -n 1
  else
    wget -qS --spider --header="Accept: application/vnd.github+json" \
      --header="User-Agent: geometry-dash-webport-setup" "$url" 2>&1 \
      | tr -d '\r' | awk 'tolower($1)=="content-length:" {print $2}' | tail -n 1
  fi
}

echo
echo "Geometry Dash · Web Port — ficheros del juego"
echo "  repo:    $REPO"
echo "  versión: $REF"
echo "  destino: $DEST"
echo

mkdir -p "$DEST"

bajados=0
saltados=0
fallos=0

for fichero in "${FICHEROS[@]}"; do
  destino="$DEST/$fichero"
  esperado="$(tamano_esperado "$fichero" || true)"

  if [ "$FORZAR" -eq 0 ] && [ -s "$destino" ]; then
    actual="$(wc -c <"$destino" | tr -d ' ')"
    if [ -z "$esperado" ] || [ "$actual" = "$esperado" ]; then
      saltados=$((saltados + 1))
      echo "  = $fichero (ya estaba)"
      continue
    fi
  fi

  printf '  ↓ %s…' "$fichero"
  if descargar "$fichero" "$destino.parcial"; then
    mv "$destino.parcial" "$destino"
    bajados=$((bajados + 1))
    printf ' ok (%s)\n' "$(du -h "$destino" | cut -f1)"
  else
    rm -f "$destino.parcial"
    fallos=$((fallos + 1))
    printf ' FALLÓ\n'
  fi
done

total="$(du -sh "$DEST" 2>/dev/null | cut -f1)"
echo
echo "Listo: $bajados descargado(s), $saltados ya presentes, $fallos fallo(s). Total en geo/: $total"
if [ "$fallos" -gt 0 ]; then
  echo "Vuelve a lanzar el script: lo descargado se conserva."
  exit 1
fi
echo "El port lo detectará solo (verás «ficheros locales» en su pantalla de inicio)."
echo
