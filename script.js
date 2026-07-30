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
// 1. Dynamic Default Inventory Dataset (For Demo Mode)
// ----------------------------------------------------
function getInitialDataset() {
  return [
    // --- TIER 1: CRITICAL ALERTS ---
    { id: 101, name: "Valley Whole Milk 1 Gal", quantity: 8, minQuantity: 45, dailySales: 5, expirationDate: getOffsetDate(-2) },
    { id: 103, name: "Valley 2% Reduced Fat Milk 1 Gal", quantity: 5, minQuantity: 50, dailySales: 6, expirationDate: getOffsetDate(-1) },
    { id: 113, name: "Valley Heavy Cream 40% Quart", quantity: 12, minQuantity: 30, dailySales: 4, expirationDate: getOffsetDate(0) },
    { id: 208, name: "Northwood Peach Yogurt 6oz (12pk)", quantity: 4, minQuantity: 10, dailySales: 2, expirationDate: getOffsetDate(-3) },
    { id: 307, name: "Great Lakes Shredded Mozzarella 5lb", quantity: 2, minQuantity: 18, dailySales: 3, expirationDate: getOffsetDate(1) },
    { id: 604, name: "Midwest Eggnog 1/2 Gal", quantity: 1, minQuantity: 5, dailySales: 1, expirationDate: getOffsetDate(-5) },

    // --- TIER 2 & 3: WARNINGS ---
    { id: 102, name: "Valley Whole Milk 1/2 Gal", quantity: 60, minQuantity: 30, dailySales: 8, expirationDate: getOffsetDate(3) },
    { id: 105, name: "Valley 1% Lowfat Milk 1 Gal", quantity: 10, minQuantity: 35, dailySales: 4, expirationDate: getOffsetDate(12) },
    { id: 115, name: "Chef's Select Cream 5 Gal Bag", quantity: 3, minQuantity: 8, dailySales: 1.5, expirationDate: getOffsetDate(5) },
    { id: 117, name: "Valley Half & Half Pint", quantity: 8, minQuantity: 25, dailySales: 3, expirationDate: getOffsetDate(15) },
    { id: 201, name: "Hills Farm Plain Greek Yogurt 32oz", quantity: 6, minQuantity: 20, dailySales: 2.5, expirationDate: getOffsetDate(4) },
    { id: 204, name: "Hills Farm Blueberry Greek Yogurt", quantity: 2, minQuantity: 10, dailySales: 1, expirationDate: getOffsetDate(6) },
    { id: 303, name: "Wisconsin Shredded Cheddar 5lb Bag", quantity: 4, minQuantity: 20, dailySales: 2, expirationDate: getOffsetDate(20) },
    { id: 310, name: "Midwest Shredded Pepper Jack 5lb", quantity: 6, minQuantity: 12, dailySales: 2, expirationDate: getOffsetDate(4) },
    { id: 501, name: "Valley Grade A Sour Cream 5lb Tub", quantity: 7, minQuantity: 15, dailySales: 3, expirationDate: getOffsetDate(5) },
    { id: 504, name: "Midwest French Onion Dip 16oz", quantity: 3, minQuantity: 20, dailySales: 1.5, expirationDate: getOffsetDate(2) },

    // --- HEALTHY STOCK ---
    { id: 104, name: "Valley 2% Reduced Fat Milk 1/2 Gal", quantity: 35, minQuantity: 25, dailySales: 4, expirationDate: getOffsetDate(14) },
    { id: 106, name: "Valley Skim Fat Free Milk 1 Gal", quantity: 25, minQuantity: 20, dailySales: 3, expirationDate: getOffsetDate(18) },
    { id: 107, name: "Prairie Organic Whole Milk 1/2 Gal", quantity: 30, minQuantity: 15, dailySales: 3.5, expirationDate: getOffsetDate(16) },
    { id: 108, name: "Prairie Organic 2% Milk 1/2 Gal", quantity: 22, minQuantity: 15, dailySales: 2, expirationDate: getOffsetDate(22) },
    { id: 109, name: "Midwest Dairy Chocolate Milk Quart", quantity: 40, minQuantity: 20, dailySales: 5, expirationDate: getOffsetDate(25) },
    { id: 111, name: "Great Lakes Lactose-Free Whole Milk", quantity: 18, minQuantity: 12, dailySales: 2, expirationDate: getOffsetDate(30) },
    { id: 114, name: "Valley Heavy Cream 40% Pint", quantity: 28, minQuantity: 20, dailySales: 3, expirationDate: getOffsetDate(25) },
    { id: 116, name: "Valley Half & Half Quart", quantity: 50, minQuantity: 40, dailySales: 6, expirationDate: getOffsetDate(20) },
    { id: 118, name: "Prairie Organic Half & Half Pint", quantity: 19, minQuantity: 15, dailySales: 2, expirationDate: getOffsetDate(28) },
    { id: 120, name: "Midwest Cultured Buttermilk 1/2 Gal", quantity: 16, minQuantity: 10, dailySales: 1.5, expirationDate: getOffsetDate(35) },
    { id: 202, name: "Hills Farm Vanilla Greek Yogurt 32oz", quantity: 24, minQuantity: 20, dailySales: 2, expirationDate: getOffsetDate(30) },
    { id: 301, name: "Wisconsin Sharp Cheddar Block 10lb", quantity: 14, minQuantity: 10, dailySales: 1, expirationDate: getOffsetDate(60) },
    { id: 401, name: "Midwest Farm Salted Butter Foil 1lb", quantity: 85, minQuantity: 50, dailySales: 5, expirationDate: getOffsetDate(90) },
    { id: 605, name: "Valley Sweetened Condensed Milk", quantity: 100, minQuantity: 30, dailySales: 4, expirationDate: getOffsetDate(180) }
  ];
}

