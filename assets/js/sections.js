// Sections JS: comparison slider and testimonials swiper init
document.addEventListener('DOMContentLoaded', ()=>{
  // Testimonials Swiper
  try{
    if(window.Swiper){
      new Swiper('.testimonials-swiper',{loop:true,slidesPerView:1,autoplay:{delay:4500},pagination:{el:'.swiper-pagination',clickable:true}});
    }
  }catch(e){console.warn('Swiper init failed',e)}

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

  // CTA hook to booking modal (handles any element with .open-booking)
  const bookingModal = document.getElementById('bookingModal');
  if(bookingModal){
    document.querySelectorAll('.open-booking').forEach(el=>{
      el.addEventListener('click', (e)=>{ e.preventDefault(); new bootstrap.Modal(bookingModal).show(); });
    });
  }
});
