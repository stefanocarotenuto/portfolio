# stefanocarotenuto.it

Personal page of **Stefano Carotenuto** — Designer and street photographer based in Milan, Italy.

## Live

[stefanocarotenuto.it](https://stefanocarotenuto.it)

## Overview

Single-page website.

**Sections**: identity (portrait, name, tagline), about (CNR work), street photography (bio + diary link).

## Stack

- HTML5, CSS custom properties, modular type scale (ratio 1.2, base 18px)
- [Supria Sans](https://fonts.adobe.com/fonts/supria-sans) — single typeface (Regular 400, Bold 700), served via Adobe Fonts (Typekit kit `arh5vys`)
- [Iconoir](https://iconoir.com) — `arrow-up-right` icon, inlined as SVG and injected by JS into external links
- Cut-out portrait (WebP with PNG fallback, ~10 KB) over a backdrop rebuilt in CSS, so it follows the theme instead of carrying a fixed background
- Schema.org structured data (JSON-LD, `Person`), Open Graph image
- Hosted on GitHub Pages with a custom domain

## Features

- **Dark / light theme toggle** — palette swap via the `html.light` class, set before first paint by an inline `<head>` script. **Neither theme uses pure black or white**: both are tinted with the periwinkle of the portrait (`#191a37` / `#ecedfb`), so page and photograph share one colour family. Colour tokens: `--bg`, `--fg`, `--fg-dim`, `--accent` (interactive, always ≥ 4.5:1), `--accent-warm` and `--accent-cool` (decorative), `--photo-core` and `--photo-edge` (the portrait's rebuilt backdrop)
- **IT / EN language toggle** — Italian is the source language in the HTML; English is a runtime overlay from a JS dictionary, auto-detected from `navigator.language` and persisted in `localStorage`
- **Accessibility** — semantic landmarks (`<header>`, `<section>`, `<nav>`, `<footer>`), skip link, 44×44px touch targets, `aria-pressed` on toggles, focus-visible outlines, `prefers-reduced-motion` respected, translated `alt` text via `data-i18n-alt`. Every colour pair meets WCAG AA or better in both themes
- **Privacy** — no cookies, no analytics, no tracking. Only Adobe Fonts CDN is contacted for the typeface

## Project structure

```
.
├── index.html        # Single-page markup, IT primary
├── css/
│   └── style.css     # Design tokens, modular scale, dark/light themes
├── js/
│   └── app.js        # Theme toggle, lang toggle, external-link icons
├── img/              # Portrait: cut-out avatar + full frame for Open Graph
├── fonts/            # (empty — fonts served from Adobe Fonts)
├── icons/            # Iconoir SVG references (kept as design source)
├── favicon.ico       # Favicon set cut from the portrait (+ favicon-32.png, apple-touch-icon.png)
├── robots.txt
├── sitemap.xml
└── CNAME
```

## License

&copy; Stefano Carotenuto.