# Ledger — Personal Finance Tracker

## Project TODO

> A complete task breakdown for building a production-quality personal finance dashboard in React + Vite.
> Currency: INR. Design direction: modern private wealth management / editorial aesthetic.

---

## Phase 0 — Project Scaffolding

- [x] Initialize Vite + React project (`npx create-vite`)
- [x] Install core dependencies:
  - `react-router-dom`
  - `recharts`
  - `lucide-react`
  - `date-fns`
- [x] Install & configure Tailwind CSS (v4 or v3 — confirm version)
- [x] Set up folder structure:
  ```
  src/
    components/
      layout/
      dashboard/
      transactions/
      budgets/
      analytics/
      investments/
      ui/
    pages/
    data/
    utils/
    services/
  ```
- [x] Add Google Fonts: **Playfair Display** (or DM Serif Display) + **Inter** (or Geist)
- [x] Create Tailwind theme extension (color tokens, font families, spacing scale)
- [x] Configure path aliases (`@/` → `src/`) in `vite.config.js`
- [x] Write a basic `README.md`
- [x] Verify `npm install && npm run dev` works with a blank page

---

## Phase 1 — Design System & UI Primitives

### 1.1 Color Tokens

- [x] Define light-mode palette:
  - Primary background: warm off-white / ivory
  - Main text: near-black
  - Secondary text: muted gray
  - Accent: warm amber/orange
  - Positive: mint/emerald
  - Negative: muted red
  - Chart palette: teal, gold, deep navy
- [x] Define dark-mode palette (deep charcoal, warm off-white text, muted accent colors)
- [x] Wire up CSS variables or Tailwind `dark:` classes

### 1.2 Typography Scale

- [x] Configure heading font (Playfair Display / DM Serif Display)
- [x] Configure body/UI font (Inter / Geist)
- [x] Define typographic classes:
  - `.display-xl` — hero net-worth number
  - `.heading-lg` — section headings
  - `.heading-sm` — card headings
  - `.label` — uppercase, letter-spaced, small
  - `.body` / `.body-sm` — paragraph text
  - `.mono` — financial figures (tabular nums)

### 1.3 Reusable UI Components

- [x] `Button.jsx` — primary, secondary, ghost, destructive variants; sizes sm/md/lg
- [x] `Modal.jsx` — accessible overlay with trap focus, close on Escape, backdrop click
- [x] `Input.jsx` — text, number, date inputs; labels, error states
- [x] `Select.jsx` — dropdown select with label
- [x] `Badge.jsx` — small status/category pill
- [x] `EmptyState.jsx` — illustration placeholder + message + CTA
- [x] `Tooltip.jsx` — lightweight tooltip (for chart hover, optional)
- [x] `ConfirmDialog.jsx` — "Are you sure?" modal for destructive actions

---

## Phase 2 — Layout & Navigation

### 2.1 Desktop Navigation (`Navbar.jsx`)

- [x] Logo / product name ("Ledger") — left-aligned
- [x] Navigation links: Dashboard, Transactions, Accounts, Analytics, Budgets, Investments, Settings
- [x] Small uppercase nav labels, clean spacing
- [x] Right side: search icon, notification icon, user avatar/menu
- [x] Active link indicator (underline or subtle highlight)
- [x] Sticky header

### 2.2 Mobile Navigation (`MobileNav.jsx`)

- [x] Hamburger menu OR bottom tab bar
- [x] Slide-out drawer with all navigation links
- [x] Proper overlay + close behavior
- [x] Accessible focus management

### 2.3 App Shell

- [x] Create `AppLayout.jsx` wrapper with Navbar + `<Outlet />`
- [x] Set up React Router with all 7 routes:
  - `/` → Dashboard
  - `/transactions` → Transactions
  - `/accounts` → Accounts
  - `/budgets` → Budgets
  - `/analytics` → Analytics
  - `/investments` → Investments
  - `/settings` → Settings
- [x] Max-width container (~1400px), generous padding
- [x] Page transition (optional subtle fade)

---

## Phase 3 — Data Layer

