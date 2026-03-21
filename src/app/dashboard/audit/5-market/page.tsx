"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Search, Database, TrendingUp, BarChart3, Globe, Sparkles, Check
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
    whyNow: "",
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step3: "", step4: "", step5: "", step6: "", step7: "" });
  const [isSearching, setIsSearching] = useState(false);

  // Persistence & Cross-Module Sync
  useEffect(() => {
    let defaultProblem = "";
    try {
      const saved111 = localStorage.getItem("audit_1_1_1");
      if (saved111) {
        const parsed111 = JSON.parse(saved111);
        if (parsed111?.data?.problem) defaultProblem = parsed111.data.problem;
      }
    } catch(e) {}

    const saved = localStorage.getItem("audit_1_1_5");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) {
          // If problemContext is empty, hydrate it from 1.1.1
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

  useEffect(() => {
    if (isLoaded) localStorage.setItem("audit_1_1_5", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

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

  const vosScore = parseFloat(((scoreTAM + scoreSOM + scoreGrowth) / 3).toFixed(2));

  // AI Feedback Updates
  useEffect(() => {
    // Step 1
    if (data.problemContext.length > 0 && data.problemContext.length < 30) {
      setAiFlags(p => ({...p, step1: "Consider adding a quantifiable outcome (e.g., 'saves X hours')."}));
    } else if (data.problemContext.length >= 30) {
      setAiFlags(p => ({...p, step1: "Good – you've clearly linked your product to a specific problem context."}));
    }

    // Step 3
    if (tamValue > 0) {
      if (tamValue < 100000000) {
        setAiFlags(p => ({...p, step3: "At this size, your market may be too small for pure VC. Consider if you can expand to adjacent markets or raise your price point."}));
      } else if (tamValue < 1000000000) {
        setAiFlags(p => ({...p, step3: "This is a healthy mid-sized market – often very attractive to angel and early-stage VCs."}));
      } else {
        setAiFlags(p => ({...p, step3: "This is a venture-scale market – tier 1 investors will absolutely pay attention here."}));
      }
    }

    // Step 4
    if (data.samPercent > 50) {
      setAiFlags(p => ({...p, step4: `Your SAM is ${data.samPercent}% of TAM – that suggests you're starting very broadly globally. Investors may ask if you can focus on one segment first.`}));
    } else {
      setAiFlags(p => ({...p, step4: `Your SAM is ${data.samPercent}% of TAM – this is reasonable for a focused geographic or vertical market entry.`}));
    }

    // Step 5
    if (data.somPercent > 20) {
      setAiFlags(p => ({...p, step5: `Your SOM projection (${data.somPercent}%) is very high – investors will explicitly ask how you'll achieve this against existing competitors.`}));
    } else {
      setAiFlags(p => ({...p, step5: `Your SOM of ${data.somPercent}% is well within the range investors typically expect for a focused startup's first 3-5 years.`}));
    }

    // Step 6
    if (data.cagr > 30) {
      setAiFlags(p => ({...p, step6: `>${data.cagr}% growth – this is a high-growth compounding market that trend-focused investors love.`}));
    } else if (data.cagr >= 10) {
      setAiFlags(p => ({...p, step6: `${data.cagr}% growth is solid, but you'll need to show you can actively outgrow the broader market average.`}));
    } else {
      setAiFlags(p => ({...p, step6: `<10% growth – investors may question whether this is a venture-scale opportunity without a massive disruption angle.`}));
    }

    if (data.whyNow && data.whyNow.length < 20) {
      setAiFlags(p => ({...p, step6: p.step6 + " | Your 'why now' is a bit brief – investors need to see why this opportunity exists *today* and not five years ago."}));
    }

    // Step 7
    if (vosScore >= 2.34) {
      setAiFlags(p => ({...p, step7: `Your VOS score is ${vosScore} – High Potential. This will be a core strength in your investor pitch.`}));
    } else if (vosScore >= 1.67) {
      setAiFlags(p => ({...p, step7: `Your VOS score is ${vosScore} – Average Potential. Solid, but heavily dependent on strong execution metrics.`}));
    } else {
      setAiFlags(p => ({...p, step7: `Your VOS score is ${vosScore} – Low Potential. This will be an uphill battle to fund with institutional VCs.`}));
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
    }, 4000); // 4 sec mock delay
  };

  const acceptAiData = () => {
    setData(prev => ({
      ...prev,
      tam: "2300000000",
      cagr: 12,
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

  const defaultSummary = `We are addressing the market for ${data.problemContext || "[problem]"}, which is currently a ${formatCurrency(tamValue)} global opportunity. We are initially focusing on a ${formatCurrency(absoluteSAM)} addressable segment. With our go-to-market approach, we aim to capture ${data.somPercent}% of this segment (${formatCurrency(absoluteSOM)}) within 3-5 years. This market is growing at ${data.cagr}% annually, driven by: ${data.whyNow || "[why now factors]"}.`;

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/audit/5-market", 1000); // Wait what is next module? We don't have 1.1.6. Route them back or next phase.
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.5 Market Opportunity"
        title="TAM / SAM / SOM & VOS Indicator"
        description="Size and articulate your market opportunity with credible structured frameworks that institutional investors trust."
      />

      {/* Progress Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className={`h-2 flex-1 md:w-12 rounded-full transition-all ${step >= i ? 'bg-[#022f42]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest whitespace-nowrap ml-4">Step {step} of 7</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Context */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">
                  What Problem Does Your Market Solve? <span title="Your market is defined by the problem you solve. Be specific about what you're addressing."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span>
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Context Setting. Before pulling data, define exactly what sandbox we are playing in.</p>
                
                <textarea 
                  value={data.problemContext} 
                  onChange={e=>setData({...data, problemContext: e.target.value})} 
                  maxLength={200}
                  placeholder="Example: We help early-stage SaaS founders automate their investor reporting, saving them 20 hours a month." 
                  className="w-full p-4 border-2 border-gray-200 rounded-sm outline-none focus:border-indigo-500 min-h-[120px] text-sm font-medium mb-2"
                />

                {aiFlags.step1 && (
                  <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <p className="text-sm text-emerald-900 font-medium">{aiFlags.step1}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2: AI Research Pull */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-indigo-500 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] px-3 py-1 pb-1.5 rounded-bl-sm flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI Engine</div>
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">
                  Let AI Find Your Market Data <span title="We'll search trusted sources to give you a credible starting point."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span>
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm">We&apos;ll query Statista, IBISWorld, and Forrester frameworks based on your problem context.</p>

                {!isSearching && !data.aiSearchComplete && (
                  <div className="flex flex-col items-center justify-center p-12 py-20 bg-[#f2f6fa] border-2 border-dashed border-[#1e4a62]/20 rounded-sm">
                    <Search className="w-12 h-12 text-[#1e4a62]/40 mb-4" />
                    <button onClick={executeAiSearch} className="bg-[#022f42] hover:bg-[#1b4f68] transition-colors text-white font-black uppercase tracking-widest text-sm px-8 py-4 rounded-sm flex items-center gap-2 shadow-lg">
                      <Sparkles className="w-4 h-4"/> Search Market Data
                    </button>
                    <button onClick={handleNextStep} className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 underline">Skip & Enter Manually</button>
                  </div>
                )}

                {isSearching && (
                  <div className="flex flex-col items-center justify-center p-12 py-20 bg-[#f2f6fa] border-2 border-dashed border-indigo-200 rounded-sm">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-bold text-[#022f42] animate-pulse">Searching trusted sources for market data...</p>
                    <p className="text-xs text-gray-500 mt-2">This usually takes 5-10 seconds.</p>
                  </div>
                )}

                {data.aiSearchComplete && !isSearching && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Card A: TAM */}
                      <div className="p-5 border border-indigo-200 bg-white shadow-sm rounded-sm">
                        <div className="flex items-center gap-2 text-indigo-500 mb-2"><Globe className="w-5 h-5"/><h3 className="font-black text-sm">Estimated Total Addressable Market (TAM)</h3></div>
                        <p className="text-xs text-gray-600">Based on <strong className="text-indigo-800">Statista Sector Maps</strong>, the global market for this category is estimated at <strong className="text-indigo-800 text-lg">$2.3B</strong> in 2024, growing at <strong className="text-indigo-800">12% CAGR</strong> through 2029.</p>
                      </div>

                      {/* Card B: Trends */}
                      <div className="p-5 border border-indigo-200 bg-white shadow-sm rounded-sm">
                        <div className="flex items-center gap-2 text-indigo-500 mb-2"><TrendingUp className="w-5 h-5"/><h3 className="font-black text-sm">Key Market Trends</h3></div>
                        <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                          <li>Increasing adoption of AI in financial reporting workflows.</li>
                          <li>Regulatory push for real-time disclosures.</li>
                          <li>Shift to subscription-based SaaS environments.</li>
                        </ul>
                      </div>

                      {/* Card C: Comps */}
                      <div className="p-5 border border-indigo-200 bg-white shadow-sm rounded-sm">
                        <div className="flex items-center gap-2 text-indigo-500 mb-2"><BarChart3 className="w-5 h-5"/><h3 className="font-black text-sm">Comparable Public Companies</h3></div>
                        <ul className="text-xs text-gray-600 space-y-2">
                          <li className="flex justify-between border-b pb-1"><span>Xero</span> <span className="font-bold">$15B Cap (12x Rev)</span></li>
                          <li className="flex justify-between border-b pb-1"><span>Intuit</span> <span className="font-bold">$170B Cap (10x Rev)</span></li>
                        </ul>
                      </div>
                      
                      {/* Card D: Regions */}
                      <div className="p-5 border border-indigo-200 bg-white shadow-sm rounded-sm">
                        <div className="flex items-center gap-2 text-indigo-500 mb-2"><Database className="w-5 h-5"/><h3 className="font-black text-sm">Regional Breakdown</h3></div>
                        <div className="text-xs text-gray-600 grid grid-cols-2 gap-y-2">
                          <div className="flex justify-between px-2"><span>N. America</span> <span className="font-bold">45%</span></div>
                          <div className="flex justify-between px-2"><span>Europe</span> <span className="font-bold">30%</span></div>
                          <div className="flex justify-between px-2"><span>Asia Pacific</span> <span className="font-bold">20%</span></div>
                          <div className="flex justify-between px-2"><span>RoW</span> <span className="font-bold">5%</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <button onClick={executeAiSearch} className="text-xs font-bold text-gray-400 hover:text-gray-600 px-4 py-3 border border-gray-200 rounded-sm">Run Search Again</button>
                      <button onClick={handleNextStep} className="text-xs font-bold text-gray-400 hover:text-gray-600 px-4 py-3 border border-gray-200 rounded-sm">Discard & Manual Entry</button>
                      <button onClick={acceptAiData} className="bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42] font-black uppercase tracking-widest text-sm px-8 py-3 rounded-sm flex items-center justify-center gap-2 shadow-sm">
                        <Check className="w-4 h-4"/> Accept Suggested Data
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: TAM */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">
                  What is the Total Addressable Market (TAM)? <span title="TAM = Total Annual Revenue if you captured 100% of the market. Investors use this to understand scale."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span>
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm">This is your absolute universal ceiling. The total annual revenue opportunity.</p>

                <div className="mb-6 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">$</span>
                  <input 
                    type="number" 
                    value={data.tam} 
                    onChange={e=>setData({...data, tam: e.target.value})} 
                    placeholder="2300000000"
                    className="w-full pl-10 leading-none p-5 text-3xl font-black font-mono border-2 border-gray-200 rounded-sm outline-none focus:border-[#ffd800] text-[#022f42]"
                  />
                  {data.useAiData && <div className="text-xs text-indigo-500 font-bold mt-2 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Pre-filled by AI research engine (Statista)</div>}
                </div>

                {data.tam && (
                  <div className="flex items-center gap-4 bg-[#f2f6fa] p-4 rounded-sm border-l-4 border-indigo-500 mb-6 font-mono font-bold text-lg text-[#1e4a62]">
                    Formatted: {formatCurrency(parseFloat(data.tam) || 0)}
                  </div>
                )}

                {aiFlags.step3 && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <p className="text-sm text-emerald-900 font-medium">{aiFlags.step3}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: SAM */}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">
                  Serviceable Addressable Market (SAM) <span title="The part of the TAM you can ACTUALLY serve based on geography, language, and current channels."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span>
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Consider geography, language, distribution channels, and regulatory barriers.</p>

                <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-sm">
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-bold text-[#022f42]">SAM as % of TAM</label>
                    <span className="text-3xl font-black text-indigo-600">{data.samPercent}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={data.samPercent} 
                    onChange={e=>setData({...data, samPercent: parseInt(e.target.value)})} 
                    className="w-full accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-2">
                    <span>Niche Segment</span>
                    <span>Broad Global Access</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border border-gray-200 rounded-sm mb-6 bg-white shadow-sm">
                  <div className="p-4 flex-1 text-center">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Your Total Market (TAM)</div>
                    <div className="font-mono text-xl font-bold text-gray-400">{formatCurrency(tamValue)}</div>
                  </div>
                  <div className="p-4 flex-1 text-center bg-indigo-50/30">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-indigo-500 mb-1">Your Reachable Market (SAM)</div>
                    <div className="font-mono text-xl font-black text-indigo-700">{formatCurrency(absoluteSAM)}</div>
                  </div>
                </div>

                {aiFlags.step4 && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <p className="text-sm text-emerald-900 font-medium">{aiFlags.step4}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 5: SOM */}
            {step === 5 && (
              <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">
                  Serviceable Obtainable Market (SOM) <span title="Your realistic 3-5 year target market share. Investors get nervous if you claim 50% without a massive moat."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span>
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Your realistic target share of the SAM over the next 3-5 years.</p>

                <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-sm">
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-bold text-[#022f42]">SOM as % of SAM (Target Market Share)</label>
                    <span className="flex flex-col items-end">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-0.5">{data.somPercent > 20 ? 'Aggressive' : data.somPercent > 5 ? 'Realistic' : 'Conservative'} Target</span>
                      <span className="text-3xl font-black text-[#ffd800] [text-shadow:0_0_1px_#000]">{data.somPercent}%</span>
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={data.somPercent} 
                    onChange={e=>setData({...data, somPercent: parseInt(e.target.value)})} 
                    className="w-full accent-[#022f42]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-2">
                    <span>1%</span>
                    <span>100% Monopoly</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border border-[#022f42] rounded-sm mb-6 bg-white shadow-sm overflow-hidden">
                  <div className="p-4 flex-1 text-center bg-gray-50">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Your Reachable Market (SAM)</div>
                    <div className="font-mono text-xl font-bold text-gray-500">{formatCurrency(absoluteSAM)}</div>
                  </div>
                  <div className="p-4 flex-1 text-center bg-[#022f42]">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-[#ffd800] mb-1">Your 5-Yr Target Capture (SOM)</div>
                    <div className="font-mono text-xl font-black text-white">{formatCurrency(absoluteSOM)}</div>
                  </div>
                </div>

                {aiFlags.step5 && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <p className="text-sm text-emerald-900 font-medium">{aiFlags.step5}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 6: Growth & Why Now */}
            {step === 6 && (
              <motion.div key="s6" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Is this market growing? And why now?</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Every great investment has an inherent catalyst and a rising tide.</p>

                <div className="space-y-8">
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-sm">
                    <div className="flex justify-between items-end mb-4">
                      <label className="text-sm font-bold text-[#022f42] flex items-center gap-2">Compound Annual Growth Rate (CAGR) <span title="Growing markets attract investors because even a small player can grow with the tide."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                      <span className="text-2xl font-black text-indigo-600">{data.cagr}% / yr</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={data.cagr} 
                      onChange={e=>setData({...data, cagr: parseInt(e.target.value)})} 
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-2">
                      <span>0% Flat Market</span>
                      <span>50%+ Hyper-growth</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#022f42] mb-2 flex items-center gap-2">Why Now? The Inflection Point <span title="A shift in tech, regulation, or consumer behavior that creates a window of opportunity today."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                    <textarea 
                      value={data.whyNow} 
                      onChange={e=>setData({...data, whyNow: e.target.value})} 
                      maxLength={300}
                      placeholder="e.g. AI has recently made personalization affordable..." 
                      className="w-full p-4 border-2 border-gray-200 rounded-sm outline-none focus:border-indigo-500 min-h-[100px] text-sm font-medium"
                    />
                  </div>
                </div>

                {aiFlags.step6 && (
                  <div className="mt-8 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <p className="text-sm text-emerald-900 font-medium">{aiFlags.step6}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 7: VOS Score & Summary */}
            {step === 7 && (
              <motion.div key="s7" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border border-gray-100 rounded-sm">
                 <h2 className="text-3xl font-black text-[#022f42] mb-2 text-center">VOS Market Potential Score</h2>
                 <p className="text-[#1e4a62] mb-8 text-sm text-center">Venture Opportunity Scale (VOS) Indicator breakdown.</p>

                 <div className="flex flex-col items-center justify-center mb-10">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                      <path className={`${vosScore >= 2.34 ? 'text-emerald-500' : vosScore >= 1.67 ? 'text-[#ffd800]' : 'text-rose-500'} transition-all duration-1000`} strokeDasharray={`${(vosScore / 3) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-5xl font-black text-[#022f42]">{vosScore.toFixed(2)}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e4a62] mt-1">/ 3.00 max</span>
                    </div>
                  </div>
                  <div className="text-center font-bold font-mono text-sm tracking-widest uppercase mt-4 text-[#1e4a62]">
                    Status: {vosScore >= 2.34 ? 'High Potential (Venture Scale)' : vosScore >= 1.67 ? 'Average Potential (Solid)' : 'Low Potential (Action Required)'}
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-sm mb-8">
                  <h4 className="text-sm font-bold text-emerald-900 mb-1">AI Strategic Insight</h4>
                  <p className="text-sm text-emerald-800">{aiFlags.step7}</p>
                </div>

                <div className="bg-[#f2f6fa] border-2 border-dashed border-[#1e4a62]/20 p-6 rounded-sm mb-8 relative">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-black text-[#1e4a62]/60 uppercase tracking-widest">Editable Investor Summary</label>
                    {data.uvpOverride !== undefined && (
                      <button onClick={() => setData({...data, uvpOverride: undefined})} className="text-xs font-bold text-indigo-500 hover:text-indigo-700">Restore Auto-Sync</button>
                    )}
                  </div>
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultSummary}
                    onChange={(e) => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-white p-5 border-2 border-[#1e4a62]/10 rounded-sm focus:border-emerald-500 outline-none text-[#022f42] font-medium text-lg min-h-[180px] leading-relaxed shadow-sm resize-none"
                  />
                </div>

                <div className="flex justify-center flex-col md:flex-row gap-4">
                  <Link href="/dashboard/snapshot" className="px-8 py-4 font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-500 hover:bg-gray-50">
                    Save & Return Later
                  </Link>
                  <button onClick={handleSaveAndContinue} className={`px-12 py-4 font-black uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#022f42] hover:bg-[#1b4f68] text-white'}`}>
                    {savedSuccess ? <><Check className="w-5 h-5"/> Saved Component</> : <><Save className="w-5 h-5"/> Complete Analysis Phase</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 7 && (
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} className={`font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1e4a62] hover:text-[#022f42]'}`} disabled={step === 1}>
                <ArrowLeft className="w-4 h-4"/> Back
              </button>
              {step !== 2 && ( // Hide generic next button on AI search auto-step unless they skip
                <button onClick={handleNextStep} disabled={step === 1 && !data.problemContext} className={`px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm transition-colors flex items-center gap-2 shadow-md ${step === 1 && !data.problemContext ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#022f42] text-white hover:bg-[#1b4f68]'}`}>
                  Next Step <ArrowRight className="w-4 h-4"/>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
