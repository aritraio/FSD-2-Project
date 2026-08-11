import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Trash2,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  Sun,
  Moon,
} from 'lucide-react';
import {
  Button,
  Modal,
  Input,
  Select,
  Badge,
  EmptyState,
  Tooltip,
  ConfirmDialog,
} from '@/components/ui';
import Navbar from '@/components/layout/Navbar';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-surface-dark' : 'bg-ivory'}`}>
      {/* Desktop Navigation */}
      <Navbar onSearchClick={() => {}} />

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* ── Header ── */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-[rgba(245,158,11,0.15)] rounded-xl text-brand-amber">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-serif-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-text-dark-primary">
                Ledger
              </h1>
              <p className="label text-brand-amber dark:text-amber-400">Design System</p>
            </div>
          </div>
          <Tooltip content={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <button
              onClick={toggleDark}
              className="p-2.5 rounded-xl bg-white dark:bg-surface-dark-card border border-ivory-border dark:border-surface-dark-border hover:bg-ivory-muted dark:hover:bg-surface-dark-elevated transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-500" />}
            </button>
          </Tooltip>
        </header>

        {/* ── 1. Color Palette ── */}
        <section>
          <h2 className="label mb-4">Color Tokens</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { name: 'Ivory', color: 'bg-ivory', border: true },
              { name: 'Primary', color: 'bg-zinc-900 dark:bg-zinc-100' },
              { name: 'Secondary', color: 'bg-zinc-500' },
              { name: 'Amber', color: 'bg-brand-amber' },
              { name: 'Emerald', color: 'bg-brand-emerald' },
              { name: 'Red', color: 'bg-brand-red' },
              { name: 'Teal', color: 'bg-brand-teal' },
            ].map((c) => (
              <div key={c.name} className="text-center space-y-2">
                <div
                  className={`w-full aspect-square rounded-xl ${c.color} ${c.border ? 'border border-ivory-border' : ''} shadow-card`}
                />
                <p className="text-xs font-medium text-zinc-600 dark:text-text-dark-secondary">{c.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 2. Typography ── */}
        <section>
          <h2 className="label mb-6">Typography Scale</h2>
          <div className="space-y-6 card p-8">
            <div>
              <p className="label mb-1">.display-xl</p>
              <p className="display-xl text-zinc-900 dark:text-text-dark-primary">₹8,42,350</p>
            </div>
            <div>
              <p className="label mb-1">.heading-lg</p>
              <p className="heading-lg text-zinc-900 dark:text-text-dark-primary">Net Worth Overview</p>
            </div>
            <div>
              <p className="label mb-1">.heading-sm</p>
              <p className="heading-sm text-zinc-900 dark:text-text-dark-primary">Monthly Spending</p>
            </div>
            <div>
              <p className="label mb-1">.label</p>
              <p className="label">Total Investments</p>
            </div>
            <div>
              <p className="label mb-1">.body</p>
              <p className="body dark:text-text-dark-primary">Track your income, expenses, and investments with elegance. Every rupee accounted for.</p>
            </div>
            <div>
              <p className="label mb-1">.body-sm</p>
              <p className="body-sm">Last updated 2 hours ago · 47 transactions this month</p>
            </div>
            <div>
              <p className="label mb-1">.mono</p>
              <p className="mono text-xl text-zinc-900 dark:text-text-dark-primary">₹1,42,500.00</p>
            </div>
          </div>
        </section>

        {/* ── 3. Buttons ── */}
        <section>
          <h2 className="label mb-4">Buttons</h2>
          <div className="card p-8 space-y-6">
            {/* Variants */}
            <div>
              <p className="body-sm mb-3">Variants</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Transaction</Button>
                <Button variant="secondary" icon={<Download className="w-4 h-4" />}>Export</Button>
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive" icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
              </div>
            </div>
            {/* Sizes */}
            <div>
              <p className="body-sm mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
            {/* States */}
            <div>
              <p className="body-sm mb-3">States</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" loading>Loading…</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Badges ── */}
        <section>
          <h2 className="label mb-4">Badges</h2>
          <div className="card p-8">
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="success">Income</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="danger">Overdue</Badge>
              <Badge variant="info">Transfer</Badge>
              <Badge variant="outline">Category</Badge>
              <Badge variant="success" dot dotColor="#059669">Food</Badge>
              <Badge variant="warning" dot dotColor="#D97706">Transport</Badge>
              <Badge variant="danger" dot dotColor="#E11D48">Shopping</Badge>
            </div>
          </div>
        </section>

        {/* ── 5. Form Controls ── */}
        <section>
          <h2 className="label mb-4">Form Controls</h2>
          <div className="card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Description"
                placeholder="e.g. Swiggy order"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="Amount"
                type="number"
                placeholder="₹0.00"
                icon={<Banknote className="w-4 h-4" />}
              />
              <Input
                label="Search"
                placeholder="Search transactions…"
                icon={<Search className="w-4 h-4" />}
              />
              <Input
                label="With Error"
                placeholder="Required field"
                error="This field is required"
              />
              <Select
                label="Category"
                placeholder="Select category"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { value: 'food', label: 'Food & Dining' },
                  { value: 'transport', label: 'Transport' },
                  { value: 'shopping', label: 'Shopping' },
                  { value: 'bills', label: 'Bills & Utilities' },
                  { value: 'entertainment', label: 'Entertainment' },
                ]}
              />
              <Select
                label="Account"
                placeholder="Select account"
                options={[
                  { value: 'hdfc', label: 'HDFC Savings' },
                  { value: 'icici', label: 'ICICI Savings' },
                  { value: 'sbi', label: 'SBI Credit Card' },
                ]}
              />
              <Input
                label="Date"
                type="date"
              />
              <Input
                label="Disabled"
                placeholder="Cannot edit"
                disabled
              />
            </div>
          </div>
        </section>

        {/* ── 6. Tooltips ── */}
        <section>
          <h2 className="label mb-4">Tooltips</h2>
          <div className="card p-8">
            <div className="flex flex-wrap gap-4">
              <Tooltip content="Top tooltip" position="top">
                <Button variant="secondary" size="sm">Top</Button>
              </Tooltip>
              <Tooltip content="Bottom tooltip" position="bottom">
                <Button variant="secondary" size="sm">Bottom</Button>
              </Tooltip>
              <Tooltip content="Left tooltip" position="left">
                <Button variant="secondary" size="sm">Left</Button>
              </Tooltip>
              <Tooltip content="Right tooltip" position="right">
                <Button variant="secondary" size="sm">Right</Button>
              </Tooltip>
            </div>
          </div>
        </section>

        {/* ── 7. Modals & Dialogs ── */}
        <section>
          <h2 className="label mb-4">Modals & Dialogs</h2>
          <div className="card p-8">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Open Modal
              </Button>
              <Button variant="destructive" onClick={() => setShowConfirm(true)}>
                Confirm Dialog
              </Button>
            </div>
          </div>

          {/* Modal */}
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Add Transaction"
            size="md"
          >
            <div className="space-y-4">
              <Input label="Description" placeholder="e.g. Amazon purchase" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Amount" type="number" placeholder="₹0.00" />
                <Input label="Date" type="date" />
              </div>
              <Select
                label="Category"
                placeholder="Select category"
                options={[
                  { value: 'food', label: 'Food & Dining' },
                  { value: 'shopping', label: 'Shopping' },
                  { value: 'bills', label: 'Bills' },
                ]}
              />
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" fullWidth onClick={() => setShowModal(false)}>
                  Save Transaction
                </Button>
              </div>
            </div>
          </Modal>

          {/* Confirm Dialog */}
          <ConfirmDialog
            isOpen={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => setShowConfirm(false)}
            title="Delete Transaction"
            message="This will permanently remove this transaction from your records. This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Keep it"
          />
        </section>

        {/* ── 8. Empty State ── */}
        <section>
          <h2 className="label mb-4">Empty State</h2>
          <div className="card">
            <EmptyState
              title="No transactions yet"
              description="Start tracking your finances by adding your first transaction."
              actionLabel="Add Transaction"
              onAction={() => setShowModal(true)}
            />
          </div>
        </section>

        {/* ── 9. Card Surface Demo ── */}
        <section>
          <h2 className="label mb-4">Card Surfaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Income', value: '₹1,25,000', change: '+12.5%', positive: true, icon: ArrowUpRight },
              { label: 'Expenses', value: '₹38,240', change: '-4.2%', positive: false, icon: ArrowDownRight },
              { label: 'Savings', value: '₹86,760', change: '+18.3%', positive: true, icon: CreditCard },
            ].map((metric) => (
              <div key={metric.label} className="card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="label">{metric.label}</p>
                  <metric.icon
                    className={`w-4 h-4 ${metric.positive ? 'text-brand-emerald' : 'text-brand-red'}`}
                  />
                </div>
                <p className="mono text-2xl font-semibold text-zinc-900 dark:text-text-dark-primary">
                  {metric.value}
                </p>
                <Badge variant={metric.positive ? 'success' : 'danger'} size="sm">
                  {metric.change} this month
                </Badge>
              </div>
            ))}
          </div>
        </section>

        {/* ── Chart Palette ── */}
        <section>
          <h2 className="label mb-4">Chart Palette</h2>
          <div className="card p-8">
            <div className="flex gap-2">
              {[
                { name: 'Teal', color: 'bg-chart-teal' },
                { name: 'Gold', color: 'bg-chart-gold' },
                { name: 'Navy', color: 'bg-chart-navy' },
                { name: 'Coral', color: 'bg-chart-coral' },
                { name: 'Plum', color: 'bg-chart-plum' },
                { name: 'Rose', color: 'bg-chart-rose' },
                { name: 'Sky', color: 'bg-chart-sky' },
                { name: 'Lime', color: 'bg-chart-lime' },
              ].map((c) => (
                <Tooltip key={c.name} content={c.name}>
                  <div className={`w-10 h-10 rounded-lg ${c.color} cursor-default`} />
                </Tooltip>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center body-sm pb-8">
          Phase 1 — Design System & UI Primitives · Ledger
        </footer>
      </div>
    </div>
  );
}