### 3.1 Mock Data (`data/mockData.js`)

- [x] Generate 50–80 realistic transactions spanning 6+ months
  - Indian merchants: Amazon, Swiggy, Zomato, Uber, Blinkit, Netflix, Spotify, Flipkart, Airtel, Jio, Myntra
  - Categories: Food, Transport, Shopping, Bills, Entertainment, Education, Healthcare, Travel, Salary, Investment, Other
  - Realistic INR amounts
  - Mix of income (salary, freelance) and expenses
- [x] Define 5 accounts: HDFC Savings, ICICI Savings, SBI Credit Card, Amazon Pay ICICI, Cash
- [x] Define 5–6 default budget categories with limits
- [x] Define investment holdings: Stocks, Mutual Funds, Gold (with units, avg price, current price)
- [x] Generate 6–12 months of historical net-worth data points

### 3.2 Storage Service (`services/storage.js`)

- [x] Abstract CRUD layer over `localStorage`
  - `getTransactions()`, `saveTransaction()`, `updateTransaction()`, `deleteTransaction()`
  - `getAccounts()`, `saveAccount()`, `updateAccount()`
  - `getBudgets()`, `saveBudget()`, `updateBudget()`, `deleteBudget()`
  - `getInvestments()`, `saveInvestment()`
  - `getSettings()`, `saveSettings()`
- [x] Seed with mock data on first load (check flag `ledger_initialized`)
- [x] `exportAllData()` → returns JSON blob
- [x] `importData(json)` → validates & overwrites
- [x] `clearAllData()` → wipes localStorage keys

### 3.3 Utility Functions

- [x] `formatCurrency.js`
  - `formatINR(amount)` → `₹1,42,500`
  - `formatCompact(amount)` → `₹8.42L`
  - `formatPercent(value)` → `+4.31%`
  - `formatChange(amount)` → `+₹34,820` / `−₹2,499`
- [x] `dateUtils.js`
  - `formatDate(date)` → `Aug 10`
  - `getMonthYear(date)` → `August 2026`
  - `getMonthRange(date)` → start/end of month
  - `getLastNMonths(n)` → array of month labels
  - `isThisMonth(date)` / `isLastMonth(date)`
- [x] `calculations.js`
  - `calcTotalAssets(accounts)`
  - `calcTotalLiabilities(accounts)`
  - `calcNetWorth(accounts)`
  - `calcMonthlyIncome(transactions, month)`
  - `calcMonthlyExpenses(transactions, month)`
  - `calcMonthlySavings(transactions, month)`
  - `calcSavingsRate(income, expenses)`
  - `calcCategoryBreakdown(transactions, month)`
  - `calcBudgetUtilization(budgets, transactions, month)`
  - `calcMonthlyCashFlow(transactions, months)`
  - `calcInvestmentReturn(holdings)`
  - `calcAverageDailySpending(transactions, month)`
  - `calcTopSpendingCategory(transactions, month)`
  - `calcNetWorthHistory(transactions, accounts)` (derived)

---

## Phase 4 — Dashboard Page

### 4.1 Hero / Greeting Section

- [x] Breadcrumb: `OVERVIEW / AUGUST 2026`
- [x] Greeting: `GOOD MORNING, ARITRA`
- [x] Subtitle: `YOUR FINANCIAL OVERVIEW`
- [x] Large net-worth number: `₹8,42,350`
- [x] Label: `NET WORTH`
- [x] Monthly change: `+₹34,820 this month` / `+4.31%` with upward arrow
- [x] All values computed from data, not hardcoded

### 4.2 Financial Metrics Strip (`FinancialMetrics.jsx`)

- [x] Five metric blocks (horizontal row, responsive wrap):
  1. NET WORTH — amount + % change
  2. INCOME — amount + "This month"
  3. EXPENSES — amount + "This month"
  4. SAVINGS — amount + savings rate %
  5. INVESTMENTS — amount + YTD return %
- [x] Clean borderless blocks, thin separators or spacing
- [x] Color-code changes: green positive, red negative

### 4.3 Net Worth Chart (`NetWorth.jsx`)

