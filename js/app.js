/* =========================================================
   stefanocarotenuto.it — app.js
   Modules: email, slider, scrollSpy, smoothScroll, mobileNav
   ========================================================= */

(function () {
  'use strict';

  /* ─── EMAIL ANTI-SCRAPING ─────────────────────────── */
  function initEmail() {
    const link = document.getElementById('email-link');
    if (!link) return;
    const user = 'stefano.carotenuto';
    const domain = 'gmail.com';
    link.href = 'mailto:' + user + '@' + domain;
    link.textContent = 'Email';
  }

  /* ─── PHOTOGRAPHY SLIDER (Splide) ─────────────────── */
  function initSlider() {
    const root = document.getElementById('photo-slider');
    const countEl = document.getElementById('photo-count');
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

    const prev = document.getElementById('photo-prev');
    const next = document.getElementById('photo-next');
    prev?.addEventListener('click', () => splide.go('<'));
    next?.addEventListener('click', () => splide.go('>'));

    function updateCount(i) {
      if (!countEl) return;
      countEl.textContent = (i + 1) + ' / ' + splide.length;
    }

    splide.on('move',  updateCount);
    splide.on('moved', updateCount);
    splide.mount();

    if (countEl) {
      countEl.textContent = '1 / ' + splide.length;
    }
  }

  /* ─── SCROLL SPY ──────────────────────────────────── */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav a');
    const dots     = document.querySelectorAll('.progress-dot');
    const header   = document.getElementById('site-header');
    if (!sections.length) return;

    let activeId = '';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { e.target._ratio = e.intersectionRatio; });

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

      dots.forEach(dot => {
        dot.classList.toggle('active', dot.dataset.target === activeId);
      });

      header?.classList.toggle('dark-zone', activeId === 'photography');
    }, {
      threshold:  [0, 0.1, 0.2, 0.3, 0.5],
      rootMargin: '-56px 0px 0px 0px',
    });

    sections.forEach(s => observer.observe(s));
  }

  /* ─── SMOOTH SCROLL for anchor links ──────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ─── MOBILE NAV (toggle + focus trap + escape) ───── */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav    = document.getElementById('site-nav');
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        nav.querySelector('a')?.focus();
      }
    });

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', close);
    });

    document.addEventListener('keydown', (e) => {
      if (!nav.classList.contains('open')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = [toggle, ...nav.querySelectorAll('a')];
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
  }

  /* ─── BOOT ────────────────────────────────────────── */
  function boot() {
    initEmail();
    initSlider();
    initScrollSpy();
    initSmoothScroll();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
