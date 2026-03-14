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


/* ─── LAZY VIDEO — hover to play ───────── */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.work-item');

  items.forEach(item => {
    const video = item.querySelector('video[data-lazy-video]');
    if (!video) return;

    if (prefersReduced) {
      video.removeAttribute('autoplay');
      return;
    }

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

    /* Pause / play toggle button */
    const btn = document.createElement('button');
    btn.className = 'work-media-toggle';
    btn.setAttribute('aria-label', 'Pause video');
    btn.innerHTML =
      '<svg class="icon-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4v16H6z"/><path d="M14 4h4v16h-4z"/></svg>' +
      '<svg class="icon-play" viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
    item.querySelector('.work-media').appendChild(btn);

    let userPaused = false;

    const play  = () => {
      if (userPaused) return;
      video.currentTime = 0;
      video.play().catch(() => {});
      btn.removeAttribute('data-paused');
      btn.setAttribute('aria-label', 'Pause video');
    };
    const pause = () => {
      video.pause();
      btn.setAttribute('data-paused', '');
      btn.setAttribute('aria-label', 'Play video');
    };

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        userPaused = false;
        video.play().catch(() => {});
        btn.removeAttribute('data-paused');
        btn.setAttribute('aria-label', 'Pause video');
      } else {
        userPaused = true;
        video.pause();
        btn.setAttribute('data-paused', '');
        btn.setAttribute('aria-label', 'Play video');
      }
    });

    item.addEventListener('pointerenter', play);
    item.addEventListener('pointerleave', () => { pause(); userPaused = false; });
    item.addEventListener('focusin',  play);
    item.addEventListener('focusout', () => { pause(); userPaused = false; });
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

