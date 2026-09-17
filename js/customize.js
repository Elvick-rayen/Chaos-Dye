/* ============================================================
   CUSTOMIZE.JS — Customize Your Own page (customize.html)
   ============================================================ */

const state = {
  step: 1,
  designId: null,
  colorIds: [],
  size: null,
  quantity: 1,
  notes: ""
};

document.addEventListener("DOMContentLoaded", () => {
  renderBrandChromeShared();
  setupFloatingWhatsAppShared();

  renderDesignOptions();
  renderColorOptions();
  renderSizeOptions();
  setupQuantity();
  setupNotes();
  setupStepNav();
  goToStep(1);
});

/* ---------------------------------------------------------
   Shared header/footer content (duplicated intentionally so
   this page has zero dependency on main.js)
--------------------------------------------------------- */
function renderBrandChromeShared() {
  document.querySelectorAll("[data-brand-name]").forEach(el => (el.textContent = BUSINESS.name));
  document.querySelectorAll("[data-brand-logo]").forEach(el => {
    el.src = BUSINESS.logo;
    el.alt = `${BUSINESS.name} logo`;
  });
  document.querySelectorAll("[data-brand-tagline]").forEach(el => (el.textContent = BUSINESS.tagline));
  document.querySelectorAll("[data-year]").forEach(el => (el.textContent = BUSINESS.year));
  document.querySelectorAll("[data-whatsapp-number]").forEach(el => (el.textContent = `+${BUSINESS.whatsappNumber}`));
  document.querySelectorAll("[data-instagram-handle]").forEach(el => (el.textContent = BUSINESS.instagramHandle));
  document.querySelectorAll("[data-instagram-link]").forEach(el => (el.href = BUSINESS.instagramUrl));
  document.querySelectorAll("[data-whatsapp-footer-link]").forEach(el => {
    el.href = buildWhatsAppLink("Hello! 👋 I have a question about your tie-dye shirts.");
  });

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

function setupFloatingWhatsAppShared() {
  const btn = document.getElementById("floating-whatsapp");
  if (!btn) return;
  btn.addEventListener("click", () => {
    openWhatsApp("Hello! 👋 I have a question about your tie-dye shirts.");
  });
}

/* ---------------------------------------------------------
   Step navigation
--------------------------------------------------------- */
function setupStepNav() {
  document.querySelectorAll("[data-next-step]").forEach(btn => {
    btn.addEventListener("click", () => {
      const current = state.step;
      const error = validateStep(current);
      if (error) {
        showStepError(current, error);
        return;
      }
      clearStepError(current);
      goToStep(current + 1);
    });
  });

  document.querySelectorAll("[data-prev-step]").forEach(btn => {
    btn.addEventListener("click", () => {
      goToStep(state.step - 1);
    });
  });

  document.querySelectorAll("[data-jump-step]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = Number(btn.getAttribute("data-jump-step"));
      // Only allow jumping to steps already reachable (no skipping ahead unvalidated)
      if (target < state.step || !validateStep(state.step)) {
        goToStep(target);
      }
    });
  });
}

function goToStep(n) {
  state.step = n;
  document.querySelectorAll(".step-panel").forEach(panel => {
    panel.classList.toggle("is-active", Number(panel.dataset.step) === n);
  });
  document.querySelectorAll(".progress-step").forEach(dot => {
    const dotStep = Number(dot.dataset.step);
    dot.classList.toggle("is-active", dotStep === n);
    dot.classList.toggle("is-complete", dotStep < n);
  });
  if (n === 4) renderReview();
  const heading = document.querySelector(`.step-panel[data-step="${n}"] h2`);
  if (heading) heading.setAttribute("tabindex", "-1"), heading.focus({ preventScroll: false });
  window.scrollTo({ top: document.getElementById("customizer")?.offsetTop - 90 || 0, behavior: "smooth" });
}