- [x] Section heading: `NET WORTH` / `Last 6 months`
- [x] Smooth area/line chart (Recharts `AreaChart`)
- [x] Time-range toggles: 1M, 3M, 6M, 1Y, ALL
- [x] Minimal grid lines, elegant tooltip
- [x] Data derived from historical calculations

### 4.4 Cash Flow Chart (`CashFlowChart.jsx`)

- [x] Two-line chart: income vs. expenses over recent months
- [x] Summary cards: INCOME, EXPENSES, NET CASH FLOW
- [x] Subtle contrasting colors (amber for income, slate for expenses)

### 4.5 Spending Breakdown (`SpendingBreakdown.jsx`)

- [x] Donut chart (Recharts `PieChart`) of category spending
- [x] Category list alongside:
  - Color indicator dot
  - Category name
  - Percentage
  - Amount
- [x] Data computed from current-month transactions

### 4.6 Recent Transactions (`RecentTransactions.jsx`)

- [x] List of 5–8 latest transactions
- [x] Each row: merchant, category, date, account, amount
- [x] Green for income, dark/muted-red for expenses
- [x] `VIEW ALL TRANSACTIONS →` link to `/transactions`

### 4.7 Account Overview (`AccountOverview.jsx`)

- [x] Split into ASSETS and LIABILITIES
- [x] Each account: name, type icon, balance, last updated
- [x] Net worth summary at bottom
- [x] Link to `/accounts`

### 4.8 Financial Insights (`FinancialInsights.jsx`)

- [x] Auto-generate 3–5 insights from data:
  - Month-over-month spending comparison by category
  - Savings rate
  - Top spending category share
  - Net-worth change
- [x] Factual, concise, no "financial advice"
- [x] Small insight cards or inline list

### 4.9 Dashboard Layout & Visual Hierarchy

- [x] Net worth → most prominent (top, large)
- [x] Metrics strip → second row
- [x] Net worth chart → large, wide
- [x] Cash flow + spending → side-by-side on desktop, stacked on mobile
- [x] Recent transactions + accounts + insights → lower sections
- [x] Generous whitespace, thin separators, editorial feel

---

## Phase 5 — Transactions Page

### 5.1 Transactions Header

- [x] Page heading: `TRANSACTIONS`
- [x] Subtext: `₹38,240 spent this month` (calculated)
- [x] `+ ADD TRANSACTION` button

### 5.2 Transaction Filters (`TransactionFilters.jsx`)

- [x] Search input (instant filtering by merchant, category, account, notes)
- [x] Date range picker (or month selector)
- [x] Category dropdown filter
- [x] Account dropdown filter
- [x] Type filter: All / Income / Expense / Transfer
- [x] Sort: Date (newest/oldest), Amount (high/low)
- [x] Clear filters button

### 5.3 Transaction Table (`TransactionTable.jsx`)

- [x] Columns: Date, Description, Category, Account, Amount
- [x] Sortable column headers
- [x] Hover states on rows
- [x] Click row → edit transaction
- [x] Delete button per row (with confirmation)
- [x] Pagination (or infinite scroll)
- [x] Responsive: on mobile, rows become stacked cards

### 5.4 Transaction Row (`TransactionRow.jsx`)

- [x] Category badge/dot
- [x] Formatted date
- [x] Formatted amount with +/− and color
- [x] Truncated notes preview

### 5.5 Add/Edit Transaction Modal (`TransactionModal.jsx`)

- [x] Fields:
  - Type toggle: Expense / Income / Transfer
  - Amount (required)
  - Description (required)
  - Category (required, dropdown)
  - Account (required, dropdown)
  - Date (required, date picker)
  - Notes (optional, textarea)
- [x] Validation with error messages
- [x] On save:
  - Persist to localStorage
  - Update account balance
  - Recalculate dashboard metrics
- [x] On edit: pre-fill form, update in place
- [x] Accessible: focus trap, close on Escape

### 5.6 Empty State

- [x] Illustration/icon + message + `ADD TRANSACTION` CTA

---

## Phase 6 — Accounts Page

