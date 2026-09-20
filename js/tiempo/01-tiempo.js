/* ---------------------------------------------------------------- tiempo */
// Los 7 dias de la semana seleccionada (lunes..domingo), como fechas ISO.
function diasDeLaSemana(lunes){
  const out = [];
  for (let k = 0; k < 7; k++) out.push(sumaDias(lunes, k));
  return out;
}
// Las sesiones que caen dentro de la semana seleccionada, ordenadas por fecha y hora.
function sesionesDeLaSemana(lunes){
  const dias = diasDeLaSemana(lunes);
  return est().sesiones
    .filter(s => dias.includes(s.fecha))
    .sort((a, b) => a.fecha === b.fecha ? (a.hora || '').localeCompare(b.hora || '') : a.fecha.localeCompare(b.fecha));
}
// Nombre legible de un dia de la semana (lunes..domingo -> "Lunes 21 de Septiembre").
const NOMBRES_DIA = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
function etiquetaDia(fecha){
  const d = aFecha(fecha);
  return NOMBRES_DIA[(d.getDay() + 6) % 7] + ' ' + d.getDate() + ' ' + MESES[d.getMonth()];
}
// El tiempo "actual" del modo activo, en milisegundos. Para el cronometro es lo acumulado (sube);
// para el temporizador es lo que queda por correr (baja). Cada uno usa SU estado, no se pisan.
function tiempoActualMs(){
  const t = E.tiempo;
  if (t.modo === 'temporizador'){
    const tp = t.temp || (t.temp = {objetivo:25, restante:null, corriendo:false, inicio:null});
    const base = tp.restante != null ? tp.restante : (tp.objetivo || 25) * 60000;
    return Math.max(0, base - (tp.corriendo && tp.inicio ? Date.now() - tp.inicio : 0));
  }
  const c = t.crono || (t.crono = {acumulado:0, corriendo:false, inicio:null});
  return (c.acumulado || 0) + (c.corriendo && c.inicio ? Date.now() - c.inicio : 0);
}
function estaCorriendo(){
  const t = E.tiempo;
  if (t.modo === 'temporizador') return !!(t.temp && t.temp.corriendo);
  return !!(t.crono && t.crono.corriendo);
}
function renderTiempo(){
  const t = E.tiempo;
  const ms = tiempoActualMs();
  const reloj = document.getElementById('reloj');
  document.querySelectorAll('.modo').forEach(b => b.classList.toggle('on', b.dataset.modo === t.modo));
  pintarReloj();
  const obj = document.getElementById('crono-objetivo');
  const objetivo = (t.temp && t.temp.objetivo) || 25;
  if (obj && Number(obj.value) !== objetivo) obj.value = objetivo;
  document.getElementById('crono-extra').innerHTML = t.modo === 'temporizador'
    ? '<div class="destino">Cuenta atrás desde ' + objetivo + ' minutos. Al llegar a cero se detiene sola.</div>'
    : '';
  document.getElementById('crono-play').textContent = estaCorriendo() ? 'Pausar' : (ms > 0 ? 'Seguir' : 'Iniciar');
  const ramoSel = document.getElementById('crono-ramo'), semSel = document.getElementById('crono-semana'),
        diaSel = document.getElementById('crono-dia');
  const ramos = ramosH();
  if (ramoSel.options.length !== ramos.length) {
    ramoSel.innerHTML = ramos.map(r => '<option value="' + r.codigo + '">' + esc(r.alias) + '</option>').join('');
  }
  t.ramo = t.ramo && ramos.some(r => r.codigo === t.ramo) ? t.ramo : ramos[0].codigo;
  ramoSel.value = t.ramo;
  const semanas = semActivo().semanas;
  if (semSel.options.length !== semanas.length) {
    semSel.innerHTML = semanas.map(w => '<option value="' + w.lunes + '">' + esc(w.etiqueta) + ' · ' +
      rangoSemana(w.lunes) + '</option>').join('');
  }
  t.semana = t.semana && semanas.some(w => w.lunes === t.semana) ? t.semana : semanaDe(hoy());
  semSel.value = t.semana;
  // Sin semestre no hay semanas ni dias que elegir: se deja el hueco vacio y se avisa, sin romper.
  if (!semanas.length || !t.semana) {
    if (diaSel.options.length !== 0) diaSel.innerHTML = '';
    document.getElementById('lista-sesiones').innerHTML =
      '<p class="ayuda">Crea un semestre para empezar a registrar tus sesiones.</p>';
    return;
  }
  // Los 7 dias de la semana elegida, para el selector de dia y para agrupar las sesiones.
  const dias = diasDeLaSemana(t.semana);
  if (diaSel.options.length !== dias.length) {
    diaSel.innerHTML = dias.map(f => '<option value="' + f + '">' + esc(etiquetaDia(f)) + '</option>').join('');
  }
  // El dia por defecto es HOY si cae dentro de la semana; si no, el lunes.
  t.dia = t.dia && dias.includes(t.dia) ? t.dia : (dias.includes(hoy()) ? hoy() : dias[0]);
  diaSel.value = t.dia;

  // Sesiones de la semana, agrupadas por dia, cada dia con su total.
  const lista = sesionesDeLaSemana(t.semana);
  let html = '';
  let diaActual = null, totDia = 0;
  lista.forEach(x => {
    if (x.fecha !== diaActual) {
      if (diaActual !== null) html += '<div class="sesion total"><span><b>Total ' + etiquetaDia(diaActual) +
        '</b></span><span class="h">' + fmtHM(totDia) + '</span></div>';
      diaActual = x.fecha; totDia = 0;
      html += '<div class="dia-titulo">' + esc(etiquetaDia(x.fecha)) + '</div>';
    }
    totDia += x.minutos;
    html += '<div class="sesion"><span>' + (x.hora ? x.hora + ' · ' : '') + esc(aliasDe(x.ramo)) + '</span>' +
      '<span class="h">' + x.minutos + ' min <button class="quitar" data-sesion="' + x.id + '" style="margin-left:6px">×</button></span></div>';
  });
  if (diaActual !== null) html += '<div class="sesion total"><span><b>Total ' + etiquetaDia(diaActual) +
    '</b></span><span class="h">' + fmtHM(totDia) + '</span></div>';
  document.getElementById('lista-sesiones').innerHTML = html ||
    '<p class="ayuda">Todavía no registras sesiones en esta semana.</p>';
  document.querySelectorAll('[data-sesion]').forEach(el => el.onclick = () => {
    const s = est();
    const i = s.sesiones.findIndex(x => String(x.id) === el.dataset.sesion);
    if (i < 0) return;
    const x = s.sesiones[i];
    if (s.minutos[x.lunes] && s.minutos[x.lunes][x.ramo] !== undefined)
      s.minutos[x.lunes][x.ramo] = Math.max(0, s.minutos[x.lunes][x.ramo] - x.minutos);
    s.sesiones.splice(i, 1);
    guardar('Sesión deshecha'); renderTodo(); renderTiempo();
  });
}
function aliasDe(cod){
  const r = ramosH().find(x => x.codigo === cod);
  return r ? r.alias : cod;
}
function cronoPlay(){
  const t = E.tiempo;
  if (t.modo === 'temporizador'){
    const tp = t.temp;
    if (tp.corriendo) {
      // pausa: congela lo que queda
      tp.restante = tiempoActualMs();
      tp.corriendo = false; tp.inicio = null;
    } else {
      // si no hay restante guardado (recien iniciado o llego a cero), parte del objetivo
      if (tp.restante == null || tp.restante <= 0) tp.restante = (tp.objetivo || 25) * 60000;
      tp.corriendo = true; tp.inicio = Date.now();
    }
  } else {
    const c = t.crono;
    if (c.corriendo) {
      c.acumulado = tiempoActualMs();
      c.corriendo = false; c.inicio = null;
    } else {
      c.corriendo = true; c.inicio = Date.now();
    }
  }
  guardar(); renderTiempo();
}
function cronoCero(){
  const t = E.tiempo;
  if (t.modo === 'temporizador'){
    t.temp.restante = (t.temp.objetivo || 25) * 60000;
    t.temp.corriendo = false; t.temp.inicio = null;
  } else {
    t.crono.acumulado = 0;
    t.crono.inicio = t.crono.corriendo ? Date.now() : null;
  }
  guardar(); renderTiempo();
}
function cronoRegistrar(){
  const t = E.tiempo;
  // El cronometro es el que mide estudio. El temporizador tambien puede registrar: lo que
  // transcurrio desde su objetivo es el tiempo dedicado. Se registra lo que efectivamente corrio.
  let min;
  if (t.modo === 'temporizador'){
    const tp = t.temp;
    const transcurrido = (tp.objetivo || 25) * 60000 - tiempoActualMs();
    min = Math.round(transcurrido / 60000);
  } else {
    min = Math.round(tiempoActualMs() / 60000);
  }
  if (min < 1) { mostrarAviso('Menos de un minuto: no hay nada que registrar'); return; }
  const s = est();
  s.minutos[t.semana] = s.minutos[t.semana] || {};
  s.minutos[t.semana][t.ramo] = (Number(s.minutos[t.semana][t.ramo]) || 0) + min;
  const d = new Date();
  s.sesiones.push({id:'s' + Date.now(), fecha:t.dia || hoy(), lunes:t.semana, ramo:t.ramo, minutos:min,
                   hora:dos(d.getHours()) + ':' + dos(d.getMinutes())});
  cronoCero();
  guardar('Registrados ' + min + ' min en ' + aliasDe(t.ramo));
  renderTodo(); renderTiempo();
}
function pintarReloj(){
  const t = E.tiempo;
  const ms = tiempoActualMs();
  const reloj = document.getElementById('reloj');
  if (!reloj) return;
  // Reloj editable: se ve como texto, pero cada parte (hh, mm, ss) es un input.
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const seg = Math.floor((ms % 60000) / 1000);
  if (document.activeElement && document.activeElement.classList &&
      document.activeElement.classList.contains('rlj')) return;   // no pisar al que edita
  reloj.innerHTML = '<input type="number" class="rlj" data-parte="h" min="0" max="99" value="' + dos(h) + '">' +
    ':' + '<input type="number" class="rlj" data-parte="m" min="0" max="59" value="' + dos(m) + '">' +
    ':' + '<input type="number" class="rlj" data-parte="s" min="0" max="59" value="' + dos(seg) + '">';
  reloj.className = 'reloj' + (estaCorriendo() ? ' corriendo' : '') +
                     (t.modo === 'temporizador' ? ' modo-temporizador' : '');
  reloj.querySelectorAll('.rlj').forEach(inp => inp.onchange = () => {
    const hh = parseInt(reloj.querySelector('[data-parte=h]').value || '0', 10) || 0;
    const mm = parseInt(reloj.querySelector('[data-parte=m]').value || '0', 10) || 0;
    const ss = parseInt(reloj.querySelector('[data-parte=s]').value || '0', 10) || 0;
    const nuevoMs = (hh * 3600 + mm * 60 + ss) * 1000;
    // En temporizador, lo que se edita es el tiempo QUE QUEDA; en cronometro, el acumulado.
    if (t.modo === 'temporizador') {
      t.temp.objetivo = Math.max(1, Math.round(nuevoMs / 60000));   // el objetivo en minutos
      t.temp.restante = nuevoMs;
      t.temp.corriendo = false; t.temp.inicio = null;
      const obj = document.getElementById('crono-objetivo');
      if (obj) obj.value = t.temp.objetivo;
    } else {
      t.crono.acumulado = nuevoMs;
      t.crono.inicio = t.crono.corriendo ? Date.now() : null;
    }
    guardar('Tiempo ajustado a mano'); renderTiempo(); renderTodo();
  });
  const b = document.getElementById('crono-play');
  if (b) b.textContent = estaCorriendo() ? 'Pausar' : (ms > 0 ? 'Seguir' : 'Iniciar');
}
setInterval(() => {
  const t = E.tiempo;
  if (!estaCorriendo()) return;
  if (t.modo === 'temporizador' && tiempoActualMs() <= 0) {
    t.temp.restante = 0; t.temp.corriendo = false; t.temp.inicio = null;
    guardar('Tiempo cumplido'); alarmaTiempo();
    renderTiempo();
    return;
  }
  if (document.getElementById('p-tiempo').classList.contains('on')) pintarReloj();
}, 500);

