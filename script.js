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
// 1. Dynamic Default Inventory Dataset (Initial Fallback)
// ----------------------------------------------------
function getInitialDataset() {
  return [
    // --- TIER 1: CRITICAL ALERTS ---
    { id: 101, name: "Valley Whole Milk 1 Gal", quantity: 8, minQuantity: 45, expirationDate: getOffsetDate(-2) },
    { id: 103, name: "Valley 2% Reduced Fat Milk 1 Gal", quantity: 5, minQuantity: 50, expirationDate: getOffsetDate(-1) },
    { id: 113, name: "Valley Heavy Cream 40% Quart", quantity: 12, minQuantity: 30, expirationDate: getOffsetDate(0) },
    { id: 208, name: "Northwood Peach Yogurt 6oz (12pk)", quantity: 4, minQuantity: 10, expirationDate: getOffsetDate(-3) },
    { id: 307, name: "Great Lakes Shredded Mozzarella 5lb", quantity: 2, minQuantity: 18, expirationDate: getOffsetDate(1) },
    { id: 604, name: "Midwest Eggnog 1/2 Gal", quantity: 1, minQuantity: 5, expirationDate: getOffsetDate(-5) },

    // --- TIER 2 & 3: WARNINGS ---
    { id: 102, name: "Valley Whole Milk 1/2 Gal", quantity: 60, minQuantity: 30, expirationDate: getOffsetDate(3) },
    { id: 105, name: "Valley 1% Lowfat Milk 1 Gal", quantity: 10, minQuantity: 35, expirationDate: getOffsetDate(12) },
    { id: 115, name: "Chef's Select Cream 5 Gal Bag", quantity: 3, minQuantity: 8, expirationDate: getOffsetDate(5) },
    { id: 117, name: "Valley Half & Half Pint", quantity: 8, minQuantity: 25, expirationDate: getOffsetDate(15) },
    { id: 201, name: "Hills Farm Plain Greek Yogurt 32oz", quantity: 6, minQuantity: 20, expirationDate: getOffsetDate(4) },
    { id: 204, name: "Hills Farm Blueberry Greek Yogurt", quantity: 2, minQuantity: 10, expirationDate: getOffsetDate(6) },
    { id: 303, name: "Wisconsin Shredded Cheddar 5lb Bag", quantity: 4, minQuantity: 20, expirationDate: getOffsetDate(20) },
    { id: 310, name: "Midwest Shredded Pepper Jack 5lb", quantity: 6, minQuantity: 12, expirationDate: getOffsetDate(4) },
    { id: 501, name: "Valley Grade A Sour Cream 5lb Tub", quantity: 7, minQuantity: 15, expirationDate: getOffsetDate(5) },
    { id: 504, name: "Midwest French Onion Dip 16oz", quantity: 3, minQuantity: 20, expirationDate: getOffsetDate(2) },

    // --- HEALTHY STOCK ---
    { id: 104, name: "Valley 2% Reduced Fat Milk 1/2 Gal", quantity: 35, minQuantity: 25, expirationDate: getOffsetDate(14) },
    { id: 106, name: "Valley Skim Fat Free Milk 1 Gal", quantity: 25, minQuantity: 20, expirationDate: getOffsetDate(18) },
    { id: 107, name: "Prairie Organic Whole Milk 1/2 Gal", quantity: 30, minQuantity: 15, expirationDate: getOffsetDate(16) },
    { id: 108, name: "Prairie Organic 2% Milk 1/2 Gal", quantity: 22, minQuantity: 15, expirationDate: getOffsetDate(22) },
    { id: 109, name: "Midwest Dairy Chocolate Milk Quart", quantity: 40, minQuantity: 20, expirationDate: getOffsetDate(25) },
    { id: 111, name: "Great Lakes Lactose-Free Whole Milk", quantity: 18, minQuantity: 12, expirationDate: getOffsetDate(30) },
    { id: 114, name: "Valley Heavy Cream 40% Pint", quantity: 28, minQuantity: 20, expirationDate: getOffsetDate(25) },
    { id: 116, name: "Valley Half & Half Quart", quantity: 50, minQuantity: 40, expirationDate: getOffsetDate(20) },
    { id: 118, name: "Prairie Organic Half & Half Pint", quantity: 19, minQuantity: 15, expirationDate: getOffsetDate(28) },
    { id: 120, name: "Midwest Cultured Buttermilk 1/2 Gal", quantity: 16, minQuantity: 10, expirationDate: getOffsetDate(35) },
    { id: 202, name: "Hills Farm Vanilla Greek Yogurt 32oz", quantity: 24, minQuantity: 20, expirationDate: getOffsetDate(30) },
    { id: 301, name: "Wisconsin Sharp Cheddar Block 10lb", quantity: 14, minQuantity: 10, expirationDate: getOffsetDate(60) },
    { id: 401, name: "Midwest Farm Salted Butter Foil 1lb", quantity: 85, minQuantity: 50, expirationDate: getOffsetDate(90) },
    { id: 605, name: "Valley Sweetened Condensed Milk", quantity: 100, minQuantity: 30, expirationDate: getOffsetDate(180) }
  ];
}

