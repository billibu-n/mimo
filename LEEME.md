# Mimo — mapa del proyecto

Este archivo existe para que cualquiera (una persona o un agente) pueda entrar en una sesión
futura y saber **qué hay, dónde está y qué toca a qué**, sin tener que adivinarlo. Si mueves
algo de sitio, actualiza este mapa: es lo único que mantiene los vínculos vivos.

**Aquí solo va el estado de HOY.** Lo que pasó y por qué —los fallos que se encontraron, las
decisiones que se tomaron— está en `../mimo_config/HISTORIAL.md`. Cuando algo cambie, se
**corrige** este archivo y se **agrega una entrada** al historial; ninguno de los dos se deja
desactualizado.

## Cómo está ordenado

En **dos carpetas hermanas**, y esa separación es la regla más importante de este mapa:

```
mimo/                   LO QUE SE ENTREGA. Solo esto se sube a la web.
  index.html            La aplicación. Se abre y funciona. No lleva nada dentro.
  LEEME.md              Este mapa: el estado de hoy.
                        (El historial vive fuera, en mimo_config/HISTORIAL.md, para no viajar
                        con la app: al alumno no le sirve.)
  html/                 Una PIEZA por pestaña. Aquí se edita el HTML.
    plantilla.html        El armazón: cabecera, pestañas, modales, y seis huecos.
    semestre.html         La pestaña Calendario (antes Semestre), entera.
    estudio.html  malla.html  notas.html  tiempo.html  ajustes.html
  css/                  Todo el estilo, en dos capas.
    general.css           Estructura y FORMA: tipografía, tamaños, rejillas, botones.
    tema-clasico.css      Solo COLORES de cada tema. Uno por tema, y nada más.
    tema-negro.css  tema-medianoche.css  tema-deepsea.css
  js/                   El código, por secciones. Es lo que se edita.
    comun/                Lo que usan todas: estado, almacenamiento, catálogo, avisos.
    malla/  semestre/  notas/  estudio/  tiempo/  ajustes/
    orden.txt             En qué orden se cargan. Un archivo nuevo hay que anotarlo aquí.
  vendor/               pdf.js, aparte: 700 KB que solo se cargan al importar un PDF.
  sonido/               alarma.mp3: el sonido que suena cuando el temporizador llega a cero.
                        (el JS apunta a 'sonido/alarma.mp3', relativo al index.html)

mimo_config/            LO EXTERNO. No se sube a ninguna parte.
  HISTORIAL.md          Lo que pasó y por qué. Se agrega al final, nunca se corrige.
  construir/            Los programas que ARMAN index.html a partir de html/ y js/.
  entrada-ejemplo/      El ejemplo del que los armadores copian las franjas horarias.
  pruebas/              Todo lo que comprueba que las cosas siguen funcionando.
  datos/                mis-datos.json: el semestre de un alumno, como ejemplo de la forma
                        que tienen los datos (período, ramos inscritos, eventos, horas).
  mallas/               El PROGRAMA que lee mallas en Python, y sus pruebas.
    ejemplos/             La salida ya procesada de Minas (ramos en JSON + el HTML crudo).
  mallas_ejemplos/      Las mallas CRUDAS de entrada: PDF/JPG de muchas carreras con las que se
                        prueba el lector. Minas está aquí como una más.
  datos-de-muestra.json El caso particular armado (Minas completa), para demostrar la app.
  _historico/           LO QUE YA NO SE USA: el proyecto viejo entero, la app antigua con su
                        servidor.py, el código previo al reordenamiento, las capturas, la
                        versión 1.0.0, los dos armadores viejos y los catálogos incompletos
                        (construir-viejo/). Se guarda por si hay que mirarlo, no se toca.
```

`_historico/` es el único cajón de lo viejo: si algo deja de usarse, va ahí. Y si algo de ahí
vuelve a usarse, sale de `_historico/` y se lo nombra por lo que hace.

Por qué separadas: **lo que se entrega no debe cargar con los ejemplos, las pruebas ni las
capturas.** Antes todo esto vivía junto y el proyecto pesaba 19 MB de los que solo 1,1 MB eran
la aplicación.

