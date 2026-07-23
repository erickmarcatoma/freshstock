// Helper to dynamically offset dates relative to TODAY
function getOffsetDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ----------------------------------------------------
// 1. Dynamic FreshRoute Inventory Dataset (80 SKUs)
// ----------------------------------------------------
const defaultInventory = [
  // --- TIER 1: CRITICAL (EXPIRED / BOTH) ---
  { id: 101, name: "Valley Whole Milk 1 Gal", quantity: 8, minQuantity: 45, expirationDate: getOffsetDate(-2) }, // Expired + Low
  { id: 103, name: "Valley 2% Reduced Fat Milk 1 Gal", quantity: 5, minQuantity: 50, expirationDate: getOffsetDate(-1) }, // Expired
  { id: 113, name: "Valley Heavy Cream 40% Quart", quantity: 12, minQuantity: 30, expirationDate: getOffsetDate(0) }, // Expires Today
  { id: 208, name: "Northwood Peach Yogurt 6oz (12pk)", quantity: 4, minQuantity: 10, expirationDate: getOffsetDate(-3) },
  { id: 307, name: "Great Lakes Shredded Mozzarella 5lb", quantity: 2, minQuantity: 18, expirationDate: getOffsetDate(1) }, // Expiring + Low

  // --- TIER 2 & 3: WARNINGS (EXPIRING SOON / LOW STOCK) ---
  { id: 102, name: "Valley Whole Milk 1/2 Gal", quantity: 60, minQuantity: 30, expirationDate: getOffsetDate(3) }, // Expiring soon
  { id: 105, name: "Valley 1% Lowfat Milk 1 Gal", quantity: 10, minQuantity: 35, expirationDate: getOffsetDate(12) }, // Low stock
  { id: 115, name: "Chef's Select Cream 5 Gal Bag", quantity: 3, minQuantity: 8, expirationDate: getOffsetDate(5) }, // Expiring soon
  { id: 117, name: "Valley Half & Half Pint", quantity: 8, minQuantity: 25, expirationDate: getOffsetDate(15) }, // Low stock
  { id: 201, name: "Hills Farm Plain Greek Yogurt 32oz", quantity: 6, minQuantity: 20, expirationDate: getOffsetDate(4) }, // Expiring soon
  { id: 204, name: "Hills Farm Blueberry Greek Yogurt 5.3oz", quantity: 2, minQuantity: 10, expirationDate: getOffsetDate(6) },
  { id: 303, name: "Wisconsin Shredded Cheddar 5lb Bag", quantity: 4, minQuantity: 20, expirationDate: getOffsetDate(20) }, // Low stock
  { id: 310, name: "Midwest Shredded Pepper Jack 5lb Bag", quantity: 6, minQuantity: 12, expirationDate: getOffsetDate(4) },
  { id: 501, name: "Valley Grade A Sour Cream 5lb Tub", quantity: 7, minQuantity: 15, expirationDate: getOffsetDate(5) },
  { id: 504, name: "Midwest French Onion Dip 16oz", quantity: 3, minQuantity: 20, expirationDate: getOffsetDate(2) },

  // --- HEALTHY STOCK (TIER 4) ---
  { id: 104, name: "Valley 2% Reduced Fat Milk 1/2 Gal", quantity: 35, minQuantity: 25, expirationDate: getOffsetDate(14) },
  { id: 106, name: "Valley Skim Fat Free Milk 1 Gal", quantity: 25, minQuantity: 20, expirationDate: getOffsetDate(18) },
  { id: 107, name: "Prairie Organic Whole Milk 1/2 Gal", quantity: 30, minQuantity: 15, expirationDate: getOffsetDate(16) },
  { id: 108, name: "Prairie Organic 2% Milk 1/2 Gal", quantity: 22, minQuantity: 15, expirationDate: getOffsetDate(22) },
  { id: 109, name: "Midwest Dairy Chocolate Milk Quart", quantity: 40, minQuantity: 20, expirationDate: "2026-08-15" },
  { id: 111, name: "Great Lakes Lactose-Free Whole Milk", quantity: 18, minQuantity: 12, expirationDate: getOffsetDate(30) },
  { id: 114, name: "Valley Heavy Cream 40% Pint", quantity: 28, minQuantity: 20, expirationDate: getOffsetDate(25) },
  { id: 116, name: "Valley Half & Half Quart", quantity: 50, minQuantity: 40, expirationDate: getOffsetDate(20) },
  { id: 118, name: "Prairie Organic Half & Half Pint", quantity: 19, minQuantity: 15, expirationDate: getOffsetDate(28) },
  { id: 120, name: "Midwest Cultured Buttermilk 1/2 Gal", quantity: 16, minQuantity: 10, expirationDate: getOffsetDate(35) },
  { id: 202, name: "Hills Farm Vanilla Greek Yogurt 32oz", quantity: 24, minQuantity: 20, expirationDate: getOffsetDate(30) },
  { id: 203, name: "Hills Farm Honey Greek Yogurt (12pk)", quantity: 15, minQuantity: 10, expirationDate: getOffsetDate(40) },
  { id: 205, name: "Hills Farm Strawberry Greek Yogurt", quantity: 18, minQuantity: 10, expirationDate: getOffsetDate(42) },
  { id: 206, name: "Northwood Organic Whole Milk Yogurt", quantity: 18, minQuantity: 15, expirationDate: getOffsetDate(25) },
  { id: 207, name: "Northwood Organic Vanilla Yogurt", quantity: 19, minQuantity: 15, expirationDate: getOffsetDate(26) },
  { id: 209, name: "Northwood Black Cherry Yogurt (12pk)", quantity: 12, minQuantity: 8, expirationDate: getOffsetDate(32) },
  { id: 210, name: "DairyLand Lowfat Probiotic Kefir", quantity: 14, minQuantity: 12, expirationDate: getOffsetDate(30) },
  { id: 212, name: "DairyLand Probiotic Kefir Strawberry", quantity: 11, minQuantity: 12, expirationDate: getOffsetDate(29) },
  { id: 301, name: "Wisconsin Sharp Cheddar Block 10lb", quantity: 14, minQuantity: 10, expirationDate: getOffsetDate(60) },
  { id: 302, name: "Wisconsin Mild Cheddar Block 10lb", quantity: 22, minQuantity: 15, expirationDate: getOffsetDate(70) },
  { id: 304, name: "Wisconsin Sliced Cheddar 1.5lb Tray", quantity: 30, minQuantity: 15, expirationDate: getOffsetDate(45) },
  { id: 305, name: "Heritage Aged Reserve Cheddar 8oz", quantity: 45, minQuantity: 25, expirationDate: getOffsetDate(90) },
  { id: 306, name: "Great Lakes Whole Milk Mozzarella", quantity: 18, minQuantity: 12, expirationDate: getOffsetDate(30) },
  { id: 308, name: "Great Lakes Fresh Mozzarella Log", quantity: 20, minQuantity: 15, expirationDate: getOffsetDate(22) },
  { id: 309, name: "Midwest Colby Jack Block 5lb", quantity: 16, minQuantity: 10, expirationDate: getOffsetDate(60) },
  { id: 311, name: "Midwest Sliced Swiss Cheese 1.5lb", quantity: 13, minQuantity: 10, expirationDate: getOffsetDate(40) },
  { id: 312, name: "Artisanal Smoked Gouda Wheel 5lb", quantity: 7, minQuantity: 5, expirationDate: getOffsetDate(80) },
  { id: 313, name: "Artisanal Havarti with Dill 8oz", quantity: 20, minQuantity: 15, expirationDate: getOffsetDate(50) },
  { id: 315, name: "Valley Cream Cheese Tub 8oz", quantity: 35, minQuantity: 20, expirationDate: getOffsetDate(40) },
  { id: 317, name: "Prairie Farm Lowfat Cottage Cheese", quantity: 18, minQuantity: 15, expirationDate: getOffsetDate(25) },
  { id: 318, name: "Artisanal Crumbled Feta Tub 2.5lb", quantity: 11, minQuantity: 8, expirationDate: getOffsetDate(45) },
  { id: 320, name: "Great Lakes Grated Parmesan 5lb Tub", quantity: 15, minQuantity: 8, expirationDate: getOffsetDate(100) },
  { id: 401, name: "Midwest Farm Salted Butter Foil 1lb", quantity: 85, minQuantity: 50, expirationDate: getOffsetDate(90) },
  { id: 402, name: "Midwest Farm Unsalted Butter Foil 1lb", quantity: 48, minQuantity: 40, expirationDate: getOffsetDate(85) },
  { id: 404, name: "Heritage Cultured European Butter", quantity: 32, minQuantity: 20, expirationDate: getOffsetDate(75) },
  { id: 406, name: "Valley Whipped Butter Tub 12oz", quantity: 22, minQuantity: 15, expirationDate: getOffsetDate(60) },
  { id: 502, name: "Valley Grade A Sour Cream 16oz Tub", quantity: 48, minQuantity: 30, expirationDate: getOffsetDate(35) },
  { id: 503, name: "Valley Light Sour Cream 16oz Tub", quantity: 18, minQuantity: 15, expirationDate: getOffsetDate(30) },
  { id: 505, name: "Midwest Ranch Dip 16oz", quantity: 25, minQuantity: 20, expirationDate: getOffsetDate(28) },
  { id: 601, name: "Valley Organic Whole Milk Ricotta", quantity: 16, minQuantity: 12, expirationDate: getOffsetDate(20) },
  { id: 603, name: "Great Lakes Ice Cream Mix Chocolate", quantity: 18, minQuantity: 15, expirationDate: getOffsetDate(25) },
  { id: 605, name: "Valley Sweetened Condensed Milk", quantity: 100, minQuantity: 30, expirationDate: getOffsetDate(180) },
  { id: 606, name: "Valley Evaporated Milk 12oz Can", quantity: 85, minQuantity: 30, expirationDate: getOffsetDate(200) },
  { id: 701, name: "Wisconsin Aged Swiss Wheel 15lb", quantity: 40, minQuantity: 10, expirationDate: getOffsetDate(120) },
  { id: 702, name: "Valley Ultra-Pasteurized Milk 1/2 Gal", quantity: 95, minQuantity: 30, expirationDate: getOffsetDate(45) },
  { id: 703, name: "Midwest Clarified Ghee 13oz Jar", quantity: 60, minQuantity: 15, expirationDate: getOffsetDate(250) },
  { id: 704, name: "Heritage Grass-Fed Salted Butter", quantity: 50, minQuantity: 20, expirationDate: getOffsetDate(90) },
  { id: 705, name: "Northwood Organic Plain Yogurt 5lb", quantity: 30, minQuantity: 10, expirationDate: getOffsetDate(30) },
  { id: 706, name: "Valley Real Whipped Cream 14oz", quantity: 72, minQuantity: 25, expirationDate: getOffsetDate(60) },
  { id: 707, name: "Wisconsin Provolone Cheese Log", quantity: 28, minQuantity: 8, expirationDate: getOffsetDate(80) },
  { id: 708, name: "Great Lakes String Cheese 1oz (24pk)", quantity: 65, minQuantity: 20, expirationDate: getOffsetDate(50) },
  { id: 709, name: "DairyLand Organic Chocolate Milk", quantity: 42, minQuantity: 15, expirationDate: getOffsetDate(35) },
  { id: 710, name: "Chef's Select Unsalted Butter 1lb Case", quantity: 18, minQuantity: 5, expirationDate: getOffsetDate(90) },
  { id: 711, name: "Midwest Sharp Cheddar Slices 2.5lb", quantity: 34, minQuantity: 12, expirationDate: getOffsetDate(65) },
  { id: 712, name: "Valley Organic Whole Milk Quart", quantity: 55, minQuantity: 20, expirationDate: getOffsetDate(22) },
  { id: 713, name: "Hills Farm Strawberry Greek Yogurt", quantity: 28, minQuantity: 10, expirationDate: getOffsetDate(30) },
  { id: 714, name: "Great Lakes Monterey Jack Block", quantity: 22, minQuantity: 8, expirationDate: getOffsetDate(75) },
  { id: 715, name: "Artisanal Goat Cheese Log 11oz", quantity: 19, minQuantity: 6, expirationDate: getOffsetDate(40) },
  { id: 716, name: "Wisconsin Sharp White Cheddar 8oz", quantity: 80, minQuantity: 25, expirationDate: getOffsetDate(110) },
  { id: 717, name: "Valley Condensed Skim Milk 5 Gal", quantity: 12, minQuantity: 4, expirationDate: getOffsetDate(20) }
];

