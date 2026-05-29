/* animations.js — scroll-driven 3D card effect, blob parallax, hero tilt, reveal-on-scroll. */

/* ============= 3D scroll effect on service cards (chaos mode) ============= */
(function(){
  const cards = document.querySelectorAll('#svcList .svc');
  if(!cards.length) return;
  const M = 1.8; // chaos multiplier
  function update(){
    const vh = window.innerHeight;
    cards.forEach(card=>{
      const rect = card.getBoundingClientRect();
      const center = rect.top + rect.height/2;
      const dist = (center - vh/2) / vh;
      const clamped = Math.max(-1, Math.min(1, dist));
      const rotX = clamped * -10 * M;
      const scale = 1 - Math.abs(clamped)*0.06*M;
      const ty = clamped * 18 * M;
      card.style.transform = `perspective(1400px) translateY(${ty}px) rotateX(${rotX}deg) scale(${scale})`;
      card.style.opacity = 1 - Math.abs(clamped)*0.18;
    });
  }
  document.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();

/* ============= parallax on blobs (chaos mode) ============= */
(function(){
  const blobs = document.querySelectorAll('.blob');
  const M = 1.8;
  document.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    blobs.forEach((b,i)=>{
      const f = (i+1)*0.06*M;
      b.style.transform = `translate3d(0, ${y*f*-1}px, 0)`;
    });
  }, {passive:true});
})();

/* ============= hero stack tilt on mouse (chaos mode) ============= */
(function(){
  const stack = document.querySelector('.stack');
  if(!stack) return;
  const cards = stack.querySelectorAll('.card');
  const M = 1.8;
  cards.forEach(c=>{ c.dataset.base = getComputedStyle(c).transform === 'none' ? '' : getComputedStyle(c).transform; });
  stack.addEventListener('mousemove', e=>{
    const r = stack.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    cards.forEach((c,i)=>{
      const depth = ([10, 16, 14, 22][i] || 12) * M;
      c.style.transition = 'transform .15s ease-out';
      c.style.transform = `${c.dataset.base || ''} translate3d(${-x*depth}px, ${-y*depth}px, 0)`;
    });
  });
  stack.addEventListener('mouseleave', ()=>{
    cards.forEach(c=>{
      c.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
      c.style.transform = c.dataset.base || '';
    });
  });
})();

/* ============= reveal on scroll ============= */
(function(){
  // Apply reveal classes (skip hero — it's above the fold)
  document.querySelectorAll('section:not(.hero) .section-head, .marquee-wrap, .final').forEach(el=>el.classList.add('reveal'));
  document.querySelectorAll('.addons-grid, .specials-grid, .steps').forEach(el=>el.classList.add('reveal-stagger'));

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el=>io.observe(el));
})();
