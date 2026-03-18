# stefanocarotenuto.it

Personal portfolio website of **Stefano Carotenuto** — digital strategist, UX designer, and street photographer based in Milan, Italy.

Currently Head of Communication at the Italian National Research Council's Department of Social Sciences and Humanities, Cultural Heritage (CNR-DSU) and UX designer at CNR-ISMed's Mediterranean Digital Humanities Lab.

## Live

[www.stefanocarotenuto.it](https://www.stefanocarotenuto.it)

## Overview

Single-page site built with vanilla HTML, CSS, and JavaScript. No frameworks, no build steps.

**Sections:** Hero with responsive animated SVG diagram, About, Selected Works, CV (tabbed), Street Photography slider.

### Hero animation

The hero features an SVG wireframe animation that adapts to the viewport:

- **Desktop** — browser window wireframe with mouse cursor interaction (move → click CTA)
- **Mobile** — smartphone wireframe with touch gestures (scroll to reveal CTA → tap)

Both share the same narrative arc: scattered fragments assemble into a structured interface, then a simulated interaction confirms the CTA.

### Selected Works

Project screenshots are displayed inside CSS browser-chrome mockups (desktop) or phone mockups (mobile). Each project uses responsive `<picture>` elements to serve the appropriate screenshot per viewport. Images are AVIF format, captured via [shot-scraper](https://github.com/simonw/shot-scraper).

## Stack

- HTML5, CSS custom properties, CSS Grid
- [Splide](https://splidejs.com/) — lightweight carousel for the photography section
- [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) — self-hosted web fonts
- Schema.org structured data (JSON-LD)
- Responsive AVIF screenshots in CSS device mockups
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
│   ├── app.js          # Hero animation (desktop + mobile), Splide init, nav, scroll spy
│   ├── app.min.js      # Minified (production)
│   └── splide.min.js
├── fonts/              # Self-hosted WOFF2 + TTF
├── icons/              # UI SVG icons
├── img/                # AVIF screenshots (desktop + mobile per project)
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── CNAME
```

## License

&copy; Stefano Carotenuto. All rights reserved. Code, photographs, written content, and visual assets may not be reused, reproduced, or redistributed without explicit permission.
