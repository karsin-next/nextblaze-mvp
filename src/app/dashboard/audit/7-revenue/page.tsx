"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, Box, Zap, Repeat, Layers, Cpu, CreditCard, Sparkles, ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function RevenuePage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    primaryModel: "",
    hybridDescription: "",
    basePrice: "",
    pricingUnit: "per month",
    avgUnits: "1",
    tiers: "",
    assumptions: "",
    churnRisk: 5,
    differentiation: 5,
    criticality: 5,
    cogsPercent: "20",
    fixedCosts: "",
    marginScale: "improve",
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2a: "", step2b: "", step2c: "", step3: "", step4a: "", step4b: "" });
  const [customerContext, setCustomerContext] = useState("customers");

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    try {
      const saved112 = localStorage.getItem("audit_1_1_2_v2");
      if (saved112) {
        const parsed = JSON.parse(saved112);
        if (parsed?.data?.role) setCustomerContext(parsed.data.role);
      }
    } catch(e) {}

    const saved = localStorage.getItem("audit_1_1_7");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData(parsed.data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("audit_1_1_7", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const arpu = (parseFloat(data.basePrice) || 0) * (parseFloat(data.avgUnits) || 1);
  const getPricingPowerScore = () => {
    const diffPoints = data.differentiation * 4;
    const critPoints = data.criticality * 4;
    const churnPoints = (11 - data.churnRisk) * 2;
    return diffPoints + critPoints + churnPoints;
  };
  const pPowerScore = getPricingPowerScore();
  const grossMargin = Math.max(0, 100 - (parseFloat(data.cogsPercent) || 0));

  // AI Feedback Updates
  useEffect(() => {
    if (data.primaryModel === "subscription") setAiFlags(p => ({...p, step1: "Subscription models provide predictable compounding revenue."}));
    else if (data.primaryModel) setAiFlags(p => ({...p, step1: `${data.primaryModel} model requires specific unit-economic scaling logic.`}));

    if (data.differentiation > 7 && data.criticality > 7) {
      setAiFlags(p => ({...p, step3: "High pricing power detected. Excellent moat signals."}));
    } else {
      setAiFlags(p => ({...p, step3: "Moderate leverage. Solidify differentiation."}));
    }
  }, [data]);

  const handleNextStep = () => setStep(Math.min(5, step + 1));

  const defaultSummary = `Revenue model is ${data.primaryModel} starting at $${data.basePrice || "0"} ${data.pricingUnit}. Target cluster: ${customerContext}. Operating margins at ${grossMargin}%, which ${data.marginScale} with scale. Pricing power: ${pPowerScore >= 70 ? 'High' : 'Moderate'}.`;

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/audit/8-team", 1000);
  };

  const revenueModels = [
    { id: "subscription", icon: Repeat, title: "Subscription / SaaS" },
    { id: "transaction", icon: Zap, title: "Transaction / Usage" },
    { id: "hardware", icon: Cpu, title: "Hardware / Device" },
    { id: "freemium", icon: Layers, title: "Freemium" },
    { id: "licensing", icon: CreditCard, title: "Licensing / IP" },
    { id: "hybrid", icon: Box, title: "Hybrid / Other" }
  ];

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.7 Revenue Model"
        title="Revenue & Unit Economics Workshop"
        description="Explicitly define how your firm captures value, quantify ultimate pricing power, and validate margin scalability."
      />

      {/* Progress Bar (SOP: Clickable Navigation) */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          {[1,2,3,4,5].map(i => (
            <button 
              key={i} 
              onClick={() => setStep(i)}
              className={`h-2 w-10 md:w-16 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'} hover:opacity-80 cursor-pointer`} 
              title={`Jump to Step ${i}`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-[#022f42] uppercase tracking-widest ml-4">Step {step} of 5</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Revenue Model */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Choose Your Primary Revenue Model</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {revenueModels.map(m => (
                    <button key={m.id} onClick={() => setData({...data, primaryModel: m.id})} className={`p-6 border-2 rounded-sm text-left transition-all ${data.primaryModel === m.id ? 'border-[#022f42] bg-gray-50 shadow-md' : 'border-gray-100 bg-white'}`}>
                      <m.icon className={`w-8 h-8 mb-4 ${data.primaryModel === m.id ? 'text-[#022f42]' : 'text-gray-300'}`}/>
                      <h4 className="font-black text-[#022f42] mb-1">{m.title}</h4>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Pricing */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8">Define Your Pricing Structure</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Base Price ($)</label>
                      <input type="number" value={data.basePrice} onChange={e=>setData({...data, basePrice: e.target.value})} placeholder="99.00" className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold" />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Frequency</label>
                      <select value={data.pricingUnit} onChange={e=>setData({...data, pricingUnit: e.target.value})} className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] bg-white font-bold">
                        <option value="per month">Per Month</option>
                        <option value="per year">Per Year</option>
                        <option value="per transaction">Per Transaction</option>
                      </select>
                    </div>
                  </div>
                  <div className="bg-[#022f42] text-white p-6 rounded-sm flex flex-col items-center justify-center">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-[#ffd800] mb-2">Cohort ARPU</h4>
                    <div className="text-4xl font-black">${arpu.toLocaleString()}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Power Index */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8">Pricing Power Index</h2>
                <div className="space-y-8">
                  {['differentiation', 'criticality'].map(key => (
                    <div key={key} className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-black uppercase text-gray-400 flex items-center gap-2 cursor-help" title={key === 'differentiation' ? "Can they buy this exact feature set from a direct competitor or substitute?" : "If your software went down today, would their business operations halt? Higher dependency = higher pricing power."}>
                          {key === 'differentiation' ? 'Uniqueness' : 'Workflow Dependency'} <Info className="w-3 h-3"/>
                        </label>
                        <span className="text-3xl font-black text-[#022f42]">{data[key as keyof typeof data]}</span>
                      </div>
                      <input type="range" min="1" max="10" value={data[key as keyof typeof data] as number} onChange={e=>setData({...data, [key]: parseInt(e.target.value)})} className="w-full accent-[#022f42]" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Margins */}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8">Margins & Scalability</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-4 block">Direct COGS (%)</label>
                    <input type="number" value={data.cogsPercent} onChange={e=>setData({...data, cogsPercent: e.target.value})} className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold" />
                  </div>
                  <div className="p-6 bg-black text-[#ffd800] rounded-sm flex flex-col items-center justify-center">
                    <h4 className="text-[10px] uppercase font-black text-white/50 mb-1">Unit Gross Margin</h4>
                    <div className="text-5xl font-black">{grossMargin}%</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Pitch */}
            {step === 5 && (
              <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Business Model Summary</h2>
                <div className="bg-[#f2f6fa] border-2 border-dashed border-gray-100 p-8 rounded-sm mb-8">
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultSummary}
                    onChange={(e) => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-white p-6 border border-gray-100 outline-none text-[#022f42] font-semibold text-lg min-h-[160px] leading-relaxed resize-none shadow-inner"
                  />
                </div>
                <div className="flex justify-center">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Saved' : 'Commit Revenue Model'}
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
            {step < 5 && (
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
                  {step === 1 ? (aiFlags.step1 || "Revenue models are the mechanism of value capture. Subscription models are highly favored for their predictability.") : 
                   step === 3 ? (aiFlags.step3 || "Pricing power is a function of competitive moat. High power implies monopolistic traits.") :
                   step === 4 ? (aiFlags.step4a || "Software gross margins should structurally exceed 70% to be venture-scale.") :
                   "Unit economics dictate the long-term viability of your scaling engine."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/unit-economics-for-founders" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Unit Economics →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Model Efficiency</h4>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-[#022f42]">{grossMargin}%</div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${grossMargin >= 70 ? 'bg-emerald-500' : 'bg-[#ffd800]'}`} style={{width: `${grossMargin}%`}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
