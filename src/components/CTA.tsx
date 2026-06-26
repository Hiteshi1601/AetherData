import React from 'react';

export const CTA: React.FC = React.memo(() => {
  return (
    <section id="cta" className="py-24 border-t border-white/[0.03] bg-brand-bg relative z-10 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/10 blur-[90px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card p-12 text-center relative border-violet-500/20 shadow-[0_0_60px_rgba(124,58,237,0.08)]">
          {/* Inner Light Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-pink-500/5 rounded-2xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Accelerate Your Pipelines Today
          </h2>
          
          <p className="max-w-xl mx-auto text-slate-400 mb-10 text-base leading-relaxed">
            Join the elite teams who automate transactional data streams in real-time. Setup a workflow in minutes, scale to billions of messages instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your work email"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              aria-label="Work Email Address"
            />
            <button 
              type="button"
              className="btn-primary w-full sm:w-auto shadow-lg shadow-violet-500/20 text-sm whitespace-nowrap"
            >
              Get Started Free
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            No credit card required. 14-day free trial on Pro features.
          </p>
        </div>
      </div>
    </section>
  );
});

CTA.displayName = 'CTA';