// ALWAYS reset localStorage to clear out hardcoded old dates
localStorage.setItem('freshstock_inventory', JSON.stringify(defaultInventory));

let rawInventory = defaultInventory;
let currentFilter = 'all';

function saveToLocalStorage() {
  localStorage.setItem('freshstock_inventory', JSON.stringify(rawInventory));
}

// ----------------------------------------------------
// 2. Core Priority Engine
// ----------------------------------------------------
function runPriorityEngine(items) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return items.map(item => {
    const [year, month, day] = item.expirationDate.split('-').map(Number);
    const expDate = new Date(year, month - 1, day);
    expDate.setHours(0, 0, 0, 0);

    const diffTime = expDate - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isExpired = daysLeft <= 0;
    const isExpiringSoon = daysLeft > 0 && daysLeft <= 7;
    const isLowStock = Number(item.quantity) <= Number(item.minQuantity);

    let status = null;
    let tier = null;

    if (isExpired) {
      status = 'EXPIRED';
      tier = 1;
    } else if (isExpiringSoon && isLowStock) {
      status = 'BOTH';
      tier = 1;
    } else if (isExpiringSoon) {
      status = 'EXPIRING_SOON';
      tier = 2;
    } else if (isLowStock) {
      status = 'LOW_STOCK';
      tier = 3;
    }

    return { ...item, daysLeft, status, tier };
  });
}

