/* ─────────────────────────────────────────
   app.js — Stefano Carotenuto Personal Site
───────────────────────────────────────── */

/* ─── EMAIL ANTI-SCRAPING ─────────────── */
(function () {
  const u = 'stefano.carotenuto'; /* ← sostituisci con la parte reale */
  const d = 'gmail.com';          /* ← sostituisci con il dominio reale */
  const link = document.getElementById('email-link');
  if (link) {
    link.href = 'mailto:' + u + '@' + d;
    link.textContent = 'Email';
  }
})();


/* ─── SPLIDE — PHOTOGRAPHY SLIDER ────── */
const countEl = document.getElementById('photo-count');

const splide = new Splide('#photo-slider', {
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

document.getElementById('photo-prev')
  .addEventListener('click', () => splide.go('<'));
document.getElementById('photo-next')
  .addEventListener('click', () => splide.go('>'));

function updateCount(i) {
  countEl.textContent = (i + 1) + '\u2009/\u2009' + splide.length;
}
splide.on('move',  updateCount);
splide.on('moved', updateCount);

splide.mount();

/* Set initial counter from Splide (avoid hardcoded total) */
countEl.textContent = '1\u2009/\u2009' + splide.length;


/* ─── LAZY VIDEO — click to play ───────── */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.work-item');

  items.forEach(item => {
    const video = item.querySelector('video[data-lazy-video]');
    if (!video) return;

    if (prefersReduced) return;

    /* Lazy-load source on first intersection */
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const source = video.querySelector('source[data-src]');
        if (source) {
          source.src = source.dataset.src;
          source.removeAttribute('data-src');
          video.load();
          video.preload = 'auto';
        }
        lazyObserver.unobserve(entry.target);
      });
    }, { rootMargin: '600px' });

    lazyObserver.observe(item);

    /* Play / pause toggle button */
    const btn = document.createElement('button');
    btn.className = 'work-media-toggle';
    btn.setAttribute('data-paused', '');
    btn.setAttribute('aria-label', 'Play video');
    btn.innerHTML =
      '<svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6z"/><path d="M14 4h4v16h-4z"/></svg>' +
      '<svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
    item.querySelector('.work-media').appendChild(btn);

    btn.addEventListener('click', () => {
      if (video.paused) {
        video.currentTime = 0;
        video.play().catch(() => {});
        video.classList.add('is-playing');
        btn.removeAttribute('data-paused');
        btn.setAttribute('aria-label', 'Pause video');
      } else {
        video.pause();
        video.classList.remove('is-playing');
        btn.setAttribute('data-paused', '');
        btn.setAttribute('aria-label', 'Play video');
      }
    });
  });
})();


/* ─── SCROLL SPY ──────────────────────
   - aggiorna aria-current sui link nav
   - aggiorna il dot attivo nella sidebar
   - toggling dark-zone sull'header
───────────────────────────────────────── */
const sections     = document.querySelectorAll('section[id]');
const navLinks     = document.querySelectorAll('.site-nav a');
const progressDots = document.querySelectorAll('.progress-dot');
const header       = document.getElementById('site-header');

let activeId = '';
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target._ratio = entry.intersectionRatio;
  });

  let best = null;
  let bestRatio = 0;
  sections.forEach(s => {
    const r = s._ratio || 0;
    if (r > bestRatio) { bestRatio = r; best = s; }
  });

  if (!best || best.id === activeId) return;
  activeId = best.id;

  navLinks.forEach(a => {
    a.setAttribute('aria-current',
      a.getAttribute('href') === '#' + activeId ? 'true' : 'false');
  });

  progressDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.target === activeId);
  });

  header.classList.toggle('dark-zone', activeId === 'photography');
}, {
  threshold:  [0, 0.1, 0.2, 0.3, 0.5],
  rootMargin: '-56px 0px 0px 0px',
});

sections.forEach(s => observer.observe(s));

/* Progress dots are display-only — no click interaction */

/* ─── SMOOTH SCROLL solo per link anchor ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ─── CV TABS — ARIA COMPLIANT ────────── */
const tabs   = document.querySelectorAll('.cv-tab[role="tab"]');
const panels = document.querySelectorAll('.cv-panel[role="tabpanel"]');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.getAttribute('aria-controls'))
      .classList.add('active');
  });

  /* Keyboard navigation — frecce direzionali */
  tab.addEventListener('keydown', (e) => {
    const idx = [...tabs].indexOf(tab);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = tabs[(idx + 1) % tabs.length];
      next.focus(); next.click();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
      prev.focus(); prev.click();
    }
  });
});


