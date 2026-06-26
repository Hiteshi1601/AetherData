import React, { useEffect, useRef } from 'react';

interface MetricItem {
  id: string;
  target: number;
  suffix: string;
  label: string;
  decimals: boolean;
  desc: string;
}

const metricsList: MetricItem[] = [
  {
    id: 'workflows',
    target: 50,
    suffix: 'M+',
    label: 'Automated Workflows',
    decimals: false,
    desc: 'Ingested, parsed, and routed globally',
  },
  {
    id: 'teams',
    target: 500,
    suffix: '+',
    label: 'Enterprise Teams',
    decimals: false,
    desc: 'Scaling infrastructure on Aether Core',
  },
  {
    id: 'accuracy',
    target: 99.98,
    suffix: '%',
    label: 'Automation Accuracy',
    decimals: true,
    desc: 'Contextual reasoning models accuracy rate',
  },
  {
    id: 'latency',
    target: 24,
    suffix: 'ms',
    label: 'Average Response Time',
    decimals: false,
    desc: 'Average regional payload synchronization SLA',
  },
];

export const MetricsPanel: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // DOM refs to update numbers directly
  const numberRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounting();
            observer.disconnect(); // Only run once
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const startCounting = () => {
      const duration = 1600; // ms
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Cubic ease-out curve
        const ease = 1 - Math.pow(1 - progress, 3);

        metricsList.forEach((metric) => {
          const el = numberRefs.current[metric.id];
          if (!el) return;

          const current = metric.target * ease;
          if (metric.decimals) {
            el.textContent = current.toFixed(2);
          } else {
            el.textContent = Math.round(current).toString();
          }
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Guarantee final values are exact
          metricsList.forEach((metric) => {
            const el = numberRefs.current[metric.id];
            if (el) {
              el.textContent = metric.decimals ? metric.target.toFixed(2) : metric.target.toString();
            }
          });
        }
      };

      requestAnimationFrame(animate);
    };

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-20 relative z-10 bg-[#02000b] border-t border-white/[0.02]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsList.map((metric) => (
            <div
              key={metric.id}
              className="relative rounded-2xl glass-card bg-white/[0.01] border border-white/[0.04] p-6 text-center hover:border-white/[0.1] hover:bg-white/[0.02] transition-all duration-300 group overflow-hidden"
              style={{ boxShadow: '0 10px 40px -15px rgba(0, 0, 0, 0.6)' }}
            >
              {/* Card Spotlight background glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.06),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Neon border beam overlay */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent opacity-50" />

              <div className="relative z-10">
                {/* Number display */}
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2 flex items-baseline justify-center">
                  <span
                    ref={(el) => {
                      numberRefs.current[metric.id] = el;
                    }}
                    className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-200"
                  >
                    0
                  </span>
                  <span className="text-violet-400 font-bold ml-0.5">{metric.suffix}</span>
                </div>

                {/* Metric Label */}
                <div className="text-sm font-bold text-slate-300 mb-1 font-sans">
                  {metric.label}
                </div>

                {/* Subtext description */}
                <div className="text-xs text-slate-500 font-sans leading-relaxed">
                  {metric.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
});

MetricsPanel.displayName = 'MetricsPanel';
