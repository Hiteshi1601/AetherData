import React from 'react';

const companies = [
  {
    name: 'ApexTech',
    logo: (
      <svg className="h-7 w-auto text-slate-500 hover:text-slate-300 transition-colors" viewBox="0 0 120 30" fill="currentColor">
        <path d="M10 20 L20 5 L30 20 Z" stroke="currentColor" strokeWidth="4" fill="none" />
        <text x="40" y="21" fontSize="16" fontWeight="bold">APEX</text>
      </svg>
    )
  },
  {
    name: 'Vortex',
    logo: (
      <svg className="h-7 w-auto text-slate-500 hover:text-slate-300 transition-colors" viewBox="0 0 120 30" fill="currentColor">
        <circle cx="18" cy="15" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="18" cy="15" r="4" fill="currentColor" />
        <text x="38" y="21" fontSize="16" fontWeight="bold">VORTEX</text>
      </svg>
    )
  },
  {
    name: 'Quantico',
    logo: (
      <svg className="h-7 w-auto text-slate-500 hover:text-slate-300 transition-colors" viewBox="0 0 130 30" fill="currentColor">
        <rect x="5" y="5" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="3" fill="none" />
        <line x1="5" y1="15" x2="25" y2="15" stroke="currentColor" strokeWidth="3" />
        <text x="35" y="21" fontSize="16" fontWeight="bold">QUANT</text>
      </svg>
    )
  },
  {
    name: 'SyncFlow',
    logo: (
      <svg className="h-7 w-auto text-slate-500 hover:text-slate-300 transition-colors" viewBox="0 0 130 30" fill="currentColor">
        <path d="M5 15 C 10 5, 20 25, 25 15" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="5" cy="15" r="3" />
        <circle cx="25" cy="15" r="3" />
        <text x="35" y="21" fontSize="16" fontWeight="bold">SYNCFLOW</text>
      </svg>
    )
  },
  {
    name: 'OmniData',
    logo: (
      <svg className="h-7 w-auto text-slate-500 hover:text-slate-300 transition-colors" viewBox="0 0 130 30" fill="currentColor">
        <polygon points="15,5 25,25 5,25" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="15" cy="17" r="3" />
        <text x="38" y="21" fontSize="16" fontWeight="bold">OMNI</text>
      </svg>
    )
  },
  {
    name: 'Capsule',
    logo: (
      <svg className="h-7 w-auto text-slate-500 hover:text-slate-300 transition-colors" viewBox="0 0 130 30" fill="currentColor">
        <rect x="5" y="8" width="22" height="14" rx="7" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="11" cy="15" r="3" />
        <text x="36" y="21" fontSize="16" fontWeight="bold">CAPSULE</text>
      </svg>
    )
  }
];

export const TrustedBy: React.FC = React.memo(() => {
  return (
    <section className="py-12 border-y border-white/[0.03] bg-brand-bg/20 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-center text-xs font-semibold tracking-widest text-slate-500 uppercase">
          Trusted by high-growth engineering teams worldwide
        </p>
      </div>

      <div className="marquee-container w-full">
        {/* We double the array content for seamless infinite marquee loop */}
        <div className="marquee-content animate-marquee">
          {companies.map((company, index) => (
            <div key={`logo-1-${index}`} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
              {company.logo}
            </div>
          ))}
        </div>
        <div className="marquee-content animate-marquee" aria-hidden="true">
          {companies.map((company, index) => (
            <div key={`logo-2-${index}`} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300">
              {company.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

TrustedBy.displayName = 'TrustedBy';
