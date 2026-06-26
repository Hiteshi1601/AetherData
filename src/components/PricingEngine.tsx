import React, { useEffect, useRef } from 'react';

// Multidimensional pricing matrix configuration
interface PricingTierConfig {
  basePriceUSD: number;
  name: string;
  features: string[];
}

const pricingMatrix: Record<string, PricingTierConfig> = {
  starter: {
    name: 'Starter',
    basePriceUSD: 19,
    features: [
      '3 Active AI Data Pipelines',
      'Up to 10,000 runs / mo',
      'Standard Multi-currency parsing',
      'Email support',
    ]
  },
  pro: {
    name: 'Pro',
    basePriceUSD: 49,
    features: [
      'Unlimited Active Pipelines',
      'Up to 100,000 runs / mo',
      'Advanced Multi-currency parsing',
      'Regional tariff optimization',
      'Priority Support (2-hour SLA)',
      'Custom webhook triggers',
    ]
  },
  enterprise: {
    name: 'Enterprise',
    basePriceUSD: 149,
    features: [
      'Dedicated Agent Hosting',
      'Unlimited pipelines & runs',
      'Custom regional multipliers',
      'SLA guarantee (99.99%)',
      'Dedicated Account Manager',
      'SOC-2 Compliance reporting',
    ]
  }
};

// Regional currency configurations and tariff multipliers
interface CurrencyConfig {
  symbol: string;
  multiplier: number; // Regional multiplier against base USD price
  decimals: boolean;
}

const currencyConfig: Record<string, CurrencyConfig> = {
  USD: { symbol: '$', multiplier: 1.0, decimals: false },
  EUR: { symbol: '€', multiplier: 0.92, decimals: false },
  INR: { symbol: '₹', multiplier: 75.0, decimals: false } // Custom local conversion/tariff multiplier
};

