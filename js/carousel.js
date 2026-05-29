/* carousel.js — gallery carousel + service-card slideshows. */

/* ============= gallery carousel ============= */
(function(){
  const track = document.getElementById('galTrack');
  const prev = document.getElementById('galPrev');
  const next = document.getElementById('galNext');
  const dotsWrap = document.getElementById('galDots');
  if(!track) return;
  const items = track.children;
  const dots = [...items].map((_,i)=>{
    const d = document.createElement('span');
    d.className = 'dot' + (i===0 ? ' active' : '');
    d.addEventListener('click', ()=>scrollToIdx(i));
    dotsWrap.appendChild(d);
    return d;
  });
  function step(){
    const card = items[0];
    return card.getBoundingClientRect().width + 24;
  }
  function scrollToIdx(i){
    track.scrollTo({left: step()*i, behavior:'smooth'});
  }
  next.addEventListener('click', ()=>{
    track.scrollBy({left: step(), behavior:'smooth'});
  });
  prev.addEventListener('click', ()=>{
    track.scrollBy({left: -step(), behavior:'smooth'});
  });
  track.addEventListener('scroll', ()=>{
    const idx = Math.round(track.scrollLeft / step());
    dots.forEach((d,i)=>d.classList.toggle('active', i===idx));
  }, {passive:true});
})();

/* ============= propuesta cards slideshow ============= */
(function(){
  const cards = document.querySelectorAll('.svc .visual[data-slideshow]');
  if(!cards.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = 3000;

  cards.forEach(card => {
    const slides = [...card.querySelectorAll('.slide')];
    const pips = [...card.querySelectorAll('.pip')];
    const arrow = card.querySelector('.slide-arrow');
    if(slides.length <= 1) return;

    let idx = 0;
    let timer = null;
    let inView = false;
    let hovered = false;

    function show(i){
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, j) => s.classList.toggle('active', j === idx));
      pips.forEach((p, j) => p.classList.toggle('active', j === idx));
    }
    function next(){ show(idx + 1); }
    function start(){
      if(reduced) return;
      stop();
      if(!(inView || hovered)) return;
      timer = setInterval(next, DURATION);
    }
    function stop(){
      if(timer){ clearInterval(timer); timer = null; }
    }
    function restart(){ stop(); start(); }

    arrow.addEventListener('click', (e) => {
      e.preventDefault();
      next();
      restart();
    });

    card.addEventListener('mouseenter', () => { hovered = true; start(); });
    card.addEventListener('mouseleave', () => { hovered = false; if(!inView) stop(); else start(); });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        inView = e.isIntersecting;
        if(inView) start(); else if(!hovered) stop();
      });
    }, { threshold: 0.55 });
    io.observe(card);
  });
})();
