# /img — image assets

Reserved folder for the site's real photography and graphic assets.

## Current state
The landing page currently ships **no raster image files**. Every visual is one of:

- **CSS placeholders** — `repeating-linear-gradient` / `radial-gradient` patterns inside
  `.svc .visual`, `.gcard .ph`, `.about-portrait`, `.special .visual`, the hero `.stack` cards,
  and the addon modal slides. They display the `FOTO · …` labels you see on screen.
- **Inline SVG** — all icons (WhatsApp, Instagram, TikTok, mail, arrows, the ⚡ favicon, hero bolt).
  These stay inline so they inherit `currentColor` and need no extra HTTP requests.

So there was nothing to relocate here yet — the folder is the landing spot for the photos that
are still pending (hero shots, Cami portrait, gallery, per-service slideshow images).

## When you add real photos
1. Drop files here, ideally `.webp` (with a `.jpg` fallback if you need older-browser support).
   Suggested names: `hero-1.webp`, `cami.webp`, `gallery-cumple-catalina.webp`, `slime-1.webp`, …
2. Replace the placeholder `<div class="slide ph-a">…</div>` markup (or set a `background-image`)
   with the real asset, e.g. `style="background-image:url('img/slime-1.webp')"`.
3. Use **relative paths from the site root**: `img/<file>` (matches how `css/` and `js/` are linked).
4. Add `loading="lazy"` + `width`/`height` on any `<img>` below the fold to avoid layout shift.

## Do NOT move here
`og-image.jpg` referenced in the `<meta property="og:image">` / Twitter / JSON-LD tags is an
**absolute production URL** (`https://micaluanimaciones.com/og-image.jpg`). Social/SEO crawlers
require an absolute URL, so it must not be rewritten to a relative `img/` path.
