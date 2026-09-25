# Mimo — Panel de semestre universitario

App web estática (HTML + CSS + JS) para armar tu semestre: malla curricular, notas, calendario y
hábitos de estudio. **No necesita servidor ni instalación**: se abre con doble clic en `index.html`.

Pensada para **cualquier carrera y universidad**: la app se entrega vacía y cada alumno la llena con
su propia malla (a mano o leyendo un PDF), sus ramos, su calendario y sus notas. Todo queda guardado
en el navegador de cada uno.

## Cómo se usa

1. Descarga el `.zip` desde **Releases** (o desde el botón verde *Code → Download ZIP*).
2. Descomprime la carpeta donde quieras (por ejemplo `C:\mimo`). No la muevas después.
3. Abre `index.html` con doble clic.

Tu información queda guardada en este navegador. Para llevarla a otro equipo usa
**Ajustes → Mis datos → Descargar mis datos**.

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

## Versión

1.0.4
