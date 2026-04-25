# stefanocarotenuto.it

Personal portfolio of **Stefano Carotenuto** — UI/UX designer and street photographer based in Milan, Italy.

## Live

[www.stefanocarotenuto.it](https://www.stefanocarotenuto.it)

## Overview

Single-page site built with vanilla HTML, CSS, and JavaScript.

**Sections:** Hero, About, Selected Works, Street Photography slider.

## Stack

- HTML5, CSS custom properties, CSS Grid, mobile-first media queries
- [Splide](https://splidejs.com/) — lightweight carousel for the photography section
- [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) — self-hosted (WOFF2 + TTF fallback)
- Schema.org structured data (JSON-LD, `Person`)
- Responsive AVIF screenshots in CSS browser mockups
- Hosted on GitHub Pages with a custom domain

## Project structure

```
.
├── index.html          # Single-page markup
├── css/
│   ├── style.css       # Source stylesheet — mobile-first, token-based
│   ├── style.min.css   # Minified (production)
│   └── splide-core.min.css
├── js/
│   ├── app.js          # Email, Splide init, scroll spy, smooth scroll, mobile nav
│   ├── app.min.js      # Minified (production)
│   └── splide.min.js
├── fonts/              # Self-hosted WOFF2 + TTF
├── icons/              # UI SVG icons
├── img/                # AVIF screenshots + portrait + photography
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── CNAME
```

## License

&copy; Stefano Carotenuto.
