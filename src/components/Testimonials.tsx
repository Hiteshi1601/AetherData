import React from 'react';

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  metric: string;
  metricLabel: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Lead Architect',
    company: 'SyncFlow',
    quote: "Integrating AetherData cut our pipeline maintenance overhead to absolute zero. The AI agents autonomously adapt to raw API contract changes without a single line of repair code.",
    metric: '99% Less',
    metricLabel: 'Pipeline Maintenance'
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'VP of Data Platforms',
    company: 'Vortex Inc.',
    quote: "We sync millions of rows of international ecommerce transactions. The multi-currency normalization engine handles complex exchange conversions with mathematical precision.",
    metric: '$40M+',
    metricLabel: 'Transacted / mo'
  },
  {
    id: 3,
    name: 'Vikram Mehta',
    role: 'Principal Engineer',
    company: 'ApexTech',
    quote: "The visual workflow canvas makes outlining complex processing logical. We went from raw unstructured text fields to production analytics tables in less than three minutes.",
    metric: '18x Faster',
    metricLabel: 'Time-to-Production'
  }
];

export const Testimonials: React.FC = React.memo(() => {
  return (
    <section id="testimonials" className="py-24 border-t border-white/[0.03] bg-brand-bg/50 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Validated by Elite Data Teams
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400">
            See how scaling engineering departments utilize Aether to handle massive pipeline ingestion.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <article 
              key={test.id}
              className="glass-card p-8 flex flex-col justify-between hover:bg-white/[0.03] hover:border-white/[0.08] transition-all"
            >
              <div className="space-y-6">
                {/* Metric Accent */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-2xl font-extrabold text-gradient-cyan-purple tracking-tight">
                    {test.metric}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {test.metricLabel}
                  </span>
                </div>
                
                {/* Quote */}
                <blockquote className="text-slate-300 text-sm leading-relaxed italic">
                  "{test.quote}"
                </blockquote>
              </div>

              {/* User Bio */}
              <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-white/[0.03]">
                {/* Custom Vector Avatar Icon */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {test.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">{test.name}</h4>
                  <p className="text-[10px] text-slate-400">
                    {test.role} &middot; <span className="font-semibold text-violet-400">{test.company}</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
});

Testimonials.displayName = 'Testimonials';
