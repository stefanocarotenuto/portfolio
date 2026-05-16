# stefanocarotenuto.it

Personal page of **Stefano Carotenuto** — Designer and street photographer based in Milan, Italy.

## Live

[www.stefanocarotenuto.it](https://www.stefanocarotenuto.it)

## Overview

Single-page site built with vanilla HTML, CSS, and JavaScript. No build step, no framework.

**Sections:** About, Street Photography carousel.

## Stack

- HTML5, CSS custom properties, modular type scale (ratio 1.2)
- [Splide](https://splidejs.com/) — lightweight carousel for the photography section
- [Supria Sans](https://fonts.adobe.com/fonts/supria-sans) — single typeface (Regular 400, Bold 700). Served via Adobe Fonts (Typekit kit `arh5vys`)
- [Iconoir](https://iconoir.com) — `arrow-up-right` icon, inlined as SVG and injected by JS into all external links
- Schema.org structured data (JSON-LD, `Person`)
- Hosted on GitHub Pages with a custom domain

## Features

- **Dark / light theme toggle** — palettes verified for WCAG AA contrast across text, links, dim text, and UI separators
- **EN / IT language toggle** — full content i18n via a JS dictionary, persisted in `localStorage`, auto-detected from `navigator.language`
- **Anti-FOUT** — `document.fonts.ready` API hides body until web fonts are applied (with a 300ms safety fallback), eliminating the font-swap flicker
- **Accessibility** — skip link, 44×44px touch targets, `aria-pressed` on toggles, `aria-live` slide counter, focus-visible outlines, `prefers-reduced-motion` respected
- **Performance** — `preconnect` to Adobe Fonts CDN, AVIF photos with `loading="lazy"`, no runtime JS dependencies beyond Splide

## Project structure

```
.
├── index.html              # Single-page markup
├── css/
│   ├── style.css           # Source stylesheet — design tokens, modular scale
│   └── splide-core.min.css
├── js/
│   ├── app.js              # Slider, theme toggle, lang toggle, external link icons
│   └── splide.min.js
├── fonts/                  # (empty — fonts now served from Adobe Fonts)
├── icons/                  # UI SVG icons
├── img/                    # AVIF photography
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── CNAME
```

## License

&copy; Stefano Carotenuto.