El `index.html` que se entrega va **vacío**: sin malla, sin calendario, sin ramos, sin franjas.
Solo la estructura visible, que se va dibujando en blanco y se llena con lo que el alumno cargue.

**Ojo con la distinción, porque se confunde seguido. Son dos cosas distintas:**

| | Qué es |
|---|---|
| **La original** (`mimo/index.html`) | La app pública, **para cualquier carrera y universidad**. Vacía. **Es lo que se entrega.** |
| **El caso particular** (Minas) | Un ejemplo armado aparte, con la malla de Ingeniería Civil de Minas dentro. **No se entrega**: existe para demostrar que la aplicación funciona. |

**Lo que va vacío no es "lo privado del alumno": es todo lo que depende de quién eres.** La malla,
el catálogo de ramos, el calendario y las franjas horarias **no son iguales para todos** — son de
tu universidad y tu carrera. Antes esta app era solo para Minas y por eso los traía puestos; ahora
que es para todos, no puede.

**Ojo con el error de decir "el catálogo va dentro".** Fue un malentendido que costó dos idas y
vueltas: el catálogo (87 ramos) **no** es un plan de estudios universal, es el de Minas. En la
original va vacío.

Lo que sí tiene que traer la original, aunque esté vacía, es **la forma del paquete**: las claves
`catalogo`, `niveles`, `semestres` y `horario`, todas en blanco. Una clave que **falte** deja la
app rota (moría con "E is not defined"); una clave **vacía** la deja en blanco y funcionando. Esa
es la diferencia entre "no hay datos" y "está mal armada".

### Dónde está cada cosa (busca acá antes de explorar)

| Si tienes que tocar... | Abre |
|---|---|
| El armazón de la página, las pestañas, los modales | `html/plantilla.html` |
| Una pestaña concreta (Semestre, Malla, Notas, Tiempo, Ajustes, Estudio) | `html/<pestaña>.html` |
| El color de un tema | `css/tema-<tema>.css` |
| Tamaños, rejillas, botones, tipografía | `css/general.css` |
| La lógica del semestre / de la malla / de las notas | `js/<sección>/*.js` |
| El desplegable de selección que reemplaza a los `<select>` | `js/comun/07-select.js` |
| Editar / borrar un semestre creado | `js/ajustes/05-semestres.js` (botones en `html/plantilla.html`) |
| La duración por defecto del temporizador (25 min) | `js/tiempo/01-tiempo.js` + campo en `html/tiempo.html` |
| El orden en que se carga el código (¡siempre!) | `js/orden.txt` |
| Leer un PDF de malla | `js/malla/04-pdf.js` |
| Dibujar la malla y sus líneas | `js/malla/03-dibujo.js` |
| La ficha del ramo | `js/malla/05-ficha.js` |
| Los campos de la ficha y los colores de los ramos (ahora en Malla, no en Ajustes) | `js/ajustes/03-panel.js` (`renderConfigMalla`, `renderColoresMalla`) + `html/malla.html` |
| Exportar la malla sin datos personales | `js/malla/03-dibujo.js` (`exportarMalla`) + boton en `html/malla.html` |
| El simulador de toma de ramos (marcar aprobados hipoteticos y ver que se desbloquea) | `js/malla/06-simulador.js` (`modalSimular`) + boton `malla-simular` en `html/malla.html` |
| El PROGRAMA que lee mallas en Python | `mimo_config/mallas/` |
| Las mallas de entrada para probar (PDF/JPG crudos) | `mimo_config/mallas_ejemplos/` |
| La malla de Minas ya procesada (caso práctico) | `mimo_config/mallas/ejemplos/` |
| Los programas que arman `index.html` | `mimo_config/construir/index.py` |
| La malla de Minas (solo el caso particular) | `mimo_config/construir/catalogo-real.json` |
| La forma que tienen los datos de un alumno | `mimo_config/datos/mis-datos.json` |
| El caso particular ya armado (Minas, para demostrar) | `mimo_config/datos-de-muestra.json` |
| Las pruebas | `mimo_config/pruebas/app/` |
| Lo que ya no se usa (no tocar) | `mimo_config/_historico/` |

**Regla de oro: no leas el proyecto entero para hacer un cambio.** Esta tabla y el mapa de arriba
bastan para ubicar el archivo; de ahí, directo al archivo.

