/* ------------------------------------------------------------------ ajustes */
function renderAjustes(){
  const s = est();
  renderAvanzado();
  // La configuracion de la malla (ficha y colores de los ramos) se mudo a la pestana Malla.

  // La meta base ya no se edita aqui: se mudo a la pestana Estudio, que es donde se usa.
  document.getElementById('aj-ver-hechas').checked = !!E.ajustes.verHechasPorHacer;

  // Formatos de hora: casillas, y cada una muestra al lado como se ve de verdad.
  const elegidos = E.ajustes.formatos || ['hm'];
  const listaFormatos = document.getElementById('formatos-hora');
  listaFormatos.innerHTML = FORMATOS_HORA.map(f =>
    '<label class="formato"><input type="checkbox" data-formato="' + f[0] + '"' +
      (elegidos.indexOf(f[0]) >= 0 ? ' checked' : '') + '>' +
      '<span class="nom">' + esc(f[1]) + '</span>' +
      '<span class="vale">' + esc(f[2]) + '</span></label>').join('') +
    '<div class="av-fila"><span class="eti">Cómo queda</span>' +
      '<b style="color:var(--fg)">' + esc(fmtHM(150)) + '</b>' +
      '<span class="pista">Así se escriben dos horas y media con lo que tienes encendido.</span></div>';
  // Cómo se abrevian los títulos que no caben.
  const listaTitulos = document.getElementById('titulos-modo');
  if (listaTitulos) {
    const ft = formatoTitulo();
    listaTitulos.innerHTML = FORMATOS_TITULO.map(x =>
      '<label class="formato"><input type="radio" name="titulo-modo" data-titulo="' + x[0] + '"' +
        (ft.modo === x[0] ? ' checked' : '') + '>' +
        '<span class="nom">' + esc(x[1]) + '</span>' +
        '<span class="vale">' + esc(x[2]) + '</span></label>').join('') +
      '<div class="av-fila"><span class="eti">Largo</span>' +
        '<input type="number" id="titulo-largo" min="4" max="40" step="1" value="' + ft.largo + '"' +
        (ft.modo === 'puntos' ? '' : ' disabled') + '>' +
        '<span class="pista">Letras que se ven antes de los puntos. Solo se usa al recortar.</span></div>' +
      '<div class="av-fila"><span class="eti">Cómo queda</span>' +
        '<b style="color:var(--fg)" id="titulo-ejemplo">' +
        esc(resumirTitulo('Mecánica de los Medios Continuos')) + '</b>' +
        '<span class="pista">Un nombre largo, con lo que acabas de elegir.</span></div>';
    listaTitulos.querySelectorAll('[data-titulo]').forEach(el => el.onchange = () => {
      E.ajustes.titulos = Object.assign({}, formatoTitulo(), {modo: el.dataset.titulo});
      guardar();
      renderAjustes();
      renderEstudio();
    });
    const largo = document.getElementById('titulo-largo');
    if (largo) largo.oninput = () => {
      E.ajustes.titulos = Object.assign({}, formatoTitulo(), {largo: Number(largo.value) || 12});
      guardar();
      renderEstudio();
      // La vista previa se refresca sin rehacer la tarjeta, para no perder el foco al escribir.
      const ej = document.getElementById('titulo-ejemplo');
      if (ej) ej.textContent = resumirTitulo('Mecánica de los Medios Continuos');
    };
  }

  listaFormatos.querySelectorAll('[data-formato]').forEach(el => el.onchange = () => {
    const marcas = [].slice.call(listaFormatos.querySelectorAll('[data-formato]'))
      .filter(i => i.checked).map(i => i.dataset.formato);
    // Dejar cero formatos encendidos dejaria las horas en blanco en todo el panel.
    if (!marcas.length) {
      el.checked = true;
      mostrarAviso('Deja al menos una forma de mostrar las horas');
      return;
    }
    E.ajustes.formatos = marcas;
    guardar('Forma de mostrar las horas cambiada'); renderTodo(); renderAjustes();
  });
  const son = document.getElementById('aj-sonido');
  son.checked = E.ajustes.sonido !== false;
  son.onchange = () => {
    E.ajustes.sonido = son.checked;
    guardar(son.checked ? 'Sonido del temporizador encendido' : 'Sonido del temporizador apagado');
    renderAjustes();
  };
  // Las explicaciones de cada ajuste se recogen en un boton "?".
  convertirPistas();

  document.getElementById('tabla-metas-ramo').innerHTML =
    '<thead><tr><th>Ramo</th><th>Nombre corto</th><th class="num">Horas por semana</th>' +
    '<th class="num">Nota objetivo</th><th>Estado</th></tr></thead><tbody>' +
    ramosBase().map(r => {
      const m = s.metas_ramo[r.codigo] || {horas:5.5, nota:5.0};
      const e = s.estado[r.codigo] || 'curso';
      return '<tr><td><i style="display:inline-block;width:10px;height:10px;border-radius:3px;' +
        'background:' + colorDe(r.codigo) + ';margin-right:7px"></i>' + r.codigo + '</td>' +
        '<td><input type="text" data-alias="' + r.codigo + '" value="' + esc(r.alias) + '"></td>' +
        '<td class="num"><input type="number" min="0" max="60" step="0.5" data-meta-h="' + r.codigo + '" value="' + m.horas + '"></td>' +
        '<td class="num"><input type="number" min="1" max="7" step="0.1" data-meta-n="' + r.codigo + '" value="' + m.nota + '"></td>' +
        '<td><select data-estado="' + r.codigo + '">' +
          ['curso','aprobado','congelado'].map(o => '<option value="' + o + '"' + (e === o ? ' selected' : '') + '>' +
            (o === 'curso' ? 'en curso' : o) + '</option>').join('') +
        '</select></td></tr>';
    }).join('') + '</tbody>';
  document.querySelectorAll('[data-alias]').forEach(el => el.onchange = () => {
    cursoDe(el.dataset.alias).alias = el.value; guardar(); renderTodo(); renderAjustes();
  });
  document.querySelectorAll('[data-meta-h]').forEach(el => el.oninput = () => {
    const c = el.dataset.metaH;
    est().metas_ramo[c] = est().metas_ramo[c] || {horas:5.5, nota:5.0};
    est().metas_ramo[c].horas = Number(el.value) || 0;
    guardar(); renderEstudio();
  });
  document.querySelectorAll('[data-meta-n]').forEach(el => {
    el.oninput = () => {
      const c = el.dataset.metaN;
      est().metas_ramo[c] = est().metas_ramo[c] || {horas:5.5, nota:5.0};
      est().metas_ramo[c].nota = normalizarNota(el.value) || 5;
      guardar(); renderLista(); renderDetalle();
    };
    // Al salir del campo se reescribe corregido: "22" queda a la vista como 2,2.
    el.onchange = () => { el.value = ver1(normalizarNota(el.value) || 5); };
  });
  document.querySelectorAll('[data-estado]').forEach(el => el.onchange = () => {
    est().estado[el.dataset.estado] = el.value; guardar(); renderLista(); renderDetalle();
  });

  document.getElementById('lista-semestres').innerHTML = semestres().map(sm => {
    const act = sm.id === E.activo;
    return '<details class="barra-extraible"' + (act ? ' open' : '') + '>' +
      '<summary><span class="izq">' + (act ? '<b>' : '') + esc(sm.nombre) + (act ? '</b>' : '') +
      ' <span class="cuenta">' + sm.semanas.length + ' semanas · ' + ramosDeSem(sm).length + ' ramos</span></span>' +
      '<span class="izq">' +
      (act ? '<span class="pill ok">activo</span>' : '<button class="btn" data-usar="' + sm.id + '">usar</button>') +
      (semestres().length > 1 ? ' <button class="btn peligro" data-borrar-sem="' + sm.id + '">eliminar</button>' : '') +
      '<span class="flecha">&#9654;</span></span></summary>' +
      '<div class="cuerpo">' +
        '<div class="campo"><span>Primer lunes de clases</span><span>' + esc(sm.inicio) + '</span></div>' +
        '<div class="campo"><span>Semanas</span><span>' + sm.semanas.length + '</span></div>' +
        '<div class="campo"><span>Ramos inscritos</span><span>' + ramosDeSem(sm).length + '</span></div>' +
      '</div></details>';
  }).join('');
  document.querySelectorAll('[data-usar]').forEach(el => el.onclick = () => cambiarSemestre(el.dataset.usar));
  document.querySelectorAll('[data-borrar-sem]').forEach(el => el.onclick = () => {
    if (!confirm('¿Eliminar este semestre y todo lo que tiene dentro?')) return;
    E.extras = (E.extras || []).filter(s => s.id !== el.dataset.borrarSem);
    delete E.sem[el.dataset.borrarSem];
    if (E.activo === el.dataset.borrarSem) {
      const q = semestres()[0];
      E.activo = q ? q.id : null;       // al borrar el ultimo puede quedar sin ninguno
    }
    guardar('Semestre eliminado'); resetFiltros(); arranque();
  });
  pintarBarraAjustes();
}