/* ─── HERO DIAGRAM — Semiotic triangle → UI wireframe ── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ease      = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const easeSmooth = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  const spring    = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

  const $ = id => document.getElementById(id);

  const svg       = $('hero-svg');
  const replayBtn = $('hero-replay');
  if (!svg || !replayBtn) return;

  // Store initial SVG markup for clean reset
  const initialSVG = svg.innerHTML;
  let timers = [];
  let animationDone = false;

  function delay(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  /* ── Utility helpers ── */
  function lineLen(el) {
    const dx = el.x2.baseVal.value - el.x1.baseVal.value;
    const dy = el.y2.baseVal.value - el.y1.baseVal.value;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function drawLine(el, wait, isDashed) {
    const len = lineLen(el);
    const origDash = isDashed ? '6 4' : null;
    el.setAttribute('stroke-dasharray', len);
    el.setAttribute('stroke-dashoffset', len);
    el.animate(
      [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
      { duration: 500, delay: wait, easing: ease, fill: 'forwards' }
    );
    if (isDashed) {
      delay(() => {
        el.setAttribute('stroke-dasharray', origDash);
        el.removeAttribute('stroke-dashoffset');
      }, wait + 500);
    }
  }

  function fade(el, from, to, duration, wait) {
    if (!el) return;
    el.animate(
      [{ opacity: from }, { opacity: to }],
      { duration, delay: wait, easing: 'ease', fill: 'forwards' }
    );
  }

  function morphLine(el, to, duration, wait) {
    el.animate([
      { x1: el.getAttribute('x1'), y1: el.getAttribute('y1'),
        x2: el.getAttribute('x2'), y2: el.getAttribute('y2') },
      { x1: `${to.x1}`, y1: `${to.y1}`, x2: `${to.x2}`, y2: `${to.y2}` }
    ], { duration, delay: wait, easing: easeSmooth, fill: 'forwards' });

    delay(() => {
      el.setAttribute('x1', to.x1);
      el.setAttribute('y1', to.y1);
      el.setAttribute('x2', to.x2);
      el.setAttribute('y2', to.y2);
      if (to.sw) el.style.strokeWidth = to.sw;
      el.removeAttribute('stroke-dasharray');
      el.removeAttribute('stroke-dashoffset');
      el.classList.remove('morph-base');
    }, wait + duration);
  }

  function staggerFade(ids, from, to, dur, base, stagger) {
    ids.forEach((ref, i) => {
      const el = typeof ref === 'string' ? $(ref) : ref;
      if (el) fade(el, from, to, dur, base + i * stagger);
    });
  }

  function drawInLine(id, targetOpacity, duration, wait) {
    const el = $(id);
    if (!el) return;
    const len = Math.abs(parseFloat(el.getAttribute('x2')) - parseFloat(el.getAttribute('x1')));
    el.setAttribute('stroke-dasharray', len);
    el.setAttribute('stroke-dashoffset', len);
    el.animate(
      [{ opacity: 0, strokeDashoffset: len },
       { opacity: targetOpacity, strokeDashoffset: 0 }],
      { duration, delay: wait, easing: ease, fill: 'forwards' }
    );
  }

  /* ═══════════════════════════════════════
     RUN ANIMATION
     ═══════════════════════════════════════ */
  function runAnimation() {
    animationDone = false;
    // Hide replay button
    replayBtn.classList.remove('visible');

    const ml1 = $('ml-1'), ml2 = $('ml-2'), ml3 = $('ml-3');
    const md1 = $('md-1'), md2 = $('md-2'), md3 = $('md-3');
    if (!ml1) return;

    /* ── PHASE 1 — Draw semiotic triangle ── */
    drawLine(ml1, 600, false);
    drawLine(ml2, 1050, true);
    drawLine(ml3, 1450, false);

    [md1, md2, md3].forEach((d, i) => {
      d.animate(
        [{ opacity: 0, r: 0 }, { opacity: 1, r: 4.5 }],
        { duration: 300, delay: 600 + i * 450, easing: spring, fill: 'forwards' }
      );
    });

    /* ── PHASE 2 — Pulse, then morph ── */
    const morphStart = 2400;

    delay(() => {
      [ml1, ml2, ml3].forEach(el => {
        el.animate(
          [{ strokeWidth: '1.4' }, { strokeWidth: '2.2' }, { strokeWidth: '1.4' }],
          { duration: 500, easing: ease, fill: 'forwards' }
        );
      });
    }, morphStart);

    const mDelay = morphStart + 650;
    const mDur   = 1050;

    delay(() => {
      morphLine(ml1, { x1: 128, y1: 62, x2: 128, y2: 290, sw: 0.8 }, mDur, 0);
      morphLine(ml2, { x1: 52, y1: 62, x2: 308, y2: 62, sw: 0.9 }, mDur, 100);
      morphLine(ml3, { x1: 144, y1: 186, x2: 296, y2: 186, sw: 0.6 }, mDur, 200);

      // Opacity "breath" during morph: lines dip then recover, organic feel
      [ml1, ml2, ml3].forEach((el, i) => {
        el.animate(
          [{ opacity: 1 }, { opacity: 0.45, offset: 0.45 }, { opacity: 1 }],
          { duration: mDur + 100, delay: i * 100, easing: ease, fill: 'forwards' }
        );
      });

      // Dots fade later and slower (don't disappear before morph settles)
      fade(md1, 1, 0, 520, 200);
      fade(md2, 1, 0, 520, 310);
      fade(md3, 1, 0, 520, 420);
    }, mDelay);

    /* ── PHASE 3 — UI details materialise ── */
    const detailStart = mDelay + mDur - 200;

    delay(() => {
      const frame = $('ui-frame');
      if (frame) {
        const perim = 2 * (256 + 264);
        frame.setAttribute('stroke-dasharray', perim);
        frame.setAttribute('stroke-dashoffset', perim);
        frame.animate(
          [{ opacity: 0, strokeDashoffset: perim },
           { opacity: 0.55, strokeDashoffset: 0 }],
          { duration: 950, easing: ease, fill: 'forwards' }
        );
        delay(() => {
          frame.removeAttribute('stroke-dasharray');
          frame.removeAttribute('stroke-dashoffset');
        }, 950);
      }

      staggerFade(['ui-d1','ui-d2','ui-d3'], 0, 0.85, 220, 100, 70);

      ['ui-sn1','ui-sn2','ui-sn3','ui-sn4'].forEach((id, i) => {
        drawInLine(id, 0.7, 350, 250 + i * 80);
      });

      drawInLine('ui-h1', 1, 400, 380);
      drawInLine('ui-h2', 0.8, 350, 460);

      ['ui-t1','ui-t2','ui-t3','ui-t4'].forEach((id, i) => {
        drawInLine(id, 0.4, 300, 550 + i * 70);
      });

      ['ui-c1','ui-c2'].forEach((id, i) => {
        const el = $(id);
        if (!el) return;
        el.animate(
          [{ opacity: 0, transform: 'scale(0.75)' },
           { opacity: 0.5, transform: 'scale(1)' }],
          { duration: 400, delay: 750 + i * 130, easing: spring, fill: 'forwards' }
        );
      });

      const b1 = $('ui-b1'), b2 = $('ui-b2');
      if (b1) b1.animate(
        [{ opacity: 0, transform: 'scaleX(0)' },
         { opacity: 0.3, transform: 'scaleX(1)' }],
        { duration: 350, delay: 950, easing: spring, fill: 'forwards' }
      );
      if (b2) b2.animate(
        [{ opacity: 0, transform: 'scaleX(0)' },
         { opacity: 0.5, transform: 'scaleX(1)' }],
        { duration: 350, delay: 1020, easing: spring, fill: 'forwards' }
      );

      // Ghost button → green fill transition
      if (b2) {
        delay(() => {
          b2.animate(
            [{ fill: 'none', stroke: 'var(--ink)' },
             { fill: '#4a8872', stroke: '#4a8872' }],
            { duration: 400, easing: ease, fill: 'forwards' }
          );
        }, 1450);
      }

      // Draw checkmark inside ghost button
      const check = $('ui-check');
      if (check) {
        const pts = check.points;
        let len = 0;
        for (let i = 1; i < pts.numberOfItems; i++) {
          const a = pts.getItem(i - 1), b = pts.getItem(i);
          len += Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
        }
        check.setAttribute('stroke-dasharray', len);
        check.setAttribute('stroke-dashoffset', len);
        check.animate(
          [{ opacity: 0, strokeDashoffset: len },
           { opacity: 1, strokeDashoffset: 0 }],
          { duration: 300, delay: 1650, easing: ease, fill: 'forwards' }
        );
        delay(() => {
          check.removeAttribute('stroke-dasharray');
          check.removeAttribute('stroke-dashoffset');
        }, 1650 + 300);
      }

      // Show replay button after check is drawn
      // (moved to Phase 4)
    }, detailStart);

    /* ── PHASE 4 — Satisfaction: meaning accomplished ── */
    const faceStart = detailStart + 2400;

    delay(() => {
      // UI dissolves slowly — let the completed interface breathe before fading
      const uiOrder = ['ui-check','ui-b2','ui-b1','ui-c2','ui-c1',
        'ui-t4','ui-t3','ui-t2','ui-t1','ui-h2','ui-h1',
        'ui-sn4','ui-sn3','ui-sn2','ui-sn1','ui-sidebar',
        'ui-d3','ui-d2','ui-d1','ui-header','ui-frame'];
      uiOrder.forEach((id, i) => {
        const el = $(id);
        if (el) el.animate([{ opacity: el.style.opacity || 1 }, { opacity: 0 }],
          { duration: 600, delay: i * 22, easing: ease, fill: 'forwards' });
      });
      // Morph lines dissolve in the same wave
      [ml1, ml2, ml3].forEach((el, i) => {
        el.animate([{ opacity: 1 }, { opacity: 0 }],
          { duration: 600, delay: 220 + i * 40, easing: ease, fill: 'forwards' });
      });

      const md1 = $('md-1'), md2 = $('md-2');

      // Helper: draw a path via stroke-dashoffset
      const drawPath = (id, targetOpacity, duration, t) => {
        const el = $(id);
        if (!el) return;
        const len = el.getTotalLength();
        el.setAttribute('stroke-dasharray', len);
        el.setAttribute('stroke-dashoffset', len);
        delay(() => {
          el.animate(
            [{ opacity: 0, strokeDashoffset: len },
             { opacity: targetOpacity, strokeDashoffset: 0 }],
            { duration, easing: easeSmooth, fill: 'forwards' }
          );
        }, t);
        delay(() => {
          el.removeAttribute('stroke-dasharray');
          el.removeAttribute('stroke-dashoffset');
        }, t + duration);
      };

      // 1. Face ring — appears as a ghostly circle (barely visible)
      const faceRing = $('ui-face-ring');
      if (faceRing) {
        const perim = 2 * Math.PI * 66;
        faceRing.setAttribute('stroke-dasharray', perim);
        faceRing.setAttribute('stroke-dashoffset', perim);
        delay(() => {
          faceRing.animate(
            [{ opacity: 0, strokeDashoffset: perim },
             { opacity: 0.18, strokeDashoffset: 0 }],
            { duration: 900, easing: easeSmooth, fill: 'forwards' }
          );
        }, 700);
        delay(() => {
          faceRing.removeAttribute('stroke-dasharray');
          faceRing.removeAttribute('stroke-dashoffset');
        }, 700 + 900);
      }

      // 2. Left eye (Sign — mauve) materialises from its last triangle position
      if (md1) {
        delay(() => {
          md1.setAttribute('cx', 152);
          md1.setAttribute('cy', 150);
          md1.animate(
            [{ opacity: 0, r: 0 }, { opacity: 1, r: 5 }],
            { duration: 420, easing: spring, fill: 'forwards' }
          );
        }, 1050);
      }

      // 3. Right eye (Object — steel blue)
      if (md2) {
        delay(() => {
          md2.setAttribute('cx', 208);
          md2.setAttribute('cy', 150);
          md2.animate(
            [{ opacity: 0, r: 0 }, { opacity: 1, r: 5 }],
            { duration: 420, easing: spring, fill: 'forwards' }
          );
        }, 1200);
      }

      // 4. Smile (Interpretant — teal): the meaning produced
      drawPath('ui-smile', 1, 620, 1420);

      // Replay
      delay(() => {
        animationDone = true;
        replayBtn.classList.add('visible');
      }, 2300);
    }, faceStart);
  }

  /* ═══════════════════════════════════════
     RESET & REPLAY
     ═══════════════════════════════════════ */
  function resetAndReplay() {
    // Cancel all pending timers
    timers.forEach(clearTimeout);
    timers = [];

    // Cancel all running Web Animations on SVG children
    svg.getAnimations({ subtree: true }).forEach(a => a.cancel());

    // Restore initial SVG markup
    svg.innerHTML = initialSVG;

    // Restart
    runAnimation();
  }

  replayBtn.addEventListener('click', resetAndReplay);

  /* Pause when tab hidden; restart if animation was still in progress */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      timers.forEach(clearTimeout);
      timers = [];
    } else if (!animationDone) {
      resetAndReplay();
    }
  });

  // First run
  runAnimation();

})();

