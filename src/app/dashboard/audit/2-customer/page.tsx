"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Info, Target, CheckCircle2, AlertCircle, ChevronDown, 
  MapPin, Briefcase, Building2, Activity, Save, Check, Sparkles, ExternalLink, ArrowLeft, ArrowRight
} from "lucide-react";
import Link from "next/link";

const SIZES = ["Pre-seed", "1-10 employees", "11-50 employees", "51-200 employees", "200+ employees"];
const INDUSTRIES = ["SaaS", "E-commerce", "Manufacturing", "Healthcare", "Fintech", "Consumer Social", "Deep Tech", "Other"];
const DEFAULT_CHANNELS = ["LinkedIn", "Twitter / X", "Industry conferences", "Slack communities", "Podcasts / newsletters / articles", "Referrals from existing customers"];

export default function PersonaBuilderPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  const [data, setData] = useState({
    role: "",
    size: "",
    industry: "",
    geo: "",
    scenario: "",
    jtbd: "",
    channels: [] as { name: string; tactic: string }[],
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({
    step1: "",
    step2: "",
    step3: "",
    step4: ""
  });

  // Persistence (SOP: Privacy-First Hybrid - Local Storage)
  useEffect(() => {
    const saved = localStorage.getItem("audit_1_1_2_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data || data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {
        console.error("Failed to load audit 1.1.2 v2", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("audit_1_1_2_v2", JSON.stringify({ data, step }));
    }
  }, [data, step, isLoaded]);

  // Scoring Math
  const calculateScore = () => {
    let score = 0;
    if (data.role.length > 2) score += 15;
    if (data.size) score += 10;
    if (data.industry) score += 10;
    if (data.geo.length > 2) score += 10;
    if (data.scenario.length > 15) score += 20;
    if (data.jtbd.length > 5) score += 15;
    
    const configuredChannels = data.channels.filter(c => c.tactic && c.tactic.length > 5);
    if (configuredChannels.length > 0) score += 20;
    return score;
  };

  const score = calculateScore();

  // Handlers and Live AI Feedback (SOP: AI Insights)
  const handleRoleChange = (val: string) => {
    setData(prev => ({ ...prev, role: val }));
    const lval = val.toLowerCase();
    if (lval.includes("entrepreneur") || lval.includes("owner") || lval.includes("business")) {
      setAiFlags(p => ({ ...p, step1: "'Entrepreneur' or 'Owner' is too vague. Try 'Founder', 'CEO', or specify the exact department lead." }));
    } else if (lval.length > 3) {
      setAiFlags(p => ({ ...p, step1: "Great – a specific role with clear decision-making authority." }));
    } else {
      setAiFlags(p => ({ ...p, step1: "" }));
    }
  };

  const handleScenarioChange = (val: string) => {
    setData(prev => ({ ...prev, scenario: val }));
    const lval = val.toLowerCase();
    if (lval.length > 20 && !lval.includes("frustrat") && !lval.includes("anxious") && !lval.includes("stress") && !lval.includes("hate") && !lval.includes("pain") && !lval.includes("hours")) {
      setAiFlags(p => ({ ...p, step2: "You described the task, but not how it makes them feel or the time it costs. Add context to humanise the pain." }));
    } else if (lval.length > 20) {
      setAiFlags(p => ({ ...p, step2: "You named the time waste/emotion – investors will appreciate this precision." }));
    }
  };

  const handleJTBDChange = (val: string) => {
    setData(prev => ({ ...prev, jtbd: val }));
    const lval = val.toLowerCase();
    if (lval.length > 10 && !lval.includes("in ") && !lval.includes("under") && !lval.includes("%") && !lval.includes("$") && !lval.includes("without")) {
      setAiFlags(p => ({ ...p, step2: "Consider adding a measurable result (e.g. 'in under 5 minutes' or 'without manual math') to strengthen the value prop." }));
    } else if (lval.length > 10) {
      setAiFlags(p => ({ ...p, step2: "Your JTBD is clear and measurable – investors will appreciate that." }));
    }
  };

  const toggleChannel = (name: string) => {
    setData(prev => {
      const exists = prev.channels.find(c => c.name === name);
      if (exists) {
        return { ...prev, channels: prev.channels.filter(c => c.name !== name) };
      } else {
        return { ...prev, channels: [...prev.channels, { name, tactic: "" }] };
      }
    });
  };

  const updateTactic = (name: string, tactic: string) => {
    setData(prev => ({
      ...prev,
      channels: prev.channels.map(c => c.name === name ? { ...c, tactic } : c)
    }));
  };

  useEffect(() => {
    if (data.channels.length === 0) setAiFlags(p => ({ ...p, step3: "You haven't identified any acquisition channels – this is a major gap for investors." }));
    else {
      const emptyTactics = data.channels.filter(c => c.tactic.length < 5);
      if (emptyTactics.length > 0) {
        setAiFlags(p => ({ ...p, step3: `You selected ${emptyTactics[0].name} but didn't explain how you'll use it. Add a specific tactic.` }));
      } else {
        setAiFlags(p => ({ ...p, step3: "Your channel plan is realistic and execution-focused." }));
      }
    }
  }, [data.channels]);

  const defaultSummary = `${data.role||"[Role]"} at ${data.size||"[Company Size]"} ${data.industry||"[Industry]"} companies in ${data.geo||"[Geography]"}\n\nDaily struggle: ${data.scenario||"[Daily scenario summary]"}\n\nHires your solution to: ${data.jtbd||"[JTBD]"}\n\nBest reached via: ${data.channels.length>0 ? data.channels.map(c => `${c.name} ${c.tactic?"("+c.tactic+")":""}`).join(', ') : "[List of channels with tactics]"}`;


  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      window.location.href = "/dashboard/audit/3-competitor";
    }, 1000);
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.2 Who Exactly?"
        title="Persona Builder Workshop"
        description="Investors invest in companies that know their customer so well they can draw them. A vague 'SMEs' signals a lack of focus. This module enforces specificity."
      />

      {/* Progress Bar (SOP: Clickable Navigation) */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-2">
          {[1,2,3,4].map(i => (
            <button 
              key={i} 
              onClick={() => setStep(i)}
              className={`h-2 w-12 md:w-24 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'} hover:opacity-80 cursor-pointer`} 
              title={`Jump to Step ${i}`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-[#022f42] uppercase tracking-widest">Step {step} of 4</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Interactive Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Demographic */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Step 1: Who Is Your Customer?</h2>
                <p className="text-[#1e4a62] mb-8 text-sm uppercase tracking-widest font-bold">Demographic Foundation</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-5 border-2 border-[#1e4a62]/10 rounded-sm">
                    <label className="block text-sm font-bold text-[#022f42] mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-emerald-500"/> Job Title / Role</span>
                    </label>
                    <input type="text" value={data.role} onChange={e => handleRoleChange(e.target.value)} placeholder="e.g. CFO, VP of Logistics" className="w-full p-3 border-2 border-[#1e4a62]/10 rounded-sm focus:border-[#ffd800] outline-none text-sm font-medium" />
                  </div>

                  <div className="bg-white p-5 border-2 border-[#1e4a62]/10 rounded-sm">
                    <label className="block text-sm font-bold text-[#022f42] mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-500"/> Geography</span>
                    </label>
                    <input type="text" value={data.geo} onChange={e => setData({...data, geo: e.target.value})} placeholder="e.g. North America, Global" className="w-full p-3 border-2 border-[#1e4a62]/10 rounded-sm focus:border-[#ffd800] outline-none text-sm font-medium" />
                  </div>
                </div>

                <div className="bg-white p-5 border-2 border-[#1e4a62]/10 rounded-sm mb-6">
                  <label className="block text-sm font-bold text-[#022f42] mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500"/> Company Size & Industry
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select value={data.size} onChange={e => setData({...data, size: e.target.value})} className="w-full p-3 border-2 border-[#1e4a62]/10 rounded-sm outline-none text-sm font-medium bg-white">
                      <option value="">Select Size...</option>
                      {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={data.industry} onChange={e => setData({...data, industry: e.target.value})} className="w-full p-3 border-2 border-[#1e4a62]/10 rounded-sm outline-none text-sm font-medium bg-white">
                      <option value="">Select Industry...</option>
                      {INDUSTRIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Psychographic */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Step 2: What Does Their Day Look Like?</h2>
                <p className="text-[#1e4a62] mb-8 text-sm uppercase tracking-widest font-bold">Psychographic Depth</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-3">Daily Scenario (The Struggle)</label>
                    <textarea 
                      value={data.scenario} 
                      onChange={e => handleScenarioChange(e.target.value)} 
                      maxLength={300}
                      placeholder="Describe the moment of pain..." 
                      className="w-full p-4 border-2 border-[#1e4a62]/10 rounded-sm focus:border-[#ffd800] outline-none text-sm font-medium min-h-[140px] resize-none" 
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{data.scenario.length}/300</div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-3">Job-to-Be-Done (JTBD)</label>
                    <input 
                      type="text"
                      value={data.jtbd} 
                      onChange={e => handleJTBDChange(e.target.value)} 
                      maxLength={150}
                      placeholder="What is the core measurable outcome they hire you for?" 
                      className="w-full p-4 border-2 border-[#1e4a62]/10 rounded-sm focus:border-[#ffd800] outline-none text-sm font-medium" 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: GTM */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-indigo-500 rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Step 3: How Do You Reach Them?</h2>
                <p className="text-[#1e4a62] mb-8 text-sm uppercase tracking-widest font-bold">Go-to-Market Clarity</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DEFAULT_CHANNELS.map(ch => {
                    const isSelected = data.channels.some(c => c.name === ch);
                    const channelData = data.channels.find(c => c.name === ch);
                    
                    return (
                      <div key={ch} className={`border-2 rounded-sm p-4 transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-300'}`}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleChannel(ch)} className="w-5 h-5 accent-indigo-600 rounded-sm" />
                          <span className={`font-bold text-sm ${isSelected ? 'text-indigo-900' : 'text-[#022f42]'}`}>{ch}</span>
                        </label>
                        
                        {isSelected && (
                          <div className="mt-3 ml-8">
                            <input 
                              type="text"
                              value={channelData?.tactic || ""}
                              onChange={(e) => updateTactic(ch, e.target.value)}
                              placeholder="Add specific tactic..."
                              className="w-full pb-1 border-b border-indigo-300 bg-transparent text-sm outline-none focus:border-indigo-600 font-medium"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Summary */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-emerald-500 rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-4 text-center">Summary & Investor Statement</h2>
                
                <div className="bg-[#f2f6fa] border-2 border-dashed border-[#1e4a62]/20 p-6 rounded-sm mb-8">
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultSummary}
                    onChange={e => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-white p-5 border-2 border-[#1e4a62]/10 rounded-sm focus:border-emerald-500 outline-none text-[#022f42] font-medium leading-relaxed min-h-[220px] resize-none"
                  />
                </div>

                <div className="flex justify-center">
                  <button onClick={handleSaveAndContinue} disabled={score < 50} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${score >= 50 ? (savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]') : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    {savedSuccess ? <Check className="w-5 h-5"/> : <Save className="w-5 h-5"/>} {savedSuccess ? 'Saved Persona' : 'Save & Continue'}
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
            
            {step < 4 && (
              <button
                onClick={() => setStep(s => Math.min(4, s + 1))}
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
                  {step === 1 ? (aiFlags.step1 || "Specific roles (e.g. 'CFO') are 10x more fundable than general 'users'.") : 
                   step === 2 ? (aiFlags.step2 || "Understanding the 'Daily Scenario' proves you have spoken to customers.") :
                   step === 3 ? (aiFlags.step3 || "Investors look for CAC (Acquisition Cost) clarity here.") :
                   "A clear summary is the heartbeat of your pitch deck."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/how-to-create-a-customer-persona-that-investors-believe" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Credible Personas →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Creating Personas VCs believe</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Persona Gauge</h4>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-[#022f42]">{score}%</div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${score === 100 ? 'bg-emerald-500' : 'bg-[#ffd800]'}`} style={{width: `${score}%`}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
