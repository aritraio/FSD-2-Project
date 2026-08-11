import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getSettings } from '@/services/storage';
import { formatINR, formatPercent, formatChange } from '@/utils/formatCurrency';
import { getMonthYear } from '@/utils/dateUtils';
import { format } from 'date-fns';

/**
 * Get a time-of-day greeting string.
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * HeroSection — Dashboard greeting, breadcrumb, and net-worth hero display.
 *
 * @param {{ netWorth: number, prevNetWorth: number }} props
 */
export default function HeroSection({ netWorth = 0, prevNetWorth = 0 }) {
  const settings = getSettings();
  const userName = settings?.userName || 'User';

  const monthChange = netWorth - prevNetWorth;
  const monthChangePercent = prevNetWorth > 0
    ? ((monthChange / prevNetWorth) * 100)
    : 0;

  const isPositive = monthChange > 0;
  const isNegative = monthChange < 0;
  const isNeutral = monthChange === 0;

  const currentMonthYear = useMemo(() => {
    const now = new Date();
    return format(now, 'MMMM yyyy').toUpperCase();
  }, []);

  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const trendColor = isPositive
    ? 'text-brand-emerald'
    : isNegative
    ? 'text-brand-red'
    : 'text-text-secondary dark:text-text-dark-secondary';
  const trendBg = isPositive
    ? 'bg-brand-emerald-light dark:bg-[rgba(52,211,153,0.12)]'
    : isNegative
    ? 'bg-brand-red-light dark:bg-[rgba(251,113,133,0.12)]'
    : 'bg-ivory-muted dark:bg-surface-dark-elevated';

  return (
    <section className="animate-fade-in" aria-label="Financial overview">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <span className="label">Overview</span>
        <span className="text-text-tertiary dark:text-text-dark-tertiary text-xs">/</span>
        <span className="label">{currentMonthYear}</span>
      </div>

      {/* Greeting */}
      <div className="mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-amber">
          {getGreeting()}, {userName}
        </p>
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary dark:text-text-dark-secondary mb-8">
        Your Financial Overview
      </p>

      {/* Net Worth Display */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
        <div>
          <p className="label mb-2">Net Worth</p>
          <h1 className="display-xl text-zinc-900 dark:text-text-dark-primary">
            {formatINR(netWorth)}
          </h1>
        </div>

        {/* Monthly Change Pill */}
        <div className={`
          inline-flex items-center gap-2 px-3.5 py-2 rounded-xl
          ${trendBg}
          self-start sm:self-auto sm:mb-2
        `}>
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-sm font-semibold mono ${trendColor}`}>
            {formatChange(monthChange)}
          </span>
          <span className={`text-xs font-medium ${trendColor} opacity-80`}>
            {formatPercent(monthChangePercent)}
          </span>
          <span className="text-xs text-text-tertiary dark:text-text-dark-tertiary">
            this month
          </span>
        </div>
      </div>
    </section>
  );
}
