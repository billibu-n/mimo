/* ---------------------------------------------------------------- arranque */
function pintarFiltros(){
  const fr = document.getElementById('f-ramos');
  fr.innerHTML = ramosBase().map(r =>
    '<label><input type="checkbox"' + (ramosFiltro.has(r.codigo) ? ' checked' : '') + ' data-ramo="' + r.codigo + '">' +
    '<i class="cuadro" style="background:' + colorDe(r.codigo) + '"></i>' + esc(r.alias) + '</label>').join('');
  fr.querySelectorAll('input').forEach(i => i.onchange = () => {
    i.checked ? ramosFiltro.add(i.dataset.ramo) : ramosFiltro.delete(i.dataset.ramo);
    renderSemestre();
  });
  // El filtro por tipo de evento ya no tiene recuadro en pantalla, asi que se deja siempre
  // completo: asi el calendario sigue mostrando todos los eventos.
  const ft = document.getElementById('f-tipos');
  if (ft) {
    const tipos = tiposDe();
    ft.innerHTML = Object.keys(tipos).map(t =>
      '<label><input type="checkbox"' + (tiposFiltro.has(t) ? ' checked' : '') + ' data-tipo="' + t + '">' +
      esc(tipos[t].toLowerCase()) + '</label>').join('');
    ft.querySelectorAll('input').forEach(i => i.onchange = () => {
      i.checked ? tiposFiltro.add(i.dataset.tipo) : tiposFiltro.delete(i.dataset.tipo);
      renderSemestre();
    });
  }
}
function arranque(){
  // El cartel de 'esto es una muestra' es solo para el archivo de ejemplo: la version
  // limpia ya es la aplicacion de verdad, asi que se lo quita de encima al arrancar.
  if (D.limpio) { const m = document.getElementById('aviso-muestra'); if (m) m.remove(); }
  memoEstados = null;    // repintado completo: los estados de la malla se recalculan desde cero
  aplicarAvanzado();
  if (!ramosFiltro.size) resetFiltros();
  renderSemActivo();
  pintarFiltros();
  renderSemestre(); renderEstudio(); renderLista(); renderDetalle();
  renderAjustes(); renderTiempo(); renderMalla();
  estilizarSelects(document);
}
document.querySelectorAll('.tab').forEach(t => t.onclick = () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === t));
  document.querySelectorAll('.panel').forEach(p => p.classList.toggle('on', p.id === 'p-' + t.dataset.panel));
  if (t.dataset.panel === 'tiempo') renderTiempo();
  if (t.dataset.panel === 'estudio') renderPuntos();
  if (t.dataset.panel === 'malla') { memoEstados = null; renderMalla(); }
});
const botonesVista = {todo:'v-todo', prox:'v-prox', pend:'v-pend'};
Object.keys(botonesVista).forEach(k => {
  const btn = document.getElementById(botonesVista[k]);
  btn.onclick = () => {
    vista = k;
    Object.values(botonesVista).forEach(id => document.getElementById(id).classList.remove('on'));
    btn.classList.add('on');
    renderSemestre();
  };
});
document.getElementById('malla-buscar').oninput = ev => {
  mallaBuscaTexto = ev.target.value;
  mallaBusca = sinTildes(mallaBuscaTexto);
  renderMalla();
};
document.getElementById('malla-rapido').onchange = ev => { mallaRapido = ev.target.checked; };
document.getElementById('malla-limpiar').onclick = () => {
  mallaSel = null; mallaBusca = ''; mallaBuscaTexto = ''; renderMalla();
};
document.getElementById('malla-nuevo-ramo').onclick = () => modalRamo(null);
document.getElementById('malla-reordenar').onclick = modalReordenarMalla;
document.getElementById('malla-exportar').onclick = exportarMalla;
document.getElementById('malla-simular').onclick = modalSimular;
document.getElementById('malla-importar').onclick = modalImportarMalla;
document.getElementById('nueva-tarea').onclick = nuevaTarea;
document.getElementById('btn-nuevo-sem').onclick = modalNuevoSemestre;
document.getElementById('btn-edit-sem').onclick = modalEditarSemestre;
document.getElementById('btn-borrar-sem').onclick = borrarSemestre;
document.getElementById('modal').onclick = ev => { if (ev.target.id === 'modal') cerrarEditor(); };
document.getElementById('meta-semanal').oninput = ev => {
  est().metas.semanal = Number(ev.target.value) || 0;
  guardar(); renderEstudio(); renderSemestre(); renderPuntos();
};
document.getElementById('meta-maxima').onchange = ev => {
  E.usarMetaMaxima = ev.target.checked;
  guardar('Meta cambiada a ' + (ev.target.checked ? 'máximo histórico' : 'número fijo'));
  renderEstudio(); renderSemestre(); renderPuntos();
};
document.getElementById('aj-ver-hechas').onchange = ev => {
  E.ajustes.verHechasPorHacer = ev.target.checked; guardar(); renderSemestre();
};
document.getElementById('crono-play').onclick = cronoPlay;
document.getElementById('crono-cero').onclick = cronoCero;
document.getElementById('crono-registrar').onclick = cronoRegistrar;
document.getElementById('crono-ramo').onchange = ev => { E.tiempo.ramo = ev.target.value; guardar(); };
document.getElementById('crono-semana').onchange = ev => { E.tiempo.semana = ev.target.value; guardar(); };
document.getElementById('crono-objetivo').onchange = ev => {
  E.tiempo.objetivo = Math.max(1, Math.min(600, Number(ev.target.value) || 25));
  guardar(); renderTiempo();
};
document.querySelectorAll('.modo').forEach(b => b.onclick = () => {
  E.tiempo.modo = b.dataset.modo;
  document.querySelectorAll('.modo').forEach(x => x.classList.toggle('on', x === b));
  guardar(); renderTiempo();
});
// El respaldo AUTOSUFICIENTE, en el formato 2 (el canonico desde la version 1.0.1). Trae la capa
// de estado E (notas, metas, colores, eventos y ramos agregados, tiempos, aprobados) MAS la capa
// estructural que la app trae dentro del HTML (catalogo, niveles, semestres con sus semanas). Asi
// un respaldo se restaura integro en cualquier version, tambien en la vacia. NOTA: las franjas
// horarias de D.horario NO se guardan porque la app 1.0.1 no las lee en ningun sitio (dato muerto
// heredado de la version vieja); guardarlas seria arrastrar basura que nada consume.
function respaldoActual(){
  const r = {
    formato: 2,
    estado: Object.assign({}, E),
    catalogo: D.catalogo || {},
    niveles: D.niveles || [],
    semestres: D.semestres || []
  };
  delete r.estado.guardadoEn;
  return r;
}

