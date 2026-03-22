"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, ShieldAlert, AlertTriangle, TrendingDown, TrendingUp, HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function PMFPage() {
  const [step, setStep] = useState(1);
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

  // Persistence
  useEffect(() => {
    // Try to load customer type from 1.1.2 Persona
    try {
      const saved112 = localStorage.getItem("audit_1_1_2");
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
    if (isLoaded) localStorage.setItem("audit_1_1_6", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const calcPainkillerWeight = () => {
    switch (data.painkillerChoice) {
      case 'A': return 100; // 40 pts max * (100 Weight) = 1.0 * 100? Let's normalize everything to 100 then weight it.
      case 'B': return 62.5; // 25 / 40
      case 'C': return 25; // 10 / 40
      case 'D': return 0;
      default: return 0;
    }
  };

  const getPMFScore = () => {
    // Painkiller Weight (30%)
    const pWeight = calcPainkillerWeight() * 0.30;
    
    // Paid Customers (20%)
    const paidWeight = data.paidPercent * 0.20;
    
    // Retention (20%)
    const retWeight = data.retentionPercent * 0.20;
    
    // NPS Normalized (15%) (-100 to 100 mapped to 0 to 100)
    const npsNormalized = ((data.npsScore + 100) / 200) * 100;
    const npsWeight = npsNormalized * 0.15;
    
    // Growth Rate (15%) (0 to 100% cap)
    const growthCap = Math.max(0, Math.min(100, data.growthRate));
    const growthWeight = growthCap * 0.15;

    return Math.round(pWeight + paidWeight + retWeight + npsWeight + growthWeight);
  };

  const pmfScore = getPMFScore();

  // AI Feedback Updates
  useEffect(() => {
    // Step 1
    if (data.painkillerChoice === 'A' || data.painkillerChoice === 'B') {
      setAiFlags(p => ({...p, step1: "This is a painkiller problem – investors will be highly interested. Highlight urgency in your pitch."}));
    } else if (data.painkillerChoice === 'C' || data.painkillerChoice === 'D') {
      setAiFlags(p => ({...p, step1: "This is a vitamin – you'll need exceptional marketing or a very large market to succeed. Consider how to make your solution more essential."}));
    }

    // Step 2a (Paid)
    if (data.paidPercent <= 10) setAiFlags(p => ({...p, step2a: "At 0-10%, you're still in the hypothesis stage. Focus on getting your first paying customers."}));
    else if (data.paidPercent <= 50) setAiFlags(p => ({...p, step2a: "At 30-50%, you have early validation – enough for a pre-seed round."}));
    else setAiFlags(p => ({...p, step2a: "At 50%+, you're showing strong product-market fit – ideal for Series A."}));

    // Step 2b (Retention)
    if (data.retentionPercent <= 30) setAiFlags(p => ({...p, step2b: "Low retention suggests your product isn't solving a recurring problem – revisit your core value proposition."}));
    else setAiFlags(p => ({...p, step2b: "High retention is a powerful signal – investors will heavily favor this metric."}));

    // Step 2c (NPS)
    if (data.npsScore < 0) setAiFlags(p => ({...p, step2c: "NPS below 0 indicates an excess of detractors – investors will see this as a red flag."}));
    else if (data.npsScore < 50) setAiFlags(p => ({...p, step2c: "NPS is neutral to acceptable. Focus on converting passive users to active promoters."}));
    else setAiFlags(p => ({...p, step2c: "NPS above 50 means customers love you – use this heavily in your pitch!"}));

    // Step 3a (Adoption)
    if (data.adoptionStage <= 2) setAiFlags(p => ({...p, step3a: "At this stage, investors will focus on your vision and team. Financial traction is not yet expected."}));
    else if (data.adoptionStage === 3) setAiFlags(p => ({...p, step3a: "You have early proof of concept – now the main question is whether you can scale it efficiently."}));
    else if (data.adoptionStage >= 4) setAiFlags(p => ({...p, step3a: "Strong, scalable traction! You are well positioned to approach institutional investors."}));

    // Step 3b (MRR)
    const mrrVal = parseFloat(data.mrr) || 0;
    if (data.adoptionStage === 2) setAiFlags(p => ({...p, step3b: "At your stage, investors don't expect significant revenue – focus on user engagement loops."}));
    else if (data.adoptionStage === 3) setAiFlags(p => ({...p, step3b: mrrVal >= 1000 && mrrVal <= 10000 ? "Your MRR is within the typical seed stage range ($1k-$10k)." : "Ensure your MRR aligns with the narrative of your selected stage ($1k-$10k)."}));
    else if (data.adoptionStage >= 4) setAiFlags(p => ({...p, step3b: mrrVal > 10000 ? "Your MRR is robust – investors will expect consistent linear/exponential growth to $100k+ for Series A." : "Your MRR appears low relative to your targeted stage of adoption."}));

    // Step 3c (Growth)
    if (data.growthRate < 0) setAiFlags(p => ({...p, step3c: "Negative growth is a severe red flag. Diagnose why customers are leaving before speaking to investors."}));
    else if (data.growthRate <= 20) setAiFlags(p => ({...p, step3c: "10-20% MoM growth is incredibly healthy – an excellent trajectory for Seed stage."}));
    else setAiFlags(p => ({...p, step3c: "30%+ MoM growth is exceptional compounding momentum – highlight this front and center!"}));

    // Step 4 (Overall)
    if (pmfScore < 30) setAiFlags(p => ({...p, step4: `Your PMF Score of ${pmfScore} places you in the 'Early Validation' category. Focus heavily on acquiring and retaining early true fans.`}));
    else if (pmfScore < 50) setAiFlags(p => ({...p, step4: `Your PMF Score of ${pmfScore} indicates emerging fit. Seed investors will be interested, but Series A will require higher scoring.`}));
    else setAiFlags(p => ({...p, step4: `Your PMF Score of ${pmfScore} is investment-grade. You have structural leverage when talking to venture funds.`}));

  }, [data, pmfScore]);

  const handleNextStep = () => setStep(Math.min(6, step + 1));

  const toggleMilestone = (m: string) => {
    setData(prev => ({
      ...prev,
      milestones: prev.milestones.includes(m) 
        ? prev.milestones.filter(x => x !== m)
        : [...prev.milestones, m]
    }));
  };

  const setMilestoneDate = (m: string, date: string) => {
    setData(prev => ({ ...prev, milestoneDates: { ...prev.milestoneDates, [m]: date } }));
  };

  const getAdoptionStageName = () => {
    switch(data.adoptionStage) {
      case 1: return "Idea/Prototype";
      case 2: return "Beta/Pilot";
      case 3: return "Early Traction";
      case 4: return "Scalable Traction";
      case 5: return "Proven Fit";
      default: return "Pre-Launch";
    }
  };

  const defaultSummary = `Our product is a ${data.painkillerChoice === 'A' || data.painkillerChoice === 'B' ? 'Painkiller' : 'Vitamin'} for ${customerContext}. ${data.paidPercent}% of customers pay, with ${data.retentionPercent}% retention and an NPS of ${data.npsScore}. We are at the ${getAdoptionStageName()} stage with $${data.mrr || "0"} in monthly revenue moving at ${data.growthRate}% MoM growth. Our critical traction milestones achieved include: ${data.milestones.length > 0 ? data.milestones.join(", ") : "None formally logged yet"}.`;

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/audit/7-revenue", 1000); 
  };

  const milestoneOptions = [
    "First paying customer",
    "First $1k MRR",
    "First $10k MRR",
    "First $100k MRR",
    "First 10 customers",
    "First 100 customers",
    "First 1,000 customers",
    "First enterprise contract",
    "First international customer",
    "First partnership / channel deal",
    "Achieved default alive (Cash flow positive)"
  ];

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.6 Product-Market Fit & Traction"
        title="Painkiller vs. Vitamin Test"
        description="Determine whether your product is a 'must-have' or 'nice-to-have', and objectively assess traction metrics using investor-grade rubrics."
      />

      {/* Progress Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={`h-2 flex-1 md:w-16 rounded-full transition-all ${step >= i ? 'bg-[#022f42]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest whitespace-nowrap ml-4">Step {step} of 6</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Assessment */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">
                  Is your product a must-have or nice-to-have?
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm flex items-center gap-2">
                  If your product disappeared tomorrow, how would your customers react? <span title="Investors use this exact question to determine if you're solving a painkiller (must-have) or vitamin (nice-to-have)."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span>
                </p>

                <div className="space-y-3">
                  <button onClick={() => setData({...data, painkillerChoice: 'A'})} className={`w-full p-6 border-2 rounded-sm text-left flex items-start gap-4 transition-all ${data.painkillerChoice === 'A' ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <span className="text-3xl">😱</span>
                    <div>
                      <h4 className="font-black text-emerald-900">They would be devastated</h4>
                      <p className="text-sm text-emerald-800">They would actively pull levers to search for an immediate replacement that very day.</p>
                      <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">+40 PMF Points</div>
                    </div>
                  </button>
                  <button onClick={() => setData({...data, painkillerChoice: 'B'})} className={`w-full p-6 border-2 rounded-sm text-left flex items-start gap-4 transition-all ${data.painkillerChoice === 'B' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <span className="text-3xl">😟</span>
                    <div>
                      <h4 className="font-black text-indigo-900">They would be significantly inconvenienced</h4>
                      <p className="text-sm text-indigo-800">They would likely notice within days and immediately seek alternatives to run their stack.</p>
                      <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">+25 PMF Points</div>
                    </div>
                  </button>
                  <button onClick={() => setData({...data, painkillerChoice: 'C'})} className={`w-full p-6 border-2 rounded-sm text-left flex items-start gap-4 transition-all ${data.painkillerChoice === 'C' ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <span className="text-3xl">😐</span>
                    <div>
                      <h4 className="font-black text-amber-900">They would notice eventually</h4>
                      <p className="text-sm text-amber-800">They could survive and live without it, but highly prefer not to.</p>
                      <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-amber-600">+10 PMF Points</div>
                    </div>
                  </button>
                  <button onClick={() => setData({...data, painkillerChoice: 'D'})} className={`w-full p-6 border-2 rounded-sm text-left flex items-start gap-4 transition-all ${data.painkillerChoice === 'D' ? 'border-rose-500 bg-rose-50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                    <span className="text-3xl">😌</span>
                    <div>
                      <h4 className="font-black text-rose-900">They wouldn&apos;t structurally notice</h4>
                      <p className="text-sm text-rose-800">It is genuinely a nice-to-have but definitely not an operational necessity.</p>
                      <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-rose-600">0 PMF Points</div>
                    </div>
                  </button>
                </div>

                {data.painkillerChoice && aiFlags.step1 && (
                  <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <AIAssistedInsight content={aiFlags.step1} />
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 2: Behavior Validation */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">What do your customers&apos; actions say?</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Quantitative reality check on true behavioral product-market scale.</p>

                <div className="space-y-10">
                  {/* Paid */}
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-sm relative">
                    <div className="flex justify-between items-end mb-4">
                      <label className="text-sm font-bold text-[#022f42] flex items-center gap-2">What percentage of customers actually pay? <span title="Paid customers are the absolute ultimate proof of PMF. Investors disregard un-monetized free users."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                      <span className={`text-3xl font-black ${data.paidPercent > 50 ? 'text-emerald-500' : data.paidPercent > 10 ? 'text-amber-500' : 'text-rose-500'}`}>{data.paidPercent}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={data.paidPercent} onChange={e=>setData({...data, paidPercent: parseInt(e.target.value)})} className={`w-full accent-${data.paidPercent > 50 ? 'emerald' : data.paidPercent > 10 ? 'amber' : 'rose'}-500`} />
                    <AIAssistedInsight content={aiFlags.step2a} />
                  </div>

                  {/* Retention */}
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-sm relative">
                    <div className="flex justify-between items-end mb-4">
                      <label className="text-sm font-bold text-[#022f42] flex items-center gap-2">What is your cohort retention (repeat usage) rate? <span title="SaaS > 90% annually is elite. Consumer > 40% monthly is strong. Growth means nothing with a leaky bucket funnel."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                      <span className={`text-3xl font-black ${data.retentionPercent > 70 ? 'text-emerald-500' : data.retentionPercent > 30 ? 'text-amber-500' : 'text-rose-500'}`}>{data.retentionPercent}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={data.retentionPercent} onChange={e=>setData({...data, retentionPercent: parseInt(e.target.value)})} className={`w-full accent-${data.retentionPercent > 70 ? 'emerald' : data.retentionPercent > 30 ? 'amber' : 'rose'}-500`} />
                    <AIAssistedInsight content={aiFlags.step2b} />
                  </div>

                  {/* NPS */}
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-sm relative">
                    <div className="flex justify-between items-end mb-4">
                      <label className="text-sm font-bold text-[#022f42] flex items-center gap-2">Net Promoter Score (NPS) <span title="NPS measures word of mouth virality. Above 50 is Apple-tier obsession."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                      <span className={`text-3xl font-black ${data.npsScore > 50 ? 'text-emerald-600' : data.npsScore > 30 ? 'text-emerald-500' : data.npsScore > 0 ? 'text-amber-500' : 'text-rose-500'}`}>{data.npsScore > 0 && '+'}{data.npsScore}</span>
                    </div>
                    <input type="range" min="-100" max="100" value={data.npsScore} onChange={e=>setData({...data, npsScore: parseInt(e.target.value)})} className="w-full" />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-2">
                       <span>-100 Detractors</span>
                       <span>0 Neutral</span>
                       <span>+100 Promoters</span>
                    </div>
                    <AIAssistedInsight content={aiFlags.step2c} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Traction & Adoption Stage */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Where are you on the adoption curve?</h2>
                <p className="text-[#1e4a62] mb-8 text-sm flex items-center gap-2">Your tier signals strictly to what class of investor you seek. <span title="Don't lie. Investors diligence MRR instantly."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-10">
                   {[
                    {id: 1, icon: "💡", title: "Idea / Prototype", desc: "No launch. Pre-seed.", color: "bg-gray-100"},
                    {id: 2, icon: "🧪", title: "Beta / Pilot", desc: "< 10 paid. Angels.", color: "bg-indigo-50"},
                    {id: 3, icon: "🚀", title: "Early Traction", desc: "10-50 paid. Seed.", color: "bg-indigo-100"},
                    {id: 4, icon: "📈", title: "Scalable", desc: "50-500. $10k+. Series A-", color: "bg-emerald-100"},
                    {id: 5, icon: "🏆", title: "Proven Fit", desc: ">500. $100k+. Series A+", color: "bg-emerald-200"}
                   ].map(st => (
                     <button key={st.id} onClick={() => setData({...data, adoptionStage: st.id})} className={`p-4 rounded-sm border-2 text-left flex flex-col items-center justify-between transition-all ${data.adoptionStage === st.id ? `border-[#022f42] ${st.color} shadow-md transform scale-105` : 'border-gray-200 hover:border-[#1e4a62] bg-white'}`}>
                        <div className="text-2xl mb-2">{st.icon}</div>
                        <div className="font-black text-[#022f42] text-xs text-center leading-tight mb-2">{st.title}</div>
                        <div className="text-[10px] text-[#1e4a62] text-center font-bold">{st.desc}</div>
                     </button>
                   ))}
                </div>

                {data.adoptionStage > 0 && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="space-y-6">
                    <div className="bg-[#f2f6fa] p-6 rounded-sm border border-gray-100">
                      <label className="text-sm font-bold text-[#022f42] mb-2 flex items-center gap-2">Monthly Recurring Revenue (MRR) <span title="Total monthly revenue derived strictly from the product unit economics."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">$</span>
                        <input type="number" value={data.mrr} onChange={e=>setData({...data, mrr: e.target.value})} placeholder="15000" className="w-full pl-10 p-4 border border-gray-200 rounded-sm outline-none focus:border-[#ffd800] font-mono text-xl font-bold text-[#022f42]" />
                      </div>
                      <AIAssistedInsight content={aiFlags.step3b} />
                    </div>

                    <div className="bg-[#f2f6fa] p-6 rounded-sm border border-gray-100">
                      <div className="flex justify-between items-end mb-4">
                        <label className="text-sm font-bold text-[#022f42] flex items-center gap-2">MoM Revenue Growth Rate (Last 3 Mos) <span title="SaaS Seed stage demands 10-20% MoM."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                        <span className={`text-2xl font-black flex items-center gap-1 ${data.growthRate < 0 ? 'text-rose-500' : data.growthRate > 30 ? 'text-emerald-500' : 'text-indigo-600'}`}>{data.growthRate < 0 ? <TrendingDown className="w-5 h-5"/> : <TrendingUp className="w-5 h-5"/>} {data.growthRate}%</span>
                      </div>
                      <input type="range" min="-50" max="100" step="5" value={data.growthRate} onChange={e=>setData({...data, growthRate: parseInt(e.target.value)})} className="w-full" />
                      <AIAssistedInsight content={aiFlags.step3c} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 4: PMF Score */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border border-gray-100 rounded-sm text-center">
                 <h2 className="text-3xl font-black text-[#022f42] mb-2 flex items-center justify-center gap-2">
                    Your Product-Market Fit Score
                    <span title="The culmination of your metrics via weighted investor rubrics."><Info className="w-5 h-5 text-gray-300 cursor-help"/></span>
                 </h2>
                 <p className="text-[#1e4a62] mb-10 text-sm">Real-time compilation of essential status and behavioral validation variables.</p>

                 <div className="flex flex-col items-center justify-center mb-10">
                  <div className="relative w-56 h-56 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                      <path className={`${pmfScore >= 76 ? 'text-emerald-500' : pmfScore >= 51 ? 'text-yellow-400' : pmfScore >= 31 ? 'text-orange-400' : 'text-rose-500'} transition-all duration-1000`} strokeDasharray={`${Math.max(1, pmfScore)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-7xl font-black text-[#022f42] tracking-tighter">{pmfScore}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e4a62] mt-1 opacity-50">/ 100</span>
                    </div>
                  </div>
                  <div className="text-center mt-6">
                    <div className={`font-black uppercase tracking-widest text-lg ${pmfScore >= 76 ? 'text-emerald-600' : pmfScore >= 51 ? 'text-yellow-600' : pmfScore >= 31 ? 'text-orange-500' : 'text-rose-600'}`}>
                      {pmfScore >= 76 ? "Proven PMF – Investment Grade" : pmfScore >= 51 ? "Strong Fit – Scalable" : pmfScore >= 31 ? "Emerging Fit – Early Validation" : "Early Stage – Hypothesis"}
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-sm text-left">
                  <h4 className="font-black text-indigo-900 mb-2 flex items-center gap-2">Institutional Investor Insight</h4>
                  <AIAssistedInsight content={aiFlags.step4} />
                </div>
              </motion.div>
            )}

            {/* STEP 5: Milestones */}
            {step === 5 && (
              <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">Your Traction Story – Visualized</h2>
                <p className="text-[#1e4a62] mb-8 text-sm flex items-center gap-2">Select the formal milestones you have conclusively cleared. <span title="A density of recent milestones indicates pure unbridled momentum."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {milestoneOptions.map(m => (
                    <div key={m} className={`border rounded-sm p-3 flex items-center gap-3 transition-colors ${data.milestones.includes(m) ? 'border-[#022f42] bg-[#f2f6fa]' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="checkbox" checked={data.milestones.includes(m)} onChange={() => toggleMilestone(m)} className="w-4 h-4 accent-[#022f42] rounded-sm cursor-pointer"/>
                      <div className="flex-1 text-sm font-bold text-[#022f42] cursor-pointer selection:bg-transparent" onClick={() => toggleMilestone(m)}>{m}</div>
                      {data.milestones.includes(m) && (
                        <input type="month" value={data.milestoneDates[m] || ""} onChange={e=>setMilestoneDate(m, e.target.value)} className="text-xs p-1 border border-gray-200 rounded outline-none" />
                      )}
                    </div>
                  ))}
                </div>

                {data.milestones.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <h4 className="font-black text-xs uppercase tracking-widest text-[#1e4a62] mb-6 text-center">Current Traction Geometry</h4>
                    <div className="relative pt-6 pb-2 px-4 overflow-x-auto">
                      <div className="flex absolute top-8 left-6 right-6 h-0.5 bg-gray-200 z-0"></div>
                      <div className="flex justify-between items-start min-w-[600px] relative z-10 gap-4">
                        {data.milestones.map((m, idx) => (
                           <div key={idx} className="flex flex-col items-center w-24 hover:-translate-y-1 transition-transform group cursor-pointer relative">
                             <div className="w-5 h-5 rounded-full bg-[#022f42] border-4 border-white shadow shadow-gray-200 z-10"></div>
                             <div className="text-xs font-bold text-center mt-3 text-[#022f42] group-hover:text-indigo-600 line-clamp-3">{m}</div>
                             {data.milestoneDates[m] && <div className="text-[10px] text-gray-400 font-mono mt-1">{data.milestoneDates[m]}</div>}
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 6: PMF Summary */}
            {step === 6 && (
              <motion.div key="s6" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center justify-center gap-2">Your PMF & Traction Pitch</h2>
                <p className="text-[#1e4a62] mb-8 text-sm text-center">Synthesized algorithmically into a rigorous investor snapshot.</p>

                <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-6 md:p-8 rounded-sm mb-8 relative">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-black text-[#1e4a62]/60 uppercase tracking-widest">Editable Traction Statement</label>
                    {data.uvpOverride !== undefined && (
                      <button onClick={() => setData({...data, uvpOverride: undefined})} className="text-xs font-bold text-indigo-500 hover:text-indigo-700">Restore Auto-Sync</button>
                    )}
                  </div>
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultSummary}
                    onChange={(e) => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-transparent p-0 border-0 outline-none text-[#022f42] font-semibold text-xl min-h-[160px] leading-relaxed resize-none focus:ring-0"
                  />
                </div>

                <div className="flex justify-center flex-col md:flex-row gap-4">
                  <Link href="/dashboard/score" className="px-8 py-4 font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-500 hover:bg-gray-50">
                    Exit Workshop
                  </Link>
                  <button onClick={handleSaveAndContinue} className={`px-12 py-4 font-black uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#022f42] hover:bg-[#1b4f68] text-white'}`}>
                    {savedSuccess ? <><Check className="w-5 h-5"/> Saved Securely</> : <><Save className="w-5 h-5"/> Commit PMF Data</>}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation */}
          {step < 6 && (
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} className={`font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1e4a62] hover:text-[#022f42]'}`} disabled={step === 1}>
                <ArrowLeft className="w-4 h-4"/> Back
              </button>
              <button onClick={handleNextStep} disabled={(step === 1 && !data.painkillerChoice)} className={`px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm transition-colors flex items-center gap-2 shadow-md ${step === 1 && !data.painkillerChoice ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#022f42] text-white hover:bg-[#1b4f68]'}`}>
                Next Step <ArrowRight className="w-4 h-4"/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