let savedInventory = JSON.parse(localStorage.getItem('freshstock_inventory'));
let rawInventory = (savedInventory && savedInventory.length > 0) ? savedInventory : getInitialDataset();
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
    let expDate;
    if (item.expirationDate && typeof item.expirationDate === 'string' && item.expirationDate.includes('-')) {
      const [year, month, day] = item.expirationDate.split('-').map(Number);
      expDate = new Date(year, month - 1, day);
    } else {
      expDate = new Date(item.expirationDate);
    }
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
// 3. Render Metric Stats Bar
// ----------------------------------------------------
function renderMetrics(processedItems) {
  const metricsContainer = document.getElementById('metrics-bar');
  if (!metricsContainer) return;

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
  currentFilter = currentFilter === filterType ? 'all' : filterType;
  renderDashboard();
}

// ----------------------------------------------------
// 4. Dashboard Render Engine
// ----------------------------------------------------
function renderDashboard() {
  const dashboardContainer = document.getElementById('dashboard');
  if (!dashboardContainer) return;

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

  if (criticalItems.length > 0) dashboardContainer.appendChild(createSection('Critical Action Needed', 'critical', criticalItems));
  if (warningItems.length > 0) dashboardContainer.appendChild(createSection('Attention Needed', 'warning', warningItems));
  if (healthyItems.length > 0) dashboardContainer.appendChild(createSection('Healthy Inventory', 'healthy', healthyItems));
}

function createSection(titleText, categoryClass, itemsList) {
  const section = document.createElement('div');
  section.className = 'section';

  const title = document.createElement('h2');
  title.className = `section-title ${categoryClass}`;
  title.innerText = titleText;

  const cardList = document.createElement('div');
  cardList.className = 'card-list';

  itemsList.forEach(item => cardList.appendChild(createCardElement(item)));

  section.appendChild(title);
  section.appendChild(cardList);
  return section;
}

function createCardElement(item) {
  let expiryText = '';
  if (item.daysLeft < 0) expiryText = `Expired ${Math.abs(item.daysLeft)} days ago`;
  else if (item.daysLeft === 0) expiryText = 'Expires today!';
  else if (item.daysLeft === 1) expiryText = 'Expires tomorrow';
  else expiryText = `Expires in ${item.daysLeft} days`;

  const statusMap = {
    'EXPIRED': 'Action Required',
    'BOTH': 'Action Required',
    'EXPIRING_SOON': 'Expiring Soon',
    'LOW_STOCK': 'Low Stock'
  };

  const isCriticalClass = item.tier === 1 ? 'card-critical' : '';
  const badgeText = item.status ? statusMap[item.status] : 'Healthy';
  const badgeClass = item.status ? `badge-${item.status}` : 'badge-HEALTHY';

  const actionBtnHtml = item.tier !== null 
    ? `<button class="action-btn" onclick="handleQuickAction(${item.id})">Resolve</button>` 
    : '';

  const displayQty = typeof item.quantity === 'number' ? Number(item.quantity.toFixed(2)) : item.quantity;
  const displayMinQty = typeof item.minQuantity === 'number' ? Number(item.minQuantity.toFixed(2)) : item.minQuantity;

  const card = document.createElement('div');
  card.className = `card ${isCriticalClass}`;
  card.innerHTML = `
    <div class="card-info">
      <div class="card-header">
        <span class="item-name">${item.name}</span>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
      <div class="meta-text">
        <span>${expiryText}</span> • Stock: <span>${displayQty}</span> (Min: ${displayMinQty})
      </div>
    </div>
    ${actionBtnHtml}
  `;

  return card;
}

// ----------------------------------------------------
// 5. Single Item Add & Resolve Handlers
// ----------------------------------------------------
function handleQuickAction(itemId) {
  rawInventory = rawInventory.filter(item => item.id !== itemId);
  saveToLocalStorage();
  renderDashboard();
}

