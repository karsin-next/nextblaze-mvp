"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, ShieldAlert, AlertTriangle, TrendingDown, TrendingUp, HelpCircle, Sparkles, ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function PMFPage() {
  const [step, setStep] = useState(1);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    painkillerChoice: "", // 'A', 'B', 'C', 'D'
    paidPercent: 0,
    retentionPercent: 0,
    npsScore: 0,
    adoptionStage: 0, // 1 to 5
    mrr: "",
    growthRate: 0,
    milestones: [] as string[],
    milestoneDates: {} as Record<string, string>,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2a: "", step2b: "", step2c: "", step3a: "", step3b: "", step3c: "", step4: "", step5: "" });
  const [customerContext, setCustomerContext] = useState("[customer type]");

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    try {
      const saved112 = localStorage.getItem("audit_1_1_2_v2");
      if (saved112) {
        const parsed = JSON.parse(saved112);
        if (parsed?.data?.role) setCustomerContext(parsed.data.role);
      }
    } catch(e) {}

    const saved = localStorage.getItem("audit_1_1_6");
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
    if (isLoaded) localStorage.setItem("audit_1_1_6", JSON.stringify({ data, step, score: getPMFScore() }));
  }, [data, step, isLoaded]);

  // Calculations
  const calcPainkillerWeight = () => {
    switch (data.painkillerChoice) {
      case 'A': return 100;
      case 'B': return 62.5;
      case 'C': return 25;
      case 'D': return 0;
      default: return 0;
    }
  };

  const getPMFScore = () => {
    const pWeight = calcPainkillerWeight() * 0.30;
    const paidWeight = data.paidPercent * 0.20;
    const retWeight = data.retentionPercent * 0.20;
    const npsNormalized = ((data.npsScore + 100) / 200) * 100;
    const npsWeight = npsNormalized * 0.15;
    const growthCap = Math.max(0, Math.min(100, data.growthRate));
    const growthWeight = growthCap * 0.15;
    return Math.round(pWeight + paidWeight + retWeight + npsWeight + growthWeight);
  };

  const pmfScore = getPMFScore();

  // AI Feedback Updates
  useEffect(() => {
    if (data.painkillerChoice === 'A' || data.painkillerChoice === 'B') {
      setAiFlags(p => ({...p, step1: "Painkiller identified. Focus on urgency."}));
    } else if (data.painkillerChoice) {
      setAiFlags(p => ({...p, step1: "Vitamin category needs massive distribution scale."}));
    }

    if (data.paidPercent <= 10) setAiFlags(p => ({...p, step2a: "Still in hypothesis stage."}));
    else setAiFlags(p => ({...p, step2a: "Early traction validation."}));

    if (data.retentionPercent <= 30) setAiFlags(p => ({...p, step2b: "High churn risk detected."}));
    else setAiFlags(p => ({...p, step2b: "Strong value retention signal."}));

    if (data.npsScore < 0) setAiFlags(p => ({...p, step2c: "Detractor alert."}));
    else if (data.npsScore > 50) setAiFlags(p => ({...p, step2c: "Promoter-grade obsession."}));

  }, [data]);

  const handleNextStep = () => setStep(Math.min(6, step + 1));

  const toggleMilestone = (m: string) => {
    setData(prev => ({
      ...prev,
      milestones: prev.milestones.includes(m) ? prev.milestones.filter(x => x !== m) : [...prev.milestones, m]
    }));
  };

  const defaultSummary = `Our product is a ${data.painkillerChoice === 'A' || data.painkillerChoice === 'B' ? 'Painkiller' : 'Vitamin'} for ${customerContext}. ${data.paidPercent}% pay, with ${data.retentionPercent}% retention. Current MRR: $${data.mrr || "0"} at ${data.growthRate}% MoM. Traction milestones: ${data.milestones.length > 0 ? data.milestones.join(", ") : "Building..."}.`;

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/audit/7-revenue", 1000); 
  };

  const milestoneOptions = [
    "First paying customer", "First $1k MRR", "First $10k MRR", "First 10 customers", "First 100 customers", "Achieved default alive"
  ];

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.6 Product-Market Fit & Traction"
        title="PMF & Traction Workshop"
        description="Determine whether your product is a 'must-have' or 'nice-to-have', and objectively assess traction metrics using investor-grade rubrics."
      />

      {/* Progress Bar (SOP: Clickable Navigation) */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          {[1,2,3,4,5,6].map(i => (
            <button 
              key={i} 
              onClick={() => setStep(i)}
              className={`h-2 w-10 md:w-16 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'} hover:opacity-80 cursor-pointer`} 
              title={`Jump to Step ${i}`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-[#022f42] uppercase tracking-widest ml-4">Step {step} of 6</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Assessment */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Is your product a must-have or nice-to-have?</h2>
                <div className="space-y-3 mt-6">
                  {['A', 'B', 'C', 'D'].map(choice => (
                    <button key={choice} onClick={() => setData({...data, painkillerChoice: choice})} className={`w-full p-6 border-2 rounded-sm text-left flex items-start gap-4 transition-all ${data.painkillerChoice === choice ? 'border-[#022f42] bg-gray-50 shadow-md' : 'border-gray-100 bg-white'}`}>
                      <div className="font-black text-[#022f42]">
                        {choice === 'A' ? "🏆 Devastated if gone (Painkiller)" : choice === 'B' ? "📊 Significant Inconvenience" : choice === 'C' ? "😐 Notice Eventually (Vitamin)" : "😌 Wouldn't Structurally Notice"}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Behavior */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8">What do your customers&apos; actions say?</h2>
                <div className="space-y-10">
                  {/* Paid */}
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <div className="flex justify-between items-end mb-4">
                      <label className="text-xs font-black uppercase text-gray-400">Paid Adoption Rate</label>
                      <span className="text-3xl font-black text-[#022f42]">{data.paidPercent}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={data.paidPercent} onChange={e=>setData({...data, paidPercent: parseInt(e.target.value)})} className="w-full accent-[#022f42]" />
                  </div>
                  {/* Retention */}
                  <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <div className="flex justify-between items-end mb-4">
                      <label className="text-xs font-black uppercase text-gray-400">Cohort Retention</label>
                      <span className="text-3xl font-black text-[#022f42]">{data.retentionPercent}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={data.retentionPercent} onChange={e=>setData({...data, retentionPercent: parseInt(e.target.value)})} className="w-full accent-[#022f42]" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Revenue Stage */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8">Adoption & MRR Stage</h2>
                <div className="space-y-6">
                  <div className="bg-[#f2f6fa] p-6 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Monthly Recurring Revenue (MRR)</label>
                    <input type="number" value={data.mrr} onChange={e=>setData({...data, mrr: e.target.value})} placeholder="15000" className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-mono font-bold" />
                  </div>
                  <div className="bg-[#f2f6fa] p-6 rounded-sm">
                    <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Growth Rate (%)</label>
                    <input type="range" min="-50" max="100" value={data.growthRate} onChange={e=>setData({...data, growthRate: parseInt(e.target.value)})} className="w-full accent-[#022f42]" />
                    <div className="text-right font-black text-[#022f42] mt-2">{data.growthRate}% MoM</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: PMF Score */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-emerald-500 rounded-sm text-center">
                 <h2 className="text-3xl font-black text-[#022f42] mb-10">PMF Scorecard</h2>
                 <div className="flex flex-col items-center justify-center mb-10">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                      <path className={`${pmfScore >= 60 ? 'text-emerald-500' : 'text-[#ffd800]'} transition-all duration-1000`} strokeDasharray={`${Math.max(1, pmfScore)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-6xl font-black text-[#022f42]">{pmfScore}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">/ 100</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Milestones */}
            {step === 5 && (
              <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8">Critical Traction Milestones</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {milestoneOptions.map(m => (
                    <button key={m} onClick={() => toggleMilestone(m)} className={`p-4 border rounded-sm text-left flex items-center gap-3 transition-colors ${data.milestones.includes(m) ? 'border-[#022f42] bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                      <Check className={`w-4 h-4 ${data.milestones.includes(m) ? 'text-[#022f42]' : 'text-gray-200'}`} />
                      <span className="text-sm font-bold text-[#022f42]">{m}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 6: Summary */}
            {step === 6 && (
              <motion.div key="s6" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 text-center">Traction Summary</h2>
                <div className="bg-[#f2f6fa] border-2 border-dashed border-gray-100 p-6 md:p-8 rounded-sm mb-8">
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultSummary}
                    onChange={(e) => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-white p-6 border border-gray-100 outline-none text-[#022f42] font-semibold text-lg min-h-[160px] leading-relaxed resize-none shadow-inner"
                  />
                </div>
                <div className="flex justify-center">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Saved' : 'Complete PMF Phase'}
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
            {step < 6 && (
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
                  {step === 1 ? (aiFlags.step1 || "PMF is not a one-time event; it's a structural relationship between customer pain and product execution.") : 
                   step === 2 ? (aiFlags.step2a || "Retention is the engine of compounding. Growth without retention is just marketing spend.") :
                   step === 3 ? (aiFlags.step3c || "MoM growth for a seed stage startup should aim for 15-20%.") :
                   "A score above 70 is considered 'investor grade' for early stage rounds."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/product-market-fit-mastery" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: PMF Mastery →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Engineering Growth</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">PMF Intensity</h4>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-[#022f42]">{pmfScore}%</div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${pmfScore >= 60 ? 'bg-emerald-500' : 'bg-[#ffd800]'}`} style={{width: `${pmfScore}%`}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
