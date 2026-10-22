/* ============================================================
   CONFIG.JS
   This is the ONLY file you should need to edit for day-to-day
   changes: business info, WhatsApp number, products, colors,
   and design options. Everything else reads from here.
   ============================================================ */

/* ---------------------------------------------------------
   1. BUSINESS INFO
   Change your brand name, logo, phone number and socials here.
--------------------------------------------------------- */
const BUSINESS = {
  name: "CHAOS DYE",
  tagline: "Dye Never Dies.",
  logo: "assets/logo/logo.png",

  // WhatsApp number in international format, digits only, no + or spaces.
  // Example: Lebanon number +961 71 234 567 -> "96171234567"
  whatsappNumber: "96171224334",
  // How the number is shown to visitors (purely visual).
  whatsappDisplay: "+961 71 224 334",

  // Leave instagramUrl "" to hide Instagram everywhere on the site.
  instagramHandle: "@chaos.dye.leb",
  instagramUrl: "https://www.instagram.com/chaos.dye.leb/",
  email: "",                             // optional, leave "" to hide
  location: "",                          // optional, e.g. "Beirut, Lebanon" — leave "" to hide
  year: new Date().getFullYear()
};

/* ---------------------------------------------------------
   2. PRODUCTS — Available T-Shirts
   Add or remove shirts by adding/removing objects in this array.
   - id: unique short id, no spaces
   - name: product name
   - image: path to product image (assets/products/...)
   - price: number (no currency symbol)
   - currency: symbol shown before price
   - size: single size string shown on the card (e.g. "M", "L")
   - description: short optional line, can be ""
   - available: true/false — set false to hide a shirt without deleting it
   - soldOut: true to keep showing the shirt with a "Sold" badge
     (great social proof) — ordering is disabled for it
--------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "blue-fire",
    name: "Blue Fire",
    image: "assets/products/bluefire.jpeg",
    price: 25,
    currency: "$",
    size: "L",
    description: "",
    available: true
  },
  {
    id: "galactic-storm",
    name: "Galactic Storm",
    image: "assets/products/galacticstorm.jpeg",
    price: 25,
    currency: "$",
    size: "L",
    description: "",
    available: true
  },
  {
    id: "party-soldier",
    name: "Party Soldier",
    image: "assets/products/partysoldier.jpeg",
    price: 25,
    currency: "$",
    size: "L",
    description: "",
    available: true
  },
  {
    id: "pumpkin-abomination",
    name: "Pumpkin Abomination",
    image: "assets/products/pumpkin.jpeg",
    price: 25,
    currency: "$",
    size: "L",
    description: "",
    available: true
  },
  {
    id: "the-psychedelic",
    name: "The Psychedelic",
    image: "assets/products/thepsych.jpeg",
    price: 25,
    currency: "$",
    size: "L",
    description: "",
    available: true
  }
];

/* ---------------------------------------------------------
   3. CUSTOM DESIGNS — Step 1 of the Customizer
   Each design needs: id, name, image, description
   - pattern: which live preview style to draw
     ("spiral", "scrunch" or "fold")
--------------------------------------------------------- */
const DESIGNS = [
  {
    id: "spiral",
    name: "Spiral",
    image: "assets/designs/spiral.jpg",
    description: "The classic swirl, radiating from one point.",
    pattern: "spiral"
  },
  {
    id: "scrunch",
    name: "Scrunch",
    image: "assets/designs/scrunch.jpg",
    description: "Wild, crumpled, cloud-like chaos.",
    pattern: "scrunch"
  },
  {
    id: "symmetrical",
    name: "Mirror Fold",
    image: "assets/designs/symetrical.jpg",
    description: "Folded down the middle for a mirrored pattern.",
    pattern: "fold"
  }
];

/* ---------------------------------------------------------
   4. COLORS — Step 2 of the Customizer
   Each color needs: id, name, hex (used for the swatch)
--------------------------------------------------------- */
const COLORS = [
  { id: "black",     name: "Jet Black",          hex: "#1B1815" },
  { id: "red",       name: "Fire Engine Red",    hex: "#E8352B" },
  { id: "yellow",    name: "Golden Yellow",      hex: "#FFB238" },
  { id: "blue",      name: "Royal Blue",         hex: "#1E3A8A" },
  { id: "turquoise", name: "Turquoise",          hex: "#25A18E" },
  { id: "purple",    name: "Purple",             hex: "#6C4BFF" },
  { id: "fuchsia",   name: "Fuchsia",            hex: "#D6288E" },
  { id: "green",     name: "Emerald Green",      hex: "#12794F" }
];

const MAX_COLORS = 4;

/* ---------------------------------------------------------
   5. SIZES — Step 3 of the Customizer
--------------------------------------------------------- */
const SIZES = ["S", "M", "L", "XL", "XXL"];
