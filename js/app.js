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

  /* ─── LANGUAGE TOGGLE (IT default in HTML, EN overlay) ───
     Italian content lives in the HTML (source of truth, also seen by
     no-JS visitors and search engines). English is applied as an overlay
     from the EN dictionary below. The original IT strings are snapshotted
     from the DOM at boot, so switching IT → EN → IT is lossless. */
  const EN = {
    'skip':              'Skip to content',
    'name':              'Stefano Carotenuto',
    'intro':             'Designer and street photographer. I live and work in Milan.',
    'about-heading':     'At a glance',
    'role':              'I work at the Italian National Research Council (CNR), where I currently lead the digital communication strategy of the <a href="https://www.dsu.cnr.it" target="_blank" rel="noopener noreferrer">Department of Social Sciences, Humanities and Cultural Heritage<span class="vh"> (opens in new tab)</span></a>.',
    'link-email-work':   'Work email',
    'photo-heading':     'On the street',
    'photo-intro':       'In my spare time, I photograph as I wander.',
    'photo-bio':         'My photographs have been recognised by Magnum photographers Martin Parr and Steve McCurry. I’ve exhibited at the HistoryMiami Museum during Art Basel Miami and some of my work has appeared in magazines such as Corriere della Sera Style Magazine. <a href="https://www.flaneurat.work/" target="_blank" rel="noopener noreferrer">Have a look at my photo diary<span class="vh"> (opens in new tab)</span></a>',
    'link-email-personal': 'Personal email',
    'footer-credit':     '© 2026 Stefano Carotenuto · Milan, Italy',
    'privacy':           'This site uses no cookies and collects no personal data. The Supria Sans font is loaded via Adobe Fonts (<a href="https://www.adobe.com/privacy/policies/adobe-fonts.html" target="_blank" rel="noopener noreferrer">privacy policy<span class="vh"> (opens in new tab)</span></a>).',
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
    try { localStorage.setItem('lang', lang); } catch (_) {}
    decorateExtLinks();
  }

  function initLang() {
    snapshotIT();
    let saved = null;
    try { saved = localStorage.getItem('lang'); } catch (_) {}
    const lang = saved || ((navigator.language || 'it').toLowerCase().startsWith('en') ? 'en' : 'it');
    if (lang === 'en') {
      applyLang('en');
    } else {
      document.documentElement.setAttribute('lang', 'it');
    }
    document.querySelectorAll('.lang-toggle button[data-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
  }

  /* ─── BOOT ────────────────────────────────────────── */
  function boot() {
    initLang();
    initTheme();
    decorateExtLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();