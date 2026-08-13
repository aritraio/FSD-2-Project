import React from 'react';

/**
 * BudgetProgress — Visualizes budget utilization.
 *
 * @param {number} percentage
 * @param {string} status - 'normal', 'warning', 'exceeded'
 */
export default function BudgetProgress({ percentage, status }) {
  // Cap percentage for the bar width at 100% so it doesn't overflow visually
  const widthPercent = Math.min(percentage, 100);

  let barColor = 'bg-brand-emerald';
  if (status === 'warning') barColor = 'bg-brand-amber';
  if (status === 'exceeded') barColor = 'bg-brand-red';

  return (
    <div className="w-full h-2.5 bg-zinc-100 dark:bg-surface-dark-border rounded-full overflow-hidden">
      <div
        className={`h-full ${barColor} transition-all duration-500 ease-out-expo`}
        style={{ width: `${widthPercent}%` }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  );
}
