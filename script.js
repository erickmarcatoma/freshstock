/* ====================================================
   FreshStock Core Application Logic (script.js)
   ==================================================== */

document.addEventListener("DOMContentLoaded", () => {
  let inventory = [];
  let currentFilter = "all";

  // Pre-loaded Demo Dataset for Instant Portfolio Testing
  const SAMPLE_DEMO_DATA = [
    { id: 101, name: "Valley Whole Milk 1 Gal", category: "Dairy", quantity: 8, rate: 1, expDate: getFutureDate(8) },
    { id: 102, name: "Valley 2% Reduced Fat Milk 1 Gal", category: "Dairy", quantity: 5, rate: 1, expDate: getFutureDate(5) },
    { id: 103, name: "Valley Heavy Cream 40% 1 Qt", category: "Dairy", quantity: 12, rate: 2, expDate: getFutureDate(6) },
    { id: 104, name: "Northwood Peach Yogurt 6oz", category: "Dairy", quantity: 4, rate: 1, expDate: getFutureDate(2) },
    { id: 105, name: "Great Lakes Shredded Mozzarella 16oz", category: "Dairy", quantity: 2, rate: 1, expDate: getFutureDate(1) },
    { id: 106, name: "Midwest Eggnog 1/2 Gal", category: "Dairy", quantity: 0, rate: 1, expDate: getFutureDate(-2) },
    { id: 107, name: "Artisanal Sourdough Bread", category: "Bakery", quantity: 10, rate: 3, expDate: getFutureDate(4) }
  ];

  initApp();

  function initApp() {
    const urlParams = new URLSearchParams(window.location.search);
    const isDemo = urlParams.get("demo") === "true";
    const isFresh = urlParams.get("fresh") === "true";

    if (isDemo) {
      // 1. Explicit Demo Mode: Load sample data
      inventory = [...SAMPLE_DEMO_DATA];
      saveToLocalStorage();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (isFresh) {
      // 2. Explicit Live Mode: Start completely empty
      inventory = [];
      localStorage.removeItem("freshstock_inventory");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // 3. Regular Reload: Load existing local storage or default to empty
      loadFromLocalStorage();
    }

    setupNavigation();
    setupEventListeners();
    renderAll();
  }

  /* ====================================================
     1. Tab Navigation Engine
     ==================================================== */
  function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const views = document.querySelectorAll(".tab-view");

    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        navItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");

        const targetTab = item.getAttribute("data-tab");
        views.forEach((view) => {
          if (view.id === `view-${targetTab}`) {
            view.classList.remove("hidden");
          } else {
            view.classList.add("hidden");
          }
        });
      });
    });
  }

  /* ====================================================
     2. Event Listeners & Interactive Stat Cards
     ==================================================== */
  function setupEventListeners() {
    // Clickable Stat Card Quick Filters
    const metricCards = document.querySelectorAll(".stat-card.clickable");
    metricCards.forEach((card) => {
      card.addEventListener("click", () => {
        metricCards.forEach((c) => c.classList.remove("active-filter"));
        card.classList.add("active-filter");

        currentFilter = card.getAttribute("data-filter");
        renderDashboardAlerts();
      });
    });

    // Global Search Filter
    const searchInput = document.getElementById("global-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        filterAllTables(e.target.value.toLowerCase().trim());
      });
    }

    // Manual Add Item Form
    const addForm = document.getElementById("add-item-form");
    if (addForm) {
      addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newItem = {
          id: Date.now(),
          name: document.getElementById("item-name").value,
          category: document.getElementById("item-category").value || "Dairy",
          quantity: parseInt(document.getElementById("item-qty").value) || 0,
          rate: parseInt(document.getElementById("item-rate").value) || 1,
          expDate: document.getElementById("item-exp").value,
        };

        inventory.push(newItem);
        saveToLocalStorage();
        renderAll();
        addForm.reset();
        alert("Item added successfully!");
      });
    }

    // CSV Drag & Drop Zone
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("csv-file-input");

    if (dropZone && fileInput) {
      dropZone.addEventListener("click", () => fileInput.click());
      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-over");
      });
      dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
        if (e.dataTransfer.files.length) parseCSV(e.dataTransfer.files[0]);
      });
      fileInput.addEventListener("change", (e) => {
        if (e.target.files.length) parseCSV(e.target.files[0]);
      });
    }

    // Export & Reset Session
    const resetBtn = document.getElementById("reset-session-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Clear all items from local memory?")) {
          inventory = [];
          localStorage.removeItem("freshstock_inventory");
          renderAll();
        }
      });
    }

    const exportBtn = document.getElementById("export-csv-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", exportToCSV);
    }
  }

  /* ====================================================
     3. Render Engine & Refined Health Score Math
     ==================================================== */
  function renderAll() {
    updateMetricsAndHealth();
    renderDashboardAlerts();
    renderFullInventory();
    renderAllAlertsTab();
  }

  function updateMetricsAndHealth() {
    const total = inventory.length;

    // Reset view if no items exist
    if (total === 0) {
      document.getElementById("total-items-val").textContent = "0";
      document.getElementById("low-stock-val").textContent = "0";
      document.getElementById("expiring-val").textContent = "0";
      document.getElementById("out-val").textContent = "0";
      document.getElementById("nav-alerts-badge").textContent = "0";
      document.getElementById("topbar-notif-badge").textContent = "0";
      document.getElementById("health-percent").textContent = "100%";
      document.getElementById("health-status-text").textContent = "Optimal";
      document.getElementById("health-status-text").style.color = "#10b981";

      const summaryEl = document.getElementById("health-summary-text");
      if (summaryEl) summaryEl.textContent = "No active inventory items tracked yet.";

      document.getElementById("legend-good-val").textContent = "0%";
      document.getElementById("legend-low-val").textContent = "0%";
      document.getElementById("legend-bad-val").textContent = "0%";
      document.getElementById("health-donut").style.background = `conic-gradient(#10b981 0% 100%)`;
      return;
    }

    const today = new Date();
    let criticalCount = 0;
    let moderateCount = 0;
    let healthyCount = 0;

    let lowCount = 0;
    let expiringCount = 0;
    let outCount = 0;

    inventory.forEach((item) => {
      const exp = new Date(item.expDate);
      const daysUntilExp = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
      
      const dailyRate = item.rate > 0 ? item.rate : 1;
      const daysOfSupply = item.quantity / dailyRate;

      // Metric Card Counters
      if (item.quantity === 0) outCount++;
      else if (daysOfSupply <= 3 || item.quantity <= 5) lowCount++;

      if (daysUntilExp <= 3 && item.quantity > 0) expiringCount++;

      // Health Classification Logic
      if (item.quantity === 0 || daysOfSupply <= 2 || daysUntilExp <= 2) {
        criticalCount++;
      } else if (daysOfSupply <= 6 || daysUntilExp <= 5) {
        moderateCount++;
      } else {
        healthyCount++;
      }
    });

    // Update Metric Strip Counters
    document.getElementById("total-items-val").textContent = total;
    document.getElementById("low-stock-val").textContent = lowCount;
    document.getElementById("expiring-val").textContent = expiringCount;
    document.getElementById("out-val").textContent = outCount;

    // Sidebar & Topbar Badges
    const totalAlerts = lowCount + expiringCount + outCount;
    document.getElementById("nav-alerts-badge").textContent = totalAlerts;
    document.getElementById("topbar-notif-badge").textContent = totalAlerts;

    // Health Score Math
    const penalty = ((criticalCount * 1.0) + (moderateCount * 0.4)) / total;
    const healthScore = Math.max(0, Math.round((1 - penalty) * 100));

    // Percentages for Donut Widget
    const healthyPct = Math.round((healthyCount / total) * 100);
    const moderatePct = Math.round((moderateCount / total) * 100);
    const criticalPct = Math.max(0, 100 - healthyPct - moderatePct);

    // Dynamic UI Status Text
    const percentEl = document.getElementById("health-percent");
    const statusEl = document.getElementById("health-status-text");
    const summaryEl = document.getElementById("health-summary-text");

    percentEl.textContent = `${healthScore}%`;

    if (healthScore >= 85) {
      statusEl.textContent = "Optimal";
      statusEl.style.color = "#10b981";
      if (summaryEl) summaryEl.textContent = "Your inventory is in great shape!";
    } else if (healthScore >= 65) {
      statusEl.textContent = "Fair";
      statusEl.style.color = "#f59e0b";
      if (summaryEl) summaryEl.textContent = "Attention needed: Some items are low or expiring.";
    } else {
      statusEl.textContent = "Critical";
      statusEl.style.color = "#ef4444";
      if (summaryEl) summaryEl.textContent = "Action required: High risk of stockouts or expired goods!";
    }

    document.getElementById("legend-good-val").textContent = `${healthyPct}%`;
    document.getElementById("legend-low-val").textContent = `${moderatePct}%`;
    document.getElementById("legend-bad-val").textContent = `${criticalPct}%`;

    // Conic Gradient Ring Render
    const donut = document.getElementById("health-donut");
    donut.style.background = `conic-gradient(
      #10b981 0% ${healthyPct}%, 
      #f59e0b ${healthyPct}% ${healthyPct + moderatePct}%, 
      #ef4444 ${healthyPct + moderatePct}% 100%
    )`;
  }

  function renderDashboardAlerts() {
    const tbody = document.getElementById("dashboard-alerts-tbody");
    const tableTitle = document.getElementById("alerts-table-title");
    if (!tbody) return;

    const today = new Date();
    let filteredItems = [...inventory];

    if (currentFilter === "low") {
      filteredItems = inventory.filter((item) => {
        const dailyRate = item.rate > 0 ? item.rate : 1;
        const daysOfSupply = item.quantity / dailyRate;
        return item.quantity > 0 && (daysOfSupply <= 3 || item.quantity <= 5);
      });
      if (tableTitle) tableTitle.textContent = "Stock Alerts — Low Stock & High Usage";
    } else if (currentFilter === "expiring") {
      filteredItems = inventory.filter((item) => {
        const exp = new Date(item.expDate);
        const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && item.quantity > 0;
      });
      if (tableTitle) tableTitle.textContent = "Stock Alerts — Expiring Soon";
    } else if (currentFilter === "out") {
      filteredItems = inventory.filter((item) => item.quantity === 0);
      if (tableTitle) tableTitle.textContent = "Stock Alerts — Out of Stock";
    } else {
      if (tableTitle) tableTitle.textContent = "Stock Alerts — All Active Stock";
    }

    if (!filteredItems.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: #94a3b8;">No items match the selected filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = filteredItems.map((item) => createRowHTML(item)).join("");
  }

  function renderFullInventory() {
    const tbody = document.getElementById("full-inventory-tbody");
    if (!tbody) return;

    if (!inventory.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #94a3b8;">No inventory items yet. Add items in the Add Item tab!</td></tr>`;
      return;
    }

    tbody.innerHTML = inventory.map((item) => {
      const categoryName = item.category && item.category.trim() !== "" ? item.category : "Dairy";
      return `
        <tr>
          <td><span class="item-title">${escapeHTML(item.name)}</span></td>
          <td><span class="category-tag">${escapeHTML(categoryName)}</span></td>
          <td>${item.quantity}</td>
          <td>${item.rate} / day</td>
          <td>${item.expDate}</td>
          <td style="text-align: right;">
            <button class="btn-outline-sm" style="color:#ef4444;" onclick="deleteItem(${item.id})">Delete</button>
          </td>
        </tr>`;
    }).join("");
  }

  function renderAllAlertsTab() {
    const tbody = document.getElementById("all-alerts-tbody");
    if (!tbody) return;

    const alertItems = getAlertItems();
    if (!alertItems.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: #94a3b8;">No alerts requiring attention!</td></tr>`;
      return;
    }

    tbody.innerHTML = alertItems.map((item) => createRowHTML(item)).join("");
  }

  function getAlertItems() {
    const today = new Date();
    return inventory.filter((item) => {
      const exp = new Date(item.expDate);
      const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
      const dailyRate = item.rate > 0 ? item.rate : 1;
      const daysOfSupply = item.quantity / dailyRate;

      return item.quantity === 0 || daysOfSupply <= 3 || diffDays <= 3;
    });
  }

  function createRowHTML(item) {
    const today = new Date();
    const exp = new Date(item.expDate);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    const dailyRate = item.rate > 0 ? item.rate : 1;
    const daysOfSupply = Math.round(item.quantity / dailyRate);

    let statusPill = `<span class="status-pill status-low">Low Stock</span>`;
    let detailText = `${item.quantity} in stock (~${daysOfSupply}d left)`;

    if (item.quantity === 0) {
      statusPill = `<span class="status-pill status-out">Out of Stock</span>`;
      detailText = `0 quantity`;
    } else if (diffDays <= 3) {
      statusPill = `<span class="status-pill status-expiring">Expiring Soon</span>`;
      detailText = `<div class="exp-date">${item.expDate}</div><div class="sub-text">${diffDays} days left</div>`;
    }

    const categoryName = item.category && item.category.trim() !== "" ? item.category : "Dairy";

    return `
      <tr>
        <td><span class="item-title">${escapeHTML(item.name)}</span></td>
        <td><span class="category-tag">${escapeHTML(categoryName)}</span></td>
        <td>${statusPill}</td>
        <td>${detailText}</td>
        <td style="text-align: right;">
          <button class="btn-table-action" style="color: #10b981; border-color: #a7f3d0;" onclick="resolveAlert(${item.id})">
            Resolve
          </button>
        </td>
      </tr>`;
  }

  /* ====================================================
     4. Resolve Handler, Delete & Local Storage Helpers
     ==================================================== */
  window.resolveAlert = function(id) {
    const item = inventory.find((i) => i.id === id);
    if (!item) return;

    const newQty = prompt(`Restock "${item.name}"\nEnter new quantity:`, item.quantity + 10);
    
    if (newQty !== null && !isNaN(newQty)) {
      item.quantity = parseInt(newQty, 10);
      
      const today = new Date();
      const exp = new Date(item.expDate);
      const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 3) {
        const newExp = prompt(`Update Expiration Date for "${item.name}" (YYYY-MM-DD):`, getFutureDate(14));
        if (newExp) item.expDate = newExp.trim();
      }

      saveToLocalStorage();
      renderAll();
    }
  };

  window.deleteItem = function(id) {
    inventory = inventory.filter((item) => item.id !== id);
    saveToLocalStorage();
    renderAll();
  };

  function filterAllTables(query) {
    document.querySelectorAll("tbody tr").forEach((row) => {
      row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
    });
  }

  function parseCSV(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const lines = e.target.result.split("\n");
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length >= 4) {
          inventory.push({
            id: Date.now() + i,
            name: cols[0].trim(),
            category: cols[1] && cols[1].trim() !== "" ? cols[1].trim() : "Dairy",
            quantity: parseInt(cols[2].trim()) || 0,
            rate: parseInt(cols[3].trim()) || 1,
            expDate: cols[4] ? cols[4].trim() : getFutureDate(7),
          });
        }
      }
      saveToLocalStorage();
      renderAll();
      alert("CSV uploaded successfully!");
    };
    reader.readAsText(file);
  }

  function exportToCSV() {
    if (!inventory.length) return alert("No items to export!");
    let csv = "Name,Category,Quantity,DailyRate,ExpirationDate\n";
    inventory.forEach((i) => csv += `${i.name},${i.category},${i.quantity},${i.rate},${i.expDate}\n`);
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    link.download = "freshstock_inventory.csv";
    link.click();
  }

  function saveToLocalStorage() {
    localStorage.setItem("freshstock_inventory", JSON.stringify(inventory));
  }

  function loadFromLocalStorage() {
    const stored = localStorage.getItem("freshstock_inventory");
    if (stored) {
      try { inventory = JSON.parse(stored); } catch (e) { inventory = []; }
    }
  }

  function getFutureDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  }

  function escapeHTML(str) {
    return (str || "").replace(/[&<>'"]/g, (t) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[t] || t));
  }
});