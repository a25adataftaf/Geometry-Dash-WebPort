# Geometry Dash Web Port (fan-made)

Pantalla de entrada web para el port de Geometry Dash de Ale7208. El usuario solicitante indica que cuenta con permiso del autor para reutilizar su webport. Este proyecto no es oficial ni está afiliado a RobTop Games.

## Cómo funciona

- **Load** abre `public/geometry-dash-webport.html`, basado en [Ale7208/Geometry-Dash-webport](https://github.com/Ale7208/Geometry-Dash-webport).
- El HTML no contiene el juego completo: descarga el runtime y los datos desde [Ale7208/geometry-dash-web](https://github.com/Ale7208/geometry-dash-web), fijado al commit `29a2eb7683ed7d9a7a9ba9a171df236e1dfb6933`.
- La descarga inicial de los ficheros `.data` y `.wasm` ronda los **367 MiB**; hace falta conexión a Internet y WebGL 2. El navegador puede conservar parte de los datos en caché.
- Las funciones en línea envían peticiones a través del Worker de Ale7208. No inicies sesión con una cuenta personal en esta build; no controlamos ni auditamos ese servicio.
- El binario y los datos del juego se sirven desde el repositorio externo; no están incluidos en este Git ni en `dist/`.

## Ejecutar y compilar

Requiere Node.js 20 o posterior.

```bash
npm install
npm run dev
```

Para generar el sitio estático:

```bash
npm run build
```

La carpeta `dist/` contiene el splash, el cargador y las tipografías locales. Al jugar, el cargador necesita acceso a los servidores externos descritos arriba.

## Atribución

El HTML del webport procede de Ale7208 y se incluye según el permiso indicado por el solicitante. Geometry Dash y sus recursos originales pertenecen a sus respectivos titulares. El resto de este repositorio configura una pantalla de entrada y una compilación web para abrir ese port.
