# Geometry Dash · Web Port (fan-made)

Web estática para jugar al **Geometry Dash Webport** en el navegador. No
necesita Node, ni compilación, ni instalar nada: son ficheros HTML, CSS y JS que
se abren tal cual (con el juego descargando sus datos desde GitHub).

> Proyecto fan-made. Geometry Dash y sus recursos son de **RobTop Games**. Este
> repositorio no está afiliado ni patrocinado por RobTop, itch.io ni los autores
> del port.

## Qué hay dentro

```
index.html            pantalla de entrada (hero, requisitos, cómo jugar, créditos)
styles.css            estilos del sitio (tipografías locales de ./fuentes/)
app.js                lógica de la entrada: lanzar el juego, avisos, modo local
favicon.svg           icono (cubo)
fuentes/              tipografías Press Start 2P y Kalam (licencias incluidas)
play/                 EL JUEGO
  index.html            webport (motor de bog @ truffled, ficheros de AlexBoops)
  gd_web.js             módulo del motor (Emscripten/WASM), copia local
  sw.js                 service worker del port (reensambla gd_web.data)
  logo.png, load.png, fondo_gd.jpg
geo/                  (opcional, no está en Git) los ~370 MB de datos del juego
descargar-juego.sh    script que trae esos datos a geo/ con curl o wget
```

## Cómo se usa

Súbelo a cualquier hosting estático (GitHub Pages, Netlify, un servidor Apache…)
o ábrelo en local con un servidor sencillo:

```bash
python3 -m http.server 5173      # y entra en http://localhost:5173
```

No lo abras con doble clic (`file://`): el juego necesita `http(s)` para el
service worker y para descargar los datos. **No hace falta npm ni compilar nada.**

## Los ficheros del juego

Por defecto `play/index.html` los pide al CDN de jsDelivr apuntando al
repositorio de GitHub que los tiene todos:

```js
window.__GD_CONFIG = {
  repo: "AlexBoops/geometry-dash-webport",
  ref: "c6ac9417ff93ea957425b23ee87f1ed290663ebb", // commit fijado
  localDir: "../geo/",
  module: "./gd_web.js"
};
```

Para jugar sin CDN (o si quieres publicarlos tú):

```bash
bash descargar-juego.sh            # baja lo que falte a geo/
bash descargar-juego.sh --forzar   # lo vuelve a bajar todo
```

Si los ficheros están en `geo/`, el port los usa automáticamente y lo indica en
su pantalla de inicio. También puedes forzarlo con `?local=1` o `?cdn=1`.

## Adaptaciones sobre el port original

`play/index.html` parte de la versión guardada del port original y lleva estos
cambios:

- rutas relativas en logo, fondo y módulo del motor;
- fuera **Google Tag Manager** y el script anti-hotlink de itch.io;
- CDN configurable y **commit fijado** en vez de `@main`;
- **modo local** (`geo/`) y parámetros `?local=1` / `?cdn=1`;
- avisos si falta **JSPI** o **WebGL 2**, enlace «Volver al inicio» y nota de la
  fuente de datos que se está usando.

## Requisitos para jugar

- Chrome o Edge actualizados, con **JSPI** activo
  (`chrome://flags` → *Experimental WebAssembly JavaScript Promise Integration*).
- **WebGL 2** con aceleración por hardware.
- Primera carga de **~370 MB** (después el navegador los conserva en caché).
- **No inicies sesión** con tu cuenta: las funciones en línea pasan por un proxy
  de terceros que no controlamos.

## Créditos

- **Motor y port del juego:** bog @ [truffled](https://truffled.lol).
- **Empaquetado web y ficheros del juego:** [AlexBoops/geometry-dash-webport](https://github.com/AlexBoops/geometry-dash-webport).
- **Port original publicado en itch.io:** [Geometry Dash | Webport](https://theblehlollipop.itch.io/geometry-dash-webport).
- **Geometry Dash:** [RobTop Games](https://www.robtopgames.com/). Todos los derechos reservados.

Si eres titular de algún contenido y prefieres que se retire, abre un issue y se quita.
