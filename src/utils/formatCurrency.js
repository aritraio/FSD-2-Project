/**
 * Currency formatting utilities for Ledger (INR)
 */

/**
 * Format a number as standard Indian Rupee (INR) currency.
 * Example: 142500 -> "₹1,42,500"
 *
 * @param {number} amount
 * @param {object} options
 * @returns {string}
 */
export function formatINR(amount, options = {}) {
  const { showSymbol = true, maximumFractionDigits = 0 } = options;

  if (amount === undefined || amount === null || isNaN(amount)) {
    return showSymbol ? '₹0' : '0';
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? '−' : '';
  const symbol = showSymbol ? '₹' : '';

  return `${sign}${symbol}${formatted}`;
}

/**
 * Format large numbers in compact Indian notation (K, L, Cr).
 * Example: 842350 -> "₹8.42L", 12500000 -> "₹1.25Cr", 45000 -> "₹45K"
 *
 * @param {number} amount
 * @returns {string}
 */
export function formatCompact(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '−' : '';

  if (absAmount >= 10000000) {
    // 1 Crore = 10,000,000
    const inCr = (absAmount / 10000000).toFixed(2);
    return `${sign}₹${parseFloat(inCr)}Cr`;
  }

  if (absAmount >= 100000) {
    // 1 Lakh = 100,000
    const inLakh = (absAmount / 100000).toFixed(2);
    return `${sign}₹${parseFloat(inLakh)}L`;
  }

  if (absAmount >= 1000) {
    // 1 Thousand = 1,000
    const inK = (absAmount / 1000).toFixed(1);
    return `${sign}₹${parseFloat(inK)}K`;
  }

  return formatINR(amount);
}

/**
 * Format a number as percentage string with sign.
 * Example: 4.312 -> "+4.31%", -1.2 -> "-1.20%"
 *
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatPercent(value, decimals = 2) {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.00%';
  }

  const num = Number(value);
  const sign = num > 0 ? '+' : num < 0 ? '' : '';
  return `${sign}${num.toFixed(decimals)}%`;
}

/**
 * Format monetary change with explicit prefix sign (+ or -).
 * Example: 34820 -> "+₹34,820", -2499 -> "−₹2,499"
 *
 * @param {number} amount
 * @returns {string}
 */
export function formatChange(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  if (amount === 0) return '₹0';

  const sign = amount > 0 ? '+' : '−';
  const formatted = formatINR(Math.abs(amount));
  return `${sign}${formatted}`;
}
