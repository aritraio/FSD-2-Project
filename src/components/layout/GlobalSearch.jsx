import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X } from 'lucide-react';
import { getTransactions, getAccounts } from '../../services/storage';
import { formatINR } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const transactions = useMemo(() => {
    return isOpen ? getTransactions() : [];
  }, [isOpen]);

  const accounts = useMemo(() => {
    return isOpen ? getAccounts() : [];
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    return transactions.filter(t => {
      const matchMerchant = t.merchant?.toLowerCase().includes(q);
      const matchCategory = t.category?.toLowerCase().includes(q);
      const matchNotes = t.notes?.toLowerCase().includes(q);
      const acc = accounts.find(a => a.id === t.accountId);
      const matchAccount = acc?.name.toLowerCase().includes(q);
      
      return matchMerchant || matchCategory || matchNotes || matchAccount;
    }).slice(0, 8); // top 8 results
  }, [query, transactions, accounts]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.trim()) {
        navigate(`/transactions?search=${encodeURIComponent(query)}`);
        onClose();
      }
    }
  };

  const handleSelect = (tx) => {
    navigate(`/transactions?search=${encodeURIComponent(tx.merchant)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 backdrop-blur-sm bg-zinc-900/40 dark:bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-surface-dark-card rounded-2xl shadow-modal overflow-hidden animate-fade-in-scale border border-ivory-border dark:border-surface-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-ivory-border dark:border-surface-dark-border">
          <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-0 py-4 px-3 text-lg text-zinc-900 dark:text-text-dark-primary placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-0"
            placeholder="Search transactions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setTimeout(() => inputRef.current?.focus(), 10);
              }}
              aria-label="Clear search"
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-surface-dark-elevated transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() && results.length === 0 ? (
            <div className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <ul className="py-2">
              {results.map((tx, idx) => (
                <li key={tx.id}>
                  <button
                    className={`w-full text-left px-4 py-3 flex items-center justify-between group transition-colors ${
                      idx === selectedIndex
                        ? 'bg-ivory-muted dark:bg-surface-dark-elevated'
                        : 'hover:bg-ivory-muted/50 dark:hover:bg-surface-dark-elevated/50'
                    }`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => handleSelect(tx)}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          tx.type === 'expense' ? 'bg-brand-red' : tx.type === 'income' ? 'bg-brand-green' : 'bg-brand-amber'
                        }`}
                      />
                      <div className="truncate">
                        <div className="text-sm font-semibold text-zinc-900 dark:text-text-dark-primary truncate">
                          {tx.merchant}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-2">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span>{formatDate(tx.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className={`font-mono font-medium ${
                          tx.type === 'expense'
                            ? 'text-zinc-900 dark:text-text-dark-primary'
                            : tx.type === 'income'
                            ? 'text-brand-green'
                            : 'text-zinc-500'
                        }`}
                      >
                        {tx.type === 'expense' ? '−' : tx.type === 'income' ? '+' : ''}
                        {formatINR(tx.amount)}
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 transition-colors ${
                          idx === selectedIndex ? 'text-zinc-400 dark:text-zinc-300' : 'text-transparent group-hover:text-zinc-300 dark:group-hover:text-zinc-600'
                        }`}
                      />
                    </div>
                  </button>
                </li>
              ))}
              {query.trim() && results.length > 0 && (
                <li className="px-4 py-2 border-t border-ivory-border dark:border-surface-dark-border mt-2">
                  <button
                    onClick={() => {
                      navigate(`/transactions?search=${encodeURIComponent(query)}`);
                      onClose();
                    }}
                    className="w-full py-2 text-sm text-center font-medium text-brand-amber hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                  >
                    View all results for "{query}"
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
        
        <div className="px-4 py-3 bg-zinc-50 dark:bg-surface-dark text-xs text-zinc-500 dark:text-zinc-400 border-t border-ivory-border dark:border-surface-dark-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300">↑</kbd> <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300">Enter</kbd> to select</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-300">Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
