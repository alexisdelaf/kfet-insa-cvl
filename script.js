/*
  script.js — Kfet INSA CVL v3.1
  Updated with:
  - separated display for normal vs Nutella orders
  - brown color for Nutella orders in admin
*/

/* -------------------- STORAGE -------------------- */

const STORAGE_KEY = "kfet_orders_v3";
const ARCHIVE_KEY = "kfet_orders_archive";

/** Load all current orders */
function loadOrders() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/** Save orders */
function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

/** Load archived orders */
function loadArchive() {
  const raw = localStorage.getItem(ARCHIVE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/** Save archived orders */
function saveArchive(orders) {
  localStorage.setItem(ARCHIVE_KEY, JSON.stringify(orders));
}

/* -------------------- UTILITIES -------------------- */

function cryptoId() {
  return "id-" + crypto.getRandomValues(new Uint32Array(2)).join("-");
}

function formatDateReadable(date) {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTimeHHMM(date) {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(s) {
  if (!s) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/* -------------------- MAIN PAGE (index.html) -------------------- */

if (document.getElementById("orderForm")) {
  const todayDateEl = document.getElementById("todayDate");
  const dayCountEl = document.getElementById("dayCount");
  const ordersListEl = document.getElementById("ordersList");
  const ordersSummaryEl = document.getElementById("ordersSummary");

  const orderForm = document.getElementById("orderForm");
  const pseudoInput = document.getElementById("pseudo");
  const entreeInput = document.getElementById("entree");
  const platInput = document.getElementById("plat");
  const dessertInput = document.getElementById("dessert");
  const boissonInput = document.getElementById("boisson");
  const commentInput = document.getElementById("comment");
  const clearBtn = document.getElementById("clearBtn");

  // ---- Panini Nutella form ----
  const nutellaForm = document.getElementById("nutellaForm");
  const nutellaPseudo = document.getElementById("nutellaPseudo");
  const nutellaDrink = document.getElementById("nutellaDrink");
  const nutellaComment = document.getElementById("nutellaComment");

  // Show today's date
  const today = new Date();
  todayDateEl.textContent = formatDateReadable(today);

  // Render initial data
  renderMain();

  /* ---- Normal Order Form ---- */
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pseudo = pseudoInput.value.trim();
    const plat = platInput.value;
    if (!pseudo || !plat) {
      alert("Veuillez indiquer un pseudo et un plat.");
      return;
    }

    const order = {
      id: cryptoId(),
      pseudo,
      entree: entreeInput.value || "Aucune",
      plat,
      dessert: dessertInput.value || "Aucun",
      boisson: boissonInput.value || "Aucune",
      comment: commentInput.value.trim() || "",
      datetimeISO: new Date().toISOString(),
      validated: false,
      status: "en attente",
      nutella: false
    };

    const orders = loadOrders();
    orders.unshift(order);
    saveOrders(orders);

    renderMain();
    orderForm.reset();
    pseudoInput.focus();
  });

  clearBtn.addEventListener("click", () => orderForm.reset());

  /* ---- Panini Nutella Order ---- */
  nutellaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pseudo = nutellaPseudo.value.trim();
    if (!pseudo) return alert("Pseudo obligatoire !");
    const order = {
      id: cryptoId(),
      pseudo,
      entree: "Aucune",
      plat: "Panini Nutella",
      dessert: "Aucun",
      boisson: nutellaDrink.value,
      comment: nutellaComment.value.trim() || "",
      datetimeISO: new Date().toISOString(),
      validated: false,
      status: "en attente",
      nutella: true,
    };

    const orders = loadOrders();
    orders.unshift(order);
    saveOrders(orders);

    renderMain();
    nutellaForm.reset();
  });

  /* ---- Render all orders ---- */
  function renderMain() {
    const orders = loadOrders();
    const now = new Date().toISOString().slice(0, 10);

    const todaysOrders = orders.filter(
      (o) => o.datetimeISO.slice(0, 10) === now
    );

    // Separate Nutella vs Normal orders
    const normalOrders = todaysOrders.filter(o => !o.nutella);
    const nutellaOrders = todaysOrders.filter(o => o.nutella);

    // --- Commandes normales ---
    dayCountEl.textContent = todaysOrders.length;
    ordersSummaryEl.textContent = `${normalOrders.length} commande(s)`;
    ordersListEl.innerHTML = "";
    if (normalOrders.length === 0) {
      ordersListEl.innerHTML =
        '<p class="text-sm text-gray-500">Aucune commande midi aujourd\'hui.</p>';
    } else {
      normalOrders.forEach(o => renderOrderRow(ordersListEl, o));
    }

    // --- Commandes Panini Nutella ---
    const nutellaListEl = document.getElementById("nutellaOrdersList");
    const nutellaSummaryEl = document.getElementById("nutellaOrdersSummary");
    if (nutellaListEl && nutellaSummaryEl) {
      nutellaListEl.innerHTML = "";
      nutellaSummaryEl.textContent = `${nutellaOrders.length} commande(s)`;
      if (nutellaOrders.length === 0) {
        nutellaListEl.innerHTML =
          '<p class="text-sm text-gray-500">Aucune commande Panini Nutella aujourd\'hui.</p>';
      } else {
        nutellaOrders.forEach(o => renderOrderRow(nutellaListEl, o));
      }
    }
  }

  /* ---- Row renderer ---- */
  function renderOrderRow(container, o) {
    const row = document.createElement("div");
    row.className = "order-row flex items-center justify-between";

    const left = document.createElement("div");
    left.innerHTML = `<div class="font-medium">${escapeHtml(o.pseudo)}</div>`;

    const right = document.createElement("div");
    right.className = "flex items-center gap-3";
    const time = document.createElement("div");
    time.className = "text-sm text-gray-500";
    time.textContent = formatTimeHHMM(new Date(o.datetimeISO));
    right.appendChild(time);

    const dot = document.createElement("div");
    dot.className = "circle";
    dot.style.background = o.validated ? "#16a34a" : "#ef4444";
    dot.title = o.status;
    right.appendChild(dot);

    row.appendChild(left);
    row.appendChild(right);
    container.appendChild(row);
  }
}

/* -------------------- ADMIN / ARCHIVE HELPERS -------------------- */

/** Move order to archive (used in admin.html) */
function archiveOrder(orderId, newStatus) {
  const orders = loadOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return;

  const order = orders[idx];
  order.status = newStatus;

  // Remove from current list
  orders.splice(idx, 1);
  saveOrders(orders);

  // Add to archive
  const archived = loadArchive();
  archived.unshift(order);
  saveArchive(archived);
}

/* Export globally for admin pages */
window.kfet = {
  loadOrders,
  saveOrders,
  loadArchive,
  saveArchive,
  archiveOrder,
  formatTimeHHMM,
};
