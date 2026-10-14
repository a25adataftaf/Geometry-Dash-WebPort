# Geometry Dash · Web Port (fan-made)

**La web está publicada y se juega desde el navegador, sin instalar nada:**

### 👉 https://a25adataftaf.github.io/Geometry-Dash-WebPort/

Se abre en Chrome o Edge, se pulsa **JUGAR** y listo. No hay que descargar el
proyecto, ni compilar, ni ejecutar nada en el ordenador.

> Proyecto fan-made. Geometry Dash y sus recursos son de **RobTop Games**. Este
> repositorio no está afiliado ni patrocinado por RobTop, itch.io ni los autores
> del port.

## Cómo funciona

- **GitHub Pages** publica esta carpeta tal cual: son ficheros estáticos
  (`index.html`, `styles.css`, `app.js`, `favicon.svg`, `fuentes/` y `play/`).
  No hay build ni dependencias que instalar.
- Al pulsar **JUGAR** se abre el webport de `play/`, que pide el motor y los
  datos del juego (**~370 MB**) al CDN de GitHub (`cdn.jsdelivr.net`),
  apuntando al repositorio
  [AlexBoops/geometry-dash-webport](https://github.com/AlexBoops/geometry-dash-webport)
  con el commit fijado `c6ac941`.
- El progreso de la partida se guarda en el propio navegador (IndexedDB), no en
  ningún servidor.

## Qué hay dentro

```
index.html            pantalla de entrada (hero, requisitos, cómo jugar, créditos)
styles.css            estilos del sitio (tipografías locales de ./fuentes/)
app.js                lógica de la entrada: lanzar el juego, avisos, estado de los datos
favicon.svg           icono (cubo)
fuentes/              tipografías Press Start 2P y Kalam (licencias incluidas)
play/                 EL JUEGO
  index.html            webport (motor de bog @ truffled, ficheros de AlexBoops)
  gd_web.js             módulo del motor (Emscripten/WASM), copia local
  sw.js                 service worker del port (reensambla gd_web.data)
  logo.png, load.png, fondo_gd.jpg
descargar-juego.sh    (opcional) baja los ~370 MB de datos a geo/
.nojekyll             para que GitHub Pages sirva los ficheros tal cual
```

## Publicación (GitHub Pages)

La web se sirve desde el propio repositorio, sin compilar y sin workflows. En
GitHub: **Settings → Pages → Source: *Deploy from a branch* → Branch `main` /
`/ (root)` → Save**. En un par de minutos queda publicada y cada push a `main`
la actualiza sola.

> Si el repositorio es **privado**, GitHub Pages necesita un plan de pago
> (Pro/Team/Enterprise). Para publicarlo gratis, el repositorio tiene que ser
> **público** (Settings → General → Danger zone → Change visibility).

## Opcional: los ficheros del juego en local

Solo si algún día quieres jugar sin depender del CDN, o publicar los datos en tu
propio servidor. En la web online no hace falta: siempre tira del CDN.

```bash
bash descargar-juego.sh            # baja lo que falte a geo/
bash descargar-juego.sh --forzar   # lo vuelve a bajar todo
```

Si los ficheros están en `geo/`, el port los usa automáticamente y lo indica en
su pantalla de inicio. También puedes forzarlo con `?local=1` o `?cdn=1`.
`geo/` está en `.gitignore` (son ~370 MB, no deben subirse al repositorio).

## Adaptaciones sobre el port original

`play/index.html` parte de la versión guardada del port original y lleva estos
cambios:

- rutas relativas en logo, fondo y módulo del motor (funciona en un
  subdirectorio como `/Geometry-Dash-WebPort/`);
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