/* ─── MOBILE NAV TOGGLE ───────────────── */
const toggle = document.querySelector('.nav-toggle');
const nav    = document.getElementById('site-nav');

function closeNav() {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.focus();
}

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open) {
    /* Move focus to first link when opening */
    const first = nav.querySelector('a');
    if (first) first.focus();
  }
});

nav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeNav);
});

/* Focus trap & Escape key when nav is open */
document.addEventListener('keydown', (e) => {
  if (!nav.classList.contains('open')) return;

  if (e.key === 'Escape') {
    e.preventDefault();
    closeNav();
    return;
  }

  if (e.key === 'Tab') {
    const focusable = [toggle, ...nav.querySelectorAll('a')].filter(Boolean);
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

/* ─── HERO DIAGRAM — Sticky notes → UI wireframe ── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ease       = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const easeSmooth = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  const spring     = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const easeCursor = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

  const $ = id => document.getElementById(id);

  const svg       = $('hero-svg');
  const replayBtn = $('hero-replay');
  if (!svg || !replayBtn) return;

  const initialSVG = svg.innerHTML;
  let controller   = null;
  let animationDone = false;

  /* ── Timeline utilities ── */

  function anim(el, keyframes, opts) {
    if (!el) return Promise.resolve();
    return el.animate(keyframes, opts).finished;
  }

  function wait(ms, signal) {
    return new Promise((resolve, reject) => {
      const id = setTimeout(resolve, ms);
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(id);
          reject(new DOMException('Aborted', 'AbortError'));
        }, { once: true });
      }
    });
  }

  function parallel() {
    return Promise.all(Array.from(arguments));
  }

  /* ── Drawing helpers ── */

  function drawInLine(id, targetOpacity, duration, delayMs, signal) {
    const el = $(id);
    if (!el) return Promise.resolve();
    const dx = parseFloat(el.getAttribute('x2')) - parseFloat(el.getAttribute('x1'));
    const dy = parseFloat(el.getAttribute('y2')) - parseFloat(el.getAttribute('y1'));
    const len = Math.sqrt(dx * dx + dy * dy);
    el.setAttribute('stroke-dasharray', len);
    el.setAttribute('stroke-dashoffset', len);
    return wait(delayMs, signal).then(() =>
      anim(el, [{ opacity: 0, strokeDashoffset: len },
                { opacity: targetOpacity, strokeDashoffset: 0 }],
        { duration, easing: ease, fill: 'forwards' })
    );
  }

  /* ── Sticky note data ── */

  const stickyIds = ['sn-1','sn-2','sn-3','sn-4','sn-5','sn-6'];
  const rotations = [-3, 2.5, -4, 3.5, -2, 4];

  // Centers of each sticky (x + w/2, y + h/2) for convergence calc
  const centers = [
    [81, 73], [189, 52], [285, 82.5], [108, 181.5], [246, 168], [164, 257]
  ];

  // Wireframe center point — stickies converge toward this
  const target = [180, 158];

  /* ═══════════════════════════════════════
     RUN ANIMATION
     ═══════════════════════════════════════ */
  async function runAnimation() {
    animationDone = false;
    replayBtn.classList.remove('visible');

    controller = new AbortController();
    const { signal } = controller;

    const stickies = stickyIds.map(id => $(id));
    if (!stickies[0]) return;

    try {

      /* ── PHASE 1 — Research wall: sticky notes appear ── */

      await parallel(
        ...stickies.map((s, i) =>
          wait(i * 180, signal).then(() =>
            anim(s, [
              { opacity: 0, transform: `scale(0.5) rotate(${rotations[i]}deg)` },
              { opacity: 1, transform: `scale(1) rotate(${rotations[i]}deg)` }
            ], { duration: 300, easing: spring, fill: 'forwards' })
          )
        )
      );

      await wait(350, signal);   // let the wall breathe

      /* ── PHASE 2 — Synthesis: stickies converge + fade ── */

      // Converge toward wireframe center (60% of the way)
      await parallel(
        ...stickies.map((s, i) => {
          const tx = (target[0] - centers[i][0]) * 0.6;
          const ty = (target[1] - centers[i][1]) * 0.6;
          return anim(s, [
            { transform: `rotate(${rotations[i]}deg)` },
            { transform: `rotate(0deg) translate(${tx.toFixed(0)}px, ${ty.toFixed(0)}px)` }
          ], { duration: 500, easing: easeSmooth, fill: 'forwards' });
        })
      );

      // Stickies fade out
      await parallel(
        ...stickies.map((s, i) =>
          anim(s, [{ opacity: 1 }, { opacity: 0 }],
            { duration: 280, delay: i * 25, easing: 'ease', fill: 'forwards' })
        )
      );

      /* ── PHASE 3 — Build: wireframe materialises ── */

      // Frame draw-in
      const frame = $('ui-frame');
      let frameP = Promise.resolve();
      if (frame) {
        const perim = 2 * (256 + 264);
        frame.setAttribute('stroke-dasharray', perim);
        frame.setAttribute('stroke-dashoffset', perim);
        frameP = anim(frame,
          [{ opacity: 0, strokeDashoffset: perim }, { opacity: 0.55, strokeDashoffset: 0 }],
          { duration: 950, easing: ease, fill: 'forwards' });
      }

      // Structural lines (header + sidebar)
      const structP = [
        drawInLine('ui-header', 0.9, 500, 0, signal),
        drawInLine('ui-sidebar', 0.8, 500, 100, signal)
      ];

      // Window dots + logo + avatar
      const headerP = [
        ...['ui-d1','ui-d2','ui-d3'].map((id, i) =>
          wait(200 + i * 60, signal).then(() =>
            anim($(id), [{ opacity: 0 }, { opacity: 0.85 }],
              { duration: 220, easing: 'ease', fill: 'forwards' })
          )
        ),
        drawInLine('ui-logo', 0.8, 250, 280, signal),
        wait(320, signal).then(() =>
          anim($('ui-avatar'), [{ opacity: 0 }, { opacity: 0.5 }],
            { duration: 250, easing: 'ease', fill: 'forwards' })
        )
      ];

      // Sidebar section 1: label + active dot + nav items
      const nav1P = [
        drawInLine('ui-sl1', 0.35, 200, 300, signal),
        wait(350, signal).then(() =>
          anim($('ui-nav-dot'), [{ opacity: 0 }, { opacity: 0.7 }],
            { duration: 180, easing: 'ease', fill: 'forwards' })
        ),
        ...['ui-sn1','ui-sn2','ui-sn3'].map((id, i) =>
          drawInLine(id, 0.7, 300, 350 + i * 70, signal)
        )
      ];

      // Sidebar section 2: label + nav items
      const nav2P = [
        drawInLine('ui-sl2', 0.35, 200, 560, signal),
        ...['ui-sn4','ui-sn5'].map((id, i) =>
          drawInLine(id, 0.7, 300, 620 + i * 70, signal)
        )
      ];

      // Content heading + divider
      const headP = [
        drawInLine('ui-h1', 1, 350, 400, signal),
        drawInLine('ui-h2', 0.8, 300, 480, signal),
        drawInLine('ui-divider', 0.35, 250, 560, signal)
      ];

      // Text lines
      const textP = ['ui-t1','ui-t2','ui-t3','ui-t4'].map((id, i) =>
        drawInLine(id, 0.4, 280, 600 + i * 60, signal)
      );

      // Cards + inner details
      const cardP = [
        ...['ui-c1','ui-c2'].map((id, i) =>
          wait(800 + i * 120, signal).then(() =>
            anim($(id),
              [{ opacity: 0, transform: 'scale(0.75)' }, { opacity: 0.5, transform: 'scale(1)' }],
              { duration: 350, easing: spring, fill: 'forwards' })
          )
        ),
        ...['ui-ct1','ui-ct2'].map((id, i) =>
          drawInLine(id, 0.6, 250, 950 + i * 120, signal)
        ),
        ...['ui-cd1','ui-cd2'].map((id, i) =>
          drawInLine(id, 0.3, 200, 1020 + i * 120, signal)
        )
      ];

      // Buttons
      const b1 = $('ui-b1'), b2 = $('ui-b2');
      const btnP = [
        wait(1100, signal).then(() =>
          anim(b1, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 0.3, transform: 'scaleX(1)' }],
            { duration: 350, easing: spring, fill: 'forwards' })
        ),
        wait(1170, signal).then(() =>
          anim(b2, [{ opacity: 0, transform: 'scaleX(0)' }, { opacity: 0.5, transform: 'scaleX(1)' }],
            { duration: 350, easing: spring, fill: 'forwards' })
        )
      ];

      await parallel(frameP, ...structP, ...headerP, ...nav1P, ...nav2P,
                      ...headP, ...textP, ...cardP, ...btnP);

      /* ── PHASE 4 — Validate: cursor interactions ── */
      await wait(250, signal);

      const cursor = $('ui-cursor');
      if (!cursor) { animationDone = true; replayBtn.classList.add('visible'); return; }

      // Cursor appears top-right of frame
      cursor.setAttribute('transform', 'translate(280 40)');
      await anim(cursor, [{ opacity: 0 }, { opacity: 1 }],
        { duration: 200, easing: 'ease', fill: 'forwards' });

      // Move to nav item sn2
      await anim(cursor,
        [{ transform: 'translate(280px, 40px)' }, { transform: 'translate(86px, 106px)' }],
        { duration: 350, easing: easeCursor, fill: 'forwards' });

      // Nav hover highlight (mauve / sign)
      await parallel(
        anim($('ui-hl-nav'), [{ opacity: 0 }, { opacity: 0.12 }],
          { duration: 150, easing: 'ease', fill: 'forwards' }),
        anim($('ui-sn2'),
          [{ stroke: 'var(--muted)' }, { stroke: 'var(--ink)' }],
          { duration: 150, easing: 'ease', fill: 'forwards' })
      );

      await wait(70, signal);

      // Move to card 1
      await anim(cursor,
        [{ transform: 'translate(86px, 106px)' }, { transform: 'translate(176px, 202px)' }],
        { duration: 400, easing: easeCursor, fill: 'forwards' });

      // Card hover (blue / object) + nav unhover
      await parallel(
        anim($('ui-hl-nav'), [{ opacity: 0.12 }, { opacity: 0 }],
          { duration: 200, easing: 'ease', fill: 'forwards' }),
        anim($('ui-sn2'),
          [{ stroke: 'var(--ink)' }, { stroke: 'var(--muted)' }],
          { duration: 200, easing: 'ease', fill: 'forwards' }),
        anim($('ui-hl-card'), [{ opacity: 0 }, { opacity: 0.08 }],
          { duration: 150, easing: 'ease', fill: 'forwards' }),
        anim($('ui-c1'),
          [{ stroke: 'var(--rule)' }, { stroke: 'var(--ink)' }],
          { duration: 150, easing: 'ease', fill: 'forwards' })
      );

      await wait(50, signal);

      // Move to ghost button
      await anim(cursor,
        [{ transform: 'translate(176px, 202px)' }, { transform: 'translate(234px, 252px)' }],
        { duration: 300, easing: easeCursor, fill: 'forwards' });

      // Card unhover
      anim($('ui-hl-card'), [{ opacity: 0.08 }, { opacity: 0 }],
        { duration: 200, easing: 'ease', fill: 'forwards' });
      anim($('ui-c1'),
        [{ stroke: 'var(--ink)' }, { stroke: 'var(--rule)' }],
        { duration: 200, easing: 'ease', fill: 'forwards' });

      await wait(40, signal);

      // Click press
      await anim(cursor,
        [{ transform: 'translate(234px, 252px) scale(1)' },
         { transform: 'translate(234px, 252px) scale(0.85)' },
         { transform: 'translate(234px, 252px) scale(1)' }],
        { duration: 120, easing: 'ease', fill: 'forwards' });

      // Button fills teal + checkmark draws
      const check = $('ui-check');
      let checkP = Promise.resolve();
      if (check) {
        const pts = check.points;
        let len = 0;
        for (let i = 1; i < pts.numberOfItems; i++) {
          const a = pts.getItem(i - 1), b = pts.getItem(i);
          len += Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
        }
        check.setAttribute('stroke-dasharray', len);
        check.setAttribute('stroke-dashoffset', len);
        checkP = wait(150, signal).then(() =>
          anim(check, [{ opacity: 0, strokeDashoffset: len }, { opacity: 1, strokeDashoffset: 0 }],
            { duration: 300, easing: ease, fill: 'forwards' })
        );
      }

      await parallel(
        anim($('ui-btn-fill'), [{ opacity: 0 }, { opacity: 1 }],
          { duration: 300, easing: ease, fill: 'forwards' }),
        anim(b2, [{ stroke: 'var(--ink)' }, { stroke: 'var(--c-int)' }],
          { duration: 300, easing: ease, fill: 'forwards' }),
        checkP
      );

      // Cursor fades out
      await anim(cursor, [{ opacity: 1 }, { opacity: 0 }],
        { duration: 200, easing: 'ease', fill: 'forwards' });

      // Done
      animationDone = true;
      replayBtn.classList.add('visible');

    } catch (e) {
      if (e.name === 'AbortError') return;
      throw e;
    }
  }

  /* ═══════════════════════════════════════
     RESET & REPLAY
     ═══════════════════════════════════════ */
  function resetAndReplay() {
    if (controller) controller.abort();
    svg.getAnimations({ subtree: true }).forEach(a => a.cancel());
    svg.innerHTML = initialSVG;
    runAnimation();
  }

  replayBtn.addEventListener('click', resetAndReplay);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (controller) controller.abort();
    } else if (!animationDone) {
      resetAndReplay();
    }
  });

  runAnimation();
})();

