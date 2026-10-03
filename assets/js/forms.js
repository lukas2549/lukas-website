document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('enquiryStatus');
  const submitButton = form.querySelector('[type="submit"]');
  const goalSelect = form.elements.goal;
  const whatsappLink = document.getElementById('whatsappContact');
  const honeypot = form.elements.website;

  function updateWhatsAppLink() {
    if (!whatsappLink) return;
    const number = window.SITE_CONFIG?.WHATSAPP_NUMBER || '2547XXXXXXXX';
    const message = `Hi Lucas, I'm interested in ${goalSelect.value} coaching.`;
    whatsappLink.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  if (goalSelect) goalSelect.addEventListener('change', updateWhatsAppLink);
  updateWhatsAppLink();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    if (honeypot?.value.trim()) {
      status.textContent = 'Thanks. Your enquiry has been received.';
      return;
    }

    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    status.textContent = 'Sending your enquiry...';

    try {
      const payload = Object.fromEntries(new FormData(form));
      delete payload.website;
      const response = await fetch(window.SITE_CONFIG?.FORM_ENDPOINT || 'https://...', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Enquiry request failed');
      status.textContent = 'Thanks. Your enquiry has been sent.';
      form.reset();
      updateWhatsAppLink();
    } catch {
      status.textContent = 'We could not send your enquiry. Please try again or chat on WhatsApp.';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
});