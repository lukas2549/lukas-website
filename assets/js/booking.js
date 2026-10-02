// Booking form handler — stores booking in localStorage and shows summary

document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('bookingForm');
  if(!form) return;
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const program = document.getElementById('bookingProgram')?.value || document.getElementById('programSelect')?.value || '';
    const date = document.getElementById('bookingDate')?.value || '';
    const time = document.getElementById('bookingTime')?.value || '';
    const name = document.getElementById('bookingName')?.value || '';
    const phone = document.getElementById('bookingPhone')?.value || document.getElementById('bookingPhone')?.value || '';

    const booking = {id:Date.now(), program, date, time, name, phone};
    const list = JSON.parse(localStorage.getItem('bookings')||'[]');
    list.push(booking);localStorage.setItem('bookings', JSON.stringify(list));

    // show summary
    const summary = document.getElementById('bookingSummary');
    if(summary){
      summary.classList.remove('d-none');
      summary.innerHTML = `<div class="p-3 card-glass">Booking Confirmed<br><strong>${name}</strong><br>${program} — ${date} ${time}</div>`;
    }

    // Close modal after short delay
    setTimeout(()=>{
      const modalEl = document.getElementById('bookingModal');
      const bs = bootstrap.Modal.getInstance(modalEl);
      if(bs) bs.hide();
    },900);
  });
});
