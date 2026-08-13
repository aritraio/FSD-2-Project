import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * Modal — Accessible overlay with focus trap, close on Escape, backdrop click.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {string} title — modal heading
 * @param {'sm'|'md'|'lg'|'xl'} size
 * @param {boolean} showClose — whether to show close button (default true)
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  showClose = true,
  children,
  className = '',
}) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const previousActiveRef = useRef(null);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    previousActiveRef.current = document.activeElement;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    const timer = setTimeout(() => {
      const focusable = contentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable?.length) focusable[0].focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      clearTimeout(timer);
      previousActiveRef.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="backdrop-overlay flex items-center justify-center p-4 max-md:items-end max-md:p-0 max-md:pb-0"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={contentRef}
        className={`
          w-full ${sizes[size]}
          bg-white dark:bg-surface-dark-card
          shadow-modal
          overflow-y-auto
          
          /* Desktop */
          md:rounded-2xl md:max-h-[90vh] md:animate-fade-in-scale
          
          /* Mobile Drawer */
          max-md:rounded-t-2xl max-md:rounded-b-none max-md:max-h-[95vh] max-md:animate-slide-up
          
          ${className}
        `}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            {title && (
              <h2
                id="modal-title"
                className="heading-sm text-zinc-900 dark:text-text-dark-primary"
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="
                  p-1.5 rounded-lg
                  text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100
                  dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-surface-dark-elevated
                  transition-colors duration-150
                "
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
