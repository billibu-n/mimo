/* ------------------------------------------------------------- editor de ramos
   Es la pieza que permite armar la malla desde cero: sin esto, la version limpia tendria el
   catalogo vacio y no habria de donde sacar ramos. Con esto, el usuario crea cada ramo con
   su codigo, creditos, nivel y prerrequisitos, y puede corregir cualquiera si se equivoca. */
function modalRamo(cod){
  const c = cod ? CAT()[cod] : null;
  const reqs = ((c && c.requisitos) || []).concat((c && c.requisitos_o) || []);
  const otros = Object.keys(CAT()).filter(x => x !== cod).sort();
  const enUso = cod ? ramosBase().some(r => r.codigo === cod) : false;
  const opciones = otros.map(x => '<option value="' + esc(x) + '"' +
    (reqs.indexOf(x) >= 0 ? ' selected' : '') + '>' + esc(x) + ' · ' + esc(CAT()[x].nombre) + '</option>').join('');
  document.getElementById('modal-caja').className = 'modal-caja m-campo';
  document.getElementById('modal-caja').innerHTML =
    '<h2>' + (cod ? 'Editar el ramo ' + esc(cod) : 'Nuevo ramo') + '</h2>' +
    '<button class="cerrar" id="cerrar">Cerrar</button>' +
    '<p class="ayuda">Con esto armas tu malla: los ramos que crees aquí quedan disponibles para ' +
      'agregarlos al semestre desde la pestaña Malla.</p>' +
    '<div class="campo"><span>Código</span><input id="r-cod" value="' + esc(cod || '') + '"' +
      (cod ? ' readonly' : '') + ' placeholder="MA1001" autocomplete="off"></div>' +
    '<div class="campo"><span>Nombre</span><input id="r-nombre" value="' +
      esc((c && c.nombre) || '') + '" placeholder="Cálculo Diferencial e Integral" autocomplete="off"></div>' +
    '<div class="campo"><span>Créditos</span><input id="r-cred" type="number" min="0" max="40" step="1" value="' +
      ((c && c.creditos) || 0) + '"></div>' +
    '<div class="campo"><span>Nivel (en qué semestre de la carrera va)</span>' +
      '<input id="r-nivel" type="number" min="1" max="20" step="1" value="' + ((c && c.nivel) || 1) + '"></div>' +
    '<div class="campo"><span>Tasa de aprobación (%)</span>' +
      '<input id="r-aprob" type="number" min="0" max="100" step="1" placeholder="opcional" value="' +
      ((c && c.aprobacion !== null && c.aprobacion !== undefined) ? c.aprobacion : '') + '"></div>' +
    '<div class="campo"><span>Dificultad</span>' +
      '<input id="r-dific" placeholder="opcional, ej. baja / media / alta" value="' +
      esc((c && c.dificultad) || '') + '"></div>' +
    '<div class="campo"><span>Prioridad</span>' +
      '<input id="r-prior" placeholder="opcional, ej. alta / media / baja o un número" value="' +
      esc((c && c.prioridad) || '') + '"></div>' +
    '<div class="campo"><span>Descripción</span>' +
      '<textarea id="r-desc" rows="2" placeholder="opcional: de qué trata el ramo" style="width:100%">' +
      esc((c && c.descripcion) || '') + '</textarea></div>' +
    '<div class="campo"><span>Ramo equivalente (otro código que es el mismo ramo)</span>' +
      '<input id="r-equi" placeholder="opcional, ej. MA3701" value="' +
      esc((c && c.equivalente) || '') + '"></div>' +
    '<div class="campo"><label class="llave"><input type="checkbox" id="r-anual"' +
      ((c && c.anual) ? ' checked' : '') + '> Ramo anual: se cursa en dos semestres seguidos</label>' +
      '<div class="pista">Se dibuja como un recuadro que ocupa su semestre y el siguiente, y la ' +
      'columna de al lado le deja el espacio libre. Es lo que pasa con los ramos anuales de ' +
      'especialidad.</div></div>' +
    '<div class="campo"><span>Prerrequisitos (con Ctrl o Cmd eliges varios)</span>' +
      '<select id="r-req" multiple size="6">' + opciones + '</select></div>' +
    '<div id="r-error" class="ayuda" style="color:var(--bad)"></div>' +
    '<div class="fila" style="justify-content:flex-end;gap:8px;margin-top:12px">' +
      (enUso ? '<button class="btn peligro" id="r-quitar">Quitar del semestre</button>' : '') +
      (cod && CAT()[cod] && E.catalogo && E.catalogo[cod]
        ? '<button class="btn peligro" id="r-borrar">Borrar el ramo</button>' : '') +
      '<button class="btn" id="r-cancelar">Cancelar</button>' +
      '<button class="btn acento" id="r-guardar">Guardar</button>' +
    '</div>';
  document.getElementById('modal').classList.add('on');
  document.getElementById('cerrar').onclick = cerrarEditor;
  document.getElementById('r-cancelar').onclick = cerrarEditor;
  const err = m => { document.getElementById('r-error').textContent = m; };

  document.getElementById('r-guardar').onclick = () => {
    const nuevo = !cod;
    const clave = (cod || document.getElementById('r-cod').value || '').trim().toUpperCase();
    const nombre = document.getElementById('r-nombre').value.trim();
    const nivel = Math.max(1, parseInt(document.getElementById('r-nivel').value, 10) || 1);
    const cred = Math.max(0, parseInt(document.getElementById('r-cred').value, 10) || 0);
    if (!clave) return err('Falta el código del ramo.');
    if (!nombre) return err('Falta el nombre del ramo.');
    if (nuevo && CAT()[clave]) return err('Ya existe un ramo con el código ' + clave + '.');
    const elegidos = [].slice.call(document.getElementById('r-req').selectedOptions)
      .map(o => o.value).filter(x => x !== clave);
    const aprob = document.getElementById('r-aprob').value.trim();
    const dific = document.getElementById('r-dific').value.trim();
    const prior = document.getElementById('r-prior').value.trim();
    const desc = document.getElementById('r-desc').value.trim();
    const equi = document.getElementById('r-equi').value.trim();
    // Los campos opcionales entran solo si el alumno escribio algo: vacio = sin dato (null).
    const datos = {nombre: nombre, creditos: cred, nivel: nivel,
                   requisitos: elegidos, requisitos_o: [],
                   anual: document.getElementById('r-anual').checked};
    if (aprob !== '') datos.aprobacion = Math.max(0, Math.min(100, parseInt(aprob, 10) || 0));
    if (dific) datos.dificultad = dific;
    if (prior) datos.prioridad = prior;
    if (desc) datos.descripcion = desc;
    if (equi) datos.equivalente = equi.toUpperCase();
    ramoEnCatalogo(clave, datos);
    guardar('Ramo ' + clave + (nuevo ? ' creado' : ' actualizado'));
    cerrarEditor(); resetFiltros(); arranque();
  };
  const bB = document.getElementById('r-borrar');
  if (bB) bB.onclick = () => {
    if (!confirm('¿Borrar ' + cod + ' de tu malla? Los ramos que lo tenían de prerrequisito se quedan sin él.')) return;
    borrarRamo(cod);
    guardar('Ramo ' + cod + ' borrado'); cerrarEditor(); resetFiltros(); arranque();
  };
  const bQ = document.getElementById('r-quitar');
  if (bQ) bQ.onclick = () => { quitarRamo(cod); cerrarEditor(); };
}
function modalNuevoSemestre(){
  memoEstados = null;
  const e = calcularEstados();
  const rango = {disponible:0, curso:1, bloqueado:2, aprobado:3};
  const orden = Object.keys(CAT()).sort((a, b) => {
    const ra = rango[e[a]] - rango[e[b]];
    if (ra) return ra;
    return (CAT()[a].semestre_num || 99) - (CAT()[b].semestre_num || 99) || a.localeCompare(b);
  });
  const lista = orden.filter(cod => CAT()[cod].tipo !== 'cupo').map(cod => {
    const c = CAT()[cod], ec = e[cod];
    const ya = ec === 'aprobado', cursando = ec === 'curso';
    const faltan = requisitosFaltantes(cod);
    const nota = ya ? 'ya aprobado' : cursando ? 'lo estás cursando' : faltan.length
      ? 'le falta' + (faltan.length > 1 ? 'n' : '') + ' ' + faltan.join(', ') : 'ya puedes tomarlo';
    return '<label class="opcion" data-estado="' + ec + '">' +
      '<input type="checkbox" data-ramo="' + cod + '"' + (ya || cursando ? ' disabled' : '') + '>' +
      '<span class="mono">' + cod + '</span><span class="nm2">' + esc(c.nombre) + '</span>' +
      '<span class="sm">' + (c.semestre ? 'Semestre ' + c.semestre : 'electivo') + ' · ' +
      (c.creditos === null ? 'créditos sin dato' : c.creditos + ' cr') + ' · ' + esc(nota) + '</span></label>';
  }).join('');
  document.getElementById('modal-caja').innerHTML = `
    <button class="cerrar" id="cerrar">Cerrar</button>
    <h2>Semestre nuevo</h2>
    <div class="sub">Se genera el calendario de semanas y eliges los ramos. Después puedes cambiarlo todo.</div>
    <div class="campo"><span>Nombre</span><input type="text" id="ns-nombre" value="Semestre nuevo"></div>
    <div class="campo"><span>Primer lunes de clases</span><input type="date" id="ns-inicio" value="${hoy()}"></div>
    <div class="campo"><span>Semanas de clases</span><input type="number" id="ns-clases" min="1" max="25" value="15"></div>
    <div class="campo"><span>Recesos tras las semanas (separados por coma)</span>
      <input type="text" id="ns-recesos" value="6, 11"></div>
    <div class="campo"><span>Semanas de examen, al final</span><input type="number" id="ns-examen" min="0" max="8" value="3"></div>
    <h4 style="margin:18px 0 6px;font-size:.86rem;text-transform:uppercase;color:var(--muted2)">Ramos del semestre</h4>
    <input type="text" id="ns-buscar" placeholder="Buscar por código o nombre" style="width:100%;padding:6px 9px;
           border:1px solid var(--line);border-radius:8px;font:inherit;margin-bottom:8px">
    <div class="fila" style="gap:8px;margin-bottom:8px;flex-wrap:wrap">
      <button class="mini" id="ns-sugeridos">Marcar los que ya puedes tomar</button>
      <button class="mini" id="ns-disponibles">Ver solo los disponibles</button>
      <button class="mini" id="ns-limpiar">Desmarcar todo</button>
    </div>
    <div class="lista-ramos" id="ns-lista">${lista}</div>
    <div class="fila" style="margin-top:14px;gap:8px">
      <button class="btn primario" id="ns-crear">Crear semestre</button>
    </div>`;
  document.getElementById('modal').classList.add('on');
  document.getElementById('cerrar').onclick = cerrarEditor;
  document.getElementById('ns-sugeridos').onclick = () => {
    document.querySelectorAll('#ns-lista .opcion').forEach(op => {
      const i = op.querySelector('input');
      if (i.disabled) return;
      if (op.dataset.estado === 'disponible') i.checked = true;
    });
  };
  document.getElementById('ns-disponibles').onclick = ev2 => {
    // el primer clic filtra; el segundo vuelve a mostrar todo
    const solo = ev2.target.dataset.solo !== '1';
    ev2.target.dataset.solo = solo ? '1' : '0';
    ev2.target.textContent = solo ? 'Ver todos' : 'Ver solo los disponibles';
    document.querySelectorAll('#ns-lista .opcion').forEach(op => {
      op.style.display = (!solo || op.dataset.estado === 'disponible') ? '' : 'none';
    });
  };
  document.getElementById('ns-limpiar').onclick = () => {
    document.querySelectorAll('#ns-lista input').forEach(i => { if (!i.disabled) i.checked = false; });
  };
  document.getElementById('ns-buscar').oninput = ev => {
    const q = sinTildes(ev.target.value);
    document.querySelectorAll('#ns-lista .opcion').forEach(el => {
      el.style.display = sinTildes(el.textContent).includes(q) ? '' : 'none';
    });
  };
  document.getElementById('ns-crear').onclick = () => {
    const nombre = document.getElementById('ns-nombre').value.trim() || 'Semestre nuevo';
    const inicio = document.getElementById('ns-inicio').value;
    const nClases = Math.max(1, Number(document.getElementById('ns-clases').value) || 15);
    const recesos = (document.getElementById('ns-recesos').value || '').split(',')
      .map(x => parseInt(x.trim(), 10)).filter(x => x > 0);
    const nExamen = Math.max(0, Number(document.getElementById('ns-examen').value) || 0);
    // OJO: [].concat(nodeList) mete la lista entera como un solo elemento; hay que recorrerla.
    const marcados = document.querySelectorAll('#ns-lista input:checked');
    const codigos = Array.prototype.map.call(marcados, i => i.dataset.ramo);
    if (!inicio) { alert('Falta el primer lunes de clases.'); return; }
    // En la version limpia el catalogo puede estar vacio: ahi no hay nada que elegir y el
    // semestre se crea igual, para ir agregando los ramos despues desde la Malla.
    if (!codigos.length && Object.keys(CAT()).length) { alert('Elige al menos un ramo.'); return; }
    const id = 's' + Date.now();
    const sem = {id:id, nombre:nombre, inicio:inicio, semanas:[], ramos:[], eventos:[], semanas_estudio:[]};
    let cursor = inicio;
    for (let i = 1; i <= nClases; i++) {
      const w = {etiqueta:'S' + i, lunes:cursor, domingo:sumaDias(cursor, 6), tipo:'clases'};
      sem.semanas.push(w); cursor = sumaDias(cursor, 7);
      if (recesos.indexOf(i) >= 0) {
        sem.semanas.push({etiqueta:'Receso', lunes:cursor, domingo:sumaDias(cursor, 6), tipo:'receso'});
        cursor = sumaDias(cursor, 7);
      }
    }
    for (let i = 1; i <= nExamen; i++) {
      sem.semanas.push({etiqueta:'Examen ' + i, lunes:cursor, domingo:sumaDias(cursor, 6), tipo:'examen'});
      cursor = sumaDias(cursor, 7);
    }
    const usados = {};
    codigos.forEach(cod => {
      const c = CAT()[cod];
      let alias = c.nombre.split(' ').slice(0, 2).join(' ');
      if (usados[alias]) alias += ' ' + cod.slice(-2);
      usados[alias] = true;
      sem.ramos.push({
        codigo:cod, alias:alias, nombre:c.nombre, creditos:c.creditos,
        color:['#2563EB','#16A34A','#B45309','#7C3AED','#0E7490','#DC2626'][sem.ramos.length % 6],
        categorias:[{nombre:'Controles', peso:1.0}],
        componentes:[],
        examen:{activo:true, peso:0.4, reemplaza:null},
        eximicion:{activa:false, modo:'todas', condiciones:[]}
      });
    });
    E.extras = (E.extras || []).concat([sem]);
    E.sem[id] = estadoSemestre(sem);
    E.activo = id;
    guardar('Semestre "' + nombre + '" creado');
    cerrarEditor(); resetFiltros(); arranque();
  };
}
function renderSemActivo(){
  const sel = document.getElementById('sem-activo');
  sel.innerHTML = semestres().map(s => '<option value="' + s.id + '"' + (s.id === E.activo ? ' selected' : '') + '>' +
    esc(s.nombre) + '</option>').join('');
  sel.onchange = () => cambiarSemestre(sel.value);
}


