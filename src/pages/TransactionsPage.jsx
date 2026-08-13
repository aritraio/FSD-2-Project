import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionModal from '../components/transactions/TransactionModal';
import {
  getTransactions,
  saveTransaction,
  updateTransaction,
  deleteTransaction,
  getAccounts,
} from '../services/storage';
import { formatINR } from '../utils/formatCurrency';
import { isThisMonth } from '../utils/dateUtils';

const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Transport',
  'Healthcare',
  'Travel',
  'Education',
  'Investment',
  'Salary',
  'Freelance',
  'Other',
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    month: 'all',
    type: 'all',
    category: 'all',
    accountId: 'all',
  });

  // Load initial data
  useEffect(() => {
    setTransactions(getTransactions());
    setAccounts(getAccounts());
  }, []);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Search Filter (merchant, category, notes)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesMerchant = (tx.merchant || '').toLowerCase().includes(searchLower);
        const matchesCategory = (tx.category || '').toLowerCase().includes(searchLower);
        const matchesNotes = (tx.notes || '').toLowerCase().includes(searchLower);
        if (!matchesMerchant && !matchesCategory && !matchesNotes) return false;
      }

      // 2. Month Filter
      if (filters.month !== 'all') {
        const txMonth = tx.date ? tx.date.substring(0, 7) : '';
        if (txMonth !== filters.month) return false;
      }

      // 3. Type Filter
      if (filters.type !== 'all' && tx.type !== filters.type) return false;

      // 4. Category Filter
      if (filters.category !== 'all' && tx.category !== filters.category) return false;

      // 5. Account Filter
      if (filters.accountId !== 'all' && tx.accountId !== filters.accountId) return false;

      return true;
    });
  }, [transactions, filters]);

  // Derived metrics
  const spentThisMonth = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === 'expense' && tx.date && isThisMonth(tx.date))
      .reduce((sum, tx) => sum + Math.abs(tx.amount || 0), 0);
  }, [transactions]);

  // Extract unique months for filter
  const uniqueMonths = useMemo(() => {
    const monthMap = new Map();
    transactions.forEach((tx) => {
      if (tx.date) {
        const d = new Date(tx.date);
        if (!isNaN(d.getTime())) {
          const key = tx.date.substring(0, 7);
          const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
          if (!monthMap.has(key)) monthMap.set(key, label);
        }
      }
    });
    return Array.from(monthMap.entries())
      .map(([key, label]) => ({ monthKey: key, label }))
      .sort((a, b) => b.monthKey.localeCompare(a.monthKey)); // newest first
  }, [transactions]);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', month: 'all', type: 'all', category: 'all', accountId: 'all' });
  };

  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    deleteTransaction(id);
    setTransactions(getTransactions());
    setAccounts(getAccounts()); // Update accounts since balance changed
  };

  const handleSaveTransaction = (data) => {
    if (editingTransaction) {
      updateTransaction(data);
    } else {
      saveTransaction(data);
    }
    setTransactions(getTransactions());
    setAccounts(getAccounts()); // Update accounts since balance changed
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="label mb-1 text-zinc-500">
            {formatINR(spentThisMonth, { showSymbol: true })} spent this month
          </p>
          <h1 className="heading-lg text-zinc-900 dark:text-text-dark-primary">Transactions</h1>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAddClick}>
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        categories={DEFAULT_CATEGORIES}
        accounts={accounts}
        months={uniqueMonths}
      />

      {/* Table */}
      <TransactionTable
        transactions={filteredTransactions}
        accounts={accounts}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        categories={DEFAULT_CATEGORIES}
        accounts={accounts}
      />
    </div>
  );
}