### 6.1 Accounts Overview

- [x] Page heading: `ACCOUNTS`
- [x] Summary: Total Assets, Total Liabilities, Net Worth

### 6.2 Account Cards

- [x] Group by type: Bank Accounts, Credit Cards, Cash
- [x] Each card: name, type, balance, icon
- [x] Visual separation of assets vs. liabilities
- [x] Click to view account detail / transaction history for that account

### 6.3 Add/Edit Account

- [x] Modal with fields: Name, Type (Savings/Current/Credit Card/Cash/Investment), Opening Balance
- [x] Persist to localStorage

---

## Phase 7 — Budgets Page

### 7.1 Budget Overview

- [x] Month selector: `AUGUST 2026`
- [x] Summary: TOTAL BUDGET, SPENT, REMAINING
- [x] All calculated from budget limits + transaction data

### 7.2 Budget Category Cards (`BudgetCard.jsx`)

- [x] Each card:
  - Category name
  - Progress bar (`BudgetProgress.jsx`)
  - Spent / Limit
  - Percentage used
- [x] Warning state when spent > 80% of limit
- [x] Over-budget state (red) when spent > limit

### 7.3 Create/Edit Budget

- [x] Modal: Category, Monthly Limit
- [x] Delete budget option
- [x] Persist to localStorage

### 7.4 Empty State

- [x] Message + `CREATE BUDGET` CTA

---

## Phase 8 — Analytics Page

### 8.1 Analytics Header

- [x] Page heading: `ANALYTICS`
- [x] Date range filters (month/quarter/year)

### 8.2 Summary Metrics

- [x] Monthly Spending
- [x] Monthly Income
- [x] Savings Rate
- [x] Net Cash Flow
- [x] Average Daily Spending
- [x] Top Spending Category

### 8.3 Charts

- [x] Monthly expenses bar chart (last 6–12 months)
- [x] Monthly income bar chart
- [x] Category spending comparison (grouped bar or stacked)
- [x] Savings rate line chart over time
- [x] Net worth growth line chart
- [x] All charts minimal, consistent styling with dashboard charts

### 8.4 Empty State

- [x] Message prompting user to add transactions for analytics

---

## Phase 9 — Investments Page

### 9.1 Portfolio Summary (`PortfolioSummary.jsx`)

- [x] TOTAL INVESTMENTS value
- [x] TODAY change
- [x] TOTAL RETURN amount
- [x] RETURN %

### 9.2 Allocation Chart

- [x] Donut chart: Stocks, Mutual Funds, Gold (etc.)
- [x] Legend with percentages

### 9.3 Portfolio Value Chart

- [x] Line chart showing portfolio value over time

### 9.4 Holdings Table (`HoldingsTable.jsx`)

- [x] Columns: Asset, Units, Avg Price, Current Price, Invested, Current Value, Return, Return %
- [x] Color-code returns green/red
- [x] Responsive: card layout on mobile

### 9.5 Add/Edit Holding

- [x] Modal: Asset Name, Type, Units, Average Price, Current Price
- [x] Tracking only — no brokerage logic

---

## Phase 10 — Settings Page

### 10.1 Profile Section

- [x] Display name input
- [x] (Optional) avatar placeholder

### 10.2 Preferences

- [x] Currency display (default INR, could add USD/EUR)
- [x] Theme toggle: Light / Dark / System
- [x] Default transaction category

### 10.3 Data Management

- [x] **Export Data** button → downloads JSON file of all transactions, accounts, budgets, investments
- [x] **Import Data** button → file upload, validate JSON, merge or overwrite
- [x] **Clear All Data** button → confirmation modal → wipes localStorage + resets to empty state

### 10.4 About

- [x] App name, version, credits (optional)

---

## Phase 11 — Dark Mode

- [x] Implement theme context/provider
- [x] Toggle in settings + navbar (optional moon/sun icon)
- [x] Persist preference in localStorage
- [x] Respect `prefers-color-scheme` for "System" option
- [x] Dark palette:
  - Background: deep charcoal (`#1a1a1a` / `#0f0f0f`)
  - Text: warm off-white
  - Secondary text: muted gray
  - Accent: amber (same)
  - Positive: muted emerald
  - Cards/surfaces: slightly lighter charcoal
