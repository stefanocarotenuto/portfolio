(function () {
  'use strict';

  /* ─── EXTERNAL LINK ICON (Iconoir arrow-up-right) ─── */
  const EXT_ICON = '<svg class="ext-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 19L19 6M19 6v12.48M19 6H6.52" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* L'icona e' inline-block, e un browser puo' spezzare la riga su
     entrambi i suoi lati. A sinistra basta legarla all'ultima parola
     dentro uno span nowrap. A destra lo span non serve, perche' la
     punteggiatura che segue sta fuori dal link e nessun elemento puo'
     attraversare </a>: si chiude con un WORD JOINER (U+2060), che per
     UAX #14 vieta l'interruzione prima e dopo di se'. Uno spazio
     successivo resta comunque un punto di a capo valido. */
  const WJ = '\u2060';
  // Scende anche nei discendenti: il testo di un link puo' stare dentro uno
  // span, non solo direttamente dentro <a>.
  function lastTextNodeBefore(parent, stop) {
    let last = null;
    const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (stop && stop.contains(node)) break;
      if (node.textContent.trim()) last = node;
    }
    return last;
  }

  function decorateExtLinks() {
    const links = document.querySelectorAll('a[target="_blank"]');
    links.forEach((a) => {
      if (a.querySelector('.ext-icon')) return;
      // Un link fatto solo di immagini (l'anteprima del diario) non ha una
      // parola a cui legare la freccia, e li` la freccia non direbbe niente.
      if (!a.textContent.trim()) return;
      const sr = a.querySelector('.vh');
      const icon = document.createRange().createContextualFragment(EXT_ICON);

      const textNode = lastTextNodeBefore(a, sr);
      const tail = textNode && textNode.textContent.match(/(\S+)\s*$/);
      if (tail) {
        const keep = document.createElement('span');
        keep.className = 'nowrap';
        keep.textContent = tail[1];
        keep.appendChild(icon);
        keep.appendChild(document.createTextNode(WJ));
        textNode.textContent = textNode.textContent.slice(0, tail.index);
        textNode.parentNode.insertBefore(keep, textNode.nextSibling);
        return;
      }

      icon.appendChild(document.createTextNode(WJ));
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
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');

    function render(light) {
      const label = light ? 'Switch to dark mode' : 'Switch to light mode';
      btn.setAttribute('aria-pressed', light);
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.innerHTML = light ? ICON_MOON : ICON_SUN;
      if (meta) meta.setAttribute('content', light ? '#ecedfb' : '#191a37');
    }

    // The inline <head> script may have applied the stored theme before paint.
    render(root.classList.contains('light'));

    btn.addEventListener('click', () => {
      const light = root.classList.toggle('light');
      render(light);
      try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
    });
  }


  const EN = {
    'skip':                'Skip to content',
    'intro':               'Designer and street photographer.',
    'about-heading':       'At the CNR',
    'short-bio':           'Born and raised in Naples, now based in Milan. With a degree in digital communication, I design websites and services for public research.',
    'role':                'At the Italian National Research Council (CNR) I’m <b>head of institutional communication</b> for the <a href="https://www.dsu.cnr.it" target="_blank" rel="noopener noreferrer">Department of Social Sciences, Humanities and Cultural Heritage<span class="vh"> (opens in new tab)</span></a>.',
    'project':             'On behalf of the institute I <b>lead the web and social media communication task</b> of <span class="nowrap">SSHOpenCloud-IT</span>, the PN&nbsp;RIC project putting social sciences and humanities data to work for the digital development of Southern Italy.',
    'lab':                 'At the Institute for Studies on the Mediterranean (CNR-ISMed) I’m part of the Mediterranean Digital Humanities Lab, which builds digital projects for the humanities — among them <a href="https://wemed.cnr.it" target="_blank" rel="noopener noreferrer">WeMed<span class="vh"> (opens in new tab)</span></a>, a statistical platform on the Mediterranean developed with Istat.',
    'link-email-work':     'Work email',
    'photo-heading':       'On the street',
    'photo-intro':         'In my spare time I walk with a camera in my pocket.',
    'photo-bio':           'My work has been praised by Magnum photographers <b>Martin&nbsp;Parr and Steve&nbsp;McCurry</b>. I’ve exhibited at the HistoryMiami Museum during Art Basel Miami, and some of my photographs have appeared in magazines such as Corriere della Sera’s Style Magazine.',
    'link-email-personal': 'Personal email',
    'link-diary':          'Photo diary<span class="vh"> (opens in new tab)</span>',
    'link-linkedin':       'LinkedIn<span class="vh"> (opens in new tab)</span>',
    'avatar-alt':          'Portrait of Stefano Carotenuto',
    'footer-credit':       '© 2026 Stefano Carotenuto · Milan, Italy',
    'privacy':             'This site uses no cookies and collects no personal data. The typeface, Supria Sans, is served via Adobe Fonts (<a href="https://www.adobe.com/privacy/policies/adobe-fonts.html" target="_blank" rel="noopener noreferrer">privacy policy<span class="vh"> (opens in new tab)</span></a>).',
  };

  const IT = {};

  function snapshotIT() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      IT[key] = el.innerHTML.trim();
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      IT[el.getAttribute('data-i18n-alt')] = el.getAttribute('alt');
    });
  }

  function applyLang(lang) {
    const dict = lang === 'en' ? EN : IT;
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const key = el.getAttribute('data-i18n-alt');
      if (dict[key] != null) el.setAttribute('alt', dict[key]);
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