export const PricingEngine: React.FC = React.memo(() => {
  // Store selections in refs rather than React state to bypass Virtual DOM diffing.
  // This guarantees zero component re-renders when toggling settings.
  const selectedCurrency = useRef<'USD' | 'EUR' | 'INR'>('USD');
  const selectedBilling = useRef<'monthly' | 'annual'>('monthly');

  // Track previous prices to animate from old → new
  const prevPrices = useRef<Record<string, number>>({ starter: 19, pro: 49, enterprise: 149 });

  // DOM Refs for dynamic price updating
  const starterPriceRef = useRef<HTMLSpanElement>(null);
  const starterSymRef = useRef<HTMLSpanElement>(null);
  const starterTotalRef = useRef<HTMLDivElement>(null);
  const starterSavingsRef = useRef<HTMLDivElement>(null);
  const starterBarRef = useRef<HTMLDivElement>(null);

  const proPriceRef = useRef<HTMLSpanElement>(null);
  const proSymRef = useRef<HTMLSpanElement>(null);
  const proTotalRef = useRef<HTMLDivElement>(null);
  const proSavingsRef = useRef<HTMLDivElement>(null);
  const proBarRef = useRef<HTMLDivElement>(null);

  const enterprisePriceRef = useRef<HTMLSpanElement>(null);
  const enterpriseSymRef = useRef<HTMLSpanElement>(null);
  const enterpriseTotalRef = useRef<HTMLDivElement>(null);
  const enterpriseSavingsRef = useRef<HTMLDivElement>(null);
  const enterpriseBarRef = useRef<HTMLDivElement>(null);

  // Card Refs for cursor tracking spotlights
  const starterCardRef = useRef<HTMLDivElement>(null);
  const proCardRef = useRef<HTMLDivElement>(null);
  const enterpriseCardRef = useRef<HTMLDivElement>(null);

  // Selector Button Refs for direct visual state updates (avoiding state classes re-renders)
  const currencyBtns = {
    USD: useRef<HTMLButtonElement>(null),
    EUR: useRef<HTMLButtonElement>(null),
    INR: useRef<HTMLButtonElement>(null)
  };

  const billingBtns = {
    monthly: useRef<HTMLButtonElement>(null),
    annual: useRef<HTMLButtonElement>(null)
  };

  // Helper to compute raw pricing values for transitions
  const getPriceValue = (basePriceUSD: number) => {
    const curr = currencyConfig[selectedCurrency.current];
    let price = basePriceUSD * curr.multiplier;
    
    // Apply 20% discount for annual billing
    if (selectedBilling.current === 'annual') {
      price = price * 0.8;
    }
    
    return price;
  };



  // Computes annual total cost to display in subtext
  const calculateAnnualTotal = (basePriceUSD: number) => {
    const curr = currencyConfig[selectedCurrency.current];
    // Annual total = base price * 12 months * regional multiplier * 20% discount
    const total = basePriceUSD * 12 * curr.multiplier * 0.8;
    return `${curr.symbol}${Math.round(total).toLocaleString()}/yr`;
  };

  // Computes annual savings value
  const calculateSavings = (basePriceUSD: number) => {
    const curr = currencyConfig[selectedCurrency.current];
    const savings = Math.floor(basePriceUSD * 12 * curr.multiplier * 0.2);
    return `Save ${curr.symbol}${savings.toLocaleString()}/year`;
  };

  // Animated digit roller using requestAnimationFrame (450ms, ease-out cubic)
  const animatePrice = (
    element: HTMLSpanElement | null,
    start: number,
    end: number,
    decimals: boolean
  ) => {
    if (!element) return;
    const startTime = performance.now();
    const duration = 450; // ms

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic: 1 - (1 - x)^3
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      
      element.textContent = decimals ? current.toFixed(2) : Math.round(current).toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = decimals ? end.toFixed(2) : Math.round(end).toLocaleString();
      }
    };

    requestAnimationFrame(animate);
  };

  // Currency Morph transition using WAAPI
  const animateSymbolChange = (symRef: HTMLSpanElement | null, newSymbol: string) => {
    if (!symRef) return;
    if (symRef.textContent === newSymbol) return;

    // Slide up and fade out current symbol
    const fadeOut = symRef.animate([
      { opacity: 1, transform: 'translateY(0px)' },
      { opacity: 0, transform: 'translateY(-10px)' }
    ], {
      duration: 150,
      easing: 'ease-in',
      fill: 'forwards'
    });

    fadeOut.onfinish = () => {
      symRef.textContent = newSymbol;
      // Slide up from bottom and fade in new symbol
      symRef.animate([
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0px)' }
      ], {
        duration: 150,
        easing: 'ease-out',
        fill: 'forwards'
      });
    };
  };

  // Direct DOM updating sequence
  const updatePricesDOM = () => {
    const curr = currencyConfig[selectedCurrency.current];
    const isAnnual = selectedBilling.current === 'annual';

    // Calculate new target prices
    const newStarter = getPriceValue(pricingMatrix.starter.basePriceUSD);
    const newPro = getPriceValue(pricingMatrix.pro.basePriceUSD);
    const newEnterprise = getPriceValue(pricingMatrix.enterprise.basePriceUSD);

    // 1. Update Starter Card
    if (starterPriceRef.current && starterSymRef.current && starterTotalRef.current && starterSavingsRef.current && starterBarRef.current) {
      animateSymbolChange(starterSymRef.current, curr.symbol);
      animatePrice(starterPriceRef.current, prevPrices.current.starter, newStarter, curr.decimals);
      
      starterTotalRef.current.textContent = isAnnual 
        ? `Billed annually at ${calculateAnnualTotal(pricingMatrix.starter.basePriceUSD)}` 
        : 'Billed monthly';

      if (isAnnual) {
        starterSavingsRef.current.textContent = calculateSavings(pricingMatrix.starter.basePriceUSD);
        starterSavingsRef.current.className = "text-xs font-semibold text-emerald-400 font-mono mt-1 opacity-100 h-4 transition-all duration-300";
        starterBarRef.current.style.width = "100%";
      } else {
        starterSavingsRef.current.className = "text-xs font-semibold text-emerald-400 font-mono mt-1 opacity-0 h-4 transition-all duration-300";
        starterBarRef.current.style.width = "20%";
      }
    }

    // 2. Update Pro Card
    if (proPriceRef.current && proSymRef.current && proTotalRef.current && proSavingsRef.current && proBarRef.current) {
      animateSymbolChange(proSymRef.current, curr.symbol);
      animatePrice(proPriceRef.current, prevPrices.current.pro, newPro, curr.decimals);
      
      proTotalRef.current.textContent = isAnnual 
        ? `Billed annually at ${calculateAnnualTotal(pricingMatrix.pro.basePriceUSD)}` 
        : 'Billed monthly';

      if (isAnnual) {
        proSavingsRef.current.textContent = calculateSavings(pricingMatrix.pro.basePriceUSD);
        proSavingsRef.current.className = "text-xs font-semibold text-emerald-400 font-mono mt-1 opacity-100 h-4 transition-all duration-300";
        proBarRef.current.style.width = "100%";
      } else {
        proSavingsRef.current.className = "text-xs font-semibold text-emerald-400 font-mono mt-1 opacity-0 h-4 transition-all duration-300";
        proBarRef.current.style.width = "20%";
      }
    }

    // 3. Update Enterprise Card
    if (enterprisePriceRef.current && enterpriseSymRef.current && enterpriseTotalRef.current && enterpriseSavingsRef.current && enterpriseBarRef.current) {
      animateSymbolChange(enterpriseSymRef.current, curr.symbol);
      animatePrice(enterprisePriceRef.current, prevPrices.current.enterprise, newEnterprise, curr.decimals);
      
      enterpriseTotalRef.current.textContent = isAnnual 
        ? `Billed annually at ${calculateAnnualTotal(pricingMatrix.enterprise.basePriceUSD)}` 
        : 'Billed monthly';

      if (isAnnual) {
        enterpriseSavingsRef.current.textContent = calculateSavings(pricingMatrix.enterprise.basePriceUSD);
        enterpriseSavingsRef.current.className = "text-xs font-semibold text-emerald-400 font-mono mt-1 opacity-100 h-4 transition-all duration-300";
        enterpriseBarRef.current.style.width = "100%";
      } else {
        enterpriseSavingsRef.current.className = "text-xs font-semibold text-emerald-400 font-mono mt-1 opacity-0 h-4 transition-all duration-300";
        enterpriseBarRef.current.style.width = "20%";
      }
    }

    // Save current values for next transition start reference
    prevPrices.current = {
      starter: newStarter,
      pro: newPro,
      enterprise: newEnterprise
    };
  };

  // Update button visual states directly in DOM (with premium toggles styling)
  const updateButtonsDOM = () => {
    // Currency Buttons active toggle
    Object.entries(currencyBtns).forEach(([key, ref]) => {
      if (ref.current) {
        if (key === selectedCurrency.current) {
          ref.current.className = 'px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-violet-400/50 scale-[1.03] transition-all duration-200';
          ref.current.setAttribute('aria-selected', 'true');
        } else {
          ref.current.className = 'px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white border border-transparent hover:bg-white/[0.02] transition-all duration-200';
          ref.current.setAttribute('aria-selected', 'false');
        }
      }
    });

    // Billing Buttons active toggle
    Object.entries(billingBtns).forEach(([key, ref]) => {
      if (ref.current) {
        if (key === selectedBilling.current) {
          ref.current.className = 'px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-violet-400/50 scale-[1.03] transition-all duration-200';
          ref.current.setAttribute('aria-selected', 'true');
        } else {
          ref.current.className = 'px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-400 hover:text-white border border-transparent hover:bg-white/[0.02] transition-all duration-200';
          ref.current.setAttribute('aria-selected', 'false');
        }
      }
    });
  };

  const handleCurrencyChange = (curr: 'USD' | 'EUR' | 'INR') => {
    selectedCurrency.current = curr;
    updatePricesDOM();
    updateButtonsDOM();
  };

  const handleBillingChange = (bill: 'monthly' | 'annual') => {
    selectedBilling.current = bill;
    updatePricesDOM();
    updateButtonsDOM();
  };

  // Populate initial values and hover listeners on mount
  useEffect(() => {
    updatePricesDOM();
    updateButtonsDOM();

    // Mouse Move Spotlight Tracker inside individual cards
    const cards = [
      { element: starterCardRef.current },
      { element: proCardRef.current },
      { element: enterpriseCardRef.current }
    ];

    const handlers = cards.map(card => {
      if (!card.element) return null;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.element!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.element!.style.setProperty('--mouse-x', `${x}px`);
        card.element!.style.setProperty('--mouse-y', `${y}px`);
      };

      card.element!.addEventListener('mousemove', handleMouseMove, { passive: true });
      return { element: card.element, handleMouseMove };
    });

    return () => {
      handlers.forEach(h => {
        if (h) {
          h.element.removeEventListener('mousemove', h.handleMouseMove);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="pricing" className="py-28 border-t border-white/[0.02] bg-brand-bg relative z-10 overflow-hidden">
      {/* 4. Premium Background Lighting overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-950/15 blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 font-semibold mb-4 tracking-wider uppercase font-mono">
            PRICING ENGINE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Transparent, Matrix-Driven Pricing
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400">
            Choose your currency, select your billing cycle, and unlock production-grade data pipelines.
          </p>
        </div>

        {/* Dynamic Selectors Panel (No React State Changes) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 relative z-10">
          {/* Currency Toggle */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-1 rounded-xl flex items-center gap-1.5 backdrop-blur-md" role="tablist" aria-label="Select Currency">
            <button
              ref={currencyBtns.USD}
              onClick={() => handleCurrencyChange('USD')}
              role="tab"
              aria-label="Use US Dollar"
            >
              USD
            </button>
            <button
              ref={currencyBtns.EUR}
              onClick={() => handleCurrencyChange('EUR')}
              role="tab"
              aria-label="Use Euro"
            >
              EUR
            </button>
            <button
              ref={currencyBtns.INR}
              onClick={() => handleCurrencyChange('INR')}
              role="tab"
              aria-label="Use Indian Rupee"
            >
              INR
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="bg-white/[0.02] border border-white/[0.05] p-1 rounded-xl flex items-center gap-1.5 relative backdrop-blur-md" role="tablist" aria-label="Billing Cycle">
            <button
              ref={billingBtns.monthly}
              onClick={() => handleBillingChange('monthly')}
              role="tab"
              aria-label="Monthly Billing"
            >
              Monthly
            </button>
            <button
              ref={billingBtns.annual}
              onClick={() => handleBillingChange('annual')}
              role="tab"
              aria-label="Annual Billing (with 20% discount)"
              className="relative"
            >
              Annual
              {/* Dynamic Savings Badge */}
              <span className="absolute -top-3.5 -right-3 px-1.5 py-0.5 rounded-md bg-pink-500 text-[8px] font-extrabold tracking-widest text-white uppercase shadow-md animate-pulse">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch relative z-10">
          
          {/* STARTER CARD */}
          <article 
            ref={starterCardRef}
            className="glass-card p-8 flex flex-col justify-between relative group border-white/[0.04] bg-white/[0.01] hover:border-white/[0.1] hover:translate-y-[-8px] hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            {/* Spotlight hover effect background */}
            <div className="absolute inset-0 pointer-events-none z-0 transition-opacity opacity-0 group-hover:opacity-100 duration-300 bg-[radial-gradient(circle_140px_at_var(--mouse-x,-1000px)_var(--mouse-y,-1000px),rgba(124,58,237,0.06),transparent)]" />

            <div className="space-y-6 relative z-10">
              <h3 className="text-sm font-bold tracking-widest uppercase font-mono text-slate-400">{pricingMatrix.starter.name}</h3>
              
              <div className="flex items-baseline text-white">
                <span ref={starterSymRef} className="text-2xl font-bold tracking-tight mr-1 inline-block select-none">$</span>
                <span ref={starterPriceRef} className="text-5xl font-extrabold tracking-tight font-mono">19</span>
                <span className="text-slate-500 text-sm ml-2">/mo</span>
              </div>

              <div className="space-y-2">
                <div ref={starterTotalRef} className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                  Billed monthly
                </div>
                <div ref={starterSavingsRef} className="text-xs font-semibold text-emerald-400 font-mono mt-1 opacity-0 h-4 transition-all duration-300">
                  Save
                </div>
                {/* Savings Progress Bar */}
                <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <div ref={starterBarRef} className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500 ease-out" style={{ width: '20%' }} />
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.05] w-full" />
              
              <ul className="space-y-4">
                {pricingMatrix.starter.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 relative z-10">
              <button type="button" className="btn-secondary w-full text-xs py-3 cursor-pointer">
                Get Starter
              </button>
            </div>
          </article>

          {/* PRO CARD (RECOMMENDED / FEATURED) */}
          <article 
            ref={proCardRef}
            className="glass-card p-8 flex flex-col justify-between relative group border-violet-500/25 bg-violet-950/[0.03] hover:translate-y-[-8px] hover:scale-[1.02] transition-all duration-300 overflow-hidden pulse-glow-pro"
            style={{
              boxShadow: '0 0 50px rgba(124, 58, 237, 0.05)'
            }}
          >
            {/* Animated Border Beam */}
            <div className="beam" />

            {/* Spotlight hover effect background */}
            <div className="absolute inset-0 pointer-events-none z-0 transition-opacity opacity-100 bg-[radial-gradient(circle_180px_at_var(--mouse-x,50%)_var(--mouse-y,0px),rgba(124,58,237,0.12),transparent)]" />
            
            {/* Fixed Top spotlight glow with breathing effect */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,#8b5cf625,transparent_60%)] z-0 animate-breathe"/>

            {/* Popular Badge */}
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-pink-500 px-3.5 py-1.5 rounded-full text-[9px] font-extrabold tracking-widest text-white uppercase shadow-md shadow-violet-500/20 z-20">
              Most Popular
            </div>

            <div className="space-y-6 relative z-10">
              <h3 className="text-sm font-bold tracking-widest uppercase font-mono text-violet-400">{pricingMatrix.pro.name}</h3>
              
              <div className="flex items-baseline text-white">
                <span ref={proSymRef} className="text-2xl font-bold tracking-tight mr-1 inline-block select-none">$</span>
                <span ref={proPriceRef} className="text-5xl font-extrabold tracking-tight font-mono text-gradient-purple-pink">49</span>
                <span className="text-slate-500 text-sm ml-2">/mo</span>
              </div>

              <div className="space-y-2">
                <div ref={proTotalRef} className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                  Billed monthly
                </div>
                <div ref={proSavingsRef} className="text-xs font-semibold text-emerald-400 font-mono mt-1 opacity-0 h-4 transition-all duration-300">
                  Save
                </div>
                {/* Savings Progress Bar */}
                <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <div ref={proBarRef} className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500 ease-out" style={{ width: '20%' }} />
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.05] w-full" />
              
              <ul className="space-y-4">
                {pricingMatrix.pro.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={idx < 2 ? "text-white font-bold" : ""}>
                      {feat}
                      {idx === 0 && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-violet-600/30 text-[8px] text-violet-300 border border-violet-500/30 uppercase tracking-widest font-mono">
                          Best Value
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 relative z-10">
              <button type="button" className="btn-primary w-full text-xs py-3 shadow-lg shadow-violet-500/20 cursor-pointer">
                Get Pro Trial
              </button>
            </div>
          </article>

          {/* ENTERPRISE CARD */}
          <article 
            ref={enterpriseCardRef}
            className="glass-card p-8 flex flex-col justify-between relative group border-white/[0.04] bg-white/[0.01] hover:border-white/[0.1] hover:translate-y-[-8px] hover:scale-[1.02] transition-all duration-300 overflow-hidden"
          >
            {/* Spotlight hover effect background */}
            <div className="absolute inset-0 pointer-events-none z-0 transition-opacity opacity-0 group-hover:opacity-100 duration-300 bg-[radial-gradient(circle_140px_at_var(--mouse-x,-1000px)_var(--mouse-y,-1000px),rgba(124,58,237,0.06),transparent)]" />

            <div className="space-y-6 relative z-10">
              <h3 className="text-sm font-bold tracking-widest uppercase font-mono text-slate-400">{pricingMatrix.enterprise.name}</h3>
              
              <div className="flex items-baseline text-white">
                <span ref={enterpriseSymRef} className="text-2xl font-bold tracking-tight mr-1 inline-block select-none">$</span>
                <span ref={enterprisePriceRef} className="text-5xl font-extrabold tracking-tight font-mono">149</span>
                <span className="text-slate-500 text-sm ml-2">/mo</span>
              </div>

              <div className="space-y-2">
                <div ref={enterpriseTotalRef} className="text-[10px] font-mono text-slate-500 font-semibold uppercase tracking-wider">
                  Billed monthly
                </div>
                <div ref={enterpriseSavingsRef} className="text-xs font-semibold text-emerald-400 font-mono mt-1 opacity-0 h-4 transition-all duration-300">
                  Save
                </div>
                {/* Savings Progress Bar */}
                <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <div ref={enterpriseBarRef} className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500 ease-out" style={{ width: '20%' }} />
                </div>
              </div>

              <div className="h-[1px] bg-white/[0.05] w-full" />
              
              <ul className="space-y-4">
                {pricingMatrix.enterprise.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 relative z-10">
              <button type="button" className="btn-secondary w-full text-xs py-3 cursor-pointer">
                Contact Sales
              </button>
            </div>
          </article>

        </div>

      </div>
    </section>
  );
});

PricingEngine.displayName = 'PricingEngine';
