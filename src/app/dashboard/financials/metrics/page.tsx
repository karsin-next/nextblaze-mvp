"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, TrendingDown, TrendingUp, Sparkles, ExternalLink, Calculator, Calendar
} from "lucide-react";
import Link from "next/link";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

export default function FinancialMetricsPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    monthlyRevenue: 0,
    monthlyBurn: 0,
    cashBalance: 0,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_1_1");
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
    if (isLoaded) localStorage.setItem("audit_2_1_1", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const netBurn = Math.max(0, data.monthlyBurn - data.monthlyRevenue);
  const runway = netBurn > 0 ? Math.floor(data.cashBalance / netBurn) : 99; // 99 as "Infinite"
  
  const chartData = [
    { name: 'Month 0', cash: data.cashBalance },
    { name: 'Month 1', cash: Math.max(0, data.cashBalance - netBurn) },
    { name: 'Month 3', cash: Math.max(0, data.cashBalance - (netBurn * 3)) },
    { name: 'Month 6', cash: Math.max(0, data.cashBalance - (netBurn * 6)) },
    { name: 'Month 12', cash: Math.max(0, data.cashBalance - (netBurn * 12)) },
  ];

  // AI Feedback Updates
  useEffect(() => {
    if (runway < 6) setAiFlags(p => ({...p, step2: "Critical: Runway is under 6 months. Investors prioritize survival over growth at this junction."}));
    else if (runway > 18) setAiFlags(p => ({...p, step2: "Strong: You have 18+ months of runway. Ideal positioning for a series A transition."}));
    else setAiFlags(p => ({...p, step2: "Healthy: You are in the 'Build' zone (6-18 months). Focus on hitting milestones before the next round."}));
  }, [runway]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/financials/breakeven", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.1.1 Financial Metrics"
        title="Scenario-Based Financial Simulator"
        description="Enter core revenue and burn metrics to calculate absolute runway and simulate 'what-if' scenarios."
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
            
            {/* STEP 1: Core Inputs */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8">Base Financial Parameters</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Monthly Revenue ($)</label>
                      <input type="number" value={data.monthlyRevenue} onChange={e=>setData({...data, monthlyRevenue: parseInt(e.target.value) || 0})} className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-xl" />
                    </div>
                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Monthly Burn ($)</label>
                      <input type="number" value={data.monthlyBurn} onChange={e=>setData({...data, monthlyBurn: parseInt(e.target.value) || 0})} className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-xl" />
                    </div>
                  </div>
                  <div className="p-6 bg-[#022f42] text-white rounded-sm">
                    <label className="text-xs font-black uppercase text-[#ffd800] mb-2 block">Current Cash Balance ($)</label>
                    <input type="number" value={data.cashBalance} onChange={e=>setData({...data, cashBalance: parseInt(e.target.value) || 0})} className="w-full p-4 bg-white/10 border border-white/20 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold text-3xl text-white placeholder:text-white/20" placeholder="100000" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Runway Visualization */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Runway & Survival Velocity</h2>
                
                <div className="flex flex-col items-center justify-center mb-12">
                   <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2" stroke="currentColor"/>
                      <path className={`${runway >= 12 ? 'text-emerald-500' : runway >= 6 ? 'text-[#ffd800]' : 'text-rose-500'} transition-all duration-1000`} strokeDasharray={`${Math.min(100, (runway/24)*100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2" stroke="currentColor"/>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-6xl font-black text-[#022f42]">{runway === 99 ? '∞' : runway}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">MONTHS LEFT</span>
                    </div>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold', fill: '#999'}} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{borderRadius: '0px', border: '1px solid #f0f0f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                        formatter={(val: number) => [`$${val.toLocaleString()}`, 'Cash']}
                      />
                      <Bar dataKey="cash" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#022f42' : entry.cash > 0 ? '#ffd800' : '#fda4af'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* STEP 3: What-If Simulator */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-10 text-center">Scenario 'What-If' Stress Test</h2>
                
                <div className="space-y-12 mb-12">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center px-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Revenue Growth Optimization</label>
                        <span className="text-xl font-black text-[#022f42]">${data.monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <input type="range" min="0" max={data.monthlyRevenue * 5 || 50000} value={data.monthlyRevenue} onChange={e=>setData({...data, monthlyRevenue: parseInt(e.target.value)})} className="w-full accent-[#022f42]" />
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center px-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-widest">OpEx Burn Reduction</label>
                        <span className="text-xl font-black text-rose-500">${data.monthlyBurn.toLocaleString()}</span>
                      </div>
                      <input type="range" min="0" max={data.monthlyBurn * 2 || 50000} value={data.monthlyBurn} onChange={e=>setData({...data, monthlyBurn: parseInt(e.target.value)})} className="w-full accent-rose-500" />
                   </div>
                </div>

                <div className="bg-black text-white p-8 rounded-sm text-center">
                   <h3 className="text-[#ffd800] font-black uppercase tracking-[0.2em] text-xs mb-4">Simulated Runway Outcome</h3>
                   <div className="text-6xl font-black mb-2">{runway === 99 ? 'DEFAUT ALIVE (∞)' : `${runway} Months`}</div>
                   <p className="text-gray-400 text-sm font-medium">Scenario assuming 100% linear distribution of selected variables.</p>
                </div>

                <div className="flex justify-center mt-12">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Data Transmitted' : 'Commit Metrics & Continue'}
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
                  {step === 1 ? "Cash is the oxygen of your startup. Monitoring it at a granularity of +/- 5% is required for mid-stage fundability." : 
                   step === 2 ? (aiFlags.step2 || "Runway is a primary filter for risk-adjusted venture modeling.") :
                   "The What-If simulator allows you to identify which lever (Revenue vs Burn) has the highest impact on survival."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/financial-planning-for-founders" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Financial Planning →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Net Burn Rate</h4>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-[#022f42]">${netBurn.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">/ MO</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
