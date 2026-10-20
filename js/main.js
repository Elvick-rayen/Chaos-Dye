/* ============================================================
   MAIN.JS — Shop page (index.html)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderProductGrid();
  renderCustomBand();
  setupProductSheet();
  setupFloatingWhatsApp();
});

/* ---------------------------------------------------------
   Floating WhatsApp button — hidden while the hero buttons are
   visible so it doesn't sit on top of them on phones.
--------------------------------------------------------- */
function setupFloatingWhatsApp() {
  const btn = document.querySelector(".floating-whatsapp");
  const heroActions = document.querySelector(".hero__actions");
  if (!btn || !heroActions || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(([entry]) => {
    btn.classList.toggle("is-tucked", entry.isIntersecting);
  }).observe(heroActions);
}

/* ---------------------------------------------------------
   Product grid
--------------------------------------------------------- */
function visibleProducts() {
  return PRODUCTS.filter(p => p.available);
}

function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const products = visibleProducts();

  if (products.length === 0) {
    grid.innerHTML = `<p class="empty-state">The drop is sold out — new pieces are in the dye bath.<br>Message us on WhatsApp for restock news, or design your own.</p>`;
    return;
  }

  const inStock = products.filter(p => !p.soldOut).length;
  const count = document.getElementById("product-count");
  if (count) {
    count.textContent = `${inStock} available`;
    count.hidden = false;
  }

  grid.innerHTML = products.map(productCardHTML).join("");
}

function productCardHTML(product) {
  const name = escapeHTML(product.name);
  const orderButton = product.soldOut
    ? `<span class="btn btn--sm btn--block" aria-disabled="true">Sold out</span>`
    : `<a class="btn btn--whatsapp btn--sm btn--block" href="${buildWhatsAppLink(buildProductMessage(product))}">${whatsappIconSVG()} Order</a>`;

  return `
    <article class="product-card${product.soldOut ? " is-sold" : ""}">
      <button type="button" class="product-card__image-btn" data-product-id="${product.id}" aria-label="View ${name}">
        <img class="product-card__image" src="${product.image}" alt="${name} tie-dye T-shirt" loading="lazy">
        <span class="product-card__badge">${product.soldOut ? "Sold" : "1 of 1"}</span>
      </button>
      <div class="product-card__body">
        <div class="product-card__top">
          <h3 class="product-card__name">${name}</h3>
          <span class="product-card__price">${formatPrice(product)}</span>
        </div>
        ${product.description ? `<p class="product-card__desc">${escapeHTML(product.description)}</p>` : ""}
        <p class="product-card__size">Size ${escapeHTML(product.size)}</p>
        ${orderButton}
      </div>
    </article>
  `;
}

function formatPrice(product) {
  return `${product.currency}${product.price}`;
}

function buildProductMessage(product) {
  return [
    "Hello! 👋",
    "",
    "I would like to order this tie-dye shirt:",
    "",
    `👕 ${product.name}`,
    `📏 Size: ${product.size}`,
    `💵 Price: ${formatPrice(product)}`,
    "",
    "Is it still available?"
  ].join("\n");
}

/* ---------------------------------------------------------
   "Make your own" band — thumbnails of the custom designs
--------------------------------------------------------- */
function renderCustomBand() {
  const wrap = document.getElementById("custom-band-designs");
  if (!wrap) return;
  wrap.innerHTML = DESIGNS.map(d => `
    <a href="customize.html?design=${encodeURIComponent(d.id)}">
      <img src="${d.image}" alt="" loading="lazy">
      ${escapeHTML(d.name)}
    </a>
  `).join("");
}

/* ---------------------------------------------------------
   Product sheet — slides up from the bottom on phones,
   centered dialog on bigger screens.
--------------------------------------------------------- */
function setupProductSheet() {
  const sheet = document.getElementById("product-sheet");
  if (!sheet || typeof sheet.showModal !== "function") return;

  const img = sheet.querySelector("[data-sheet-image]");
  const order = sheet.querySelector("[data-sheet-order]");

  document.addEventListener("click", e => {
    const trigger = e.target.closest("[data-product-id]");
    if (!trigger) return;
    const product = PRODUCTS.find(p => p.id === trigger.dataset.productId);
    if (!product) return;

    img.src = product.image;
    img.alt = `${product.name} tie-dye T-shirt`;
    sheet.querySelector("[data-sheet-name]").textContent = product.name;
    sheet.querySelector("[data-sheet-price]").textContent = formatPrice(product);
    sheet.querySelector("[data-sheet-desc]").textContent = product.description || "";
    sheet.querySelector("[data-sheet-size]").textContent = `Size ${product.size}`;

    if (product.soldOut) {
      order.removeAttribute("href");
      order.setAttribute("aria-disabled", "true");
      order.textContent = "Sold out";
    } else {
      order.href = buildWhatsAppLink(buildProductMessage(product));
      order.removeAttribute("aria-disabled");
      order.innerHTML = `${whatsappIconSVG()} Order on WhatsApp`;
    }

    sheet.showModal();
    document.body.classList.add("no-scroll");
  });

  sheet.querySelector("[data-sheet-close]").addEventListener("click", () => sheet.close());
  // Tapping the dimmed backdrop closes the sheet
  sheet.addEventListener("click", e => {
    if (e.target === sheet) sheet.close();
  });
  sheet.addEventListener("close", () => document.body.classList.remove("no-scroll"));
}
