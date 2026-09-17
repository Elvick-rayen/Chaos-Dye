/* ============================================================
   MAIN.JS — Available T-Shirts page (index.html)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderBrandChrome();
  renderProductGrid();
  setupFloatingWhatsApp();
  setupImagePreview();
});

/* ---------------------------------------------------------
   Header / footer / floating button content that comes from
   config.js — kept identical across pages.
--------------------------------------------------------- */
function renderBrandChrome() {
  document.querySelectorAll("[data-brand-name]").forEach(el => (el.textContent = BUSINESS.name));
  document.querySelectorAll("[data-brand-logo]").forEach(el => {
    el.src = BUSINESS.logo;
    el.alt = `${BUSINESS.name} logo`;
  });
  document.querySelectorAll("[data-brand-tagline]").forEach(el => (el.textContent = BUSINESS.tagline));
  document.querySelectorAll("[data-year]").forEach(el => (el.textContent = BUSINESS.year));
  document.querySelectorAll("[data-whatsapp-number]").forEach(el => (el.textContent = formatPhone(BUSINESS.whatsappNumber)));
  document.querySelectorAll("[data-instagram-handle]").forEach(el => (el.textContent = BUSINESS.instagramHandle));

  const igLinks = document.querySelectorAll("[data-instagram-link]");
  igLinks.forEach(el => (el.href = BUSINESS.instagramUrl));

  const waFooterLinks = document.querySelectorAll("[data-whatsapp-footer-link]");
  waFooterLinks.forEach(el => (el.href = buildWhatsAppLink("Hello! 👋 I have a question about your tie-dye shirts.")));

  const emailRow = document.querySelector("[data-email-row]");
  if (emailRow) {
    if (BUSINESS.email) {
      emailRow.querySelector("[data-email]").textContent = BUSINESS.email;
      emailRow.querySelector("[data-email]").href = `mailto:${BUSINESS.email}`;
    } else {
      emailRow.style.display = "none";
    }
  }

  const locationRow = document.querySelector("[data-location-row]");
  if (locationRow) {
    if (BUSINESS.location) {
      locationRow.querySelector("[data-location]").textContent = BUSINESS.location;
    } else {
      locationRow.style.display = "none";
    }
  }
}

function formatPhone(digits) {
  return `+${digits}`;
}

/* ---------------------------------------------------------
   Product grid
--------------------------------------------------------- */
function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const available = PRODUCTS.filter(p => p.available);

  if (available.length === 0) {
    grid.innerHTML = `<p class="empty-state">No shirts available right now — check back soon, or message us on WhatsApp for restock news.</p>`;
    return;
  }

  grid.innerHTML = available.map(productCardHTML).join("");

  grid.querySelectorAll("[data-order-btn]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-order-btn");
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) return;
      const message = buildProductMessage(product);
      openWhatsApp(message);
    });
  });
}

function productCardHTML(product) {
  return `
    <article class="product-card">
      <button class="product-card__image-btn" data-preview-img="${product.image}" data-preview-name="${escapeHTML(product.name)}" aria-label="View larger image of ${escapeHTML(product.name)}">
        <img class="product-card__image" src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy">
      </button>
      <div class="product-card__body">
        <h3 class="product-card__name">${escapeHTML(product.name)}</h3>
        ${product.description ? `<p class="product-card__desc">${escapeHTML(product.description)}</p>` : ""}
        <div class="product-card__meta">
          <span class="product-card__price">${product.currency}${product.price}</span>
          <span class="product-card__size">Size: ${escapeHTML(product.size)}</span>
        </div>
        <button class="btn btn--whatsapp" data-order-btn="${product.id}">
          ${whatsappIconSVG()} Order on WhatsApp
        </button>
      </div>
    </article>
  `;
}

function buildProductMessage(product) {
  return [
    "Hello! 👋",
    "",
    "I would like to order this tie-dye shirt:",
    "",
    `Product: ${product.name}`,
    `Size: ${product.size}`,
    `Price: ${product.currency}${product.price}`,
    "",
    "Is it still available?"
  ].join("\n");
}

/* ---------------------------------------------------------
   Image preview modal (optional, lightweight, no deps)
--------------------------------------------------------- */
function setupImagePreview() {
  const modal = document.getElementById("image-modal");
  if (!modal) return;
  const imgEl = modal.querySelector("[data-modal-image]");
  const nameEl = modal.querySelector("[data-modal-name]");
  const closeBtn = modal.querySelector("[data-modal-close]");

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-preview-img]");
    if (!trigger) return;
    imgEl.src = trigger.getAttribute("data-preview-img");
    imgEl.alt = trigger.getAttribute("data-preview-name") || "";
    nameEl.textContent = trigger.getAttribute("data-preview-name") || "";
    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
  });

  function close() {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ---------------------------------------------------------
   Floating WhatsApp button (present on every page)
--------------------------------------------------------- */
function setupFloatingWhatsApp() {
  const btn = document.getElementById("floating-whatsapp");
  if (!btn) return;
  btn.addEventListener("click", () => {
    openWhatsApp("Hello! 👋 I have a question about your tie-dye shirts.");
  });
}

/* ---------------------------------------------------------
   Utilities
--------------------------------------------------------- */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function whatsappIconSVG() {
  return `<svg class="icon-wa" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.46.72 4.75 1.96 6.67L4 29l7.5-1.9a11.9 11.9 0 0 0 4.52.89h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm0 21.9h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-4.45 1.13 1.19-4.34-.24-.37a9.87 9.87 0 0 1-1.52-5.28C5.58 9.5 10.28 4.8 16.02 4.8c5.74 0 10.44 4.7 10.44 10.22 0 5.53-4.7 10.22-10.44 10.22zm5.7-7.66c-.31-.16-1.85-.91-2.14-1.02-.29-.1-.5-.16-.71.16-.21.31-.82 1.02-1 1.23-.19.21-.37.23-.68.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.55-1.83-1.73-2.14-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.19.21-.31.31-.52.1-.21.05-.39-.02-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.22 3.4 5.38 4.76.75.32 1.34.51 1.8.66.76.24 1.45.21 2 .13.61-.09 1.85-.76 2.11-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37z"/></svg>`;
}
