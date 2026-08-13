import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { toDate } from '../../utils/dateUtils';
import { format } from 'date-fns';

const INITIAL_STATE = {
  type: 'expense',
  amount: '',
  description: '', // used for merchant/description
  category: '',
  accountId: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  notes: '',
};

export default function TransactionModal({
  isOpen,
  onClose,
  transaction,
  onSave,
  categories = [],
  accounts = [],
}) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        setFormData({
          ...transaction,
          description: transaction.merchant || transaction.description || '',
          date: transaction.date ? format(toDate(transaction.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        });
      } else {
        setFormData(INITIAL_STATE);
      }
      setErrors({});
    }
  }, [isOpen, transaction]);

  const categoryOptions = categories.map((c) => ({ value: c, label: c }));
  const accountOptions = accounts.map((a) => ({ value: a.id, label: a.name }));

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description/Merchant is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.accountId) {
      newErrors.accountId = 'Account is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        merchant: formData.description, // map description to merchant for backward compat
        amount: Number(formData.amount),
      });
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? 'Edit Transaction' : 'Add Transaction'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle */}
        <div className="flex bg-zinc-100 dark:bg-surface-dark-elevated p-1 rounded-lg">
          <button
            type="button"
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              formData.type === 'expense'
                ? 'bg-white dark:bg-surface-dark-card text-zinc-900 dark:text-text-dark-primary shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
            onClick={() => setFormData({ ...formData, type: 'expense' })}
          >
            Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              formData.type === 'income'
                ? 'bg-white dark:bg-surface-dark-card text-zinc-900 dark:text-text-dark-primary shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
            onClick={() => setFormData({ ...formData, type: 'income' })}
          >
            Income
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            icon={<span className="text-sm">₹</span>}
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            error={errors.date}
          />
        </div>

        <Input
          label="Merchant / Description"
          placeholder="e.g. Amazon, Salary, Groceries..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            error={errors.category}
          />
          <Select
            label="Account"
            options={accountOptions}
            value={formData.accountId}
            onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
            error={errors.accountId}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-text-dark-secondary mb-1.5">
            Notes (Optional)
          </label>
          <textarea
            className="w-full px-3.5 py-2.5 text-sm font-sans text-zinc-900 dark:text-text-dark-primary bg-white dark:bg-surface-dark-elevated border border-ivory-border dark:border-surface-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-amber/20 focus:border-brand-amber transition-all duration-150 resize-none"
            rows={3}
            placeholder="Add details about this transaction..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-ivory-border dark:border-surface-dark-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
}
