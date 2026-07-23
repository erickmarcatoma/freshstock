/* ----------------------------------------------------
   1. Design Tokens & Global CSS Variables
   ---------------------------------------------------- */
:root {
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  
  /* Color System */
  --bg-main: #f4f6f9;
  --surface-card: #ffffff;
  --text-primary: #1a202c;
  --text-muted: #718096;
  --border-subtle: #e2e8f0;
  
  /* Status Colors */
  --critical-color: #e53e3e;
  --critical-bg: #fff5f5;
  --critical-border: #feb2b2;
  
  --warning-color: #dd6b20;
  --warning-bg: #fffaf0;
  --warning-border: #fbd38d;
  
  --healthy-color: #38a169;
  --healthy-bg: #f0fff4;
  --healthy-border: #9ae6b4;

  --accent-blue: #3182ce;
  --accent-blue-hover: #2b6cb0;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  background-color: var(--bg-main);
  color: var(--text-primary);
  line-height: 1.5;
  padding: 2rem 1rem;
}

/* ----------------------------------------------------
   2. Layout Container
   ---------------------------------------------------- */
.app-container {
  max-width: 800px;
  margin: 0 auto;
}

.app-header {
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

.app-header p {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* ----------------------------------------------------
   3. Clickable Summary Metrics Bar
   ---------------------------------------------------- */
.metrics-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
  user-select: none;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
}

.metric-card.active {
  box-shadow: 0 0 0 2px var(--accent-blue);
  background-color: #ffffff;
}

.metric-card.critical { border-left: 5px solid var(--critical-color); }
.metric-card.warning  { border-left: 5px solid var(--warning-color); }
.metric-card.healthy  { border-left: 5px solid var(--healthy-color); }

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  display: block;
  line-height: 1.2;
}

.metric-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

/* ----------------------------------------------------
   4. Add Item Form
   ---------------------------------------------------- */
.form-section {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid var(--border-subtle);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  margin-bottom: 2rem;
}

.form-section h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.item-form {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr auto;
  gap: 0.75rem;
}

.item-form input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  background-color: #f8fafc;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.item-form input:focus {
  outline: none;
  border-color: var(--accent-blue);
  background-color: #ffffff;
}

.add-btn {
  background: var(--accent-blue);
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
  white-space: nowrap;
}

.add-btn:hover {
  background: var(--accent-blue-hover);
}

/* ----------------------------------------------------
   5. Dashboard & Card Styling
   ---------------------------------------------------- */
.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title.critical { color: var(--critical-color); }
.section-title.warning  { color: var(--warning-color); }
.section-title.healthy  { color: var(--healthy-color); }

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card {
  background: var(--surface-card);
  border-radius: 12px;
  border: 1px solid var(--border-subtle);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.card-critical {
  background: var(--critical-bg);
  border-color: var(--critical-border);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.item-name {
  font-weight: 700;
  font-size: 1.05rem;
}

.meta-text {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Status Badges */
.badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-EXPIRED, .badge-BOTH {
  background-color: #fed7d7;
  color: #9b2c2c;
}

.badge-EXPIRING_SOON {
  background-color: #feebc8;
  color: #9c4221;
}

.badge-LOW_STOCK {
  background-color: #feebc8;
  color: #9c4221;
}

.badge-HEALTHY {
  background-color: #c6f6d5;
  color: #22543d;
}

/* Resolve Action Button */
.action-btn {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--surface-card);
  border-radius: 12px;
  border: 2px dashed var(--border-subtle);
}

.empty-state h3 {
  font-size: 1.15rem;
  color: var(--healthy-color);
  margin-bottom: 0.25rem;
}

.empty-state p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Responsive Grid for Form on Mobile */
@media (max-width: 640px) {
  .item-form {
    grid-template-columns: 1fr;
  }
  
  .metrics-bar {
    grid-template-columns: 1fr;
  }
}
