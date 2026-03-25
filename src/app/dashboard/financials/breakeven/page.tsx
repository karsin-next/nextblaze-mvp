"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, TrendingUp, Sparkles, ExternalLink, Calculator, Percent
} from "lucide-react";
import Link from "next/link";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from "recharts";

export default function BreakevenPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    fixedCosts: 0,
    variableCostPercent: 0,
    interestExpense: 0,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_1_2");
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
    if (isLoaded) localStorage.setItem("audit_2_1_2", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const totalFixed = data.fixedCosts + data.interestExpense;
  const contributionMargin = 1 - (data.variableCostPercent / 100);
  const breakevenRevenue = contributionMargin > 0 ? Math.round(totalFixed / contributionMargin) : 0;

  const chartData = [
    { name: '$0', rev: 0, cost: totalFixed },
    { name: 'BE', rev: breakevenRevenue, cost: totalFixed + (breakevenRevenue * (data.variableCostPercent / 100)) },
    { name: 'Target', rev: breakevenRevenue * 2, cost: totalFixed + (breakevenRevenue * 2 * (data.variableCostPercent / 100)) },
  ];

  // AI Feedback Updates
  useEffect(() => {
    if (data.variableCostPercent > 60) setAiFlags(p => ({...p, step2: "Caution: High variable costs detected. Your breakeven threshold is radically sensitive to even small volume drops."}));
    else if (data.variableCostPercent < 30) setAiFlags(p => ({...p, step2: "Strong: Low variable costs imply massive operating leverage once you clear fixed overheads."}));
    else setAiFlags(p => ({...p, step2: ""}));
  }, [data]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/financials/cash-flow", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.1.2 EBDAT Breakeven"
        title="Survival Revenue Calculator"
        description="Determine the exact revenue needed to cover cash fixed and variable costs – the point where you stop burning cash."
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
            
            {/* STEP 1: Fixed Costs */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Cash Fixed Costs</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Monthly Operating Fixed Costs ($)</label>
                    <input type="number" value={data.fixedCosts} onChange={e=>setData({...data, fixedCosts: parseInt(e.target.value) || 0})} placeholder="30000" className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-2xl text-[#022f42]" />
                  </div>
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Monthly Interest / Debt Service ($)</label>
                    <input type="number" value={data.interestExpense} onChange={e=>setData({...data, interestExpense: parseInt(e.target.value) || 0})} placeholder="0" className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-2xl text-[#022f42]" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Variable Costs */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Variable Allocation</h2>
                <div className="p-8 bg-[#022f42] text-white rounded-sm text-center">
                   <h3 className="text-[#ffd800] font-black uppercase tracking-[0.2em] text-xs mb-6">Variable Cost Percentage (%)</h3>
                   <div className="text-6xl font-black mb-8">{data.variableCostPercent}%</div>
                   <input type="range" min="0" max="95" step="5" value={data.variableCostPercent} onChange={e=>setData({...data, variableCostPercent: parseInt(e.target.value)})} className="w-full accent-[#ffd800]" />
                   <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-gray-400">
                      <span>0% (Hyper Scale)</span>
                      <span>95% (Reseller / Low Moat)</span>
                   </div>
                   {aiFlags.step2 && <div className="mt-8 p-4 bg-white/10 rounded-sm text-sm font-medium border border-white/10">{aiFlags.step2}</div>}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Breakeven Analysis */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-10 text-center text-[#ffd800]">The Breakeven Threshold</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="bg-black text-white p-8 rounded-sm text-center flex flex-col justify-center">
                      <h4 className="text-[10px] uppercase font-black text-gray-500 mb-2">Monthly Breakeven Revenue</h4>
                      <div className="text-4xl font-black text-[#ffd800]">${breakevenRevenue.toLocaleString()}</div>
                      <p className="text-xs mt-4 text-gray-400 leading-relaxed font-medium">To clear ${totalFixed.toLocaleString()} in fixed overhead at a {(100-data.variableCostPercent)}% margin efficiency.</p>
                   </div>
                   <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <Area type="monotone" dataKey="rev" stroke="#ffd800" fill="#fffbeb" strokeWidth={3} />
                          <Area type="monotone" dataKey="cost" stroke="#022f42" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                          <Tooltip content={<></>} />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Threshold Committed' : 'Finalize Breakeven Analysis'}
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
                  {step === 1 ? "Fixed costs act like a hurdle. The higher the hurdle, the more momentum (revenue) you need just to stop depleting cash." : 
                   step === 2 ? "Contribution margin (1 - Variable%) is the efficiency which converts revenue into fixed cost coverage." :
                   "A lower breakeven point increases your 'Default Alive' probability, which is a massive leverage point in VC negotiations."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/ebdat-breakeven-mastery" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Breakeven Mastery →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Target Revenue Efficiency</h4>
            <div className="text-2xl font-black text-emerald-500">{(100 - data.variableCostPercent)}%</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Contribution Margin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
