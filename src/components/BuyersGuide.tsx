import React, { useState } from 'react';
import { Product, Shop } from '../types';
import { MOCK_SHOPS } from '../data/shops';
import { Sparkles, HelpingHand, Compass, Flame, Info, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface BuyersGuideProps {
  onAddToCart: (
    product: Product,
    shopId: string,
    shopName: string,
    shopAddress: string,
    shopCoords: { x: number; y: number }
  ) => void;
}

type GuideCategory = 'Flower' | 'Pre-rolls' | 'Vapes' | 'Cigars' | 'Accessories';

interface CategoryGuideDetail {
  title: string;
  subtitle: string;
  experience: string;
  icon: string;
  primer: string;
  keyAspects: { title: string; desc: string }[];
  expertRule: string;
}

const CATEGORY_GUIDES: Record<GuideCategory, CategoryGuideDetail> = {
  Flower: {
    title: 'Botanical Flower Cultivation',
    subtitle: 'From premium indoor buds to rich full-spectrum hemp',
    experience: 'Classic sensory ritual • Holistic cannabinoids • Organic terpene profiles',
    icon: '🌸',
    primer: 'Selecting premium flower is highly analogous to vintage wine. High-quality buds are defined by frostiness (trichomes), structural density, and aroma depth. The aroma stems from natural terpenes, which modulate both the physical effects and clean flavor note profiles.',
    keyAspects: [
      { title: 'Sativa Varieties', desc: 'Typically rich in citrus/lemon limonene terpenes. Energetic, cerebral, inspiring, and ideal for daytime sessions.' },
      { title: 'Indica Varieties', desc: 'Abundant in musky myrcene and piney terpenes. Deeply relaxed, sedating, calming body effects, ideal for physical serenity.' },
      { title: 'Hybrid Balances', desc: 'Breeds combining both profiles to yield a versatile creative head feel with physical relaxation.' }
    ],
    expertRule: 'Expert selection tip: High-yield THC is not the sole indicator of quality. Check for "terpene-rich" labels and frosty, sticky resin crystals. Clean ash color indicates ideal curing.'
  },
  'Pre-rolls': {
    title: 'Curated Artisan Pre-Rolls',
    subtitle: 'Ready-to-use premium convenience and infused luxury',
    experience: 'Instant preparation • Smooth airflow control • Consistent burn structure',
    icon: '🌱',
    primer: 'Pre-rolls take the labor out of rolling while preserving organic quality. Ranging from single standard cones to decadent oil-infused blunts coated in kief, they offer unmatched on-the-go consistency.',
    keyAspects: [
      { title: 'Standard Cones', desc: 'Pure ground flower wrapped in thin unbleached hemp or organic rice paper, facilitating a pure, neutral taste.' },
      { title: 'Infused Options', desc: 'Flower rolls painted internally or externally with concentrated distillate oils and rolled in pollen kief for double potency.' },
      { title: 'Broadleaf / Blunt Wraps', desc: 'Coarser, slow-burning tobacco-free organic broadleaf wraps that present an aromatic, woodsy profile.' }
    ],
    expertRule: 'Burn rate advice: If a pre-roll burns unevenly (canoeing), rotate it slowly while holding a flame slightly further from the uneven side to restore clean ventilation.'
  },
  Vapes: {
    title: 'Advanced Vaporization Tech',
    subtitle: 'Discrete vapor pods, universal 510-threads, and pure extractions',
    experience: 'Highly discrete • High purity concentrates • Fast onset times',
    icon: '⚡',
    primer: 'Vaporization warms oil concentrates just below combustion temperatures, delivering clean vapors with zero combustion smoke. Hardware ranges from integrated pre-filled disposables to adjustable digital batteries with 510-thread cartridges.',
    keyAspects: [
      { title: 'Extractions (Live Resin)', desc: 'Extracted from flash-frozen fresh crops, preserving the authentic plant terpenes and full flavor notes.' },
      { title: 'Distillates', desc: 'High purity refined oil featuring strong cannabinoid profiles, usually coupled with botanical highlights.' },
      { title: 'Optimal Voltage', desc: 'Lower voltage settings (2.2V - 2.8V) produce spectacular taste; higher settings (3.2V+) provide massive vapor density.' }
    ],
    expertRule: 'Maintenance tip: To clean a clogged cartridge, run a warm hair-dryer over it briefly to liquefy sticky oils blocking the air passage, or use a paperclip.'
  },
  Cigars: {
    title: 'Ultra-Premium Cigar Humidors',
    subtitle: 'Expert leaf blending, tobacco wrappers, and slow drawing standard rituals',
    experience: 'Aged craftsmanship • Rich complex flavor transitions • Sophisticated pace',
    icon: '🚬',
    primer: 'Cigar creation is a historical art form. Built from three core components (the Binder leaf, the Filler blend, and the elegant Outer Wrapper), premium long-filler cigars undergo years of meticulous fermentation and humidor storage.',
    keyAspects: [
      { title: 'Conn. Shade Wrapper', desc: 'Golden, silky, cream-textured cigars yielding mild-to-medium butter, cedar, and nut profiles.' },
      { title: 'Maduro Dark Wrapper', desc: 'Intensely fermented dark oily wrappers giving sweet, robust cocoa, coffee, and roasted earth flavor notes.' },
      { title: 'Habano Wrapper', desc: 'Cuban-seed leaf carrying rich, medium-to-full spicy, peppery, leathery, and espresso nuances.' }
    ],
    expertRule: 'Ceremony dictate: Never inhale cigar smoke—draw it into the palate, hold briefly to savor the blend transition, and let it exit naturally. Humidify at exactly 65% to 70% RH.'
  },
  Accessories: {
    title: 'Essential Maintenance & Accoutrements',
    subtitle: 'Precision grinders, scientific glass cleaning, and storage',
    experience: 'Preserved longevity • Flawless functional support • Device hygiene',
    icon: '⚙️',
    primer: 'Premium accessories transform and preserve your hardware. Modern accessories prevent cross-contamination, guarantee fine grinds for neat rolls, and optimize glass pipes with industrial solvents.',
    keyAspects: [
      { title: 'Four-Piece Grinders', desc: 'Formulated with CNC diamond-cut teeth, a dedicated storage chamber, and a microsifter screen that harvests pollen kief.' },
      { title: 'Scientific Glass Cleaner', desc: 'Abrasive salt crystal solutions that instantly dissolve charred tars and resin build-up within glassware.' },
      { title: 'Odor Control Filters', desc: 'Pocket devices embedded with multi-stage high-efficiency charcoal filters to capture exhaled aerosols entirely.' }
    ],
    expertRule: 'Pro tip: Regularly clean your grinder blades with a gentle splash of rubbing alcohol. It keeps the rotation silky and restores sticky metal threads.'
  }
};

export default function BuyersGuide({ onAddToCart }: BuyersGuideProps) {
  const [activeCategory, setActiveCategory] = useState<GuideCategory>('Flower');
  
  // Interactive match quiz states
  const [quizVibe, setQuizVibe] = useState<'relax' | 'focus' | 'ritual' | 'portable' | ''>('');
  const [quizType, setQuizType] = useState<'flower' | 'vape' | 'cigar' | ''>('');
  const [quizResult, setQuizResult] = useState<Product | null>(null);
  const [quizResultShop, setQuizResultShop] = useState<Shop | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const handleRunQuiz = () => {
    if (!quizVibe || !quizType) return;

    // Search existing catalog products to find an absolute match
    let matchedProd: Product | null = null;
    let matchedShop: Shop | null = null;

    // Search MOCK_SHOPS for products matching conditions
    for (const shop of MOCK_SHOPS) {
      for (const prod of shop.products) {
        // Evaluate matches based on inputs
        if (quizType === 'flower') {
          if (prod.category === 'Flower' || prod.category === 'Pre-rolls') {
            if (quizVibe === 'relax' && (prod.name.toLowerCase().includes('indica') || prod.name.toLowerCase().includes('night') || prod.name.toLowerCase().includes('sleep'))) {
              matchedProd = prod; matchedShop = shop; break;
            }
            if (quizVibe === 'focus' && (prod.name.toLowerCase().includes('sativa') || prod.name.toLowerCase().includes('diesel'))) {
              matchedProd = prod; matchedShop = shop; break;
            }
            if (quizVibe === 'ritual' && prod.category === 'Pre-rolls') {
              matchedProd = prod; matchedShop = shop; break;
            }
            // fallback
            if (!matchedProd) { matchedProd = prod; matchedShop = shop; }
          }
        } else if (quizType === 'vape') {
          if (prod.category === 'Vapes') {
            if (quizVibe === 'portable' || quizVibe === 'focus') {
              matchedProd = prod; matchedShop = shop; break;
            }
            if (!matchedProd) { matchedProd = prod; matchedShop = shop; }
          }
        } else if (quizType === 'cigar') {
          if (prod.category === 'Cigars' || prod.category === 'Glass & Pipes') {
            if (quizVibe === 'ritual' || quizVibe === 'relax') {
              matchedProd = prod; matchedShop = shop; break;
            }
            if (!matchedProd) { matchedProd = prod; matchedShop = shop; }
          }
        }
      }
      if (matchedProd) break;
    }

    // Default total fallback if loop yields nothing
    if (!matchedProd) {
      matchedShop = MOCK_SHOPS[0];
      matchedProd = matchedShop.products[0];
    }

    setQuizResult(matchedProd);
    setQuizResultShop(matchedShop);
  };

  const resetQuiz = () => {
    setQuizVibe('');
    setQuizType('');
    setQuizResult(null);
    setQuizResultShop(null);
  };

  const handleAddRecommended = () => {
    if (!quizResult || !quizResultShop) return;
    onAddToCart(
      quizResult,
      quizResultShop.id,
      quizResultShop.name,
      quizResultShop.address,
      quizResultShop.coords
    );
    setToastMessage(`Successfully added "${quizResult.name}" from ${quizResultShop.name} to your basket!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="space-y-8" id="buyers-guide-root">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-[#0f0e0d] border border-accent-gold/40 rounded-2xl p-4 flex items-center justify-between animate-fade-in shadow-2xl fixed top-24 right-6 left-6 md:left-auto md:max-w-md z-50">
          <div className="flex items-center gap-2.5 text-xs text-[#e0e0e0]/95">
            <Check className="w-4 h-4 text-accent-gold" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-[10px] text-accent-gold/60 uppercase hover:text-white px-2 py-0.5">
            Hide
          </button>
        </div>
      )}

      {/* Hero Header */}
      <header className="relative bg-gradient-to-br from-[#121212] to-[#080808] border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col justify-end overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-gold/10 blur-[130px] rounded-full" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent-gold animate-spin-slow" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent-gold font-bold">EDUCATIONAL FLAVOR REGISTRY</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic text-white leading-none tracking-tight">
            Northside Buyers Guide.
          </h1>
          <p className="text-sm md:text-base text-[#e0e0e0]/60 font-light leading-relaxed">
            Meticulous technical guides across premium organic flowers, pre-rolls, vape concentrates, aged cigars, and accessories. Demystify your choices.
          </p>
        </div>
      </header>

      {/* Segment Selector & Main Content Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Guide category lists */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0d0d0d] border border-white/5 p-4 rounded-2xl space-y-1.5 shadow">
            <h3 className="text-[10px] px-2 font-mono uppercase tracking-widest text-[#e0e0e0]/40 font-bold mb-3">Guide Subjects</h3>
            
            {(Object.keys(CATEGORY_GUIDES) as GuideCategory[]).map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl transition text-left border ${
                    active
                      ? 'bg-accent-gold/[0.04] border-accent-gold/30 text-white font-semibold'
                      : 'bg-transparent border-transparent text-[#e0e0e0]/50 hover:text-white hover:bg-[#151515]/35'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#151515] flex items-center justify-center border border-white/5">
                      {CATEGORY_GUIDES[cat].icon}
                    </span>
                    <div>
                      <span className="text-xs uppercase tracking-wider font-sans block">{cat}</span>
                      <span className="text-[9px] text-white/30 font-mono mt-0.5 block truncate max-w-[130px]">{CATEGORY_GUIDES[cat].subtitle}</span>
                    </div>
                  </div>
                  <ChevronArrow active={active} />
                </button>
              );
            })}
          </div>

          <div className="bg-[#0d0d0d] border border-white/5 p-5 rounded-2xl space-y-3.5">
            <h4 className="text-[10px] font-mono text-accent-gold uppercase tracking-widest font-bold">Corporate Pledge</h4>
            <div className="flex gap-2 text-[11px] text-[#e0e0e0]/55 leading-relaxed font-light">
              <ShieldCheck className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
              <span>
                All flowers and cigar wrappers showcased in our catalog are rigorously selected from carbon-neutral regional providers matching North Carolina and federal retail codes. Perfect legal clarity and safe courier transit.
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Detailed guide visualizers */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-7xl opacity-5 pointer-events-none font-mono">
              {CATEGORY_GUIDES[activeCategory].icon}
            </div>

            <div className="space-y-2 border-b border-white/5 pb-4">
              <span className="text-[9px] font-mono text-accent-gold uppercase tracking-wider block font-bold">SUBJECT REGISTRY PROFILE</span>
              <h2 className="text-2xl font-serif italic text-white flex items-center gap-2">
                {CATEGORY_GUIDES[activeCategory].title}
              </h2>
              <p className="text-[11px] font-mono text-[#e0e0e0]/40 uppercase tracking-widest">{CATEGORY_GUIDES[activeCategory].experience}</p>
            </div>

            <p className="text-xs text-[#e0e0e0]/70 leading-relaxed font-light">{CATEGORY_GUIDES[activeCategory].primer}</p>

            {/* Sub-profiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CATEGORY_GUIDES[activeCategory].keyAspects.map((aspect, idx) => (
                <div key={idx} className="bg-[#151515] border border-white/5 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] uppercase font-mono text-accent-gold font-bold">{aspect.title}</span>
                  <p className="text-[11px] text-[#e0e0e0]/60 leading-normal font-light">{aspect.desc}</p>
                </div>
              ))}
            </div>

            {/* Expert tip section */}
            <div className="bg-accent-gold/[0.02] border border-accent-gold/20 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-accent-gold shrink-0" />
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-mono text-accent-gold/80 font-bold block">Expert Ritual Instruction</span>
                <p className="text-[11px] text-[#e0e0e0]/75 leading-relaxed font-light">
                  {CATEGORY_GUIDES[activeCategory].expertRule}
                </p>
              </div>
            </div>

            {/* Directly map products matching activeCategory so user can purchase instantly of that kind! */}
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-mono uppercase text-[#e0e0e0]/40 tracking-wider">Available items in our shops of this type</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MOCK_SHOPS.flatMap(s => s.products.map(p => ({ ...p, shop: s })))
                  .filter(item => item.category === activeCategory)
                  .slice(0, 4)
                  .map(item => (
                    <div key={item.id} className="bg-[#151515] border border-white/5 p-3.5 rounded-xl flex items-center justify-between hover:border-white/10 transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{item.imageUrl}</span>
                          <span className="text-xs text-white font-medium truncate max-w-[150px]">{item.name}</span>
                        </div>
                        <span className="text-[9px] text-[#e0e0e0]/40 font-mono uppercase block">Store: {item.shop.name}</span>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[11px] font-mono text-accent-gold font-bold">${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => onAddToCart(item, item.shop.id, item.shop.name, item.shop.address, item.shop.coords)}
                          className="px-2 py-0.5 bg-accent-gold/10 hover:bg-accent-gold hover:text-black border border-accent-gold/25 font-bold rounded text-[8px] uppercase tracking-wider text-accent-gold transition"
                        >
                          + Buy
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Interactive match advisor module */}
          <div className="bg-[#0f0e0d] border border-accent-gold/20 rounded-3xl p-6 md:p-8 space-y-6 relative">
            <div className="absolute top-4 right-4 bg-accent-gold/10 border border-accent-gold/20 rounded px-2.5 py-0.5 font-mono text-[9px] text-accent-gold uppercase tracking-widest font-bold">
              Advisor Module
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-gold animate-pulse" />
                "Match My Vibe" Interactive Assistant
              </h3>
              <p className="text-xs text-[#e0e0e0]/50 font-light">
                Answer two questions and let our expert logistics routing system match the perfect product from local shelves.
              </p>
            </div>

            {!quizResult ? (
              <div className="space-y-5">
                {/* Question 1 */}
                <div className="space-y-2">
                  <label className="text-[10px] text-[#e0e0e0]/40 uppercase tracking-widest font-mono font-bold block">1. Select your target vibe experience:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: 'relax', title: 'Relaxed / Serene', desc: 'Indica focus' },
                      { id: 'focus', title: 'Energized / Social', desc: 'Sativa clarity' },
                      { id: 'ritual', title: 'Classic Ritual', desc: 'Pre-rolls/Cigars' },
                      { id: 'portable', title: 'Discreet Portability', desc: 'Vapor devices' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setQuizVibe(item.id as any)}
                        className={`p-3.5 border rounded-xl text-center flex flex-col items-center justify-center transition ${
                          quizVibe === item.id
                            ? 'bg-accent-gold/[0.04] border-accent-gold text-white font-bold'
                            : 'bg-[#151515]/30 border-white/5 text-[#e0e0e0]/50 hover:text-white hover:bg-[#151515]/75'
                        }`}
                      >
                        <span className="text-xs font-sans block">{item.title}</span>
                        <span className="text-[8px] text-white/30 font-mono mt-0.5 block">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2 */}
                <div className="space-y-2">
                  <label className="text-[10px] text-[#e0e0e0]/40 uppercase tracking-widest font-mono font-bold block">2. Preferred consumption interface:</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {[
                      { id: 'flower', title: 'Flower / Pre-Rolls', desc: 'Pure plant material raw experience' },
                      { id: 'vape', title: 'Electronic Vaping', desc: 'Odorless temperature controlled draw' },
                      { id: 'cigar', title: 'Traditional Aged Cigar', desc: 'Pure leaf tobacco ritual flavor' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setQuizType(item.id as any)}
                        className={`p-3.5 border rounded-xl text-center flex flex-col items-center justify-center transition ${
                          quizType === item.id
                            ? 'bg-accent-gold/[0.04] border-accent-gold text-white font-bold'
                            : 'bg-[#151515]/30 border-white/5 text-[#e0e0e0]/50 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-sans block">{item.title}</span>
                        <span className="text-[8px] text-white/30 font-mono mt-0.5 block">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!quizVibe || !quizType}
                  onClick={handleRunQuiz}
                  className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-[10px] transition ${
                    quizVibe && quizType
                      ? 'bg-accent-gold text-black hover:brightness-110 shadow-lg shadow-accent-gold/10'
                      : 'bg-[#151515] text-[#e0e0e0]/20 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Generate Ideal Match Recommendation
                </button>
              </div>
            ) : (
              <div className="bg-[#151515] border border-accent-gold/30 rounded-2xl p-5 md:p-6 space-y-4 animate-scale-up">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-accent-gold/20 text-accent-gold border border-accent-gold/30 rounded font-mono text-[9px] uppercase tracking-wider font-bold">
                      MATCH ACCOMPLISHED
                    </span>
                    <h4 className="text-xl font-serif italic text-white flex items-center gap-2">
                      <span className="text-2xl">{quizResult.imageUrl}</span>
                      {quizResult.name}
                    </h4>
                    <p className="text-xs text-[#e0e0e0]/55 font-light leading-relaxed max-w-md">{quizResult.description}</p>
                  </div>

                  {/* Price info & Buy button */}
                  <div className="text-right flex flex-col items-end shrink-0 py-2 border-t md:border-t-0 border-white/10 md:pt-0 gap-1.5 justify-center">
                    <span className="text-sm font-mono text-accent-gold/50 text-[10px] uppercase block tracking-wider">Price on shelves</span>
                    <span className="text-2xl font-bold font-mono text-white">${quizResult.price.toFixed(2)}</span>
                    <span className="text-[10px] text-accent-gold font-bold font-mono bg-[#050505] border border-white/5 px-2 py-0.5 rounded-md mb-2 block">
                      🏫 {quizResultShop?.name}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={resetQuiz}
                    className="flex-1 py-3 bg-[#0d0d0d] hover:bg-[#151515] border border-white/5 text-[#e0e0e0]/80 font-bold uppercase tracking-widest text-[9px] rounded-xl transition"
                  >
                    Reset Quiz
                  </button>
                  <button
                    onClick={handleAddRecommended}
                    className="flex-1 py-3 bg-accent-gold text-black hover:brightness-110 font-bold uppercase tracking-widest text-[9px] rounded-xl transition shadow-lg shadow-accent-gold/15"
                  >
                    + Add Recommended to Basket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Small arrow icon component
function ChevronArrow({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className={`w-3.5 h-3.5 transition-transform duration-300 ${
        active ? 'text-accent-gold rotate-90' : 'text-[#e0e0e0]/20'
      }`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
