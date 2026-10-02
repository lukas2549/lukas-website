document.addEventListener('DOMContentLoaded', function () {
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
        <a class="btn btn-primary magnetic" href="contact.html#contactForm">Discuss Your Goals</a>
        <button id="themeToggle" class="btn btn-outline" aria-label="Toggle theme"><i class="fas fa-moon"></i></button>
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
        <div style="margin-top:28px"><a href="contact.html#contactForm" class="btn btn-primary">Discuss Your Goals</a></div>
      </div>
    </div>
  `;

  // Insert nav at top of body
  document.body.insertBefore(nav, document.body.firstChild);
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Ensure theme toggle displays correct icon according to current theme
  const _currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('site-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const _themeBtn = document.getElementById('themeToggle');
  if(_themeBtn){
    _themeBtn.innerHTML = _currentTheme === 'dark' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
  }

  const navToggle = document.getElementById('navToggle');
  const navOverlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');

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
