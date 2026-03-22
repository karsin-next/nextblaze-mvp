"use client";

import { useState, useEffect, useRef } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, UserPlus, Users, X, AlertTriangle, Briefcase, Plus, TrendingUp, ShieldAlert, Award
} from "lucide-react";
import Link from "next/link";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  commitment: string;
  experience: string;
  responsibility: string;
  linkedin: string;
  startupExperience: string;
  education: string;
}

interface Gap {
  id: string;
  role: string;
  reason: string;
  suggestion: string;
  status: string; // 'open', 'in_progress', 'advisor', 'dismissed'
  plan: string;
}

interface Advisor {
  id: string;
  name: string;
  role: string;
  expertise: string;
  compensation: string;
}

export default function TeamScorecardPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    team: [] as TeamMember[],
    industryExpertise: 5,
    functionalCoverage: 5,
    executionTrackRecord: 5,
    founderChemistry: 5,
    identifiedGaps: [] as Gap[],
    advisors: [] as Advisor[],
    networkStrength: 5,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2a: "", step2b: "", step2c: "", step2d: "", step3: "", step4: "", step5: "" });

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("audit_1_1_8");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData(parsed.data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    } else {
      // Init a default founder
      setData(d => ({
        ...d,
        team: [{
          id: Date.now().toString(),
          name: "",
          role: "Co-Founder & CEO",
          commitment: "full-time",
          experience: "",
          responsibility: "",
          linkedin: "",
          startupExperience: "first",
          education: ""
        }]
      }));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("audit_1_1_8", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Gap Detection Algorithm
  useEffect(() => {
    if (!isLoaded) return;
    const roles = data.team.map(t => t.role.toLowerCase() + " " + t.responsibility.toLowerCase());
    const newGapsTemplate = [
      { id: "tech", role: "Technical Co-founder / CTO", reason: "Investors rarely fund non-technical founders building tech products.", suggestion: "Add a technical co-founder or a strong technical advisor with equity." },
      { id: "sales", role: "Sales / Revenue Leader", reason: "No sales leader = no revenue plan.", suggestion: "Hire a head of sales or add a sales-focused advisor." },
      { id: "marketing", role: "Marketing / Growth Lead", reason: "Without marketing, customer acquisition is unpredictable.", suggestion: "Consider a growth advisor or fractional CMO." },
      { id: "finance", role: "Financial / Operations Lead", reason: "Investors expect financial operational discipline.", suggestion: "Add a finance advisor or fractional CFO." }
    ];

    let detectedIds: string[] = [];

    if (!roles.some(r => r.includes("cto") || r.includes("tech") || r.includes("engineering") || r.includes("developer"))) detectedIds.push("tech");
    if (!roles.some(r => r.includes("sales") || r.includes("revenue") || r.includes("cro") || r.includes("business development"))) detectedIds.push("sales");
    if (!roles.some(r => r.includes("marketing") || r.includes("growth") || r.includes("cmo"))) detectedIds.push("marketing");
    if (!roles.some(r => r.includes("finance") || r.includes("ops") || r.includes("cfo") || r.includes("operations") || r.includes("coo"))) detectedIds.push("finance");
    
    if (data.advisors.length === 0) {
      newGapsTemplate.push({ id: "advisor", role: "Advisory Board", reason: "No external validation signals insular thinking.", suggestion: "Build an active advisory board with proven industry experts." });
      detectedIds.push("advisor");
    }

    setData(prev => {
      let updatedGaps = [...prev.identifiedGaps];
      
      // Remove gaps no longer detected
      updatedGaps = updatedGaps.filter(g => detectedIds.includes(g.id));

      // Add newly detected gaps (preserving existing state)
      detectedIds.forEach(id => {
        if (!updatedGaps.find(g => g.id === id)) {
          const tpl = newGapsTemplate.find(t => t.id === id);
          if (tpl) updatedGaps.push({ ...tpl, status: "open", plan: "" });
        }
      });

      // Avoid infinite loop by performing deep comparison or just checking length/ids
      const prevIds = prev.identifiedGaps.map(g => g.id).sort().join(",");
      const nextIds = updatedGaps.map(g => g.id).sort().join(",");
      if (prevIds !== nextIds) return { ...prev, identifiedGaps: updatedGaps };
      return prev;
    });

  }, [data.team, data.advisors, isLoaded]);

  // Calculations
  const getTeamScore = () => {
    return Math.round((data.industryExpertise + data.functionalCoverage + data.executionTrackRecord + data.founderChemistry) * 2.5);
  };
  const teamScore = getTeamScore();

  // AI Feedback Updates
  useEffect(() => {
    // Step 1
    if (data.team.length === 1) setAiFlags(p => ({...p, step1: "You're a solo founder. Investors generally perceive this as higher risk. We will proactively help you identify advisory gaps in Step 3."}));
    else if (data.team.some(t => t.commitment === "part-time")) setAiFlags(p => ({...p, step1: "One or more founders operate part-time. Investors heavily penalize split focus—consider establishing a timeline for 100% commitment."}));
    else setAiFlags(p => ({...p, step1: ""}));

    // Step 2
    if (data.functionalCoverage <= 4) setAiFlags(p => ({...p, step2a: `Your functional coverage score is ${data.functionalCoverage}—investors will severely drill down on missing execution pillars. Step 3 will map these holes.`}));
    else setAiFlags(p => ({...p, step2a: ""}));

    if (data.founderChemistry >= 8) setAiFlags(p => ({...p, step2b: "Strong chemistry markers detected—emphasize your historical joint-execution experience explicitly in the pitch deck."}));
    else if (data.founderChemistry <= 4) setAiFlags(p => ({...p, step2b: "Low chemistry signals internal friction risk. Clarify absolute decision-making hierarchy immediately."}));
    else setAiFlags(p => ({...p, step2b: ""}));

    // Step 3
    const dismissed = data.identifiedGaps.find(g => g.status === 'dismissed' && g.plan.length < 10);
    if (dismissed) setAiFlags(p => ({...p, step3: `You dismissed the ${dismissed.role} gap without a substantive backup plan—investors will heavily question this structural blind spot.`}));
    else setAiFlags(p => ({...p, step3: ""}));

    // Step 4
    if (data.networkStrength >= 8) setAiFlags(p => ({...p, step4: "Your network is a profound algorithmic asset—mention specific 2nd-degree connections naturally during your pitch (e.g., 'We have direct access to 20+ relevant tier-1 VCs')."}));
    else if (data.advisors.length > 0) setAiFlags(p => ({...p, step4: `Active advisor ${data.advisors[0].name} provides strong halo-effect credentials—deploy this aggressively.`}));
    else setAiFlags(p => ({...p, step4: "You lack robust advisory network nodes. Leverage your existing investors to map bridging connections."}));

  }, [data]);

  const handleNextStep = () => setStep(Math.min(5, step + 1));

  // Handlers
  const addTeamMember = () => {
    setData(p => ({
      ...p,
      team: [...p.team, {
        id: Date.now().toString(), name: "", role: "Core Member", commitment: "full-time", experience: "", responsibility: "", linkedin: "", startupExperience: "first", education: ""
      }]
    }));
  };
  const updateTeam = (id: string, field: keyof TeamMember, val: string) => {
    setData(p => ({ ...p, team: p.team.map(t => t.id === id ? { ...t, [field]: val } : t) }));
  };
  const removeTeam = (id: string) => {
    setData(p => ({ ...p, team: p.team.filter(t => t.id !== id) }));
  };

  const addAdvisor = () => {
    setData(p => ({
      ...p,
      advisors: [...p.advisors, { id: Date.now().toString(), name: "", role: "Strategic Advisor", expertise: "", compensation: "" }]
    }));
  };
  const updateAdvisor = (id: string, field: keyof Advisor, val: string) => {
    setData(p => ({ ...p, advisors: p.advisors.map(a => a.id === id ? { ...a, [field]: val } : a) }));
  };
  const removeAdvisor = (id: string) => {
    setData(p => ({ ...p, advisors: p.advisors.filter(a => a.id !== id) }));
  };

  const updateGap = (id: string, field: keyof Gap, val: string) => {
    setData(p => ({ ...p, identifiedGaps: p.identifiedGaps.map(g => g.id === id ? { ...g, [field]: val } : g) }));
  };

  const getScoreLabel = () => {
    if (teamScore >= 80) return "A-Team – Investor Confidence High";
    if (teamScore >= 60) return "Solid Foundation – Addressable Gaps";
    if (teamScore >= 40) return "Work in Progress – Critical Gaps Exist";
    return "High Risk – Immediate Action Required";
  };

  const defaultSummary = `Our founding team consists of ${data.team.length} core members including ${data.team.slice(0, 3).map(t => t.role).join(", ")}. Combined, we bring deep execution capability and structural knowledge. Our functional coverage framework sits at a strong ${teamScore}/100 base, with distinct leverage in ${data.industryExpertise >= data.executionTrackRecord ? 'Domain Expertise' : 'Historical Execution Velocity'}${data.identifiedGaps.filter(g => g.status === 'open').length > 0 ? `, and active talent acquisition occurring for a ${data.identifiedGaps.find(g => g.status === 'open')?.role || 'key operational layer'}` : ''}. We are structurally advised by ${data.advisors.length} industry veterans${data.advisors.length > 0 ? `, including ${data.advisors[0].name}` : ''}.`;

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/score", 1000); // Route logic
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.8 Team Composition Audit"
        title="The Founding Team Scorecard"
        description="Build a comprehensive, investor-ready view of your team that mathematically highlights compounding strengths, identifies functional gaps, and proves your sheer ability to execute."
      />

      {/* Progress Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-2 flex-1 md:w-16 rounded-full transition-all ${step >= i ? 'bg-[#022f42]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest whitespace-nowrap ml-4">Step {step} of 5</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Team Roster */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <div className="flex justify-between items-start mb-6">
                   <div>
                    <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">Build Your Team Roster</h2>
                    <p className="text-[#1e4a62] text-sm flex items-center gap-2">Quantify human capital allocation vectors. <span title="Investors want to see the full picture. Include co-founders, key executives, and even critical advisors here."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></p>
                   </div>
                   <button onClick={addTeamMember} className="px-4 py-2 bg-[#f2f6fa] hover:bg-[#e4eff7] text-[#022f42] font-bold text-sm tracking-widest uppercase rounded-sm flex items-center gap-2 transition-colors border border-gray-200">
                     <UserPlus className="w-4 h-4"/> Add Member
                   </button>
                </div>

                <div className="space-y-6">
                  {data.team.map((m, idx) => (
                    <div key={m.id} className="border-2 border-gray-200 rounded-sm p-6 bg-white relative overflow-hidden group">
                      {idx > 0 && <button onClick={() => removeTeam(m.id)} className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 transition-colors"><X className="w-5 h-5"/></button>}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <div>
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Full Legal Name</label>
                             <input type="text" value={m.name} onChange={e=>updateTeam(m.id, 'name', e.target.value)} placeholder="Sarah Chen" className="w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-[#022f42] font-bold text-[#022f42]" />
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                             <div>
                               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Official Role</label>
                               <input type="text" value={m.role} onChange={e=>updateTeam(m.id, 'role', e.target.value)} placeholder="Co-Founder & CTO" className="w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-[#022f42]" />
                             </div>
                             <div>
                               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Commitment</label>
                               <select value={m.commitment} onChange={e=>updateTeam(m.id, 'commitment', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-[#022f42] bg-white">
                                  <option value="full-time">Full-Time (100%)</option>
                                  <option value="part-time">Part-Time</option>
                                  <option value="advisor">Advisor / Fractional</option>
                                  <option value="board">Board of Directors</option>
                               </select>
                             </div>
                           </div>
                           <div>
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Startup Experience</label>
                             <select value={m.startupExperience} onChange={e=>updateTeam(m.id, 'startupExperience', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-[#022f42] bg-white">
                                <option value="first">First Startup (First-time Founder)</option>
                                <option value="failed">Previous Startup (Failed/Sunset)</option>
                                <option value="exited">Previous Startup (Successfully Exited)</option>
                                <option value="serial">Serial Entrepreneur (Multiple Companies)</option>
                             </select>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div>
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Relevant Expertise (Max 200C)</label>
                             <textarea value={m.experience} onChange={e=>updateTeam(m.id, 'experience', e.target.value)} rows={2} maxLength={200} placeholder="8 years in enterprise SaaS, led engineering at Acme Corp..." className="w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-[#022f42]"></textarea>
                           </div>
                           <div>
                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Key Responsibility Bracket</label>
                             <textarea value={m.responsibility} onChange={e=>updateTeam(m.id, 'responsibility', e.target.value)} rows={2} maxLength={150} placeholder="Owns product architecture, timeline routing, and all data modeling..." className="w-full p-3 border border-gray-300 rounded-sm outline-none focus:border-[#022f42]"></textarea>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <AIAssistedInsight content={aiFlags.step1} />
              </motion.div>
            )}

            {/* STEP 2: Strength Assessment */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Team Strength Assessment</h2>
                <p className="text-[#1e4a62] mb-8 text-sm flex items-center gap-2">Evaluate empirical team depth across the four core dimensions utilized by Institutional VC mandates.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                   {/* Industry */}
                   <div className="p-6 bg-[#f2f6fa] border border-[#1e4a62]/10 rounded-sm">
                      <label className="text-sm font-bold text-[#022f42] mb-4 flex justify-between items-center">Industry & SEC Expertise <span title="Domain expertise radically reduces operational execution risk."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl font-black text-[#022f42] w-12 text-center">{data.industryExpertise}</span>
                        <input type="range" min="1" max="10" value={data.industryExpertise} onChange={e=>setData({...data, industryExpertise: parseInt(e.target.value)})} className="w-full accent-[#022f42]"/>
                      </div>
                      <div className="flex justify-between text-[10px] tracking-widest uppercase font-bold text-[#1e4a62] mb-2"><span>1 (Zero Prior Context)</span><span>10 (10+ Yrs Elite Domain)</span></div>
                      {data.industryExpertise >= 7 ? <p className="text-xs font-bold text-emerald-600">✔ Strength—highlight industry track record immediately.</p> : <p className="text-xs font-bold text-amber-600">Consider sourcing an active advisor with SEC/Domain experience.</p>}
                   </div>

                   {/* Functional */}
                   <div className="p-6 bg-[#f2f6fa] border border-[#1e4a62]/10 rounded-sm">
                      <label className="text-sm font-bold text-[#022f42] mb-4 flex justify-between items-center">Structural Functional Coverage <span title="Can you independently build, ship, market, and sell the core asset?"><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl font-black text-[#022f42] w-12 text-center">{data.functionalCoverage}</span>
                        <input type="range" min="1" max="10" value={data.functionalCoverage} onChange={e=>setData({...data, functionalCoverage: parseInt(e.target.value)})} className="w-full accent-[#022f42]"/>
                      </div>
                      <div className="flex justify-between text-[10px] tracking-widest uppercase font-bold text-[#1e4a62] mb-2"><span>1 (Critical Missing Gaps)</span><span>10 (Full Operational Org)</span></div>
                      <p className="text-xs font-bold text-[#1e4a62]">{aiFlags.step2a || "Strong coverage architecture mitigates daily operational risk."}</p>
                   </div>

                   {/* Execution */}
                   <div className="p-6 bg-[#f2f6fa] border border-[#1e4a62]/10 rounded-sm">
                      <label className="text-sm font-bold text-[#022f42] mb-4 flex justify-between items-center">Prior Execution Track Record <span title="Prior execution history is the purest predictor of forward success vectors."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl font-black text-[#022f42] w-12 text-center">{data.executionTrackRecord}</span>
                        <input type="range" min="1" max="10" value={data.executionTrackRecord} onChange={e=>setData({...data, executionTrackRecord: parseInt(e.target.value)})} className="w-full accent-[#022f42]"/>
                      </div>
                      <div className="flex justify-between text-[10px] tracking-widest uppercase font-bold text-[#1e4a62]"><span>1 (Zero Delivery History)</span><span>10 (Multiple Ship Exits)</span></div>
                   </div>

                   {/* Chemistry */}
                   <div className="p-6 bg-[#f2f6fa] border border-[#1e4a62]/10 rounded-sm">
                      <label className="text-sm font-bold text-[#022f42] mb-4 flex justify-between items-center">Founder Chemistry & Conviction <span title="Discord splits equity tables. Complete dedication prevents sudden structural drops."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl font-black text-[#022f42] w-12 text-center">{data.founderChemistry}</span>
                        <input type="range" min="1" max="10" value={data.founderChemistry} onChange={e=>setData({...data, founderChemistry: parseInt(e.target.value)})} className="w-full accent-[#022f42]"/>
                      </div>
                      <div className="flex justify-between text-[10px] tracking-widest uppercase font-bold text-[#1e4a62] mb-2"><span>1 (Tense, Part-Time)</span><span>10 (Telepathic, 100% Locked)</span></div>
                      <AIAssistedInsight content={aiFlags.step2b} />
                   </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center border-t border-gray-100 pt-10">
                   <div className="text-xs uppercase tracking-widest font-black text-gray-400 mb-2">Algorithmic Team Strength Index</div>
                   <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                      <path className={`${teamScore >= 80 ? 'text-emerald-500' : teamScore >= 60 ? 'text-blue-500' : teamScore >= 40 ? 'text-orange-400' : 'text-rose-500'} transition-all duration-1000`} strokeDasharray={`${Math.max(1, teamScore)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-6xl font-black text-[#022f42] tracking-tighter">{teamScore}</span>
                    </div>
                  </div>
                  <div className={`mt-4 font-black uppercase tracking-widest text-lg ${teamScore >= 80 ? 'text-emerald-600' : teamScore >= 60 ? 'text-blue-600' : teamScore >= 40 ? 'text-orange-600' : 'text-rose-600'}`}>
                    {getScoreLabel()}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Gap Analysis */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Automated Gap Analysis</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Our AI systems have scanned your current roster architecture and explicitly isolated missing existential components.</p>

                {data.identifiedGaps.length === 0 ? (
                   <div className="p-10 text-center border-2 border-emerald-200 bg-emerald-50 rounded-sm">
                     <Check className="w-16 h-16 text-emerald-500 mx-auto mb-4"/>
                     <h3 className="text-xl font-black text-emerald-900 mb-2">Zero Structural Gaps Detected</h3>
                     <p className="text-sm text-emerald-800 font-medium">Your team mathematically satisfies all primary venture evaluation heuristics across Technical, Revenue, Operations, and Advisory networks.</p>
                   </div>
                ) : (
                  <div className="space-y-6 mb-8">
                    {data. identifiedGaps.map(g => (
                      <div key={g.id} className={`p-6 border-2 rounded-sm transition-all ${g.status === 'open' ? 'border-rose-300 bg-rose-50' : g.status === 'dismissed' ? 'border-gray-200 bg-gray-50' : 'border-[#022f42]/30 bg-[#f2f6fa]'}`}>
                         <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                            <div className="flex-1">
                               <h4 className={`font-black text-lg mb-2 flex items-center gap-2 ${g.status === 'open' ? 'text-rose-900' : 'text-[#022f42]'}`}>
                                 {g.status === 'open' ? <ShieldAlert className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}
                                 Missing: {g.role}
                               </h4>
                               <p className="text-sm font-bold opacity-80 mb-1">{g.reason}</p>
                               <p className="text-xs font-mono opacity-60 mb-4">Suggestion: {g.suggestion}</p>
                               
                               <div className="flex items-center gap-3 mt-4">
                                  <label className="text-xs font-bold uppercase tracking-widest opacity-60">Status Resolution:</label>
                                  <select value={g.status} onChange={e=>updateGap(g.id, 'status', e.target.value)} className={`text-xs font-bold p-2 border rounded-sm outline-none ${g.status === 'open' ? 'bg-rose-100 border-rose-200 text-rose-900' : 'bg-white border-gray-300 text-gray-900'}`}>
                                    <option value="open">Critical Gap Identified (Unresolved)</option>
                                    <option value="in_progress">Mark as In-Progress (Interviewing)</option>
                                    <option value="advisor">Addressed Externally via Advisor</option>
                                    <option value="dismissed">Dismissed via Executive Decision</option>
                                  </select>
                               </div>
                            </div>
                            
                            {(g.status === 'in_progress' || g.status === 'advisor' || g.status === 'dismissed') && (
                              <div className="flex-1 w-full mt-4 md:mt-0">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-2">Venture Mitigation Plan (Required)</label>
                                <textarea value={g.plan} onChange={e=>updateGap(g.id, 'plan', e.target.value)} rows={3} placeholder={g.status === 'dismissed' ? "Explain exactly how core product code executes without a dedicated CTO..." : "Outline exact timelines or firm fractional proxy assignments..."} className="w-full text-sm p-3 border border-gray-300 rounded-sm outline-none focus:border-[#022f42] bg-white/50"></textarea>
                              </div>
                            )}
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                <AIAssistedInsight content={aiFlags.step3} />
              </motion.div>
            )}

            {/* STEP 4: Advisors & Network */}
            {step === 4 && (
             <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                 <div className="flex justify-between items-start mb-6">
                   <div>
                    <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">Advisor & Network Strength</h2>
                    <p className="text-[#1e4a62] text-sm flex items-center gap-2">Solidify your external defensive moats. <span title="Advisors signal that senior legacy operators believe in you natively."><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></p>
                   </div>
                   <button onClick={addAdvisor} className="px-4 py-2 bg-[#f2f6fa] hover:bg-[#e4eff7] text-[#022f42] font-bold text-sm tracking-widest uppercase rounded-sm flex items-center gap-2 transition-colors border border-gray-200">
                     <Plus className="w-4 h-4"/> Add Advisor
                   </button>
                </div>

                <div className="p-6 bg-[#f2f6fa] border border-[#1e4a62]/10 rounded-sm mb-10">
                   <label className="text-sm font-black text-[#022f42] mb-4 flex justify-between items-center uppercase tracking-widest">Macro Network Accessibility <span title="Can you independently route access to Tier 1 nodes?"><Info className="w-4 h-4 text-gray-400 cursor-help" /></span></label>
                   <div className="flex items-center gap-4 mb-2">
                     <span className="text-3xl font-black text-[#022f42] w-12 text-center">{data.networkStrength}</span>
                     <input type="range" min="1" max="10" value={data.networkStrength} onChange={e=>setData({...data, networkStrength: parseInt(e.target.value)})} className="w-full accent-[#022f42]"/>
                   </div>
                   <div className="flex justify-between text-[10px] tracking-widest uppercase font-bold text-[#1e4a62] mb-2"><span>1 (Zero Cold Access)</span><span>10 (Direct Cell access to Tier-A VCs)</span></div>
                   <AIAssistedInsight content={aiFlags.step4} />
                </div>

                <div className="space-y-4">
                  {data.advisors.length === 0 && <p className="text-center text-sm font-bold text-gray-400 p-8 border-2 border-dashed border-gray-200">Zero structural advisors mapped.<br/>We strongly recommend embedding at least one heavy-hitting external validation proxy.</p>}
                  {data.advisors.map(a => (
                    <div key={a.id} className="border border-gray-200 rounded-sm p-6 bg-white relative group flex flex-col md:flex-row gap-4">
                      <button onClick={() => removeAdvisor(a.id)} className="absolute top-4 right-4 text-gray-400 hover:text-rose-500 transition-colors"><X className="w-5 h-5"/></button>
                      <div className="flex-1 space-y-3 pr-8">
                         <div className="grid grid-cols-2 gap-3">
                           <div>
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Name</label>
                             <input type="text" value={a.name} onChange={e=>updateAdvisor(a.id, 'name', e.target.value)} placeholder="James Park" className="w-full p-2 border border-gray-300 rounded-sm outline-none focus:border-[#022f42] text-sm font-bold text-[#022f42]" />
                           </div>
                           <div>
                             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Board / Role</label>
                             <input type="text" value={a.role} onChange={e=>updateAdvisor(a.id, 'role', e.target.value)} placeholder="Strategic Go-to-Market" className="w-full p-2 border border-gray-300 rounded-sm outline-none focus:border-[#022f42] text-sm" />
                           </div>
                         </div>
                         <div>
                           <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Prior Pedigree (Why this person?)</label>
                           <textarea value={a.expertise} onChange={e=>updateAdvisor(a.id, 'expertise', e.target.value)} rows={2} placeholder="Former VP Sales at Salesforce. Scaled $10M -> $100M segment..." className="w-full p-2 border border-gray-300 rounded-sm outline-none focus:border-[#022f42] text-sm"></textarea>
                         </div>
                      </div>
                      <div className="w-full md:w-48 bg-gray-50 p-4 border border-gray-200 rounded-sm flex flex-col justify-center">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Vested Compensation</label>
                         <input type="text" value={a.compensation} onChange={e=>updateAdvisor(a.id, 'compensation', e.target.value)} placeholder="0.5% Equity / NSO" className="w-full p-2 border border-gray-300 rounded-sm outline-none focus:border-[#022f42] text-sm font-mono font-bold" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Narrative Summary */}
            {step === 5 && (
              <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center justify-center gap-2">Investor-Ready Team Narrative</h2>
                <p className="text-[#1e4a62] mb-8 text-sm text-center">Your entire organizational layout packaged mathematically into pitch-deck dialect.</p>

                <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-6 md:p-8 rounded-sm mb-8 relative">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-black text-[#1e4a62]/60 uppercase tracking-widest">Editable Capability Summary</label>
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
                     <span>✓ Active synchronization with 1.3 Gap Reports and 4.2 Data Corridors</span>
                     <button className="underline">Copy Base Synthesis</button>
                  </div>
                </div>

                <div className="flex justify-center flex-col md:flex-row gap-4">
                  <Link href="/dashboard/score" className="px-8 py-4 font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 border-2 border-gray-200 text-[#022f42] hover:bg-gray-50">
                    Exit Scorecard
                  </Link>
                  <button onClick={handleSaveAndContinue} className={`px-12 py-4 font-black uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#022f42] hover:bg-[#1b4f68] text-white'}`}>
                    {savedSuccess ? <><Check className="w-5 h-5"/> Securely Transmitted</> : <><Save className="w-5 h-5"/> Commit Roster Math</>}
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
              <button onClick={handleNextStep} disabled={(step === 1 && data.team.length === 0)} className={`px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm transition-colors flex items-center gap-2 shadow-md ${((step === 1 && data.team.length === 0)) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#022f42] text-white hover:bg-[#1b4f68]'}`}>
                Next Vector <ArrowRight className="w-4 h-4"/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
