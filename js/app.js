(function () {
  'use strict';

  /* ─── EXTERNAL LINK ICON (Iconoir arrow-up-right) ─── */
  const EXT_ICON = '<svg class="ext-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 19L19 6M19 6v12.48M19 6H6.52" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function decorateExtLinks() {
    const links = document.querySelectorAll('a[target="_blank"]');
    links.forEach((a) => {
      if (a.querySelector('.ext-icon')) return;
      const sr = a.querySelector('.vh');
      const icon = document.createRange().createContextualFragment(EXT_ICON);
      if (sr) a.insertBefore(icon, sr);
      else a.appendChild(icon);
    });
  }

  /* ─── THEME TOGGLE ───────────────────────────────── */
  const ICON_SUN  = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const ICON_MOON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function initTheme() {
    const btn = document.getElementById('toggle-theme');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const light = document.body.classList.toggle('light');
      const label = light ? 'Switch to dark mode' : 'Switch to light mode';
      btn.setAttribute('aria-pressed', light);
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.innerHTML = light ? ICON_MOON : ICON_SUN;
    });
  }


  const EN = {
    'skip':                'Skip to content',
    'name':                'Stefano Carotenuto',
    'intro':               'Designer and street photographer.',
    'about-heading':       'At a glance',
    'short-bio':           'Born and raised in Naples, now based in Milan.',
    'role':                'At the Italian National Research Council (CNR), I lead the digital communication strategy for the <a href="https://www.dsu.cnr.it" target="_blank" rel="noopener noreferrer">Department of Social Sciences, Humanities and Cultural Heritage<span class="vh"> (opens in new tab)</span></a>.',
    'link-email-work':     'Work email',
    'photo-heading':       'On the street',
    'photo-intro':         'In my spare time, I take photographs as I walk.',
    'photo-bio':           'My work has been praised by Magnum photographers Martin Parr and Steve McCurry. I’ve exhibited at the HistoryMiami Museum during Art Basel Miami, and some of my photographs have appeared in magazines such as Corriere della Sera’s Style Magazine. <a href="https://www.flaneurat.work/" target="_blank" rel="noopener noreferrer">Browse my photo diary<span class="vh"> (opens in new tab)</span></a>',
    'link-email-personal': 'Personal email',
    'footer-credit':       '© 2026 Stefano Carotenuto · Milan, Italy',
    'privacy':             'This site uses no cookies and collects no personal data. The typeface, Supria Sans, is served via Adobe Fonts (<a href="https://www.adobe.com/privacy/policies/adobe-fonts.html" target="_blank" rel="noopener noreferrer">privacy policy<span class="vh"> (opens in new tab)</span></a>).',
  };

  const IT = {};

  function snapshotIT() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      IT[key] = el.innerHTML.trim();
    });
  }

  function applyLang(lang) {
    const dict = lang === 'en' ? EN : IT;
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll('.lang-toggle button[data-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
    });
    decorateExtLinks();
  }

  function initLang() {
    snapshotIT();

    let stored = null;
    try { stored = localStorage.getItem('lang'); } catch (e) {}
    const nav = (navigator.language || 'it').toLowerCase();
    const detected = nav.startsWith('en') ? 'en' : 'it';
    const initial = stored === 'en' || stored === 'it' ? stored : detected;

    applyLang(initial);

    document.querySelectorAll('.lang-toggle button[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyLang(btn.dataset.lang);
        try { localStorage.setItem('lang', btn.dataset.lang); } catch (e) {}
      });
    });
  }

  /* ─── BOOT ────────────────────────────────────────── */
  // Script is loaded with `defer`, so the DOM is ready when this runs.
  initLang();
  initTheme();
  decorateExtLinks();
})();