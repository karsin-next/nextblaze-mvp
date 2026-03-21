"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, DollarSign, Box, Zap, Repeat, Layers, Cpu, CreditCard
} from "lucide-react";
import Link from "next/link";

export default function RevenuePage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    primaryModel: "",
    hybridDescription: "",
    basePrice: "",
    pricingUnit: "per month",
    avgUnits: "1",
    tiers: "",
    assumptions: "",
    churnRisk: 5,
    differentiation: 5,
    criticality: 5,
    cogsPercent: "20",
    fixedCosts: "",
    marginScale: "improve",
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2a: "", step2b: "", step2c: "", step3: "", step4a: "", step4b: "" });
  const [customerContext, setCustomerContext] = useState("customers");

  // Persistence
  useEffect(() => {
    try {
      const saved112 = localStorage.getItem("audit_1_1_2");
      if (saved112) {
        const parsed = JSON.parse(saved112);
        if (parsed?.data?.role) setCustomerContext(parsed.data.role);
      }
    } catch(e) {}

    const saved = localStorage.getItem("audit_1_1_7");
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
    if (isLoaded) localStorage.setItem("audit_1_1_7", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const arpu = (parseFloat(data.basePrice) || 0) * (parseFloat(data.avgUnits) || 1);
  
  const getPricingPowerScore = () => {
    // (Diff * 0.4) + (Crit * 0.4) + (Reverse churn risk * 0.2) mapped to 100
    // Sliders are 1-10
    const diffPoints = data.differentiation * 4;
    const critPoints = data.criticality * 4;
    const churnPoints = (11 - data.churnRisk) * 2;
    return diffPoints + critPoints + churnPoints;
  };

  const pPowerScore = getPricingPowerScore();

  const getGrossMargin = () => {
    return Math.max(0, 100 - (parseFloat(data.cogsPercent) || 0));
  };

  const grossMargin = getGrossMargin();

  // AI Feedback Updates
  useEffect(() => {
    // Step 1
    if (data.primaryModel === "subscription") setAiFlags(p => ({...p, step1: "Subscription models are highly valued by investors because they create predictable compounding revenue."}));
    else if (data.primaryModel === "transaction") setAiFlags(p => ({...p, step1: "Transaction models can scale massively. Ensure your take-rate defends against competitors."}));
    else if (data.primaryModel === "hardware") setAiFlags(p => ({...p, step1: "Hardware models can be capital-intensive—investors will want to see extremely strong gross margins to justify cash burn."}));
    else if (data.primaryModel === "freemium") setAiFlags(p => ({...p, step1: "Freemium requires a massive top-of-funnel structure. Expect investors to grill your free-to-paid conversion rate."}));
    else if (data.primaryModel === "licensing") setAiFlags(p => ({...p, step1: "Licensing IP is practically pure margin. If you have defensive patents, this is an excellent moat."}));
    else if (data.primaryModel === "hybrid") setAiFlags(p => ({...p, step1: "Please concisely describe your hybrid model below. Complexity can scare early investors if it lacks focus."}));

    // Step 2
    if (parseFloat(data.basePrice) > 0 && data.assumptions.trim().length < 10) {
      setAiFlags(p => ({...p, step2a: "You entered a price but little justification. Add specific psychological or ROI rationale to strengthen your leverage."}));
    } else {
      setAiFlags(p => ({...p, step2a: ""}));
    }

    if (parseFloat(data.basePrice) > 0 && parseFloat(data.basePrice) < 50 && data.pricingUnit.includes("month") && (data.primaryModel === "subscription" || data.primaryModel === "freemium")) {
      setAiFlags(p => ({...p, step2b: "At this price point, a direct outward sales team is structurally unviable due to CAC. You must rely on product-led growth (PLG) or viral loops."}));
    } else {
      setAiFlags(p => ({...p, step2b: ""}));
    }

    if (data.tiers.trim().length > 10) setAiFlags(p => ({...p, step2c: "Tiered architectural pricing is a strong signal of product-market segment isolation. Good job."}));
    else setAiFlags(p => ({...p, step2c: ""}));

    // Step 3
    if (data.churnRisk > 7 || data.differentiation < 4 || data.criticality < 4) {
      let r = [];
      if (data.churnRisk > 7) r.push("high churn sensitivity");
      if (data.differentiation < 4) r.push("low differentiation");
      if (data.criticality < 4) r.push("low criticality");
      setAiFlags(p => ({...p, step3: `This area represents a severe margin weakness (${r.join(", ")}). You must address this structural vulnerability before raising.`}));
    } else if (data.differentiation > 7 && data.criticality > 7 && data.churnRisk < 4) {
      setAiFlags(p => ({...p, step3: "Excellent pricing power dynamics—this monopolistic grip will mechanically expand your valuation multiple."}));
    } else if (data.differentiation > 7) {
      setAiFlags(p => ({...p, step3: "Your perceived differentiation is high—lean heavily on this unique paradigm within your investor pitch."}));
    } else {
      setAiFlags(p => ({...p, step3: "Moderate leverage. Continue solidifying your product moat to decouple from general market price wars."}));
    }

    // Step 4
    if (grossMargin > 70) setAiFlags(p => ({...p, step4a: "Excellent—this is standard for top-tier software and inherently scalable."}));
    else if (grossMargin >= 40) setAiFlags(p => ({...p, step4a: "Healthy margin space. Investors will accept this assuming strong secondary unit economics."}));
    else setAiFlags(p => ({...p, step4a: "Low structural margins. Institutional investors will scrutinize your scale velocity and hardware costs relentlessly."}));

    if (data.marginScale === "decrease") setAiFlags(p => ({...p, step4b: "Diminishing margin scale is highly toxic. Ensure you have overwhelming volume justifications to counteract investors' fears of variable complexity."}));
    else if (data.marginScale === "improve") setAiFlags(p => ({...p, step4b: "Economies of scale mapped nicely. Highlight your software-like marginal cost decay when scaling."}));
    else setAiFlags(p => ({...p, step4b: ""}));

  }, [data, grossMargin]);

  const handleNextStep = () => setStep(Math.min(5, step + 1));

  const defaultSummary = `[Startup Name] generates revenue through a ${data.primaryModel === 'hybrid' ? data.hybridDescription || 'custom hybrid model' : data.primaryModel} model with a starting rate of $${data.basePrice || "0"} ${data.pricingUnit}. The primary customer segment is categorized as ${customerContext}. Operating gross margins sit at roughly ${grossMargin}%, which are modeled to ${data.marginScale} systematically against geometric scale. Institutional pricing power is evaluated as ${pPowerScore >= 80 ? 'strong' : pPowerScore >= 50 ? 'moderate' : 'weak'}, driven explicitly by ${data.differentiation > 6 ? 'high differentiation' : 'moderate differentiation'} and ${data.criticality > 6 ? 'mission-critical reliance' : 'discretionary spend risk'} within the customer stack.`;

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/audit/1-problem", 1000); // Or to next stage
  };

  const revenueModels = [
    { id: "subscription", icon: Repeat, title: "Subscription / SaaS", desc: "Recurring fee for ongoing access.", common: "Software, content" },
    { id: "transaction", icon: Zap, title: "Transaction / Usage", desc: "Per-transaction pay-as-you-go.", common: "Marketplaces, APIs" },
    { id: "hardware", icon: Cpu, title: "Hardware / Device", desc: "One-time sale of physical components.", common: "IoT, MedTech" },
    { id: "freemium", icon: Layers, title: "Freemium", desc: "Free structural tier with premium gates.", common: "Mobile Apps, B2C SaaS" },
    { id: "licensing", icon: CreditCard, title: "Licensing / IP", desc: "Upfront capital + strict royalties.", common: "BioTech, Enterprise" },
    { id: "hybrid", icon: Box, title: "Hybrid / Other", desc: "Complex layer of composite structures.", common: "Custom/Hardware-SaaS" }
  ];

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.7 Revenue Model Explorer"
        title="How You'll Make Money"
        description="Explicitly define how your firm captures value, quantify ultimate pricing power, and validate margin scalability."
      />

      {/* Progress Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-2 flex-1 md:w-16 rounded-full transition-all ${step >= i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm font-bold text-indigo-900 uppercase tracking-widest whitespace-nowrap ml-4">Step {step} of 5</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Revenue Model */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-indigo-600 rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">
                  Choose Your Primary Revenue Model
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm flex items-center gap-2">
                  How does value empirically convert into recognized capital? <span title="Your revenue model defines how you capture value. Choose the primary model—you can layer others later."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {revenueModels.map(m => (
                    <button key={m.id} onClick={() => setData({...data, primaryModel: m.id})} className={`p-6 border-2 rounded-sm text-left transition-all relative overflow-hidden ${data.primaryModel === m.id ? 'border-indigo-600 bg-indigo-50/50 shadow-md' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      {data.primaryModel === m.id && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>}
                      <m.icon className={`w-8 h-8 mb-4 ${data.primaryModel === m.id ? 'text-indigo-600' : 'text-gray-400'}`}/>
                      <h4 className={`font-black mb-1 ${data.primaryModel === m.id ? 'text-indigo-900' : 'text-[#022f42]'}`}>{m.title}</h4>
                      <p className="text-xs text-gray-500 mb-3">{m.desc}</p>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#1e4a62] bg-gray-100 py-1 px-2 rounded inline-block">Used in: {m.common}</div>
                    </button>
                  ))}
                </div>

                {data.primaryModel === 'hybrid' && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mb-6">
                    <label className="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-2 block">Hybrid Description (1-2 sentences)</label>
                    <textarea 
                      value={data.hybridDescription} 
                      onChange={e=>setData({...data, hybridDescription: e.target.value})} 
                      placeholder="e.g., We combine a SaaS subscription baseline with an aggressive volume-based payment gateway take rate."
                      className="w-full p-4 border border-indigo-200 rounded-sm outline-none focus:border-indigo-500 bg-indigo-50"
                      rows={2}
                    />
                  </motion.div>
                )}

                {data.primaryModel && aiFlags.step1 && (
                  <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mt-6 flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-indigo-500 shrink-0" />
                    <p className="text-sm text-indigo-900 font-medium">{aiFlags.step1}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 2: Pricing Structure */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-indigo-600 rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Define Your Pricing Structure</h2>
                <p className="text-[#1e4a62] mb-8 text-sm flex items-center gap-2">Move from abstract conceptualization to objective billing math. <span title="Investors want to see that you've systematically engineered pricing based on ROI logic, not random dart throws."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-[#022f42] mb-2 block text-gray-900">Base Price / Nominal Start</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                        <input type="number" value={data.basePrice} onChange={e=>setData({...data, basePrice: e.target.value})} placeholder="99.00" className="w-full pl-8 p-3 border border-gray-300 rounded-sm outline-none focus:border-indigo-500" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#022f42] mb-2 block">Pricing Frequency / Unit Basis</label>
                      <select value={data.pricingUnit} onChange={e=>setData({...data, pricingUnit: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-indigo-500 bg-white">
                        <option value="per month">Per Month</option>
                        <option value="per year">Per Year</option>
                        <option value="per transaction">Per Transaction</option>
                        <option value="per user per month">Per User, Per Month</option>
                        <option value="per unit">Per Widget / Physical Unit</option>
                        <option value="one-time fixed">One-Time Perpetual</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#022f42] mb-2 block">Average Units / Users per Contract</label>
                      <input type="number" value={data.avgUnits} onChange={e=>setData({...data, avgUnits: e.target.value})} placeholder="1" className="w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-indigo-500" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Multiplier logic for calculating Account ARPU</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* ARPU Card */}
                    <div className="p-6 bg-[#022f42] text-white rounded-sm shadow-inner relative overflow-hidden">
                       <div className="absolute -right-4 -bottom-4 opacity-10"><DollarSign className="w-32 h-32"/></div>
                       <div className="relative z-10">
                         <h4 className="text-xs font-black uppercase tracking-widest text-[#8cd0e8] mb-1">Average Rev Per Account (ARPU)</h4>
                         <div className="text-4xl font-black">${arpu.toLocaleString()}</div>
                         <div className="text-xs text-[#8cd0e8] mt-2 font-mono">Gross expectation per localized cohort run.</div>
                       </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-[#022f42] mb-2 block">Tiered Architecture (Optional)</label>
                      <textarea value={data.tiers} onChange={e=>setData({...data, tiers: e.target.value})} rows={2} placeholder="e.g. Starter $29, Pro $99, Scale $299" className="w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-indigo-500"></textarea>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-sm font-bold text-[#022f42] mb-2 block">Psychological & ROI Pricing Assumptions</label>
                  <textarea value={data.assumptions} onChange={e=>setData({...data, assumptions: e.target.value})} rows={3} placeholder="We charge $1k/mo because this directly replaces a $5k/mo FTE. Customer ROI is aggressively positive day one." className="w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-indigo-500"></textarea>
                </div>

                {(aiFlags.step2a || aiFlags.step2b || aiFlags.step2c) && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col gap-2 p-4 bg-indigo-50 border border-indigo-200 rounded-sm">
                    {aiFlags.step2a && <div className="text-xs font-bold text-indigo-900 border-l-2 border-indigo-500 pl-2">{aiFlags.step2a}</div>}
                    {aiFlags.step2b && <div className="text-xs font-bold text-indigo-900 border-l-2 border-indigo-500 pl-2">{aiFlags.step2b}</div>}
                    {aiFlags.step2c && <div className="text-xs font-bold text-indigo-900 border-l-2 border-emerald-500 pl-2 text-emerald-800">{aiFlags.step2c}</div>}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Pricing Power Assessment */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-indigo-600 rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Assess Core Pricing Power</h2>
                <p className="text-[#1e4a62] mb-8 text-sm flex items-center gap-2">Evaluate your systemic moat against margin erosion. <span title="Strong power lets you command extreme ROI multiples. Weak power forces a race to the gross margin bottom."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-sm">
                     <label className="text-sm font-bold text-[#022f42] mb-4 block text-center">Price Shock Retraction<br/><span className="text-[10px] text-gray-400 uppercase tracking-widest">(20% Price Hike Churn)</span></label>
                     <div className="text-center font-black text-3xl mb-4 text-rose-600">{data.churnRisk}</div>
                     <input type="range" min="1" max="10" value={data.churnRisk} onChange={e=>setData({...data, churnRisk: parseInt(e.target.value)})} className="w-full accent-rose-500 mb-2"/>
                     <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400"><span>1 (None Leave)</span><span>10 (Mass Exodus)</span></div>
                  </div>

                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-sm">
                     <label className="text-sm font-bold text-[#022f42] mb-4 block text-center">Product Differentiation<br/><span className="text-[10px] text-gray-400 uppercase tracking-widest">(Feature Moat)</span></label>
                     <div className="text-center font-black text-3xl mb-4 text-indigo-600">{data.differentiation}</div>
                     <input type="range" min="1" max="10" value={data.differentiation} onChange={e=>setData({...data, differentiation: parseInt(e.target.value)})} className="w-full accent-indigo-500 mb-2"/>
                     <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400"><span>1 (Identical)</span><span>10 (Monopoly)</span></div>
                  </div>

                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-sm">
                     <label className="text-sm font-bold text-[#022f42] mb-4 block text-center">Workflow Criticality<br/><span className="text-[10px] text-gray-400 uppercase tracking-widest">(Infrastructure Tie-in)</span></label>
                     <div className="text-center font-black text-3xl mb-4 text-amber-600">{data.criticality}</div>
                     <input type="range" min="1" max="10" value={data.criticality} onChange={e=>setData({...data, criticality: parseInt(e.target.value)})} className="w-full accent-amber-500 mb-2"/>
                     <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400"><span>1 (Nice to Have)</span><span>10 (Essential)</span></div>
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center mb-6">
                   <div className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2">Live Pricing Power Index</div>
                   <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                      <path className={`${pPowerScore >= 80 ? 'text-emerald-500' : pPowerScore >= 50 ? 'text-yellow-400' : 'text-rose-500'} transition-all duration-1000`} strokeDasharray={`${Math.max(1, pPowerScore)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-5xl font-black text-[#022f42] tracking-tighter">{pPowerScore}</span>
                    </div>
                  </div>
                  <div className={`mt-4 font-black text-sm uppercase tracking-widest ${pPowerScore >= 80 ? 'text-emerald-600' : pPowerScore >= 50 ? 'text-yellow-600' : 'text-rose-600'}`}>
                    {pPowerScore >= 80 ? 'Strong Power - Premium Tiering Enabled' : pPowerScore >= 50 ? 'Moderate Leverage - Defend Unique Features' : 'Weak Power - High Downward Margin Threat'}
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-sm text-center">
                  <p className="text-sm text-indigo-900 font-bold">{aiFlags.step3}</p>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Margins */}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-indigo-600 rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Project Margins & Cost Scalability</h2>
                <p className="text-[#1e4a62] mb-8 text-sm flex items-center gap-2">Define explicit operational overhead unit limits. <span title="Gross margin is the primary filter SaaS investors inject to map long-term Enterprise Value."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-[#022f42] mb-2 block">Direct Cost of Goods Sold (COGS) %</label>
                      <div className="relative">
                        <input type="number" value={data.cogsPercent} onChange={e=>setData({...data, cogsPercent: e.target.value})} placeholder="20" className="w-full pl-4 pr-8 p-3 border border-gray-300 rounded-sm outline-none focus:border-indigo-500" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tight">E.g., AWS compute, human-in-the-loop server time, payment processing</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-bold text-[#022f42] mb-2 block">Enterprise Fixed Monthly Run-Rate (Optional)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                        <input type="number" value={data.fixedCosts} onChange={e=>setData({...data, fixedCosts: e.target.value})} placeholder="50000" className="w-full pl-8 p-3 border border-gray-300 rounded-sm outline-none focus:border-indigo-500" />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tight">Sunk overhead unaffected by immediate unit sales (Rent, Headcount)</p>
                    </div>
                  </div>

                  <div className="bg-[#f0f9ff] border border-blue-100 p-6 rounded-sm flex flex-col items-center justify-center">
                     <h4 className="text-xs uppercase tracking-widest font-black text-blue-900 mb-4 opacity-70">Unit Core Gross Margin</h4>
                     <div className={`text-6xl font-black mb-4 ${grossMargin >= 70 ? 'text-emerald-500' : grossMargin >= 40 ? 'text-blue-500' : 'text-rose-500'}`}>{grossMargin}%</div>
                     <p className="text-center text-xs font-bold text-blue-800 leading-relaxed">{aiFlags.step4a}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                   <h3 className="font-black text-[#022f42] mb-4">Geometric Variance at Enterprise Scale</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                     <button onClick={() => setData({...data, marginScale: "improve"})} className={`p-4 border-2 rounded-sm text-center text-sm font-bold transition-all ${data.marginScale === 'improve' ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Margins intrinsically IMPROVE<br/><span className="text-[10px] uppercase opacity-70">(SaaS software scale)</span></button>
                     <button onClick={() => setData({...data, marginScale: "stable"})} className={`p-4 border-2 rounded-sm text-center text-sm font-bold transition-all ${data.marginScale === 'stable' ? 'border-indigo-500 bg-indigo-50 text-indigo-900' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Margins stay EXACTLY STABLE<br/><span className="text-[10px] uppercase opacity-70">(Hard commoditized hardware)</span></button>
                     <button onClick={() => setData({...data, marginScale: "decrease"})} className={`p-4 border-2 rounded-sm text-center text-sm font-bold transition-all ${data.marginScale === 'decrease' ? 'border-rose-500 bg-rose-50 text-rose-900' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Margins systemically DECREASE<br/><span className="text-[10px] uppercase opacity-70">(Complex service layers bleed)</span></button>
                   </div>
                   {aiFlags.step4b && <p className="mt-4 text-xs font-bold text-indigo-600 text-center">{aiFlags.step4b}</p>}
                </div>

              </motion.div>
            )}

            {/* STEP 5: Revenue Summary */}
            {step === 5 && (
              <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(79,70,229,0.1)] border-t-[4px] border-indigo-600 rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center justify-center gap-2">Investor Revenue Pitch</h2>
                <p className="text-[#1e4a62] mb-8 text-sm text-center">Your structural business model, synthesized cleanly for direct deck integration.</p>

                <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-6 md:p-8 rounded-sm mb-8 relative">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-black text-[#1e4a62]/60 uppercase tracking-widest">Editable Monopolistic Statement</label>
                    {data.uvpOverride !== undefined && (
                      <button onClick={() => setData({...data, uvpOverride: undefined})} className="text-xs font-bold text-indigo-500 hover:text-indigo-700">Restore Algorithm Sync</button>
                    )}
                  </div>
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultSummary}
                    onChange={(e) => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-transparent p-0 border-0 outline-none text-[#022f42] font-semibold text-xl min-h-[160px] leading-relaxed resize-none focus:ring-0"
                  />
                  <div className="mt-4 px-3 py-2 bg-white/50 border border-indigo-100 rounded text-xs font-mono font-bold text-indigo-800 break-words flex items-center justify-between">
                     <span>✓ Readily compatible with 4.1 Deck Studio</span>
                     <button className="underline">Copy to clipboard</button>
                  </div>
                </div>

                <div className="flex justify-center flex-col md:flex-row gap-4">
                  <Link href="/dashboard/score" className="px-8 py-4 font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-500 hover:bg-gray-50">
                    Exit Explorer
                  </Link>
                  <button onClick={handleSaveAndContinue} className={`px-12 py-4 font-black uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}>
                    {savedSuccess ? <><Check className="w-5 h-5"/> Safely Transmitted</> : <><Save className="w-5 h-5"/> Commit Revenue Data</>}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation */}
          {step < 5 && (
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} className={`font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1e4a62] hover:text-[#022f42]'}`} disabled={step === 1}>
                <ArrowLeft className="w-4 h-4"/> Back
              </button>
              <button onClick={handleNextStep} disabled={(step === 1 && !data.primaryModel) || (step === 2 && !data.basePrice)} className={`px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm transition-colors flex items-center gap-2 shadow-md ${((step === 1 && !data.primaryModel) || (step === 2 && !data.basePrice)) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                Next Workflow <ArrowRight className="w-4 h-4"/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
