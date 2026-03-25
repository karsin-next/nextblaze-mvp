"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, TrendingUp, Sparkles, ExternalLink, PieChart, BarChart3
} from "lucide-react";
import Link from "next/link";

export default function FundraisingWhatPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    targetAmount: 0,
    allocationRD: 40,
    allocationMarketing: 30,
    allocationHiring: 20,
    allocationOps: 10,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_4_2");
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
    if (isLoaded) localStorage.setItem("audit_2_4_2", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // AI Feedback Updates
  useEffect(() => {
    if (data.allocationRD > 70) setAiFlags(p => ({...p, step2: "Heavy R&D focus detected. Ensure you have a clear GTM (Go-To-Market) strategy to justify this technical depth to commercially-minded investors."}));
    else if (data.allocationMarketing > 50) setAiFlags(p => ({...p, step2: "Aggressive marketing allocation. This signals a 'Growth-at-all-costs' strategy. Be prepared to defend your CAC efficiency."}));
    else setAiFlags(p => ({...p, step2: ""}));
  }, [data]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/strategy/when", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.4.2 STRATEGY: What?"
        title="Capital Requirements"
        description="Determine the exact amount of capital needed and define the allocation strategy across key business functions."
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
            
            {/* STEP 1: Amount */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Total Capital &apos;Ask&apos;</h2>
                <div className="max-w-md mx-auto">
                   <div className="p-10 bg-[#022f42] text-white rounded-sm shadow-xl">
                      <label className="text-[10px] font-black uppercase text-[#ffd800] mb-4 block tracking-[0.3em]">Target Funding Goal ($)</label>
                      <input type="number" value={data.targetAmount} onChange={e=>setData({...data, targetAmount: parseInt(e.target.value) || 0})} placeholder="500000" className="w-full text-center font-black text-6xl bg-transparent outline-none border-b-2 border-white/20 pb-4 focus:border-[#ffd800] transition-colors" />
                      <p className="mt-6 text-xs text-white/40 font-medium">This amount should sustain 18-24 months of runway assuming zero revenue.</p>
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Allocation */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">Use of Funds Allocation</h2>
                <div className="space-y-8">
                  {[
                    { label: 'R&D / Product Dev', key: 'allocationRD', color: 'bg-blue-500' },
                    { label: 'Sales & Marketing', key: 'allocationMarketing', color: 'bg-emerald-500' },
                    { label: 'Core Team Hiring', key: 'allocationHiring', color: 'bg-amber-500' },
                    { label: 'Operations & G&A', key: 'allocationOps', color: 'bg-rose-500' }
                  ].map(alloc => (
                    <div key={alloc.key} className="space-y-2">
                       <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-black uppercase text-gray-400">{alloc.label}</label>
                          <span className="text-sm font-black text-[#022f42]">{data[alloc.key as keyof typeof data]}%</span>
                       </div>
                       <input 
                        type="range" 
                        min="0" max="100" 
                        value={data[alloc.key as keyof typeof data] as number} 
                        onChange={e => setData({...data, [alloc.key]: parseInt(e.target.value)})}
                        className={`w-full h-2 rounded-full appearance-none bg-gray-100 cursor-pointer accent-[#022f42]`}
                       />
                    </div>
                  ))}
                </div>
                {aiFlags.step2 && <div className="mt-12"><AIAssistedInsight content={aiFlags.step2} /></div>}
              </motion.div>
            )}

            {/* STEP 3: Summary Analysis */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Funding Architecture Synthesis</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="bg-gray-50 p-8 rounded-sm">
                      <BarChart3 className="w-8 h-8 text-[#022f42] mx-auto mb-4" />
                      <h4 className="text-[10px] font-black uppercase text-gray-400 mb-4">Capital Weighting</h4>
                      <div className="space-y-3">
                         <div className="flex justify-between text-xs font-bold">
                            <span>High Leverage (R&D + Sales)</span>
                            <span className="text-emerald-500">{data.allocationRD + data.allocationMarketing}%</span>
                         </div>
                         <div className="flex justify-between text-xs font-bold">
                            <span>Direct Overhead</span>
                            <span className="text-rose-500">{data.allocationOps}%</span>
                         </div>
                      </div>
                   </div>
                   <div className="bg-[#022f42] text-white p-8 rounded-sm flex flex-col justify-center">
                      <h4 className="text-[10px] font-black uppercase text-[#ffd800] mb-2">Primary &apos;Impact&apos; Ask</h4>
                      <div className="text-3xl font-black">${Math.round(data.targetAmount * ((data.allocationRD + data.allocationMarketing)/100)).toLocaleString()}</div>
                      <p className="text-[10px] text-white/40 mt-2 font-medium uppercase">Allocated toward Growth & Product</p>
                   </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Allocation Locked' : 'Finalize Funding Strategy'}
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
                  {step === 1 ? "Your 'Ask' must be mathematically tied to your milestones. Raising too much causes unnecessary dilution; raising too little risks funding fatigue." : 
                   step === 2 ? (aiFlags.step2 || "Allocating 70%+ toward 'High-Leverage' (Product + Sales) activity is a key indicator of lean execution excellence.") :
                   "A balanced use-of-funds table shows institutional maturity. Investors want to see that you understand the true cost of scaling."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/fundraising-strategy-canvas" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Capital Needs →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Fundraising Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Capital Velocity</h4>
            <div className="text-2xl font-black text-emerald-500">${data.targetAmount.toLocaleString()}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Requested Infusion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
