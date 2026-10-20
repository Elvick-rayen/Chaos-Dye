# CHAOS DYE — Website

A 2-page static website (no build tools, no backend) for a handmade tie-dye
T-shirt business. All orders are placed through WhatsApp.

Live at **https://elvick-rayen.github.io/Chaos-Dye/**

The site is designed **mobile-first**: the base CSS is the phone layout and
desktop styles are layered on top with `min-width` media queries.

## 1. Project folder structure

```
Chaos-Dye/
├── index.html            → Page 1: Shop (home page)
├── customize.html         → Page 2: Design Your Own
├── README.md
├── css/
│   └── style.css          → All styling for both pages
├── js/
│   ├── config.js           → ⭐ EDIT THIS: brand info, products, colors, designs
│   ├── common.js            → shared: wa.me links, header/footer content, utilities
│   ├── main.js               → logic for the Shop page (product grid, product sheet)
│   └── customize.js            → logic for the Customize page (steps, live preview, ordering)
└── assets/
    ├── logo/               → brand logo (logo.svg)
    ├── products/            → images for available shirts (placeholders included)
    └── designs/               → reference images for Spiral/Scrunch/Symmetrical
```

## 2. How to run the project

No installation, no npm, no build step required.

- **Locally:** just double-click `index.html` (or right-click → Open with your
  browser). Every link uses relative paths, so it works straight from disk.
- **GitHub Pages:** push this folder to a GitHub repository, then enable
  Pages (Settings → Pages → deploy from the branch/folder containing these
  files). Because every asset and link uses relative paths, it works whether
  the site is hosted at the root of the domain or inside a repo subdirectory
  (e.g. `yourname.github.io/tiedye-shop/`).

## 3. Where to change the WhatsApp number

Open `js/config.js` → `BUSINESS.whatsappNumber`.
Use the international format, digits only, no `+`, no spaces, no dashes.

```js
whatsappNumber: "96171224334",
whatsappDisplay: "+961 71 224 334",   // how it's shown on the site
```

This single value drives every WhatsApp button on the site (floating button,
product orders, custom orders).

## 4. Where to change the brand name

Open `js/config.js` → `BUSINESS.name`. It automatically updates the header,
footer, and page content everywhere `data-brand-name` is used.

## 5. Where to add the future logo

1. Drop your real logo file into `assets/logo/` (any image format — `.svg`,
   `.png`, `.jpg`).
2. Open `js/config.js` → `BUSINESS.logo` and point it to the new file, e.g.
   `"assets/logo/my-logo.png"`.

## 6. Where to add/remove available shirts

Open `js/config.js` → the `PRODUCTS` array. Copy an existing object, give it
a unique `id`, and fill in the fields. To remove a shirt, delete its object
or set `available: false` to hide it without deleting the data.

When a shirt sells, set `soldOut: true` instead of deleting it: it stays on
the page with a "Sold" badge (good social proof) and can't be ordered.

## 7. Where to change shirt prices

Same `PRODUCTS` array in `js/config.js` → edit the `price` field on the
relevant product (and `currency` if you ever need a different symbol).

## 8. Where to replace shirt images

1. Add your photo to `assets/products/` (JPG recommended, portrait 4:5
   orientation looks best, around 1000px tall and under ~200 KB so it loads
   fast on phones).
2. In `js/config.js`, update that product's `image` field to point to the
   new file, e.g. `"assets/products/my-shirt-photo.jpg"`.

The graphics currently in `assets/products/` are generated placeholder
swatches standing in for real photography — swap them out for real photos
of each shirt before launch.

## 9. Where to change custom tie-dye colors

Open `js/config.js` → the `COLORS` array. Each entry has an `id`, display
`name`, and a `hex` value used for the swatch circle. Add, remove, or edit
freely. The maximum number of colors a customer can select is controlled by
`MAX_COLORS` right below that array.

Design options (Spiral / Scrunch / Mirror Fold) live in the `DESIGNS` array
in the same file, and available sizes live in the `SIZES` array. Each design's
`pattern` (`"spiral"`, `"scrunch"` or `"fold"`) picks which style the live
color preview draws.

## 10. Where to change Instagram/contact information

Open `js/config.js` → `BUSINESS`:

- `instagramHandle` / `instagramUrl` — Instagram link in the footer; leave
  `instagramUrl` as `""` to hide it
- `email` — leave as `""` to hide the email row in the footer entirely
- `location` — leave as `""` to hide the location row entirely

---

### Notes

- Both pages are fully static HTML/CSS/vanilla JS — no React, no build step,
  no dependencies to install.
- All page content that changes often (products, colors, designs, business
  info) lives in `js/config.js` so you never need to touch the HTML or CSS
  for routine updates.
- The floating WhatsApp button, product ordering, and the custom order flow
  all generate their message text on the client side and open
  `https://wa.me/<number>?text=<encoded message>` — no backend involved.