function descargarRespaldo(nombre){
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(respaldoActual(), null, 1)], {type:'application/json'}));
  a.download = nombre || ('respaldo-mimo-' + new Date().toISOString().slice(0, 10) + '.json');
  a.click();
}

document.getElementById('restablecer').onclick = () => {
  if (!confirm('Se borrara TODO lo que hiciste: semestres, eventos, notas, colores, tiempos y ' +
               'ajustes. Antes se descargara un respaldo por si fue un error.\n\n' +
               'No se borra la malla que trae la aplicacion (eso es parte del archivo).\n\n' +
               '¿Seguir?')) return;
  // 1. respaldo de seguridad ANTES de borrar, por si el clic fue un error
  descargarRespaldo('respaldo-antes-de-restablecer-' + new Date().toISOString().slice(0, 10) + '.json');
  // 2. limpiar la cache de verdad (no solo en memoria): se borra la clave del localStorage
  try { localStorage.removeItem(CLAVE); } catch (err) { /* sin almacenamiento: igual se sigue */ }
  // 3. estado de fabrica y repintado, SIN volver a guardar: el almacen queda limpio de verdad,
  //    como recien abierta la aplicacion (no se persiste un estado de fabrica que ya viene por defecto).
  E = estadoInicial();
  invalidarCatalogo();
  resetFiltros(); arranque();
  mostrarAviso('Todo restablecido');
};
document.getElementById('exportar').onclick = () => { descargarRespaldo(); };
document.getElementById('importar').onclick = () => document.getElementById('archivo').click();
document.getElementById('btn-actualizar').onclick = buscarActualizacion;
document.getElementById('archivo').onchange = ev => {
  const f = ev.target.files[0];
  if (!f) return;
  const lector = new FileReader();
  lector.onload = () => {
    try {
      const datos = JSON.parse(lector.result);
      if (!datos || typeof datos !== 'object') { alert('Ese archivo no es un respaldo de tu Mimo.'); return; }

      // FORMATO 2 (respaldo autosuficiente): trae 'estado' (la capa E) mas la capa estructural
      // (catalogo, niveles, semestres). Se fusiona para que un respaldo del ejemplo de Minas se
      // restaure integro en la version vacia.
      if (datos.formato === 2 && datos.estado && typeof datos.estado === 'object') {
        // 1. el estado del usuario
        E = Object.assign(estadoInicial(), datos.estado);
        // 2. la malla (catalogo y niveles) que el respaldo traiga: entra por E.catalogo, porque
        //    D es la capa fija que trae el HTML y no se puede reescribir. CAT() ya combina ambas.
        const catTraido = datos.catalogo || {};
        E.catalogo = Object.assign({}, E.catalogo || {}, catTraido);
        // 3. los semestres que el respaldo trajera y que esta version no tiene, van a E.extras.
        const ya = {}; semestres().forEach(x => { ya[x.id] = 1; });
        (datos.semestres || []).forEach(sem => {
          if (sem && sem.id && !ya[sem.id]) {
            E.extras = (E.extras || []).concat([sem]);
            ya[sem.id] = 1;
            E.sem[sem.id] = E.sem[sem.id] || estadoSemestre(sem);
          }
        });
        invalidarCatalogo();
        guardar('Datos cargados'); resetFiltros(); arranque();
        return;
      }

      // FORMATO VIEJO (solo E): el .json de la 1.0.0. Se carga el estado, pero ese archivo NO
      // traia la malla ni los semestres del ejemplo, asi que se avisa para que no parezca perdido.
      if ('sem' in datos || 'v' in datos || 'activo' in datos) {
        E = Object.assign(estadoInicial(), datos);
        guardar('Datos cargados'); resetFiltros(); arranque();
        mostrarAviso('Se cargaron tus datos. Si la malla no aparece, importa tu malla de nuevo ' +
                     '(Ajustes > Malla > Importar malla desde un archivo).');
        return;
      }

      alert('Ese archivo no es un respaldo de tu Mimo.');
    }
    catch (err) { alert('No pude leer ese archivo.'); }
    ev.target.value = '';   // permite volver a elegir el mismo archivo mas tarde
  };
  lector.readAsText(f);
};
document.getElementById('estado-guardado').textContent = 'Guardado en este navegador como "' + CLAVE + '".';
document.getElementById('banner-recargar').onclick = () => location.reload();
document.getElementById('banner-cerrar').onclick = () =>
  document.getElementById('banner-remoto').classList.remove('on');