// State initialization
let rawInventory = [];
let currentFilter = 'all';

function saveToLocalStorage() {
  localStorage.setItem('freshstock_inventory', JSON.stringify(rawInventory));
}

// Strict session handling: Demo vs Blank entry point
function checkDemoMode() {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.get('demo') === 'true') {
    // User clicked "Try Demo Data" -> Populate demo items
    rawInventory = getInitialDataset();
    saveToLocalStorage();
    window.history.replaceState({}, document.title, window.location.pathname);
  } else {
    // User clicked "Open Dashboard" -> Force wipe data to ensure clean slate (0s)
    localStorage.removeItem('freshstock_inventory');
    rawInventory = [];
  }
}

function clearAllData() {
  localStorage.removeItem('freshstock_inventory');
  rawInventory = [];
  renderDashboard();
  alert('Dashboard wiped! All counts reset to 0.');
}

// ----------------------------------------------------
// 2. Core Priority Engine & Run-Out Forecast (DOI) Logic
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

    const qty = Number(item.quantity) || 0;
    let dailyRate = Number(item.dailySales);

    if (!dailyRate || dailyRate <= 0) {
      dailyRate = item.minQuantity ? Math.max(1, Math.round(item.minQuantity / 5)) : 2;
    }

    const doiDays = dailyRate > 0 ? Math.floor(qty / dailyRate) : 999;
    
    const runOutDateObj = new Date(today);
    runOutDateObj.setDate(runOutDateObj.getDate() + doiDays);
    const runOutDateStr = `${runOutDateObj.getMonth() + 1}/${runOutDateObj.getDate()}/${runOutDateObj.getFullYear()}`;

    let doiStatus = 'SAFE';
    if (doiDays <= 3) {
      doiStatus = 'CRITICAL';
    } else if (doiDays <= 7) {
      doiStatus = 'WARNING';
    }

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

    return { 
      ...item, 
      daysLeft, 
      status, 
      tier, 
      dailySales: dailyRate, 
      doiDays, 
      doiStatus, 
      runOutDateStr 
    };
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
  const runOutCount = processedItems.filter(i => i.doiStatus === 'CRITICAL' || i.doiStatus === 'WARNING').length;

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
    <div class="metric-card runout ${currentFilter === 'runout' ? 'active' : ''}" onclick="setFilter('runout')">
      <span class="metric-value">${runOutCount}</span>
      <span class="metric-label">Run-Out Risk</span>
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

  // Empty state handling when no inventory is loaded
  if (allProcessed.length === 0) {
    dashboardContainer.innerHTML = `
      <div class="empty-state">
        <h3>No Inventory Loaded</h3>
        <p>Upload a CSV file or click "Try Demo Data" on the home page to get started.</p>
      </div>
    `;
    return;
  }

  let itemsToDisplay = [];

  if (currentFilter === 'critical') {
    itemsToDisplay = allProcessed.filter(i => i.tier === 1);
  } else if (currentFilter === 'warning') {
    itemsToDisplay = allProcessed.filter(i => i.tier === 2 || i.tier === 3);
  } else if (currentFilter === 'healthy') {
    itemsToDisplay = allProcessed.filter(i => i.tier === null);
  } else if (currentFilter === 'runout') {
    itemsToDisplay = allProcessed.filter(i => i.doiStatus === 'CRITICAL' || i.doiStatus === 'WARNING');
  } else {
    itemsToDisplay = allProcessed;
  }

  itemsToDisplay.sort((a, b) => (a.tier || 4) - (b.tier || 4) || a.doiDays - b.doiDays || a.daysLeft - b.daysLeft);

  if (itemsToDisplay.length === 0) {
    dashboardContainer.innerHTML = `
      <div class="empty-state">
        <h3>No Items Found</h3>
        <p>No inventory items match the selected filter.</p>
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

  let doiBadgeText = `${item.doiDays} Days Stock Left`;
  let doiBadgeClass = 'badge-runout-safe';

  if (item.doiStatus === 'CRITICAL') {
    doiBadgeText = `⚠️ Stockout in ${item.doiDays}d (${item.runOutDateStr})`;
    doiBadgeClass = 'badge-runout-critical';
  } else if (item.doiStatus === 'WARNING') {
    doiBadgeText = `⚡ Stockout in ${item.doiDays}d (${item.runOutDateStr})`;
    doiBadgeClass = 'badge-runout-warning';
  }

  const actionBtnHtml = (item.tier !== null || item.doiStatus === 'CRITICAL')
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
        <span class="badge ${doiBadgeClass}">${doiBadgeText}</span>
      </div>
      <div class="meta-text">
        <span>${expiryText}</span> • Stock: <span>${displayQty}</span> (Min: ${displayMinQty}) • Usage: <span>${item.dailySales}/day</span>
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

    const dailyVal = document.getElementById('item-daily').value;

    const newItem = {
      id: Date.now(),
      name: document.getElementById('item-name').value.trim(),
      quantity: Number(document.getElementById('item-qty').value),
      minQuantity: Number(document.getElementById('item-min').value),
      dailySales: dailyVal ? Number(dailyVal) : 0,
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

// Remove File Handler - Clears to Blank State
if (removeBtn) {
  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (fileInput) fileInput.value = '';

    if (fileInfo && dropZoneText) {
      fileInfo.style.display = 'none';
      dropZoneText.style.display = 'block';
    }

    rawInventory = []; // Reset to empty
    saveToLocalStorage();
    renderDashboard();

    alert('Uploaded CSV removed.');
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
  const soldIdx = headers.findIndex(h => h.includes('quantity_sold') || h.includes('sold'));

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
    const soldQty = soldIdx !== -1 ? Number(row[soldIdx]) : 0;
    const dailySales = soldQty > 0 ? Math.round((soldQty / 30) * 10) / 10 : Math.max(1, Math.round(minQuantity / 5));

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
          dailySales: dailySales,
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

  alert(`Successfully loaded ${newItems.length} unique products into FreshStock with Run-Out Forecast calculations!`);
}

// Execution
checkDemoMode();
renderDashboard();