"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, Flame, Sparkles, ExternalLink, TrendingDown, DollarSign
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import Link from "next/link";

export default function RunwayPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    cashOnHand: 500000,
    monthlyBurn: 40000,
    monthlyRevenue: 10000,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_2_1");
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
    if (isLoaded) localStorage.setItem("audit_2_2_1", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const netBurn = data.monthlyBurn - data.monthlyRevenue;
  const runwayMonths = netBurn > 0 ? Math.floor(data.cashOnHand / netBurn) : 99;

  // Projection Data
  const chartData = Array.from({ length: Math.min(runwayMonths + 6, 24) }, (_, i) => ({
    month: `M${i}`,
    cash: Math.max(0, data.cashOnHand - (netBurn * i))
  }));

  // AI Feedback Updates
  useEffect(() => {
    if (runwayMonths < 6) setAiFlags(p => ({...p, step3: "Danger Zone: Your runway is under 6 months. This creates 'Desperation Signaling' to investors. Shift to survival mode or fast-track bridge funding."}));
    else if (runwayMonths > 18) setAiFlags(p => ({...p, step3: "High Leverage: You have 18+ months of runway. You are 'Default Alive'. This is the ideal state for negotiating high-valuation term sheets."}));
    else setAiFlags(p => ({...p, step3: ""}));
  }, [runwayMonths]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/metrics/revenue", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.2.1 INVESTOR: Runway"
        title="Runway Visualizer"
        description="Monitor your proximity to zero-cash and model the impact of burn reduction on your venture's lifespan."
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
            
            {/* STEP 1: Inputs */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">Cash Positioning</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Total Cash on Hand ($)</label>
                    <input type="number" value={data.cashOnHand} onChange={e=>setData({...data, cashOnHand: parseInt(e.target.value) || 0})} className="w-full p-4 border border-gray-100 rounded-sm outline-none font-mono font-bold text-2xl text-[#022f42]" />
                  </div>
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Average Monthly Spend ($)</label>
                    <input type="number" value={data.monthlyBurn} onChange={e=>setData({...data, monthlyBurn: parseInt(e.target.value) || 0})} className="w-full p-4 border border-gray-100 rounded-sm outline-none font-mono font-bold text-2xl text-rose-600" />
                  </div>
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm md:col-span-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Monthly Collected Revenue ($)</label>
                    <input type="number" value={data.monthlyRevenue} onChange={e=>setData({...data, monthlyRevenue: parseInt(e.target.value) || 0})} className="w-full p-4 border border-gray-100 rounded-sm outline-none font-mono font-bold text-2xl text-emerald-600" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Visualization */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Cash Depletion Curve</h2>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#022f42" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#022f42" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#999" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#999" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip />
                      <Area type="monotone" dataKey="cash" stroke="#022f42" strokeWidth={3} fillOpacity={1} fill="url(#colorCash)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                   <div className="p-4 bg-emerald-50 rounded-sm border border-emerald-100">
                      <div className="text-[10px] font-black text-emerald-600 uppercase mb-1">Net Monthly Burn</div>
                      <div className="text-2xl font-black text-emerald-700">${netBurn.toLocaleString()}</div>
                   </div>
                   <div className="p-4 bg-rose-50 rounded-sm border border-rose-100">
                      <div className="text-[10px] font-black text-rose-600 uppercase mb-1">Survival Runway</div>
                      <div className="text-2xl font-black text-rose-700">{runwayMonths} MONTHS</div>
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Analysis */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Strategic Health Certified</h2>
                
                <div className="mb-12">
                   <div className="inline-block p-10 bg-[#022f42] text-white rounded-full border-[8px] border-[#ffd800] shadow-2xl">
                      <div className="text-7xl font-black mb-1">{runwayMonths}</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffd800]">REMAINING MONTHS</div>
                   </div>
                </div>

                {aiFlags.step3 && <div className="mb-12"><AIAssistedInsight content={aiFlags.step3} /></div>}

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'Metrics Dispatched' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Runway Recorded' : 'Finalize Runway Audit'}
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
                  {step === 1 ? "Runway transparency is the first thing institutional VCs look for. 'Default Alive' (revenue exceeds burn) is the ultimate metric of independence." : 
                   step === 2 ? "The steeper your depletion curve, the less leverage you have in capital markets. Even a 10% reduction in burn can add 3-4 months of strategic optionality." :
                   "Targeting 18 months of runway after a round is the venture gold standard. This allows for 12 months of execution and a 6-month buffer for the next raise."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/investor-reporting-standards" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Runway Mastery →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Lethality Metric</h4>
            <div className={`text-2xl font-black ${runwayMonths < 6 ? 'text-rose-600' : 'text-emerald-500'}`}>{runwayMonths} Months</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Survival Horizon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
