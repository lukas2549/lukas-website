document.addEventListener('DOMContentLoaded', function () {
  const nav = document.createElement('header');
  nav.className = 'nav nav-modern';
  nav.innerHTML = `
    <div class="container nav-inner">
      <a href="index.html" class="nav-brand" aria-label="Lucas Training home">
        <span class="nav-icon" aria-hidden="true"><i class="fas fa-dumbbell"></i></span>
        <span class="nav-title"><span class="brand-lucas text-primary">Lucas</span> <span class="brand-training text">Training</span></span>
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
        <button class="btn btn-primary magnetic" id="bookNow">Book Session</button>
        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">
          <span class="hamburger"><span></span><span></span><span></span></span>
        </button>
      </div>
    </div>
    <div class="nav-mobile-overlay" id="navOverlay" aria-hidden="true">
      <div class="nav-mobile-inner">
        <button class="nav-mobile-close" id="navClose" aria-label="Close menu">&times;</button>
        <ul class="mobile-links" role="menu">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="programs.html">Programs</a></li>
          <li><a href="transformations.html">Transformations</a></li>
          <li><a href="testimonials.html">Testimonials</a></li>
          <li><a href="blog.html">Blog</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
        <div style="margin-top:28px"><a href="contact.html" class="btn btn-primary">Book Session</a></div>
      </div>
    </div>
  `;

  // Insert nav at top of body
  document.body.insertBefore(nav, document.body.firstChild);

  const navToggle = document.getElementById('navToggle');
  const navOverlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');
  const bookNow = document.getElementById('bookNow');

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
  }

  navToggle.addEventListener('click', function () {
    if (navOverlay.classList.contains('open')) closeMobile(); else openMobile();
  });
  navClose.addEventListener('click', closeMobile);
  navOverlay.addEventListener('click', function (e) { if (e.target === navOverlay) closeMobile(); });

  // Book button opens existing booking modal if present
  if (bookNow) bookNow.addEventListener('click', () => {
    const bookingModalEl = document.getElementById('bookingModal');
    if (bookingModalEl && window.bootstrap) new bootstrap.Modal(bookingModalEl).show(); else window.location.href = 'contact.html';
  });

  // Active link highlighting
  const links = document.querySelectorAll('.nav-links a');
  const path = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => { if (a.getAttribute('href') === path) a.classList.add('active'); });

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
    if (e.key === 'Escape' && navOverlay.classList.contains('open')) closeMobile();
  });
});
