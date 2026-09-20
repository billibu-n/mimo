# Mimo — Panel de semestre universitario

![Descargar última versión](https://img.shields.io/badge/Descargar_última_versión-Mimo_1.0.2-2563eb?style=for-the-badge&logo=github)
![Versión](https://img.shields.io/badge/version-1.0.2-16a34a)

[**⬇ Descargar Mimo 1.0.2 (.zip)**](https://github.com/billibu-n/mimo/releases/download/v1.0.2/mimo-v1.0.2.zip)

App web estática (HTML + CSS + JS) para armar tu semestre: malla curricular, notas, calendario y
hábitos de estudio. No necesita servidor ni instalación: se abre con doble clic en `index.html`.

Pensada para **cualquier carrera y universidad**: la app se entrega vacía y cada alumno la llena con
su propia malla (a mano o leyendo un PDF), sus ramos inscritos, su calendario y sus notas. Todo queda
guardado en el navegador de cada uno.

## Cómo se usa

1. **Descarga el `.zip`** — botón de arriba.
2. Descomprime y deja la carpeta donde quieras (por ejemplo `C:\mimo`). No la muevas después.
3. Abre `index.html` con doble clic.

Tu información queda guardada en este navegador. Para llevarla a otro computador usa
**Ajustes → Mis datos → Descargar mis datos**.

## Actualizar

Dentro de la app hay **Ajustes → Actualización → Buscar actualización**: compara tu versión con la
última publicada aquí y te avisa si hay una más nueva, con el enlace para bajarla.

## Qué es cada carpeta

- `index.html` — la aplicación (se arma a partir de `html/` + `js/`, no se edita a mano).
- `css/` — estilos (estructura y temas de color).
- `js/` — el código, por secciones.
- `html/` — una pieza por pestaña.
- `vendor/` — el motor de lectura de PDF (pdf.js).
- `version.json` — el número de versión, que usa el botón de actualización.
