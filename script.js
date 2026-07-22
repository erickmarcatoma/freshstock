// ----------------------------------------------------
// 1. Raw Inventory Data Sample
// ----------------------------------------------------
const rawInventory = [
  { id: 1, name: 'Whole Milk', quantity: 2, minQuantity: 5, expirationDate: '2026-07-24' },     // Tier 1: Expiring in 2 days + Low Stock (BOTH)
  { id: 2, name: 'Cheddar Cheese', quantity: 12, minQuantity: 4, expirationDate: '2026-07-25' },    // Tier 2: Expiring in 3 days (EXPIRING_SOON)
  { id: 3, name: 'Greek Yogurt', quantity: 1, minQuantity: 6, expirationDate: '2026-08-15' },      // Tier 3: Low Stock (LOW_STOCK)
  { id: 4, name: 'Heavy Cream', quantity: 10, minQuantity: 5, expirationDate: '2026-07-20' },     // Tier 1: Already Expired (EXPIRED)
  { id: 5, name: 'Salted Butter', quantity: 25, minQuantity: 5, expirationDate: '2026-09-01' }      // Tier 4: Healthy (Filtered Out)
];

// ----------------------------------------------------
// 2. Core Engine & Priority Classifier
// ----------------------------------------------------
function runPriorityEngine(items) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight

  return items
    .map(item => {
      const expDate = new Date(item.expirationDate);
      expDate.setHours(0, 0, 0, 0);

      const diffTime = expDate - today;
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const isExpired = daysLeft <= 0;
      const isExpiringSoon = daysLeft <= 7;
      const isLowStock = item.quantity <= item.minQuantity;

      // Assign Status & Priority Tier
      let status = null;
      let tier = null; // Tier 1 (Critical), Tier 2/3 (Warning)

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
        tier
      };
    })
    // Filter out healthy items
    .filter(item => item.tier !== null)
    // Sort by urgency: Lowest tier first, then closest expiration date
    .sort((a, b) => a.tier - b.tier || a.daysLeft - b.daysLeft);
}

// ----------------------------------------------------
// 3. Priority Dashboard Render Engine
// ----------------------------------------------------
function renderDashboard() {
  const dashboardContainer = document.getElementById('dashboard');
  const items = runPriorityEngine(rawInventory);

  dashboardContainer.innerHTML = '';

  // Empty State: All inventory is healthy
  if (items.length === 0) {
    dashboardContainer.innerHTML = `
      <div class="empty-state">
        <h3>All Stock Healthy</h3>
        <p>No critical items or low stock alerts at this time.</p>
      </div>
    `;
    return;
  }

  // Group items into Tier 1 (Critical) vs Tier 2/3 (Warnings)
  const criticalItems = items.filter(i => i.tier === 1);
  const warningItems = items.filter(i => i.tier > 1);

  // Render Tier 1: Critical Action Needed
  if (criticalItems.length > 0) {
    dashboardContainer.appendChild(
      createSection('Critical Action Needed', 'critical', criticalItems)
    );
  }

  // Render Tier 2 & 3: Upcoming Warnings
  if (warningItems.length > 0) {
    dashboardContainer.appendChild(
      createSection('Attention Needed', 'warning', warningItems)
    );
  }
}

// Helper to create UI sections
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

// Helper to create individual Cards
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

  const card = document.createElement('div');
  card.className = `card ${isCriticalClass}`;
  card.innerHTML = `
    <div class="card-info">
      <div class="card-header">
        <span class="item-name">${item.name}</span>
        <span class="badge badge-${item.status}">${statusMap[item.status]}</span>
      </div>
      <div class="meta-text">
        <span>${expiryText}</span> • Stock: <span>${item.quantity}</span> (Min: ${item.minQuantity})
      </div>
    </div>
    <button class="action-btn" onclick="handleQuickAction(${item.id})">Resolve</button>
  `;

  return card;
}

function handleQuickAction(itemId) {
  const index = rawInventory.findIndex(i => i.id === itemId);
  if (index > -1) rawInventory.splice(index, 1);
  renderDashboard();
}

// Initial Render
renderDashboard();