import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Select — Dropdown select with label, error state.
 *
 * @param {string} label
 * @param {string} error
 * @param {string} placeholder — e.g. "Select a category"
 * @param {{ value: string, label: string }[]} options
 * @param {boolean} fullWidth
 */
const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    placeholder = 'Select…',
    options = [],
    fullWidth = true,
    className = '',
    id,
    ...props
  },
  ref
) {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-') || 'field'}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-zinc-700 dark:text-text-dark-secondary mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-3.5 py-2.5 pr-10
            text-sm font-sans text-zinc-900 dark:text-text-dark-primary
            bg-white dark:bg-surface-dark-elevated
            border rounded-lg max-md:min-h-[44px]
            appearance-none cursor-pointer
            ${
              error
                ? 'border-brand-red focus:ring-brand-red/20 focus:border-brand-red'
                : 'border-ivory-border dark:border-surface-dark-border focus:ring-brand-amber/20 focus:border-brand-amber'
            }
            transition-all duration-150
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-ivory-muted
            ${className}
          `}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p id={`${selectId}-error`} className="mt-1.5 text-xs text-brand-red font-medium" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${selectId}-hint`} className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-500">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Select;
