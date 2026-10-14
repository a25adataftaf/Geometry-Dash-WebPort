# Geometry Dash Webport · port de Lollipop (fan-made)

Web para jugar al **Geometry Dash Webport** en el navegador. Es el port que
publicó **Lollipop** en itch.io (motor y juego portado por **bog @ truffled**,
ficheros servidos desde el repositorio de **AlexBoops**), montado aquí con una
pantalla de entrada propia y un lanzador.

> Proyecto fan-made. Geometry Dash y sus recursos son de **RobTop Games**. Este
> repositorio no está afiliado ni patrocinado por RobTop, itch.io, Lollipop,
> AlexBoops ni truffled.

## Qué hay dentro

```
index.html                 pantalla de entrada (hero, requisitos, créditos…)
src/main.js                lógica de la entrada: lanzar el juego, avisos, modo local
src/style.css              estilos del sitio
favicon.svg                piruleta
public/play/index.html     EL JUEGO: webport de Lollipop (motor de bog @ truffled)
public/play/gd_web.js      módulo del motor (Emscripten/WASM), copia local
public/play/sw.js          service worker del port (reensambla gd_web.data)
public/play/logo.png       logo del juego
public/play/load.png       botón LOAD del juego
public/play/fondo_gd.jpg   fondo animado del juego
public/geo/                (opcional) los ~370 MB de datos, para jugar sin CDN
scripts/descargar-juego.mjs  trae esos datos a public/geo/
```

El juego completo pesa unos **370 MB** (`gd_web.data.part1..16` y
`gd_web.wasm.part1..4`), así que no vive en Git: se descarga por trozos desde el
CDN de jsDelivr apuntando a GitHub, o en local con el script de abajo. El CDN
acepta un commit concreto, por eso `ref` va fijado a un SHA y no a `main`.

## Ejecutar

Requiere Node.js 20 o posterior.

```bash
npm install
npm run dev
```

Para generar el sitio estático:

```bash
npm run build     # deja todo en dist/
npm run preview
```

## Los ficheros del juego

Por defecto `public/play/index.html` los pide al CDN:

```js
window.__GD_CONFIG = {
  repo: "AlexBoops/geometry-dash-webport",
  ref: "c6ac9417ff93ea957425b23ee87f1ed290663ebb", // commit fijado
  localDir: "./geo/",
  module: "./gd_web.js"
};
```

Para jugar sin CDN (o publicarlos tú):

```bash
npm run juego:descargar          # trae lo que falte a public/geo/
npm run juego:descargar -- --forzar
```

Si los ficheros están en `public/geo/`, el port los usa automáticamente y lo
indica en la pantalla de inicio. También puedes forzarlo con los parámetros de
URL `?local=1` o `?cdn=1`.

## Adaptaciones sobre el port original

`public/play/index.html` parte de la versión guardada del port de Lollipop y
lleva estos cambios:

- rutas relativas en logo, fondo y módulo del motor (nada de depender de rutas absolutas);
- fuera **Google Tag Manager** (`js(1)` + snippet `gtag`, contenedor `G-PXHK7Q7G3Z`);
- fuera el script anti-hotlink de itch.io (`htmlgame.js`), que redirigía fuera del sitio;
- URL del CDN configurable y **commit fijado** en vez de `@main`;
- detección de **modo local** y parámetros `?local=1` / `?cdn=1`;
- avisos en pantalla si falta **JSPI** o **WebGL 2**, enlace «Volver al inicio»
  y nota de la fuente de datos que se está usando.

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
- **Port publicado en itch.io:** [Geometry Dash | Webport by Lollipop](https://theblehlollipop.itch.io/geometry-dash-webport).
- **Geometry Dash:** [RobTop Games](https://www.robtopgames.com/). Todos los derechos reservados.

Si eres titular de algún contenido y prefieres que se retire, abre un issue y se quita.
