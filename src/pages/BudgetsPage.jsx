import React from 'react';
import { PiggyBank } from 'lucide-react';

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="label mb-1">Planning</p>
        <h1 className="heading-lg text-zinc-900 dark:text-text-dark-primary">Budgets</h1>
      </div>
      <div className="card p-12 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-[rgba(245,158,11,0.12)] flex items-center justify-center mb-4">
          <PiggyBank className="w-7 h-7 text-brand-amber" />
        </div>
        <h2 className="heading-sm text-zinc-800 dark:text-text-dark-primary mb-2">Budgets</h2>
        <p className="body-sm max-w-md">Your budget categories and spending limits will appear here. This page will be built in Phase 7.</p>
      </div>
    </div>
  );
}
