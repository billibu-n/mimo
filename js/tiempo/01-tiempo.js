/* ---------------------------------------------------------------- tiempo */
function sesionesHoy(){ return est().sesiones.filter(s => s.fecha === hoy()); }
function transcurrido(){
  const t = E.tiempo;
  return (t.acumulado || 0) + (t.corriendo && t.inicio ? Date.now() - t.inicio : 0);
}
function renderTiempo(){
  const t = E.tiempo;
  const total = transcurrido();
  const ms = t.modo === 'temporizador' ? Math.max(0, (t.objetivo || 25) * 60000 - total) : total;
  const reloj = document.getElementById('reloj');
  document.querySelectorAll('.modo').forEach(b => b.classList.toggle('on', b.dataset.modo === t.modo));
  pintarReloj();
  const obj = document.getElementById('crono-objetivo');
  if (obj && Number(obj.value) !== (t.objetivo || 25)) obj.value = t.objetivo || 25;
  document.getElementById('crono-extra').innerHTML = t.modo === 'temporizador'
    ? '<div class="destino">Cuenta atrás desde ' + (t.objetivo || 25) + ' minutos. Al llegar a cero se detiene sola.</div>'
    : '';
  document.getElementById('crono-play').textContent = t.corriendo ? 'Pausar' : (total > 0 ? 'Seguir' : 'Iniciar');
  const ramoSel = document.getElementById('crono-ramo'), semSel = document.getElementById('crono-semana');
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
  const lista = sesionesHoy();
  const tot = lista.reduce((a, x) => a + x.minutos, 0);
  document.getElementById('lista-sesiones').innerHTML = (lista.length
    ? lista.map(x => '<div class="sesion"><span>' + x.hora + ' · ' + esc(aliasDe(x.ramo)) + '</span>' +
        '<span class="h">' + x.minutos + ' min <button class="quitar" data-sesion="' + x.id + '" style="margin-left:6px">×</button></span></div>').join('')
      + '<div class="sesion"><span><b>Total de hoy</b></span><span class="h">' + fmtHM(tot) + '</span></div>'
    : '<p class="ayuda">Todavía no registras sesiones hoy.</p>');
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
  if (t.corriendo) {
    t.acumulado = transcurrido();
    t.corriendo = false; t.inicio = null;
  } else {
    t.corriendo = true; t.inicio = Date.now();
  }
  guardar(); renderTiempo();
}
function cronoCero(){
  const t = E.tiempo;
  t.acumulado = 0; t.inicio = t.corriendo ? Date.now() : null;
  guardar(); renderTiempo();
}
function cronoRegistrar(){
  const t = E.tiempo;
  const min = Math.round(transcurrido() / 60000);
  if (min < 1) { mostrarAviso('Menos de un minuto: no hay nada que registrar'); return; }
  const s = est();
  s.minutos[t.semana] = s.minutos[t.semana] || {};
  s.minutos[t.semana][t.ramo] = (Number(s.minutos[t.semana][t.ramo]) || 0) + min;
  const d = new Date();
  s.sesiones.push({id:'s' + Date.now(), fecha:hoy(), lunes:t.semana, ramo:t.ramo, minutos:min,
                   hora:dos(d.getHours()) + ':' + dos(d.getMinutes())});
  t.acumulado = 0; t.inicio = t.corriendo ? Date.now() : null;
  guardar('Registrados ' + min + ' min en ' + aliasDe(t.ramo));
  renderTodo(); renderTiempo();
}
function pintarReloj(){
  const t = E.tiempo, total = transcurrido();
  const ms = t.modo === 'temporizador' ? Math.max(0, (t.objetivo || 25) * 60000 - total) : total;
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
  reloj.className = 'reloj' + (t.corriendo ? ' corriendo' : '') +
                     (t.modo === 'temporizador' ? ' modo-temporizador' : '');
  reloj.querySelectorAll('.rlj').forEach(inp => inp.onchange = () => {
    const hh = parseInt(reloj.querySelector('[data-parte=h]').value || '0', 10) || 0;
    const mm = parseInt(reloj.querySelector('[data-parte=m]').value || '0', 10) || 0;
    const ss = parseInt(reloj.querySelector('[data-parte=s]').value || '0', 10) || 0;
    const nuevoMs = (hh * 3600 + mm * 60 + ss) * 1000;
    // En temporizador, lo que se edita es el tiempo QUE QUEDA; en cronometro, el acumulado.
    if (t.modo === 'temporizador') {
      t.objetivo = Math.max(1, Math.round(nuevoMs / 60000));   // el objetivo en minutos
      t.acumulado = 0; t.inicio = t.corriendo ? Date.now() : null;
      const obj = document.getElementById('crono-objetivo');
      if (obj) obj.value = t.objetivo;
    } else {
      t.acumulado = nuevoMs;
      t.inicio = t.corriendo ? Date.now() : null;
    }
    guardar('Tiempo ajustado a mano'); renderTiempo(); renderTodo();
  });
  const b = document.getElementById('crono-play');
  if (b) b.textContent = t.corriendo ? 'Pausar' : (total > 0 ? 'Seguir' : 'Iniciar');
}
setInterval(() => {
  const t = E.tiempo;
  if (!t.corriendo) return;
  const trans = transcurrido();
  if (t.modo === 'temporizador' && trans >= (t.objetivo || 25) * 60000) {
    t.acumulado = (t.objetivo || 25) * 60000; t.corriendo = false; t.inicio = null;
    guardar('Tiempo cumplido'); alarmaTiempo();
    renderTiempo();
    return;
  }
  if (document.getElementById('p-tiempo').classList.contains('on')) pintarReloj();
}, 500);

/* Avisa que se cumplio el tiempo. Tres cosas a la vez, porque el alumno esta estudiando y no
   mirando la pantalla: suena, sale el aviso en pantalla, y si el navegador lo permite, una
   notificacion del sistema.

   El sonido se arma aqui mismo, sin archivo: la aplicacion es un solo archivo y meter un audio
   adentro la engordaria sin ganar nada. Son tres tonos cortos, el ultimo mas grave, que es lo que
   hace que suene a aviso y no a pitido de electrodomestico. */
function alarmaTiempo(){
  mostrarAviso('Se cumplió el tiempo del temporizador');
  if (E.ajustes && E.ajustes.sonido === false) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      const ctx = new Ctx();
      [0, 0.3, 0.6].forEach(function (t, i) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = i === 2 ? 660 : 880;
        o.connect(g); g.connect(ctx.destination);
        g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.24);
        o.start(ctx.currentTime + t);
        o.stop(ctx.currentTime + t + 0.26);
      });
      setTimeout(function () { try { ctx.close(); } catch (e) {} }, 1600);
    }
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
