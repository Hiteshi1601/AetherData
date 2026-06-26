import React, { useEffect, useRef } from 'react';

const pipelineStages = [
  {
    id: 'sources',
    title: 'Data Sources',
    desc: 'Webhooks, API logs, DBs, and raw survey payloads',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 10h16M4 14h16" />
      </svg>
    ),
    color: 'from-violet-500 to-indigo-500',
    shadowColor: 'rgba(124, 58, 237, 0.2)',
  },
  {
    id: 'agents',
    title: 'AI Agents',
    desc: 'Autonomous reasoning, routing, and context parsing',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: 'from-indigo-500 to-cyan-500',
    shadowColor: 'rgba(99, 102, 241, 0.2)',
  },
  {
    id: 'processing',
    title: 'Processing Engine',
    desc: 'Dynamic schema normalization & tariff conversions',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    color: 'from-cyan-500 to-emerald-500',
    shadowColor: 'rgba(6, 182, 212, 0.2)',
  },
  {
    id: 'automation',
    title: 'Automation Layer',
    desc: 'Real-time webhook routing & multi-platform logic',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'from-emerald-500 to-pink-500',
    shadowColor: 'rgba(16, 185, 129, 0.2)',
  },
  {
    id: 'insights',
    title: 'Business Insights',
    desc: 'Clean database records, ledgers, and BI syncs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
    ),
    color: 'from-pink-500 to-rose-500',
    shadowColor: 'rgba(236, 72, 153, 0.2)',
  },
];

const mockLogs = [
  '[Ingest] Webhook received from Stripe (ch_3M2e12) - Payload raw size: 1.4KB',
  '[AI Agent] Parsing survey query for text sentiment score... Done (0.98 positive)',
  '[Processing] Normalizing currency field amount_inr (1,499.00) against current conversion matrix',
  '[Processing] Applied Pro Tier 20% discount structure to base rate ($17.99 USD equivalent)',
  '[Automation] Triggering regional tariff rules -> route outbound sync ledger (SUCCESS)',
  '[Automation] Dispatched Slack notification block: "New Enterprise Ingestion Flow Active"',
  '[Insights] Ingested 5 clean records into analytics-db-04 (latency: 14.8ms)',
  '[Ingest] Ingress API log received: status=200 duration_ms=45.2 client_ip=192.168.1.45',
  '[AI Agent] Extracting entity context: "Sarah, Lead Engineer, SyncFlow"',
  '[Insights] Refreshed real-time KPI metrics database (throughput: 4.8k msg/s)',
];

