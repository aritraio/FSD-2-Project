import React, { useState, useEffect, useRef } from 'react';
import { Settings, User, Palette, Database, Download, Upload, Trash2, Info } from 'lucide-react';
import { getSettings, saveSettings, exportAllData, importData, clearAllData } from '../services/storage';
import { Input, Select, Button, ConfirmDialog } from '../components/ui';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null); // { type: 'success' | 'error', text: '' }
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  const handleChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveSettings(updated);
    
    // Dispatch a custom event in case other components (like a ThemeProvider) need to know immediately
    window.dispatchEvent(new Event('ledger_settings_updated'));
    showAlert('success', 'Settings updated successfully.');
  };

  const showAlert = (type, text) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const handleExport = () => {
    try {
      const dataStr = exportAllData();
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `ledger_backup_${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      showAlert('success', 'Data exported successfully.');
    } catch (e) {
      showAlert('error', 'Failed to export data.');
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonStr = event.target.result;
        importData(jsonStr);
        showAlert('success', 'Data imported successfully. Reloading...');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        showAlert('error', 'Failed to import data. Invalid JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleClearData = () => {
    clearAllData();
    setIsClearDialogOpen(false);
    showAlert('success', 'All data cleared. Reloading...');
    setTimeout(() => window.location.reload(), 1500);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <p className="label mb-1">Preferences</p>
        <h1 className="heading-lg text-zinc-900 dark:text-text-dark-primary">Settings</h1>
      </div>

      {alertMsg && (
        <div className={`p-4 rounded-lg text-sm font-medium transition-opacity ${
          alertMsg.type === 'success' ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-brand-red/10 text-brand-red'
        }`}>
          {alertMsg.text}
        </div>
      )}

      {/* Profile Section */}
      <section className="card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-surface-dark flex items-center justify-center">
            <User className="w-5 h-5 text-zinc-500 dark:text-text-dark-secondary" />
          </div>
          <h2 className="heading-sm text-zinc-900 dark:text-text-dark-primary">Profile</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-20 h-20 rounded-full bg-brand-amber/10 text-brand-amber flex items-center justify-center text-2xl font-serif shrink-0">
            {getInitials(settings.userName)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <Input 
              label="Display Name" 
              value={settings.userName || ''} 
              onChange={(e) => handleChange('userName', e.target.value)} 
            />
            <Input 
              label="Email Address" 
              type="email"
              value={settings.email || ''} 
              onChange={(e) => handleChange('email', e.target.value)} 
            />
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-surface-dark flex items-center justify-center">
            <Palette className="w-5 h-5 text-zinc-500 dark:text-text-dark-secondary" />
          </div>
          <h2 className="heading-sm text-zinc-900 dark:text-text-dark-primary">Preferences</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          <Select 
            label="Currency Display" 
            value={settings.currency || 'INR'}
            onChange={(e) => handleChange('currency', e.target.value)}
            options={[
              { value: 'INR', label: 'Indian Rupee (₹)' },
              { value: 'USD', label: 'US Dollar ($)' },
              { value: 'EUR', label: 'Euro (€)' }
            ]}
          />
          <Select 
            label="Theme" 
            value={settings.theme || 'system'}
            onChange={(e) => handleChange('theme', e.target.value)}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System Default' }
            ]}
          />
          <Select 
            label="Default Account" 
            value={settings.defaultAccount || ''}
            onChange={(e) => handleChange('defaultAccount', e.target.value)}
            options={[
              { value: 'acc-1', label: 'HDFC Bank Savings' },
              { value: 'acc-2', label: 'ICICI Emergency Fund' },
              { value: 'acc-3', label: 'SBI SimplyClick Credit Card' },
              { value: 'acc-4', label: 'Amazon Pay ICICI Card' },
              { value: 'acc-5', label: 'Cash in Hand' }
            ]}
            hint="For new transactions"
          />
        </div>
      </section>

      {/* Data Management Section */}
      <section className="card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-surface-dark flex items-center justify-center">
            <Database className="w-5 h-5 text-zinc-500 dark:text-text-dark-secondary" />
          </div>
          <h2 className="heading-sm text-zinc-900 dark:text-text-dark-primary">Data Management</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-text-dark-primary">Export Data</h3>
            <p className="text-xs text-zinc-500 dark:text-text-dark-secondary leading-relaxed">Download a JSON backup of all your transactions, accounts, and settings.</p>
            <Button variant="secondary" onClick={handleExport} className="mt-auto justify-center">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-text-dark-primary">Import Data</h3>
            <p className="text-xs text-zinc-500 dark:text-text-dark-secondary leading-relaxed">Restore from a previous backup file. This will overwrite current data.</p>
            <Button variant="secondary" onClick={handleImportClick} className="mt-auto justify-center">
              <Upload className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-brand-red">Clear All Data</h3>
            <p className="text-xs text-zinc-500 dark:text-text-dark-secondary leading-relaxed">Permanently delete all data and reset the application to its initial state.</p>
            <Button variant="destructive" onClick={() => setIsClearDialogOpen(true)} className="mt-auto justify-center">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Data
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-surface-dark flex items-center justify-center">
            <Info className="w-5 h-5 text-zinc-500 dark:text-text-dark-secondary" />
          </div>
          <h2 className="heading-sm text-zinc-900 dark:text-text-dark-primary">About</h2>
        </div>
        <div className="flex flex-col gap-1 text-sm text-zinc-600 dark:text-text-dark-secondary">
          <p className="font-medium text-zinc-900 dark:text-text-dark-primary mb-1">Ledger — Personal Finance Tracker</p>
          <p>Version 1.0.0</p>
          <p>A production-quality personal finance dashboard built with React + Vite.</p>
          <p className="mt-2 text-xs">Built for tracking net worth, cash flow, and budgets.</p>
        </div>
      </section>

      <ConfirmDialog 
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={handleClearData}
        title="Clear All Data?"
        message="This will permanently delete all your transactions, accounts, budgets, and investments. The app will be reset to its initial state."
        confirmLabel="Yes, Clear Data"
      />
    </div>
  );
}
