# stefanocarotenuto.it

Personal portfolio website of **Stefano Carotenuto** — digital strategist, UX designer, and street photographer based in Milan, Italy.

Currently Head of Communication at the Italian National Research Council's Department of Social Sciences and Humanities, Cultural Heritage (CNR-DSU) and UX designer at CNR-ISMed's Mediterranean Digital Humanities Lab.

## Live

[www.stefanocarotenuto.it](https://www.stefanocarotenuto.it)

## Overview

Single-page site built with vanilla HTML, CSS, and JavaScript. No frameworks, no build steps.

**Sections:** Hero with animated SVG diagram, About, Selected Works, CV (tabbed), Street Photography slider.

## Stack

- HTML5, CSS custom properties, CSS Grid
- [Splide](https://splidejs.com/) — lightweight carousel for the photography section
- [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) — self-hosted web fonts
- Schema.org structured data (JSON-LD)
- Hosted on GitHub Pages with custom domain

## Project structure

```
.
├── index.html          # Single-page markup
├── css/
│   ├── style.css       # Source stylesheet
│   ├── style.min.css   # Minified (production)
│   └── splide-core.min.css
├── js/
│   ├── app.js          # Site logic and Splide init
│   └── splide.min.js
├── fonts/              # Self-hosted WOFF2
├── img/                # AVIF images
├── robots.txt
├── sitemap.xml
└── CNAME
```

## License

&copy; Stefano Carotenuto. All rights reserved. Code, photographs, written content, and visual assets may not be reused, reproduced, or redistributed without explicit permission.
