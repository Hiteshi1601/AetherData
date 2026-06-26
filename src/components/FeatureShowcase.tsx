import React, { useState, useEffect } from 'react';

interface PayloadSample {
  name: string;
  raw: string;
  processed: Array<{ key: string; value: string; type: string; confidence: string }>;
}

const samples: Record<string, PayloadSample> = {
  ecommerce: {
    name: 'E-commerce Purchase',
    raw: `{
  "event": "order_completed",
  "data": {
    "id": "ord_91823",
    "total_inr": 1499.00,
    "user": {
      "name": "Arjun Patel",
      "loc": "Mumbai"
    }
  }
}`,
    processed: [
      { key: 'event_type', value: 'ORDER_COMPLETED', type: 'String', confidence: '99.9%' },
      { key: 'order_id', value: 'ord_91823', type: 'UUID', confidence: '100%' },
      { key: 'amount_usd', value: '$17.99', type: 'Float64', confidence: '99.8%' },
      { key: 'customer_name', value: 'Arjun Patel', type: 'String', confidence: '100%' },
      { key: 'city_code', value: 'BOM', type: 'Enum', confidence: '98.5%' }
    ]
  },
  apilog: {
    name: 'Server API Log',
    raw: `[2026-06-26 14:18] 
INFO request_path="/v1/data/sync" 
ip="192.168.1.45" 
duration_ms=45.2 
status=200`,
    processed: [
      { key: 'timestamp', value: '2026-06-26T08:48:00Z', type: 'DateTime', confidence: '100%' },
      { key: 'endpoint', value: '/v1/data/sync', type: 'String', confidence: '99.9%' },
      { key: 'client_ip', value: '192.168.1.45', type: 'IPv4', confidence: '100%' },
      { key: 'latency', value: '45.2ms', type: 'Duration', confidence: '99.9%' },
      { key: 'status_code', value: '200 OK', type: 'Enum', confidence: '100%' }
    ]
  },
  profile: {
    name: 'User Survey Data',
    raw: `user_input="Love the tool! 
Working as a Lead Engineer 
at SyncFlow since Jan 2024. 
- Sarah"`,
    processed: [
      { key: 'sentiment', value: 'POSITIVE (0.97)', type: 'Float', confidence: '97.2%' },
      { key: 'job_title', value: 'Lead Engineer', type: 'String', confidence: '99.5%' },
      { key: 'company', value: 'SyncFlow', type: 'String', confidence: '99.1%' },
      { key: 'tenure_months', value: '29 months', type: 'Int32', confidence: '94.8%' },
      { key: 'first_name', value: 'Sarah', type: 'String', confidence: '100%' }
    ]
  }
};

