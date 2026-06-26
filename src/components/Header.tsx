import React, { useState } from 'react';

export const Header: React.FC = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);

  // Smooth scroll handler for anchor links
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-brand-bg/60 border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="#" 
              className="flex items-center gap-2.5 group" 
              aria-label="Aether Data Home"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div className="absolute inset-0 rounded-xl bg-violet-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Aether<span className="text-violet-400">Data</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" aria-label="Main Navigation">
            <a 
              href="#features" 
              onClick={(e) => handleScroll(e, 'features')}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleScroll(e, 'pricing')}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              Pricing
            </a>
            <a 
              href="#testimonials" 
              onClick={(e) => handleScroll(e, 'testimonials')}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
            >
              Testimonials
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              type="button"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 px-4 py-2"
            >
              Sign In
            </button>
            <a 
              href="#cta" 
              onClick={(e) => handleScroll(e, 'cta')}
              className="relative overflow-hidden group rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-violet-500 to-pink-600 pointer-events-none" />
            </a>
          </div>

          {/* Hamburger Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        id="mobile-menu" 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-white/[0.05] bg-brand-bg/95 backdrop-blur-lg ${
          isOpen ? 'max-h-80 opacity-100 py-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 space-y-3">
          <a 
            href="#features" 
            onClick={(e) => handleScroll(e, 'features')}
            className="block text-base font-medium text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
          >
            Features
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => handleScroll(e, 'pricing')}
            className="block text-base font-medium text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
          >
            Pricing
          </a>
          <a 
            href="#testimonials" 
            onClick={(e) => handleScroll(e, 'testimonials')}
            className="block text-base font-medium text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
          >
            Testimonials
          </a>
          <div className="pt-4 border-t border-white/[0.05] flex flex-col gap-3">
            <button 
              type="button"
              className="text-center font-medium text-slate-400 hover:text-white py-2"
            >
              Sign In
            </button>
            <a 
              href="#cta" 
              onClick={(e) => handleScroll(e, 'cta')}
              className="block text-center rounded-xl py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-500"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
