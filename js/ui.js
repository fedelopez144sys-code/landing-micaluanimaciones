/* ui.js — small UI interactions: FAQ accordion + mobile hamburger drawer. */

/* ============= faq accordion ============= */
(function(){
  document.querySelectorAll('.faq-item').forEach(function(item){
    var btn = item.querySelector('.faq-q');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(other){
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded','false');
      });
      if(!isOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });
})();

/* ============= hamburger mobile menu ============= */
(function(){
  var burger = document.getElementById('navBurger');
  var drawer = document.getElementById('navDrawer');
  if(!burger || !drawer) return;

  function openMenu(){
    burger.classList.add('open');
    drawer.classList.add('open');
    burger.setAttribute('aria-expanded','true');
    drawer.setAttribute('aria-hidden','false');
  }
  function closeMenu(){
    burger.classList.remove('open');
    drawer.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
    drawer.setAttribute('aria-hidden','true');
  }
  function toggleMenu(){ burger.classList.contains('open') ? closeMenu() : openMenu(); }

  burger.addEventListener('click', function(e){ e.stopPropagation(); toggleMenu(); });

  drawer.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function(e){
    if(drawer.classList.contains('open') && !drawer.contains(e.target) && !burger.contains(e.target)){
      closeMenu();
    }
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && drawer.classList.contains('open')) closeMenu();
  });
})();
