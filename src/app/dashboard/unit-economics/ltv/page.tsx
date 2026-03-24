"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, TrendingUp, Sparkles, ExternalLink, Calculator, Percent, Clock
} from "lucide-react";
import Link from "next/link";

export default function LTVPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    avgMonthlyRevenue: 0,
    grossMarginPercent: 80,
    monthlyChurnPercent: 5,
    uvpOverride: undefined as string | undefined
  });

  const [cac, setCac] = useState(0);
  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_3_2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData(parsed.data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    }

    const savedCac = localStorage.getItem("audit_2_3_1");
    if (savedCac) {
      try {
         const parsed = JSON.parse(savedCac);
         if (parsed.score) setCac(parsed.score); // Assuming score is CAC or we calculate it
         else if (parsed.data) {
           const total = (parsed.data.adSpend || 0) + (parsed.data.marketingSalaries || 0);
           const count = parsed.data.newCustomers || 0;
           if (count > 0) setCac(Math.round(total/count));
         }
      } catch(e) {}
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("audit_2_3_2", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const contribution = data.avgMonthlyRevenue * (data.grossMarginPercent / 100);
  const ltv = data.monthlyChurnPercent > 0 ? Math.round(contribution / (data.monthlyChurnPercent / 100)) : 0;
  const ltvCacRatio = cac > 0 ? (ltv / cac).toFixed(1) : "0";

  // AI Feedback Updates
  useEffect(() => {
    if (data.monthlyChurnPercent > 10) setAiFlags(p => ({...p, step2: "Critical: Monthly churn above 10% indicates a 'leaky bucket'. Investors will prioritize churn reduction over any growth spend."}));
    else if (data.monthlyChurnPercent < 3) setAiFlags(p => ({...p, step2: "Strong: Low churn implies high product stickiness and powerful long-term compounding."}));
    else setAiFlags(p => ({...p, step2: ""}));

    if (parseFloat(ltvCacRatio) >= 3) setAiFlags(p => ({...p, step3: `Excellent Unit Economics: Your LTV:CAC ratio of ${ltvCacRatio}x is in the 'Venture Grade' zone.`}));
    else if (parseFloat(ltvCacRatio) >= 1) setAiFlags(p => ({...p, step3: `Emerging Economics: Your ratio of ${ltvCacRatio}x is viable but lacks the required explosive margin for a typical Series A.`}));
  }, [data, ltvCacRatio]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/unit-economics/margin", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.3.2 LTV Estimator"
        title="Customer Lifetime Value"
        description="Calculate the total net profit expected from a single customer over their entire duration with your firm."
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
            
            {/* STEP 1: Revenue & Margin */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Revenue & Contribution</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Avg. Monthly Revenue (ARPU) ($)</label>
                    <input type="number" value={data.avgMonthlyRevenue} onChange={e=>setData({...data, avgMonthlyRevenue: parseInt(e.target.value) || 0})} className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-2xl" />
                  </div>
                  <div className="p-6 bg-[#022f42] text-white rounded-sm">
                    <div className="flex justify-between items-center mb-6">
                       <label className="text-xs font-black uppercase text-[#ffd800] tracking-widest">Gross Margin (%)</label>
                       <span className="text-3xl font-black">{data.grossMarginPercent}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={data.grossMarginPercent} onChange={e=>setData({...data, grossMarginPercent: parseInt(e.target.value)})} className="w-full accent-[#ffd800]" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Churn */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Retention Dynamics</h2>
                <div className="space-y-12">
                   <div className="p-8 bg-gray-50 border border-gray-100 rounded-sm">
                      <div className="text-[10px] font-black uppercase text-gray-400 mb-2">Monthly Logo Churn (%)</div>
                      <div className="text-6xl font-black text-rose-500 mb-6">{data.monthlyChurnPercent}%</div>
                      <input type="range" min="0" max="50" value={data.monthlyChurnPercent} onChange={e=>setData({...data, monthlyChurnPercent: parseInt(e.target.value)})} className="w-full accent-rose-500" />
                   </div>
                   {aiFlags.step2 && <AIAssistedInsight content={aiFlags.step2} />}
                </div>
              </motion.div>
            )}

            {/* STEP 3: LTV Output */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Lifetime Value Synthesis</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="bg-[#022f42] text-white p-10 rounded-sm flex flex-col justify-center">
                      <h4 className="text-[10px] uppercase font-black text-[#ffd800] mb-2 tracking-widest">Expected LTV</h4>
                      <div className="text-5xl font-black tracking-tighter">${ltv.toLocaleString()}</div>
                      <p className="text-[10px] text-gray-400 mt-4 uppercase font-bold">Computed over {data.monthlyChurnPercent > 0 ? (100 / data.monthlyChurnPercent).toFixed(1) : '∞'} months</p>
                   </div>
                   <div className="bg-black text-[#ffd800] p-10 rounded-sm flex flex-col justify-center border-2 border-[#ffd800]">
                      <h4 className="text-[10px] uppercase font-black text-white/50 mb-2 tracking-widest">LTV : CAC RATIO</h4>
                      <div className="text-6xl font-black">{ltvCacRatio}x</div>
                      <p className="text-[10px] text-white/30 mt-4 uppercase font-bold">Ratio of long-term value to cost</p>
                   </div>
                </div>

                {aiFlags.step3 && (
                  <div className="mb-12 p-6 bg-indigo-50 border border-indigo-100 rounded-sm text-left font-medium text-indigo-900 flex items-start gap-4">
                    <Sparkles className="w-6 h-6 text-indigo-500 shrink-0" />
                    <div>{aiFlags.step3}</div>
                  </div>
                )}

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'LTV Committed' : 'Finalize LTV Analysis'}
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
                  {step === 1 ? "Contribution margin (ARPU * Gross Margin%) is the actual profit generated per month per unit. High margins allow for high LTV even with moderate retention." : 
                   step === 2 ? (aiFlags.step2 || "Monthly churn is the primary friction point of SaaS. A churn rate of 5% means you lose 50% of your fleet in 12 months.") :
                   "Targeting an LTV:CAC of 3.0x is the industry standard for seed-stage viability."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/ltv-prediction-engine" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: LTV Prediction →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Net Worth Index</h4>
            <div className={`text-3xl font-black ${ltv > 1000 ? 'text-emerald-500' : 'text-[#ffd800]'}`}>${ltv.toLocaleString()}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">LTV Aggregate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
