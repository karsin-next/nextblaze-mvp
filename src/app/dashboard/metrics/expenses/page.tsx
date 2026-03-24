"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, PieChart, Sparkles, ExternalLink, Scissors, Landmark
} from "lucide-react";
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Link from "next/link";

const COLORS = ["#022f42", "#ffd800", "#1e4a62", "#b0d0e0", "#ff4d4d"];

export default function ExpensesPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    payroll: 25000,
    marketing: 8000,
    rd: 5000,
    ga: 2000,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_2_3");
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
    if (isLoaded) localStorage.setItem("audit_2_2_3", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const total = data.payroll + data.marketing + data.rd + data.ga;
  const chartData = [
    { name: "Payroll", value: data.payroll },
    { name: "S&M", value: data.marketing },
    { name: "R&D", value: data.rd },
    { name: "G&A", value: data.ga }
  ];

  // AI Feedback Updates
  useEffect(() => {
    if ((data.rd / total) > 0.6) setAiFlags(p => ({...p, step3: "Heavy R&D Bias: Over 60% of your burn is in product. This is typical for deep-tech but signals a potential Go-To-Market deficit to growth investors."}));
    else if ((data.ga / total) > 0.25) setAiFlags(p => ({...p, step3: "Caution: G&A (Overhead) is exceeding 25% of total burn. Venture-backed companies should aim for leaner operations to maximize capital efficiency."}));
    else setAiFlags(p => ({...p, step3: ""}));
  }, [data, total]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/metrics/views", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.2.3 INVESTOR: Expenses"
        title="Expense Allocation"
        description="Audit your capital efficiency. Categorize your monthly burn into institutional buckets to identify distribution imbalances."
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
            
            {/* STEP 1: Direct Entry */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">Burn Composition</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Payroll & Salaries', key: 'payroll', icon: Landmark },
                    { label: 'Sales & Marketing', key: 'marketing', icon: TrendingUp },
                    { label: 'Technical R&D', key: 'rd', icon: Activity },
                    { label: 'General / G&A', key: 'ga', icon: Scissors }
                  ].map(item => (
                    <div key={item.key} className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                       <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block flex items-center gap-2">
                          <item.icon className="w-3 h-3 text-[#022f42]" /> {item.label}
                       </label>
                       <input 
                        type="number" 
                        value={data[item.key as keyof typeof data] as number} 
                        onChange={e=>setData({...data, [item.key]: parseInt(e.target.value) || 0})} 
                        className="w-full p-4 border border-gray-100 rounded-sm outline-none font-mono font-bold text-2xl text-[#022f42] focus:border-[#ffd800]" 
                       />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Pie Viz */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Allocation Architecture</h2>
                <div className="h-80 w-full mb-8">
                   <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie data={chartData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                           {chartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RePieChart>
                   </ResponsiveContainer>
                </div>
                <div className="p-10 bg-[#022f42] text-white rounded-sm">
                   <h4 className="text-[10px] font-black uppercase text-[#ffd800] mb-2">Aggregate Monthly Burn</h4>
                   <div className="text-6xl font-black tracking-tighter">${total.toLocaleString()}</div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Efficiency Summary */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Capital Efficiency Certified</h2>
                
                <div className="bg-[#f2f6fa] border-2 border-dashed border-[#022f42]/20 p-10 rounded-sm mb-12">
                   <PieChart className="w-16 h-16 text-[#022f42] mx-auto mb-6" />
                   <div className="text-sm font-medium text-[#1e4a62] leading-relaxed max-w-sm mx-auto">
                      {aiFlags.step3 || "Your capital allocation suggests a balanced approach between technical depth and commercial scaling. Maintain this ratio to preserve venture attractiveness."}
                   </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'Allocation Locked' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Analytics Recorded' : 'Finalize Expense Audit'}
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
                  {step === 1 ? "Institutional investors categorize burn into 'Investment' (R&D/Sales) vs 'Overhead' (G&A). High overhead is the #1 deal-killer for growth equity." : 
                   step === 2 ? "A healthy Seed/Series A pie chart should usually be dominated by R&D (60%) or Sales (30%), with less than 10% in G&A." :
                   "Targeting a 'Burn Multiple' (Net Burn / Net New MRR) of < 1.0 is the gold standard of capital efficiency."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/investor-reporting-standards" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Expense Allocation →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Burn Multiple</h4>
            <div className="text-2xl font-black text-[#022f42]">${total.toLocaleString()}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Allocation Scale</p>
          </div>
        </div>
      </div>
    </div>
  );
}
