document.addEventListener('DOMContentLoaded', () => {
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (revealItems.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(openItem => openItem.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const buttons = group.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll(`[data-filter-card="${group.dataset.filterGroup}"]`);
    buttons.forEach(button => button.addEventListener('click', () => {
      buttons.forEach(option => option.classList.remove('is-active'));
      button.classList.add('is-active');
      const filter = button.dataset.filter;
      cards.forEach(card => {
        card.hidden = filter !== 'all' && card.dataset.category !== filter;
      });
    }));
  });
});
