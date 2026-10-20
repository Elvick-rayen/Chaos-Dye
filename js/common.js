/* ============================================================
   COMMON.JS
   Shared by every page: WhatsApp links, header/footer content
   from config.js, and small utilities.
   ============================================================ */

const GENERAL_MESSAGE = "Hello! 👋 I have a question about your tie-dye shirts.";

/**
 * Builds a wa.me link with a URL-encoded message.
 * @param {string} message - plain text message
 * @returns {string} full https://wa.me/... URL
 */
function buildWhatsAppLink(message) {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens a WhatsApp chat. Navigating the current tab (instead of a
 * popup) is what works reliably inside Instagram/TikTok in-app
 * browsers and on iOS, where most visitors will come from.
 */
function openWhatsApp(message) {
  window.location.href = buildWhatsAppLink(message);
}

document.addEventListener("DOMContentLoaded", () => {
  renderBrandChrome();
  setupHeaderShadow();
});

/* ---------------------------------------------------------
   Header / footer content from config.js
--------------------------------------------------------- */
function renderBrandChrome() {
  document.querySelectorAll("[data-brand-name]").forEach(el => (el.textContent = BUSINESS.name));
  document.querySelectorAll("[data-brand-logo]").forEach(el => {
    el.src = BUSINESS.logo;
    el.alt = "";
  });
  document.querySelectorAll("[data-brand-tagline]").forEach(el => (el.textContent = BUSINESS.tagline));
  document.querySelectorAll("[data-year]").forEach(el => (el.textContent = BUSINESS.year));
  document.querySelectorAll("[data-whatsapp-number]").forEach(el => {
    el.textContent = BUSINESS.whatsappDisplay || `+${BUSINESS.whatsappNumber}`;
  });
  document.querySelectorAll("[data-whatsapp-link]").forEach(el => {
    el.href = buildWhatsAppLink(GENERAL_MESSAGE);
  });

  toggleRow("[data-instagram-row]", BUSINESS.instagramUrl, row => {
    const link = row.querySelector("a");
    link.href = BUSINESS.instagramUrl;
    row.querySelector("[data-instagram-handle]").textContent = BUSINESS.instagramHandle || "Instagram";
  });
  toggleRow("[data-email-row]", BUSINESS.email, row => {
    const link = row.querySelector("a");
    link.href = `mailto:${BUSINESS.email}`;
    row.querySelector("[data-email]").textContent = BUSINESS.email;
  });
  toggleRow("[data-location-row]", BUSINESS.location, row => {
    row.querySelector("[data-location]").textContent = BUSINESS.location;
  });
}

function toggleRow(selector, value, fill) {
  document.querySelectorAll(selector).forEach(row => {
    if (value) fill(row);
    else row.hidden = true;
  });
}

function setupHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 4);
  update();
  window.addEventListener("scroll", update, { passive: true });
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
