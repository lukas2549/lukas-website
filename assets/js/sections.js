// Sections JS: comparison slider
document.addEventListener('DOMContentLoaded', ()=>{
  // Comparison slider logic
  const comparisons = document.querySelectorAll('.comparison');
  comparisons.forEach(comp=>{
    const handle = comp.querySelector('.handle');
    const afterWrap = comp.querySelector('.after-wrap');
    if(!handle || !afterWrap) return;
    let dragging = false;
    function setPosition(x){
      const rect = comp.getBoundingClientRect();
      const clamped = Math.max(0, Math.min(rect.width, x - rect.left));
      const pct = (clamped/rect.width)*100;
      afterWrap.style.width = pct + '%';
      handle.style.left = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }
    handle.addEventListener('keydown', (e)=>{
      if(e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const current = parseFloat(handle.getAttribute('aria-valuenow')) || 50;
      const step = e.shiftKey ? 10 : 2;
      const next = Math.max(0, Math.min(100, current + (e.key === 'ArrowRight' ? step : -step)));
      setPosition(comp.getBoundingClientRect().left + comp.getBoundingClientRect().width * next / 100);
    });
    handle.addEventListener('mousedown', ()=>dragging=true);
    window.addEventListener('mouseup', ()=>dragging=false);
    window.addEventListener('mousemove', (e)=>{ if(dragging) setPosition(e.clientX); });
    // touch support
    handle.addEventListener('touchstart', ()=>dragging=true);
    window.addEventListener('touchend', ()=>dragging=false);
    window.addEventListener('touchmove',(e)=>{ if(dragging && e.touches[0]) setPosition(e.touches[0].clientX); }, {passive:true});
    // allow click to reposition
    comp.addEventListener('click',(e)=>{ setPosition(e.clientX); });
  });
});
