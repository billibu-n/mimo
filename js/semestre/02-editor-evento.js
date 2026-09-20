/* ---------------------------------------------------------------- editor de tarea */
let editando = null;
function abrirEditor(id){
  editando = id;
  const ev = eventoPorId(id);
  if (!ev) return;
  const s = est(), pr = s.prioridades[id], f = s.fichas[id] || {};
  const esNueva = String(ev.id).startsWith('n');
  const notaEv = (est().notas_evento || {})[id];
  // Si el evento tiene ramo, la nota puede irse al promedio. La categoria se propone segun el tipo
  // de evento (un CONTROL cae en Controles, una TAREA en Tareas) y siempre se puede cambiar.
  const catsRamo = ev.ramo ? catsDe(ev.ramo) : [];
  let catSugerida = '';
  if (ev.ramo) {
    const prefiere = CAT_POR_TIPO[ev.tipo];
    catSugerida = (prefiere && catsRamo.some(c => c.nombre === prefiere)) ? prefiere
                : (catsRamo.length ? catsRamo[0].nombre : 'General');
    if (!catsRamo.some(c => c.nombre === catSugerida)) catsRamo.push({nombre:catSugerida, peso:1.0});
  }
  const opcionesCat = catsRamo.map(c => '<option' + (c.nombre === catSugerida ? ' selected' : '') + '>' +
    esc(c.nombre) + '</option>').join('');
  const bloqueNota = ev.ramo
    ? '<div class="campo"><span>Nota de este evento (1,0 a 7,0)</span>' +
      '<input type="number" id="m-nota" min="1" max="7" step="0.1" value="' +
      (notaEv === null || notaEv === undefined ? '' : notaEv) + '"></div>' +
      '<div class="fila" style="gap:6px;align-items:center"><select id="m-nota-cat">' + opcionesCat +
      '</select><button class="btn" id="m-nota-pasar">Pasar al promedio del ramo</button></div>' +
      '<p class="ayuda" id="m-nota-aviso">Se agrega como un componente con el nombre del evento. ' +
      'Si ya lo habias pasado, se actualiza en vez de repetirse.</p>'
    : '<p class="ayuda">Elige un ramo arriba y aqui aparece la nota, para pasarla al promedio.</p>';
  document.getElementById('modal-caja').innerHTML = `
    <button class="cerrar" id="cerrar">Cerrar</button>
    <h2>${esc(ev.texto)}</h2>
    <div class="sub">${esc(ev.dia)} ${esc(ev.fecha)} · ${esc(tiposDe()[ev.tipo] || ev.tipo)}${
      ev.ramo ? ' · ' + esc((cursoDe(ev.ramo) || {}).alias || ev.ramo) : ''}</div>
    <details class="barra-extraible" open>
      <summary><span class="izq">Qué es <span class="cuenta">prioridad, fecha y ramo</span></span>
        <span class="flecha">&#9654;</span></summary>
      <div class="cuerpo">
        <div class="campo"><span>Hecha</span>
          <input type="checkbox" id="m-hecha" ${s.hechas[id] ? 'checked' : ''} style="justify-self:end"></div>
        <div class="campo" style="display:block">
          <span style="display:block;margin-bottom:5px">Prioridad</span>
          <div class="prioridades">
            <button data-p="alta" class="${pr === 'alta' ? 'on' : ''}">Alta</button>
            <button data-p="media" class="${pr === 'media' ? 'on' : ''}">Media</button>
            <button data-p="baja" class="${pr === 'baja' ? 'on' : ''}">Baja</button>
            <button data-p="" class="${!pr ? 'on' : ''}">Sin prioridad</button>
          </div>
        </div>
        <div class="campo"><span>Fecha</span><input type="date" id="m-fecha" value="${ev.fecha}"></div>
        <div class="campo"><span>Ramo</span>
          <select id="m-ramo"><option value="">— Sin ramo —</option>${
            ramosH().map(r => '<option value="' + r.codigo + '"' + (ev.ramo === r.codigo ? ' selected' : '') +
              '>' + esc(r.alias) + '</option>').join('')}</select></div>
      </div>
    </details>
    <details class="barra-extraible">
      <summary><span class="izq">Cuándo <span class="cuenta">hora, duración y tipo</span></span>
        <span class="flecha">&#9654;</span></summary>
      <div class="cuerpo">
        <div class="campo"><span>Hora de inicio</span><input type="time" id="m-hora" value="${ev.hora || ''}"></div>
        <div class="campo"><span>Duración (horas)</span>
          <input type="number" id="m-dur" min="0" max="24" step="0.25" value="${ev.duracion || ''}" placeholder="ej. 3 para un control, 1 para una actividad"></div>
        <div class="campo"><span>Tipo de evento</span>
          <select id="m-tipo">${
            Object.keys(tiposDe()).map(t => '<option value="' + t + '"' + (ev.tipo === t ? ' selected' : '') +
              '>' + esc(tiposDe()[t]) + '</option>').join('')}</select></div>
        <div class="fila" style="gap:6px;align-items:center;margin-top:6px">
          <input type="text" id="m-tipo-texto" placeholder="otro tipo, ej: Laboratorio" style="flex:1">
          <button class="btn chico" id="m-tipo-crear">+ Crear tipo</button></div>
      </div>
    </details>
    <details class="barra-extraible">
      <summary><span class="izq">Nota y temario <span class="cuenta">opcional</span></span>
        <span class="flecha">&#9654;</span></summary>
      <div class="cuerpo">
        ${bloqueNota}
        <div style="margin-top:12px"><span style="font-size:.85rem">Descripción</span>
          <textarea id="m-desc" placeholder="Qué hay que hacer, con qué material, cómo se entrega">${esc(f.descripcion || '')}</textarea></div>
        <div style="margin-top:12px"><span style="font-size:.85rem">Temario</span>
          <textarea id="m-tema" placeholder="Los temas que entran, uno por línea">${esc(f.temario || '')}</textarea></div>
      </div>
    </details>
    <div class="fila" style="margin-top:14px;gap:8px">
      ${esNueva ? '<button class="btn peligro" id="borrar">Eliminar</button>' : ''}
      <button class="btn primario" id="guardar-ficha">Guardar</button>
    </div>`;
  document.getElementById('modal').classList.add('on');
  document.getElementById('cerrar').onclick = cerrarEditor;
  document.querySelectorAll('.prioridades button').forEach(b => b.onclick = () => {
    const p = b.dataset.p;
    if (p) s.prioridades[id] = p; else delete s.prioridades[id];
    guardar(); document.querySelectorAll('.prioridades button').forEach(x => x.classList.toggle('on', x === b));
    renderSemestre();
  });
  document.getElementById('m-hecha').onchange = e2 => {
    if (e2.target.checked) s.hechas[id] = true; else delete s.hechas[id];
    guardar(e2.target.checked ? 'Tarea marcada como hecha' : 'Tarea devuelta a pendientes');
    renderSemestre();
  };
  document.getElementById('m-fecha').onchange = e2 => {
    ev.fecha = e2.target.value; guardar(); renderSemestre();
  };
  document.getElementById('m-hora').onchange = e2 => {
    ev.hora = e2.target.value || null; guardar(); renderSemestre();
  };
  document.getElementById('m-dur').onchange = e2 => {
    const v = parseFloat(e2.target.value);
    ev.duracion = (v > 0) ? v : null; guardar(); renderSemestre();
  };
  // Cambiar ramo o tipo rehace el modal: el bloque de la nota depende de ambos.
  document.getElementById('m-ramo').onchange = e2 => {
    ev.ramo = e2.target.value || null; guardar(); renderSemestre(); abrirEditor(id);
  };
  document.getElementById('m-tipo').onchange = e2 => {
    ev.tipo = e2.target.value; guardar(); renderSemestre(); abrirEditor(id);
  };
  document.getElementById('m-tipo-crear').onclick = () => {
    const t = document.getElementById('m-tipo-texto').value.trim();
    if (!t) return;
    // El codigo interno se arma del nombre sin tildes ni espacios; si ya existe un tipo con ese
    // nombre, se reutiliza en vez de crear un gemelo.
    const limpio = t.toUpperCase();
    const existente = Object.keys(tiposDe()).filter(k => tiposDe()[k] === limpio)[0];
    const cod = existente || ('x' + t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '').slice(0, 16) + Object.keys(tiposDe()).length);
    if (!existente) { E.tipos = E.tipos || {}; E.tipos[cod] = limpio; }
    ev.tipo = cod;
    guardar('Tipo "' + limpio + '" listo'); renderSemestre(); pintarFiltros(); abrirEditor(id);
  };
  const inpNota = document.getElementById('m-nota');
  if (inpNota) inpNota.onchange = () => {
    const n = normalizarNota(inpNota.value);
    est().notas_evento = est().notas_evento || {};
    if (n === null) delete est().notas_evento[id]; else est().notas_evento[id] = n;
    guardar(); renderSemestre(); abrirEditor(id);
  };
  const bPasar = document.getElementById('m-nota-pasar');
  if (bPasar) bPasar.onclick = () => {
    const aviso = document.getElementById('m-nota-aviso');
    const cat = document.getElementById('m-nota-cat').value;
    const nota = (est().notas_evento || {})[id];
    if (nota === null || nota === undefined) {
      if (aviso) aviso.textContent = 'Primero escribe la nota de este evento, arriba.';
      return;
    }
    const cats = catsDe(ev.ramo);
    if (!cats.some(c => c.nombre === cat)) cats.push({nombre:cat, peso:1.0, color:colorLibre()});
    const cs = compsDe(ev.ramo);
    const ya = cs.filter(c => c.nombre === ev.texto)[0];
    if (ya) { ya.nota = nota; ya.categoria = cat; }
    else cs.push({nombre:ev.texto, categoria:cat, peso:1, nota:nota});
    guardar('Nota pasada al promedio de ' + aliasDe(ev.ramo));
    cerrarEditor(); renderTodo();
  };
  document.getElementById('guardar-ficha').onclick = () => {
    s.fichas[id] = {descripcion: document.getElementById('m-desc').value,
                    temario: document.getElementById('m-tema').value};
    guardar('Guardado'); cerrarEditor();
  };
  const b = document.getElementById('borrar');
  if (b) b.onclick = () => {
    est().nuevas = est().nuevas.filter(x => String(x.id) !== String(id));
    guardar('Tarea eliminada'); cerrarEditor(); renderSemestre();
  };
}
function cerrarEditor(){ document.getElementById('modal').classList.remove('on'); editando = null;
  const caja = document.getElementById('modal-caja'); if (caja) caja.className = 'modal-caja'; }
function nuevaTarea(){
  if (!exigirSemestre('Los eventos van dentro de un semestre: ahi tienen su calendario.')) return;
  const id = 'n' + Date.now();
  est().nuevas.push({id:id, semana:'—', dia:'Lunes', fecha:hoy(), texto:'Tarea nueva',
                     detalle:'', ramo:null, color_excel:null, tipo:'tarea'});
  guardar(); renderSemestre(); abrirEditor(id);
}