### Las dos capas del estilo

*   `css/general.css` responde a **cómo se ve el panel**: tipografía, tamaños, márgenes,
    rejillas, botones, tarjetas. No tiene ni un color de tema.
*   `css/tema-*.css` responde a **de qué color**, y nada más: cada uno trae la paleta completa
    de su tema. Se cargan los cuatro siempre y manda la clase que lleva el `<body>`, así que
    cambiar de tema es instantáneo.

**Para agregar un tema hacen falta dos cosas, y ninguna más:** copiar un `css/tema-*.css` y
cambiarle los colores, y añadirlo a la lista `TEMAS` de `js/ajustes/02-avanzados.js`. La prueba
`probar_css.py` cruza las dos listas y avisa si te falta una de las dos.

**Ojo con los campos de formulario.** Un `input`, `select` o `textarea` necesita que le den DOS
cosas: color de letra y fondo. `general.css` se las da juntas en una sola regla
(`input, select, textarea {color:var(--fg);background:var(--sup)}`), con `--sup` para que cada
tema ponga el suyo. Si a un campo se le da solo la letra, el navegador le pone su fondo por
defecto, que es **blanco**: en el tema claro no se nota, pero en los oscuros la letra casi blanca
queda sobre blanco y el cuadro se vuelve ilegible. Le pasó a más de cien campos y no lo vio nadie
hasta que un alumno se topó con uno escribiendo. Por eso está `pruebas/app/prueba_campos.js`,
que mide el contraste de todos los campos en los cuatro temas.
Van fuera de esa regla los `type=color`, `checkbox`, `radio` y `range`, porque su aspecto nativo
(el cuadradito de color, el tick) se pierde si se les pinta el fondo.

## Las tres reglas que mantienen esto sano

1. **A qué archivo tocar, según lo que quieras cambiar:**

   **La barra extraible es UN componente, y solo uno.** Todo lo que se despliega en la aplicacion
(las secciones del modal de Evento, los grupos de Ajustes, la lista de semestres, la configuracion
de la Malla, la ficha del ramo) usa la clase `.barra-extraible`, definida en `css/general.css`.
Va sobre `<details>`/`<summary>` nativo, asi que la apertura, el foco por teclado y el aviso a
lectores de pantalla los da el navegador; el CSS solo pinta. **No inventes otra forma de
desplegar**: si aparece un lugar nuevo que se abre, usa esta. La prueba `prueba_barra_extraible.js`
vigila que siga siendo una sola y que este donde debe.

| Quieres cambiar | Edita | ¿Hay que rearmar? |
   |---|---|---|
   | Una pestaña (su HTML) | `html/<pestaña>.html` | **Sí**, hay que rearmar |
   | El código de una sección | `js/<sección>/*.js` | No: recarga y ya |
   | Los colores de un tema | `css/tema-<tema>.css` | No: recarga y ya |
   | Fuentes, tamaños, rejillas | `css/general.css` | No: recarga y ya |

   El `index.html` es la suma de las piezas de `html/`: si lo editas a mano, el siguiente
   armado borra tu cambio sin avisar.

2. **Ningún programa lleva rutas fijas.** Cada uno deduce la raíz del proyecto desde su propia
   ubicación (`os.path.dirname(os.path.dirname(os.path.abspath(__file__)))`). Eso es lo que
   permite mover, copiar o renombrar la carpeta entera sin que nada deje de encontrarse. Si
   escribes una ruta fija como `/home/tal/mimo/...` en algún lado, rompes esa propiedad.

3. **Todo cambio termina corriendo las pruebas.** Desde cualquier carpeta:

   ```
   bash pruebas/app/correr_pruebas.sh
   ```

   El semáforo es honesto a propósito: dice `ok`, `ROJO` o **`?` (no informa su veredicto)**.
   Ese `?` no es un aprobado encubierto: son pruebas que todavía no afirman nada y que hay que
   arreglar para que digan su veredicto con `ERRORES_TOTALES=<n>`.

