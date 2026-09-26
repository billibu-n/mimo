# Mimo — Panel de semestre universitario

<!-- build: 2026-09-25 v1.0.4 -->
![Versión](https://img.shields.io/badge/versión-1.0.4-16a34a)
![Plataforma](https://img.shields.io/badge/web-estática-2563eb)
![Licencia](https://img.shields.io/badge/licencia-MIT-3da639)

[**⬇ Descargar Mimo 1.0.4 (.zip)**](https://github.com/billibu-n/mimo/releases/download/v1.0.4/mimo-v1.0.4.zip)
· [Ver todas las versiones](https://github.com/billibu-n/mimo/releases)
· [Probar sin descargar](https://billibu-n.github.io/mimo/)

## Nota Importante

Importante mencionar que este proyecto ha podido ser construido con ayuda de herramienta de IA dada su robustez y mi poca experiencia en aplicaciones y diseño de páginas web. Por lo que también me ha sido de ayuda para adentrarme en la práctica de este tipo de actividades, pues por lo general ha sido sólo estudio y teoría, sin una utilidad directa del conocimiento.

Este proyecto está en pleno proceso de construcción, a futuro se implementarán nuevas herramientas y funcionalidades. La idea es que pueda cubrir todas las demandas que involucra ser estudiante en el proceso universitario, y que sea una herramienta para poder adjuntar y optimizar la organización.

Por lo mismo, muchas herramientas aún pueden estar algo torpes e incompletas, y se pueden observar sutilidades visuales incómodas y poco prácticas.

## Funcionamiento

App web estática (HTML + CSS + JS) para armar tu semestre: malla curricular, notas, calendario, pomodoro, "to-do", etc. **No necesita servidor ni instalación**: se abre con doble clic en `index.html`.

Pensada para **cualquier carrera y universidad**: la app se entrega vacía y cada alumno la llena con
su propia malla (a mano o leyendo un PDF), sus ramos, su calendario y sus notas. Todo queda guardado
en el navegador de cada uno.

## Probar sin descargar

La versión publicada también se puede usar desde el navegador, sin bajar nada:
**<https://billibu-n.github.io/mimo/>**

Es cómodo para probarla, pero para el día a día conviene descargarla: si la usas desde la web,
tus datos quedan guardados en ese navegador y ligados a esa dirección, y un día pueden
aparecer mezclados con los de la versión descargada. La versión de escritorio es la buena.

## Cómo se usa

1. Descarga el `.zip` con el botón de arriba (o desde **Releases**).
2. Descomprime la carpeta donde quieras (por ejemplo `C:\mimo`). No la muevas después, esto porque utiliza el caché del navegador. Por lo mismo, es importante ir haciendo respaldos constantemente con la opción que se encuentra en el apartado de **Ajustes**, se genera un respaldo/archivo de naturaleza .json que puede ser reutilizado en cualquier dispositivo incluso.
3. Aunque por hora, sólo se abre `index.html` con doble clic para que funcione.

## Qué trae

- **Malla curricular**: importa tu malla desde PDF o edítala a mano, con simulador de ramos.
- **Notas**: calcula promedios y escenarios por ramo y por semestre.
- **Calendario**: vistas Mes / Año / Semestre; eventos académicos y personales.
- **Tareas** y **Estudio**: pendientes y bloques de tiempo con temporizador y alarma.
- **Ajustes**: 8 temas de color, respaldo/importación de tus datos y actualizaciones.

## Estructura

```
index.html      la aplicación (se arma a partir de html/ + js/, no se edita a mano)
css/            estilos: estructura (general.css) y temas de color (tema-*.css)
js/             el código, por secciones (ver js/orden.txt para el orden de carga)
html/           una pieza por pestaña
sonido/         alarma del temporizador
vendor/         motor de lectura de PDF (pdf.js)
plantilla.html  armazón de la página (cabecera, barra lateral, modales)
version.json    número de versión, que usa el botón de actualización
```

## Contribuir

Las ideas, los reportes de errores y los cambios de código son bienvenidos: Mimo se hizo para
estudiantes y mejora más rápido con más gente mirándolo.

- ¿Encontraste algo roto? Abre un *issue* (hay plantillas para errores, propuestas y preguntas).
- ¿Tienes una duda de uso o una idea? Pasa por [Discussions](https://github.com/billibu-n/mimo/discussions).
- ¿Vas a tocar código? **Lee antes [`CONTRIBUTING.md`](CONTRIBUTING.md)**: explica en dos
  minutos cómo está armado el proyecto y qué cambios necesitan reensamblado. Se ahorra tiempo.

Qué es más útil ahora mismo: probarla en tu computador y contar **qué se rompe o qué estorba**.
Es un proyecto en construcción y ese aviso vale tanto como un parche.

## Licencia

[MIT](LICENSE): puedes usar, copiar, modificar y redistribuir Mimo, también con fines
comerciales, siempre que conserves el aviso de copyright. Se entrega **sin garantía**:
revísalo antes de confiarle tus notas.

## Versión

1.0.4 — el detalle de cada versión está en [`CHANGELOG.md`](CHANGELOG.md).

## Créditos

- El lector de PDF del navegador es [pdf.js](https://mozilla.github.io/pdf.js/), de Mozilla,
  bajo licencia Apache 2.0 (incluido en `vendor/`).
