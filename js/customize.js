/* ============================================================
   CUSTOMIZE.JS — Design Your Own page (customize.html)
   ============================================================ */

const DRAFT_KEY = "chaosdye-custom-draft";
const LAST_STEP = 4;
const NEXT_LABELS = { 1: "Next: Colors", 2: "Next: Size", 3: "Review order" };

const state = {
  step: 1,
  designId: null,
  colorIds: [],
  size: null,
  quantity: 1,
  notes: ""
};

document.addEventListener("DOMContentLoaded", () => {
  restoreDraft();

  document.querySelectorAll("[data-max-colors]").forEach(el => (el.textContent = MAX_COLORS));

  renderDesignOptions();
  renderColorOptions();
  renderSizeOptions();
  setupQuantity();
  setupNotes();
  setupStepNav();
  updatePreview();
  goToStep(1, { scroll: false });
});

/* ---------------------------------------------------------
   Draft — remembers the visitor's picks if they leave and
   come back (e.g. switch to WhatsApp and return).
--------------------------------------------------------- */
function restoreDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (saved) {
      if (DESIGNS.some(d => d.id === saved.designId)) state.designId = saved.designId;
      if (Array.isArray(saved.colorIds)) {
        state.colorIds = saved.colorIds.filter(id => COLORS.some(c => c.id === id)).slice(0, MAX_COLORS);
      }
      if (SIZES.includes(saved.size)) state.size = saved.size;
      if (Number.isInteger(saved.quantity) && saved.quantity >= 1 && saved.quantity <= 99) state.quantity = saved.quantity;
      if (typeof saved.notes === "string") state.notes = saved.notes.slice(0, 500);
    }
  } catch (e) { /* storage unavailable — start fresh */ }

  // A design picked from the home page (customize.html?design=spiral) wins
  const fromUrl = new URLSearchParams(window.location.search).get("design");
  if (DESIGNS.some(d => d.id === fromUrl)) state.designId = fromUrl;
}

function saveDraft() {
  try {
    const { designId, colorIds, size, quantity, notes } = state;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ designId, colorIds, size, quantity, notes }));
  } catch (e) { /* ignore */ }
}

/* ---------------------------------------------------------
   Step navigation
--------------------------------------------------------- */
function setupStepNav() {
  document.querySelector("[data-next-step]").addEventListener("click", () => {
    const error = validateStep(state.step);
    if (error) {
      showStepError(state.step, error);
      return;
    }
    clearStepError(state.step);
    goToStep(state.step + 1);
  });

  document.querySelector("[data-prev-step]").addEventListener("click", () => {
    if (state.step > 1) goToStep(state.step - 1);
  });

  document.querySelectorAll("[data-jump-step]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = Number(btn.dataset.jumpStep);
      // Only allow jumping ahead if every step before the target is valid
      for (let s = 1; s < target; s++) {
        const error = validateStep(s);
        if (error) {
          goToStep(s);
          showStepError(s, error);
          return;
        }
      }
      goToStep(target);
    });
  });

  document.getElementById("submit-order-btn").addEventListener("click", e => {
    const error = validateFullOrder();
    if (error) {
      e.preventDefault();
      document.getElementById("final-order-error").textContent = error;
    }
  });
}

function goToStep(n, { scroll = true } = {}) {
  state.step = n;

  document.querySelectorAll(".step-panel").forEach(panel => {
    panel.classList.toggle("is-active", Number(panel.dataset.step) === n);
  });
  document.querySelectorAll(".progress-step").forEach(dot => {
    const dotStep = Number(dot.dataset.step);
    dot.classList.toggle("is-active", dotStep === n);
    dot.classList.toggle("is-complete", dotStep < n);
    if (dotStep === n) dot.setAttribute("aria-current", "step");
    else dot.removeAttribute("aria-current");
  });

  const next = document.querySelector("[data-next-step]");
  const submit = document.getElementById("submit-order-btn");
  next.hidden = n === LAST_STEP;
  next.textContent = NEXT_LABELS[n] || "";
  submit.hidden = n !== LAST_STEP;
  document.querySelector("[data-prev-step]").disabled = n === 1;

  if (n === LAST_STEP) renderReview();

  if (scroll) {
    const heading = document.querySelector(`.step-panel[data-step="${n}"] h2`);
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    // Land just below the sticky header + progress bar
    const layout = document.getElementById("customizer");
    const offset = document.querySelector(".site-header").offsetHeight + document.querySelector(".progress").offsetHeight;
    const top = layout.getBoundingClientRect().top + window.scrollY - offset;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  }
}

function validateStep(step) {
  if (step === 1 && !state.designId) return "Pick a technique to continue.";
  if (step === 2 && state.colorIds.length === 0) return "Pick at least one color.";
  if (step === 3 && !state.size) return "Pick a size.";
  if (step === 3 && (!Number.isInteger(state.quantity) || state.quantity < 1)) return "Enter a valid quantity.";
  return null;
}