/* Avisa que se cumplio el tiempo. Tres cosas a la vez, porque el alumno esta estudiando y no
   mirando la pantalla: suena, sale el aviso en pantalla, y si el navegador lo permite, una
   notificacion del sistema.

   El sonido es un archivo (alarma.mp3), que se reproduce al cumplirse el temporizador. Se reusa un
   solo elemento <audio> para no crear uno nuevo en cada aviso. */
function alarmaTiempo(){
  mostrarAviso('Se cumplió el tiempo del temporizador');
  if (E.ajustes && E.ajustes.sonido === false) return;
  try {
    // Un solo <audio> reutilizado: se busca, y si no existe se crea apuntando al mp3.
    let a = document.getElementById('audio-alarma');
    if (!a) {
      a = document.createElement('audio');
      a.id = 'audio-alarma';
      a.src = 'sonido/alarma.mp3';
      a.preload = 'auto';
      document.body.appendChild(a);
    }
    a.currentTime = 0;
    const p = a.play();
    // "play" devuelve una promesa: si el navegador lo bloquea (file:// sin interaccion previa),
    // queda la notificacion y el aviso en pantalla como red de seguridad.
    if (p && p.catch) p.catch(() => {});
  } catch (e) { /* si el navegador no deja sonar, queda el aviso en pantalla */ }
  try {
    if (!window.Notification) return;
    if (Notification.permission === 'granted') {
      new Notification('Se cumplió el tiempo', {body: 'El temporizador llegó a cero.'});
    } else if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  } catch (e) { /* abriendo el archivo desde el disco, el navegador puede no dejar notificar */ }
}