function validateStep(step) {
  if (step === 1 && !state.designId) return "Please choose a design to continue.";
  if (step === 2 && state.colorIds.length === 0) return "Please choose at least one color.";
  if (step === 3 && !state.size) return "Please choose a size.";
  if (step === 3 && (!Number.isInteger(state.quantity) || state.quantity < 1)) return "Please enter a valid quantity.";
  return null;
}

function showStepError(step, message) {
  const el = document.querySelector(`.step-panel[data-step="${step}"] [data-step-error]`);
  if (el) el.textContent = message;
}
function clearStepError(step) {
  const el = document.querySelector(`.step-panel[data-step="${step}"] [data-step-error]`);
  if (el) el.textContent = "";
}

/* ---------------------------------------------------------
   Step 1 — Design
--------------------------------------------------------- */
function renderDesignOptions() {
  const wrap = document.getElementById("design-options");
  if (!wrap) return;
  wrap.innerHTML = DESIGNS.map(d => `
    <button type="button" class="design-card" data-design-id="${d.id}" aria-pressed="false">
      <img src="${d.image}" alt="${escapeHTML(d.name)} tie-dye reference" class="design-card__image" loading="lazy">
      <span class="design-card__name">${escapeHTML(d.name)}</span>
      <span class="design-card__desc">${escapeHTML(d.description)}</span>
    </button>
  `).join("");

  wrap.querySelectorAll("[data-design-id]").forEach(card => {
    card.addEventListener("click", () => {
      state.designId = card.getAttribute("data-design-id");
      wrap.querySelectorAll("[data-design-id]").forEach(c => {
        const selected = c === card;
        c.classList.toggle("is-selected", selected);
        c.setAttribute("aria-pressed", String(selected));
      });
      clearStepError(1);
    });
  });
}

/* ---------------------------------------------------------
   Step 2 — Colors
--------------------------------------------------------- */
function renderColorOptions() {
  const wrap = document.getElementById("color-options");
  if (!wrap) return;
  wrap.innerHTML = COLORS.map(c => `
    <button type="button" class="color-swatch" data-color-id="${c.id}" style="--swatch-color: ${c.hex}" aria-pressed="false">
      <span class="color-swatch__circle">
        <svg class="color-swatch__check" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 20.6 7.4 19.2 6z"/></svg>
      </span>
      <span class="color-swatch__name">${escapeHTML(c.name)}</span>
    </button>
  `).join("");

  wrap.querySelectorAll("[data-color-id]").forEach(sw => {
    sw.addEventListener("click", () => toggleColor(sw));
  });

  renderSelectedColors();
}

function toggleColor(swatchEl) {
  const id = swatchEl.getAttribute("data-color-id");
  const idx = state.colorIds.indexOf(id);

  if (idx > -1) {
    state.colorIds.splice(idx, 1);
  } else {
    if (state.colorIds.length >= MAX_COLORS) {
      showStepError(2, `You can select up to ${MAX_COLORS} colors.`);
      return;
    }
    state.colorIds.push(id);
    clearStepError(2);
  }

  const selected = state.colorIds.includes(id);
  swatchEl.classList.toggle("is-selected", selected);
  swatchEl.setAttribute("aria-pressed", String(selected));
  renderSelectedColors();
}

function renderSelectedColors() {
  const list = document.getElementById("selected-colors-list");
  const empty = document.getElementById("selected-colors-empty");
  if (!list) return;
  const names = state.colorIds.map(id => COLORS.find(c => c.id === id)?.name).filter(Boolean);
  list.innerHTML = names.map(n => `<li>${escapeHTML(n)}</li>`).join("");
  if (empty) empty.style.display = names.length ? "none" : "block";
}

/* ---------------------------------------------------------
   Step 3 — Size, quantity, notes
--------------------------------------------------------- */
function renderSizeOptions() {
  const wrap = document.getElementById("size-options");
  if (!wrap) return;
  wrap.innerHTML = SIZES.map(s => `
    <button type="button" class="size-pill" data-size="${s}" aria-pressed="false">${s}</button>
  `).join("");

  wrap.querySelectorAll("[data-size]").forEach(pill => {
    pill.addEventListener("click", () => {
      state.size = pill.getAttribute("data-size");
      wrap.querySelectorAll("[data-size]").forEach(p => {
        const selected = p === pill;
        p.classList.toggle("is-selected", selected);
        p.setAttribute("aria-pressed", String(selected));
      });
      clearStepError(3);
    });
  });
}