const addItemForm = document.getElementById('add-item-form');
if (addItemForm) {
  addItemForm.addEventListener('submit', function(e) {
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
}

// ----------------------------------------------------
// 6. CSV Upload, Parsing & Removal Engine
// ----------------------------------------------------
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('csv-file-input');
const removeBtn = document.getElementById('remove-file-btn');
const fileInfo = document.getElementById('file-info');
const fileNameSpan = document.getElementById('uploaded-file-name');
const dropZoneText = document.getElementById('drop-zone-text');

if (dropZone && fileInput) {
  dropZone.addEventListener('click', (e) => {
    if (e.target.id === 'remove-file-btn') return;
    fileInput.click();
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) handleCSVFile(files[0]);
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleCSVFile(e.target.files[0]);
  });
}

function handleCSVFile(file) {
  if (!file.name.endsWith('.csv')) {
    alert('Please upload a valid .csv file.');
    return;
  }

  if (fileNameSpan && fileInfo && dropZoneText) {
    fileNameSpan.innerText = file.name;
    fileInfo.style.display = 'flex';
    dropZoneText.style.display = 'none';
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    parseAndImportCSV(e.target.result);
  };
  reader.readAsText(file);
}

// Remove File Handler
if (removeBtn) {
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (fileInput) fileInput.value = '';

    if (fileInfo && dropZoneText) {
      fileInfo.style.display = 'none';
      dropZoneText.style.display = 'block';
    }

    rawInventory = getInitialDataset();
    saveToLocalStorage();
    renderDashboard();

    alert('Uploaded CSV removed. Restored default inventory!');
  });
}

function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseAndImportCSV(csvText) {
  const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length < 2) {
    alert('CSV file appears to be empty or missing headers.');
    return;
  }

  const headers = splitCSVLine(lines[0]).map(h => h.replace(/["']/g, '').trim().toLowerCase());

  const nameIdx = headers.findIndex(h => h.includes('product name') || h === 'product name' || h === 'name');
  const brandIdx = headers.findIndex(h => h.includes('brand') || h === 'brand');
  const expIdx = headers.findIndex(h => h.includes('expiration date') || h === 'expiration date' || h === 'expirationdate');
  const qtyIdx = headers.findIndex(h => h.includes('quantity in stock') || h === 'quantity in stock' || h === 'quantity');
  const minIdx = headers.findIndex(h => h.includes('minimum stock threshold') || h === 'minimum stock threshold' || h === 'minquantity');

  if (nameIdx === -1 || expIdx === -1 || qtyIdx === -1 || minIdx === -1) {
    alert('Missing required headers. CSV must contain:\n- Product Name\n- Expiration Date\n- Quantity in Stock\n- Minimum Stock Threshold');
    return;
  }

  const productMap = new Map();

  for (let i = 1; i < lines.length; i++) {
    const row = splitCSVLine(lines[i]).map(cell => cell.replace(/["']/g, '').trim());
    if (row.length <= Math.max(nameIdx, expIdx, qtyIdx, minIdx)) continue;

    let baseName = row[nameIdx];
    const brand = brandIdx !== -1 ? row[brandIdx] : '';

    let fullProductName = baseName;
    if (brand && !baseName.toLowerCase().includes(brand.toLowerCase())) {
      fullProductName = `${brand} ${baseName}`;
    }

    const quantity = Number(row[qtyIdx]);
    const minQuantity = Number(row[minIdx]);
    const expDateStr = row[expIdx];

    if (fullProductName && expDateStr && !isNaN(quantity) && !isNaN(minQuantity)) {
      if (productMap.has(fullProductName)) {
        const existing = productMap.get(fullProductName);
        existing.quantity = Math.round((existing.quantity + quantity) * 100) / 100;
        existing.minQuantity = Math.max(existing.minQuantity, minQuantity);

        if (new Date(expDateStr) < new Date(existing.expirationDate)) {
          existing.expirationDate = expDateStr;
        }
      } else {
        productMap.set(fullProductName, {
          id: Date.now() + i,
          name: fullProductName,
          quantity: Math.round(quantity * 100) / 100,
          minQuantity: Math.round(minQuantity * 100) / 100,
          expirationDate: expDateStr
        });
      }
    }
  }

  const newItems = Array.from(productMap.values());

  if (newItems.length === 0) {
    alert('No valid inventory rows found in the CSV.');
    return;
  }

  rawInventory = newItems;
  saveToLocalStorage();
  renderDashboard();

  alert(`Successfully loaded ${newItems.length} unique products into FreshStock!`);
}

// Initial Execution
renderDashboard();