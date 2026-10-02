// Main JS for site interactions — includes graceful asset handling and UI microinteractions
document.addEventListener('DOMContentLoaded', () => {
  // Hide loading screen
  const loader = document.getElementById('loading-screen');
  if (loader) {
    loader.classList.add('fade-out');
    setTimeout(() => loader.remove(), 700);
  }

  // Year in footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Populate programs from JSON if available
  fetch('assets/data/programs.json').then(r => {
    if (!r.ok) throw new Error(`Program data request failed: ${r.status}`);
    return r.json();
  }).then(data => {
    const featured = document.getElementById('featuredPrograms');
    if (featured) {
      featured.innerHTML = '';
      data.programs.slice(0, 6).forEach(p => {
        const col = document.createElement('div'); col.className = 'col-md-4';
        col.innerHTML = `<div class="program-card p-4 h-100">
          <h4 class="title mb-2">${p.title}</h4>
          <p class="excerpt mb-3">${p.excerpt}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <div class="price text-primary">${p.price}</div>
            <a href="programs.html" class="btn btn-outline">Learn</a>
          </div>
        </div>`;
        featured.appendChild(col);
      });
    }
  }).catch(error => {
    const featured = document.getElementById('featuredPrograms');
    if (featured) featured.textContent = 'Programs are temporarily unavailable. Please visit the Programs page.';
    console.error('Unable to load featured programs.', error);
  });

  // AOS init
  if (window.AOS) AOS.init({ duration: 800, once: true, easing: 'ease-out-quad' });

  // Hero video: by default we show the gradient fallback. To enable a local hero video,
  // place a file at `assets/videos/hero.mp4` and uncomment a small loader here.
  // Improved hero video fallback logic: if video file exists, show it; otherwise keep background image.
  const heroVideo = document.getElementById('heroVideo');
  const heroEl = document.querySelector('.hero');
  if(heroVideo && heroEl){
    // Try to load a local video; if fetch fails, keep the background image and ensure overlay is active
    fetch('assets/videos/hero.mp4', {method:'HEAD'}).then(resp=>{
      if(resp.ok){
        heroVideo.src = 'assets/videos/hero.mp4';
        heroVideo.style.display = 'block';
        heroEl.classList.remove('hero-no-video');
      } else {
        heroEl.classList.add('hero-no-video');
      }
    }).catch(()=>{
      heroEl.classList.add('hero-no-video');
    });
  }

  // Scroll progress bar and navbar scrolled state
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.querySelector('.navbar');
  function onScroll(){
    const st = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = height > 0 ? (st / height) * 100 : 0;
    if(scrollProgress) scrollProgress.style.width = pct + '%';
    if(navbar){
      if(st > 40) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Magnetic buttons
  function attachMagnetic(el){
    el.addEventListener('mousemove', (e)=>{
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
    });
    el.addEventListener('mouseleave', ()=>{
      el.style.setProperty('--mx','50%');
      el.style.setProperty('--my','50%');
    });
  }
  document.querySelectorAll('.magnetic').forEach(attachMagnetic);

  // Smooth internal anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        const target = document.querySelector(href);
        if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
    });
  });

  // Close mobile nav on link click
  document.querySelectorAll('.navbar-collapse .nav-link').forEach(link=>{
    link.addEventListener('click', ()=>{
      const collapseEl = document.querySelector('.navbar-collapse');
      if(collapseEl && collapseEl.classList.contains('show')){
        const bsCollapse = bootstrap.Collapse.getInstance(collapseEl) || new bootstrap.Collapse(collapseEl, {toggle:false});
        bsCollapse.hide();
      }
    });
  });

});
