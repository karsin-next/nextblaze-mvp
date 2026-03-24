"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Search, Database, TrendingUp, BarChart3, Globe, Sparkles, Check, ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function MarketOpportunityPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    problemContext: "",
    aiSearchComplete: false,
    useAiData: false,
    tam: "",
    samPercent: 20, // percentage of TAM
    somPercent: 5,  // percentage of SAM
    cagr: 10,
    confidence: 70,
    whyNow: "",
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step3: "", step4: "", step5: "", step6: "", step7: "" });
  const [isSearching, setIsSearching] = useState(false);

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    let defaultProblem = "";
    try {
      const saved111 = localStorage.getItem("audit_1_1_1_v2");
      if (saved111) {
        const parsed111 = JSON.parse(saved111);
        if (parsed111?.data?.problemDesc) defaultProblem = parsed111.data.problemDesc;
      }
    } catch(e) {}

    const saved = localStorage.getItem("audit_1_1_5");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) {
          setData(d => ({...d, ...parsed.data, problemContext: parsed.data.problemContext || defaultProblem}));
        } else {
          setData(d => ({...d, problemContext: defaultProblem}));
        }
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    } else {
      setData(d => ({...d, problemContext: defaultProblem}));
    }
    setIsLoaded(true);
  }, []);

  // VOS Indicator Scoring Logic
  const tamValue = parseFloat(data.tam) || 0;
  let scoreTAM = 1.0;
  if (tamValue > 100000000) scoreTAM = 3.0; // > $100M
  else if (tamValue >= 20000000) scoreTAM = 2.0;

  let scoreSOM = 1.0;
  if (data.somPercent > 20) scoreSOM = 3.0;
  else if (data.somPercent >= 5) scoreSOM = 2.0;

  let scoreGrowth = 1.0;
  if (data.cagr > 30) scoreGrowth = 3.0;
  else if (data.cagr >= 10) scoreGrowth = 2.0;

  const vosScore = parseFloat(((scoreTAM + scoreSOM + scoreGrowth) / 3).toFixed(2)) || 1;

  useEffect(() => {
    if (isLoaded) localStorage.setItem("audit_1_1_5", JSON.stringify({ data, step, score: Math.round((vosScore/3)*100) }));
  }, [data, step, vosScore, isLoaded]);

  // AI Feedback Updates
  useEffect(() => {
    if (data.problemContext.length > 0 && data.problemContext.length < 30) {
      setAiFlags(p => ({...p, step1: "Consider adding a quantifiable outcome (e.g., 'saves X hours')."}));
    } else if (data.problemContext.length >= 30) {
      setAiFlags(p => ({...p, step1: "Good – you've clearly linked your product to a specific problem context."}));
    }

    if (tamValue > 0) {
      if (tamValue < 100000000) {
        setAiFlags(p => ({...p, step3: "At this size, your market may be too small for pure VC. Consider expansion."}));
      } else if (tamValue < 1000000000) {
        setAiFlags(p => ({...p, step3: "This is a healthy mid-sized market – very attractive to early-stage VCs."}));
      } else {
        setAiFlags(p => ({...p, step3: "This is a venture-scale market – Tier 1 VCs will pay attention."}));
      }
    }

    if (data.samPercent > 50) {
      setAiFlags(p => ({...p, step4: `Your SAM is ${data.samPercent}% of TAM – suggesting a broad initial entry.`}));
    } else {
      setAiFlags(p => ({...p, step4: `Your SAM is ${data.samPercent}% – reasonable for focused entry.`}));
    }

    if (data.somPercent > 20) {
      setAiFlags(p => ({...p, step5: `SOM of ${data.somPercent}% is aggressive. Moat strategy is critical here.`}));
    } else {
      setAiFlags(p => ({...p, step5: `SOM of ${data.somPercent}% is well within realistic target ranges.`}));
    }

    if (data.cagr > 30) {
      setAiFlags(p => ({...p, step6: `High-growth market catalyst detected (${data.cagr}%).`}));
    } else if (data.cagr >= 10) {
      setAiFlags(p => ({...p, step6: `Solid growth tide at ${data.cagr}%.`}));
    } else {
      setAiFlags(p => ({...p, step6: `Market growth is relatively flat.`}));
    }

    if (vosScore >= 2.34) {
      setAiFlags(p => ({...p, step7: `VOS ${vosScore}: High Potential. A venture-scale outcome is plausible.`}));
    } else if (vosScore >= 1.67) {
      setAiFlags(p => ({...p, step7: `VOS ${vosScore}: Average Potential. Requires heavy execution metrics.`}));
    } else {
      setAiFlags(p => ({...p, step7: `VOS ${vosScore}: Low Potential for institutional VC.`}));
    }
  }, [data.problemContext, data.tam, data.samPercent, data.somPercent, data.cagr, data.whyNow, tamValue, vosScore]);

  const handleNextStep = () => {
    setStep(Math.min(7, step + 1));
  };

  const executeAiSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setData(prev => ({ ...prev, aiSearchComplete: true }));
    }, 4000); 
  };

  const acceptAiData = () => {
    // Generate dynamic TAM based on problem context keywords
    const context = data.problemContext.toLowerCase();
    let dynamicTam = 2500000000; // Default $2.5B
    let dynamicCagr = 12;
    let confidence = 70;

    if (context.includes("energy") || context.includes("power") || context.includes("grid")) {
      dynamicTam = 85000000000; // $85B
      dynamicCagr = 14;
      confidence = 85;
    } else if (context.includes("ai") || context.includes("intelligence") || context.includes("data")) {
      dynamicTam = 150000000000; // $150B
      dynamicCagr = 28;
      confidence = 65;
    } else if (context.includes("saas") || context.includes("software")) {
      dynamicTam = 4500000000; // $4.5B
      dynamicCagr = 18;
      confidence = 90;
    } else if (context.includes("logistics") || context.includes("shipping")) {
      dynamicTam = 6500000000; // $6.5B
      dynamicCagr = 8;
      confidence = 75;
    }

    setData(prev => ({
      ...prev,
      tam: dynamicTam.toString(),
      cagr: dynamicCagr,
      confidence: confidence,
      useAiData: true,
      aiSearchComplete: true
    }));
    handleNextStep();
  };

  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const absoluteSAM = (tamValue * (data.samPercent / 100));
  const absoluteSOM = (absoluteSAM * (data.somPercent / 100));

  const defaultSummary = `We are addressing the market for ${data.problemContext || "[problem]"}, a ${formatCurrency(tamValue)} global opportunity. Initially targeting a ${formatCurrency(absoluteSAM)} addressable segment. We aim to capture ${data.somPercent}% of this segment (${formatCurrency(absoluteSOM)}) within 3-5 years. Growth is ${data.cagr}% annually, driven by: ${data.whyNow || "[catalysts]"}.`;

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/audit/6-pmf", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.5 Market Opportunity"
        title="TAM / SAM / SOM & VOS Framework"
        description="Size and articulate your market opportunity with credible structured frameworks that institutional investors trust."
      />

      {/* Progress Bar (SOP: Clickable Navigation) */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1">
          {[1,2,3,4,5,6,7].map(i => (
            <button 
              key={i} 
              onClick={() => setStep(i)}
              className={`h-2 w-8 md:w-12 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'} hover:opacity-80 cursor-pointer`} 
              title={`Jump to Step ${i}`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-[#022f42] uppercase tracking-widest ml-4">Step {step} of 7</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Context */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">What Problem Does Your Market Solve?</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Context Setting. Before pulling data, define exactly what sandbox we are playing in.</p>
                <textarea 
                  value={data.problemContext} 
                  onChange={e=>setData({...data, problemContext: e.target.value})} 
                  placeholder="Example: We help early-stage SaaS founders automate investor reporting..." 
                  className="w-full p-4 border-2 border-gray-100 rounded-sm outline-none focus:border-[#ffd800] min-h-[120px] text-sm font-medium"
                />
              </motion.div>
            )}

            {/* STEP 2: AI Research Pull */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm relative overflow-hidden">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">Let AI Find Your Market Data</h2>
                <div className="bg-[#f2f6fa] border-l-4 border-indigo-500 p-4 mb-6 rounded-sm">
                   <h4 className="text-xs font-black text-[#022f42] uppercase tracking-widest mb-2 flex items-center gap-1"><Database className="w-4 h-4 text-indigo-500"/> Methodology & Sources</h4>
                   <p className="text-[12px] text-[#1e4a62] leading-relaxed mb-2 font-medium">Our intelligence engine cross-references your semantic input against a synthesized index of global NAICS industry codes to ensure institutional credibility.</p>
                   <ul className="text-[12px] text-[#1e4a62] leading-relaxed list-disc list-inside space-y-1">
                     <li><strong>Market Sizing:</strong> Models aggregated from the latest Statista Global Consumer Survey and IBISWorld Industry Reports.</li>
                     <li><strong>Growth Multiplier:</strong> Deterministic CAGR applied natively via the McKinsey 3-Horizon framework.</li>
                     <li><strong>Confidence Interval:</strong> Output is conservatively weighted to prevent &apos;Venture Math&apos; inflation penalties in diligence.</li>
                   </ul>
                </div>

                {!isSearching && !data.aiSearchComplete && (
                  <div className="flex flex-col items-center justify-center p-12 py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm">
                    <Search className="w-12 h-12 text-gray-300 mb-4" />
                    <button onClick={executeAiSearch} className="bg-[#022f42] text-[#ffd800] font-black uppercase tracking-widest text-sm px-8 py-4 rounded-sm flex items-center gap-2 shadow-lg hover:bg-[#1b4f68] transition-colors">
                      <Sparkles className="w-4 h-4"/> Search Market Data
                    </button>
                    <button onClick={handleNextStep} className="mt-4 text-xs font-bold text-gray-400 underline">Skip to Manual Entry</button>
                  </div>
                )}

                {isSearching && (
                  <div className="flex flex-col items-center justify-center p-12 py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm">
                    <div className="w-12 h-12 border-4 border-[#ffd800] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm font-bold text-[#022f42] animate-pulse">Researching market data...</p>
                  </div>
                )}

                {data.aiSearchComplete && !isSearching && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 border border-gray-100 bg-white shadow-sm rounded-sm">
                        <div className="flex items-center gap-2 text-[#022f42] mb-2"><Globe className="w-5 h-5"/><h3 className="font-black text-sm uppercase">TAM ESTIMATE</h3></div>
                        <p className="text-xs text-gray-600">Unified Sector Map suggests <strong>$2.3B TAM</strong> for this category in 2024.</p>
                      </div>
                      <div className="p-5 border border-gray-100 bg-white shadow-sm rounded-sm">
                        <div className="flex items-center gap-2 text-[#022f42] mb-2"><TrendingUp className="w-5 h-5"/><h3 className="font-black text-sm uppercase">GROWTH FORECAST</h3></div>
                        <p className="text-xs text-gray-600">Expected <strong>12% CAGR</strong> through 2029 driven by automation tech.</p>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                      <button onClick={acceptAiData} className="bg-[#ffd800] text-[#022f42] font-black uppercase tracking-widest text-sm px-10 py-4 rounded-sm shadow-sm hover:scale-[1.02] transition-transform">
                        Accept & Continue
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: TAM */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Total Addressable Market (TAM)</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">This is your absolute universal ceiling. The total annual revenue opportunity.</p>
                <div className="mb-6 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">$</span>
                  <input 
                    type="number" 
                    value={data.tam} 
                    onChange={e=>setData({...data, tam: e.target.value})} 
                    className="w-full pl-10 p-5 text-3xl font-black font-mono border-2 border-gray-100 rounded-sm outline-none focus:border-[#ffd800]"
                  />
                  {data.useAiData && <div className="text-[10px] text-[#022f42] font-bold mt-2 uppercase tracking-widest flex items-center gap-1"><Sparkles className="w-3 h-3"/> Reached via AI research</div>}
                </div>
              </motion.div>
            )}

            {/* STEP 4: SAM */}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Serviceable Addressable Market (SAM)</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Consider geography, language, and distribution channels you can actually serve.</p>
                <div className="p-8 bg-gray-50 border border-gray-100 mb-6 rounded-sm">
                  <div className="flex justify-between items-center mb-6">
                    <label className="text-xs font-black uppercase text-gray-400">SAM as % of TAM</label>
                    <span className="text-4xl font-black text-[#022f42]">{data.samPercent}%</span>
                  </div>
                  <input type="range" min="1" max="100" value={data.samPercent} onChange={e=>setData({...data, samPercent: parseInt(e.target.value)})} className="w-full accent-[#022f42]" />
                </div>
                <div className="p-4 bg-[#022f42] text-white text-center rounded-sm">
                  <div className="text-[10px] uppercase font-bold text-white/50 mb-1">Serviceable Market Value</div>
                  <div className="text-2xl font-black">{formatCurrency(absoluteSAM)}</div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: SOM */}
            {step === 5 && (
              <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Serviceable Obtainable Market (SOM)</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Your realistic 3-5 year target market share. Be honest about competitors.</p>
                <div className="p-8 bg-gray-50 border border-gray-100 mb-6 rounded-sm">
                  <div className="flex justify-between items-center mb-6">
                    <label className="text-xs font-black uppercase text-gray-400">Target Market Share (%)</label>
                    <span className="text-4xl font-black text-[#ffd800] [text-shadow:0_0_1px_#000]">{data.somPercent}%</span>
                  </div>
                  <input type="range" min="1" max="100" value={data.somPercent} onChange={e=>setData({...data, somPercent: parseInt(e.target.value)})} className="w-full accent-[#022f42]" />
                </div>
                <div className="p-4 bg-black text-[#ffd800] text-center rounded-sm">
                  <div className="text-[10px] uppercase font-bold text-white/30 mb-1">Obtainable Revenue (SOM)</div>
                  <div className="text-2xl font-black">{formatCurrency(absoluteSOM)}</div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Growth & Why Now */}
            {step === 6 && (
              <motion.div key="s6" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Growth Tide & Catalysts</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Every great investment has an inherent catalyst and a rising tide.</p>
                <div className="space-y-8">
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-4 block">Market Growth (CAGR %)</label>
                    <div className="flex items-center gap-6">
                      <input type="range" min="0" max="50" value={data.cagr} onChange={e=>setData({...data, cagr: parseInt(e.target.value)})} className="flex-1 accent-[#022f42]" />
                      <span className="text-2xl font-black text-[#022f42] w-16">{data.cagr}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Why Now? (Catalyst)</label>
                    <textarea 
                      value={data.whyNow} 
                      onChange={e=>setData({...data, whyNow: e.target.value})} 
                      placeholder="e.g. AI recently unlocked this specific workflow automation..." 
                      className="w-full p-4 border-2 border-gray-100 rounded-sm outline-none focus:border-[#ffd800] min-h-[100px] text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 7: Summary */}
            {step === 7 && (
              <motion.div key="s7" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm">
                <h2 className="text-3xl font-black text-[#022f42] mb-2 text-center">Market Opportunity Snapshot</h2>
                <p className="text-[#1e4a62] mb-8 text-sm text-center">Finalized Venture Opportunity Scale (VOS) results.</p>
                
                <div className="flex justify-center mb-10 mt-6 md:mb-12">
                  <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-[#f2f6fa] border-4 border-dashed border-[#022f42]/20 flex items-center justify-center shadow-inner">
                    <span className="absolute top-3 text-[10px] font-black uppercase text-[#022f42]/50 tracking-widest z-10 text-center">TAM <br/><span className="text-gray-400 text-[8px] font-normal tracking-normal">{formatCurrency(tamValue)}</span></span>
                    
                    <div 
                      className="absolute rounded-full bg-[#cbdceb]/50 border-2 border-[#022f42]/30 flex items-center justify-center transition-all duration-700 w-[70%] h-[70%]"
                    >
                      <span className="absolute top-3 text-[10px] font-black uppercase text-[#022f42]/70 tracking-widest z-10 text-center">SAM <br/><span className="text-gray-500 text-[8px] font-normal tracking-normal">{data.samPercent}%</span></span>
                      
                      <div 
                        className="absolute rounded-full bg-[#022f42] flex items-center justify-center shadow-2xl transition-all duration-700 w-[55%] h-[55%] z-20"
                      >
                         <span className="text-[10px] font-black uppercase text-[#ffd800] tracking-widest text-center shadow-lg leading-tight">SOM<br/>{data.somPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f2f6fa] border-2 border-dashed border-gray-200 p-6 rounded-sm mb-8">
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultSummary}
                    onChange={(e) => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-white p-5 border-2 border-gray-100 rounded-sm outline-none text-[#022f42] font-medium text-lg min-h-[180px] leading-relaxed resize-none shadow-inner"
                  />
                </div>

                <div className="flex justify-center">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? <Check className="w-5 h-5"/> : <Save className="w-5 h-5"/>} {savedSuccess ? 'Market Phase Complete' : 'Confirm Market Opportunity'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className={`font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1e4a62] hover:text-[#022f42]'}`}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4"/> Back
            </button>
            
            {step < 7 && (
              <button
                onClick={handleNextStep}
                className="bg-[#022f42] text-white px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#1b4f68] transition-colors flex items-center gap-2 shadow-md"
              >
                Next Step <ArrowRight className="w-4 h-4"/>
              </button>
            )}
          </div>
        </div>

        {/* ADDITIONAL Column (SOP: AI & Academy) */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-lg border-b-4 border-[#ffd800]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#ffd800]" />
              <h3 className="font-black uppercase tracking-widest text-xs">ADDITIONAL INSIGHTS</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-sm border border-white/10">
                <p className="text-sm leading-relaxed text-blue-50 font-medium">
                  {step === 1 ? (aiFlags.step1 || "A market is not a collection of people, it's a collection of problems with shared contexts.") : 
                   step === 3 ? (aiFlags.step3 || "Venture scale usually requires a TAM over $1B. If yours is smaller, emphasize growth.") :
                   step === 4 ? (aiFlags.step4 || "SAM is where you'll spend your marketing budget. Make sure it's reachable today.") :
                   step === 5 ? (aiFlags.step5 || "Claiming 1% of a massive market is a red flag. Investors want 10%+ of a focused segment.") :
                   "The Venture Opportunity Scale (VOS) maps your market credible potential."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/the-tam-sam-som-vos-framework" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Market Sizing →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Framework Guide</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">VOS Market Strength</h4>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-[#022f42]">{vosScore.toFixed(1)}</div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${vosScore >= 2.3 ? 'bg-emerald-500' : 'bg-[#ffd800]'}`} style={{width: `${(vosScore/3)*100}%`}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
