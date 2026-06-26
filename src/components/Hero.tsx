import React, { useEffect, useRef } from 'react';

// 3 Layers of depth for 3D parallax and float orchestration
const layersData = [
  {
    factor: 0.08, // Background (slowest parallax)
    floatRange: 8,
    floatDuration: 18000,
    color: '#7c3aed', // Violet
    nodes: [
      { id: 101, x: 150, y: 200 },
      { id: 102, x: 850, y: 150 },
      { id: 103, x: 300, y: 800 },
      { id: 104, x: 700, y: 750 },
      { id: 105, x: 500, y: 450 }
    ],
    connections: [
      { id: 'c101', from: 101, to: 105 },
      { id: 'c102', from: 102, to: 105 },
      { id: 'c103', from: 103, to: 105 },
      { id: 'c104', from: 104, to: 105 }
    ]
  },
  {
    factor: 0.16, // Midground
    floatRange: 15,
    floatDuration: 14000,
    color: '#06b6d4', // Cyan
    nodes: [
      { id: 201, x: 100, y: 450 },
      { id: 202, x: 900, y: 400 },
      { id: 203, x: 400, y: 150 },
      { id: 204, x: 600, y: 850 },
      { id: 205, x: 300, y: 650 },
      { id: 206, x: 700, y: 300 }
    ],
    connections: [
      { id: 'c201', from: 201, to: 205 },
      { id: 'c202', from: 205, to: 204 },
      { id: 'c203', from: 204, to: 202 },
      { id: 'c204', from: 202, to: 206 },
      { id: 'c205', from: 206, to: 203 },
      { id: 'c206', from: 203, to: 201 }
    ]
  },
  {
    factor: 0.28, // Foreground (fastest parallax)
    floatRange: 22,
    floatDuration: 10000,
    color: '#ec4899', // Pink
    nodes: [
      { id: 301, x: 200, y: 350 },
      { id: 302, x: 800, y: 650 },
      { id: 303, x: 500, y: 200 },
      { id: 304, x: 350, y: 750 },
      { id: 305, x: 650, y: 800 }
    ],
    connections: [
      { id: 'c301', from: 301, to: 303 },
      { id: 'c302', from: 303, to: 302 },
      { id: 'c303', from: 302, to: 305 },
      { id: 'c304', from: 305, to: 304 },
      { id: 'c305', from: 304, to: 301 }
    ]
  }
];

