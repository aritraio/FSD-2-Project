import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import TransactionsPage from '@/pages/TransactionsPage';
import AccountsPage from '@/pages/AccountsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import BudgetsPage from '@/pages/BudgetsPage';
import InvestmentsPage from '@/pages/InvestmentsPage';
import SettingsPage from '@/pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
