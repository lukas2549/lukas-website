function initializeNavbar() {
  const renderNavbar = function () {
  const nav = document.createElement('header');
  nav.className = 'nav nav-modern';
  nav.innerHTML = `
    <div class="container nav-inner">
      <a href="index.html" class="nav-brand" aria-label="Lucas Trainer home">
        <span class="nav-icon" aria-hidden="true"><i class="fas fa-dumbbell"></i></span>
        <span class="nav-title"><span class="brand-lucas text-primary">Lucas</span> <span class="brand-training text">Trainer</span></span>
      </a>
      <nav aria-label="Primary navigation">
        <ul class="nav-links">
          <li><a href="index.html" class="nav-link">Home</a></li>
          <li><a href="about.html" class="nav-link">About</a></li>
          <li><a href="services.html" class="nav-link">Services</a></li>
          <li><a href="programs.html" class="nav-link">Programs</a></li>
          <li><a href="transformations.html" class="nav-link">Transformations</a></li>
          <li><a href="testimonials.html" class="nav-link">Testimonials</a></li>
          <li><a href="blog.html" class="nav-link">Blog</a></li>
          <li><a href="contact.html" class="nav-link">Contact</a></li>
        </ul>
      </nav>
      <div class="nav-actions">
        <a class="btn btn-primary magnetic" data-whatsapp-cta data-whatsapp-message="Hi Lucas, I'd like to book a training session." href="https://wa.me/2547XXXXXXXX">Book Session</a>
        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
          <span class="hamburger"><span></span><span></span><span></span></span>
        </button>
      </div>
    </div>
      <div class="nav-mobile-overlay" id="navOverlay" aria-hidden="true">
      <div class="nav-mobile-inner">
        <button class="nav-mobile-close" id="navClose" aria-label="Close menu">&times;</button>
        <ul class="mobile-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="programs.html">Programs</a></li>
          <li><a href="transformations.html">Transformations</a></li>
          <li><a href="testimonials.html">Testimonials</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
        <div style="margin-top:28px"><a class="btn btn-primary" data-whatsapp-cta data-whatsapp-message="Hi Lucas, I'd like to book a training session." href="https://wa.me/2547XXXXXXXX">Book Session</a></div>
      </div>
    </div>
  `;

  // Insert nav at top of body
  document.body.insertBefore(nav, document.body.firstChild);

  const navToggle = document.getElementById('navToggle');
  const navOverlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function openMobile() {
    navToggle.classList.add('open');
    navOverlay.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    navOverlay.setAttribute('aria-hidden', 'false');
  }
  function closeMobile() {
    navToggle.classList.remove('open');
    navOverlay.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    navOverlay.setAttribute('aria-hidden', 'true');
    navToggle.focus();
  }

  navToggle.addEventListener('click', function () {
    if (navOverlay.classList.contains('open')) closeMobile(); else openMobile();
  });
  navClose.addEventListener('click', closeMobile);
  navOverlay.addEventListener('click', function (e) { if (e.target === navOverlay) closeMobile(); });

  const whatsappNumber = window.SITE_CONFIG?.WHATSAPP_NUMBER || '2547XXXXXXXX';
  document.querySelectorAll('[data-whatsapp-cta]').forEach(link => {
    const message = link.dataset.whatsappMessage || 'Hi Lucas, I would like to ask about training.';
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  });

  // Active link highlighting
  const links = document.querySelectorAll('.nav-links a, .mobile-links a');
  const path = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href');
    const isActive = href === path;
    a.classList.toggle('active', isActive);
    if (isActive) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });

  // Scroll detection for shrink effect
  const header = document.querySelector('.nav-modern');
  const shrinkPoint = 60;
  function onScroll() {
    if (window.scrollY > shrinkPoint) header.classList.add('nav-scrolled'); else header.classList.remove('nav-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Keyboard accessibility for mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navOverlay.classList.contains('open')) {
      closeMobile();
    }
  });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderNavbar, { once: true });
  } else {
    renderNavbar();
  }
}

if (window.SITE_CONFIG) {
  initializeNavbar();
} else {
  const existingConfigScript = document.querySelector('script[src="assets/js/config.js"]');
  if (existingConfigScript) {
    existingConfigScript.addEventListener('load', initializeNavbar, { once: true });
    existingConfigScript.addEventListener('error', initializeNavbar, { once: true });
  } else {
    const configScript = document.createElement('script');
    configScript.src = 'assets/js/config.js';
    configScript.onload = initializeNavbar;
    configScript.onerror = initializeNavbar;
    document.head.appendChild(configScript);
  }
}