/* La seccion Ajustes > Malla: configurar los campos de la ficha del ramo.
   Los campos viven en ficha().campos (cada uno con 'clave' fija y 'etiqueta' editable). Renombrar
   cambia la etiqueta y NO pierde lo escrito, porque el valor se guarda por la CLAVE. */
function renderConfigMalla(){
  const caja = document.getElementById('aj-malla');
  if (!caja) return;
  const f = ficha();
  const campos = f.campos;

  const filas = campos.map((c, i) =>
    '<div class="ficha-campo" data-campo="' + esc(c.clave) + '">' +
      '<button class="btn chico" data-sube="' + i + '" title="Subir" ' + (i === 0 ? 'disabled' : '') + '>↑</button>' +
      '<input type="text" class="etiqueta-campo" value="' + esc(c.etiqueta) + '">' +
      '<button class="btn chico peligro" data-quita="' + esc(c.clave) + '" title="Quitar"' +
        (campos.length <= 1 ? ' disabled' : '') + '>×</button>' +
    '</div>').join('');

  caja.innerHTML =
    '<div class="ficha-lista">' + filas + '</div>' +
    '<div class="fila" style="gap:8px;margin-top:10px">' +
      '<input type="text" id="aj-ficha-nuevo" placeholder="Nuevo campo (ej. Profesor)">' +
      '<button class="btn acento" id="aj-ficha-agregar">Agregar campo</button>' +
    '</div>' +
    '<div class="fila" style="gap:8px;margin-top:8px">' +
      '<label class="campo" style="flex:1"><input type="checkbox" id="aj-ficha-visible"' +
        (f.visible ? ' checked' : '') + ' style="justify-self:end"> Mostrar la ficha junto a la malla</label>' +
      '<button class="btn" id="aj-ficha-fabrica">Volver a los de fábrica</button>' +
    '</div>';

  caja.querySelectorAll('[data-campo]').forEach(fila => {
    const clave = fila.dataset.campo;
    const inp = fila.querySelector('.etiqueta-campo');
    inp.onchange = () => {
      const campo = campos.find(c => c.clave === clave);
      if (!campo) return;
      const txt = inp.value.trim();
      campo.etiqueta = txt || campo.etiqueta;
      if (!txt) inp.value = campo.etiqueta;
      guardar('Campo de la ficha renombrado');
      renderConfigMalla(); renderMalla();
    };
  });

  caja.querySelectorAll('[data-sube]').forEach(b => b.onclick = () => {
    const i = Number(b.dataset.sube);
    if (i <= 0 || i >= campos.length) return;
    const tmp = campos[i - 1]; campos[i - 1] = campos[i]; campos[i] = tmp;
    guardar('Orden de la ficha cambiado'); renderConfigMalla(); renderMalla();
  });

  caja.querySelectorAll('[data-quita]').forEach(b => b.onclick = () => {
    if (campos.length <= 1) return;
    f.campos = campos.filter(c => c.clave !== b.dataset.quita);
    guardar('Campo de la ficha quitado'); renderConfigMalla(); renderMalla();
  });

  document.getElementById('aj-ficha-agregar').onclick = () => {
    const txt = document.getElementById('aj-ficha-nuevo').value.trim();
    if (!txt) { mostrarAviso('Escribe el nombre del campo primero'); return; }
    const ocupadas = campos.map(c => c.clave);
    const clave = claveDeEtiqueta(txt, ocupadas);
    f.campos = campos.concat([{clave: clave, etiqueta: txt}]);
    document.getElementById('aj-ficha-nuevo').value = '';
    guardar('Campo "' + txt + '" agregado a la ficha');
    renderConfigMalla(); renderMalla();
  };

  document.getElementById('aj-ficha-visible').onchange = ev => {
    f.visible = ev.target.checked;
    guardar(f.visible ? 'Ficha visible' : 'Ficha oculta');
    renderMalla();
  };

  document.getElementById('aj-ficha-fabrica').onclick = () => {
    f.campos = FICHA_FABRICA.map(c => ({clave: c.clave, etiqueta: c.etiqueta}));
    guardar('Ficha vuelta a los campos de fábrica'); renderConfigMalla(); renderMalla();
  };
}