4. **La app que se entrega está VACÍA; el ejemplo con datos es un caso aparte.**

   La aplicación que el alumno recibe **no trae nada armado**: ni malla, ni calendario, ni
   franjas, ni ramos. Esta app es para alumnos de **cualquier carrera y universidad**, así que no
   puede venir con los datos de ninguna. El ejemplo con datos (la malla de Minas) es un **caso
   particular** que se arma aparte y existe para **demostrar que la aplicación funciona**.

   ```
   python3 construir/index.py                    # LA ORIGINAL: vacía (esto es lo que se entrega)
   python3 construir/index.py --con-ejemplo      # EL EJEMPLO: Minas, con malla, calendario,
                                                 #   ramos, eventos y horas de estudio (lleno)
   python3 construir/index.py --datos x.json     # cualquier paquete de datos, ya armado
   ```

   Los tres escriben en `mimo/index.html`, así que **el último comando que corras es el que
   queda**. Si abres el index y ves la malla de Minas, se armó con `--con-ejemplo`: vuelve a
   correrlo sin argumentos para dejar la original. (No se puede elegir el archivo de salida: es
   una limitación conocida, y por eso los tres se pisan.)

   Por qué importa: así el alumno **crea su propia configuración** —sube su malla, la edita, arma
   su semestre, pone su calendario— y todo eso vive bajo su identidad (su clave en el navegador),
   sin chocar con nada fijo en el código. Es como un usuario en una página: su cuenta es suya y la
   modifica él.

   El flujo de primera vez (elegir universidad y carrera, subir la malla, generarla) **todavía no
   está construido**. Por ahora la aplicación se entrega en blanco y se llena a mano.

   **Al cambiar la app hay que rearmar el ejemplo y comprobar que no se rompió ninguna relación.**
   Si el caso particular sigue armándose bien sobre la app vacía, queda demostrado que la
   aplicación funciona.

## El CSV canonico y los 11 semestres (2026-09-19)

Hay un CSV de referencia de los ramos: `mimo_config/datos/catalogo-ramos.csv` (lo arma
`construir/armar-csv-ramos.py` desde `catalogo-real.json`). Columnas: codigo, nombre, creditos,
nivel, tipo, requisitos (notacion ;=Y |=O), anual, aprobacion, dificultad, prioridad, descripcion,
equivalente.

**Ramos analogos**: dos codigos que son el MISMO ramo (en la malla comparten recuadro) se marcan en
la columna `equivalente`. Lo dice la malla, no es criterio inventado (ej. IN3171 -> MA3701).

**La malla de Minas tiene 11 semestres, no 12.** El `catalogo-real.json` trae un campo `niveles`
con 12 columnas (bug: inventa un semestre 12). La verdad es el `plan` (11 semestres I..XI +
Electivos). `index.py` ahora deriva los niveles del `plan` (funcion `niveles_desde_plan`).

## Los datos del usuario NO viven en los archivos

Todo lo que el usuario configura (calendario, ramos, tiempos, malla, notas) se guarda en el
`localStorage` de SU navegador, bajo la clave `mimo-limpio-v1` (`CLAVE` en `js/comun/00-cabecera.js`).
Los archivos que se envian en el .zip (`index.html`, `js/`, `css/`, `html/`) son solo la
**aplicacion vacia**; el `localStorage` de cada usuario es SUYO y no viaja con esos archivos.

**Por eso, al enviar una actualizacion (nuevo .zip con el codigo cambiado), el usuario NO pierde
nada: sus datos están en su navegador, no en los archivos que se reemplazan.**

**El respaldo.** Porque `localStorage` se borra si el usuario limpia la cache por error, hay en
**Ajustes > Mis datos** dos botones: **"Descargar mis datos (.json)"** (baja TODA su configuracion
a un archivo) y **"Cargar un archivo"** (la restaura). El respaldo es **autosuficiente (formato 2)**:
ademas del estado `E` (notas, metas, tiempos, ajustes, aprobados), guarda la capa estructural que la
app trae dentro del HTML —`catalogo`, `niveles` y `semestres` (la malla, con sus 87 ramos y sus
columnas). Por que: un usuario de la version de ejemplo (Minas) trabaja sobre el semestre `2026-2` y
la malla de 87 ramos, que viven en `D`, no en `E`; un respaldo que solo guardara `E` dejaria sus datos
huerfanos al abrirlo en la version vacia. Al importar, el catalogo entra por `E.catalogo` (que `CAT()`
ya combina con `D.catalogo`) y los semestres nuevos por `E.extras`; los niveles se reconstruyen solos
desde el `nivel` de cada ramo. El import tambien acepta un `.json` viejo (formato 1: solo `E`) y avisa
que le falta la malla. Cubierto por `pruebas/app/prueba_respaldo.js` y `prueba_respaldo_real.js`
(end-to-end: importar un respaldo con malla sobre la app vacia).

