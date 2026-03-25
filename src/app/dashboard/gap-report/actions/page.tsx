"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Info, Activity, 
  CheckCircle2, Plus, Clock, Target, Calendar, Download, Share2, Save, Sparkles, Edit3
} from "lucide-react";
import Link from "next/link";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";

// Define Types
type ActionItem = {
  id: string;
  gapId: string;
  title: string;
  time: string;
  timeMin: number;
  impact: "High" | "Medium" | "Low";
  impactPts: number;
  difficulty: "Easy" | "Medium" | "Advanced";
  resource: string;
  aiInsight: string;
  isCustom?: boolean;
};

type Gap = {
  id: string;
  title: string;
  score: number;
  reason: string;
};

// Mock Library of Pre-defined Actions per Gap ID
const ACTION_LIBRARY: Record<string, ActionItem[]> = {
  "financial": [
    { id: "a1", gapId: "financial", title: "Build a 12-Month Cash Flow Projection", time: "2 hrs", timeMin: 120, impact: "High", impactPts: 8, difficulty: "Medium", resource: "Financial Modeling Template", aiInsight: "Founders who completed this action saw their Fundability Score increase by an average of 8 points." },
    { id: "a2", gapId: "financial", title: "Calculate true Customer Acquisition Cost (CAC)", time: "1 hr", timeMin: 60, impact: "High", impactPts: 5, difficulty: "Advanced", resource: "Unit Economics Analyzer", aiInsight: "Understanding CAC is non-negotiable for Series A investors." },
    { id: "a3", gapId: "financial", title: "Setup automated burn rate alerts", time: "30 min", timeMin: 30, impact: "Medium", impactPts: 2, difficulty: "Easy", resource: "Stripe/Quickbooks Integration", aiInsight: "Automated alerts prevent catastrophic runway surprises." }
  ],
  "acquisition": [
    { id: "b1", gapId: "acquisition", title: "Identify 3 potential channels and rank by cost", time: "30 min", timeMin: 30, impact: "High", impactPts: 5, difficulty: "Easy", resource: "Bulls Eye Framework", aiInsight: "73% of founders who added this action completed it within 7 days." },
    { id: "b2", gapId: "acquisition", title: "Interview 5 customers on discovery origin", time: "1.5 hrs", timeMin: 90, impact: "High", impactPts: 7, difficulty: "Medium", resource: "Customer Discovery Script", aiInsight: "Startups that complete this action are 2x more likely to earn the Verified Badge." },
    { id: "b3", gapId: "acquisition", title: "Set up attribution tracking software", time: "1 hr", timeMin: 60, impact: "Medium", impactPts: 4, difficulty: "Advanced", resource: "Analytics Setup Guide", aiInsight: "Without tracking, marketing spend is effectively gambling." }
  ],
  "team": [
    { id: "c1", gapId: "team", title: "Draft Job Description for missing technical gap", time: "45 min", timeMin: 45, impact: "High", impactPts: 9, difficulty: "Medium", resource: "JD Templates", aiInsight: "Addressing a missing technical co-founder explicitly reduces investor anxiety." },
    { id: "c2", gapId: "team", title: "Formalize Advisor Agreement for industry expert", time: "30 min", timeMin: 30, impact: "Medium", impactPts: 4, difficulty: "Easy", resource: "FAST Agreement", aiInsight: "Advisors provide massive leverage to solo founders." }
  ],
  "pmf": [
    { id: "d1", gapId: "pmf", title: "Strip product back to core 'Painkiller' feature", time: "2+ hrs", timeMin: 180, impact: "High", impactPts: 12, difficulty: "Advanced", resource: "Product Roadmap", aiInsight: "Reducing scope often increases retention metrics." },
    { id: "d2", gapId: "pmf", title: "Install cohort retention analytics", time: "1 hr", timeMin: 60, impact: "High", impactPts: 6, difficulty: "Advanced", resource: "Mixpanel Setup", aiInsight: "You cannot improve what you cannot measure." }
  ],
  "market": [
    { id: "e1", gapId: "market", title: "Recalculate Bottom-Up TAM with granular pricing", time: "1 hr", timeMin: 60, impact: "Medium", impactPts: 5, difficulty: "Medium", resource: "TAM Calculator", aiInsight: "A highly defensible bottom-up TAM beats a massive top-down TAM." },
    { id: "e2", gapId: "market", title: "Draft 'Wedge to Expansion' master narrative", time: "1.5 hrs", timeMin: 90, impact: "High", impactPts: 7, difficulty: "Advanced", resource: "Pitch Narrative", aiInsight: "Show investors how a $50M beachhead becomes a $1B ocean." }
  ],
  "diff": [
    { id: "f1", gapId: "diff", title: "Audit competitor pricing and feature parity", time: "1 hr", timeMin: 60, impact: "Medium", impactPts: 3, difficulty: "Easy", resource: "Competitor Matrix", aiInsight: "Knowing your enemies' exact feature set prevents embarrassing pitch mistakes." },
    { id: "f2", gapId: "diff", title: "Design structural switching costs into product", time: "2+ hrs", timeMin: 180, impact: "High", impactPts: 9, difficulty: "Advanced", resource: "Moat Brainstorm", aiInsight: "Lock-in over UX: Switching costs protect your margins from decay." }
  ]
};

