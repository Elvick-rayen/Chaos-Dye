/* ============================================================
   WHATSAPP.JS
   Small shared helper for building wa.me links.
   Both main.js (Available page) and customize.js use this.
   ============================================================ */

/**
 * Builds a wa.me link with a URL-encoded message.
 * @param {string} message - plain text message
 * @returns {string} full https://wa.me/... URL
 */
function buildWhatsAppLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encoded}`;
}

/** Opens a WhatsApp order chat in a new tab. */
function openWhatsApp(message) {
  window.open(buildWhatsAppLink(message), "_blank", "noopener");
}
