import React from 'react';
import { Wallet, TrendingUp, CheckCircle2, Layers, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-ivory text-zinc-900 flex flex-col justify-center items-center p-6">
      <div className="max-w-xl w-full bg-white border border-ivory-border rounded-xl p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-zinc-100">
          <div className="p-2.5 bg-amber-50 rounded-lg text-brand-amber">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif-display text-2xl font-bold tracking-tight text-zinc-900">Ledger</h1>
            <p className="label-uppercase text-amber-700">Private Wealth Tracker</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Phase 0 — Scaffolding Complete</span>
          </div>

          <h2 className="display-xl text-zinc-900">
            ₹8,42,350<span className="text-lg font-sans font-normal text-zinc-500 ml-2">INR</span>
          </h2>
          <p className="text-sm text-zinc-600">
            Project scaffolding successfully initialized with React, Vite, Tailwind CSS, Lucide React, and Playfair Display + Inter typography.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-medium text-zinc-700">Modular Folders</span>
          </div>
          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-medium text-zinc-700">Tailwind Configured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
