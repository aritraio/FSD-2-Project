import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { BarChart3 } from 'lucide-react';

// Services
import {
  getTransactions,
  getAccounts,
  getNetWorthHistory,
} from '@/services/storage';

// Calculations
import {
  calcMonthlyIncome,
  calcMonthlyExpenses,
  calcSavingsRate,
  calcMonthlyCashFlow,
  calcAverageDailySpending,
  calcTopSpendingCategory,
  calcNetWorthHistory,
} from '@/utils/calculations';

// Date utils
import { getLastNMonths } from '@/utils/dateUtils';

// UI
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';

// Analytics components
import AnalyticsSummary from '@/components/analytics/AnalyticsSummary';
import MonthlyExpensesChart from '@/components/analytics/MonthlyExpensesChart';
import MonthlyIncomeChart from '@/components/analytics/MonthlyIncomeChart';
import CategoryComparisonChart from '@/components/analytics/CategoryComparisonChart';
import SavingsRateChart from '@/components/analytics/SavingsRateChart';
import NetWorthGrowthChart from '@/components/analytics/NetWorthGrowthChart';

const PERIOD_OPTIONS = [
  { value: '6', label: 'Last 6 Months' },
  { value: '9', label: 'Last 9 Months' },
  { value: '12', label: 'Last 12 Months' },
];

/**
 * AnalyticsPage — Comprehensive spending trends and financial analytics.
 * Displays summary metrics, multiple chart types, and category comparisons.
 */
export default function AnalyticsPage() {
  const [period, setPeriod] = useState('6');

  // Load data
  const transactions = getTransactions();
  const accounts = getAccounts();
  const netWorthHistoryRaw = getNetWorthHistory();

  const nMonths = parseInt(period, 10);
  const now = new Date();
  const currentMonth = format(now, 'yyyy-MM');

  // Months array for the selected period
  const months = useMemo(() => getLastNMonths(nMonths), [nMonths]);

  // Month selector options for summary metrics
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const monthOptions = useMemo(() => {
    const opts = months.map((m) => ({
      value: m.monthKey,
      label: m.label,
    }));
    return opts;
  }, [months]);

  // Summary metrics for the selected month
  const summaryMetrics = useMemo(() => {
    const income = calcMonthlyIncome(transactions, selectedMonth);
    const expenses = calcMonthlyExpenses(transactions, selectedMonth);
    const savingsRate = calcSavingsRate(income, expenses);
    const netCashFlow = income - expenses;
    const avgDaily = calcAverageDailySpending(transactions, selectedMonth);
    const topCat = calcTopSpendingCategory(transactions, selectedMonth);

    // Find month label
    const monthEntry = months.find((m) => m.monthKey === selectedMonth);
    const monthLabel = monthEntry ? monthEntry.label : selectedMonth;

    return {
      monthlySpending: expenses,
      monthlyIncome: income,
      savingsRate,
      netCashFlow,
      avgDailySpending: avgDaily,
      topCategory: topCat,
      monthLabel,
    };
  }, [transactions, selectedMonth, months]);

  // Cash flow data for the period
  const cashFlowData = useMemo(() => {
    return calcMonthlyCashFlow(transactions, nMonths);
  }, [transactions, nMonths]);

  // Net worth history
  const netWorthHistory = useMemo(() => {
    const history = calcNetWorthHistory(netWorthHistoryRaw, transactions, accounts);
    // Only return data for the selected period range
    return history.slice(-nMonths);
  }, [netWorthHistoryRaw, transactions, accounts, nMonths]);

  // Check if there are any transactions at all
  const hasTransactions = transactions.length > 0;

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="label mb-1 text-zinc-500">Insights</p>
          <h1 className="heading-lg text-zinc-900 dark:text-text-dark-primary">
            Analytics
          </h1>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="w-40">
            <Select
              options={monthOptions}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              placeholder={null}
            />
          </div>
          <div className="w-40">
            <Select
              options={PERIOD_OPTIONS}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder={null}
            />
          </div>
        </div>
      </div>

      {/* ── Empty state ── */}
      {!hasTransactions ? (
        <div className="card p-8 md:p-12">
          <EmptyState
            icon={<BarChart3 className="w-7 h-7 text-brand-amber" />}
            title="No analytics data yet"
            description="Add some transactions to see spending trends, income patterns, and financial analytics here."
            actionLabel="Go to Transactions"
            onAction={() => window.location.href = '/transactions'}
          />
        </div>
      ) : (
        <>
          {/* ── Summary Metrics ── */}
          <AnalyticsSummary {...summaryMetrics} />

          {/* ── Expenses & Income Charts (side-by-side) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyExpensesChart data={cashFlowData} />
            <MonthlyIncomeChart data={cashFlowData} />
          </div>

          {/* ── Category Comparison (full width) ── */}
          <CategoryComparisonChart transactions={transactions} months={months} />

          {/* ── Savings Rate & Net Worth Growth (side-by-side) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SavingsRateChart transactions={transactions} months={months} />
            <NetWorthGrowthChart data={netWorthHistory} />
          </div>
        </>
      )}
    </div>
  );
}
