"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, TrendingUp, Sparkles, ExternalLink, Calculator, RefreshCw, Clock
} from "lucide-react";
import Link from "next/link";

export default function CCCPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    daysLeadToClose: 30,
    daysInventory: 0,
    daysToCollect: 45,
    daysToPay: 30,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_3_4");
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
    if (isLoaded) localStorage.setItem("audit_2_3_4", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const ccc = data.daysInventory + data.daysToCollect - data.daysToPay;

  // AI Feedback Updates
  useEffect(() => {
    if (ccc < 0) setAiFlags(p => ({...p, step3: "Elite: You have a negative Cash Conversion Cycle. This means your customers or suppliers are effectively financing your growth. This is the holy grail of capital efficiency."}));
    else if (ccc > 90) setAiFlags(p => ({...p, step3: "Caution: High CCC detected. Your cash is trapped in operations for 90+ days. This significantly increases your funding requirements."}));
    else setAiFlags(p => ({...p, step3: ""}));
  }, [ccc]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/financials", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.3.4 Cash Conversion Cycle"
        title="CCC Simulator"
        description="Understand the velocity of your cash. Measure the gap between paying for inputs and collecting from customers."
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
            
            {/* STEP 1: Conversion Velocity */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Operational Days</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block font-bold">Leads to Close (Sales Cycle Days)</label>
                    <input type="number" value={data.daysLeadToClose} onChange={e=>setData({...data, daysLeadToClose: parseInt(e.target.value) || 0})} className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-2xl" />
                  </div>
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Inventory / Prep Logic Days</label>
                    <input type="number" value={data.daysInventory} onChange={e=>setData({...data, daysInventory: parseInt(e.target.value) || 0})} className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-2xl" placeholder="0 if SaaS" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Payment Dynamics */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Receivables & Payables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-sm">
                      <div className="text-[10px] font-black uppercase text-emerald-600 mb-2 tracking-widest">Days to Collect (DSO)</div>
                      <div className="text-6xl font-black text-emerald-700 mb-4">{data.daysToCollect}</div>
                      <input type="range" min="0" max="180" step="5" value={data.daysToCollect} onChange={e=>setData({...data, daysToCollect: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
                   </div>
                   <div className="p-6 bg-rose-50 border border-rose-100 rounded-sm">
                      <div className="text-[10px] font-black uppercase text-rose-600 mb-2 tracking-widest">Days to Pay (DPO)</div>
                      <div className="text-6xl font-black text-rose-700 mb-4">{data.daysToPay}</div>
                      <input type="range" min="0" max="180" step="5" value={data.daysToPay} onChange={e=>setData({...data, daysToPay: parseInt(e.target.value)})} className="w-full accent-rose-500" />
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CCC Result */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Cash Conversion Lifecycle</h2>
                
                <div className="mb-12">
                   <div className="flex items-center justify-center gap-4">
                      <div className="w-64 h-64 rounded-full border-[16px] border-[#022f42] flex flex-col items-center justify-center bg-[#f2f6fa] shadow-2xl relative overflow-hidden group">
                         <div className="absolute inset-0 bg-[#ffd800] opacity-0 group-hover:opacity-10 transition-opacity" />
                         <span className="text-[10px] font-black uppercase text-gray-400 mb-1">AGGREGATE CYCLE</span>
                         <div className={`text-7xl font-black ${ccc < 0 ? 'text-emerald-500' : 'text-[#022f42]'}`}>{ccc}</div>
                         <span className="text-xs font-bold uppercase tracking-widest mt-1 text-gray-500">DAYS</span>
                      </div>
                   </div>
                </div>

                {aiFlags.step3 && (
                  <div className="mb-12 p-8 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-sm text-left">
                     <p className="text-sm font-semibold text-indigo-900 leading-relaxed italic">
                        "{aiFlags.step3}"
                     </p>
                  </div>
                )}

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Cycle Record Locked' : 'Finalize CCC Analysis'}
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
                  {step === 1 ? "Lead-to-close velocity is a proxy for market friction. A shorter sales cycle mathematically compounds your growth rate." : 
                   step === 2 ? "A positive gap between DSO and DPO indicates that your business consumes cash as it grows. Negative CCC is the ultimate scalability signal." :
                   "Targeting a CCC of < 30 days is standard for high-growth tech ventures."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/cash-conversion-cycle" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: CCC Optimization →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Capital Retention</h4>
            <div className={`text-2xl font-black ${ccc <= 0 ? 'text-emerald-500' : 'text-[#ffd800]'}`}>{ccc} Days</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">CCC Efficiency</p>
          </div>
        </div>
      </div>
    </div>
  );
}
