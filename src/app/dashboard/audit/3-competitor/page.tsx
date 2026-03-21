"use client";

import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, AlertCircle, ArrowRight, ExternalLink, ChevronRight, 
  Swords, TrendingUp, Target, Crosshair, Sparkles
} from "lucide-react";
import Link from "next/link";

export default function SwotAnalyzerPage() {
  const [step, setStep] = useState<"swot" | "grid" | "result">("swot");

  // SWOT State
  const [swot, setSwot] = useState({
    S: "", W: "", O: "", T: ""
  });

  // Grid State
  const [competitors, setCompetitors] = useState([
    { name: "Competitor A", price: 20, features: 30 },
    { name: "Competitor B", price: 80, features: 60 }
  ]);
  const [you, setYou] = useState({ price: 60, features: 85 });

  const isSwotReady = swot.S.length > 5 && swot.W.length > 5 && swot.O.length > 5 && swot.T.length > 5;

  // AI Assessment Simulation
  const getDifferentiationScore = () => {
    // Basic logic: Higher features, balanced price = better score
    let score = you.features;
    if (you.price > 70 && you.features < 50) score -= 30; // High price, low features
    if (swot.O.length > 20) score += 10;
    return Math.min(Math.max(score, 10), 99);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.1.3 SWOT & Moat Analyzer"
        title="SWOT & Moat Analyzer"
        description="Assess your competitive landscape and differentiate your unique value proposition. Investors want to know exactly why you win and what prevents others from eating your lunch."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Interactive Area */}
        <div className="flex-1 space-y-6">
          
          <AnimatePresence mode="wait">
            {/* STEP 1: SWOT */}
            {step === "swot" && (
              <motion.div 
                key="swot"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#022f42] rounded-sm"
              >
                <div className="flex items-center gap-2 mb-8 border-b pb-4 border-[#1e4a62]/10">
                  <Shield className="w-5 h-5 text-[#ffd800]" />
                  <h2 className="text-xl font-black text-[#022f42]">Define Your Strategic Quadrants</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* S */}
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-sm">
                    <label className="block text-sm font-black text-emerald-900 mb-2 uppercase tracking-widest">Strengths (Internal)</label>
                    <textarea 
                      value={swot.S} onChange={e => setSwot({...swot, S: e.target.value})}
                      placeholder="e.g. Proprietary algorithm, exclusive data partnerships..."
                      className="w-full text-sm p-3 border-2 border-emerald-200 focus:border-emerald-500 rounded-sm outline-none resize-none h-24"
                    />
                  </div>
                  {/* W */}
                  <div className="bg-rose-50 border border-rose-100 p-4 rounded-sm">
                    <label className="block text-sm font-black text-rose-900 mb-2 uppercase tracking-widest">Weaknesses (Internal)</label>
                    <textarea 
                      value={swot.W} onChange={e => setSwot({...swot, W: e.target.value})}
                      placeholder="e.g. Small team, lack of brand awareness, no mobile app..."
                      className="w-full text-sm p-3 border-2 border-rose-200 focus:border-rose-500 rounded-sm outline-none resize-none h-24"
                    />
                  </div>
                  {/* O */}
                  <div className="bg-sky-50 border border-sky-100 p-4 rounded-sm">
                    <label className="block text-sm font-black text-sky-900 mb-2 uppercase tracking-widest">Opportunities (External)</label>
                    <textarea 
                      value={swot.O} onChange={e => setSwot({...swot, O: e.target.value})}
                      placeholder="e.g. New ESG regulations, competitor XYZ going bankrupt..."
                      className="w-full text-sm p-3 border-2 border-sky-200 focus:border-sky-500 rounded-sm outline-none resize-none h-24"
                    />
                  </div>
                  {/* T */}
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-sm">
                    <label className="block text-sm font-black text-amber-900 mb-2 uppercase tracking-widest">Threats (External)</label>
                    <textarea 
                      value={swot.T} onChange={e => setSwot({...swot, T: e.target.value})}
                      placeholder="e.g. Google entering the space, impending recession..."
                      className="w-full text-sm p-3 border-2 border-amber-200 focus:border-amber-500 rounded-sm outline-none resize-none h-24"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep("grid")}
                  disabled={!isSwotReady}
                  className={`w-full py-4 font-bold text-sm tracking-widest uppercase transition-all shadow-sm rounded-sm flex items-center justify-center gap-2 ${
                    !isSwotReady 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-[#022f42] text-white hover:bg-[#1b4f68] hover:shadow-md"
                  }`}
                >
                  Continue to Positioning Map <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: 2x2 GRID */}
            {step === "grid" && (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#022f42] rounded-sm"
              >
                <div className="flex items-center gap-2 mb-8 border-b pb-4 border-[#1e4a62]/10">
                  <Crosshair className="w-5 h-5 text-[#ffd800]" />
                  <h2 className="text-xl font-black text-[#022f42]">Competitive Positioning Map</h2>
                </div>

                <p className="text-[#1e4a62] text-sm mb-6">Map your position against 2 major competitors using the sliders below. We evaluate based on Price vs. Feature Depth.</p>

                <div className="flex flex-col md:flex-row gap-8 mb-10">
                  {/* Sliders Area */}
                  <div className="flex-1 space-y-6">
                    {competitors.map((comp, idx) => (
                      <div key={idx} className="bg-[#f2f6fa] p-4 rounded-sm border border-[#1e4a62]/10">
                        <input 
                          type="text" value={comp.name} 
                          onChange={(e) => {
                            const newC = [...competitors];
                            newC[idx].name = e.target.value;
                            setCompetitors(newC);
                          }}
                          className="font-bold text-[#022f42] bg-transparent border-b border-[#1e4a62]/20 outline-none w-full mb-4 focus:border-[#ffd800]"
                        />
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-[#1e4a62] flex justify-between">
                            Price (Low → Premium) <span>{comp.price}</span>
                          </label>
                          <input type="range" min="0" max="100" value={comp.price} 
                            onChange={(e) => {
                              const newC = [...competitors];
                              newC[idx].price = parseInt(e.target.value);
                              setCompetitors(newC);
                            }}
                            className="w-full accent-[#1e4a62]"
                          />
                          <label className="text-xs font-bold text-[#1e4a62] flex justify-between mt-2">
                            Features (Basic → Advanced) <span>{comp.features}</span>
                          </label>
                          <input type="range" min="0" max="100" value={comp.features} 
                            onChange={(e) => {
                              const newC = [...competitors];
                              newC[idx].features = parseInt(e.target.value);
                              setCompetitors(newC);
                            }}
                            className="w-full accent-[#1e4a62]"
                          />
                        </div>
                      </div>
                    ))}

                    {/* YOU */}
                    <div className="bg-[#022f42] p-4 rounded-sm border-2 border-[#ffd800] shadow-md relative">
                      <div className="absolute -top-3 right-4 bg-[#ffd800] text-[#022f42] text-[10px] font-black uppercase px-2 py-0.5 tracking-widest">You</div>
                      <div className="font-bold text-white mb-4">Your Startup</div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#b0d0e0] flex justify-between">
                          Price (Low → Premium) <span>{you.price}</span>
                        </label>
                        <input type="range" min="0" max="100" value={you.price} onChange={e => setYou({...you, price: parseInt(e.target.value)})} className="w-full accent-[#ffd800]" />
                        
                        <label className="text-xs font-bold text-[#b0d0e0] flex justify-between mt-2">
                          Features (Basic → Advanced) <span>{you.features}</span>
                        </label>
                        <input type="range" min="0" max="100" value={you.features} onChange={e => setYou({...you, features: parseInt(e.target.value)})} className="w-full accent-[#ffd800]" />
                      </div>
                    </div>
                  </div>

                  {/* Graph Render */}
                  <div className="flex-1 min-h-[300px] border-2 border-gray-100 rounded-sm relative bg-gray-50 flex items-center justify-center p-4">
                    {/* Axes */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-px bg-gray-300"></div>
                      <div className="h-full w-px bg-gray-300 absolute"></div>
                    </div>
                    {/* Axis Labels */}
                    <span className="absolute top-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Premium Price</span>
                    <span className="absolute bottom-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Low Price</span>
                    <span className="absolute right-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest" style={{writingMode: 'vertical-rl'}}>Advanced Features</span>
                    <span className="absolute left-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest transform rotate-180" style={{writingMode: 'vertical-rl'}}>Basic Features</span>

                    {/* Points */}
                    <div className="absolute inset-8">
                      {competitors.map((comp, i) => (
                        <div key={i} className="absolute w-3 h-3 bg-gray-400 rounded-full flex flex-col items-center group" 
                          style={{ left: `${comp.features}%`, bottom: `${comp.price}%`, transform: 'translate(-50%, 50%)' }}>
                          <span className="absolute -top-6 text-[10px] font-bold text-gray-500 whitespace-nowrap bg-white px-1 shadow-sm rounded-sm z-10">{comp.name}</span>
                        </div>
                      ))}
                      <motion.div 
                        animate={{ left: `${you.features}%`, bottom: `${you.price}%` }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="absolute w-5 h-5 bg-[#ffd800] border-2 border-[#022f42] rounded-full flex flex-col items-center z-20" 
                        style={{ transform: 'translate(-50%, 50%)' }}
                      >
                         <span className="absolute -top-7 text-xs font-black text-[#022f42] whitespace-nowrap bg-[#ffd800] px-2 py-0.5 shadow-md rounded-sm">YOU</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep("swot")} className="px-6 py-4 font-bold text-sm tracking-widest uppercase transition-colors border-2 border-[#1e4a62]/20 text-[#1e4a62] hover:bg-[#f2f6fa] rounded-sm">
                    Back
                  </button>
                  <button onClick={() => setStep("result")} className="flex-1 py-4 font-bold text-sm tracking-widest uppercase transition-all shadow-sm rounded-sm flex items-center justify-center gap-2 bg-[#ffd800] text-[#022f42] hover:bg-[#fff09e] hover:shadow-md">
                    <Sparkles className="w-4 h-4" /> Generate Moat Analysis
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: RESULTS */}
            {step === "result" && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-emerald-500 rounded-sm"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
                  <div>
                    <h2 className="text-3xl font-black text-[#022f42] mb-2">Competitive Moat Analysis</h2>
                    <p className="text-[#1e4a62]">Your strategic differentiators have been processed.</p>
                  </div>
                  <div className="bg-[#f2f6fa] p-4 rounded-sm border border-[#1e4a62]/10 min-w-[150px] text-center shadow-inner">
                    <div className="text-[10px] uppercase font-black tracking-widest text-[#1e4a62] mb-1">Differentiation Score</div>
                    <div className="text-4xl font-black text-[#022f42]">{getDifferentiationScore()}<span className="text-xl text-gray-400">/100</span></div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* AI Commentary from Backbone */}
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-sm relative">
                    <h4 className="flex items-center gap-2 text-emerald-800 font-bold mb-3">
                      <Sparkles className="w-5 h-5 text-emerald-600" /> AI Strategic Commentary
                    </h4>
                    <p className="text-[#022f42] font-medium leading-relaxed">
                      &quot;Your strengths in <span className="bg-white px-1 underline decoration-emerald-300">internal operations</span> align perfectly with the external market trend regarding <span className="bg-white px-1 underline decoration-emerald-300">{swot.O.substring(0, 30)}...</span>.
                      <br/><br/>
                      By positioning yourself with higher features than <strong>{competitors[0].name}</strong>, you carve out a highly defensible &apos;white space&apos; in the premium-tier market. Highlight this alignment in your pitch.&quot;
                    </p>
                  </div>

                  {/* AI Flags from Backbone */}
                  {swot.O.length < 20 && (
                    <div className="bg-rose-50 border border-rose-200 p-5 rounded-sm">
                      <h4 className="flex items-center gap-2 text-rose-800 font-bold mb-2">
                        <AlertCircle className="w-4 h-4 text-rose-600" /> Vulnerability Flagged
                      </h4>
                      <p className="text-sm text-rose-700">
                        You listed very few specific Opportunities. External tailwinds (e.g. changing laws, market shifts) are critical elements for growth stories. VCs back companies riding massive waves, not just building good surfboards.
                      </p>
                    </div>
                  )}

                  <div className="pt-6 flex gap-4">
                    <button onClick={() => setStep("grid")} className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest border border-[#1e4a62]/20 px-6 py-3 hover:bg-[#f2f6fa] transition-colors rounded-sm">
                      Edit Data
                    </button>
                    <Link href="/dashboard/audit/4-product" className="bg-[#022f42] text-white px-6 py-3 font-bold text-sm uppercase tracking-widest w-full text-center hover:bg-[#1b4f68] transition-colors shadow-md rounded-sm">
                      Next: 1.1.4 Product Readiness
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Actionable Sidebar (Content Backbone) */}
        <div className="lg:w-[350px] space-y-4">
          <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-md">
            <h3 className="flex items-center gap-2 font-bold mb-4 text-[#ffd800]">
              <Swords className="w-5 h-5" /> VC Perspective
            </h3>
            <p className="text-sm text-[#b0d0e0] leading-relaxed mb-4">
              Investors aren&apos;t just looking for your features; they are looking for your <strong>Moat</strong>.
            </p>
            <div className="space-y-3">
              <div className="text-xs bg-white/5 p-3 rounded-sm border border-white/10 group hover:border-[#ffd800]/50 transition-colors">
                <span className="font-bold text-white block mb-1">What is a Moat?</span>
                <span className="text-white/60">A moat is the structural advantage that prevents competitors from eating your lunch (e.g., Network Effects, High Switching Costs, IP).</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard/academy/building-a-sustainable-moat" className="group block bg-white border border-[#1e4a62]/10 p-5 rounded-sm hover:border-[#ffd800] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ffd800] bg-[#ffd800]/10 px-2 py-0.5 rounded-sm">Academy Guide</span>
              <ExternalLink className="w-3 h-3 text-[#1e4a62]/40 group-hover:text-[#ffd800]" />
            </div>
            <h4 className="font-bold text-[#022f42] group-hover:text-[#1b4f68] mb-1">Building a Sustainable Moat (5-min Case Study)</h4>
            <p className="text-xs text-[#1e4a62] flex items-center gap-1">Read the methodology <ChevronRight className="w-3 h-3" /></p>
          </Link>
        </div>
      </div>
    </div>
  );
}
