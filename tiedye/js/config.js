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
  name: "TIE-DYE BRAND",                 // <-- replace with your real brand name
  tagline: "Hand-dyed, one at a time.",
  logo: "assets/logo/logo-placeholder.svg", // <-- replace with your real logo file

  // WhatsApp number in international format, digits only, no + or spaces.
  // Example: Lebanon number +961 71 234 567 -> "96171234567"
  whatsappNumber: "96171224334",         // <-- CHANGE THIS TO YOUR REAL NUMBER

  instagramHandle: "@yourbrand",         // <-- replace
  instagramUrl: "https://instagram.com/yourbrand", // <-- replace
  email: "",                             // optional, leave "" to hide
  location: "",                          // optional, leave "" to hide
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
--------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "fire-scrunch",
    name: "Fire Scrunch Tie-Dye",
    image: "assets/products/fire-scrunch.svg",
    price: 25,
    currency: "$",
    size: "L",
    description: "Crumpled cloud pattern in red, orange and gold.",
    available: true
  },
  {
    id: "blue-spiral",
    name: "Blue Spiral Tie-Dye",
    image: "assets/products/blue-spiral.svg",
    price: 22,
    currency: "$",
    size: "M",
    description: "Classic spiral wash in ocean blues.",
    available: true
  },
  {
    id: "violet-symmetry",
    name: "Violet Symmetry Tie-Dye",
    image: "assets/products/violet-symmetry.svg",
    price: 24,
    currency: "$",
    size: "S",
    description: "Mirror-folded pattern in violet and magenta.",
    available: true
  },
  {
    id: "emerald-scrunch",
    name: "Emerald Scrunch Tie-Dye",
    image: "assets/products/emerald-scrunch.svg",
    price: 23,
    currency: "$",
    size: "XL",
    description: "Deep green and teal scrunch wash.",
    available: true
  }
];

/* ---------------------------------------------------------
   3. CUSTOM DESIGNS — Step 1 of the Customizer
   Each design needs: id, name, image, description
--------------------------------------------------------- */
const DESIGNS = [
  {
    id: "spiral",
    name: "Spiral",
    image: "assets/designs/spiral.svg",
    description: "Classic spiral tie-dye design."
  },
  {
    id: "scrunch",
    name: "Scrunch",
    image: "assets/designs/scrunch.svg",
    description: "Random, crumpled cloud-style pattern."
  },
  {
    id: "symmetrical",
    name: "Symmetrical / Mirror Fold",
    image: "assets/designs/symmetrical.svg",
    description: "Folded technique with a mirrored pattern."
  }
];

/* ---------------------------------------------------------
   4. COLORS — Step 2 of the Customizer
   Each color needs: id, name, hex (used for the swatch)
--------------------------------------------------------- */
const COLORS = [
  { id: "black",     name: "Jet Black",         hex: "#1B1815" },
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