let tResize = null;
window.addEventListener('resize', () => { clearTimeout(tResize); tResize = setTimeout(renderPuntos, 200); });

/* ---------------------------------------------------------------- barras extraibles
   El <details> no anima el cierre: al quitarle 'open' el navegador esconde el contenido en el mismo
   cuadro, y ninguna transicion del hijo alcanza a verse. Para que abrir y cerrar se vean igual hay
   que sacarle el control del plegado al navegador:

     1. El <details> se queda SIEMPRE con open. Quien manda es la clase .abierta en la barra.
     2. El .cuerpo se envuelve en .cuerpo-env, que cuelga de la barra y anima su max-height
        (0 -> 2000px). Ese si transiciona, en los dos sentidos y con la misma curva.
     3. El clic en el summary NO cierra el details: alterna .abierta. Se intercepta con
        preventDefault para que el navegador no le quite el open por su cuenta.

   Todo esto es solo pintura: si el JS no corre, el <details> sigue abriendo y cerrando (de golpe,
   como cualquier details), que es lo que debe pasar sin JavaScript.
*/
function envolverCuerpoDeBarras(raiz){
  // querySelectorAll NO incluye al propio nodo, asi que si el que llega YA es una barra hay que
  // atenderlo aparte. Sin esto, una barra creada suelta (el modal de Evento, que se dibuja con un
  // innerHTML) no se envolvia ni recibia .abierta: quedaba plegada y sin animacion.
  const barras = [];
  if (raiz && raiz.nodeType === 1 && raiz.matches('.barra-extraible')) barras.push(raiz);
  (raiz || document).querySelectorAll('.barra-extraible').forEach(b => barras.push(b));
  barras.forEach(barra => {
    // el estado visible vive en la clase; open se deja puesto para que el detalle no se plegue solo
    if (barra.hasAttribute('open') && !barra.classList.contains('abierta')) barra.classList.add('abierta');
    barra.open = true;
    if (barra.querySelector(':scope > .cuerpo-env')) return;       // ya envuelto
    const cuerpo = barra.querySelector(':scope > .cuerpo');
    if (!cuerpo) return;
    const env = document.createElement('div');
    env.className = 'cuerpo-env';
    barra.insertBefore(env, cuerpo);
    env.appendChild(cuerpo);
  });
}
function inicializarBarras(){
  envolverCuerpoDeBarras(document);
  // Las barras que el JS dibuja despues (listas, el modal, la configuracion de la malla) tambien
  // se envuelven al aparecer. Se mira el nodo agregado y, si es una barra, el propio nodo:
  // querySelectorAll ya incluye al elemento mismo si coincide, asi que no hace falta subir al padre.
  new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(n => { if (n.nodeType === 1) { envolverCuerpoDeBarras(n); estilizarSelects(n); } });
    });
  }).observe(document.body, {childList: true, subtree: true});

  // alternar la clase; el details nunca se cierra, para que la animacion pueda correr entera
  document.addEventListener('click', ev => {
    const sum = ev.target.closest('.barra-extraible > summary');
    if (!sum) return;
    ev.preventDefault();
    sum.parentElement.classList.toggle('abierta');
  });
}

arranque();                      // se pinta al tiro con lo que haya guardado en este navegador
inicializarBarras();             // y las barras extraibles quedan animando en los dos sentidos
conectarServidor();              // y si esto viene del servidor local, manda lo suyo al responder
