/* ------------------------------------------------------------ ficha del ramo
   Lo que el estudiante quiere anotar de un ramo y tener a la vista: de que se trata, cuanto
   exige, como se evalua, quien lo hace, el horario de consulta... Lo que necesite.

   Los CAMPOS los define el usuario en Ajustes > Malla. Los tres de fabrica son una sugerencia
   para partir, no una jaula: se renombran, se borran y se agregan los que hagan falta.

   Se muestra en un panel a la IZQUIERDA de la malla, y solo cuando hay un ramo elegido. Es cosa
   aparte del arbol de prerrequisitos (que sigue debajo de la malla): uno dice de que depende el
   ramo y el otro dice que es el ramo. Son dos preguntas distintas.

   OJO al renombrar: cada campo tiene una 'clave' fija y una 'etiqueta' que se puede cambiar. La
   clave es la que guarda los valores, asi que renombrar la etiqueta NO pierde lo escrito.
*/
const FICHA_FABRICA = [
  {clave: 'descripcion', etiqueta: 'Descripción'},
  {clave: 'exigencia',   etiqueta: 'Exigencia'},
  {clave: 'evaluacion',  etiqueta: 'Evaluación'}
];
function ficha(){
  if (!E.ficha || typeof E.ficha !== 'object') E.ficha = {};
  const f = E.ficha;
  if (!Array.isArray(f.campos) || !f.campos.length) {
    f.campos = FICHA_FABRICA.map(c => ({clave: c.clave, etiqueta: c.etiqueta}));
  }
  if (!f.valores || typeof f.valores !== 'object') f.valores = {};
  if (f.visible === undefined) f.visible = true;
  return f;
}
function claveDeEtiqueta(txt, ocupadas){
  const base = sinTildes(txt).replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'campo';
  let k = base, i = 2;
  while (ocupadas.indexOf(k) >= 0) { k = base + '_' + i; i++; }
  return k;
}
function valorFicha(cod, clave){
  const v = (ficha().valores[cod] || {})[clave];
  return v === undefined || v === null ? '' : String(v);
}
function setValorFicha(cod, clave, valor){
  const f = ficha();
  const limpio = String(valor === undefined || valor === null ? '' : valor).trim();
  if (!limpio) {
    if (f.valores[cod]) {
      delete f.valores[cod][clave];
      if (!Object.keys(f.valores[cod]).length) delete f.valores[cod];
    }
    return;
  }
  f.valores[cod] = f.valores[cod] || {};
  f.valores[cod][clave] = limpio;
}
function cuantosFicha(cod){
  const v = ficha().valores[cod];
  return v ? Object.keys(v).length : 0;
}
function textoEstado(e){
  return e === 'aprobado' ? 'aprobado' : e === 'curso' ? 'en curso'
       : e === 'disponible' ? 'puedes tomarlo' : 'bloqueado';
}
function claseEstado(e){
  return e === 'aprobado' ? 'ok' : e === 'curso' ? 'warn' : e === 'disponible' ? 'n' : 'bad';
}

/* El panel de la izquierda. Si no hay ramo elegido queda vacio y no ocupa sitio. */
function renderFicha(){
  const z = document.getElementById('malla-ficha');
  if (!z) return;
  const f = ficha();
  document.body.classList.toggle('sin-ficha', !f.visible);
  if (!f.visible || !mallaSel || !CAT()[mallaSel]) {
    z.className = 'ficha-ramo';
    z.innerHTML = '';
    return;
  }
  const c = CAT()[mallaSel];
  const e = estados()[mallaSel] || 'bloqueado';
  const cuerpo = f.campos.map(campo => {
    const v = valorFicha(mallaSel, campo.clave);
    return '<div class="bloque"><h4>' + esc(campo.etiqueta) + '</h4>' +
      (v ? '<p class="ficha-texto">' + esc(v).replace(/\n/g, '<br>') + '</p>'
         : '<span class="vacio">Sin anotar todavía.</span>') + '</div>';
  }).join('');
  z.className = 'ficha-ramo on';
  z.innerHTML =
    '<div class="ficha-cab"><b class="mono">' + esc(mallaSel) + '</b>' +
      '<span class="pill ' + claseEstado(e) + '">' + textoEstado(e) + '</span></div>' +
    '<div class="sub">' + esc(c.nombre) + ' · ' +
      (c.creditos === null || c.creditos === undefined ? 'créditos sin dato' : c.creditos + ' créditos') +
      (esAnual(mallaSel) ? ' · ramo anual' : '') + '</div>' +
    cuerpo +
    '<button class="btn chico" id="ficha-editar">Editar la ficha</button>';
  document.getElementById('ficha-editar').onclick = () => modalFicha(mallaSel);
}

/* El cuadro para escribirla. Un campo de la ficha, un cuadro de texto. */
function modalFicha(cod){
  const campos = ficha().campos;
  document.getElementById('modal-caja').innerHTML =
    '<h2>Ficha de ' + esc(cod) + '</h2>' +
    '<button class="cerrar" id="cerrar">Cerrar</button>' +
    '<p class="ayuda">Lo que escribas aquí aparece en el panel de al lado de la malla cada vez ' +
      'que elijas este ramo. <b>Los campos se cambian en Ajustes › Malla.</b></p>' +
    (campos.length ? campos.map(campo =>
      '<div class="campo"><span>' + esc(campo.etiqueta) + '</span>' +
      '<textarea data-ficha="' + esc(campo.clave) + '" rows="2" style="width:100%">' +
      esc(valorFicha(cod, campo.clave)) + '</textarea></div>').join('')
      : '<p class="ayuda">No hay ningún campo definido. Agrégalos en Ajustes › Malla.</p>') +
    '<div class="fila" style="justify-content:flex-end;gap:8px;margin-top:12px">' +
      '<button class="btn" id="ficha-cancelar">Cancelar</button>' +
      '<button class="btn acento" id="ficha-guardar">Guardar</button>' +
    '</div>';
  document.getElementById('modal').classList.add('on');
  document.getElementById('cerrar').onclick = cerrarEditor;
  document.getElementById('ficha-cancelar').onclick = cerrarEditor;
  document.getElementById('ficha-guardar').onclick = () => {
    document.querySelectorAll('#modal-caja [data-ficha]').forEach(t => {
      setValorFicha(cod, t.dataset.ficha, t.value);
    });
    guardar('Ficha de ' + cod + ' guardada');
    cerrarEditor();
    renderMalla();
  };
}

