import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button — Primary, secondary, ghost, destructive variants; sizes sm/md/lg.
 *
 * @param {'primary'|'secondary'|'ghost'|'destructive'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading
 * @param {boolean} fullWidth
 * @param {React.ReactNode} icon — optional leading icon
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className = '',
  ...props
}) {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'font-sans font-medium rounded-lg',
    'transition-all duration-200 ease-out-expo',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'select-none cursor-pointer',
  ].join(' ');

  const variants = {
    primary: [
      'bg-brand-amber text-white',
      'hover:bg-brand-amber-hover active:scale-[0.98]',
      'shadow-sm hover:shadow-md',
    ].join(' '),
    secondary: [
      'bg-white text-zinc-800 border border-ivory-border',
      'hover:bg-ivory-muted hover:border-zinc-300 active:scale-[0.98]',
      'dark:bg-surface-dark-card dark:text-text-dark-primary dark:border-surface-dark-border',
      'dark:hover:bg-surface-dark-elevated',
    ].join(' '),
    ghost: [
      'bg-transparent text-zinc-600',
      'hover:bg-ivory-muted hover:text-zinc-900 active:scale-[0.98]',
      'dark:text-text-dark-secondary dark:hover:bg-surface-dark-elevated dark:hover:text-text-dark-primary',
    ].join(' '),
    destructive: [
      'bg-brand-red text-white',
      'hover:bg-brand-red-hover active:scale-[0.98]',
      'shadow-sm hover:shadow-md',
    ].join(' '),
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-md',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
