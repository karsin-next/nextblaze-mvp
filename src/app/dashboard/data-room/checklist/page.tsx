"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, ListChecks, Sparkles, ExternalLink, FileText, AlertTriangle
} from "lucide-react";
import Link from "next/link";

interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  ready: boolean;
}

export default function DataRoomChecklistPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', category: 'legal', label: 'Articles of Incorporation', ready: false },
    { id: '2', category: 'legal', label: 'Bylaws & Corporate Charter', ready: false },
    { id: '3', category: 'financial', label: 'Cap Table (Detailed)', ready: false },
    { id: '4', category: 'financial', label: '3-Year Financial Model', ready: false },
    { id: '5', category: 'product', label: 'Product Roadmap (12mo)', ready: false },
    { id: '6', category: 'ip', label: 'IP Assignment Agreements', ready: false },
    { id: '7', category: 'team', label: 'Founder Employment Agreements', ready: false },
  ]);

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_5_2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setItems(parsed.data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("audit_2_5_2", JSON.stringify({ data: items, step }));
  }, [items, step, isLoaded]);

  // Calculations
  const readyCount = items.filter(i => i.ready).length;
  const progressPercent = Math.round((readyCount / items.length) * 100);

  // AI Feedback Updates
  useEffect(() => {
    const criticalMissing = items.filter(i => !i.ready && (i.id === '3' || i.id === '6' || i.id === '4'));
    if (criticalMissing.length > 0) setAiFlags(p => ({...p, step1: `Priority Gaps: You are missing ${criticalMissing.length} critical institutional documents (Cap Table, IP, or Model). Investigate these first.`}));
    else setAiFlags(p => ({...p, step1: ""}));
  }, [items]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const toggleItem = (id: string) => {
    setItems(p => p.map(i => i.id === id ? { ...i, ready: !i.ready } : i));
  };

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    localStorage.setItem("audit_2_5_2", "completed");
    setTimeout(() => window.location.href = "/dashboard/data-room/simulator", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.5.2 ACTIVATE: Data Room"
        title="Document Checklist"
        description="Verify exactly which documents are prepped and identify 'Deal-Killer' gaps before sharing your link."
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
            
            {/* STEP 1: Checklist Selection */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">Document Inventory</h2>
                <div className="space-y-4">
                  {items.map(item => (
                    <button 
                      key={item.id}
                      onClick={()=>toggleItem(item.id)}
                      className={`w-full p-4 border-2 rounded-sm text-left transition-all flex items-center justify-between ${item.ready ? 'border-[#022f42] bg-[#f2f6fa]' : 'border-gray-50 hover:border-gray-100'}`}
                    >
                      <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-sm ${item.ready ? 'bg-[#022f42] text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <FileText className="w-4 h-4" />
                         </div>
                         <div>
                            <div className="text-[10px] font-black uppercase text-gray-400">{item.category}</div>
                            <div className={`font-bold ${item.ready ? 'text-[#022f42]' : 'text-gray-400'}`}>{item.label}</div>
                         </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${item.ready ? 'bg-[#ffd800] border-[#ffd800]' : 'border-gray-200'}`}>
                         {item.ready && <Check className="w-4 h-4 text-[#022f42]" />}
                      </div>
                    </button>
                  ))}
                </div>
                {aiFlags.step1 && <div className="mt-8"><AIAssistedInsight content={aiFlags.step1} /></div>}
              </motion.div>
            )}

            {/* STEP 2: Readiness Scoring */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Readiness Index</h2>
                <div className="flex flex-col items-center justify-center">
                   <div className="relative w-56 h-56 flex items-center justify-center mb-8">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                        <path className={`${progressPercent >= 70 ? 'text-emerald-500' : 'text-[#ffd800]'} transition-all duration-1000`} strokeDasharray={`${progressPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                     </svg>
                     <div className="absolute flex flex-col items-center">
                        <span className="text-7xl font-black text-[#022f42]">{progressPercent}%</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">COMPLETE</span>
                     </div>
                   </div>
                   <p className="text-sm font-medium text-gray-500 max-w-xs leading-relaxed">
                      You have prepped <span className="text-[#022f42] font-black">{readyCount} of {items.length}</span> required institutional nodes.
                   </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Summary Match */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Data Room Readiness Certified</h2>
                
                <div className="bg-[#022f42] text-white p-10 rounded-sm relative overflow-hidden mb-8">
                   <div className="relative z-10">
                      <ListChecks className="w-12 h-12 text-[#ffd800] mx-auto mb-6" />
                      <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] mb-4">Inventory Verification</h4>
                      <p className="text-lg font-medium leading-relaxed">
                        Your data room is <span className="text-[#ffd800] font-black">{progressPercent}%</span> institutional-grade. 
                        Launching with gaps in <span className="text-[#ffd800] font-black">Financials</span> or <span className="text-[#ffd800] font-black">IP</span> can stall a deal by 30-60 days.
                      </p>
                   </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'State Recorded' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Inventory Locked' : 'Finalize Checklist'}
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
                  {step === 1 ? (aiFlags.step1 || "Institutional VCs check for 'Clean Continuity'. Missing IP assignments or back-dated contracts can create legal friction that kills momentum.") : 
                   step === 2 ? "A readiness score of 80%+ is recommended before entering 'Blitz' mode. Lower scores should stick to 'Deliberate' targeted outreach." :
                   "The checklist is a living document. As your venture scales, your data room must evolve from a 'Folder' into a 'Governance Hub'."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/the-perfect-investor-data-room" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Data Room Checklist →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Fundraising Prep</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Health Check</h4>
            <div className={`text-2xl font-black ${progressPercent >= 70 ? 'text-emerald-500' : 'text-[#ffd800]'}`}>{progressPercent}% Readiness</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Verification Index</p>
          </div>
        </div>
      </div>
    </div>
  );
}