**Restablecer todo.** El boton "Restablecer todo" (en Mis datos) **pide confirmacion**, descarga un
respaldo de seguridad ANTES de borrar, y limpia el `localStorage` de verdad (`removeItem`), dejando
la aplicacion como recien abierta. **No** toca la malla que trae el archivo (eso es parte del HTML,
no de la cache). Cubierto por `pruebas/app/prueba_restablecer.js`.

Regla de oro para quien toque el codigo:
- **NUNCA cambiar `CLAVE`**: si cambia, la app busca en un cajon vacio y el usuario "pierde" todo
  (sus datos siguen en el cajon viejo, pero la app ya no los lee).
- **Si cambia el esquema** (la `v` de `estadoInicial()`), hay que migrar en `cargar()` con
  `Object.assign(base, guardado)`, que rellena lo nuevo sin borrar lo viejo. Ya esta hecho para
  `ajustes`, `tiempo`, `extras`, etc.

## Para armar y probar

```
python3 construir/index.py             # rearma el index.html a partir de html/ y js/
python3 construir/index.py --datos ../mimo_config/datos-de-muestra.json   # con datos dentro
bash pruebas/app/correr_pruebas.sh     # corre todo
python3 mallas/informe.py <carpeta>    # informe para revisar a mano la lectura de mallas
python3 pruebas/malla/volcar_palabras.py   # rehace la entrada de probar_pdf.js
```

Las pruebas usan `chromium` para abrir la aplicación de verdad, no una maqueta. Si falta,
se instala con `sudo dnf install chromium`.

## Trampas conocidas (costaron caro, no las repitas)

* **Un PDF no se lee por el orden en que sale el texto.** En una malla real los semestres
  salían `3 4 5 6 7 8 9 10 11 1 2` mientras en la página están del 1 al 11. Leyendo por orden
  se arma una malla falsa y **nada avisa**. Hay que usar las coordenadas.
* **Una misma línea de la página lleva ramos de varias columnas**, pero **un nombre puede ser
  más ancho que su columna** y desbordar. Las dos cosas se resuelven cortando por **huecos
  grandes** (unos 12 puntos), no por el ancho de la columna.
* **El número del semestre puede ir antes o después** de la palabra: `I Semestre` y
  `SEMESTRE 1`. Mirar solo hacia un lado deja media biblioteca en cero ramos.
* **En la grilla, el nivel es la posición de la fila de códigos**, no el número de línea de la
  hoja.
