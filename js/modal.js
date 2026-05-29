/* modal.js — "Complementos" detail modal (open/close, slideshow, focus & a11y). */

/* ============= complementos modal ============= */
(function(){
  const PHONE = '5491122370215';
  const ADDONS = {
    "a1": {
      "name": "Stand de Glitter",
      "ic": "✦",
      "detail": "Brillos cosméticos hipoalergénicos, gemas faciales y transfers temporales. Llegamos con paleta de colores, aplicadores y un set de inspiración con más de 40 diseños para elegir.",
      "bullets": ["Productos hipoalergénicos","+40 diseños para elegir","Aplicación rápida en stand","Ideal para fotos y grupos"],
      "slides": ["GLITTER FACIAL","GEMAS Y BRILLOS","DISEÑOS TEMÁTICOS"]
    },
    "a2": {
      "name": "Stand de Peinados",
      "ic": "✿",
      "detail": "Cada peque pasa por la silla y se lleva un peinado de fiesta: trenzas, colitas con cintas, mechones de colores temporales y accesorios temáticos según la ambientación de tu evento.",
      "bullets": ["Trenzas y colitas decoradas","Mechones de colores temporales","Accesorios temáticos","Pensado para todas las edades"],
      "slides": ["TRENZAS DE FIESTA","COLORES TEMPORALES","ACCESORIOS Y CINTAS"]
    },
    "a3": {
      "name": "Barra de Jugos y Licuados",
      "ic": "◐",
      "detail": "Barra equipada con frutas frescas, jugos naturales y bases para licuados. Los peques eligen ingredientes y se lo preparamos al momento. Incluye vasos, sorbetes y decoración.",
      "bullets": ["Frutas frescas del día","Vasos y sorbetes incluidos","Decoración temática","Reposición durante el evento"],
      "slides": ["BARRA DE JUGOS","FRUTAS FRESCAS","LICUADOS EN VIVO"]
    },
    "a4": {
      "name": "Stand de Gomitas",
      "ic": "●",
      "detail": "Candy bar con variedad de gomitas, pinzas, frascos y bolsitas decoradas para llevar. Decoración temática incluida y reposición durante todo el evento.",
      "bullets": ["Variedad de gomitas","Bolsitas decoradas para llevar","Frascos y pinzas incluidos","Reposición continua"],
      "slides": ["CANDY BAR","FRASCOS Y PINZAS","BOLSITAS PARA LLEVAR"]
    }
  };

  const modal = document.getElementById('addon-modal');
  if(!modal) return;
  const dialog = modal.querySelector('.addon-modal-dialog');
  const closeBtn = modal.querySelector('.addon-modal-close');
  const elTitle = modal.querySelector('[data-modal-title]');
  const elDesc  = modal.querySelector('[data-modal-desc]');
  const elList  = modal.querySelector('[data-modal-list]');
  const elFloat = modal.querySelector('[data-modal-float]');
  const elSlides = modal.querySelector('[data-modal-slides]');
  const elPips   = modal.querySelector('[data-modal-pips]');
  const elArrow  = modal.querySelector('[data-modal-arrow]');
  const PH = ['ph-a','ph-b','ph-c','ph-d'];
  let slideIdx = 0, slideTimer = null, slideEls = [], pipEls = [];

  function renderSlides(labels){
    slideEls = labels.map((label, i) =>
      `<div class="slide ${PH[i % PH.length]}${i===0 ? ' active' : ''}"><span class="lbl">FOTO · ${label}</span></div>`
    );
    pipEls = labels.map((_, i) =>
      `<span class="pip${i===0 ? ' active' : ''}"></span>`
    );
    elSlides.innerHTML = slideEls.join('');
    elPips.innerHTML = pipEls.join('');
    slideIdx = 0;
  }
  function showSlide(i){
    const slides = elSlides.querySelectorAll('.slide');
    const pips = elPips.querySelectorAll('.pip');
    if(!slides.length) return;
    slideIdx = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('active', j === slideIdx));
    pips.forEach((p, j) => p.classList.toggle('active', j === slideIdx));
  }
  function nextSlide(){ showSlide(slideIdx + 1); }
  function startSlides(){
    stopSlides();
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    slideTimer = setInterval(nextSlide, 3000);
  }
  function stopSlides(){
    if(slideTimer){ clearInterval(slideTimer); slideTimer = null; }
  }
  if(elArrow){
    elArrow.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      nextSlide();
      startSlides();
    });
  }
  const elCta   = modal.querySelector('[data-modal-cta]');
  const elCtaTx = modal.querySelector('[data-modal-cta-text]');

  let lastTrigger = null;

  function openModal(key){
    const data = ADDONS[key];
    if(!data) return;
    modal.dataset.color = key;
    elTitle.textContent = data.name;
    elDesc.textContent = data.detail;
    elFloat.textContent = data.ic;
    renderSlides(data.slides || ['FOTO · ' + data.name.toUpperCase()]);
    elList.innerHTML = data.bullets.map(b => '<li>' + b + '</li>').join('');
    const msg = encodeURIComponent('Hola Cami! Quiero info sobre ' + data.name + ' ✨');
    elCta.href = 'https://wa.me/' + PHONE + '?text=' + msg;
    elCtaTx.textContent = 'Quiero info sobre ' + data.name;

    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    // next frame for transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { modal.classList.add('is-visible'); startSlides(); });
    });
    setTimeout(() => closeBtn.focus(), 200);
  }

  function closeModal(){
    stopSlides();
    modal.classList.remove('is-visible');
    setTimeout(() => {
      modal.classList.remove('is-open');
      modal.hidden = true;
      document.body.classList.remove('modal-open');
      if(lastTrigger) lastTrigger.focus();
    }, 350);
  }

  document.querySelectorAll('.addon[data-addon]').forEach(card => {
    card.addEventListener('click', (e) => {
      if(e.target.closest('a')) return;
      lastTrigger = card;
      openModal(card.dataset.addon);
    });
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        lastTrigger = card;
        openModal(card.dataset.addon);
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
})();
