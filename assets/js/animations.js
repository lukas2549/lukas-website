// GSAP-powered cinematic hero: mesh gradient, particles, streaks, headline sequence, scroll interactions
// Focus on performance, reduced-motion support, and graceful degradation.
document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Word-by-word hero title split (preserve <br>)
  const title = document.querySelector('.hero-title');
  if (title) {
    const raw = title.innerHTML;
    const lines = raw.split(/<br\s*\/?/i).map(s => s.trim());
    // helper to escape attribute content
    function escapeHtml(str){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
    // create static line elements (no typewriter) with original text preserved
    const wrapped = lines.map(line => `<span class="hero-line" data-text="${escapeHtml(line)}">${escapeHtml(line)}</span>`).join('<br>');
    title.innerHTML = wrapped;
  }

  // register ScrollTrigger when available
  if (window.gsap && window.ScrollTrigger && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ---- Canvas-based visual systems (mesh + particles) ----
  const meshCanvas = document.getElementById('heroMesh');
  const partCanvas = document.getElementById('heroParticles');
  const heroLayers = document.querySelector('.hero-layers');
  const heroEl = document.querySelector('.hero');
  let meshCtx, partCtx, w, h, DPR = window.devicePixelRatio || 1;

  function resizeCanvases() {
    if (!meshCanvas || !partCanvas) return;
    DPR = window.devicePixelRatio || 1;
    w = heroEl.clientWidth;
    h = heroEl.clientHeight;
    meshCanvas.width = Math.round(w * DPR);
    meshCanvas.height = Math.round(h * DPR);
    meshCanvas.style.width = w + 'px';
    meshCanvas.style.height = h + 'px';
    partCanvas.width = Math.round(w * DPR);
    partCanvas.height = Math.round(h * DPR);
    partCanvas.style.width = w + 'px';
    partCanvas.style.height = h + 'px';
    meshCtx = meshCanvas.getContext('2d');
    partCtx = partCanvas.getContext('2d');
    meshCtx.scale(DPR, DPR);
    partCtx.scale(DPR, DPR);
  }

  // lightweight animated blobs used to create a soft mesh/gradient effect
  const blobs = [];
  function initBlobs() {
    blobs.length = 0;
    const count = Math.max(3, Math.round((w / 900) * 4));
    for (let i = 0; i < count; i++) {
      blobs.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.max(120, (w + h) * (0.06 + Math.random() * 0.06)),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.12,
        hue: 200 + Math.random() * 40,
        alpha: 0.18 + Math.random() * 0.12
      });
    }
  }

  // particles
  const particles = [];
  function initParticles() {
    particles.length = 0;
    const count = Math.max(28, Math.round((w / 1200) * 40));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.2,
        r: 0.8 + Math.random() * 3.4,
        alpha: 0.08 + Math.random() * 0.36
      });
    }
  }

  let mouse = {x: w / 2, y: h / 2};
  function onPointer(e){
    const ev = e.touches ? e.touches[0] : e;
    // store raw client coords; normalized transforms applied in the RAF loop
    mouse.x = ev.clientX - heroEl.getBoundingClientRect().left;
    mouse.y = ev.clientY - heroEl.getBoundingClientRect().top;
    mouse.clientX = ev.clientX;
    mouse.clientY = ev.clientY;
  }

  // draw functions
  function renderMesh(dt) {
    if (!meshCtx) return;
    meshCtx.clearRect(0,0,w,h);
    meshCtx.globalCompositeOperation = 'lighter';
    blobs.forEach(b=>{
      b.x += b.vx * dt * 0.6; b.y += b.vy * dt * 0.6;
      if(b.x < -b.r) b.x = w + b.r;
      if(b.x > w + b.r) b.x = -b.r;
      if(b.y < -b.r) b.y = h + b.r;
      if(b.y > h + b.r) b.y = -b.r;
      const grd = meshCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grd.addColorStop(0, `hsla(${b.hue}, 95%, 58%, ${b.alpha})`);
      grd.addColorStop(0.45, `hsla(${b.hue}, 85%, 45%, ${b.alpha * 0.6})`);
      grd.addColorStop(1, 'rgba(6,10,20,0)');
      meshCtx.fillStyle = grd;
      meshCtx.beginPath();
      meshCtx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      meshCtx.fill();
    });
    meshCtx.globalCompositeOperation = 'source-over';
  }

  function renderParticles(dt) {
    if (!partCtx) return;
    partCtx.clearRect(0,0,w,h);
    partCtx.globalCompositeOperation = 'lighter';
    particles.forEach(p=>{
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if(p.x < -10) p.x = w + 10;
      if(p.x > w + 10) p.x = -10;
      if(p.y < -10) p.y = h + 10;
      if(p.y > h + 10) p.y = -10;
      const grd = partCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
      grd.addColorStop(0, `rgba(30,144,255,${p.alpha})`);
      grd.addColorStop(0.4, `rgba(30,144,255,${p.alpha * 0.18})`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      partCtx.fillStyle = grd;
      partCtx.beginPath();
      partCtx.arc(p.x, p.y, p.r * 2, 0, Math.PI*2);
      partCtx.fill();
    });
    partCtx.globalCompositeOperation = 'source-over';
  }

  let last = performance.now();
  let rafId;
  // parallax limits (pixels)
  const PARALLAX = {layers:12, streaks:20, shapes:14};

  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  function animate(now){
    const dt = Math.min(60, now - last) / 16.666; // normalized
    last = now;
    // normalized -1..1 based on hero center
    const nx = ((mouse.x || w/2) - w/2) / (w/2 || 1);
    const ny = ((mouse.y || h/2) - h/2) / (h/2 || 1);

    // gentle parallax clamped to configured pixel ranges
    const lx = clamp(nx * PARALLAX.layers, -PARALLAX.layers, PARALLAX.layers);
    const ly = clamp(ny * PARALLAX.layers, -PARALLAX.layers, PARALLAX.layers);
    if (heroLayers) heroLayers.style.transform = `translate3d(${lx}px, ${ly}px, 0) translateZ(0)`;

    // streaks move slightly opposite to cursor for depth
    const streaks = document.querySelectorAll('.hero-streaks .streak');
    streaks.forEach((s, i) => {
      const fx = clamp(-nx * PARALLAX.streaks * (0.25 + i * 0.18), -PARALLAX.streaks, PARALLAX.streaks);
      const fy = clamp(-ny * (PARALLAX.streaks * 0.12), -PARALLAX.streaks, PARALLAX.streaks);
      s.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
    });

    // shape icons follow with subtle offset
    const shapes = document.querySelectorAll('.hero-shapes .float-icon');
    shapes.forEach((sh, i) => {
      const sx = clamp(nx * PARALLAX.shapes * (0.18 + i*0.06), -PARALLAX.shapes, PARALLAX.shapes);
      const sy = clamp(ny * PARALLAX.shapes * (0.12 + i*0.04), -PARALLAX.shapes, PARALLAX.shapes);
      sh.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
    });

    renderMesh(dt);
    renderParticles(dt);
    rafId = requestAnimationFrame(animate);
  }

  function startHeroStatCounters(){
    const counters = Array.from(document.querySelectorAll('.hero-stats .num'));
    if (!counters.length) return;

    counters.forEach((el, index) => {
      const target = Number(el.getAttribute('data-to') || 0);
      const duration = 1800 + index * 220;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = value.toLocaleString('en-US');

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toLocaleString('en-US');
        }
      }

      requestAnimationFrame(tick);
    });
  }

  // Rotating hero-value words for a subtle premium motion accent
  function setupHeroRotator(){
    const wordEl = document.querySelector('.hero-rotator-word');
    const labelEl = document.querySelector('.hero-rotator-label');
    const trustEl = document.querySelector('.hero-trust');

    if (labelEl) {
      labelEl.style.fontFamily = "'Montserrat', sans-serif";
      labelEl.style.fontSize = '0.82rem';
      labelEl.style.fontWeight = '800';
      labelEl.style.letterSpacing = '0.28em';
    }

    if (wordEl) {
      wordEl.style.fontFamily = "'Montserrat', sans-serif";
      wordEl.style.fontSize = '1.18rem';
      wordEl.style.fontWeight = '900';
      wordEl.style.letterSpacing = '0.22em';
    }

    if (trustEl) {
      trustEl.style.fontFamily = "'Inter', sans-serif";
      trustEl.style.fontSize = '1.12rem';
      trustEl.style.fontWeight = '800';
      trustEl.style.lineHeight = '1.7';
    }

    if (!wordEl || prefersReduced) return;

    const values = ['Strength', 'Discipline', 'Confidence', 'Performance', 'Transformation', 'Results'];
    let index = 0;

    setInterval(() => {
      wordEl.style.opacity = '0';
      wordEl.style.transform = 'translateY(6px)';

      setTimeout(() => {
        index = (index + 1) % values.length;
        wordEl.textContent = values[index];
        wordEl.style.opacity = '1';
        wordEl.style.transform = 'translateY(0)';
      }, 220);
    }, 2200);
  }

  // GSAP-driven streaks and floating icons
  function setupLayerAnimations(){
    if (typeof gsap === 'undefined' || prefersReduced) return;
    // streak sweep loops
    const baseDur = 26;
    gsap.to('.streak-1',{xPercent:160,duration:baseDur,repeat:-1,ease:'none'});
    gsap.to('.streak-2',{xPercent:-160,duration:baseDur*0.72,repeat:-1,ease:'none'});
    gsap.to('.streak-3',{xPercent:140,duration:baseDur*1.18,repeat:-1,ease:'none'});

    // floating icons gentle motion
    gsap.utils.toArray('.hero-shapes .float-icon').forEach((el, idx)=>{
      gsap.to(el,{y:'-=' + (6 + (idx%3)*3), x:'+=' + (idx%2?4:-4), duration:4 + idx*0.8, repeat:-1, yoyo:true, ease:'sine.inOut'});
    });
  }

  function startEffects(){
    resizeCanvases(); initBlobs(); initParticles(); last = performance.now();
    // mobile fallback: reduce visuals on small widths
    if (w < 900 || prefersReduced){
      // reduce particle count and hide heavy layers
      document.querySelector('.hero-layers')?.classList.add('reduced');
      // drastically lower particles
      particles.length = Math.min(particles.length, 12);
    }
    setupHeroRotator();
    setupLayerAnimations();
    rafId = requestAnimationFrame(animate);
  }

  // attach listeners
  if (heroEl){
    window.addEventListener('resize', ()=>{ resizeCanvases(); initBlobs(); initParticles(); });
    window.addEventListener('pointermove', onPointer, {passive:true});
    window.addEventListener('touchmove', onPointer, {passive:true});
  }

  // Magnetic button interactions: update CSS variables for subtle magnetic hover
  function bindMagneticButtons(){
    document.querySelectorAll('.magnetic').forEach(btn=>{
      const target = btn.querySelector('.magnetic-target') || btn;
      btn.addEventListener('pointermove', (e)=>{
        const r = btn.getBoundingClientRect();
        const mx = ((e.clientX - r.left) - r.width/2) / (r.width/2) * 18; // max 18px
        const my = ((e.clientY - r.top) - r.height/2) / (r.height/2) * 8; // max 8px
        btn.style.setProperty('--mx', mx.toFixed(1) + 'px');
        btn.style.setProperty('--my', my.toFixed(1) + 'px');
      }, {passive:true});
      btn.addEventListener('pointerleave', ()=>{ btn.style.setProperty('--mx','0px'); btn.style.setProperty('--my','0px'); });
    });
  }

  // initialize magnetic bindings early
  bindMagneticButtons();

  // ---- GSAP cinematic timeline ----
  // Guard timeline creation so runtime errors don't leave hero content hidden.
  let tl = null;
  if (window.gsap){
    try{
      // build timeline but keep it paused until typewriter finishes so we can insert word-based tweens after typing
      tl = gsap.timeline({defaults:{ease:'power3.out'}, paused:true});
      // ensure hero is visible immediately while typewriter runs
      gsap.set('.hero',{autoAlpha:1});
      tl.set('.title-glow',{x:'-110%'});
      tl.set('.hero-layers',{scale:1});
      tl.to('.hero',{autoAlpha:1,duration:0.5});
    }catch(err){
      // eslint-disable-next-line no-console
      console.error('GSAP timeline init failed:', err);
      tl = null;
      // ensure content is visible if GSAP is broken
      const els = document.querySelectorAll('.hero, .hero-sub, .hero-cta, .hero-stats, .title-glow');
      els.forEach(e=>{ if(e) e.style.opacity = ''; e.style.visibility = ''; e.style.display = ''; });
    }
  }

  if (tl) {
    // slow breathing/zoom on layers (long-running subtle)
    tl.to('.hero-layers',{scale:1.02,duration:20,ease:'none'},0);

    // keep title glow tween in timeline (background effect)
    tl.to('.title-glow',{x:'120%',duration:0.9,ease:'power2.inOut',opacity:1}, 0.6);
  }

  // CTA subtle pulse repeat
  if(!prefersReduced && window.gsap){
    gsap.to('.hero-cta .btn.btn-primary',{boxShadow:'0 26px 80px rgba(30,144,255,0.12)',scale:1.02,repeat:-1,yoyo:true,duration:2.8,ease:'power1.inOut',delay:1.8});
  }

  // Scroll transitions using ScrollTrigger (if available)
  if (window.ScrollTrigger){
    ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
      onUpdate: self=>{
        // subtle content parallax tied to progress
        const p = self.progress;
        const titleEl = document.querySelector('.hero-title');
        const subEl = document.querySelector('.hero-sub');
        const ctaEl = document.querySelector('.hero-cta');
        if(titleEl) titleEl.style.transform = `translateY(${ -p * 110 }px) scale(${1 - p*0.06})`;
        if(subEl) subEl.style.transform = `translateY(${ p * 48 }px)`;
        if(ctaEl) ctaEl.style.transform = `translateY(${ p * 64 }px)`;
      }
    });

    // gentle background layer parallax/scale
    if (window.gsap) {
      gsap.to('.hero-layers',{scale:1.06,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
    }
  }

  // start GSAP layer animations after DOM ready and GSAP registered
  if (!prefersReduced) setupLayerAnimations();

    // Typewriter implementation: type each hero-line (no extra word-wrapping)
    async function runTypewriter(){
      if(!title) return;
      const linesEls = title.querySelectorAll('.hero-line');
      for(let i=0;i<linesEls.length;i++){
        const el = linesEls[i];
        const text = el.getAttribute('data-text') || '';
        if(prefersReduced){ el.textContent = text; continue; }
          el.textContent = '';
          // append a cursor element for the active line
          const cursor = document.createElement('span'); cursor.className = 'type-cursor';
          el.appendChild(cursor);
          for(let j=0;j<text.length;j++){
            // insert character before the cursor so cursor stays at the end
            cursor.insertAdjacentText('beforebegin', text[j]);
            // speed: slightly faster overall but keep micro-variations
            await new Promise(r=>setTimeout(r, 12 + Math.round(Math.random()*12)));
          }
          // If this is the last line, fade the cursor out; otherwise remove it after a short pause
          if(i === linesEls.length - 1){
            // small pause, then fade out
            await new Promise(r=>setTimeout(r, 220));
            if(window.gsap && !prefersReduced){
              await new Promise(resolve => gsap.to(cursor,{opacity:0,duration:0.6,ease:'power1.out',onComplete: ()=>{ cursor.remove(); resolve(); }}));
            } else {
              // CSS fallback fade
              cursor.style.transition = 'opacity 0.6s ease';
              cursor.style.opacity = '0';
              await new Promise(r=>setTimeout(r, 650));
              cursor.remove();
            }
          } else {
            await new Promise(r=>setTimeout(r, 220));
            cursor.remove();
          }
        // small pause between lines
      }
    }
    // make finalizeTitleToWords a no-op (we keep static lines)
    function finalizeTitleToWords(){ /* no-op */ }

    // Play the hero load animation sequence in order (no typewriter):
    // 1) eyebrow fade-in
    // 2) headline lines reveal (staggered)
    // 3) description fades up
    // 4) CTAs fade in
    // 5) Stats animate in and counters run
    async function playHeroSequence(){
      const eyebrow = document.querySelector('.hero-eyebrow');
      const lines = title ? Array.from(title.querySelectorAll('.hero-line')) : [];
      const sub = document.querySelector('.hero-sub');
      const ctas = document.querySelectorAll('.hero-cta .btn');
      const statsEls = Array.from(document.querySelectorAll('.hero-stats .stat'));

      // Eyebrow
      if(eyebrow){
        if(window.gsap && !prefersReduced){
          gsap.set(eyebrow,{y:-8});
          await new Promise(res => gsap.to(eyebrow,{opacity:1,y:0,duration:0.45,ease:'power2.out',onComplete:res}));
        } else { eyebrow.style.opacity='1'; eyebrow.style.transform='none'; }
      }

      // Headline lines reveal (stagger)
      if(lines.length){
        if(window.gsap && !prefersReduced){
          gsap.set(lines,{opacity:0,y:8});
          await new Promise(res => gsap.to(lines,{opacity:1,y:0,stagger:0.12,duration:0.7,ease:'power3.out',onComplete:res}));
        } else {
          lines.forEach(l=>{ l.style.opacity='1'; l.style.transform='none'; });
        }
      }

      // Description
      if(sub){
        if(window.gsap && !prefersReduced){
          await new Promise(res => gsap.to(sub,{opacity:1,y:0,duration:0.6,ease:'power3.out',onComplete:res}));
        } else { sub.style.opacity='1'; sub.style.transform='none'; }
      }

      // CTAs
      if(ctas && ctas.length){
        if(window.gsap && !prefersReduced){
          gsap.set(ctas,{opacity:0,y:12});
          await new Promise(res => gsap.to(ctas,{opacity:1,y:0,stagger:0.12,duration:0.64,ease:'power3.out',onComplete:res}));
        } else { ctas.forEach(b=>{ b.style.opacity='1'; b.style.transform='none'; }); }
      }

      // Stats reveal + counters
      if(statsEls.length){
        if(window.gsap && !prefersReduced){
          gsap.set(statsEls,{opacity:0,y:12});
          await new Promise(res => gsap.to(statsEls,{opacity:1,y:0,stagger:0.08,duration:0.84,ease:'power3.out',onComplete:res}));
        } else { statsEls.forEach(s=>{ s.style.opacity='1'; s.style.transform='none'; }); }

        startHeroStatCounters();
      }
    }

    // Start the sequence
    playHeroSequence().catch(err=>console.error('Hero sequence error:', err));

  window.addEventListener('load', () => {
    setTimeout(() => {
      startHeroStatCounters();
    }, 700);
  });

  // CTA ripple interaction (minimal, GPU-friendly)
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const d = document.createElement('span');
      d.className = 'btn-ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.6;
      d.style.width = d.style.height = size + 'px';
      d.style.left = (e.clientX - rect.left - size/2) + 'px';
      d.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(d);
      setTimeout(()=> d.remove(), 900);
    });
  });

  // start visual effects after a short delay to avoid layout jank
  setTimeout(()=> startEffects(), prefersReduced ? 0 : 360);
});
