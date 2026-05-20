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

  let onThemeChange = null;

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
      if (onThemeChange) onThemeChange();
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

  /* ─── NEURAL-NETWORK BACKGROUND ──────────────────── */
  function initNeuralBg() {
    const canvas = document.getElementById('neural-bg');
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const MAX_DIST = 130;
    const MOUSE_INFLUENCE = 130;
    const MOUSE_TRIGGER = 28;
    let nodes = [];
    let pulses = [];
    let halos = [];
    let raf = 0;
    let running = false;
    let accentPrefix = 'rgba(200,169,110,';
    let strip = { x: 0, w: window.innerWidth };
    let mouse = { x: -9999, y: -9999, active: false };

    function readAccent() {
      const v = getComputedStyle(document.body).getPropertyValue('--accent').trim();
      if (!v || v[0] !== '#') return;
      let h = v.slice(1);
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      accentPrefix = 'rgba(' + r + ',' + g + ',' + b + ',';
    }

    function rgba(a) {
      return accentPrefix + a + ')';
    }

    function setSize() {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth, h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function measureStrip() {
      const main = document.querySelector('main');
      if (!main) {
        strip = { x: 0, w: window.innerWidth };
        return;
      }
      const rect = main.getBoundingClientRect();
      strip = { x: Math.round(rect.right + 32), w: window.innerWidth };
    }

    function initNodes() {
      const h = window.innerHeight;
      const stripW = strip.w - strip.x;
      if (stripW < 80) { nodes = []; pulses = []; halos = []; return; }
      const target = Math.max(30, Math.min(140, Math.round(stripW * h / 7000)));
      nodes = [];
      for (let i = 0; i < target; i++) {
        nodes.push({
          x: strip.x + Math.random() * stripW,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          size: 0.9 + Math.random() * 1.4,
          fire: 0,
          cooldown: Math.random() * 120,
        });
      }
      pulses = [];
      halos = [];
    }

    function fireNode(idx) {
      const a = nodes[idx];
      if (!a || a.cooldown > 0) return;
      a.fire = 1;
      a.cooldown = 140 + Math.random() * 100;
      halos.push({ x: a.x, y: a.y, age: 0, max: 55 });
      const cands = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === idx) continue;
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MAX_DIST * MAX_DIST) cands.push(j);
      }
      // shuffle
      for (let k = cands.length - 1; k > 0; k--) {
        const r = Math.floor(Math.random() * (k + 1));
        [cands[k], cands[r]] = [cands[r], cands[k]];
      }
      const n = Math.min(cands.length, 1 + Math.floor(Math.random() * 2));
      for (let k = 0; k < n; k++) {
        pulses.push({
          from: idx,
          to: cands[k],
          t: 0,
          speed: 0.012 + Math.random() * 0.018,
        });
      }
    }

    function frame() {
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < strip.x) { n.x = strip.x; n.vx *= -1; }
        if (n.x > strip.w) { n.x = strip.w; n.vx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; }
        if (n.y > h) { n.y = h; n.vy *= -1; }
        if (n.fire > 0) n.fire = Math.max(0, n.fire - 0.014);
        if (n.cooldown > 0) n.cooldown -= 1;
      }

      // mouse influence: brighten and optionally fire nearby nodes
      if (mouse.active) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = n.x - mouse.x, dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_INFLUENCE * MOUSE_INFLUENCE) {
            const d = Math.sqrt(d2);
            const f = (1 - d / MOUSE_INFLUENCE) * 0.55;
            if (n.fire < f) n.fire = f;
            if (d < MOUSE_TRIGGER) fireNode(i);
          }
        }
      }

      // faint connection web
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_DIST * MAX_DIST) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle = rgba((1 - d / MAX_DIST) * 0.05);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // firing halos (expanding ring)
      for (let i = halos.length - 1; i >= 0; i--) {
        const ho = halos[i];
        ho.age += 1;
        if (ho.age >= ho.max) { halos.splice(i, 1); continue; }
        const t = ho.age / ho.max;
        const r = 3 + t * 18;
        ctx.strokeStyle = rgba((1 - t) * 0.15);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ho.x, ho.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // pulses with lit traveled path
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        const a = nodes[p.from], b = nodes[p.to];
        if (!a || !b) { pulses.splice(i, 1); continue; }
        if (p.t >= 1) {
          if (Math.random() < 0.2) fireNode(p.to);
          pulses.splice(i, 1);
          continue;
        }
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const lit = ctx.createLinearGradient(a.x, a.y, x, y);
        lit.addColorStop(0, rgba(0));
        lit.addColorStop(0.7, rgba(0.06));
        lit.addColorStop(1, rgba(0.28));
        ctx.strokeStyle = lit;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 10);
        grad.addColorStop(0, rgba(0.4));
        grad.addColorStop(0.45, rgba(0.12));
        grad.addColorStop(1, rgba(0));
        ctx.fillStyle = grad;
        ctx.fillRect(x - 10, y - 10, 20, 20);
        ctx.fillStyle = rgba(0.55);
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes (with firing glow)
      for (const n of nodes) {
        if (n.fire > 0.05) {
          const gr = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 9);
          gr.addColorStop(0, rgba(0.3 * n.fire));
          gr.addColorStop(1, rgba(0));
          ctx.fillStyle = gr;
          ctx.fillRect(n.x - 9, n.y - 9, 18, 18);
        }
        ctx.fillStyle = rgba(0.22 + 0.4 * n.fire);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size * (1 + 0.35 * n.fire), 0, Math.PI * 2);
        ctx.fill();
      }

      // spontaneous firing
      if (Math.random() < 0.007 && nodes.length > 0) {
        fireNode(Math.floor(Math.random() * nodes.length));
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      if (window.innerWidth < 768) return;
      running = true;
      setSize();
      measureStrip();
      initNodes();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        stop();
        start();
      }, 150);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = e.clientX >= strip.x;
    });
    window.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) mouse.active = false;
    });

    readAccent();
    onThemeChange = readAccent;
    start();
  }

  /* ─── BOOT ────────────────────────────────────────── */
  // Script is loaded with `defer`, so the DOM is ready when this runs.
  initLang();
  initTheme();
  decorateExtLinks();
  initNeuralBg();
})();