export const FeatureShowcase: React.FC = React.memo(() => {
  const [selectedKey, setSelectedKey] = useState<string>('ecommerce');
  const [step, setStep] = useState<'idle' | 'parsing' | 'structuring' | 'done'>('done');

  const selectedSample = samples[selectedKey];

  const handleSelectSample = (key: string) => {
    if (key === selectedKey) return;
    setSelectedKey(key);
    setStep('parsing');
  };

  useEffect(() => {
    if (step === 'parsing') {
      const t1 = setTimeout(() => setStep('structuring'), 600);
      return () => clearTimeout(t1);
    } else if (step === 'structuring') {
      const t2 = setTimeout(() => setStep('done'), 800);
      return () => clearTimeout(t2);
    }
  }, [step]);

  return (
    <section id="features" className="py-24 bg-brand-bg relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            AI-Powered Automation in Real-Time
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400">
            Feed raw unstructured text, logs, or JSON payloads. Aether's contextual reasoning models automatically restructure and normalize them on-the-fly.
          </p>
        </div>

        {/* Interactive App Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Input Panel */}
          <div className="lg:col-span-5 flex flex-col glass-card p-6 overflow-hidden">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
              1. Input Raw Data Stream
            </h3>
            
            {/* Tabs */}
            <div className="flex gap-2 mb-4" role="tablist" aria-label="Sample data streams">
              {Object.entries(samples).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => handleSelectSample(key)}
                  role="tab"
                  aria-selected={selectedKey === key}
                  tabIndex={0}
                  className={`flex-1 text-xs py-2 px-3 rounded-lg border font-medium transition-all duration-300 ${
                    selectedKey === key
                      ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                      : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Code Terminal View */}
            <div className="flex-1 bg-brand-bg/50 border border-white/[0.05] rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto min-h-[180px] flex flex-col justify-between">
              <pre className="whitespace-pre-wrap leading-relaxed">{selectedSample.raw}</pre>
              <div className="mt-4 pt-3 border-t border-white/[0.03] text-[10px] text-slate-500 flex justify-between">
                <span>UTF-8 ENCODING</span>
                <span>STATUS: ACTIVE RECEIVING</span>
              </div>
            </div>
          </div>

          {/* Middle Column: Processing Flow */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col items-center justify-center gap-6 py-4 lg:py-0">
            {/* Visual connecting dots and animations */}
            <div className="hidden lg:block relative h-full w-[2px] bg-white/[0.05]">
              <div 
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-violet-500 transition-all duration-1000 blur-sm ${
                  step === 'parsing' ? 'translate-y-[60px] opacity-100 scale-125' : 
                  step === 'structuring' ? 'translate-y-[180px] opacity-100 scale-125' : 
                  'translate-y-[260px] opacity-0 scale-75'
                }`} 
              />
            </div>

            {/* Stage Indicators */}
            <div className="flex flex-row lg:flex-col justify-around w-full gap-4">
              <div className="flex items-center gap-2 lg:justify-center">
                <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  step === 'parsing' ? 'bg-amber-400 animate-ping' : step === 'structuring' || step === 'done' ? 'bg-violet-500' : 'bg-slate-600'
                }`} />
                <span className="text-xs font-mono text-slate-400">Parse</span>
              </div>

              <div className="flex items-center gap-2 lg:justify-center">
                <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  step === 'structuring' ? 'bg-cyan-400 animate-ping' : step === 'done' ? 'bg-violet-500' : 'bg-slate-600'
                }`} />
                <span className="text-xs font-mono text-slate-400">Struct</span>
              </div>

              <div className="flex items-center gap-2 lg:justify-center">
                <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  step === 'done' ? 'bg-emerald-500' : 'bg-slate-600'
                }`} />
                <span className="text-xs font-mono text-slate-400">Load</span>
              </div>
            </div>
          </div>

          {/* Right Column: Schema Output */}
          <div className="lg:col-span-5 flex flex-col glass-card p-6 overflow-hidden relative">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
              2. Structured Analytics Output
            </h3>

            {step !== 'done' ? (
              // Loading/Transition Animation overlay
              <div className="flex-1 flex flex-col items-center justify-center min-h-[220px] bg-brand-bg/30 border border-white/[0.05] rounded-xl backdrop-blur-sm">
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                </div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest animate-pulse">
                  {step === 'parsing' ? 'AI Normalizing Payload...' : 'Mapping Type Schemas...'}
                </span>
              </div>
            ) : (
              // Clean Structured Table
              <div className="flex-1 bg-brand-bg/50 border border-white/[0.05] rounded-xl overflow-hidden min-h-[220px] flex flex-col">
                <div className="grid grid-cols-12 gap-2 bg-white/[0.02] border-b border-white/[0.05] px-4 py-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                  <span className="col-span-4">Field Name</span>
                  <span className="col-span-4">Value</span>
                  <span className="col-span-2 text-center">Type</span>
                  <span className="col-span-2 text-right">Model Conf</span>
                </div>
                
                <div className="flex-1 divide-y divide-white/[0.03] overflow-y-auto">
                  {selectedSample.processed.map((row, idx) => (
                    <div 
                      key={idx}
                      className="grid grid-cols-12 gap-2 px-4 py-3 text-xs items-center hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="col-span-4 font-mono font-semibold text-slate-300">{row.key}</span>
                      <span className="col-span-4 font-mono text-violet-300 truncate">{row.value}</span>
                      <span className="col-span-2 text-center font-mono text-[10px]">
                        <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-white/[0.05]">
                          {row.type}
                        </span>
                      </span>
                      <span className="col-span-2 text-right font-mono font-medium text-emerald-400">{row.confidence}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

FeatureShowcase.displayName = 'FeatureShowcase';
