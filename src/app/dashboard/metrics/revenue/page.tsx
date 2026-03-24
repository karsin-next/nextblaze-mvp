"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, TrendingUp, Sparkles, ExternalLink, BarChart, LineChart as LucideLineChart
} from "lucide-react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import Link from "next/link";

export default function GrowthPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    currentMRR: 25000,
    growthRate: 15, // % MoM
    historicalRevenue: [12000, 14000, 16500, 19000, 22000, 25000],
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_2_2");
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
    if (isLoaded) localStorage.setItem("audit_2_2_2", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const chartData = data.historicalRevenue.map((rev, i) => ({
    month: `M-${5-i}`,
    revenue: rev
  }));

  // AI Feedback Updates
  useEffect(() => {
    if (data.growthRate > 20) setAiFlags(p => ({...p, step1: "T2D3 Velocity: Your 20%+ MoM growth puts you on the 'Triple, Triple, Double, Double, Double' trajectory valued by tier-1 VCs."}));
    else if (data.growthRate < 5) setAiFlags(p => ({...p, step1: "Linear Risk: Sub-5% MoM growth is often perceived as 'SME velocity' rather than 'Venture velocity'. Investors look for compounding exponentiality."}));
    else setAiFlags(p => ({...p, step1: ""}));
  }, [data.growthRate]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/metrics/expenses", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.2.2 INVESTOR: Revenue"
        title="Growth Index"
        description="Track your MoM growth velocity and visualize the compounding impact of your current traction."
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
            
            {/* STEP 1: MRR & Growth Rate */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Current Traction Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="p-10 bg-[#f2f6fa] border-4 border-[#022f42] rounded-sm">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Current Monthly Revenue ($)</label>
                      <input type="number" value={data.currentMRR} onChange={e=>setData({...data, currentMRR: parseInt(e.target.value) || 0})} className="w-full text-center font-black text-5xl text-[#022f42] bg-transparent outline-none focus:text-[#ffd800] transition-colors" />
                   </div>
                   <div className="p-10 bg-[#f2f6fa] border-4 border-[#022f42] rounded-sm">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">MoM Growth Rate (%)</label>
                      <input type="number" value={data.growthRate} onChange={e=>setData({...data, growthRate: parseInt(e.target.value) || 0})} className="w-full text-center font-black text-5xl text-emerald-600 bg-transparent outline-none focus:text-[#ffd800] transition-colors" />
                   </div>
                </div>
                {aiFlags.step1 && <div className="mt-12"><AIAssistedInsight content={aiFlags.step1} /></div>}
              </motion.div>
            )}

            {/* STEP 2: Historical Visualization */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-[#022f42] p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-white">
                <h2 className="text-2xl font-black mb-8 text-center">Revenue Compound Engine</h2>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1b4f68" />
                      <XAxis dataKey="month" stroke="#b0d0e0" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#b0d0e0" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip cursor={{fill: '#1b4f68', opacity: 0.4}} contentStyle={{backgroundColor: '#022f42', border: '1px solid #1b4f68', color: '#fff'}} />
                      <Bar dataKey="revenue" fill="#ffd800" radius={[4, 4, 0, 0]} />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white/5 p-6 mt-8 rounded-sm text-center border border-white/10">
                   <h4 className="text-[10px] font-black uppercase text-[#ffd800] mb-1">Growth Persistence</h4>
                   <p className="text-sm font-medium text-blue-50">"Maintaining a <span className="text-[#ffd800] font-black">{data.growthRate}% MoM</span> growth rate for 12 months will result in <span className="text-emerald-400 font-black">${Math.round(data.currentMRR * Math.pow(1+(data.growthRate/100), 12)).toLocaleString()} MRR</span>."</p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Final Summary */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Growth Profile Certified</h2>
                
                <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 bg-gray-50 border border-gray-100 rounded-sm">
                      <TrendingUp className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                      <h4 className="text-[10px] font-black uppercase text-gray-400 mb-1">Current Velocity</h4>
                      <div className="text-4xl font-black text-[#022f42]">{data.growthRate}% MoM</div>
                   </div>
                   <div className="p-8 bg-gray-50 border border-gray-100 rounded-sm">
                      <LucideLineChart className="w-10 h-10 text-blue-500 mx-auto mb-4" />
                      <h4 className="text-[10px] font-black uppercase text-gray-400 mb-1">Projected MRR (12mo)</h4>
                      <div className="text-4xl font-black text-[#022f42]">${Math.round(data.currentMRR * Math.pow(1+(data.growthRate/100), 12)).toLocaleString()}</div>
                   </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'Growth Path Saved' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Metrics Committed' : 'Finalize Revenue Audit'}
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
                  {step === 1 ? "Revenue is the only metric that cannot be reframed. Consistent MoM growth is the primary proxy for Product-Market Fit." : 
                   step === 2 ? "Growth persistence is more valuable than erratic spikes. Investors prize 'Systematic Growth'—revenue that grows predictably through repeatable sales motions." :
                   "The transition from 15% MoM to 20% MoM often requires a shift from founder-led sales to managed sales teams."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/investor-reporting-standards" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Growth Tracking →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Compounding Power</h4>
            <div className="text-2xl font-black text-emerald-500">{data.growthRate}% MoM</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Growth Efficiency</p>
          </div>
        </div>
      </div>
    </div>
  );
}
