"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Info, Target, CheckCircle2, AlertCircle, ChevronDown, 
  MapPin, Briefcase, Building2, Activity, Save, Check
} from "lucide-react";
import Link from "next/link";

const SIZES = ["Pre-seed", "1-10 employees", "11-50 employees", "51-200 employees", "200+ employees"];
const INDUSTRIES = ["SaaS", "E-commerce", "Manufacturing", "Healthcare", "Fintech", "Consumer Social", "Deep Tech", "Other"];
const DEFAULT_CHANNELS = ["LinkedIn", "Twitter / X", "Industry conferences", "Slack communities", "Podcasts / newsletters / articles", "Referrals from existing customers"];

export default function PersonaBuilderPage() {
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
    finalSummary: ""
  });

  const [aiFlags, setAiFlags] = useState({
    step1: "",
    step2: "",
    step3: "",
  });

  const [expanded, setExpanded] = useState({ s1: true, s2: true, s3: true, s4: true });

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("audit_1_1_2_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data || data);
      } catch (e) {
        console.error("Failed to load audit 1.1.2 v2", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("audit_1_1_2_v2", JSON.stringify({ data }));
    }
  }, [data, isLoaded]);

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

  // Handlers and Live AI Feedback
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

  // Auto Generate Summary
  useEffect(() => {
    const roleTxt = data.role || "[Role]";
    const sizeTxt = data.size || "[Company Size]";
    const indTxt = data.industry || "[Industry]";
    const geoTxt = data.geo || "[Geography]";
    const scenTxt = data.scenario || "[Daily scenario summary]";
    const jTBDTxt = data.jtbd || "[JTBD]";
    
    let chText = "[List of channels with tactics]";
    if (data.channels.length > 0) {
      chText = data.channels.filter(c => c.tactic).map(c => `${c.name} (${c.tactic})`).join(', ');
      if (!chText) chText = data.channels.map(c => c.name).join(', ');
    }

    const gen = `${roleTxt} at ${sizeTxt} ${indTxt} companies in ${geoTxt}\n\nDaily struggle: ${scenTxt}\n\nHires your solution to: ${jTBDTxt}\n\nBest reached via: ${chText}`;
    
    // Only auto-update if the user hasn't heavily edited it away from the template
    if (!data.finalSummary || data.finalSummary.includes("[Role]") || score < 100) {
      setData(prev => ({ ...prev, finalSummary: gen }));
    }
  }, [data.role, data.size, data.industry, data.geo, data.scenario, data.jtbd, data.channels, score]);

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
        title="Persona Builder"
        description="Investors invest in companies that know their customer so well they can draw them. A vague 'SMEs' signals a lack of focus. This module enforces specificity."
      />

      {/* Floating Sticky Score Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-md border-b border-[#1e4a62]/10 p-4 mb-8 -mx-6 px-6 md:mx-0 md:rounded-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4" stroke="currentColor"/>
              <path className={`${score === 100 ? 'text-emerald-500' : 'text-[#ffd800]'} transition-all duration-500`} strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4" stroke="currentColor"/>
            </svg>
            <span className="absolute text-xs font-black text-[#022f42]">{score}%</span>
          </div>
          <div>
            <div className="text-sm font-black text-[#022f42] uppercase tracking-widest">Persona Completeness</div>
            <div className={`text-xs ${score === 100 ? 'text-emerald-600 font-bold' : 'text-[#1e4a62]'}`}>
              {score === 100 ? 'Investors will see you truly understand your market.' : 'Complete the fields below to reach 100%'}
            </div>
          </div>
        </div>
        <button onClick={handleSaveAndContinue} disabled={score < 50} className={`hidden md:flex px-6 py-2.5 font-bold uppercase tracking-widest transition-all rounded-sm items-center gap-2 text-xs shadow-sm ${score >= 50 ? (savedSuccess ? 'bg-green-500 text-white' : 'bg-[#022f42] hover:bg-[#1b4f68] text-white') : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          {savedSuccess ? <Check className="w-4 h-4"/> : <Save className="w-4 h-4"/>} {savedSuccess ? 'Saved' : 'Save & Continue'}
        </button>
      </div>

      <div className="space-y-6">

        {/* STEP 1 */}
        <div className="bg-white shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border border-[#1e4a62]/10 rounded-sm overflow-hidden">
          <button onClick={() => setExpanded({...expanded, s1: !expanded.s1})} className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-50 transition-colors text-left border-l-[4px] border-l-[#022f42]">
            <div>
               <h2 className="text-xl font-black text-[#022f42] flex items-center gap-2">
                 Step 1: Who Is Your Customer?
               </h2>
               <p className="text-sm text-[#1e4a62] mt-1">Demographic Foundation</p>
            </div>
            <ChevronDown className={`w-6 h-6 text-[#1e4a62] transition-transform ${expanded.s1 ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expanded.s1 && (
              <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <label className="block text-sm font-bold text-[#022f42] mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2" title="Investors want to know who signs the cheque. Be specific about the decision-maker."><Briefcase className="w-4 h-4 text-emerald-500"/> Job Title / Role</span>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </label>
                    <input type="text" value={data.role} onChange={e => handleRoleChange(e.target.value)} placeholder="e.g. CFO, VP of Logistics" className="w-full p-3 border-2 border-[#1e4a62]/10 rounded-sm focus:border-[#ffd800] outline-none text-sm font-medium" />
                  </div>

                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <label className="block text-sm font-bold text-[#022f42] mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2" title="Investors assess whether your target market is large enough to scale."><Building2 className="w-4 h-4 text-blue-500"/> Company Size & Industry</span>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </label>
                    <div className="space-y-3">
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

                  <div className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm">
                    <label className="block text-sm font-bold text-[#022f42] mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2" title="If you're targeting multiple regions, investors will ask about go-to-market readiness in each."><MapPin className="w-4 h-4 text-rose-500"/> Geography</span>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </label>
                    <input type="text" value={data.geo} onChange={e => setData({...data, geo: e.target.value})} placeholder="e.g. North America, Global" className="w-full p-3 border-2 border-[#1e4a62]/10 rounded-sm focus:border-[#ffd800] outline-none text-sm font-medium" />
                  </div>
                </div>

                {aiFlags.step1 && (
                  <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <p className="text-sm text-emerald-900 font-medium">{aiFlags.step1}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* STEP 2 */}
        <div className="bg-white shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border border-[#1e4a62]/10 rounded-sm overflow-hidden">
          <button onClick={() => setExpanded({...expanded, s2: !expanded.s2})} className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-50 transition-colors text-left border-l-[4px] border-l-[#1e4a62]">
            <div>
               <h2 className="text-xl font-black text-[#022f42] flex items-center gap-2">
                 Step 2: What Does Their Day Look Like?
               </h2>
               <p className="text-sm text-[#1e4a62] mt-1">Psychographic Depth</p>
            </div>
            <ChevronDown className={`w-6 h-6 text-[#1e4a62] transition-transform ${expanded.s2 ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expanded.s2 && (
              <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-3 flex items-center justify-between">
                      <span title="Paint a vivid picture. The more specific, the more credible your understanding.">Daily Scenario</span>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </label>
                    <textarea 
                      value={data.scenario} 
                      onChange={e => handleScenarioChange(e.target.value)} 
                      maxLength={300}
                      placeholder="Example: A founder wakes up, checks Stripe, manually updates their runway spreadsheet, spends 2 hours anxiously preparing before an investor call..." 
                      className="w-full p-4 border-2 border-[#1e4a62]/10 rounded-sm focus:border-[#ffd800] outline-none text-sm font-medium min-h-[140px] resize-none" 
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{data.scenario.length}/300</div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-3 flex items-center justify-between">
                      <span title="The JTBD is the functional job they hire your product to do. Investors use this to assess product-market fit.">Job-to-Be-Done (JTBD)</span>
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    </label>
                    <p className="text-xs text-[#1e4a62] mb-3">What is the core measurable outcome they are trying to achieve?</p>
                    <input 
                      type="text"
                      value={data.jtbd} 
                      onChange={e => handleJTBDChange(e.target.value)} 
                      maxLength={150}
                      placeholder="e.g. 'To know exactly how much runway they have without manual math.'" 
                      className="w-full p-4 border-2 border-[#1e4a62]/10 rounded-sm focus:border-[#ffd800] outline-none text-sm font-medium" 
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{data.jtbd.length}/150</div>
                  </div>

                </div>

                {aiFlags.step2 && (
                  <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <p className="text-sm text-emerald-900 font-medium">{aiFlags.step2}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* STEP 3 */}
        <div className="bg-white shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border border-[#1e4a62]/10 rounded-sm overflow-hidden">
          <button onClick={() => setExpanded({...expanded, s3: !expanded.s3})} className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-50 transition-colors text-left border-l-[4px] border-l-indigo-500">
            <div>
               <h2 className="text-xl font-black text-[#022f42] flex items-center gap-2">
                 Step 3: How Do You Reach Them?
               </h2>
               <p className="text-sm text-[#1e4a62] mt-1">Go-to-Market Clarity</p>
            </div>
            <ChevronDown className={`w-6 h-6 text-[#1e4a62] transition-transform ${expanded.s3 ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expanded.s3 && (
              <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/30">
                <label className="block text-sm font-bold text-[#022f42] mb-6 flex items-center justify-between" title="Investors want to see that you have a realistic, cost-effective way to acquire customers. Cold outreach to the wrong channel wastes money.">
                  Where do your customers already spend time?
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </label>

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
                        
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div initial={{height:0, opacity:0, marginTop:0}} animate={{height:'auto', opacity:1, marginTop:12}} exit={{height:0, opacity:0, marginTop:0}}>
                              <div className="text-xs font-bold text-indigo-800 mb-1 ml-8">How will you reach them here?</div>
                              <input 
                                type="text"
                                value={channelData?.tactic || ""}
                                onChange={(e) => updateTactic(ch, e.target.value)}
                                placeholder="e.g. We will sponsor the top 3 SaaS podcasts"
                                className="w-full ml-8 pb-1 border-b border-indigo-300 bg-transparent text-sm outline-none focus:border-indigo-600 font-medium placeholder:text-indigo-300"
                                style={{ width: 'calc(100% - 2rem)'}}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>

                {aiFlags.step3 && (
                  <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <p className="text-sm text-emerald-900 font-medium">{aiFlags.step3}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* STEP 4 */}
        <div className="bg-white shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border border-[#1e4a62]/10 rounded-sm overflow-hidden">
          <button onClick={() => setExpanded({...expanded, s4: !expanded.s4})} className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-50 transition-colors text-left border-l-[4px] border-l-[#ffd800]">
            <div>
               <h2 className="text-xl font-black text-[#022f42] flex items-center gap-2">
                 Step 4: Summary & Investor Statement
               </h2>
               <p className="text-sm text-[#1e4a62] mt-1">Review the final output format.</p>
            </div>
            <ChevronDown className={`w-6 h-6 text-[#1e4a62] transition-transform ${expanded.s4 ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {expanded.s4 && (
              <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="p-6 md:p-8 border-t border-gray-100 bg-gray-50/30">
                <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-6 rounded-sm mb-6 relative hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 bg-[#ffd800] text-[#022f42] font-black uppercase tracking-widest text-[10px] px-3 py-1 pb-1.5 rounded-bl-sm">Generated Preview</div>
                  
                  <textarea 
                    value={data.finalSummary}
                    onChange={e => setData({...data, finalSummary: e.target.value})}
                    className="w-full bg-transparent border-none resize-none min-h-[160px] outline-none text-[#022f42] font-medium leading-relaxed"
                  />
                </div>

                <div className="flex justify-center mt-8">
                  <button onClick={handleSaveAndContinue} disabled={score < 50} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${score >= 50 ? (savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]') : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    {savedSuccess ? <><Check className="w-5 h-5"/> Saved Component</> : <><Save className="w-5 h-5"/> Save Persona & Continue</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
