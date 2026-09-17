# TIE-DYE BRAND — Website

A 2-page static website (no build tools, no backend) for a handmade tie-dye
T-shirt business. All orders are placed through WhatsApp.

## 1. Project folder structure

```
tiedye/
├── index.html            → Page 1: Available T-Shirts (home page)
├── customize.html         → Page 2: Customize Your Own
├── README.md
├── css/
│   └── style.css          → All styling for both pages
├── js/
│   ├── config.js           → ⭐ EDIT THIS: brand info, products, colors, designs
│   ├── whatsapp.js          → shared helper that builds wa.me links
│   ├── main.js               → logic for the Available page (product grid, ordering)
│   └── customize.js            → logic for the Customize page (steps, validation, ordering)
└── assets/
    ├── logo/               → brand logo (placeholder included)
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
whatsappNumber: "96170000000",
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

## 7. Where to change shirt prices

Same `PRODUCTS` array in `js/config.js` → edit the `price` field on the
relevant product (and `currency` if you ever need a different symbol).

## 8. Where to replace shirt images

1. Add your photo to `assets/products/` (JPG or PNG recommended, portrait
   orientation looks best).
2. In `js/config.js`, update that product's `image` field to point to the
   new file, e.g. `"assets/products/my-shirt-photo.jpg"`.

The placeholder graphics currently in `assets/products/` and
`assets/designs/` are generated vector swatches standing in for real
photography — swap them out whenever you have real photos.

## 9. Where to change custom tie-dye colors

Open `js/config.js` → the `COLORS` array. Each entry has an `id`, display
`name`, and a `hex` value used for the swatch circle. Add, remove, or edit
freely. The maximum number of colors a customer can select is controlled by
`MAX_COLORS` right below that array.

Design options (Spiral / Scrunch / Symmetrical) live in the `DESIGNS` array
in the same file, and available sizes live in the `SIZES` array.

## 10. Where to change Instagram/contact information

Open `js/config.js` → `BUSINESS`:

- `instagramHandle` / `instagramUrl` — Instagram link shown and linked in the footer
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
