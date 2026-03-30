"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, TrendingUp, Sparkles, ExternalLink, PieChart, BarChart3,
  Landmark, Flag, CheckCircle2, Zap, Target
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const milestoneExamples = [
  "Reach RM 50K MRR within 6 months",
  "Launch enterprise tier with 3 paying customers",
  "Expand to Singapore market",
  "Hire CTO and lead engineer",
  "Complete ISO 27001 certification",
];

export default function FundraisingWhatPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    targetAmount: 500000,
    preMoney: 2000000,
    instrument: "SAFE",
    milestones: ["", "", ""],
    allocationRD: 40,
    allocationMarketing: 30,
    allocationHiring: 20,
    allocationOps: 10,
  });

  const [profile, setProfile] = useState<any>(null);

  // Calculations
  const postMoney = data.preMoney + data.targetAmount;
  const dilution = (data.targetAmount / postMoney) * 100;
  const mrr = parseFloat(profile?.mrr || "0") || 0;

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem("audit_2_4_1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData(parsed.data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    }
    
    if (user?.id) {
       const p = localStorage.getItem(`startup_profile_${user.id}`);
       if (p) {
         try {
           const parsedProfile = JSON.parse(p);
           setProfile(parsedProfile);
           // If no saved data, try to pull from profile
           if (!saved) {
             setData(prev => ({
               ...prev,
               targetAmount: parsedProfile.raiseAmount || prev.targetAmount,
               preMoney: parsedProfile.preMoney || prev.preMoney,
               instrument: parsedProfile.instrument || prev.instrument,
               milestones: parsedProfile.strategyMilestones || prev.milestones
             }));
           }
         } catch(e) {}
       }
    }
    setIsLoaded(true);
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("audit_2_4_1", JSON.stringify({ data, step }));
      // Also sync back to profile for global accessibility
      if (user?.id) {
        const existing = JSON.parse(localStorage.getItem(`startup_profile_${user.id}`) || "{}");
        const updated = {
          ...existing,
          raiseAmount: data.targetAmount,
          preMoney: data.preMoney,
          instrument: data.instrument,
          strategyMilestones: data.milestones
        };
        localStorage.setItem(`startup_profile_${user.id}`, JSON.stringify(updated));
      }
    }
  }, [data, step, isLoaded, user?.id]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    localStorage.setItem("audit_2_4_1", "completed");
    setTimeout(() => window.location.href = "/dashboard/strategy/why", 1000); 
  };

  const getInstrumentDescription = () => {
    switch(data.instrument) {
      case "SAFE": return "YC post-money SAFE. High velocity. No interest, no maturity. Converts at next priced round.";
      case "Convertible": return "Debt with interest (4-8%) and maturity (12-24mo). Includes discount/cap.";
      case "Priced": return "Direct equity sale at fixed PPS. Requires lead, 409A, and legal heavy lifting.";
      default: return "";
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.4.1 STRATEGY: What?"
        title="Capital Requirements & Round Mechanics"
        description="Define your 'Ask', model your valuation physics, and architect the milestone roadmap for your next capital infusion."
      />

      {/* Progress Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          {[1,2,3].map(i => (
            <button key={i} onClick={() => setStep(i)} className={`h-2 w-20 md:w-32 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'} hover:opacity-80 cursor-pointer`} />
          ))}
        </div>
        <span className="text-xs font-black text-[#022f42] uppercase tracking-widest ml-4">Phase {step} of 3</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Amount & Instrument */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                  <h2 className="text-2xl font-black text-[#022f42] mb-10 text-center uppercase tracking-tight">Round Physics</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Target Raise (RM)</label>
                        <input type="number" value={data.targetAmount} onChange={e=>setData({...data, targetAmount: parseInt(e.target.value) || 0})} className="w-full p-4 border-2 border-gray-100 rounded-sm font-black text-3xl outline-none focus:border-[#ffd800] transition-colors" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Pre-Money Valuation (RM)</label>
                        <input type="number" value={data.preMoney} onChange={e=>setData({...data, preMoney: parseInt(e.target.value) || 0})} className="w-full p-4 border-2 border-gray-100 rounded-sm font-black text-3xl outline-none focus:border-[#ffd800] transition-colors text-emerald-600" />
                      </div>
                    </div>

                    <div className="space-y-6">
                       <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Investment Instrument</label>
                        <select value={data.instrument} onChange={e=>setData({...data, instrument: e.target.value})} className="w-full p-4 border-2 border-gray-100 rounded-sm font-bold bg-white outline-none focus:border-[#ffd800] appearance-none cursor-pointer">
                          <option value="SAFE">Post-Money SAFE</option>
                          <option value="Convertible">Convertible Note</option>
                          <option value="Priced">Priced Round (Series A)</option>
                        </select>
                        <div className="mt-3 bg-[#f2f6fa] p-4 text-[10px] font-medium text-[#1e4a62] border-l-2 border-[#1e4a62] rounded-sm">
                          {getInstrumentDescription()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone Roadmap integrated from Canvas */}
                <div className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm">
                  <h2 className="text-xl font-black text-[#022f42] mb-8 flex items-center gap-3">
                     <Flag className="w-5 h-5 text-[#ffd800]" /> Capital Efficiency Milestones
                  </h2>
                  <div className="space-y-3">
                    {data.milestones.map((m, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="w-10 h-10 bg-[#f2f6fa] flex items-center justify-center shrink-0 border border-gray-100 font-black text-xs">{i+1}</div>
                        <input 
                          type="text" 
                          placeholder={milestoneExamples[i]} 
                          value={m} 
                          onChange={e => {
                            const updated = [...data.milestones];
                            updated[i] = e.target.value;
                            setData({...data, milestones: updated});
                          }}
                          className="flex-1 p-3 border border-gray-100 rounded-sm outline-none focus:border-[#022f42] text-sm font-medium"
                        />
                      </div>
                    ))}
                    <button onClick={() => setData({...data, milestones: [...data.milestones, ""]})} className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mt-2">+ Add Milestone</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Use of Funds */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-10 text-center uppercase tracking-tight">Use of Funds Allocation</h2>
                <div className="space-y-8">
                  {[
                    { label: 'R&D / Product Dept', key: 'allocationRD' },
                    { label: 'Sales & Growth', key: 'allocationMarketing' },
                    { label: 'Core Team Scale', key: 'allocationHiring' },
                    { label: 'Operations & G&A', key: 'allocationOps' }
                  ].map(item => (
                    <div key={item.key} className="space-y-4">
                       <div className="flex justify-between items-center px-1 font-black text-[10px] uppercase tracking-widest text-gray-500">
                          <span>{item.label}</span>
                          <span className="text-[#022f42] text-sm">{data[item.key as keyof typeof data]}%</span>
                       </div>
                       <input 
                        type="range" min="0" max="100" 
                        value={data[item.key as keyof typeof data] as number}
                        onChange={e=>setData({...data, [item.key]: parseInt(e.target.value)})}
                        className="w-full h-1.5 bg-gray-100 appearance-none cursor-pointer accent-[#022f42] rounded-full" 
                       />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Synthesis */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12 uppercase tracking-tight">Financial Blueprint Finalized</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="bg-[#f2f6fa] p-10 rounded-sm">
                      <BarChart3 className="w-10 h-10 text-[#022f42] mx-auto mb-6" />
                      <h4 className="text-[10px] font-black uppercase text-[#1e4a62] mb-4 tracking-widest">Efficiency Synthesis</h4>
                      <p className="text-sm font-medium leading-relaxed text-[#1e4a62]/80">
                         Allocation of <strong className="text-[#022f42]">{data.allocationRD + data.allocationMarketing}%</strong> toward high-leverage growth (R&D + GTM) mirrors institutional-grade capital deployment.
                      </p>
                   </div>
                   <div className="bg-[#022f42] text-white p-10 rounded-sm flex flex-col justify-center shadow-xl">
                      <h4 className="text-[10px] font-black uppercase text-[#ffd800] mb-3 tracking-widest">Valuation Justification</h4>
                      <div className="text-4xl font-black mb-2">RM {postMoney.toLocaleString()}</div>
                      <p className="text-[10px] text-[#b0d0e0] uppercase font-bold tracking-widest uppercase">Target Post-Money</p>
                   </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-[0.2em] transition-all rounded-sm flex items-center gap-3 shadow-2xl active:scale-95 ${savedSuccess ? 'bg-emerald-500 text-white' : 'bg-[#ffd800] hover:bg-white text-[#022f42]'}`}>
                    {savedSuccess ? 'Strategy Recorded' : 'Lock Round Mechanics'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8">
            <button onClick={() => setStep(s => Math.max(1, s - 1))} className={`font-black text-[10px] tracking-[0.2em] uppercase flex items-center gap-2 transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1e4a62] hover:text-[#022f42]'}`} disabled={step === 1}>
              <ArrowLeft className="w-4 h-4"/> Back
            </button>
            {step < 3 && (
              <button onClick={handleNextStep} className="bg-[#022f42] text-white px-10 py-4 font-black text-[10px] tracking-[0.2em] uppercase rounded-sm hover:bg-[#ffd800] hover:text-[#022f42] transition-all flex items-center gap-2 shadow-lg">
                Next Phase <ArrowRight className="w-4 h-4"/>
              </button>
            )}
          </div>
        </div>

        {/* Live Calculation Sidebar */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-[#022f42] p-8 text-white relative overflow-hidden shadow-2xl rounded-sm border-b-4 border-[#ffd800]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffd800] rounded-full blur-[80px] opacity-10"></div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#ffd800] mb-8 flex items-center gap-3">
              <Activity className="w-4 h-4" /> Round Physics Panel
            </h3>

            <div className="space-y-8 relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#b0d0e0] mb-2">Target Dilution</p>
                <div className="flex items-end justify-between mb-3">
                  <p className={`text-5xl font-black ${dilution > 25 ? "text-rose-400" : "text-[#ffd800]"}`}>
                    {dilution.toFixed(1)}%
                  </p>
                  <span className={`text-[9px] font-black px-2 py-1 tracking-widest uppercase rounded-sm ${dilution > 25 ? "bg-rose-500/20 text-rose-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                    {dilution > 25 ? "High" : "Healthy"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-400" style={{ width: `${100-dilution}%` }} />
                </div>
                <p className="text-[9px] text-[#b0d0e0] mt-3 font-medium">Standard seed dilution: 15% - 20%</p>
              </div>

              {mrr > 0 && (
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#b0d0e0] mb-2">ARR Revenue Multiple</p>
                  <p className="text-3xl font-black text-white">{(data.preMoney / (mrr * 12)).toFixed(1)}x</p>
                  <p className="text-[9px] text-[#b0d0e0] mt-1 font-medium italic opacity-60">Implied ARR: RM {(mrr * 12).toLocaleString()}</p>
                </div>
              )}
              
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#b0d0e0] mb-4 group cursor-help">
                   Milestone Trajectory
                </p>
                <div className="space-y-3">
                   {data.milestones.filter(m => m.trim()).map((m, idx) => (
                     <div key={idx} className="flex gap-3 items-start">
                        <Check className="w-3 h-3 text-[#ffd800] shrink-0 mt-0.5" />
                        <span className="text-[10px] font-medium text-[#b0d0e0] leading-tight">{m}</span>
                     </div>
                   ))}
                   {data.milestones.filter(m => m.trim()).length === 0 && (
                     <p className="text-[10px] italic text-[#b0d0e0]/40">No milestones defined yet.</p>
                   )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f2f6fa] p-8 rounded-sm border border-gray-100 flex flex-col items-center">
             <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm mb-4 shadow-sm">
                <PieChart className="w-6 h-6 text-[#022f42]" />
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-1">Growth Leverage</h4>
             <div className="text-3xl font-black text-[#022f42]">{data.allocationRD + data.allocationMarketing}%</div>
             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-1 tracking-widest">Aggressive Deployment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
