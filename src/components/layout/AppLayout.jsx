import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import GlobalSearch from './GlobalSearch';

/**
 * AppLayout — App shell wrapper with Navbar + <Outlet />.
 *
 * Features:
 * - Sticky Navbar at top (with integrated mobile nav)
 * - Max-width container (~1400px) with generous padding
 * - <Outlet /> for routed page content
 * - Subtle page transition via CSS animation
 */
export default function AppLayout() {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-ivory dark:bg-surface-dark transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      {/* Global Search Overlay */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Page Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
