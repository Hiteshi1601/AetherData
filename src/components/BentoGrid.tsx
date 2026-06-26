import React, { useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface FeatureItem {
  id: number;
  title: string;
  badge: string;
  description: string;
  visual: React.ReactNode;
  gridClass: string;
  extraContent: React.ReactNode;
}

export const BentoGrid: React.FC = React.memo(() => {
  const isMobile = useBreakpoint(768);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features: FeatureItem[] = [
    {
      id: 0,
      title: 'Multi-Agent Pipeline Orchestration',
      badge: 'Orchestrator',
      description: 'Spin up autonomous data agents that coordinate to fetch, validate, transform, and push data across your systems with complete trace visibility.',
      gridClass: 'md:col-span-2 md:row-span-1',
      extraContent: (
        <>
          <div className="flex items-center justify-between text-violet-400 font-bold uppercase tracking-wider">
            <span>Agent Console</span>
            <span className="text-emerald-400">Active</span>
          </div>
          <div className="text-slate-500 mt-1 space-y-0.5">
            <p>&middot; [AGENT_01] Polling Stripe webhook queue...</p>
            <p>&middot; [AGENT_02] Verifying schema compliance... SUCCESS</p>
          </div>
        </>
      ),
      visual: (
        <div className="relative w-full h-full min-h-[160px] flex items-center justify-center bg-violet-950/15 rounded-xl border border-white/[0.03] overflow-hidden p-4">
          <div className="absolute inset-0 bg-grid-bg opacity-30" />
          
          <div className="relative flex items-center gap-6 sm:gap-12 z-10">
            {/* Node 1: Ingestion Chip */}
            <div className="relative group/node">
              <div className="w-14 h-14 rounded-2xl bg-[#090524] border border-violet-500/40 flex flex-col items-center justify-center text-violet-300 shadow-[0_0_15px_rgba(124,58,237,0.15)] relative overflow-hidden group-hover/node:scale-110 transition-all duration-300">
                {/* Micro pins on sides */}
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-violet-400/50 flex flex-col justify-between py-1"><span className="h-[2px] w-full bg-violet-400" /><span className="h-[2px] w-full bg-violet-400" /><span className="h-[2px] w-full bg-violet-400" /></div>
                <div className="absolute right-0 top-1/4 bottom-1/4 w-[2px] bg-violet-400/50 flex flex-col justify-between py-1"><span className="h-[2px] w-full bg-violet-400" /><span className="h-[2px] w-full bg-violet-400" /><span className="h-[2px] w-full bg-violet-400" /></div>
                <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-violet-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            
            {/* Connection Line 1 */}
            <div className="flex flex-col gap-1.5 items-center">
              <div className="h-[2.5px] w-12 sm:w-20 bg-gradient-to-r from-violet-500 to-cyan-400 relative overflow-hidden rounded-full">
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-white/80 blur-[2px] animate-[ping_1.5s_infinite]" />
              </div>
              <span className="text-[8px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 border border-cyan-800/40 rounded tracking-widest font-semibold uppercase">Ingest</span>
            </div>

            {/* Node 2: Logic Core */}
            <div className="relative group/node">
              <div className="w-14 h-14 rounded-2xl bg-[#090524] border border-cyan-500/40 flex flex-col items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden group-hover/node:scale-110 transition-all duration-300">
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-cyan-400/50 flex flex-col justify-between py-1"><span className="h-[2px] w-full bg-cyan-400" /><span className="h-[2px] w-full bg-cyan-400" /><span className="h-[2px] w-full bg-cyan-400" /></div>
                <div className="absolute right-0 top-1/4 bottom-1/4 w-[2px] bg-cyan-400/50 flex flex-col justify-between py-1"><span className="h-[2px] w-full bg-cyan-400" /><span className="h-[2px] w-full bg-cyan-400" /><span className="h-[2px] w-full bg-cyan-400" /></div>
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-cyan-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Connection Line 2 */}
            <div className="flex flex-col gap-1.5 items-center">
              <div className="h-[2.5px] w-12 sm:w-20 bg-gradient-to-r from-cyan-500 to-pink-400 relative overflow-hidden rounded-full">
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-white/80 blur-[2px] animate-[ping_1.5s_infinite]" style={{ animationDelay: '-0.7s' }} />
              </div>
              <span className="text-[8px] font-mono text-pink-400 bg-pink-950/40 px-1.5 py-0.5 border border-pink-800/40 rounded tracking-widest font-semibold uppercase">Route</span>
            </div>

            {/* Node 3: Outbox Sync */}
            <div className="relative group/node">
              <div className="w-14 h-14 rounded-2xl bg-[#090524] border border-pink-500/40 flex flex-col items-center justify-center text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.15)] relative overflow-hidden group-hover/node:scale-110 transition-all duration-300">
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-pink-400/50 flex flex-col justify-between py-1"><span className="h-[2px] w-full bg-pink-400" /><span className="h-[2px] w-full bg-pink-400" /><span className="h-[2px] w-full bg-pink-400" /></div>
                <div className="absolute right-0 top-1/4 bottom-1/4 w-[2px] bg-pink-400/50 flex flex-col justify-between py-1"><span className="h-[2px] w-full bg-pink-400" /><span className="h-[2px] w-full bg-pink-400" /><span className="h-[2px] w-full bg-pink-400" /></div>
                <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-pink-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: 'Advanced API Logs Ingestion',
      badge: 'Real-time Ingestion',
      description: 'Stream directly from Webhooks, Kafka, or REST endpoints. Real-time formatting maps nested data automatically.',
      gridClass: 'md:col-span-1 md:row-span-1',
      extraContent: (
        <>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-violet-400 font-bold uppercase">Flow Health</span>
            <span className="text-emerald-400 font-bold">100.0%</span>
          </div>
          <div className="flex justify-between text-slate-500 mt-1">
            <span>PPS: 14.8k / s</span>
            <span>Latency: 0.01ms</span>
          </div>
        </>
      ),
      visual: (
        <div className="w-full h-full min-h-[160px] bg-[#030010] border border-white/[0.03] rounded-xl p-3 font-mono text-[9px] text-slate-400 overflow-hidden flex flex-col justify-between shadow-inner">
          
          {/* Mock IDE Header tabs */}
          <div className="flex items-center gap-1 border-b border-white/[0.05] pb-1.5 mb-2 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            <div className="bg-white/[0.04] border border-white/[0.08] px-1.5 py-0.5 rounded text-[8px] text-violet-300 font-mono flex items-center gap-1 ml-2 font-semibold">
              <span className="h-1 w-1 bg-violet-400 rounded-full" />
              sync_agent.rs
            </div>
            <div className="px-1.5 py-0.5 rounded text-[8px] text-slate-600 font-mono">
              webhook.json
            </div>
          </div>

          <div className="flex gap-2 flex-1 relative overflow-hidden">
            {/* Sidebar Folder Explorer (Left) */}
            <div className="w-10 border-r border-white/[0.04] pr-1.5 font-mono text-[7px] text-slate-600 space-y-0.5 select-none hidden sm:block">
              <p className="text-violet-400/80">📁 src/</p>
              <p className="pl-1">📄 main.rs</p>
              <p className="pl-1 text-violet-300">📄 sync.rs</p>
              <p className="pl-1">📄 test.rs</p>
              <p className="text-slate-700">📁 target/</p>
            </div>

            {/* Scrollable code text */}
            <div className="flex-1 space-y-1 relative h-20 overflow-hidden text-left pl-1">
              <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-[#030010] via-transparent to-[#030010] pointer-events-none z-10" />
              <div className="space-y-0.5 transition-transform duration-[8000ms] ease-in-out group-hover:-translate-y-12">
                <div className="flex justify-between text-violet-400 border-b border-white/[0.03] pb-0.5">
                  <span>GET /v1/webhook</span>
                  <span className="text-emerald-400">200 OK</span>
                </div>
                <p className="text-slate-500">// Payload stream</p>
                <p>{"{\"userId\": 88102, \"ref\": \"aff_32\"}"}</p>
                <p className="text-cyan-400">user_id &rarr; INT64</p>
                <p className="text-violet-400 border-b border-white/[0.03] pb-0.5 mt-2">POST /v2/sync</p>
                <p className="text-slate-500">// Mapping results</p>
                <p className="text-pink-400">amount_inr &rarr; FLOAT64</p>
                <p className="text-emerald-400">status &rarr; ENUM (ACTIVE)</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 p-1.5 rounded text-center text-[9px] font-bold tracking-wider uppercase transition-colors group-hover:bg-emerald-500 group-hover:text-black mt-2 font-mono">
            Stream Connected
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Dynamic Multi-Currency Parser',
      badge: 'Currency Engine',
      description: 'Automatically normalizes foreign exchanges. Resolves regional pricing rules and currency conversion factors on-the-fly.',
      gridClass: 'md:col-span-1 md:row-span-1',
      extraContent: (
        <>
          <div className="flex justify-between text-[10px]">
            <span className="text-violet-400 font-bold uppercase">Exchange Status</span>
            <span className="text-emerald-400 font-bold">Stable</span>
          </div>
          <div className="flex justify-between text-slate-500 mt-1">
            <span>USD &rarr; INR: 83.45</span>
            <span>EUR &rarr; INR: 89.20</span>
          </div>
        </>
      ),
      visual: (
        <div className="w-full h-full min-h-[160px] flex flex-col justify-center items-center bg-violet-950/10 border border-white/[0.03] rounded-xl p-4 relative overflow-hidden group/ex">
          {/* Subtle line graph path in background */}
          <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
            <svg className="w-full h-16 stroke-violet-500" fill="none" viewBox="0 0 100 30">
              <path d="M0,25 Q15,10 30,22 T60,5 T90,28 L100,10" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="absolute inset-0 bg-grid-bg opacity-10" />
          
          <div className="flex items-center gap-3.5 mb-3 z-10">
            {/* Dollar Token */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-card to-white/[0.04] border border-white/[0.08] flex items-center justify-center font-bold text-white text-base shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-transform group-hover/ex:-translate-x-1 group-hover/ex:scale-105 select-none">
              $
            </div>
            {/* Spinning exchange arrows on card hover */}
            <div className="p-1 bg-violet-600/10 border border-violet-500/20 rounded-lg">
              <svg className="w-4 h-4 text-violet-400 transition-transform duration-700 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            {/* Rupee Token */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-card to-violet-950/40 border border-violet-500/40 flex items-center justify-center font-bold text-violet-300 text-base shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-transform group-hover/ex:translate-x-1 group-hover/ex:scale-105 select-none">
              ₹
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-500 text-center z-10 font-medium">
            Real-time Exchange Sync Active
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Visual Workflow Builder',
      badge: 'Visual Editor',
      description: 'Arrange filters, API targets, and alert actions in our drag-and-drop workspace. Code-free setup, production-ready execution.',
      gridClass: 'md:col-span-2 md:row-span-1',
      extraContent: (
        <>
          <div className="flex justify-between text-[10px]">
            <span className="text-violet-400 font-bold uppercase">Active Blocks</span>
            <span className="text-violet-300">4 Operational</span>
          </div>
          <div className="text-slate-500 mt-1 flex gap-4">
            <span>[✓] Slack Alerts</span>
            <span>[✓] Ingestion Hook</span>
            <span>[✓] Ledger Sync</span>
          </div>
        </>
      ),
      visual: (
        <div className="relative w-full h-full min-h-[160px] bg-violet-950/20 border border-white/[0.03] rounded-xl overflow-hidden p-4 flex flex-col justify-between">
          <div className="absolute inset-0 bg-grid-bg opacity-30" />
          
          <div className="relative z-10 flex items-center justify-between w-full h-full my-auto px-4">
            {/* Block 1 */}
            <div className="bg-brand-card border border-white/[0.08] p-3 rounded-xl text-center shadow-lg relative group-hover:scale-105 transition-transform">
              {/* Input & Output Ports */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-400 translate-x-1/2 border border-brand-bg" />
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Source</span>
              <span className="text-[10px] font-bold text-white block mt-0.5">Webhook</span>
            </div>

            {/* Connecting Flow SVG */}
            <svg className="w-16 h-8 overflow-visible" viewBox="0 0 60 20" fill="none">
              <line 
                x1="0" y1="10" x2="60" y2="10" 
                stroke="url(#flow-gradient)" 
                strokeWidth="2.5" 
                className="animate-dash-flow"
              />
              <defs>
                <linearGradient id="flow-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Block 2 */}
            <div className="bg-violet-950/40 border border-violet-500/40 p-3 rounded-xl text-center shadow-lg relative group-hover:scale-105 transition-transform">
              {/* Input & Output Ports */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-violet-400 -translate-x-1/2 border border-brand-bg" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 translate-x-1/2 border border-brand-bg" />
              <span className="text-[8px] font-mono text-violet-400 uppercase tracking-widest block font-bold">Filter</span>
              <span className="text-[10px] font-bold text-violet-300 block mt-0.5">amount &gt; 500</span>
            </div>

            {/* Connecting Flow SVG 2 */}
            <svg className="w-16 h-8 overflow-visible" viewBox="0 0 60 20" fill="none">
              <line 
                x1="0" y1="10" x2="60" y2="10" 
                stroke="url(#flow-gradient-2)" 
                strokeWidth="2.5" 
                className="animate-dash-flow"
              />
              <defs>
                <linearGradient id="flow-gradient-2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Block 3 */}
            <div className="bg-brand-card border border-white/[0.08] p-3 rounded-xl text-center shadow-lg relative group-hover:scale-105 transition-transform">
              {/* Input Ports */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 -translate-x-1/2 border border-brand-bg" />
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Action</span>
              <span className="text-[10px] font-bold text-white block mt-0.5">Slack Notify</span>
            </div>
          </div>

          <div className="relative z-10 flex justify-between items-center text-[9px] text-slate-500 pt-2 border-t border-white/[0.03] font-mono">
            <span>FLOW_CANVAS_CONFIG</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
              Active
            </span>
          </div>
        </div>
      )
    }
  ];

  const handleMouseEnter = (idx: number) => {
    setHoveredIndex(idx);
    setActiveIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section className="py-24 border-t border-white/[0.02] relative z-10 overflow-hidden bg-[#030012]">
      {/* Self-contained styling for animated workflow line streams */}
      <style>{`
        @keyframes dash-flow {
          to {
            stroke-dashoffset: -12;
          }
        }
        .animate-dash-flow {
          stroke-dasharray: 4 2;
          animation: dash-flow 0.8s linear infinite;
        }
      `}</style>

      {/* Shifts grid lines in background based on hovered card */}
      <div 
        className="absolute inset-0 grid-bg opacity-30 mix-blend-overlay transition-transform duration-700 ease-out pointer-events-none" 
        style={{
          transform: hoveredIndex !== null 
            ? `translate3d(${(hoveredIndex % 2 === 0 ? 8 : -8)}px, ${(hoveredIndex > 1 ? 8 : -8)}px, 0)` 
            : 'translate3d(0, 0, 0)',
          willChange: 'transform'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 font-semibold mb-4 tracking-wider uppercase font-mono">
            FEATURE CORE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Unified Feature Matrix
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400">
            Everything your engineering team needs to configure, monitor, and scale real-time data automations.
          </p>
        </div>

        {isMobile ? (
          /* MOBILE VIEW: ACCORDION */
          <div className="space-y-4" role="tablist" aria-label="Accordion Features">
            {features.map((feature, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div 
                  key={feature.id} 
                  className={`glass-card transition-all duration-300 overflow-hidden ${
                    isActive ? 'bg-white/[0.04] border-white/[0.1] shadow-lg' : 'bg-white/[0.01]'
                  }`}
                >
                  <button
                    onClick={() => setActiveIndex(idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
                    aria-expanded={isActive}
                    aria-controls={`accordion-panel-${idx}`}
                    id={`accordion-tab-${idx}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">{feature.badge}</span>
                      <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isActive ? 'rotate-180 text-violet-400' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    id={`accordion-panel-${idx}`}
                    role="region"
                    aria-labelledby={`accordion-tab-${idx}`}
                    className={`grid transition-all duration-300 ease-in-out ${
                      isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/[0.03]">
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {feature.description}
                        </p>
                        {feature.visual}
                        <div className="mt-3 text-[10px] font-mono border-t border-white/[0.04] pt-3 flex flex-col gap-1">
                          {feature.extraContent}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* DESKTOP VIEW: COMMAND CENTER BENTO GRID */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const isHovered = hoveredIndex === idx;
              const isAnyCardHovered = hoveredIndex !== null;

              // Compose command card styling
              let cardClass = feature.gridClass;
              if (isHovered) {
                cardClass += ' command-card-active';
              } else if (isAnyCardHovered) {
                cardClass += ' command-card opacity-40 scale-[0.97] blur-[0.5px]';
              } else {
                cardClass += ' command-card';
              }

              return (
                <div
                  key={feature.id}
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleCardMouseMove}
                  className={`group p-6 flex flex-col justify-between gap-6 cursor-pointer relative overflow-hidden transition-all duration-300 ${cardClass}`}
                  style={{ willChange: 'transform, opacity, filter' }}
                >
                  {/* Card Spotlight background glow on hover */}
                  <div className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_120px_at_var(--mouse-x,-1000px)_var(--mouse-y,-1000px),rgba(124,58,237,0.06),transparent)]" />

                  {/* Decorative glowing spotlight inside active card */}
                  {isHovered && (
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-pink-500/20 rounded-xl blur-[12px] opacity-100 -z-20 transition-opacity duration-300" />
                  )}

                  {/* Animated Border Beam on hover */}
                  {isHovered && <div className="beam" />}

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest font-mono">
                        {feature.badge}
                      </span>
                      {isHovered && (
                        <span className="text-[8px] font-mono bg-violet-600/30 text-violet-300 border border-violet-500/30 px-1.5 py-0.5 rounded tracking-widest animate-pulse font-bold">
                          LIVE ENGINE
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-violet-200 group-hover:to-cyan-200 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                      {feature.description}
                    </p>
                    
                    {/* Drawer content revealed on hover */}
                    <div className={`text-[10px] font-mono border-t border-white/[0.05] pt-3 mt-3 flex flex-col gap-1 transition-all duration-300 ${
                      isHovered ? 'max-h-20 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 overflow-hidden transform -translate-y-1'
                    }`}>
                      {feature.extraContent}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-end relative z-10 mt-4">
                    {feature.visual}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
});

BentoGrid.displayName = 'BentoGrid';
