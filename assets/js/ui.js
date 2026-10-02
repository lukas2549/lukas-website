// ui.js — site-wide UI interactions (navbar scroll, mobile menu)
document.addEventListener('DOMContentLoaded', ()=>{
  // Navbar scroll behavior
  const header = document.querySelector('.nav, .nav-modern');
  if(header){
    const onScroll = ()=>{ if(window.scrollY > 48) header.classList.add('nav-scrolled'); else header.classList.remove('nav-scrolled'); };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  // Mobile nav toggle (works with navbar.js markup)
  const navToggle = document.getElementById('navToggle');
  const navOverlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');
  if(navToggle && navOverlay){
    navToggle.addEventListener('click', ()=>{
      const open = navOverlay.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      document.body.classList.toggle('no-scroll', open);
      navOverlay.setAttribute('aria-hidden', (!open).toString());
      navToggle.setAttribute('aria-expanded', open.toString());
    });
    if(navClose) navClose.addEventListener('click', ()=>{ navOverlay.classList.remove('open'); navToggle.classList.remove('open'); document.body.classList.remove('no-scroll'); navOverlay.setAttribute('aria-hidden', 'true'); navToggle.setAttribute('aria-expanded', 'false'); });
    navOverlay.addEventListener('click', (e)=>{ if(e.target === navOverlay){ navOverlay.classList.remove('open'); navToggle.classList.remove('open'); document.body.classList.remove('no-scroll'); navOverlay.setAttribute('aria-hidden', 'true'); navToggle.setAttribute('aria-expanded', 'false'); } });
  }

  // Simple accessibility helper: close overlays on Escape
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ const overlays = document.querySelectorAll('.nav-mobile-overlay.open'); overlays.forEach(o=>o.classList.remove('open')); document.body.classList.remove('no-scroll'); } });
});
