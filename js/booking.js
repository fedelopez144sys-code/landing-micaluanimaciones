/* booking.js — booking form controller: proposal dropdown, calendar, validation, WhatsApp submit. */

/* ============= booking form controller ============= */
(function(){
  var PHONE = '5491122370215';
  var MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  /* ---- Proposal dropdown ---- */
  var selectedProp = '';
  var ddToggle = document.getElementById('bfPropToggle');
  var ddList = document.getElementById('bfPropList');
  var ddValue = document.getElementById('bfPropValue');
  var ddWrap = document.getElementById('bfPropDD');
  var ddOpen = false;

  function openDD(){ ddList.classList.add('open'); ddToggle.classList.add('open'); ddToggle.setAttribute('aria-expanded','true'); ddOpen = true; }
  function closeDD(){ ddList.classList.remove('open'); ddToggle.classList.remove('open'); ddToggle.setAttribute('aria-expanded','false'); ddOpen = false; }

  ddToggle.addEventListener('click', function(e){
    e.stopPropagation();
    if(ddOpen) closeDD(); else openDD();
  });
  ddList.querySelectorAll('.prop-dd-opt').forEach(function(opt){
    opt.addEventListener('click', function(){
      selectedProp = opt.dataset.prop;
      ddValue.textContent = selectedProp;
      ddValue.classList.remove('placeholder');
      ddList.querySelectorAll('.prop-dd-opt').forEach(function(o){ o.classList.remove('sel'); o.setAttribute('aria-selected','false'); });
      opt.classList.add('sel');
      opt.setAttribute('aria-selected','true');
      document.getElementById('bfPropWrap').classList.remove('chips-error');
      closeDD();
    });
  });
  document.addEventListener('click', function(e){ if(ddOpen && !ddWrap.contains(e.target)) closeDD(); });

  /* ---- Calendar ---- */
  var now = new Date();
  var calYear = now.getFullYear();
  var calMonth = now.getMonth();
  var selDate = null;
  var calOpen = false;
  var calEl = document.getElementById('bfCal');
  var calBody = document.getElementById('bfCalBody');
  var calTitle = document.getElementById('bfCalTitle');
  var fFechaBtn = document.getElementById('bfFechaBtn');
  var fFecha = document.getElementById('bfFecha');

  function renderCal(){
    calTitle.textContent = MONTHS[calMonth] + ' ' + calYear;
    var firstDay = new Date(calYear, calMonth, 1).getDay();
    var days = new Date(calYear, calMonth + 1, 0).getDate();
    var today = new Date(); today.setHours(0,0,0,0);
    var calHtml = '';
    for(var i = 0; i < firstDay; i++){
      calHtml += '<button type="button" class="cal-d e" tabindex="-1" aria-hidden="true"></button>';
    }
    for(var d = 1; d <= days; d++){
      var dt = new Date(calYear, calMonth, d);
      var isPast = dt < today;
      var isToday = dt.getTime() === today.getTime();
      var isSel = selDate && selDate.getTime() === dt.getTime();
      var cls = 'cal-d';
      if(isPast) cls += ' p';
      if(isToday && !isSel) cls += ' t';
      if(isSel) cls += ' s';
      var dis = isPast ? ' disabled' : '';
      calHtml += '<button type="button" class="' + cls + '" data-d="' + d + '"' + dis + '>' + d + '</button>';
    }
    calBody.innerHTML = calHtml;
    calBody.querySelectorAll('.cal-d:not(.e):not(.p)').forEach(function(btn){
      btn.addEventListener('click', function(){
        selDate = new Date(calYear, calMonth, parseInt(btn.dataset.d));
        var dd = String(selDate.getDate()).padStart(2,'0');
        var mm = String(selDate.getMonth()+1).padStart(2,'0');
        var yy = selDate.getFullYear();
        fFecha.value = dd + '/' + mm + '/' + yy;
        // update visible button text and clear error state
        fFechaBtn.textContent = fFecha.value;
        fFechaBtn.classList.remove('has-error');
        closeCalendar();
        renderCal();
      });
    });
  }

  function openCalendar(){
    calEl.classList.add('open');
    calOpen = true;
    fFechaBtn.setAttribute('aria-expanded','true');
    renderCal();
  }
  function closeCalendar(){
    calEl.classList.remove('open');
    calOpen = false;
    fFechaBtn.setAttribute('aria-expanded','false');
  }

  fFechaBtn.addEventListener('click', function(e){
    e.stopPropagation();
    if(calOpen) closeCalendar(); else openCalendar();
  });
  // Prevent manual typing/pasting/dropping into the date field — only allow selection via calendar
  // Keyboard accessibility for the visible button (Enter/Space already work on buttons)
  fFechaBtn.addEventListener('keydown', function(e){
    if(e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      if(calOpen) closeCalendar(); else openCalendar();
    }
  });
  // Prevent paste/drop on hidden input (defensive)
  fFecha.addEventListener('paste', function(e){ e.preventDefault(); });
  fFecha.addEventListener('drop', function(e){ e.preventDefault(); });
  document.getElementById('bfCalPrev').addEventListener('click', function(e){
    e.stopPropagation();
    calMonth--;
    if(calMonth < 0){ calMonth = 11; calYear--; }
    renderCal();
  });
  document.getElementById('bfCalNext').addEventListener('click', function(e){
    e.stopPropagation();
    calMonth++;
    if(calMonth > 11){ calMonth = 0; calYear++; }
    renderCal();
  });
  calEl.addEventListener('click', function(e){ e.stopPropagation(); });
  document.addEventListener('click', function(){ if(calOpen) closeCalendar(); });

  /* ---- Validation helper ---- */
  function shakeField(el){
    el.classList.remove('has-error');
    void el.offsetWidth;
    el.classList.add('has-error');
  }
  ['bfNombre','bfZona','bfCantidad','bfHora'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.addEventListener('input', function(){ el.classList.remove('has-error'); });
    if(el) el.addEventListener('change', function(){ el.classList.remove('has-error'); });
  });

  /* ---- Submit ---- */
  document.getElementById('bfSubmit').addEventListener('click', function(){
    var nombre   = document.getElementById('bfNombre').value.trim();
    var zona     = document.getElementById('bfZona').value.trim();
    var cantidad = document.getElementById('bfCantidad').value.trim();
    var fecha    = document.getElementById('bfFecha').value.trim();
    var hora     = document.getElementById('bfHora').value;
    var valid    = true;

    if(!nombre)                  { shakeField(document.getElementById('bfNombre'));   valid = false; }
    if(!zona)                    { shakeField(document.getElementById('bfZona'));     valid = false; }
    if(!selectedProp)            { document.getElementById('bfPropWrap').classList.add('chips-error'); valid = false; }
    if(!cantidad || parseInt(cantidad) < 1) { shakeField(document.getElementById('bfCantidad')); valid = false; }
    if(!fecha)                   { shakeField(document.getElementById('bfFechaBtn'));    valid = false; }
    if(!hora)                    { shakeField(document.getElementById('bfHora'));     valid = false; }

    if(!valid) return;

    var parts = fecha.split('/');
    var fechaMsg = parts[0] + ' de ' + MONTHS[parseInt(parts[1])-1] + ' de ' + parts[2];

    var NL = '\n';
    var msg = '¡Hola Cami! 🎉 Quiero consultar sobre una fecha con Micalú:' + NL + NL
      + '👤 *Nombre:* '             + nombre       + NL
      + '📍 *Zona:* '               + zona         + NL
      + '🎈 *Propuesta:* '          + selectedProp + NL
      + '👧 *Cantidad de chicos:* ' + cantidad     + NL
      + '📅 *Fecha:* '              + fechaMsg     + NL
      + '⏰ *Hora:* '               + hora         + ' hs' + NL + NL
      + '¡Espero tu respuesta! ✨';

    window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  /* init */
  renderCal();
})();
