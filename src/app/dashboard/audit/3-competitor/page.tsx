"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plus, ShieldCheck, HelpCircle, X, Maximize, AlertTriangle, Crosshair, Target, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Competitor {
  id: string;
  name: string;
  x: number; // 0-100 (Features: Niche -> Broad)
  y: number; // 0-100 (Price: Low -> High)
}

interface SwotFactor {
  id: string;
  text: string;
  quadrant: "unassigned" | "S" | "W" | "O" | "T";
}

const DEFAULT_FACTORS: SwotFactor[] = [
  { id: "f1", text: "Proprietary IP / Deep Tech", quadrant: "unassigned" },
  { id: "f2", text: "High Burn Rate / Low Cash", quadrant: "unassigned" },
  { id: "f3", text: "Untapped Emerging Markets", quadrant: "unassigned" },
  { id: "f4", text: "New Stringent Regulations", quadrant: "unassigned" },
  { id: "f5", text: "Exclusive Data Partnerships", quadrant: "unassigned" },
  { id: "f6", text: "Slow Initial Revenue Velocity", quadrant: "unassigned" },
  { id: "f7", text: "Failing Incumbent Giants", quadrant: "unassigned" },
  { id: "f8", text: "Aggressive VC-backed Rivals", quadrant: "unassigned" },
];

