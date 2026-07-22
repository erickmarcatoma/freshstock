// ----------------------------------------------------
// 1. Raw Inventory Data Sample
// ----------------------------------------------------
const rawInventory = [
  { id: 1, name: 'Whole Milk', quantity: 2, minQuantity: 5, expirationDate: '2026-07-24' },  // Expiring in 2 days + Low Stock (BOTH)
  { id: 2, name: 'Cheddar Cheese', quantity: 12, minQuantity: 4, expirationDate: '2026-07-25' }, // Expiring in 3 days (EXPIRING_SOON)
  { id: 3, name: 'Greek Yogurt', quantity: 1, minQuantity: 6, expirationDate: '2026-08-15' },   // Low Stock (LOW_STOCK)
  { id: 4, name: 'Salted Butter', quantity: 25, minQuantity: 5, expirationDate: '2026-09-01' }   // Healthy (Filtered out)
];

// ----------------------------------------------------
// 2. The Core Expiration & Stock Engine
// ----------------------------------------------------
function runPriorityEngine(items) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time to midnight

  return items
    .map(item => {
      const expDate = new Date(item.expirationDate);
      expDate.setHours(0, 0, 0, 0);

      // Calculate difference in days
      const diffTime = expDate - today;
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const isExpiringSoon = daysLeft <= 7;
      const isLowStock = item.quantity <= item.minQuantity;

      // Assign Status Flag
      let status = null;
      if (isExpiringSoon && isLowStock) {
        status = 'BOTH';
      } else if (isExpiringSoon) {
        status = 'EXPIRING_SOON';
      } else if (isLowStock) {
        status = 'LOW_STOCK';
      }

      return {
        ...item,
        daysLeft,
        status
      };
    })
    // Filter out healthy items (where status is null)
    .filter(item => item.status !== null)
    // Sort by urgency: Soonest expiring first
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

// ----------------------------------------------------
// 3. UI Rendering & Quick Action Handler
// ----------------------------------------------------
function renderAlerts() {
  const listElement = document.getElementById('alert-list');
  const processedItems = runPriorityEngine(rawInventory);

  listElement.innerHTML = ''; // Clear container

  processedItems.forEach(item => {
    // Format expiration message
    let expiryText = '';
    if (item.daysLeft < 0) {
      expiryText = 'Expired!';
    } else if (item.daysLeft === 0) {
      expiryText = 'Expires today!';
    } else if (item.daysLeft === 1) {
      expiryText = 'Expires tomorrow';
    } else {
      expiryText = `Expires in ${item.daysLeft} days`;
    }

    // Badge label mappings
    const statusMap = {
      'BOTH': 'Action Required',
      'EXPIRING_SOON': 'Expiring Soon',
      'LOW_STOCK': 'Low Stock'
    };

    // Create card element
    const card = document.createElement('div');
    card.className = 'card';
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

    listElement.appendChild(card);
  });
}

function handleQuickAction(itemId) {
  alert(`Resolve triggered for item ID: ${itemId}`);
}

// Initialize display on load
renderAlerts();