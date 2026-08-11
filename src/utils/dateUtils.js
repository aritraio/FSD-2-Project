import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
  isSameMonth,
  isThisMonth as isThisMonthFns,
  isValid,
} from 'date-fns';

/**
 * Safely convert string, timestamp, or Date into a valid Date object.
 * @param {string|number|Date} dateInput
 * @returns {Date}
 */
export function toDate(dateInput) {
  if (!dateInput) return new Date();
  if (dateInput instanceof Date) return dateInput;
  if (typeof dateInput === 'string') {
    const parsed = parseISO(dateInput);
    if (isValid(parsed)) return parsed;
    const directDate = new Date(dateInput);
    if (isValid(directDate)) return directDate;
  }
  return new Date(dateInput);
}

/**
 * Format date for UI display.
 * Example: formatDate('2026-08-10') -> "Aug 10, 2026"
 *
 * @param {string|Date} dateInput
 * @param {string} formatPattern
 * @returns {string}
 */
export function formatDate(dateInput, formatPattern = 'MMM d, yyyy') {
  const d = toDate(dateInput);
  return format(d, formatPattern);
}

/**
 * Get Month and Year string.
 * Example: getMonthYear('2026-08-10') -> "August 2026"
 *
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function getMonthYear(dateInput) {
  const d = toDate(dateInput);
  return format(d, 'MMMM yyyy');
}

/**
 * Get start and end date objects for the month of dateInput.
 *
 * @param {string|Date} dateInput
 * @returns {{ start: Date, end: Date }}
 */
export function getMonthRange(dateInput) {
  const d = toDate(dateInput);
  return {
    start: startOfMonth(d),
    end: endOfMonth(d),
  };
}

/**
 * Get array of last N months objects (useful for chart X-axis and period filters).
 *
 * @param {number} n
 * @param {string|Date} referenceDate
 * @returns {Array<{ date: Date, monthKey: string, label: string, shortLabel: string }>}
 */
export function getLastNMonths(n = 6, referenceDate = new Date()) {
  const ref = toDate(referenceDate);
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = subMonths(ref, i);
    result.push({
      date: d,
      monthKey: format(d, 'yyyy-MM'),
      label: format(d, 'MMM yyyy'),
      shortLabel: format(d, 'MMM'),
    });
  }
  return result;
}

/**
 * Check if dateInput falls in current month.
 *
 * @param {string|Date} dateInput
 * @returns {boolean}
 */
export function isThisMonth(dateInput) {
  const d = toDate(dateInput);
  return isThisMonthFns(d);
}

/**
 * Check if dateInput falls in last month.
 *
 * @param {string|Date} dateInput
 * @returns {boolean}
 */
export function isLastMonth(dateInput) {
  const d = toDate(dateInput);
  const lastMonth = subMonths(new Date(), 1);
  return isSameMonth(d, lastMonth);
}
