import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import AccountCard from '../components/accounts/AccountCard';
import AccountModal from '../components/accounts/AccountModal';
import {
  getAccounts,
  saveAccount,
  updateAccount,
  deleteAccount,
} from '../services/storage';
import { calcTotalAssets, calcTotalLiabilities, calcNetWorth } from '../utils/calculations';
import { formatINR } from '../utils/formatCurrency';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    setAccounts(getAccounts());
  }, []);

  const totalAssets = calcTotalAssets(accounts);
  const totalLiabilities = calcTotalLiabilities(accounts);
  const netWorth = calcNetWorth(accounts);

  const assetsAccounts = accounts.filter(a => a.type !== 'credit');
  const liabilitiesAccounts = accounts.filter(a => a.type === 'credit');

  const handleAddClick = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    deleteAccount(id);
    setAccounts(getAccounts());
  };

  const handleSaveAccount = (data) => {
    if (editingAccount) {
      updateAccount(data);
    } else {
      saveAccount(data);
    }
    setAccounts(getAccounts());
  };

  return (
    <div className="space-y-8">
      {/* Header & Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="label mb-1 text-zinc-500">Finance</p>
          <h1 className="heading-lg text-zinc-900 dark:text-text-dark-primary mb-6">Accounts</h1>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 font-medium tracking-wide">TOTAL ASSETS</p>
              <p className="text-2xl font-mono text-zinc-900 dark:text-text-dark-primary">
                {formatINR(totalAssets, { showSymbol: true })}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 font-medium tracking-wide">TOTAL LIABILITIES</p>
              <p className="text-2xl font-mono text-zinc-900 dark:text-text-dark-primary">
                {formatINR(totalLiabilities, { showSymbol: true })}
              </p>
            </div>
            <div className="pl-6 border-l border-ivory-border dark:border-surface-dark-border">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 font-medium tracking-wide">NET WORTH</p>
              <p className="text-2xl font-mono text-brand-emerald dark:text-emerald-400">
                {formatINR(netWorth, { showSymbol: true })}
              </p>
            </div>
          </div>
        </div>
        
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAddClick}>
          Add Account
        </Button>
      </div>

      {/* Assets Section */}
      <div>
        <h2 className="heading-sm text-zinc-800 dark:text-text-dark-primary mb-4 flex items-center gap-2">
          Assets
          <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-surface-dark-elevated px-2 py-0.5 rounded-full">
            {assetsAccounts.length}
          </span>
        </h2>
        {assetsAccounts.length === 0 ? (
          <p className="text-sm text-zinc-500">No asset accounts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetsAccounts.map(account => (
              <AccountCard 
                key={account.id} 
                account={account} 
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Liabilities Section */}
      <div>
        <h2 className="heading-sm text-zinc-800 dark:text-text-dark-primary mb-4 flex items-center gap-2">
          Liabilities
          <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-surface-dark-elevated px-2 py-0.5 rounded-full">
            {liabilitiesAccounts.length}
          </span>
        </h2>
        {liabilitiesAccounts.length === 0 ? (
          <p className="text-sm text-zinc-500">No liability accounts found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liabilitiesAccounts.map(account => (
              <AccountCard 
                key={account.id} 
                account={account} 
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        account={editingAccount}
        onSave={handleSaveAccount}
      />
    </div>
  );
}