function validateFullOrder() {
  for (let s = 1; s < LAST_STEP; s++) {
    const error = validateStep(s);
    if (error) return error;
  }
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
      <img src="${d.image}" alt="" class="design-card__image" loading="lazy">
      <span>
        <span class="design-card__name">${escapeHTML(d.name)}</span>
        <span class="design-card__desc">${escapeHTML(d.description)}</span>
      </span>
      <span class="design-card__check" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 20.6 7.4 19.2 6z"/></svg>
      </span>
    </button>
  `).join("");

  const cards = wrap.querySelectorAll("[data-design-id]");
  const sync = () => cards.forEach(c => {
    const selected = c.dataset.designId === state.designId;
    c.classList.toggle("is-selected", selected);
    c.setAttribute("aria-pressed", String(selected));
  });

  cards.forEach(card => {
    card.addEventListener("click", () => {
      state.designId = card.dataset.designId;
      sync();
      clearStepError(1);
      updatePreview();
      saveDraft();
    });
  });
  sync();
}

/* ---------------------------------------------------------
   Step 2 — Colors
--------------------------------------------------------- */
function renderColorOptions() {
  const wrap = document.getElementById("color-options");
  if (!wrap) return;
  wrap.innerHTML = COLORS.map(c => `
    <button type="button" class="color-swatch" data-color-id="${c.id}" style="--swatch-color: ${c.hex}" aria-pressed="false">
      <span class="color-swatch__circle"><span class="color-swatch__order" data-order></span></span>
      <span class="color-swatch__name">${escapeHTML(c.name)}</span>
    </button>
  `).join("");

  wrap.querySelectorAll("[data-color-id]").forEach(sw => {
    sw.addEventListener("click", () => toggleColor(sw));
  });

  syncColorSwatches();
}

function toggleColor(swatchEl) {
  const id = swatchEl.dataset.colorId;
  const idx = state.colorIds.indexOf(id);

  if (idx > -1) {
    state.colorIds.splice(idx, 1);
    clearStepError(2);
  } else if (state.colorIds.length >= MAX_COLORS) {
    showStepError(2, `Max ${MAX_COLORS} colors — tap one to remove it first.`);
    swatchEl.classList.remove("is-shake");
    void swatchEl.offsetWidth; // restart the animation
    swatchEl.classList.add("is-shake");
    return;
  } else {
    state.colorIds.push(id);
    clearStepError(2);
  }

  syncColorSwatches();
  updatePreview();
  saveDraft();
}

function syncColorSwatches() {
  document.querySelectorAll("[data-color-id]").forEach(sw => {
    const pos = state.colorIds.indexOf(sw.dataset.colorId);
    sw.classList.toggle("is-selected", pos > -1);
    sw.setAttribute("aria-pressed", String(pos > -1));
    sw.querySelector("[data-order]").textContent = pos > -1 ? pos + 1 : "";
  });
  const counter = document.getElementById("color-counter");
  if (counter) counter.textContent = `${state.colorIds.length}/${MAX_COLORS}`;
}

function selectedColors() {
  return state.colorIds.map(id => COLORS.find(c => c.id === id)).filter(Boolean);
}

function colorChipsHTML(colors) {
  return colors.map(c => `<span class="chip"><i style="--chip-color:${c.hex}"></i>${escapeHTML(c.name)}</span>`).join("");
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

  const pills = wrap.querySelectorAll("[data-size]");
  const sync = () => pills.forEach(p => {
    const selected = p.dataset.size === state.size;
    p.classList.toggle("is-selected", selected);
    p.setAttribute("aria-pressed", String(selected));
  });

  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      state.size = pill.dataset.size;
      sync();
      clearStepError(3);
      saveDraft();
    });
  });
  sync();
}

function setupQuantity() {
  const input = document.getElementById("quantity-input");
  if (!input) return;

  input.value = state.quantity;

  function setQty(n) {
    state.quantity = Math.max(1, Math.min(99, Math.floor(n) || 1));
    input.value = state.quantity;
    clearStepError(3);
    saveDraft();
  }

  document.getElementById("quantity-minus").addEventListener("click", () => setQty(state.quantity - 1));
  document.getElementById("quantity-plus").addEventListener("click", () => setQty(state.quantity + 1));
  input.addEventListener("change", () => setQty(Number(input.value)));
}

function setupNotes() {
  const textarea = document.getElementById("notes-input");
  if (!textarea) return;
  textarea.value = state.notes;
  textarea.addEventListener("input", () => {
    state.notes = textarea.value.trim();
    saveDraft();
  });
}

/* ---------------------------------------------------------
   Step 4 — Review + WhatsApp order
--------------------------------------------------------- */
function renderReview() {
  const design = DESIGNS.find(d => d.id === state.designId);

  setText("review-design", design ? design.name : "—");
  const reviewImg = document.getElementById("review-design-image");
  if (reviewImg && design) {
    reviewImg.src = design.image;
    reviewImg.alt = `${design.name} tie-dye technique`;
  }

  const colorsEl = document.getElementById("review-colors");
  if (colorsEl) {
    colorsEl.innerHTML = selectedColors()
      .map(c => `<li class="chip"><i style="--chip-color:${c.hex}"></i>${escapeHTML(c.name)}</li>`)
      .join("");
  }

  setText("review-size", `Size ${state.size || "—"} · ${state.quantity} ${state.quantity === 1 ? "shirt" : "shirts"}`);

  const notesRow = document.getElementById("review-notes-row");
  notesRow.hidden = !state.notes;
  setText("review-notes", state.notes);

  const error = validateFullOrder();
  const orderBtn = document.getElementById("submit-order-btn");
  orderBtn.href = error ? "#" : buildWhatsAppLink(buildCustomOrderMessage());
  orderBtn.setAttribute("aria-disabled", String(Boolean(error)));
  setText("final-order-error", error || "");

  updatePreview();
}

function buildCustomOrderMessage() {
  const design = DESIGNS.find(d => d.id === state.designId);

  const lines = [
    "Hello! 👋",
    "",
    "I'd like to order a custom tie-dye T-shirt.",
    "",
    `🎨 Design: ${design ? design.name : "-"}`,
    "",
    "🌈 Colors:",
    ...selectedColors().map((c, i) => `${i + 1}. ${c.name}`),
    "",
    `👕 Size: ${state.size}`,
    `📦 Quantity: ${state.quantity}`
  ];

  if (state.notes) {
    lines.push("", "📝 Special requests:", state.notes);
  }

  lines.push("", "Please let me know the price and when it can be ready.");

  return lines.join("\n");
}

/* ---------------------------------------------------------
   Live dye preview
   Draws an approximation of the chosen technique in the chosen
   colors onto every <canvas data-dye-preview>.
--------------------------------------------------------- */
function updatePreview() {
  const design = DESIGNS.find(d => d.id === state.designId);
  const colors = selectedColors();

  document.querySelectorAll("[data-preview-design]").forEach(el => {
    el.textContent = design ? design.name : "Pick a technique";
  });
  document.querySelectorAll("[data-preview-colors]").forEach(el => {
    el.innerHTML = colors.length
      ? colorChipsHTML(colors)
      : `<span class="chip chip--empty">Tap colors below</span>`;
  });

  const hexes = colors.length ? colors.map(c => c.hex) : ["#3A3430", "#6E655C"];
  const pattern = design ? design.pattern : "spiral";
  document.querySelectorAll("[data-dye-preview]").forEach(canvas => drawDye(canvas, pattern, hexes));
}

function drawDye(canvas, pattern, hexes) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = canvas.width;
  const img = ctx.createImageData(size, size);
  const data = img.data;

  const palette = hexes.map(hexToRgb);
  const n = palette.length;
  // Earlier colors get a bigger share of the shirt
  const weights = palette.map((_, i) => 1 + (n - 1 - i) * 0.3);
  const total = weights.reduce((a, b) => a + b, 0);
  const stops = [];
  weights.reduce((acc, w) => (stops.push((acc + w) / total), acc + w), 0);

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const x = px / size - 0.5;
      const y = py / size - 0.5;
      const r = Math.hypot(x, y);
      const grain = fbm(px / size * 7, py / size * 7);
      let t;

      if (pattern === "scrunch") {
        t = fbm(px / size * 3.2 + 10, py / size * 3.2 + 4) * 2.4 + grain * 0.3;
      } else if (pattern === "fold") {
        t = Math.abs(x) * 2.6 - y * 1.7 + grain * 0.35;
      } else {
        const angle = Math.atan2(y, x) / (Math.PI * 2);
        t = angle + r * 2.4 + grain * 0.18;
      }
      t = ((t % 1) + 1) % 1;

      // Pick the band this t falls in, and blend into the next one near the edge
      let i = 0;
      while (i < n - 1 && t > stops[i]) i++;
      const start = i === 0 ? 0 : stops[i - 1];
      const local = (t - start) / (stops[i] - start);
      const edge = smoothstep(0.75, 1, local);
      const a = palette[i];
      const b = palette[(i + 1) % n];

      // Crinkles of undyed white where the fabric was folded tight
      const crinkle = n === 1
        ? 0.15 + smoothstep(0.45, 0.75, fbm(px / size * 9 + 3, py / size * 9)) * 0.55
        : smoothstep(0.62, 0.85, fbm(px / size * 14 + 7, py / size * 14 + 2)) * 0.6;

      const o = (py * size + px) * 4;
      for (let c = 0; c < 3; c++) {
        const mixed = a[c] + (b[c] - a[c]) * edge;
        data[o + c] = mixed + (244 - mixed) * crinkle;
      }
      data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function hexToRgb(hex) {
  const v = parseInt(hex.replace("#", ""), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

function smoothstep(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// Small deterministic value-noise, so the preview looks the same every time
function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const top = hash(xi, yi) + (hash(xi + 1, yi) - hash(xi, yi)) * u;
  const bottom = hash(xi, yi + 1) + (hash(xi + 1, yi + 1) - hash(xi, yi + 1)) * u;
  return top + (bottom - top) * v;
}

function fbm(x, y) {
  return noise(x, y) * 0.55 + noise(x * 2.1, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3) * 0.15;
}

/* ---------------------------------------------------------
   Utilities
--------------------------------------------------------- */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