- [x] Verify chart readability in dark mode
- [x] Verify all form elements, modals, tooltips in dark mode

---

## Phase 12 — Global Search

- [x] Search icon in navbar opens search overlay/modal
- [x] Instant search across transactions: merchant, category, account, notes
- [x] Display matching results as a dropdown list
- [x] Click result → navigate to transaction detail or transactions page filtered
- [x] Keyboard shortcut: `Cmd+K` / `Ctrl+K` (optional)
- [x] Empty state: "No results found"

---

## Phase 13 — Responsive Polish

### Mobile (< 768px)

- [x] Navbar collapses to hamburger or bottom nav
- [x] Dashboard metrics stack vertically (2-column or single)
- [x] Charts resize and remain readable
- [x] Transaction table → stacked cards
- [x] Modals become full-screen drawers
- [x] No horizontal overflow anywhere
- [x] Touch-friendly tap targets (min 44px)

### Tablet (768–1024px)

- [x] 2-column grid for dashboard sections
- [x] Compressed spacing
- [x] Navigation remains top bar (possibly condensed)

### Desktop (> 1024px)

- [x] Full spacious layout
- [x] Side-by-side charts
- [x] 12-column grid alignment

---

## Phase 14 — Micro-Interactions & Polish

- [x] Chart entry animations (fade in, draw line)
- [x] Modal open/close transitions (fade + slide)
- [x] Button hover/active states
- [x] Navigation link hover underline
- [x] Row hover highlight in tables
- [x] Number formatting transitions (optional count-up)
- [x] Skeleton loading states (optional)
- [x] Page transitions (subtle fade between routes, optional)
- [x] All transitions via CSS `transition` — no heavy animation libraries

---

## Phase 15 — Accessibility

- [ ] Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<table>`, `<form>`
- [ ] Single `<h1>` per page, proper heading hierarchy
- [ ] All interactive elements keyboard-accessible
- [ ] Visible focus rings (styled to match design)
- [ ] `aria-label` on icon-only buttons
- [ ] `aria-modal`, `aria-labelledby` on modals
- [ ] Form labels associated with inputs
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Screen-reader-friendly chart descriptions (optional `aria-label` or `<desc>`)

---

## Phase 16 — Final QA & Cleanup

- [ ] Verify all routes render meaningful content
- [ ] Verify all buttons/CTAs are functional (no dead buttons)
- [ ] Verify all CRUD operations: add, edit, delete transactions/accounts/budgets/holdings
- [ ] Verify calculations update dynamically on data change
- [ ] Verify localStorage persistence survives page reload
- [ ] Verify export/import/clear-data flows
- [ ] Verify dark mode across all pages
- [ ] Verify responsive layout at 375px, 768px, 1024px, 1440px
- [ ] Remove all `console.log` and TODO comments
- [ ] Clean up unused imports and dead code
- [ ] Run `npm run build` — confirm no errors
- [ ] Final visual review: does it feel like a premium fintech product?

---

## Summary

| Phase | Description                   | Est. Complexity |
|-------|-------------------------------|-----------------|
| 0     | Project scaffolding           | Low             |
| 1     | Design system & UI primitives | Medium          |
| 2     | Layout & navigation           | Medium          |
| 3     | Data layer                    | Medium          |
| 4     | Dashboard page                | High            |
| 5     | Transactions page             | High            |
| 6     | Accounts page                 | Medium          |
| 7     | Budgets page                  | Medium          |
| 8     | Analytics page                | Medium–High     |
| 9     | Investments page              | Medium          |
| 10    | Settings page                 | Medium          |
| 11    | Dark mode                     | Medium          |
| 12    | Global search                 | Low–Medium      |
| 13    | Responsive polish             | Medium          |
| 14    | Micro-interactions            | Low–Medium      |
| 15    | Accessibility                 | Medium          |
| 16    | Final QA & cleanup            | Low–Medium      |