export default function RecommendedActionsPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [selectedActions, setSelectedActions] = useState<ActionItem[]>([]);
  const [aiGenerating, setAiGenerating] = useState<string | null>(null);

  // Load priority gaps identically to 1.3.1
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let d2: any, d3: any, d5: any, d6: any, d7: any, d8: any;
    try { if (localStorage.getItem("audit_1_1_2")) { d2 = JSON.parse(localStorage.getItem("audit_1_1_2") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_3")) { d3 = JSON.parse(localStorage.getItem("audit_1_1_3") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_5")) { d5 = JSON.parse(localStorage.getItem("audit_1_1_5") || "{}"); } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_6")) { d6 = JSON.parse(localStorage.getItem("audit_1_1_6") || "{}"); } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_7")) { d7 = JSON.parse(localStorage.getItem("audit_1_1_7") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_8")) { d8 = JSON.parse(localStorage.getItem("audit_1_1_8") || "{}")?.data; } } catch(e){}

    const sRev = d7 ? Math.round(((d7.differentiation||1)*4 + (d7.criticality||1)*4 + (11-(d7.churnRisk||10))*2) * 2.5) : 30; 
    const sAcq = d2 ? Math.round(((parseInt(d2.clarity||5))*10)) : 35; 
    const sTeam = d8 ? Math.round((d8.industryExpertise + d8.functionalCoverage + d8.executionTrackRecord + d8.founderChemistry) * 2.5) : 40;
    const sPMF = d6?.score || 45;
    const sMarket = d5?.score || 50;
    const sDiff = d3 ? Math.round(((parseInt(d3.swot||5))*10)) : 40;

    const rawGaps = [
      { id: "financial", title: "Weak Financial Governance", score: sRev, pMult: 1.5, reason: "Investors worry: without clear financials, they can't trust your numbers." },
      { id: "acquisition", title: "Unclear Customer Acquisition", score: sAcq, pMult: 1.4, reason: "Investors worry: building a product is useless without a repeatable sales motion." },
      { id: "team", title: "Critical Team Capability Gap", score: sTeam, pMult: 1.3, reason: "Investors worry: Ideas don't execute themselves. Missing roles kills momentum." },
      { id: "pmf", title: "Weak Product-Market Fit Signals", score: sPMF, pMult: 1.2, reason: "Investors worry: A 'nice-to-have' product will churn users constantly." },
      { id: "market", title: "Constrained Addressable Market", score: sMarket, pMult: 1.1, reason: "Investors worry: You can't build a $100M business in a $50M market." },
      { id: "diff", title: "No Competitive Moat", score: sDiff, pMult: 1.0, reason: "Investors worry: Your margins will erode to zero as competitors copy you." }
    ];

    const ranked = rawGaps
      .map(g => ({ ...g, gapSeverity: Math.round((65 - g.score) * g.pMult) }))
      .sort((a,b) => b.gapSeverity - a.gapSeverity)
      .slice(0,3);

    setGaps(ranked);
    setIsLoaded(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('audit_1_3_actions', 'completed');
    }
  }, []);

  // Handlers
  const moveGap = (index: number, direction: 'up' | 'down') => {
    const newGaps = [...gaps];
    if (direction === 'up' && index > 0) {
      [newGaps[index - 1], newGaps[index]] = [newGaps[index], newGaps[index - 1]];
    } else if (direction === 'down' && index < gaps.length - 1) {
      [newGaps[index + 1], newGaps[index]] = [newGaps[index], newGaps[index + 1]];
    }
    setGaps(newGaps);
  };

  const toggleAction = (act: ActionItem) => {
    if (selectedActions.find(a => a.id === act.id)) {
      setSelectedActions(selectedActions.filter(a => a.id !== act.id));
    } else {
      setSelectedActions([...selectedActions, act]);
    }
  };

  const synthesizeCustomAIAction = (gapId: string) => {
    setAiGenerating(gapId);
    setTimeout(() => {
      const customAction: ActionItem = {
        id: `custom_${Date.now()}`,
        gapId: gapId,
        title: "Schedule a monthly board meeting with advisors to review runway explicitly",
        time: "1 hr",
        timeMin: 60,
        impact: "High",
        impactPts: 6,
        difficulty: "Easy",
        resource: "Board Deck Template",
        aiInsight: "You mentioned you have no formal board meetings. This instantly establishes cadence.",
        isCustom: true
      };
      // For demonstration, map custom action specifically based on gap.
      if (gapId === "acquisition") customAction.title = "Run a small LinkedIn outbound campaign to test B2B copy conversion rates";
      if (gapId === "pmf") customAction.title = "A/B test the onboarding flow removing 3 optional steps to decrease TTFV (Time to First Value)";

      // Inject into library instantly (mutable hack to satisfy purely frontend mock)
      if(!ACTION_LIBRARY[gapId]) ACTION_LIBRARY[gapId] = [];
      ACTION_LIBRARY[gapId].push(customAction);
      
      setSelectedActions([...selectedActions, customAction]);
      setAiGenerating(null);
    }, 1500);
  };

  // Computations
  const totalMinutes = selectedActions.reduce((acc, act) => acc + act.timeMin, 0);
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
  const projectedAlpha = selectedActions.reduce((acc, act) => acc + act.impactPts, 0);

  const saveToWorkbenchAndExit = () => {
    // In actual production this commits to backend / global localstorage 'workbench_tasks'
    const payload = selectedActions.map(a => ({
        id: a.id, title: a.title, gapId: a.gapId, timeEstimate: a.timeMin, pImpact: a.impactPts, source: "1.3.3"
    }));
    localStorage.setItem("workbench_pipeline_import", JSON.stringify(payload));
    window.location.href = "/dashboard/workbench"; // Redirect to future module 3.1.x
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 pb-32">
      
      {/* HEADER */}
      <div className="mb-10 text-center">
        <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 mb-2 block">1.3.3 • Recommended Actions</span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#022f42] tracking-tight mb-4 flex items-center justify-center gap-3">
           <Target className="w-10 h-10 text-indigo-500"/> Action Planner
        </h1>
        <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
          Translate your diagnostic weaknesses into an airtight execution pipeline.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-8 rounded-sm flex items-center justify-between">
        <div className="flex gap-2 w-full max-w-md">
          {[1,2,3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-all ${step >= i ? 'bg-[#022f42]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest ml-4">Step {step} of 3</span>
      </div>

      <AnimatePresence mode="wait">

        {/* STEP 1: GAP RANKING */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm relative overflow-hidden">
             
             <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">Gap Review & Impact Ranking</h2>
             <p className="text-[#1e4a62] mb-8 text-sm max-w-2xl">Confirm which overarching weaknesses you want to prioritize attacking right now. Use the arrows to lock in your personal sequence.</p>

             <div className="space-y-4 mb-10 w-full max-w-4xl">
               {gaps.map((gap, index) => (
                 <div key={gap.id} className="flex items-stretch bg-gray-50 border border-gray-200 rounded-sm overflow-hidden hover:border-indigo-300 transition-colors shadow-sm">
                   
                   {/* Rank Controls */}
                   <div className="flex flex-col bg-gray-100 border-r border-gray-200 px-2 py-4 gap-4 items-center justify-center">
                     <button onClick={() => moveGap(index, 'up')} disabled={index===0} className="p-1 hover:bg-gray-200 text-gray-400 hover:text-[#022f42] rounded transition-colors disabled:opacity-20"><ArrowUp className="w-5 h-5"/></button>
                     <span className="font-black text-[#022f42] text-lg">{index + 1}</span>
                     <button onClick={() => moveGap(index, 'down')} disabled={index===gaps.length-1} className="p-1 hover:bg-gray-200 text-gray-400 hover:text-[#022f42] rounded transition-colors disabled:opacity-20"><ArrowDown className="w-5 h-5"/></button>
                   </div>
                   
                   {/* Data */}
                   <div className="p-6 flex-1 flex flex-col justify-center">
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="font-black text-lg text-[#022f42]">{gap.title}</h3>
                       <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-[#022f42] text-white rounded-sm pt-1.5">Score: {gap.score}/100</span>
                     </div>
                     <p className="text-sm font-medium text-gray-500">{gap.reason}</p>
                   </div>
                 </div>
               ))}
             </div>

             <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-sm w-full max-w-4xl relative">
                <span className="absolute -top-3 left-6 text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2">What Founders Like You Fixed First</span>
                <p className="text-sm text-indigo-900 leading-relaxed italic">
                  &quot;Based on 150+ startups at your stage facing <span className="font-black">{gaps[0]?.title}</span>, 68% prioritized structural foundation over optimization metrics. Those who addressed this exact gap layout first saw an average score increase of 12 points within 2 weeks.&quot;
                </p>
             </div>

             <div className="mt-10 flex justify-end max-w-4xl border-t border-gray-100 pt-6">
                <button onClick={() => setStep(2)} className="bg-[#022f42] text-white px-8 py-4 font-black text-sm tracking-widest uppercase flex items-center gap-2 rounded-sm hover:bg-[#1b4f68] transition-colors shadow-md">
                   Confirm Priority <ArrowRight className="w-4 h-4"/>
                </button>
             </div>
          </motion.div>
        )}

        {/* STEP 2: ACTION GENERATION */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col lg:flex-row gap-8">
             
             {/* Left Col: Gap Libraries */}
             <div className="lg:w-2/3 space-y-12">
               <div className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                 <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">Action Generation</h2>
                 <p className="text-[#1e4a62] mb-8 text-sm">Select verified, high-ROI actions to tackle your prioritized weaknesses.</p>

                 <div className="space-y-12">
                   {gaps.map((gap, index) => {
                     const acts = ACTION_LIBRARY[gap.id] || [];
                     return (
                       <div key={gap.id} className="relative">
                         {/* Visual Connection Line */}
                         {index !== gaps.length - 1 && <div className="absolute left-8 top-16 bottom-[-3rem] w-0.5 bg-gray-200 -z-10"></div>}
                         
                         <div className="flex items-center gap-4 mb-6 relative z-10">
                           <div className="w-16 h-16 rounded-full bg-[#022f42] text-white flex items-center justify-center font-black text-2xl shadow-md border-4 border-white shrink-0">{index + 1}</div>
                           <div>
                             <h3 className="font-black text-xl text-[#022f42] leading-tight">{gap.title}</h3>
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 text-rose-500">Bleeding {65 - gap.score} Pts</p>
                           </div>
                         </div>
                         
                         <div className="pl-10 md:pl-20 space-y-4">
                           {acts.map(act => {
                             const isSelected = selectedActions.some(a => a.id === act.id);
                             return (
                               <div key={act.id} className={`p-5 rounded-sm border-2 transition-all group ${isSelected ? 'border-indigo-500 bg-indigo-50/20' : 'border-gray-200 hover:border-indigo-200 bg-white'}`}>
                                 <div className="flex justify-between items-start gap-4">
                                   <div className="flex-1">
                                     <div className="flex flex-wrap items-center gap-2 mb-2">
                                       {act.impact === "High" && <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 tracking-widest">High ROI</span>}
                                       {act.impact === "Medium" && <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 tracking-widest">Medium ROI</span>}
                                       <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> {act.time}</span>
                                       {act.isCustom && <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-800 tracking-widest flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI Custom</span>}
                                     </div>
                                     <h4 className="font-black text-[#022f42] mb-3 text-lg">{act.title}</h4>
                                     
                                     <div className="bg-gray-50 p-3 rounded-sm text-xs font-medium text-gray-600 flex items-start gap-2 border border-gray-100">
                                        <Activity className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>
                                        {act.aiInsight}
                                     </div>
                                   </div>

                                   <div className="flex flex-col gap-2 items-end">
                                      <button onClick={() => toggleAction(act)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors border-2 ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-md hover:bg-rose-500 hover:border-rose-500' : 'bg-white border-gray-200 text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 hover:border-indigo-300'}`}>
                                        {isSelected ? <CheckCircle2 className="w-6 h-6"/> : <Plus className="w-6 h-6"/>}
                                      </button>
                                   </div>
                                 </div>
                               </div>
                             );
                           })}

                           {/* Dynamic AI Generator Hook */}
                           <button 
                             onClick={() => synthesizeCustomAIAction(gap.id)} 
                             disabled={aiGenerating === gap.id}
                             className="w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-sm hover:bg-indigo-50/50 transition-colors disabled:opacity-50 disabled:cursor-wait"
                           >
                             <Sparkles className="w-4 h-4"/> {aiGenerating === gap.id ? "Synthesizing Answers..." : "Generate AI-Powered Custom Actions"}
                           </button>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             </div>

             {/* Right Col: Basket / Sidebar */}
             <div className="lg:w-1/3">
               <div className="bg-[#022f42] rounded-sm shadow-xl sticky top-6 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20 -z-0"></div>
                    <h3 className="text-xl font-black text-white relative z-10 flex items-center gap-2">My Action Plan <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{selectedActions.length}</span></h3>
                  </div>

                  <div className="p-6 flex-1 min-h-[300px]">
                    {selectedActions.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center p-6 border-2 border-dashed border-white/10 rounded-sm">
                        <p className="text-sm font-bold text-white/50">Add actions from the master library to build your execution roadmap.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedActions.map(sa => (
                          <div key={sa.id} className="bg-white/5 border border-white/10 p-3 rounded-sm flex gap-3 text-white items-start">
                             <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"/>
                             <div>
                               <p className="text-xs font-bold leading-snug mb-1">{sa.title}</p>
                               <span className="text-[10px] text-white/40 uppercase font-black tracking-widest flex items-center gap-1"><Clock className="w-3 h-3"/> {sa.time}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-black/20 p-6 backdrop-blur-md">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 block">Cart Dynamics</span>
                     <div className="flex justify-between items-center mb-6">
                       <span className="text-sm font-medium text-white/80">Total Time:</span>
                       <span className="text-lg font-black text-white">{totalHours} hrs</span>
                     </div>
                     <button 
                       onClick={() => selectedActions.length > 0 && setStep(3)} 
                       disabled={selectedActions.length === 0}
                       className="w-full bg-[#ffd800] text-[#022f42] py-4 rounded-sm font-black uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-[#ffe24d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       Finalize Plan <ArrowRight className="w-4 h-4"/>
                     </button>
                  </div>
               </div>
             </div>
          </motion.div>
        )}

        {/* STEP 3: ACTION FINALIZATION */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white shadow-xl border-t-[4px] border-[#022f42] rounded-sm overflow-hidden flex flex-col md:flex-row">
             
             {/* Final Gauge Column */}
             <div className="md:w-5/12 bg-[#f2f6fa] p-10 flex flex-col justify-center border-r border-[#1e4a62]/10 relative">
                <span className="text-[10px] font-black tracking-widest uppercase text-indigo-500 mb-2 block text-center">Projected Valuation Alpha</span>
                <h3 className="text-2xl font-black text-[#022f42] text-center mb-10 leading-tight">Score Impact Projection</h3>
                
                <div className="w-full flex justify-center mb-10 pb-4">
                  <div className="relative w-48 h-48 flex items-center justify-center bg-white rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100">
                    <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="1.5" stroke="currentColor"/>
                      <path className="text-emerald-500 transition-all duration-1000 ease-in-out" strokeDasharray={`${Math.min(100, projectedAlpha*3)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                    </svg>
                    <div className="flex flex-col items-center z-10">
                      <span className="text-6xl font-black text-[#022f42] tracking-tighter">+{projectedAlpha}</span>
                      <span className="text-[10px] font-black tracking-widest uppercase text-emerald-500 mt-1">Fundability Pts</span>
                    </div>
                  </div>
                </div>

                <div className="text-center font-medium text-sm text-gray-500 leading-relaxed border-t border-gray-200 pt-6">
                  <span className="block text-[#022f42] font-bold mb-1">Empirical Math.</span>
                  If you deploy the <span className="text-indigo-600 font-bold">{totalHours} hours</span> required to close these {selectedActions.length} structural gaps, your master score is estimated to surge by {projectedAlpha} points.
                </div>
             </div>

             {/* Export & Commit Column */}
             <div className="md:w-7/12 p-10 flex flex-col justify-between space-y-8">
               
               <div>
                 <h3 className="text-2xl font-black text-[#022f42] mb-3">Commit to the Timeline</h3>
                 <p className="text-sm text-gray-600 font-medium mb-6">Many founders execute a {totalHours} hour backlog within 10-14 days. When do you commit to finishing this sprint?</p>

                 <div className="flex items-center gap-4 bg-gray-50 p-4 border border-gray-200 rounded-sm mb-6 max-w-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50">
                   <Calendar className="w-5 h-5 text-gray-400"/>
                   <input type="date" className="bg-transparent font-bold text-[#022f42] outline-none w-full cursor-pointer" />
                 </div>
               </div>

               <div>
                 <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">Export Utilities</h4>
                 <div className="flex flex-wrap gap-3">
                   <button 
                     onClick={() => window.print()}
                     className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-black uppercase tracking-widest rounded-sm transition-colors"
                   >
                     <Download className="w-4 h-4"/> Extract PDF
                   </button>
                   <button 
                     onClick={() => {
                        const subject = encodeURIComponent(`FundabilityOS: ${gaps[0]?.title || 'Action Plan'} Draft`);
                        const body = encodeURIComponent(`Hi, I've drafted an action plan to close our fundability gaps. Total projected impact: +${projectedAlpha} points.\n\nPriority Gaps:\n${gaps.map((g,i) => `${i+1}. ${g.title}`).join('\n')}`);
                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                     }}
                     className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-black uppercase tracking-widest rounded-sm transition-colors"
                   >
                     <Share2 className="w-4 h-4"/> Forward Draft
                   </button>
                 </div>
               </div>

               <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-sm font-black text-indigo-950 uppercase tracking-widest">Next Step: Synthesize Report</h4>
                  </div>
                  <p className="text-xs text-indigo-900/70 font-medium mb-5 leading-relaxed">
                    Now that you have your execution plan, generate your institutional-grade <strong>Investor-Ready Report</strong> to show your trajectory to target VCs.
                  </p>
                  <Link 
                    href="/dashboard/gap-report/report"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-indigo-700 transition-all shadow-lg"
                  >
                    Go to Investor-Ready Report <ArrowRight className="w-4 h-4"/>
                  </Link>
               </div>

               <div className="pt-8 border-t border-gray-100 flex justify-between items-center gap-4 flex-col lg:flex-row">
                 <button onClick={() => setStep(2)} className="text-sm font-black uppercase tracking-widest text-[#1e4a62] hover:text-[#022f42]">
                   Modify Cart
                 </button>
                 <button onClick={saveToWorkbenchAndExit} className="w-full lg:w-auto px-10 py-5 bg-[#022f42] hover:bg-[#1b4f68] text-white rounded-sm font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2">
                   <Save className="w-5 h-5"/> Deploy To Workbench
                 </button>
               </div>

             </div>

             <style>{`
                @media print {
                  nav, header, aside, footer, .no-print, [data-no-print], button { display: none !important; }
                  body { background: white !important; }
                  .bg-white { box-shadow: none !important; border: 1px solid #eee !important; }
                  main, div { height: auto !important; overflow: visible !important; }
                }
             `}</style>

           </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
