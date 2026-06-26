import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MetricsPanel } from './components/MetricsPanel';
import { TrustedBy } from './components/TrustedBy';
import { WorkflowVisualizer } from './components/WorkflowVisualizer';
import { FeatureShowcase } from './components/FeatureShowcase';
import { BentoGrid } from './components/BentoGrid';
import { PricingEngine } from './components/PricingEngine';
import { Testimonials } from './components/Testimonials';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { InteractiveBackground } from './components/InteractiveBackground';

const SectionDivider = () => (
  <div className="section-divider flex items-center justify-center overflow-visible">
    {/* Animated SVG flowing beam traveling across the divider */}
    <svg className="absolute w-[200px] h-3 overflow-visible pointer-events-none opacity-50" viewBox="0 0 200 12">
      <path 
        d="M -100 6 L 300 6" 
        fill="none" 
        stroke="url(#divider-beam-grad)" 
        strokeWidth="2" 
        className="flow-beam-path" 
      />
      <defs>
        <linearGradient id="divider-beam-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="70%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-brand-bg relative antialiased">
      {/* Dynamic Background Grid */}
      <InteractiveBackground />
      
      <Header />
      
      <main id="main-content">
        <Hero />
        <SectionDivider />
        
        <MetricsPanel />
        <SectionDivider />
        
        <TrustedBy />
        <SectionDivider />
        
        <WorkflowVisualizer />
        <SectionDivider />
        
        <FeatureShowcase />
        <SectionDivider />
        
        <BentoGrid />
        <SectionDivider />
        
        <PricingEngine />
        <SectionDivider />
        
        <Testimonials />
        <SectionDivider />
        
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

export default App;