export const WorkflowVisualizer: React.FC = React.memo(() => {
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // DOM refs to bypass React render cycle for live updating stats
  const throughputRef = useRef<HTMLSpanElement>(null);
  const throughputBarRef = useRef<HTMLDivElement>(null);
  const latencyRef = useRef<HTMLSpanElement>(null);
  const cpuRef = useRef<HTMLSpanElement>(null);
  const cpuBarRef = useRef<HTMLDivElement>(null);
  const dbSyncCountRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // 1. Live Terminal Log Streamer (Direct DOM insertion)
    let logIndex = 0;
    const logInterval = setInterval(() => {
      const terminal = terminalRef.current;
      if (!terminal) return;

      const p = document.createElement('p');
      p.className = 'text-[11px] leading-relaxed font-mono transition-all duration-300 transform translate-y-2 opacity-0 text-slate-300';
      p.innerHTML = `<span class="text-violet-400 font-semibold">[${new Date().toLocaleTimeString()}]</span> ${mockLogs[logIndex]}`;
      terminal.appendChild(p);

      // Force reflow and animate in
      setTimeout(() => {
        p.classList.remove('translate-y-2', 'opacity-0');
      }, 20);

      // Keep scroll at bottom
      terminal.scrollTop = terminal.scrollHeight;

      // Limit terminal length
      if (terminal.childNodes.length > 25) {
        terminal.removeChild(terminal.firstChild!);
      }

      logIndex = (logIndex + 1) % mockLogs.length;
    }, 2800);

    // 2. Live Telemetry Metrics (Direct DOM updating - Zero Re-renders)
    let syncCount = 50294103;
    const metricsInterval = setInterval(() => {
      // Throughput pulse
      if (throughputRef.current && throughputBarRef.current) {
        const value = 4600 + Math.round(Math.random() * 450);
        throughputRef.current.textContent = `${value.toLocaleString()} msg/s`;
        const percentage = Math.min(((value - 4000) / 1500) * 100, 100);
        throughputBarRef.current.style.width = `${percentage}%`;
      }

      // Latency fluctuation
      if (latencyRef.current) {
        const value = 22 + Math.random() * 4;
        latencyRef.current.textContent = `${value.toFixed(2)}ms`;
      }

      // CPU fluctuations
      if (cpuRef.current && cpuBarRef.current) {
        const value = 38 + Math.round(Math.random() * 12);
        cpuRef.current.textContent = `${value}%`;
        cpuBarRef.current.style.width = `${value}%`;
      }

      // Total Sync Count
      if (dbSyncCountRef.current) {
        syncCount += Math.round(Math.random() * 5) + 1;
        dbSyncCountRef.current.textContent = syncCount.toLocaleString();
      }
    }, 1200);

    return () => {
      clearInterval(logInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  return (
    <section className="py-28 relative z-10 overflow-hidden bg-[#030010] border-t border-white/[0.02]">
      {/* Dynamic Glowing Spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-[150px]" />
        <div className="absolute bottom-1/4 right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-500/5 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-xs text-violet-300 font-medium mb-4 font-mono">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            LIVE TELEMETRY WORKFLOW
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Real-Time AI Pipeline Orchestration
          </h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg leading-relaxed">
            Witness how raw data payloads travel, transform, automate, and resolve into clean structured actions across our globally distributed neural grid.
          </p>
        </div>

        {/* 1. Interactive Node Connection Map */}
        <div className="relative mb-20">
          
          {/* Connector Paths (Desktop) */}
          <div className="hidden lg:block absolute inset-0 z-0">
            <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="30%" stopColor="#6366f1" />
                  <stop offset="55%" stopColor="#06b6d4" />
                  <stop offset="80%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              {/* Pulsing data line */}
              <path
                d="M 100 100 C 200 100, 200 100, 300 100 C 400 100, 400 100, 500 100 C 600 100, 600 100, 700 100 C 800 100, 800 100, 900 100"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="1.75"
                className="flow-beam-path opacity-40"
              />
              {/* Flow particles */}
              <circle r="4" fill="#06b6d4" className="mix-blend-screen opacity-90">
                <animateMotion
                  path="M 100 100 C 200 100, 200 100, 300 100 C 400 100, 400 100, 500 100 C 600 100, 600 100, 700 100 C 800 100, 800 100, 900 100"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="3.5" fill="#ec4899" className="mix-blend-screen opacity-90">
                <animateMotion
                  path="M 100 100 C 200 100, 200 100, 300 100 C 400 100, 400 100, 500 100 C 600 100, 600 100, 700 100 C 800 100, 800 100, 900 100"
                  dur="5.5s"
                  begin="1.8s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="4.5" fill="#a78bfa" className="mix-blend-screen opacity-90">
                <animateMotion
                  path="M 100 100 C 200 100, 200 100, 300 100 C 400 100, 400 100, 500 100 C 600 100, 600 100, 700 100 C 800 100, 800 100, 900 100"
                  dur="7s"
                  begin="3.2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>

          {/* Node Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {pipelineStages.map((stage, idx) => (
              <div
                key={stage.id}
                className="group relative rounded-2xl glass-card bg-white/[0.01] border border-white/[0.04] p-5 flex flex-col justify-between items-start transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.03] hover:-translate-y-1.5"
                style={{
                  boxShadow: `0 4px 30px rgba(0, 0, 0, 0.4)`,
                }}
              >
                {/* Spotlight glow behind node card on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                  style={{
                    background: `radial-gradient(circle at center, ${stage.shadowColor} 0%, transparent 70%)`
                  }}
                />

                <div className="w-full relative z-10">
                  {/* Step bubble */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${stage.color} text-white shadow-md`}>
                      {stage.icon}
                    </div>
                    <span className="text-[10px] font-bold font-mono text-slate-500 tracking-wider">
                      STEP 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-slate-100">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans group-hover:text-slate-300">
                    {stage.desc}
                  </p>
                </div>

                <div className="w-full mt-5 pt-3 border-t border-white/[0.03] flex items-center justify-between relative z-10 text-[9px] font-mono text-slate-500">
                  <span>LATENCY: &lt;1.2ms</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block animate-ping" />
                    LIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Premium Real-Time Control Center Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Live Ingestion Log Terminal (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl glass-card bg-[#05021a] border border-white/[0.04] p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono font-medium text-slate-400 ml-2">aether-stream-console.log</span>
              </div>
              <div className="flex items-center gap-1.5 bg-violet-950/40 border border-violet-800/40 rounded px-2.5 py-0.5 text-[9px] font-mono text-violet-300 font-semibold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 inline-block animate-pulse" />
                Connected Webhook Receiver
              </div>
            </div>

            {/* Terminal Box */}
            <div 
              ref={terminalRef}
              className="flex-1 min-h-[220px] max-h-[300px] overflow-y-auto space-y-2 text-left font-mono pr-2"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.05) transparent'
              }}
            >
              <p className="text-[11px] leading-relaxed text-slate-500 font-mono">
                [14:10:05] [System] Initialization sequence complete. Monitoring active webhook ingress ports.
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500 font-mono">
                [14:10:06] [System] Currency database matrix fetched. INR Multiplier loaded (75.0), EUR multiplier loaded (0.92).
              </p>
              <p className="text-[11px] leading-relaxed text-slate-300 font-mono">
                <span className="text-violet-400 font-semibold">[14:10:08]</span> [Ingest] REST Webhook received from Stripe - Payload: {"{\"event\":\"order_completed\"}"}
              </p>
            </div>
          </div>

          {/* System Telemetry panel (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl glass-card bg-[#05021a] border border-white/[0.04] p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Engine Telemetry
              </h3>

              {/* Stat 1: Throughput */}
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-xs text-slate-400 font-sans">Active Throughput</span>
                  <span ref={throughputRef} className="text-sm font-bold text-white font-mono">4,812 msg/s</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.03] border border-white/[0.05] rounded-full overflow-hidden">
                  <div 
                    ref={throughputBarRef}
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: '72%' }}
                  />
                </div>
              </div>

              {/* Stat 2: Avg Latency */}
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                <span className="text-xs text-slate-400 font-sans">Avg Pipeline Latency</span>
                <span ref={latencyRef} className="text-base font-bold text-cyan-400 font-mono">24.12ms</span>
              </div>

              {/* Stat 3: CPU Core Load */}
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-xs text-slate-400 font-sans">Cluster CPU Load</span>
                  <span ref={cpuRef} className="text-sm font-bold text-white font-mono">42%</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.03] border border-white/[0.05] rounded-full overflow-hidden">
                  <div 
                    ref={cpuBarRef}
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: '42%' }}
                  />
                </div>
              </div>
            </div>

            {/* Running Total counter */}
            <div className="mt-8 pt-4 border-t border-white/[0.05] flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">
                Total Synchronizations
              </span>
              <span 
                ref={dbSyncCountRef}
                className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 font-mono tracking-tight"
              >
                50,294,103
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
});

WorkflowVisualizer.displayName = 'WorkflowVisualizer';