/* Colores de los ramos (vive en la pestana Malla). Antes estaba en Ajustes; se mudo junto con
   la ficha porque ambos son configuracion de la malla, no del panel. */
function renderColoresMalla(){
  const caja = document.getElementById('colores');
  if (!caja) return;
  caja.innerHTML = ramosBase().map(r => {
    const hex = colorDe(r.codigo), hsl = hex2hsl(hex);
    const presets = ['#FF0000','#C00000','#EA580C','#A16207','#16A34A','#0E7490','#1D4ED8','#7C3AED','#0F172A']
      .map(p => '<button data-ramo="' + r.codigo + '" data-color="' + p + '" style="background:' + p + '"></button>').join('');
    return '<div class="color-fila">' +
      '<span class="nm"><i class="pt" style="background:' + hex + '"></i>' + esc(r.alias) + '</span>' +
      '<input class="tono" type="range" min="0" max="360" step="1" value="' + hsl.h + '" data-ramo="' + r.codigo + '">' +
      '<input class="muestra-color" type="color" value="' + hex + '" data-ramo="' + r.codigo + '">' +
      '<span class="atajos">' + presets + '</span></div>';
  }).join('');
  caja.querySelectorAll('.tono').forEach(el => {
    el.oninput = () => {
      abrirBorrador();
      coloresBorrador[el.dataset.ramo] = hsl2hex(Number(el.value), 72, 45);
      renderTodo(true);
      const m = caja.querySelector('.muestra-color[data-ramo="' + el.dataset.ramo + '"]');
      if (m) m.value = coloresBorrador[el.dataset.ramo];
    };
    el.onchange = () => { renderColoresMalla(); pintarBarraAjustes(); };
  });
  caja.querySelectorAll('.muestra-color').forEach(el => {
    el.oninput = () => {
      abrirBorrador(); coloresBorrador[el.dataset.ramo] = el.value; renderTodo(true);
    };
    el.onchange = () => { renderColoresMalla(); pintarBarraAjustes(); };
  });
  caja.querySelectorAll('.atajos button').forEach(el => el.onclick = () => {
    abrirBorrador();
    coloresBorrador[el.dataset.ramo] = el.dataset.color;
    renderColoresMalla(); renderTodo(true); pintarBarraAjustes();
  });
}