/* ---------------- reordenar la malla: mover ramos de nivel y reordenar columnas ----------------
   El usuario NO confia en el orden que vino del archivo: por eso aqui puede corregirlo el mismo.
   Dos cosas: (1) mover un ramo a otro nivel cambiando su 'nivel', y (2) reordenar las columnas
   moviendo los niveles completos. Ambas se guardan y la malla se redibuja al instante. */
function modalReordenarMalla(){
  const c = CAT();
  if (!Object.keys(c).length) { mostrarAviso('Aun no hay ramos que ordenar.'); return; }
  const e = estados();

  // ---- seccion 1: reordenar columnas (niveles) ----
  const columnas = NIVELES();
  const colHTML = columnas.map((n, i) => {
    const titulo = n.titulo || (n.nivel === 99 ? 'Electivos' : 'Nivel ' + n.nivel);
    return '<div class="fila-ord"><span class="mono">' + esc(titulo) + '</span>' +
      '<span class="sm">' + n.ramos.length + ' ramos</span>' +
      '<span class="ord-acciones">' +
        '<button class="btn chico" data-col-up="' + i + '"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
        '<button class="btn chico" data-col-down="' + i + '"' + (i === columnas.length - 1 ? ' disabled' : '') + '>↓</button>' +
      '</span></div>';
  }).join('');

  // ---- seccion 2: mover ramos de nivel ----
  const ramosOrd = Object.keys(c).filter(k => c[k].tipo !== 'cupo').sort();
  const ramosHTML = ramosOrd.map(k => {
    const nivel = (c[k].nivel > 0 && c[k].nivel < 99) ? c[k].nivel : 99;
    const estado = e[k] || 'bloqueado';
    return '<div class="fila-ord"><span class="mono">' + esc(k) + '</span>' +
      '<span class="nm2">' + esc(c[k].nombre) + '</span>' +
      '<span class="pill ' + (estado === 'aprobado' ? 'ok' : estado === 'curso' ? 'warn' : estado === 'disponible' ? 'n' : 'bad') + '">' +
        (nivel === 99 ? 'electivo' : 'Nivel ' + nivel) + '</span>' +
      '<span class="ord-acciones">' +
        '<button class="btn chico" data-r-up="' + k + '">↑</button>' +
        '<button class="btn chico" data-r-down="' + k + '">↓</button>' +
      '</span></div>';
  }).join('');

  document.getElementById('modal-caja').innerHTML = `
    <button class="cerrar" id="cerrar">Cerrar</button>
    <h2>Reordenar la malla</h2>
    <div class="sub">Mueve un ramo a otro nivel, o reordena las columnas enteras. Los cambios se guardan
      enseguida y la malla se dibuja de nuevo. Los electivos van aparte, a la derecha (nivel 99).</div>

    <h4 style="margin:16px 0 6px;font-size:.84rem;text-transform:uppercase;color:var(--muted2)">Reordenar columnas (niveles)</h4>
    <div class="lista-ord">${colHTML}</div>

    <h4 style="margin:18px 0 6px;font-size:.84rem;text-transform:uppercase;color:var(--muted2)">Mover ramos de nivel</h4>
    <div class="lista-ord" id="lista-ramos-ord">${ramosHTML}</div>

    <div class="fila" style="margin-top:14px;gap:8px;justify-content:flex-end">
      <button class="btn" id="ord-volver-auto">Volver al orden del archivo</button>
    </div>`;
  document.getElementById('modal').classList.add('on');
  document.getElementById('cerrar').onclick = cerrarEditor;

  // --- reordenar columnas: mueve un nivel en E.ordenNiveles ---
  const moverColumna = (desde, a) => {
    const cols = NIVELES().map(n => Number(n.nivel));
    if (a < 0 || a >= cols.length) return;
    const actual = (E.ordenNiveles && E.ordenNiveles.length === cols.length) ? E.ordenNiveles.slice() : cols.slice();
    const tmp = actual[desde]; actual[desde] = actual[a]; actual[a] = tmp;
    E.ordenNiveles = actual;
    guardar('Columnas reordenadas'); cerrarEditor(); resetFiltros(); arranque();
  };
  document.querySelectorAll('[data-col-up]').forEach(b => b.onclick = () => {
    const i = Number(b.dataset.colUp); moverColumna(i, i - 1);
  });
  document.querySelectorAll('[data-col-down]').forEach(b => b.onclick = () => {
    const i = Number(b.dataset.colDown); moverColumna(i, i + 1);
  });

  // --- mover un ramo de nivel (cambia su 'nivel', que es lo que decide la columna) ---
  const moverRamo = (cod, delta) => {
    const nivelActual = (c[cod].nivel > 0 && c[cod].nivel < 99) ? Number(c[cod].nivel) : 99;
    let nuevo = nivelActual + delta;
    if (nuevo < 1) nuevo = 1;
    if (nuevo > 20) nuevo = 20;
    ramoEnCatalogo(cod, {nivel: nuevo, semestre_num: nuevo, semestre: nuevo === 99 ? null : String(nuevo)});
    guardar(cod + ' movido al nivel ' + nuevo);
    cerrarEditor(); resetFiltros(); arranque();
  };
  document.querySelectorAll('[data-r-up]').forEach(b => b.onclick = () => moverRamo(b.dataset.rUp, -1));
  document.querySelectorAll('[data-r-down]').forEach(b => b.onclick = () => moverRamo(b.dataset.rDown, 1));

  document.getElementById('ord-volver-auto').onclick = () => {
    delete E.ordenNiveles;
    guardar('Orden de malla restaurado'); cerrarEditor(); resetFiltros(); arranque();
  };
}