export default function CompetitorMappingPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Dual-Module UI State
  const [activeTab, setActiveTab] = useState<"matrix" | "swot">("matrix");

  // Competitor State
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [newCompName, setNewCompName] = useState("");
  const [activeComp, setActiveComp] = useState<Competitor | null>(null);
  
  // SWOT State
  const [factors, setFactors] = useState<SwotFactor[]>(DEFAULT_FACTORS);
  const [activeFactor, setActiveFactor] = useState<string | null>(null);
  const [newFactorText, setNewFactorText] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ quadName: string, text: string, x: number, y: number } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedComps = localStorage.getItem(`audit_3-competitor_data_${user?.id}`);
      const savedSwot = localStorage.getItem(`audit_3-swot_data_${user?.id}`);
      
      if (savedComps) { try { setCompetitors(JSON.parse(savedComps)); } catch(e) {} }
      if (savedSwot) { try { setFactors(JSON.parse(savedSwot)); } catch(e) {} }
    }
  }, [user?.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (competitors.length > 0) localStorage.setItem(`audit_3-competitor_data_${user?.id}`, JSON.stringify(competitors));
      const hasMoved = factors.some(f => f.quadrant !== "unassigned");
      if (hasMoved || factors.length > 8) localStorage.setItem(`audit_3-swot_data_${user?.id}`, JSON.stringify(factors));
    }
  }, [competitors, factors, user?.id]);

  // --- MATRIX LOGIC ---
  const addCompetitor = () => {
    if (!newCompName.trim()) return;
    const newComp: Competitor = { id: Math.random().toString(36).substr(2, 9), name: newCompName, x: 50, y: 50 };
    setCompetitors([...competitors, newComp]);
    setNewCompName("");
    setActiveComp(newComp);
  };

  const removeCompetitor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompetitors(competitors.filter(c => c.id !== id));
    if (activeComp?.id === id) setActiveComp(null);
  };

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeComp) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, 100 - ((e.clientY - rect.top) / rect.height) * 100));
    setCompetitors(competitors.map(c => c.id === activeComp.id ? { ...c, x, y } : c));
    setActiveComp(null);
  };

  const analyzeMarket = () => {
    let q1 = 0, q2 = 0, q3 = 0, q4 = 0;
    competitors.forEach(c => {
      if (c.x < 50 && c.y > 50) q1++;
      else if (c.x >= 50 && c.y > 50) q2++;
      else if (c.x < 50 && c.y <= 50) q3++;
      else q4++;
    });

    const quads = [
      { name: "High-Price / Niche-Feature", x: 25, y: 75, count: q1, text: "Investors want strong evidence of pricing power and deep lock-in to defend against down-market incumbents." },
      { name: "High-Price / Broad-Feature", x: 75, y: 75, count: q2, text: "Enterprise focus requires a heavy sales team. Be prepared to defend your CAC payback against massive incumbents." },
      { name: "Low-Price / Niche-Feature", x: 25, y: 25, count: q3, text: "Extreme capital efficiency required. Prove a highly automated, low-CAC acquisition channel to survive." },
      { name: "Low-Price / Broad-Feature", x: 75, y: 25, count: q4, text: "Volume playbook. Investors will scrutinize viral coefficients and organic growth loops to ensure massive scale." }
    ];

    quads.sort((a, b) => a.count - b.count);
    const target = quads[0];

    setAiInsight({ quadName: target.name, text: target.text, x: target.x, y: target.y });
    setShowAiAnalysis(true);
  };

  // --- SWOT LOGIC ---
  const addCustomFactor = () => {
    if (!newFactorText.trim()) return;
    setFactors([...factors, { id: Math.random().toString(36).substr(2, 9), text: newFactorText, quadrant: "unassigned" }]);
    setNewFactorText("");
  };

  const assignFactor = (quad: "unassigned" | "S" | "W" | "O" | "T") => {
    if (!activeFactor) return;
    setFactors(factors.map(f => f.id === activeFactor ? { ...f, quadrant: quad } : f));
    setActiveFactor(null); // Release grip
  };

  const removeFactor = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFactors(factors.filter(f => f.id !== id));
    if (activeFactor === id) setActiveFactor(null);
  };

  const handleUnassignedClick = (id: string) => {
    // Toggle active grip
    setActiveFactor(activeFactor === id ? null : id);
  };

  const handleQuadClick = (quad: "S" | "W" | "O" | "T") => {
    if (activeFactor) assignFactor(quad);
  };


  const submitModule = async () => {
    setIsSubmitting(true);
    if (typeof window !== 'undefined') localStorage.setItem(`audit_3-competitor_${user?.id}`, 'completed');
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };


  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
         <div>
           <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
             Module 1.1.3 & Phase 3 Vanguard Component
           </div>
           <h1 className="text-3xl font-bold text-[#022f42] tracking-tight">Competitive Positioning & SWOT Array</h1>
         </div>
         <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42]">
           Back to Hub
         </Link>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex space-x-2 mb-8 bg-white border border-[#1e4a62]/10 p-1 w-fit rounded-sm shadow-sm inline-flex">
         <button 
           onClick={() => setActiveTab("matrix")}
           className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-colors rounded-sm ${activeTab === "matrix" ? 'bg-[#022f42] text-white shadow-md' : 'text-[#1e4a62] hover:bg-[#f2f6fa]'}`}
         >
           1. The 2x2 Market Matrix
         </button>
         <button 
           onClick={() => setActiveTab("swot")}
           className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-colors rounded-sm flex items-center ${activeTab === "swot" ? 'bg-[#ff5a5f] text-white shadow-md' : 'text-[#1e4a62] hover:bg-[#f2f6fa]'}`}
         >
           2. Interactive SWOT Analyzer <SparkleIcon className={`w-3.5 h-3.5 ml-2 ${activeTab === "swot" ? 'text-white' : 'text-red-500'}`}/>
         </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- TAB 1: 2x2 MATRIX --- */}
        {activeTab === "matrix" && (
          <motion.div key="matrix" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#022f42] mb-2">Map Your Market</h2>
                <p className="text-[#1e4a62] text-xs">Investors look for white space. Add your top 3-5 competitors and plot them on the 2x2 grid based on Price and Capabilities.</p>
              </div>

              <div className="bg-[#f2f6fa] p-4 border border-[rgba(2,47,66,0.1)] rounded-sm">
                <label className="text-[10px] font-bold text-[#022f42] uppercase tracking-widest mb-2 block">Add Competitor</label>
                <div className="flex shadow-sm">
                  <input 
                    type="text" 
                    value={newCompName}
                    onChange={(e) => setNewCompName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
                    placeholder="Company Name" 
                    className="flex-1 p-2.5 text-xs font-bold border border-[rgba(2,47,66,0.2)] focus:outline-none focus:border-[#022f42]"
                  />
                  <button onClick={addCompetitor} className="bg-[#022f42] text-white p-2.5 hover:bg-[#ffd800] hover:text-[#022f42] transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4 space-y-2">
                  {competitors.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setActiveComp(c)}
                      className={`flex justify-between items-center p-3 text-xs border cursor-pointer transition-colors shadow-sm rounded-sm ${
                        activeComp?.id === c.id 
                          ? "border-[#ffd800] bg-white text-[#022f42] font-black" 
                          : "border-[rgba(2,47,66,0.1)] bg-white text-[#1e4a62] hover:border-[#022f42]"
                      }`}
                    >
                      <span className="truncate pr-2 select-none flex items-center">
                        {activeComp?.id === c.id && <Crosshair className="w-3.5 h-3.5 mr-2 text-[#ffd800]" />}
                        {c.name}
                      </span>
                      <button onClick={(e) => removeCompetitor(c.id, e)} className="text-[rgba(2,47,66,0.4)] hover:text-red-500 transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {competitors.length === 0 && (
                    <div className="text-[10px] text-center text-[#1e4a62] italic py-4 opacity-70">No competitors added yet.</div>
                  )}
                </div>
              </div>
              
              {competitors.length >= 2 && !showAiAnalysis && (
                <button 
                  onClick={analyzeMarket}
                  className="w-full p-4 bg-[#022f42] rounded-sm text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#ffd800] hover:text-[#022f42] transition-colors flex items-center justify-center border-2 border-[#022f42] shadow-xl"
                >
                  Analyze White Space <ShieldCheck className="w-4 h-4 ml-3" />
                </button>
              )}

              {showAiAnalysis && aiInsight && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 border-l-4 border-[#ffd800] bg-white shadow-xl rounded-sm">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-2 flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-2" /> AI Strategy Insight</h4>
                   <p className="text-xs text-[#022f42] leading-relaxed mb-4 font-bold">
                     Our AI analyzed your market mapping and identified the most optimal whitespace in the <strong>{aiInsight.quadName}</strong> quadrant.
                   </p>
                   <p className="text-[10px] text-[#1e4a62] leading-relaxed italic mb-6 font-medium border-l-2 pl-3 border-[#1e4a62]/10 bg-[#f2f6fa] p-2 rounded-r-sm">
                     &quot;{aiInsight.text}&quot;
                   </p>
                   <button 
                     onClick={() => setActiveTab("swot")}
                     className="w-full py-3 bg-[#ffd800] text-[#022f42] text-[10px] font-black uppercase tracking-widest hover:bg-[#022f42] hover:text-[#ffd800] transition-colors flex items-center justify-center rounded-sm"
                   >
                     Proceed to Phase 3 SWOT <ArrowRight className="w-3.5 h-3.5 ml-2" />
                   </button>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white border border-[rgba(2,47,66,0.1)] p-8 relative flex flex-col h-[600px] shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] rounded-sm">
                
                {activeComp && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#022f42] text-white text-xs px-5 py-2.5 rounded-sm shadow-xl z-20 animate-bounce flex items-center font-bold tracking-widest uppercase border border-[#ffd800]">
                    <Crosshair className="w-4 h-4 mr-3 text-[#ffd800]" /> Click matrix to place <span className="text-[#ffd800] ml-1">{activeComp.name}</span>
                  </div>
                )}

                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-[#1e4a62] bg-white px-3 py-1 rounded-sm border border-[#1e4a62]/10 shadow-sm">High Price / Premium</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-[#1e4a62] bg-white px-3 py-1 rounded-sm border border-[#1e4a62]/10 shadow-sm z-10">Low Price / Value</div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[10px] font-black uppercase tracking-widest text-[#1e4a62] bg-white px-3 py-1 rounded-sm border border-[#1e4a62]/10 shadow-sm z-10 translate-x-2">Niche / Specialized</div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] font-black uppercase tracking-widest text-[#1e4a62] bg-white px-3 py-1 rounded-sm border border-[#1e4a62]/10 shadow-sm -translate-x-2">Broad / Enterprise</div>

                <div 
                  className={`flex-1 relative border-2 border-[rgba(2,47,66,0.05)] bg-[#f2f6fa]/30 mt-8 mb-8 mx-12 rounded-sm ${activeComp ? "cursor-crosshair bg-[#f2f6fa]" : ""}`}
                  onClick={handleGridClick}
                >
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-[#1e4a62]/10 -translate-x-1/2"></div>
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#1e4a62]/10 -translate-y-1/2"></div>
                  
                  <AnimatePresence>
                    {competitors.map(c => (
                      <motion.div
                        key={c.id}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className={`absolute w-5 h-5 rounded-full -translate-x-1/2 translate-y-1/2 shadow-lg flex items-center justify-center transition-colors cursor-pointer z-10 ${activeComp?.id === c.id ? "bg-[#ffd800] ring-4 ring-[#022f42]" : "bg-[#022f42] hover:bg-[#ff5a5f]"}`}
                        style={{ left: `${c.x}%`, bottom: `${c.y}%` }}
                        onClick={(e) => { e.stopPropagation(); setActiveComp(c); }}
                      >
                        <div className="absolute left-8 whitespace-nowrap bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#022f42] shadow-md border border-[#1e4a62]/10 pointer-events-none rounded-sm">
                          {c.name}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {showAiAnalysis && aiInsight && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="absolute z-20 w-8 h-8 rounded-full bg-green-500 shadow-[0_0_25px_rgba(34,197,94,0.6)] -translate-x-1/2 translate-y-1/2 flex items-center justify-center"
                        style={{ left: `${aiInsight.x}%`, bottom: `${aiInsight.y}%` }}
                      >
                        <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <div className="absolute right-10 whitespace-nowrap bg-[#022f42] text-[#ffd800] px-3 py-1.5 text-[10px] font-black shadow-xl border border-[#ffd800] rounded-sm pointer-events-none uppercase tracking-widest flex items-center">
                          <Target className="w-3 h-3 mr-1.5" /> Optimal Moat
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB 2: SWOT ANALYZER --- */}
        {activeTab === "swot" && (
          <motion.div key="swot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1 space-y-6 flex flex-col h-full">
              <div>
                <h2 className="text-base font-bold text-[#022f42] mb-2">Assign Market Drivers</h2>
                <p className="text-[#1e4a62] text-xs">Click a core factor pill here, then click any of the 4 SWOT Quadrants on the right to assign it.</p>
              </div>

              <div className="bg-[#f2f6fa] p-4 border border-[rgba(2,47,66,0.1)] rounded-sm flex-1 overflow-y-auto">
                <div className="mb-4">
                  <div className="flex shadow-sm">
                    <input 
                      type="text" 
                      value={newFactorText}
                      onChange={(e) => setNewFactorText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCustomFactor()}
                      placeholder="e.g. Unique Distribution..." 
                      className="flex-1 p-2.5 text-xs font-bold border border-[rgba(2,47,66,0.2)] focus:outline-none focus:border-red-500"
                    />
                    <button onClick={addCustomFactor} className="bg-[#ff5a5f] text-white p-2.5 hover:bg-[#022f42] transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1e4a62] mb-3 mt-4 border-b border-[#1e4a62]/10 pb-1">Unassigned Queue</h3>
                   {factors.filter(f => f.quadrant === "unassigned").map(f => (
                     <motion.div 
                       key={f.id} layoutId={`factor_${f.id}`}
                       onClick={() => handleUnassignedClick(f.id)}
                       className={`p-3 text-xs font-bold rounded-sm border cursor-pointer shadow-sm transition-all flex items-center justify-between group ${activeFactor === f.id ? 'bg-[#ff5a5f] text-white border-[#ff5a5f] scale-[1.02]' : 'bg-white text-[#022f42] hover:border-[#ff5a5f]'}`}
                     >
                        <span className="truncate pr-2">{f.text}</span>
                        {f.id.startsWith("f") ? null : ( // only allow deleting custom ones
                           <button onClick={(e) => removeFactor(f.id, e)} className={`${activeFactor === f.id ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-red-500'} transition-colors`}>
                             <X className="w-3.5 h-3.5" />
                           </button>
                        )}
                     </motion.div>
                   ))}
                   {factors.filter(f => f.quadrant === "unassigned").length === 0 && (
                     <div className="text-[10px] uppercase font-bold text-green-600 bg-green-50 p-3 flex items-center rounded-sm border border-green-200"><CheckCircle2 className="w-4 h-4 mr-2" /> Queue Cleared</div>
                   )}
                </div>
              </div>

              <button 
                onClick={submitModule}
                disabled={isSubmitting}
                className="w-full mt-auto p-4 bg-[#022f42] rounded-sm text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#ffd800] hover:text-[#022f42] transition-colors flex items-center justify-center border-2 border-[#022f42] shadow-xl"
              >
                {isSubmitting ? "Finalizing Matrix Data..." : "Archive & Continue"} <ArrowRight className="w-4 h-4 ml-3" />
              </button>
            </div>

            <div className="lg:col-span-3">
               <div className="h-[600px] bg-white border border-[#1e4a62]/10 p-3 md:p-6 shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] rounded-sm grid grid-cols-2 grid-rows-2 gap-3 relative">
                 {/* Crosshair Overlay when dragging */}
                 {activeFactor && (
                   <div className="absolute inset-0 z-0 bg-[#022f42]/5 backdrop-blur-[1px] pointer-events-none flex items-center justify-center rounded-sm border-2 border-[#ff5a5f]/50 border-dashed">
                      <div className="bg-[#ff5a5f] text-white px-4 py-2 font-black uppercase text-xs tracking-widest shadow-xl rounded-sm animate-pulse">
                         Select Quadrant to Drop Parameter
                      </div>
                   </div>
                 )}

                 {/* S */}
                 <div onClick={() => handleQuadClick("S")} className={`relative flex flex-col p-4 md:p-6 rounded-sm border-2 transition-all ${activeFactor ? 'cursor-alias hover:bg-green-50 border-green-300 z-10' : 'bg-[#f2f6fa]/50 border-[#1e4a62]/10'}`}>
                    <h3 className="text-xl md:text-2xl font-black text-green-700 mb-1">Strengths <span className="text-[#022f42] font-black text-sm absolute top-4 right-4 opacity-10">01</span></h3>
                    <p className="text-[10px] font-bold text-green-600/70 uppercase tracking-widest mb-4">Internal Advantages Moats</p>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                       {factors.filter(f => f.quadrant === "S").map(f => (
                         <div key={f.id} onClick={(e) => { e.stopPropagation(); assignFactor("unassigned"); setActiveFactor(f.id); }} className="bg-white border border-green-200 text-green-900 p-2.5 shadow-sm rounded-sm text-xs font-bold cursor-grab hover:border-green-400 truncate">{f.text}</div>
                       ))}
                    </div>
                 </div>

                 {/* W */}
                 <div onClick={() => handleQuadClick("W")} className={`relative flex flex-col p-4 md:p-6 rounded-sm border-2 transition-all ${activeFactor ? 'cursor-alias hover:bg-red-50 border-red-300 z-10' : 'bg-[#f2f6fa]/50 border-[#1e4a62]/10'}`}>
                    <h3 className="text-xl md:text-2xl font-black text-red-700 mb-1">Weaknesses <span className="text-[#022f42] font-black text-sm absolute top-4 right-4 opacity-10">02</span></h3>
                    <p className="text-[10px] font-bold text-red-600/70 uppercase tracking-widest mb-4">Internal Liabilities Gaps</p>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                       {factors.filter(f => f.quadrant === "W").map(f => (
                         <div key={f.id} onClick={(e) => { e.stopPropagation(); assignFactor("unassigned"); setActiveFactor(f.id); }} className="bg-white border border-red-200 text-red-900 p-2.5 shadow-sm rounded-sm text-xs font-bold cursor-grab hover:border-red-400 truncate">{f.text}</div>
                       ))}
                    </div>
                 </div>

                 {/* O */}
                 <div onClick={() => handleQuadClick("O")} className={`relative flex flex-col p-4 md:p-6 rounded-sm border-2 transition-all ${activeFactor ? 'cursor-alias hover:bg-blue-50 border-blue-300 z-10' : 'bg-[#f2f6fa]/50 border-[#1e4a62]/10'}`}>
                    <h3 className="text-xl md:text-2xl font-black text-blue-700 mb-1">Opportunities <span className="text-[#022f42] font-black text-sm absolute top-4 right-4 opacity-10">03</span></h3>
                    <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest mb-4">External Growth Vectors</p>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                       {factors.filter(f => f.quadrant === "O").map(f => (
                         <div key={f.id} onClick={(e) => { e.stopPropagation(); assignFactor("unassigned"); setActiveFactor(f.id); }} className="bg-white border border-blue-200 text-blue-900 p-2.5 shadow-sm rounded-sm text-xs font-bold cursor-grab hover:border-blue-400 truncate">{f.text}</div>
                       ))}
                    </div>
                 </div>

                 {/* T */}
                 <div onClick={() => handleQuadClick("T")} className={`relative flex flex-col p-4 md:p-6 rounded-sm border-2 transition-all ${activeFactor ? 'cursor-alias hover:bg-orange-50 border-orange-300 z-10' : 'bg-[#f2f6fa]/50 border-[#1e4a62]/10'}`}>
                    <h3 className="text-xl md:text-2xl font-black text-orange-700 mb-1">Threats <span className="text-[#022f42] font-black text-sm absolute top-4 right-4 opacity-10">04</span></h3>
                    <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mb-4">External Risks Friction</p>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                       {factors.filter(f => f.quadrant === "T").map(f => (
                         <div key={f.id} onClick={(e) => { e.stopPropagation(); assignFactor("unassigned"); setActiveFactor(f.id); }} className="bg-white border border-orange-200 text-orange-900 p-2.5 shadow-sm rounded-sm text-xs font-bold cursor-grab hover:border-orange-400 truncate">{f.text}</div>
                       ))}
                    </div>
                 </div>

               </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple icon wrapper
function SparkleIcon(props: any) {
   return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
}