// ----------------------------------------------------
// 3. Render Metric Stats Bar (Clickable Filters)
// ----------------------------------------------------
function renderMetrics(processedItems) {
  const metricsContainer = document.getElementById('metrics-bar');

  const criticalCount = processedItems.filter(i => i.tier === 1).length;
  const warningCount = processedItems.filter(i => i.tier === 2 || i.tier === 3).length;
  const healthyCount = processedItems.filter(i => i.tier === null).length;

  metricsContainer.innerHTML = `
    <div class="metric-card critical ${currentFilter === 'critical' ? 'active' : ''}" onclick="setFilter('critical')">
      <span class="metric-value">${criticalCount}</span>
      <span class="metric-label">Critical Alerts</span>
    </div>
    <div class="metric-card warning ${currentFilter === 'warning' ? 'active' : ''}" onclick="setFilter('warning')">
      <span class="metric-value">${warningCount}</span>
      <span class="metric-label">Warnings</span>
    </div>
    <div class="metric-card healthy ${currentFilter === 'healthy' ? 'active' : ''}" onclick="setFilter('healthy')">
      <span class="metric-value">${healthyCount}</span>
      <span class="metric-label">Healthy Stock</span>
    </div>
  `;
}

function setFilter(filterType) {
  if (currentFilter === filterType) {
    currentFilter = 'all';
  } else {
    currentFilter = filterType;
  }
  renderDashboard();
}

