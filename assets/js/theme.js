// theme.js — theme switching and persistence
document.addEventListener('DOMContentLoaded', () => {
  const key = 'site-theme';
  const stored = localStorage.getItem(key);
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme = stored || (prefersDark ? 'dark' : 'light');
  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(key, t);
    document.body.classList.toggle('theme-dark', t === 'dark');
    document.body.classList.toggle('theme-light', t === 'light');
    // update toggle icon if present
    const btn = document.getElementById('themeToggle');
    if(btn) btn.innerHTML = t === 'dark' ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
    // adjust document-level CSS variables for robust contrast (in case components use inline tokens)
    if(t === 'light'){
      document.documentElement.style.setProperty('--bg', '#FFFFFF');
      document.documentElement.style.setProperty('--text', '#172033');
      document.documentElement.style.setProperty('--surface', '#F6F8FB');
      document.documentElement.style.setProperty('--btn-text', '#FFFFFF');
    } else {
      document.documentElement.style.setProperty('--bg', '#070B14');
      document.documentElement.style.setProperty('--text', '#FFFFFF');
      document.documentElement.style.setProperty('--surface', '#111A2E');
      document.documentElement.style.setProperty('--btn-text', '#FFFFFF');
    }
  }
  applyTheme(defaultTheme);
  window.toggleTheme = function(){
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };
  document.addEventListener('click', (e)=>{
    const target = e.target;
    if(target && (target.id === 'themeToggle' || target.closest && target.closest('#themeToggle'))){
      e.preventDefault(); window.toggleTheme();
    }
  });
});
