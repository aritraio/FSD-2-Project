import {
  INITIAL_ACCOUNTS,
  INITIAL_BUDGETS,
  INITIAL_INVESTMENTS,
  INITIAL_NETWORTH_HISTORY,
  INITIAL_SETTINGS,
  INITIAL_TRANSACTIONS,
} from '../data/mockData.js';

const KEYS = {
  INITIALIZED: 'ledger_initialized',
  TRANSACTIONS: 'ledger_transactions',
  ACCOUNTS: 'ledger_accounts',
  BUDGETS: 'ledger_budgets',
  INVESTMENTS: 'ledger_investments',
  SETTINGS: 'ledger_settings',
  NETWORTH_HISTORY: 'ledger_networth_history',
};

/**
 * Safely parse JSON from localStorage with fallback
 */
function getItem(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

/**
 * Safely stringify and write to localStorage
 */
function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

/**
 * Initialize storage with default mock data if not initialized yet.
 */
export function initStorage() {
  try {
    const isInitialized = localStorage.getItem(KEYS.INITIALIZED);
    if (!isInitialized) {
      setItem(KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
      setItem(KEYS.BUDGETS, INITIAL_BUDGETS);
      setItem(KEYS.INVESTMENTS, INITIAL_INVESTMENTS);
      setItem(KEYS.NETWORTH_HISTORY, INITIAL_NETWORTH_HISTORY);
      setItem(KEYS.SETTINGS, INITIAL_SETTINGS);
      setItem(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
      localStorage.setItem(KEYS.INITIALIZED, 'true');
    }
  } catch (err) {
    console.error('Storage initialization failed:', err);
  }
}

// Ensure init is run when module is imported
initStorage();

// ==========================================
// TRANSACTIONS
// ==========================================

export function getTransactions() {
  return getItem(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
}

export function saveTransaction(transaction) {
  const transactions = getTransactions();
  const newTx = {
    ...transaction,
    id: transaction.id || `tx-${Date.now()}`,
    amount: Number(transaction.amount) || 0,
    date: transaction.date || new Date().toISOString().split('T')[0],
  };

  const updated = [newTx, ...transactions];
  setItem(KEYS.TRANSACTIONS, updated);

  // Update account balance if accountId matches
  if (newTx.accountId) {
    updateAccountBalanceForTx(newTx, 'add');
  }

  return newTx;
}

export function updateTransaction(updatedTx) {
  const transactions = getTransactions();
  const existingIndex = transactions.findIndex((t) => t.id === updatedTx.id);

  if (existingIndex === -1) {
    return saveTransaction(updatedTx);
  }

  const oldTx = transactions[existingIndex];

  // Revert old transaction effect on account
  if (oldTx.accountId) {
    updateAccountBalanceForTx(oldTx, 'revert');
  }

  // Apply updated transaction effect on account
  if (updatedTx.accountId) {
    updateAccountBalanceForTx(updatedTx, 'add');
  }

  transactions[existingIndex] = {
    ...oldTx,
    ...updatedTx,
    amount: Number(updatedTx.amount) || 0,
  };

  setItem(KEYS.TRANSACTIONS, transactions);
  return transactions[existingIndex];
}

export function deleteTransaction(id) {
  const transactions = getTransactions();
  const txToDelete = transactions.find((t) => t.id === id);

  if (txToDelete && txToDelete.accountId) {
    updateAccountBalanceForTx(txToDelete, 'revert');
  }

  const updated = transactions.filter((t) => t.id !== id);
  setItem(KEYS.TRANSACTIONS, updated);
  return true;
}

// Helper to adjust account balance when adding or deleting transactions
function updateAccountBalanceForTx(tx, mode = 'add') {
  const accounts = getAccounts();
  const accIndex = accounts.findIndex((a) => a.id === tx.accountId);
  if (accIndex === -1) return;

  const acc = accounts[accIndex];
  const amount = Number(tx.amount) || 0;
  let delta = 0;

  if (tx.type === 'expense') {
    delta = acc.type === 'credit' ? amount : -amount;
  } else if (tx.type === 'income') {
    delta = acc.type === 'credit' ? -amount : amount;
  }

  if (mode === 'revert') {
    delta = -delta;
  }

  accounts[accIndex] = {
    ...acc,
    balance: Math.max(0, Number(acc.balance || 0) + delta),
  };

  setItem(KEYS.ACCOUNTS, accounts);
}

// ==========================================
// ACCOUNTS
// ==========================================

export function getAccounts() {
  return getItem(KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
}

export function saveAccount(account) {
  const accounts = getAccounts();
  const newAcc = {
    ...account,
    id: account.id || `acc-${Date.now()}`,
    balance: Number(account.balance) || 0,
  };

  const updated = [...accounts, newAcc];
  setItem(KEYS.ACCOUNTS, updated);
  return newAcc;
}

export function updateAccount(updatedAccount) {
  const accounts = getAccounts();
  const index = accounts.findIndex((a) => a.id === updatedAccount.id);

  if (index === -1) return saveAccount(updatedAccount);

  accounts[index] = {
    ...accounts[index],
    ...updatedAccount,
    balance: Number(updatedAccount.balance) || 0,
  };

  setItem(KEYS.ACCOUNTS, accounts);
  return accounts[index];
}

export function deleteAccount(id) {
  const accounts = getAccounts();
  const updated = accounts.filter((a) => a.id !== id);
  setItem(KEYS.ACCOUNTS, updated);
  return true;
}

// ==========================================
// BUDGETS
// ==========================================

export function getBudgets() {
  return getItem(KEYS.BUDGETS, INITIAL_BUDGETS);
}

export function saveBudget(budget) {
  const budgets = getBudgets();
  const newBudget = {
    ...budget,
    id: budget.id || `bud-${Date.now()}`,
    limit: Number(budget.limit) || 0,
  };

  const updated = [...budgets, newBudget];
  setItem(KEYS.BUDGETS, updated);
  return newBudget;
}

export function updateBudget(updatedBudget) {
  const budgets = getBudgets();
  const index = budgets.findIndex((b) => b.id === updatedBudget.id);

  if (index === -1) return saveBudget(updatedBudget);

  budgets[index] = {
    ...budgets[index],
    ...updatedBudget,
    limit: Number(updatedBudget.limit) || 0,
  };

  setItem(KEYS.BUDGETS, budgets);
  return budgets[index];
}

export function deleteBudget(id) {
  const budgets = getBudgets();
  const updated = budgets.filter((b) => b.id !== id);
  setItem(KEYS.BUDGETS, updated);
  return true;
}

// ==========================================
// INVESTMENTS
// ==========================================

export function getInvestments() {
  return getItem(KEYS.INVESTMENTS, INITIAL_INVESTMENTS);
}

export function saveInvestment(investment) {
  const investments = getInvestments();
  const units = Number(investment.units) || 0;
  const avgPrice = Number(investment.avgPrice) || 0;
  const currentPrice = Number(investment.currentPrice) || avgPrice;

  const newInv = {
    ...investment,
    id: investment.id || `inv-${Date.now()}`,
    units,
    avgPrice,
    currentPrice,
    investedValue: units * avgPrice,
    currentValue: units * currentPrice,
  };

  const updated = [...investments, newInv];
  setItem(KEYS.INVESTMENTS, updated);
  return newInv;
}

export function updateInvestment(updatedInvestment) {
  const investments = getInvestments();
  const index = investments.findIndex((i) => i.id === updatedInvestment.id);

  if (index === -1) return saveInvestment(updatedInvestment);

  const units = Number(updatedInvestment.units) || 0;
  const avgPrice = Number(updatedInvestment.avgPrice) || 0;
  const currentPrice = Number(updatedInvestment.currentPrice) || avgPrice;

  investments[index] = {
    ...investments[index],
    ...updatedInvestment,
    units,
    avgPrice,
    currentPrice,
    investedValue: units * avgPrice,
    currentValue: units * currentPrice,
  };

  setItem(KEYS.INVESTMENTS, investments);
  return investments[index];
}

export function deleteInvestment(id) {
  const investments = getInvestments();
  const updated = investments.filter((i) => i.id !== id);
  setItem(KEYS.INVESTMENTS, updated);
  return true;
}

// ==========================================
// SETTINGS
// ==========================================

export function getSettings() {
  return getItem(KEYS.SETTINGS, INITIAL_SETTINGS);
}

export function saveSettings(newSettings) {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  setItem(KEYS.SETTINGS, updated);
  return updated;
}

// ==========================================
// NET WORTH HISTORY
// ==========================================

export function getNetWorthHistory() {
  return getItem(KEYS.NETWORTH_HISTORY, INITIAL_NETWORTH_HISTORY);
}

export function saveNetWorthHistory(historyArray) {
  setItem(KEYS.NETWORTH_HISTORY, historyArray);
  return historyArray;
}

// ==========================================
// BACKUP / EXPORT / IMPORT / RESET
// ==========================================

export function exportAllData() {
  const backup = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    transactions: getTransactions(),
    accounts: getAccounts(),
    budgets: getBudgets(),
    investments: getInvestments(),
    settings: getSettings(),
    netWorthHistory: getNetWorthHistory(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importData(jsonString) {
  try {
    const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON data format');
    }

    if (Array.isArray(data.transactions)) setItem(KEYS.TRANSACTIONS, data.transactions);
    if (Array.isArray(data.accounts)) setItem(KEYS.ACCOUNTS, data.accounts);
    if (Array.isArray(data.budgets)) setItem(KEYS.BUDGETS, data.budgets);
    if (Array.isArray(data.investments)) setItem(KEYS.INVESTMENTS, data.investments);
    if (Array.isArray(data.netWorthHistory)) setItem(KEYS.NETWORTH_HISTORY, data.netWorthHistory);
    if (data.settings && typeof data.settings === 'object') setItem(KEYS.SETTINGS, data.settings);

    return true;
  } catch (err) {
    console.error('Failed to import data:', err);
    throw err;
  }
}

export function clearAllData() {
  try {
    localStorage.removeItem(KEYS.TRANSACTIONS);
    localStorage.removeItem(KEYS.ACCOUNTS);
    localStorage.removeItem(KEYS.BUDGETS);
    localStorage.removeItem(KEYS.INVESTMENTS);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.NETWORTH_HISTORY);
    localStorage.removeItem(KEYS.INITIALIZED);

    // Re-initialize defaults
    initStorage();
    return true;
  } catch (err) {
    console.error('Failed to clear data:', err);
    return false;
  }
}
