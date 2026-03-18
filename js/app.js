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

/* ─── HERO DIAGRAM — From noise to clarity ── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ease       = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const easeSmooth = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  const spring     = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const easeCursor = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

  const $ = id => document.getElementById(id);

  const replayBtn = $('hero-replay');
  if (!replayBtn) return;

  /* ── Detect which SVG to animate ── */
  function getActiveSvg() {
    const mobile  = $('hero-svg-mobile');
    const desktop = $('hero-svg');
    if (mobile && getComputedStyle(mobile).display !== 'none') return { svg: mobile, mode: 'mobile' };
    if (desktop && getComputedStyle(desktop).display !== 'none') return { svg: desktop, mode: 'desktop' };
    return null;
  }

  /* ── Config per mode ── */
  const configs = {
    desktop: {
      noiseIds: ['nf-1','nf-2','nf-3','nf-4','nf-5','nf-6','nf-7','nf-8'],
      wireframeIds: [
        'ui-frame','ui-header','ui-d1','ui-d2','ui-d3','ui-url',
        'ui-logo','ui-nav1','ui-nav2','ui-nav3','ui-nav-line',
        'ui-h1','ui-h2','ui-divider',
        'ui-t1','ui-t2','ui-t3',
        'ui-c1','ui-c2','ui-c3','ui-ci1','ui-ci2','ui-ci3',
        'ui-ct1','ui-ct2','ui-ct3','ui-cd1','ui-cd2','ui-cd3',
        'ui-b2'
      ],
      finalState: {
        'ui-frame':0.55,'ui-header':0.9,
        'ui-d1':0.85,'ui-d2':0.85,'ui-d3':0.85,'ui-url':0.35,
        'ui-logo':0.8,'ui-nav1':0.7,'ui-nav2':0.7,'ui-nav3':0.7,'ui-nav-line':0.35,
        'ui-h1':1.0,'ui-h2':0.8,'ui-divider':0.35,
        'ui-t1':0.4,'ui-t2':0.4,'ui-t3':0.4,
        'ui-c1':0.5,'ui-c2':0.5,'ui-c3':0.5,
        'ui-ci1':0.15,'ui-ci2':0.15,'ui-ci3':0.15,
        'ui-ct1':0.6,'ui-ct2':0.6,'ui-ct3':0.6,
        'ui-cd1':0.3,'ui-cd2':0.3,'ui-cd3':0.3,
        'ui-b2':0.5
      },
      frameId: 'ui-frame',
      scatterRange: { x: [30, 330], y: [20, 300] },
      pointer: 'ui-cursor',
      btnId: 'ui-b2', btnFillId: 'ui-btn-fill', checkId: 'ui-check',
      particles: [
        { id: 'ui-p1', dx: -14, dy: -55 },
        { id: 'ui-p2', dx: 2,   dy: -65 },
        { id: 'ui-p3', dx: 16,  dy: -48 }
      ]
    },
    mobile: {
      noiseIds: ['mnf-1','mnf-2','mnf-3','mnf-4','mnf-5','mnf-6','mnf-7','mnf-8'],
      wireframeIds: [
        'mui-frame','mui-notch','mui-time','mui-signal',
        'mui-ham1','mui-ham2','mui-ham3','mui-logo','mui-nav-line',
        'mui-h1','mui-h2','mui-hero-img',
        'mui-t1','mui-t2','mui-t3',
        'mui-c1','mui-ci1','mui-ct1','mui-cd1',
        'mui-c2','mui-ci2','mui-ct2','mui-cd2',
        'mui-t4','mui-t5',
        'mui-b2',
        'mui-fdiv','mui-f1','mui-f2','mui-f3','mui-f4','mui-fdiv2','mui-f5',
        'mui-home'
      ],
      finalState: {
        'mui-frame':0.55,'mui-notch':0.35,'mui-time':0.4,'mui-signal':0.4,
        'mui-ham1':0.7,'mui-ham2':0.7,'mui-ham3':0.7,'mui-logo':0.8,'mui-nav-line':0.35,
        'mui-h1':1.0,'mui-h2':0.8,'mui-hero-img':0.15,
        'mui-t1':0.4,'mui-t2':0.4,'mui-t3':0.4,
        'mui-c1':0.5,'mui-ci1':0.15,'mui-ct1':0.6,'mui-cd1':0.3,
        'mui-c2':0.5,'mui-ci2':0.15,'mui-ct2':0.6,'mui-cd2':0.3,
        'mui-t4':0.4,'mui-t5':0.4,
        'mui-b2':0.5,
        'mui-fdiv':0.25,'mui-f1':0.3,'mui-f2':0.3,'mui-f3':0.3,'mui-f4':0.3,
        'mui-fdiv2':0.25,'mui-f5':0.25,
        'mui-home':0.35
      },
      frameId: 'mui-frame',
      scatterRange: { x: [10, 190], y: [10, 370] },
      pointer: 'mui-touch',
      scrollGroupId: 'mui-scroll-inner',
      scrollAmount: -110,
      btnId: 'mui-b2', btnFillId: 'mui-btn-fill', checkId: 'mui-check',
      particles: [
        { id: 'mui-p1', dx: -14, dy: -55 },
        { id: 'mui-p2', dx: 2,   dy: -65 },
        { id: 'mui-p3', dx: 16,  dy: -48 }
      ]
    }
  };

  let activeSvg = null;
  let initialSVGs = {};
  let controller   = null;
  let animationDone = false;

  // Cache initial HTML for both SVGs
  const svgDesktop = $('hero-svg');
  const svgMobile  = $('hero-svg-mobile');
  if (svgDesktop) initialSVGs.desktop = svgDesktop.innerHTML;
  if (svgMobile)  initialSVGs.mobile  = svgMobile.innerHTML;

  const semColors = ['var(--c-sign)', 'var(--c-obj)', 'var(--c-int)'];

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

  function getCenter(el) {
    const b = el.getBBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }

  function randRange(min, max) { return min + Math.random() * (max - min); }

  /* ═══════════════════════════════════════
     RUN ANIMATION
     ═══════════════════════════════════════ */
  async function runAnimation() {
    animationDone = false;
    replayBtn.classList.remove('visible');

    const active = getActiveSvg();
    if (!active) return;
    activeSvg = active;
    const { svg, mode } = active;
    const cfg = configs[mode];

    controller = new AbortController();
    const { signal } = controller;

    const { noiseIds, wireframeIds, finalState } = cfg;

    try {

      /* ── SETUP: compute random scatter for every fragment ── */
      const scatter = {};
      const [sxMin, sxMax] = cfg.scatterRange.x;
      const [syMin, syMax] = cfg.scatterRange.y;

      wireframeIds.forEach((id, i) => {
        const el = $(id);
        if (!el) return;
        const c = getCenter(el);
        scatter[id] = {
          tx: randRange(sxMin, sxMax) - c.x,
          ty: randRange(syMin, syMax) - c.y,
          rot: randRange(-160, 160),
          color: semColors[i % 3]
        };
      });

      noiseIds.forEach((id, i) => {
        scatter[id] = {
          tx: randRange(sxMin, sxMax), ty: randRange(syMin, syMax),
          rot: randRange(-160, 160),
          color: semColors[(wireframeIds.length + i) % 3]
        };
      });

      /* ── PHASE 1 — Complexity: noise field appears ── */

      const allIds = [...noiseIds, ...wireframeIds];
      const stagger = 1000 / allIds.length;

      await parallel(
        ...allIds.map((id, i) => {
          const el = $(id);
          if (!el) return Promise.resolve();
          const s = scatter[id];

          el.style.stroke = s.color;
          if (el.tagName === 'rect' || el.tagName === 'circle') {
            el.style.fill = s.color;
            el.style.fillOpacity = '0.08';
          }

          const fromT = `translate(${s.tx}px, ${s.ty}px) rotate(${s.rot}deg)`;
          const scale = id === cfg.frameId ? ' scale(0.3)' : '';

          return wait(i * stagger, signal).then(() =>
            anim(el, [
              { opacity: 0, transform: fromT + scale },
              { opacity: 0.35, transform: fromT + scale }
            ], { duration: 180, easing: spring, fill: 'forwards' })
          );
        })
      );

      await wait(350, signal);

      /* ── PHASE 2 — Simplification: migrate to wireframe ── */

      const resolved = {};
      semColors.forEach(v => {
        const el = $(wireframeIds[0]);
        if (!el) return;
        el.style.stroke = v;
        resolved[v] = getComputedStyle(el).stroke;
      });

      const nativeColors = {};
      wireframeIds.forEach(id => {
        const el = $(id);
        if (!el) return;
        const savedStroke = el.style.stroke;
        const savedFill = el.style.fill;
        const savedFillOp = el.style.fillOpacity;
        el.style.stroke = '';
        el.style.fill = '';
        el.style.fillOpacity = '';
        const cs = getComputedStyle(el);
        nativeColors[id] = { stroke: cs.stroke, fill: cs.fill, fillOpacity: cs.fillOpacity };
        el.style.stroke = savedStroke;
        el.style.fill = savedFill;
        el.style.fillOpacity = savedFillOp;
      });

      await parallel(
        ...noiseIds.map((id, i) =>
          wait(i * 50, signal).then(() =>
            anim($(id), [{ opacity: 0.35 }, { opacity: 0 }],
              { duration: 400, easing: ease, fill: 'forwards' })
          )
        ),

        ...wireframeIds.map((id, i) => {
          const el = $(id);
          if (!el) return Promise.resolve();
          const s = scatter[id];
          const scaleFrom = id === cfg.frameId ? ' scale(0.3)' : '';
          const target = finalState[id] || 0.5;
          const fromColor = resolved[s.color] || s.color;
          const nc = nativeColors[id];

          return wait(80 + i * 18, signal).then(async () => {
            const hasFill = el.tagName === 'rect' || el.tagName === 'circle';

            const from = {
              opacity: 0.35,
              transform: `translate(${s.tx}px, ${s.ty}px) rotate(${s.rot}deg)${scaleFrom}`,
              stroke: fromColor
            };
            const to = {
              opacity: target,
              transform: 'translate(0px, 0px) rotate(0deg) scale(1)',
              stroke: nc.stroke
            };

            if (hasFill) {
              from.fill = fromColor;
              from.fillOpacity = '0.08';
              to.fill = nc.fill;
              to.fillOpacity = nc.fillOpacity;
            }

            await anim(el, [from, to],
              { duration: 1000, easing: easeSmooth, fill: 'forwards' });

            el.style.stroke = '';
            el.style.fill = '';
            el.style.fillOpacity = '';
          });
        })
      );

      /* ── PHASE 3 — Interaction: pointer confirms the CTA ── */
      await wait(250, signal);

      const pointer = $(cfg.pointer);
      const b2 = $(cfg.btnId);
      if (!pointer) { animationDone = true; replayBtn.classList.add('visible'); return; }

      if (mode === 'desktop') {
        /* ── Desktop: mouse cursor moves to CTA and clicks ── */
        pointer.setAttribute('transform', 'translate(200 180)');
        await anim(pointer, [{ opacity: 0 }, { opacity: 1 }],
          { duration: 250, easing: easeCursor, fill: 'forwards' });

        await anim(pointer,
          [{ transform: 'translate(200px, 180px)' }, { transform: 'translate(266px, 260px)' }],
          { duration: 500, easing: easeCursor, fill: 'forwards' });

        await wait(60, signal);

        await anim(pointer,
          [{ transform: 'translate(266px, 260px) scale(1)' },
           { transform: 'translate(266px, 260px) scale(0.85)' },
           { transform: 'translate(266px, 260px) scale(1)' }],
          { duration: 140, easing: 'ease', fill: 'forwards' });

      } else {
        /* ── Mobile: touch finger scrolls page up, then taps CTA ── */

        const scrollGroup = $(cfg.scrollGroupId);
        const scrollDist = cfg.scrollAmount; // negative = content moves up

        // 1. Touch appears mid-screen
        pointer.setAttribute('cx', '100');
        pointer.setAttribute('cy', '260');
        await anim(pointer,
          [{ opacity: 0 }, { opacity: 1 }],
          { duration: 200, easing: easeCursor, fill: 'forwards' });

        // 2. Scroll gesture — finger drags up while content scrolls
        await parallel(
          // Finger moves up
          anim(pointer,
            [{ transform: 'translate(0px, 0px)' },
             { transform: 'translate(0px, -80px)' }],
            { duration: 800, easing: easeSmooth, fill: 'forwards' }),
          // Content scrolls up (revealing CTA below fold)
          anim(scrollGroup,
            [{ transform: 'translate(0px, 0px)' },
             { transform: `translate(0px, ${scrollDist}px)` }],
            { duration: 800, easing: easeSmooth, fill: 'forwards' })
        );

        // 3. Lift off
        await anim(pointer,
          [{ opacity: 1, transform: 'translate(0px, -80px)' },
           { opacity: 0, transform: 'translate(0px, -80px)' }],
          { duration: 150, easing: ease, fill: 'forwards' });

        await wait(250, signal);

        // 4. Re-appear on CTA button for tap
        // Touch circle is outside the scroll group — compute visual position
        // Button is at its SVG y + scrollDist (content has scrolled up)
        const btnBox = b2.getBBox();
        const tapX = btnBox.x + btnBox.width / 2;
        const tapY = btnBox.y + btnBox.height / 2 + scrollDist;
        pointer.setAttribute('cx', tapX);
        pointer.setAttribute('cy', tapY);

        await anim(pointer,
          [{ opacity: 0, transform: 'translate(0px, 0px)' },
           { opacity: 1, transform: 'translate(0px, 0px)' }],
          { duration: 150, easing: easeCursor, fill: 'forwards' });

        await wait(80, signal);

        // 5. Tap — press down then ripple out
        await anim(pointer,
          [{ r: '18', opacity: 1, transform: 'translate(0px, 0px)' },
           { r: '10', opacity: 1, transform: 'translate(0px, 0px)', offset: 0.3 },
           { r: '24', opacity: 0.4, transform: 'translate(0px, 0px)' }],
          { duration: 300, easing: spring, fill: 'forwards' });
      }

      // Button fills + checkmark draws (shared)
      const check = $(cfg.checkId);
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
        anim($(cfg.btnFillId), [{ opacity: 0 }, { opacity: 1 }],
          { duration: 300, easing: ease, fill: 'forwards' }),
        anim(b2, [{ stroke: 'var(--ink)' }, { stroke: 'var(--c-int)' }],
          { duration: 300, easing: ease, fill: 'forwards' }),
        checkP,
        ...cfg.particles.map((p, i) => {
          const el = $(p.id);
          if (!el) return Promise.resolve();
          return wait(i * 40, signal).then(() =>
            anim(el, [
              { opacity: 0, transform: 'translate(0px, 0px) scale(0.2)' },
              { opacity: 0.9, transform: `translate(${p.dx * 0.4}px, ${p.dy * 0.4}px) scale(1.3)`, offset: 0.3 },
              { opacity: 0, transform: `translate(${p.dx}px, ${p.dy}px) scale(0.4)` }
            ], { duration: 650, easing: easeSmooth, fill: 'forwards' })
          );
        })
      );

      // Fade out pointer
      await anim(pointer, [{ opacity: pointer.style.opacity || 0.3 }, { opacity: 0 }],
        { duration: 200, easing: 'ease', fill: 'forwards' });

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
    // Reset both SVGs to initial state
    if (svgDesktop) {
      svgDesktop.getAnimations({ subtree: true }).forEach(a => a.cancel());
      svgDesktop.innerHTML = initialSVGs.desktop;
    }
    if (svgMobile) {
      svgMobile.getAnimations({ subtree: true }).forEach(a => a.cancel());
      svgMobile.innerHTML = initialSVGs.mobile;
    }
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

  // Wait for the hero-diagram fadeIn (0.6s delay + 0.4s duration) before starting
  const active = getActiveSvg();
  if (!active) return;
  const diagram = active.svg.closest('.hero-diagram');
  if (diagram) {
    const fa = diagram.getAnimations().find(a => a.animationName === 'fadeIn');
    if (fa) fa.finished.then(() => runAnimation());
    else runAnimation();
  } else {
    runAnimation();
  }
})();