* **Un archivo con varias hojas repite ramos**: hay que quitar repetidos o el conteo se dispara.
* **El texto legal de las hojas** ("malla sujeta a cambios", "resolución N", "escanea el código
  QR") entra como si fuera un ramo si no se filtra.
* **Ya no hay que tener miedo de abrir el `index.html` en un editor.** Antes el archivo armado
  llevaba pdf.js comprimido dentro —dos líneas de 386.702 y 319.209 caracteres— y cualquier
  editor que intentara dibujarlas se colgaba. Ahora pdf.js vive en `vendor/` y el
  `index.html` son 17 KB de HTML legible.
* **Un temporizador sin limpiar dejaba la suite colgada para siempre.** En `navegador.js`, cada
  mensaje al navegador armaba un `setTimeout` de 60 s que nunca se limpiaba, y los `fetch` al
  puerto de depuración dejaban dos sockets vivos en Node. El efecto era traicionero: cada prueba
  terminaba bien y escribía su veredicto, pero el proceso no moría nunca, así que
  `correr_pruebas.sh` esperaba para siempre. La suite pasó de **no terminar** (más de 27 minutos
  colgada y sin veredicto) a **26 segundos**. Se arregló limpiando el temporizador dentro de
  `enviar()` y saliendo con `process.exit(0)` al final de `correr_una.js`.
* **Una prueba de navegador que no pone `window.__listo = true` aguanta el presupuesto entero.**
  Diez de las trece no lo ponían, y cada una pagaba los 150 s del tope aunque llevara un segundo
  lista. El arnés ya espera `__listo`; si agregas una prueba nueva, ponlo al final de todo, o
  pagarás los 45 s del tope en cada corrida.

## Características normalizadas (cambiarlas en UN solo lugar)

Hay cosas que se repiten por toda la aplicación (radios de orilla, transiciones, botones, barras
desplegables, desplegables de selección). Están centralizadas a propósito: **cambiar una acá cambia
todo el proyecto de una vez.** Si vas a tocar alguna, edita el archivo que se indica y nada más.

| Característica | Dónde se cambia | Qué afecta |
|---|---|---|
| **Variables de forma** (radios, ritmo, curva, foco) | `css/general.css`, bloque `:root` (secciones C1-C3 cerca del inicio) | Todo: `--r-sm/--r-md/--r-lg` (radios), `--t` (duración), `--curva` (curva de easing), `--foco` (anillo de foco) |
| **Botones** (`.btn`, `.mini`) | `css/general.css` clases `.btn` y `.mini` | Todos los botones de la app |
| **Barras desplegables** (`.barra-extraible`) | `css/general.css` (bloque "Barra extraible") + `js/comun/06-arranque.js` (`inicializarBarras`) | Ajustes, Malla, Notas, modal de Evento, lista de semestres |
| **Desplegable de selección** (reemplaza al `<select>` nativo) | `js/comun/07-select.js` + `css/general.css` (bloque "Select propio") | Los ~16 selects de toda la app (notas, editor de evento, tiempo, semestre activo del header, malla) |

**Regla del desplegable de selección (importante):** los `<select>` nativos abren un menú que
dibuja el navegador y **no se puede estilizar** (de ahí el recuadro feo/cuadrado). Por eso existe
`js/comun/07-select.js`: transforma cada `<select>` en un desplegable propio. El `<select>` nativo
queda oculto dentro como "fuente de verdad" (sigue guardando el `value`, disparando el `change`, y
sobreviviendo a los `renderTodo()`). **No edites los `<select>` a mano ni los estilices: el
componente los maneja.** Si creas un `<select>` nuevo en algún HTML/JS, lo detecta solo el
`MutationObserver` de `06-arranque.js` y lo convierte.

La distinción de las dos capas se mantiene igual que siempre: **los colores de tema** no viven acá,
viven en `css/tema-*.css`.

## Lo que falta

* Cargar el **catálogo de mallas verificadas** (una por carrera) y el botón para aportar la
  propia. Es lo que convierte leer un PDF en algo que se hace una vez por carrera y no por
  alumno.
* Las **4 imágenes** de malla no se leen: una foto necesita que alguien la mire.
* **Falta decir cuáles ramos son anuales.** La aplicación ya sabe dibujarlos como un recuadro de
  dos columnas y ya sabe leerlos de la columna `anual` al importar, pero **ninguna fuente dice
  cuáles son**: el HTML original de ucampus guarda código, nombre, créditos y prerrequisitos, y
  nada de duración, y la malla en JPEG es una grilla uniforme, sin ninguna caja que cruce dos
  columnas. Los marca el usuario, con la casilla del editor de ramos o con esa columna.
  Ponerlos nosotros sería inventar datos en su propia malla.
* En las mallas que **no traen código** (arte, arquitectura, música: hay carreras que nombran los
  ramos y no les ponen ninguno), la aplicación propone entre un 9% y un 13% más de ramos que el
  lector de Python. Se le cuelan un par de líneas administrativas —«Código de postulación 11016»,
  «MV202512»— que el otro filtra. Es coherente con «la aplicación propone y el alumno borra lo
  que sobra», pero conviene saberlo.
* El viejo `PLAN-para-retomar.html` **se borró** (2026-09-19). Pedía cosas ya hechas y contradecía
  a este archivo. Este `LEEME.md` es el único mapa: ante la duda, este.