function setupQuantity() {
  const input = document.getElementById("quantity-input");
  const minus = document.getElementById("quantity-minus");
  const plus = document.getElementById("quantity-plus");
  if (!input) return;

  input.value = state.quantity;

  function setQty(n) {
    n = Math.max(1, Math.min(99, Math.floor(n) || 1));
    state.quantity = n;
    input.value = n;
    clearStepError(3);
  }

  minus.addEventListener("click", () => setQty(state.quantity - 1));
  plus.addEventListener("click", () => setQty(state.quantity + 1));
  input.addEventListener("change", () => setQty(Number(input.value)));
}

function setupNotes() {
  const textarea = document.getElementById("notes-input");
  if (!textarea) return;
  textarea.addEventListener("input", () => {
    state.notes = textarea.value.trim();
  });
}

/* ---------------------------------------------------------
   Step 4 — Review + WhatsApp order
--------------------------------------------------------- */
function renderReview() {
  const design = DESIGNS.find(d => d.id === state.designId);
  const colorNames = state.colorIds.map(id => COLORS.find(c => c.id === id)?.name).filter(Boolean);

  setText("review-design", design ? design.name : "—");
  const reviewImg = document.getElementById("review-design-image");
  if (reviewImg && design) {
    reviewImg.src = design.image;
    reviewImg.alt = design.name;
  }

  const colorsEl = document.getElementById("review-colors");
  if (colorsEl) colorsEl.innerHTML = colorNames.map(n => `<li>${escapeHTML(n)}</li>`).join("");

  setText("review-size", state.size || "—");
  setText("review-quantity", String(state.quantity));

  const notesRow = document.getElementById("review-notes-row");
  if (notesRow) {
    if (state.notes) {
      notesRow.style.display = "";
      setText("review-notes", state.notes);
    } else {
      notesRow.style.display = "none";
    }
  }

  const orderBtn = document.getElementById("submit-order-btn");
  const finalError = validateFullOrder();
  if (orderBtn) {
    orderBtn.disabled = Boolean(finalError);
  }
  const errEl = document.getElementById("final-order-error");
  if (errEl) errEl.textContent = finalError || "";

  if (orderBtn && !orderBtn.dataset.bound) {
    orderBtn.dataset.bound = "true";
    orderBtn.addEventListener("click", () => {
      const err = validateFullOrder();
      if (err) {
        if (errEl) errEl.textContent = err;
        return;
      }
      openWhatsApp(buildCustomOrderMessage());
    });
  }
}

function validateFullOrder() {
  if (!state.designId) return "Please choose a design.";
  if (state.colorIds.length === 0) return "Please choose at least one color.";
  if (!state.size) return "Please choose a size.";
  if (!Number.isInteger(state.quantity) || state.quantity < 1) return "Please choose a valid quantity.";
  return null;
}

function buildCustomOrderMessage() {
  const design = DESIGNS.find(d => d.id === state.designId);
  const colorNames = state.colorIds.map(id => COLORS.find(c => c.id === id)?.name).filter(Boolean);

  const lines = [
    "Hello! 👋",
    "",
    "I'd like to order a custom tie-dye T-shirt.",
    "",
    `🎨 Design: ${design ? design.name : "-"}`,
    "",
    "🌈 Colors:",
    ...colorNames.map(n => `- ${n}`),
    "",
    `👕 Size: ${state.size}`,
    "",
    `📦 Quantity: ${state.quantity}`
  ];

  if (state.notes) {
    lines.push("", "📝 Special Instructions:", state.notes);
  }

  lines.push("", "Please let me know the price and when it can be ready.");

  return lines.join("\n");
}

/* ---------------------------------------------------------
   Utilities
--------------------------------------------------------- */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