export const Hero: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  
  // Parallax outer containers refs
  const parallaxLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
  
  // Floating inner containers refs
  const floatLayerRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Flat arrays of DOM node and line references for direct, zero-render updates
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const lineRefs = useRef<Record<string, SVGLineElement | null>>({});
  const packetRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const packetAnimationsRef = useRef<Record<string, Animation | null>>({});

  useEffect(() => {
    // 1. Initialize Floating Loop Animations on Mount using WAAPI
    floatLayerRefs.current.forEach((layer, idx) => {
      if (layer) {
        const range = layersData[idx].floatRange;
        const duration = layersData[idx].floatDuration;
        
        layer.animate([
          { transform: 'translate3d(0px, 0px, 0)' },
          { transform: `translate3d(${range}px, ${-range}px, 0)` },
          { transform: `translate3d(${-range}px, ${range * 0.8}px, 0)` },
          { transform: 'translate3d(0px, 0px, 0)' }
        ], {
          duration: duration,
          iterations: Infinity,
          easing: 'ease-in-out'
        });
      }
    });

    // 2. Initialize Data Packet Flying Animations using WAAPI
    layersData.forEach((layer) => {
      layer.connections.forEach((conn) => {
        const packet = packetRefs.current[conn.id];
        if (packet) {
          const fromNode = layer.nodes.find(n => n.id === conn.from)!;
          const toNode = layer.nodes.find(n => n.id === conn.to)!;

          const anim = packet.animate([
            { cx: `${fromNode.x}`, cy: `${fromNode.y}`, opacity: 0 },
            { cx: `${fromNode.x}`, cy: `${fromNode.y}`, opacity: 1, offset: 0.15 },
            { cx: `${toNode.x}`, cy: `${toNode.y}`, opacity: 1, offset: 0.85 },
            { cx: `${toNode.x}`, cy: `${toNode.y}`, opacity: 0 }
          ], {
            duration: 3500 + Math.random() * 2500,
            iterations: Infinity,
            delay: Math.random() * 3000,
            easing: 'ease-in-out'
          });
          packetAnimationsRef.current[conn.id] = anim;
        }
      });
    });

    // 3. Handle Mouse Movement for Parallax and Proximity Lighting
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;

      // Displacements from screen center
      const centerX = width / 2;
      const centerY = height / 2;
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;

      // A. Update trailing light spot
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        cursorGlowRef.current.style.opacity = '1';
      }

      // B. Apply parallax translation to layers
      parallaxLayerRefs.current.forEach((layer, idx) => {
        if (layer) {
          const factor = layersData[idx].factor;
          // Subtle movement opposite to cursor
          const tx = deltaX * -factor * 0.35;
          const ty = deltaY * -factor * 0.35;
          layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        }
      });

      // C. Node and line proximity calculations (Direct DOM styling updates)
      layersData.forEach((layer, layerIdx) => {
        const factor = layer.factor;
        // Compute parallax displacement offset for this layer to align math
        const tx = deltaX * -factor * 0.35;
        const ty = deltaY * -factor * 0.35;

        // Track distances for node lighting
        const nodeDistances: Record<number, number> = {};

        layer.nodes.forEach((node) => {
          const nodeDOM = nodeRefs.current[node.id];
          if (!nodeDOM) return;

          // Convert ViewBox coordinates (0-1000) to actual container pixels
          const nodeBaseX = (node.x / 1000) * width;
          const nodeBaseY = (node.y / 1000) * height;

          // Current absolute position incorporating parallax shift
          const currentX = nodeBaseX + tx;
          const currentY = nodeBaseY + ty;

          // Euclidean distance to mouse cursor
          const dx = currentX - mouseX;
          const dy = currentY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          nodeDistances[node.id] = dist;

          const glowDot = nodeDOM.querySelector('.node-glow') as HTMLElement;
          const outerCircle = nodeDOM.querySelector('.node-ring') as HTMLElement;

          if (dist < 260) {
            const intensity = 1 - dist / 260; // 0 to 1
            
            if (glowDot) {
              glowDot.style.opacity = `${intensity * 0.9}`;
              glowDot.style.transform = `scale(${1 + intensity * 0.7}) translate3d(-50%, -50%, 0)`;
            }
            if (outerCircle) {
              outerCircle.style.borderColor = dist < 140 ? 'rgba(6, 182, 212, 0.6)' : 'rgba(124, 58, 237, 0.4)';
              outerCircle.style.transform = `scale(${1 + intensity * 0.3}) translate3d(-50%, -50%, 0)`;
            }
          } else {
            if (glowDot) {
              glowDot.style.opacity = '0';
              glowDot.style.transform = 'scale(1) translate3d(-50%, -50%, 0)';
            }
            if (outerCircle) {
              outerCircle.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              outerCircle.style.transform = 'scale(1) translate3d(-50%, -50%, 0)';
            }
          }
        });

        // D. Connection lines glow based on connected nodes proximity
        layer.connections.forEach((conn) => {
          const lineDOM = lineRefs.current[conn.id];
          if (!lineDOM) return;

          const distA = nodeDistances[conn.from] ?? 9999;
          const distB = nodeDistances[conn.to] ?? 9999;
          const minDist = Math.min(distA, distB);
          const anim = packetAnimationsRef.current[conn.id];

          if (minDist < 260) {
            const intensity = 1 - minDist / 260;
            lineDOM.style.opacity = `${0.08 + intensity * 0.45}`;
            lineDOM.style.stroke = minDist < 150 
              ? (layerIdx === 1 ? '#06b6d4' : layerIdx === 2 ? '#ec4899' : '#8b5cf6') 
              : 'rgba(255, 255, 255, 0.08)';
            if (anim) {
              anim.playbackRate = 1.0 + intensity * 2.5; // Accelerate packets on approach
            }
          } else {
            lineDOM.style.opacity = '0.08';
            lineDOM.style.stroke = 'rgba(255, 255, 255, 0.08)';
            if (anim) {
              anim.playbackRate = 1.0;
            }
          }
        });
      });
    };

    const handleMouseLeave = () => {
      // Fade out cursor light
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.opacity = '0';
      }

      // Reset node styles to defaults
      layersData.forEach((layer) => {
        layer.nodes.forEach((node) => {
          const nodeDOM = nodeRefs.current[node.id];
          if (nodeDOM) {
            const glowDot = nodeDOM.querySelector('.node-glow') as HTMLElement;
            const outerCircle = nodeDOM.querySelector('.node-ring') as HTMLElement;
            if (glowDot) {
              glowDot.style.opacity = '0';
              glowDot.style.transform = 'scale(1) translate3d(-50%, -50%, 0)';
            }
            if (outerCircle) {
              outerCircle.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              outerCircle.style.transform = 'scale(1) translate3d(-50%, -50%, 0)';
            }
          }
        });

        layer.connections.forEach((conn) => {
          const lineDOM = lineRefs.current[conn.id];
          if (lineDOM) {
            lineDOM.style.opacity = '0.08';
            lineDOM.style.stroke = 'rgba(255, 255, 255, 0.08)';
          }
          const anim = packetAnimationsRef.current[conn.id];
          if (anim) {
            anim.playbackRate = 1.0;
          }
        });

        // Reset layer translations
        parallaxLayerRefs.current.forEach((layer) => {
          if (layer) layer.style.transform = 'translate3d(0, 0, 0)';
        });
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden min-h-screen flex items-center justify-center bg-[#02000a] select-none"
    >
      {/* 1. Aurora Gradient Background Layers */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep mesh glows */}
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-violet-900/15 blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-cyan-950/15 blur-[120px] animate-pulse-slow" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[30%] left-[60%] w-[500px] h-[500px] rounded-full bg-pink-950/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '-6s' }} />
        <div className="absolute inset-0 grid-bg opacity-30 mix-blend-overlay" />
      </div>

      {/* 2. Cursor Reactive Glowing Light Trail (Direct DOM manipulation) */}
      <div 
        ref={cursorGlowRef}
        className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-violet-500/10 to-cyan-500/10 blur-[90px] pointer-events-none z-10 opacity-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ease-out"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* 3. Three-Dimensional Depth Parallax Network Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {layersData.map((layer, idx) => (
          <div
            key={idx}
            ref={el => { parallaxLayerRefs.current[idx] = el; }}
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{ willChange: 'transform' }}
          >
            <div 
              ref={el => { floatLayerRefs.current[idx] = el; }} 
              className="absolute inset-0"
              style={{ willChange: 'transform' }}
            >
              {/* SVG connection lines and data packet streams */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <radialGradient id="packet-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="100%" stopColor={layer.color} stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Draw connection lines */}
                {layer.connections.map((conn) => (
                  <line
                    key={conn.id}
                    ref={el => { lineRefs.current[conn.id] = el; }}
                    x1={layer.nodes.find(n => n.id === conn.from)!.x}
                    y1={layer.nodes.find(n => n.id === conn.from)!.y}
                    x2={layer.nodes.find(n => n.id === conn.to)!.x}
                    y2={layer.nodes.find(n => n.id === conn.to)!.y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="0.75"
                    style={{ transition: 'stroke 0.4s, opacity 0.4s', willChange: 'opacity, stroke' }}
                  />
                ))}

                {/* Draw data packets (traversing using WAAPI) */}
                {layer.connections.map((conn) => (
                  <circle
                    key={`p-${conn.id}`}
                    ref={el => { packetRefs.current[conn.id] = el; }}
                    r="4.5"
                    fill="url(#packet-glow)"
                    className="mix-blend-screen"
                    style={{ willChange: 'cx, cy, opacity' }}
                  />
                ))}
              </svg>

              {/* HTML Nodes positioned absolute */}
              {layer.nodes.map((node) => (
                <div
                  key={node.id}
                  ref={el => { nodeRefs.current[node.id] = el; }}
                  className="absolute"
                  style={{
                    left: `${node.x / 10}%`,
                    top: `${node.y / 10}%`,
                    width: '1px',
                    height: '1px'
                  }}
                >
                  {/* Proximity lighting core glow dot */}
                  <div 
                    className="node-glow absolute rounded-full opacity-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 blur-[8px] transition-all duration-300 ease-out"
                    style={{
                      width: `${idx === 2 ? 30 : idx === 1 ? 22 : 16}px`,
                      height: `${idx === 2 ? 30 : idx === 1 ? 22 : 16}px`,
                      backgroundColor: layer.color,
                      willChange: 'transform, opacity'
                    }}
                  />

                  {/* Outer circle ring */}
                  <div 
                    className="node-ring absolute border rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
                    style={{
                      width: `${idx === 2 ? 14 : idx === 1 ? 10 : 8}px`,
                      height: `${idx === 2 ? 14 : idx === 1 ? 10 : 8}px`,
                      borderColor: 'rgba(255,255,255,0.08)',
                      backgroundColor: 'rgba(3,0,20,0.85)',
                      borderWidth: '1px',
                      willChange: 'transform, border-color'
                    }}
                  />

                  {/* Center solid core dot */}
                  <div 
                    className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 bg-white"
                    style={{
                      width: `${idx === 2 ? 4.5 : idx === 1 ? 3.5 : 2.5}px`,
                      height: `${idx === 2 ? 4.5 : idx === 1 ? 3.5 : 2.5}px`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Status Badges & Cards */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20">
        {/* Badge 1: Agent Active */}
        <div 
          className="absolute top-[20%] left-[8%] hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-card/60 border border-emerald-500/35 backdrop-blur-lg shadow-lg shadow-emerald-500/5 float-ui-badge font-mono text-[11px] text-emerald-400 font-bold"
          style={{ willChange: 'transform' }}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Agent Active
        </div>

        {/* Badge 2: Latency */}
        <div 
          className="absolute top-[35%] right-[8%] hidden xl:flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-card/60 border border-violet-500/30 backdrop-blur-lg shadow-lg shadow-violet-500/5 float-ui-badge-alt font-mono text-[11px] text-violet-300 font-bold"
          style={{ willChange: 'transform' }}
        >
          <svg className="w-4 h-4 text-violet-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          24ms Response Time
        </div>

        {/* Badge 3: Accuracy */}
        <div 
          className="absolute bottom-[35%] left-[6%] hidden xl:flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-card/60 border border-cyan-500/30 backdrop-blur-lg shadow-lg shadow-cyan-500/5 float-ui-badge font-mono text-[11px] text-cyan-300 font-bold"
          style={{ willChange: 'transform' }}
        >
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          99.9% Accuracy
        </div>
      </div>

      {/* 4. Hero Content Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
        {/* Animated v2.0 Live badge */}
        <div 
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.07] backdrop-blur-md mb-8 animate-reveal"
          style={{ animationDelay: '0ms', animationFillMode: 'both' }}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-violet-300 uppercase font-mono">
            Aether v2.0 &middot; AI Core
          </span>
        </div>

        {/* Headline */}
        <h1 
          className="text-4xl sm:text-6xl lg:text-[88px] xl:text-[96px] font-extrabold tracking-tight mb-8 leading-[1.08] animate-reveal elite-text-reveal max-w-5xl mx-auto"
          style={{ animationDelay: '100ms', animationFillMode: 'both' }}
        >
          <span className="block text-white mb-2">Automate <span className="text-gradient-purple-pink">Everything</span></span>
          <span className="block text-white">With Autonomous <span className="text-gradient-cyan-purple">AI Infrastructure</span></span>
        </h1>

        {/* Sub-headline */}
        <p 
          className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed animate-reveal font-sans"
          style={{ animationDelay: '200ms', animationFillMode: 'both' }}
        >
          Feed raw API payloads, resolve multi-currency conversions, and execute visual logic tables in real-time. Built for teams that scale AI infrastructure.
        </p>

        {/* Action triggers */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-reveal"
          style={{ animationDelay: '300ms', animationFillMode: 'both' }}
        >
          <a href="#pricing" className="btn-primary w-full sm:w-auto shadow-xl shadow-violet-500/20">
            <span>Start Free Trial</span>
          </a>
          <button type="button" className="btn-secondary w-full sm:w-auto">
            Book Tech Demo
          </button>
        </div>

        {/* Visual Mockup Showcase */}
        <div 
          className="w-full max-w-5xl mx-auto glass-card p-4 sm:p-6 shadow-2xl relative group overflow-hidden animate-reveal border-white/[0.05] hover:border-violet-500/20 transition-all duration-300 z-10"
          style={{ animationDelay: '400ms', animationFillMode: 'both' }}
        >
          {/* Spotlight background glow on hover */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.05),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
          
          {/* Animated Border Beam */}
          <div className="beam opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/5 via-transparent to-pink-500/5 pointer-events-none z-0" />
          
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.05] mb-4">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="h-5 w-40 sm:w-60 bg-white/[0.03] border border-white/[0.06] rounded-md mx-auto text-[10px] text-slate-500 flex items-center justify-center font-mono">
              aether-platform.internal/flows/active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                Data Stream Ingestion
              </span>
              <div className="text-xl font-bold text-white mb-2">4,812 msg/s</div>
              <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full w-4/5 animate-pulse" />
              </div>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                Active AI Agents
              </span>
              <div className="text-xl font-bold text-white mb-2">92 Online</div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                <span className="text-xs text-emerald-400 font-medium">Auto-scaling active</span>
              </div>
            </div>
            <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                Pipeline Health
              </span>
              <div className="text-xl font-bold text-white mb-2">99.999%</div>
              <span className="text-xs text-violet-400 font-mono">0.02ms average latency</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
