(function () {
  'use strict';

  /* ─── EMAIL ANTI-SCRAPING ─────────────────────────── */
  function initEmail() {
    const link = document.getElementById('email-link');
    if (!link) return;
    link.href = 'mailto:stefano.carotenuto@gmail.com';
  }

  /* ─── PHOTOGRAPHY SLIDER ──────────────────────────── */
  function initSlider() {
    const root    = document.getElementById('photo-slider');
    const countEl = document.getElementById('photo-count');
    const prev    = document.getElementById('photo-prev');
    const next    = document.getElementById('photo-next');
    if (!root || typeof Splide === 'undefined') return;

    const splide = new Splide(root, {
      type:       'slide',
      perPage:    1,
      perMove:    1,
      gap:        0,
      speed:      420,
      easing:     'cubic-bezier(0.25,1,0.5,1)',
      pagination: false,
      arrows:     false,
      keyboard:   'global',
      i18n: {
        prev:   'Previous photo',
        next:   'Next photo',
        slideX: 'Go to photo %s',
      },
    });

    prev?.addEventListener('click', () => splide.go('<'));
    next?.addEventListener('click', () => splide.go('>'));

    function flash(btn) {
      if (!btn) return;
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 200);
    }

    let lastIndex = 0;
    splide.on('move', (i) => {
      if (countEl) countEl.textContent = (i + 1) + ' / ' + splide.length;
      flash(i > lastIndex ? next : prev);
      lastIndex = i;
    });

    splide.mount();
    if (countEl) countEl.textContent = '1 / ' + splide.length;
  }

  /* ─── THEME TOGGLE ───────────────────────────────── */
  const ICON_SUN  = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const ICON_MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function initTheme() {
    const btn = document.getElementById('toggle-theme');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const light = document.body.classList.toggle('light');
      btn.setAttribute('aria-pressed', light);
      btn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
      btn.innerHTML = light ? ICON_MOON : ICON_SUN;
    });
  }

  /* ─── BOOT ────────────────────────────────────────── */
  function boot() {
    initEmail();
    initSlider();
    initTheme();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
