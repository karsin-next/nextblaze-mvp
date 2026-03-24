"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, TrendingUp, Sparkles, ExternalLink, Calculator, Layers, PieChart
} from "lucide-react";
import Link from "next/link";

export default function MarginPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    unitRevenue: 0,
    hostingCost: 0,
    supportCost: 0,
    paymentFees: 0,
    otherCogs: 0,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_3_3");
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
    if (isLoaded) localStorage.setItem("audit_2_3_3", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const totalCogs = data.hostingCost + data.supportCost + data.paymentFees + data.otherCogs;
  const grossProfit = data.unitRevenue - totalCogs;
  const grossMargin = data.unitRevenue > 0 ? Math.round((grossProfit / data.unitRevenue) * 100) : 0;

  // AI Feedback Updates
  useEffect(() => {
    if (grossMargin > 80) setAiFlags(p => ({...p, step3: "Elite: Your 80%+ gross margin is typical of top-tier software companies. This represents extreme scalability."}));
    else if (grossMargin < 40) setAiFlags(p => ({...p, step3: "Caution: Margins below 40% are difficult to scale under venture-capital ROI mandates. Review your pricing or COGS structure."}));
    else setAiFlags(p => ({...p, step3: ""}));
  }, [grossMargin]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/unit-economics/ccc", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.3.3 Gross Margin"
        title="Margin Analyzer"
        description="Drill down into the specific direct costs that separate your revenue from your gross profit."
      />

      {/* Progress Bar (SOP: Clickable Navigation) */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          {[1,2,3].map(i => (
            <button 
              key={i} 
              onClick={() => setStep(i)}
              className={`h-2 w-20 md:w-32 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'} hover:opacity-80 cursor-pointer`} 
              title={`Jump to Step ${i}`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-[#022f42] uppercase tracking-widest ml-4">Step {step} of 3</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Revenue per Unit */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12 text-center">Unit Revenue Baseline</h2>
                <div className="max-w-xs mx-auto">
                   <div className="p-8 bg-[#f2f6fa] border-4 border-[#022f42] rounded-sm">
                      <label className="text-xs font-black uppercase text-gray-400 mb-4 block tracking-widest">Revenue / Unit ($)</label>
                      <input type="number" value={data.unitRevenue} onChange={e=>setData({...data, unitRevenue: parseInt(e.target.value) || 0})} placeholder="99" className="w-full text-center font-black text-5xl text-[#022f42] bg-transparent outline-none focus:text-[#ffd800] transition-colors" />
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Direct Costs (COGS) */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Loaded Unit COGS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Hosting / Cloud</label>
                    <input type="number" value={data.hostingCost} onChange={e=>setData({...data, hostingCost: parseInt(e.target.value) || 0})} className="w-full p-3 border border-gray-100 rounded-sm outline-none font-mono font-bold" />
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Payment Processing</label>
                    <input type="number" value={data.paymentFees} onChange={e=>setData({...data, paymentFees: parseInt(e.target.value) || 0})} className="w-full p-3 border border-gray-100 rounded-sm outline-none font-mono font-bold" />
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Customer Support (Direct)</label>
                    <input type="number" value={data.supportCost} onChange={e=>setData({...data, supportCost: parseInt(e.target.value) || 0})} className="w-full p-3 border border-gray-100 rounded-sm outline-none font-mono font-bold" />
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Other Variable COGS</label>
                    <input type="number" value={data.otherCogs} onChange={e=>setData({...data, otherCogs: parseInt(e.target.value) || 0})} className="w-full p-3 border border-gray-100 rounded-sm outline-none font-mono font-bold" />
                  </div>
                </div>
                <div className="bg-[#022f42] text-white p-6 mt-8 rounded-sm text-center">
                   <h4 className="text-[10px] font-black uppercase text-[#ffd800] mb-1">Total Unit COGS</h4>
                   <div className="text-4xl font-black tracking-tighter">${totalCogs.toLocaleString()}</div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Analysis */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Margin Architecture</h2>
                
                <div className="flex flex-col items-center justify-center mb-12">
                   <div className="relative w-56 h-56 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                      <path className={`${grossMargin >= 70 ? 'text-emerald-500' : 'text-[#ffd800]'} transition-all duration-1000`} strokeDasharray={`${Math.max(1, grossMargin)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-7xl font-black text-[#022f42]">{grossMargin}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">GROSS MARGIN</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gray-50 border border-gray-100 rounded-sm text-left">
                   <h4 className="font-black text-[#022f42] mb-2 flex items-center gap-2 uppercase tracking-widest text-xs">Venture Efficiency Note</h4>
                   <p className="text-sm font-medium leading-relaxed text-[#1e4a62]">
                      {aiFlags.step3 || "Your unit margins are statistically significant. Maintaining this efficiency while scaling volume is the primary challenge of the transition phase."}
                   </p>
                </div>

                <div className="flex justify-center mt-12">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Margin Committed' : 'Finalize Margin Analysis'}
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
            {step < 3 && (
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
                  {step === 1 ? "Unit revenue is the gross value capture before operational friction. High per-unit pricing allows for higher COGS flexibility." : 
                   step === 2 ? "Loaded COGS should include every variable cost required to serve a new customer. Failure to load support costs is a common founder blindspot." :
                   "A gross margin below 70% for a SaaS pure-play will trigger deep scrutiny from institutional VCs during due diligence."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/gross-margin-optimization" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Margin Mastery →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Profit per Unit</h4>
            <div className="text-3xl font-black text-emerald-500">${grossProfit.toLocaleString()}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Marginal Contribution</p>
          </div>
        </div>
      </div>
    </div>
  );
}