// ----------------------------------------------------
// 4. Dashboard Render Engine
// ----------------------------------------------------
function renderDashboard() {
  const dashboardContainer = document.getElementById('dashboard');
  const allProcessed = runPriorityEngine(rawInventory);

  renderMetrics(allProcessed);

  dashboardContainer.innerHTML = '';

  let itemsToDisplay = [];

  if (currentFilter === 'critical') {
    itemsToDisplay = allProcessed.filter(i => i.tier === 1);
  } else if (currentFilter === 'warning') {
    itemsToDisplay = allProcessed.filter(i => i.tier === 2 || i.tier === 3);
  } else if (currentFilter === 'healthy') {
    itemsToDisplay = allProcessed.filter(i => i.tier === null);
  } else {
    itemsToDisplay = allProcessed.filter(i => i.tier !== null);
  }

  itemsToDisplay.sort((a, b) => (a.tier || 4) - (b.tier || 4) || a.daysLeft - b.daysLeft);

  if (itemsToDisplay.length === 0) {
    let emptyTitle = "All Stock Healthy";
    let emptySub = "No critical items or low stock alerts at this time.";

    if (currentFilter === 'critical') {
      emptyTitle = "No Critical Alerts";
      emptySub = "You have no items requiring immediate critical action.";
    } else if (currentFilter === 'warning') {
      emptyTitle = "No Warnings";
      emptySub = "No upcoming expiration or low stock warnings.";
    } else if (currentFilter === 'healthy') {
      emptyTitle = "No Healthy Items";
      emptySub = "All items currently require attention.";
    }

    dashboardContainer.innerHTML = `
      <div class="empty-state">
        <h3>${emptyTitle}</h3>
        <p>${emptySub}</p>
      </div>
    `;
    return;
  }

  const criticalItems = itemsToDisplay.filter(i => i.tier === 1);
  const warningItems = itemsToDisplay.filter(i => i.tier === 2 || i.tier === 3);
  const healthyItems = itemsToDisplay.filter(i => i.tier === null);

  if (criticalItems.length > 0) {
    dashboardContainer.appendChild(createSection('Critical Action Needed', 'critical', criticalItems));
  }

  if (warningItems.length > 0) {
    dashboardContainer.appendChild(createSection('Attention Needed', 'warning', warningItems));
  }

  if (healthyItems.length > 0) {
    dashboardContainer.appendChild(createSection('Healthy Inventory', 'healthy', healthyItems));
  }
}

