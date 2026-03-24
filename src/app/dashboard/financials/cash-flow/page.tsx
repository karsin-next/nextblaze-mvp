"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, TrendingUp, Sparkles, ExternalLink, Calculator, ArrowUpCircle, ArrowDownCircle
} from "lucide-react";
import Link from "next/link";

export default function CashFlowPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    receipts: 0,
    newFunding: 0,
    payroll: 0,
    marketing: 0,
    rent: 0,
    cogs: 0,
    otherOut: 0,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_1_3");
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
    if (isLoaded) localStorage.setItem("audit_2_1_3", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const totalIn = data.receipts + data.newFunding;
  const totalOut = data.payroll + data.marketing + data.rent + data.cogs + data.otherOut;
  const netFlow = totalIn - totalOut;

  // AI Feedback Updates
  useEffect(() => {
    if (data.newFunding > 0 && data.receipts === 0) setAiFlags(p => ({...p, step1: "Caution: Your cash-in is 100% financing-led. Investors will want to see operational receipts (revenue) to validate product-market pull."}));
    else if (data.receipts > totalOut) setAiFlags(p => ({...p, step1: "Strong: You are generating positive operational cash flow. This provides massive leverage."}));
    else setAiFlags(p => ({...p, step1: ""}));

    if (data.payroll > (totalOut * 0.70)) setAiFlags(p => ({...p, step2: "Heads up: Payroll accounts for 70%+ of your outflows. This is common for early tech but requires strict talent-density management."}));
    else setAiFlags(p => ({...p, step2: ""}));
  }, [data]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/financials", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.1.3 Cash Flow Snapshot"
        title="Cash In/Out Summary"
        description="Manually enter monthly cash inflows and outflows to generate a simplified cash flow statement."
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
            
            {/* STEP 1: Cash In */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center flex items-center justify-center gap-2">
                   <ArrowUpCircle className="w-6 h-6 text-emerald-500" /> Cash Inflows
                </h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Customer Receipts ($)</label>
                    <input type="number" value={data.receipts} onChange={e=>setData({...data, receipts: parseInt(e.target.value) || 0})} placeholder="25000" className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-2xl text-[#022f42]" />
                  </div>
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">New Financing / Equity ($)</label>
                    <input type="number" value={data.newFunding} onChange={e=>setData({...data, newFunding: parseInt(e.target.value) || 0})} placeholder="0" className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-2xl text-[#022f42]" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Cash Out */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center flex items-center justify-center gap-2">
                   <ArrowDownCircle className="w-6 h-6 text-rose-500" /> Cash Outflows
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Payroll</label>
                    <input type="number" value={data.payroll} onChange={e=>setData({...data, payroll: parseInt(e.target.value) || 0})} className="w-full p-3 border border-gray-100 rounded-sm outline-none font-mono font-bold text-[#022f42]" />
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Marketing</label>
                    <input type="number" value={data.marketing} onChange={e=>setData({...data, marketing: parseInt(e.target.value) || 0})} className="w-full p-3 border border-gray-100 rounded-sm outline-none font-mono font-bold text-[#022f42]" />
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">Rent / AWS / Fixed</label>
                    <input type="number" value={data.rent} onChange={e=>setData({...data, rent: parseInt(e.target.value) || 0})} className="w-full p-3 border border-gray-100 rounded-sm outline-none font-mono font-bold text-[#022f42]" />
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-1 block">COGS / Variable</label>
                    <input type="number" value={data.cogs} onChange={e=>setData({...data, cogs: parseInt(e.target.value) || 0})} className="w-full p-3 border border-gray-100 rounded-sm outline-none font-mono font-bold text-[#022f42]" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Net Flow Summary */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-10 text-center">Net Cash Flow Delta</h2>
                
                <div className="flex flex-col items-center justify-center mb-12">
                   <div className={`p-10 rounded-full border-8 ${netFlow >= 0 ? 'border-emerald-500 bg-emerald-50' : 'border-rose-500 bg-rose-50'} transition-colors duration-500`}>
                      <div className={`text-5xl font-black ${netFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {netFlow >= 0 ? '+' : ''}${netFlow.toLocaleString()}
                      </div>
                   </div>
                   <p className={`mt-6 font-black uppercase tracking-widest text-sm ${netFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {netFlow >= 0 ? 'DEFAULT ALIVE Zone' : 'BURN Zone'}
                   </p>
                </div>

                <div className="bg-[#022f42] text-white p-8 rounded-sm">
                   <div className="grid grid-cols-2 gap-8 text-center">
                      <div>
                         <h4 className="text-[10px] font-black uppercase text-gray-400 mb-1">Inflow Velocity</h4>
                         <div className="text-2xl font-black text-emerald-400">${totalIn.toLocaleString()}</div>
                      </div>
                      <div>
                         <h4 className="text-[10px] font-black uppercase text-gray-400 mb-1">Outflow Intensity</h4>
                         <div className="text-2xl font-black text-rose-400">${totalOut.toLocaleString()}</div>
                      </div>
                   </div>
                </div>

                <div className="flex justify-center mt-12">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Delta Recorded' : 'Finalize Cash Flow Audit'}
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
                  {step === 1 ? "Inflows are the fuel of the venture engine. High-quality fuel comes from recurring customer receipts." : 
                   step === 2 ? (aiFlags.step2 || "Payroll concentration is a proxy for organizational R&D or Sales intensity.") :
                   "A positive net cash flow is the ultimate proof of unit-economic viability."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/cash-flow-for-founders" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Cash Flow Rules →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Net Flow Intensity</h4>
            <div className={`text-2xl font-black ${netFlow >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>${Math.abs(netFlow).toLocaleString()}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{netFlow >= 0 ? 'Surplus' : 'Deficit'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
