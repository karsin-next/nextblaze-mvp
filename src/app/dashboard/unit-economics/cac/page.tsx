"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, TrendingUp, Sparkles, ExternalLink, Calculator, Target, Users
} from "lucide-react";
import Link from "next/link";

export default function CACPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    adSpend: 0,
    marketingSalaries: 0,
    marketingSoftware: 0,
    newCustomers: 0,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_3_1");
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
    if (isLoaded) localStorage.setItem("audit_2_3_1", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const totalSpend = data.adSpend + data.marketingSalaries + data.marketingSoftware;
  const cac = data.newCustomers > 0 ? Math.round(totalSpend / data.newCustomers) : 0;

  // AI Feedback Updates
  useEffect(() => {
    if (data.marketingSalaries > data.adSpend && data.adSpend > 0) setAiFlags(p => ({...p, step1: "Your CAC is heavily weighted by headcount rather than media buy. This signals a 'Sales-Led' motion which VCs evaluate differently than 'Product-Led' digital growth."}));
    else setAiFlags(p => ({...p, step1: ""}));

    if (cac > 500) setAiFlags(p => ({...p, step3: "High CAC detected. Ensure your LTV (Lifetime Value) is at least 3x this number to maintain a venture-scale unit economic profile."}));
    else if (cac > 0) setAiFlags(p => ({...p, step3: "Healthy CAC baseline. Focus on scaling volume while maintaining this efficiency."}));
  }, [data, cac]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/unit-economics/ltv", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.3.1 CAC Calculator"
        title="Customer Acquisition Cost"
        description="Quantify exactly what it costs to acquire a single customer across media, headcount, and tools."
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
            
            {/* STEP 1: Marketing Spend */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Fully-Loaded Marketing Spend</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Direct Ad Spend (Search, Social, etc) ($)</label>
                    <input type="number" value={data.adSpend} onChange={e=>setData({...data, adSpend: parseInt(e.target.value) || 0})} className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-2xl" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Marketing/Sales Salaries</label>
                      <input type="number" value={data.marketingSalaries} onChange={e=>setData({...data, marketingSalaries: parseInt(e.target.value) || 0})} className="w-full p-3 border border-gray-100 rounded-sm outline-none font-mono font-bold" />
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Growth Software/Tools</label>
                      <input type="number" value={data.marketingSoftware} onChange={e=>setData({...data, marketingSoftware: parseInt(e.target.value) || 0})} className="w-full p-3 border border-gray-100 rounded-sm outline-none font-mono font-bold" />
                    </div>
                  </div>
                  <div className="bg-[#022f42] p-6 rounded-sm text-center">
                    <h4 className="text-[10px] font-black uppercase text-[#ffd800] mb-1">Total Acquisition Budget</h4>
                    <div className="text-4xl font-black text-white">${totalSpend.toLocaleString()}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: New Customers */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">New Customer Volumetrics</h2>
                <div className="flex flex-col items-center justify-center space-y-8">
                   <div className="w-48 h-48 rounded-full border-8 border-gray-100 flex items-center justify-center bg-[#f2f6fa]">
                      <Users className="w-20 h-20 text-[#022f42]" />
                   </div>
                   <div className="w-full max-w-xs">
                      <label className="text-xs font-black uppercase text-gray-400 mb-4 block">New Customers (Last 30 Days)</label>
                      <input type="number" value={data.newCustomers} onChange={e=>setData({...data, newCustomers: parseInt(e.target.value) || 0})} className="w-full p-6 border-4 border-[#022f42] rounded-sm outline-none text-center font-black text-4xl text-[#022f42]" />
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CAC Output */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Your Blended CAC</h2>
                
                <div className="relative mb-12">
                   <div className="text-[120px] font-black text-[#022f42] opacity-5 absolute inset-0 flex items-center justify-center">CAC</div>
                   <div className="relative z-10 flex flex-col items-center">
                      <div className="text-8xl font-black text-[#022f42] mb-2 tracking-tighter">${cac}</div>
                      <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Per New Customer acquired</p>
                   </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-sm text-left">
                   <h4 className="font-black text-[#022f42] mb-2 flex items-center gap-2">Algorithm Insight</h4>
                   <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                      {aiFlags.step3 || "Your acquisition efficiency is mathematically stable. To reach venture-scale, ensure your LTV/CAC ratio trends toward 3.0x or higher."}
                   </p>
                </div>

                <div className="flex justify-center mt-12">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'CAC Recorded' : 'Finalize CAC Analysis'}
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
                  {step === 1 ? (aiFlags.step1 || "Fully-loaded CAC includes organic overhead. Investors look for media-only CAC as a proxy for raw market demand.") : 
                   step === 2 ? "Customer velocity is the primary catalyst of network effects. Monitor the delta between monthly new cohorts." :
                   "A successful startup builds a platform where LTV (value) vastly exceeds the CAC (price of admission)."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/cac-payback-mastery" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: CAC Mastery →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Efficiency Index</h4>
            <div className={`text-4xl font-black ${cac < 100 ? 'text-emerald-500' : cac < 500 ? 'text-[#ffd800]' : 'text-rose-500'}`}>${cac}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Acquisition Delta</p>
          </div>
        </div>
      </div>
    </div>
  );
}
