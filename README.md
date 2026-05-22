# stefanocarotenuto.it

Personal page of **Stefano Carotenuto** — Designer and street photographer based in Milan, Italy.

## Live

[www.stefanocarotenuto.it](https://www.stefanocarotenuto.it)

## Overview

Single-page editorial website. No carousel, no gallery, no images on page — the site is a typographic
business card linking to the photography work hosted on [flaneurat.work](https://www.flaneurat.work/).

Built with vanilla HTML, CSS and JavaScript. No build step, no framework, no runtime dependencies.

**Sections**: identity (name + tagline), about (CNR work), street photography (bio + diary link).

## Stack

- HTML5, CSS custom properties, modular type scale (ratio 1.2, base 18px)
- [Supria Sans](https://fonts.adobe.com/fonts/supria-sans) — single typeface (Regular 400, Bold 700), served via Adobe Fonts (Typekit kit `arh5vys`)
- [Iconoir](https://iconoir.com) — `arrow-up-right` icon, inlined as SVG and injected by JS into external links
- Schema.org structured data (JSON-LD, `Person`)
- Hosted on GitHub Pages with a custom domain

## Features

- **Dark / light theme toggle** — palette swap via `body.light` class
- **IT / EN language toggle** — Italian is the source language in the HTML; English is a runtime overlay from a JS dictionary, auto-detected from `navigator.language` and persisted in `localStorage`
- **Accessibility** — semantic landmarks (`<header>`, `<section>`, `<nav>`, `<footer>`), skip link, 44×44px touch targets, `aria-pressed` on toggles, focus-visible outlines, `prefers-reduced-motion` respected
- **Privacy** — no cookies, no analytics, no tracking. Only Adobe Fonts CDN is contacted for the typeface

## Project structure

```
.
├── index.html        # Single-page markup, IT primary
├── css/
│   └── style.css     # Design tokens, modular scale, dark/light themes
├── js/
│   └── app.js        # Theme toggle, lang toggle, external-link icons
├── fonts/            # (empty — fonts served from Adobe Fonts)
├── icons/            # Iconoir SVG references (kept as design source)
├── img/              # (empty — gallery removed in favour of external diary)
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── CNAME
```

## License

&copy; Stefano Carotenuto.