// Helpers for section & card creation
function createSection(titleText, categoryClass, itemsList) {
  const section = document.createElement('div');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = `section-title ${categoryClass}`;
  title.innerText = titleText;

  const cardList = document.createElement('div');
  cardList.className = 'card-list';

  itemsList.forEach(item => {
    cardList.appendChild(createCardElement(item));
  });

  section.appendChild(title);
  section.appendChild(cardList);
  return section;
}

function createCardElement(item) {
  let expiryText = '';
  if (item.daysLeft < 0) {
    expiryText = `Expired ${Math.abs(item.daysLeft)} days ago`;
  } else if (item.daysLeft === 0) {
    expiryText = 'Expires today!';
  } else if (item.daysLeft === 1) {
    expiryText = 'Expires tomorrow';
  } else {
    expiryText = `Expires in ${item.daysLeft} days`;
  }

  const statusMap = {
    'EXPIRED': 'Action Required',
    'BOTH': 'Action Required',
    'EXPIRING_SOON': 'Expiring Soon',
    'LOW_STOCK': 'Low Stock'
  };

  const isCriticalClass = item.tier === 1 ? 'card-critical' : '';
  const badgeText = item.status ? statusMap[item.status] : 'Healthy';
  const badgeClass = item.status ? `badge-${item.status}` : 'badge-HEALTHY';

  // Render Resolve button ONLY for items that have active alerts (Tier 1, 2, or 3)
  const actionBtnHtml = item.tier !== null 
    ? `<button class="action-btn" onclick="handleQuickAction(${item.id})">Resolve</button>` 
    : '';

  const card = document.createElement('div');
  card.className = `card ${isCriticalClass}`;
  card.innerHTML = `
    <div class="card-info">
      <div class="card-header">
        <span class="item-name">${item.name}</span>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
      <div class="meta-text">
        <span>${expiryText}</span> • Stock: <span>${item.quantity}</span> (Min: ${item.minQuantity})
      </div>
    </div>
    ${actionBtnHtml}
  `;

  return card;
}

// ----------------------------------------------------
// 5. Handlers: Resolve & Add Item
// ----------------------------------------------------
function handleQuickAction(itemId) {
  rawInventory = rawInventory.filter(item => item.id !== itemId);
  saveToLocalStorage();
  renderDashboard();
}

document.getElementById('add-item-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const newItem = {
    id: Date.now(),
    name: document.getElementById('item-name').value.trim(),
    quantity: Number(document.getElementById('item-qty').value),
    minQuantity: Number(document.getElementById('item-min').value),
    expirationDate: document.getElementById('item-exp').value
  };

  rawInventory.push(newItem);
  saveToLocalStorage();
  renderDashboard();

  this.reset();
});

// Initial Render
renderDashboard();
