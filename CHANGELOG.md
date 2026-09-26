# Historial de cambios

Este documento cuenta **qué cambió**, en palabras. Las descargas están en
[Releases](https://github.com/billibu-n/mimo/releases), y dentro de la app
**Ajustes → Actualización → Buscar actualización** avisa si hay una versión más nueva.

El formato sigue, con holgura, [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/);
las versiones empiezan en la 1.0.2, que fue la primera publicada.

## [1.0.4] — 2026-09-25

### Añadido

- **Calendario comercial**, sin necesidad de tener un semestre creado: vistas Mes / Año /
  Semestre, con navegación y un botón de salto rápido (Este mes / Este año / Esta semana).
  La vista de año muestra los 12 meses completos.
- **Eventos personales**: cumpleaños, citas, trámites o cualquier cosa que no pertenezca a
  un semestre. Se guardan por fecha y conviven con los eventos académicos.
- **El semestre se pinta encima del calendario**: con un semestre activo, marca las semanas
  de clase (con su número), los recesos y los exámenes, tanto en mes como en año.
- **Vínculo bidireccional con Evaluaciones**: cambiar la fecha de un evento de un ramo se
  refleja en su evaluación, y al revés.
- **Pestañas Tareas y Estudio**, con temporizador y alarma.

### Cambios

- El calendario ya no se encoge al alternar de vista: Mes y Año ocupan el mismo ancho fijo
  (se corrigió un error de centrado que las dejaba a la mitad).
- La etiqueta del botón de navegación se adapta a la vista activa.

### Corregido

- En Ajustes, el grupo "Semestre" (lista de semestres y metas por ramo) salía cortado: ahora
  se ve completo.
- Al crear un evento en una instalación recién hecha, el evento no se dibujaba porque su
  tipo quedaba sin registrar.

### Publicación

- La entrega se limita a **la aplicación** (código y recursos). El repositorio público no
  incluye los documentos de trabajo internos.

## [1.0.2] — 2026-09-20

Primera versión pública.

- Panel de semestre: malla curricular (importación desde PDF o edición a mano) con
  simulador de ramos, notas por ramo y por semestre, calendario, tareas y estudio.
- 8 temas de color, barra lateral extraíble, avisos.
- Comprobación de actualizaciones desde **Ajustes → Actualización**.
- Los datos del alumno se guardan en su propio navegador; respaldo e importación en JSON
  desde **Ajustes → Mis datos**.
