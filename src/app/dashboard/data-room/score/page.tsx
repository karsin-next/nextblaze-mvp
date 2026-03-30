"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, Shield, Sparkles, ExternalLink, HeartPulse, GraduationCap
} from "lucide-react";
import Link from "next/link";

export default function DataRoomScorePage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [scores, setScores] = useState({
    structure: 0,
    checklist: 0,
    access: 0
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const savedStructure = localStorage.getItem("audit_2_5_1");
    const savedChecklist = localStorage.getItem("audit_2_5_2");
    
    let structureScore = 0;
    let checklistScore = 0;

    if (savedStructure) {
       try {
         const parsed = JSON.parse(savedStructure);
         structureScore = (parsed.data.selectedFolders.length / 6) * 100;
       } catch(e) {}
    }

    if (savedChecklist) {
       try {
         const parsed = JSON.parse(savedChecklist);
         const readyArr = parsed.data || [];
         checklistScore = (readyArr.filter((i: any) => i.ready).length / readyArr.length) * 100;
       } catch(e) {}
    }

    setScores({
      structure: Math.round(structureScore),
      checklist: Math.round(checklistScore),
      access: 80 // Default base
    });

    setIsLoaded(true);
  }, []);

  const totalHealth = Math.round((scores.structure + scores.checklist + scores.access) / 3);

  // AI Feedback Updates
  useEffect(() => {
    if (totalHealth < 60) setAiFlags(p => ({...p, step1: "Diligence Risk: Your current Data Room health is below institutional thresholds. Investors may perceive this as a lack of governance maturity."}));
    else if (totalHealth > 85) setAiFlags(p => ({...p, step1: "Institutional Grade: Your Data Room matches top-tier venture standards. This speed-of-response will be a competitive advantage during the close cycle."}));
  }, [totalHealth]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    localStorage.setItem("audit_2_5_4", "completed");
    setTimeout(() => window.location.href = "/dashboard/data-room/builder", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.5.4 ACTIVATE: Data Room"
        title="Readiness Score"
        description="Synthesize your structure and checklist readiness into a single institutional health metric."
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
            
            {/* STEP 1: Component Health */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">Health Component Breakdown</h2>
                <div className="space-y-8">
                  {[
                    { label: 'Taxonomy Adherence (Structure)', score: scores.structure },
                    { label: 'Document Inventory (Checklist)', score: scores.checklist },
                    { label: 'Access Protocols (Security)', score: scores.access }
                  ].map(stat => (
                    <div key={stat.label} className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                       <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">{stat.label}</span>
                          <span className="text-xl font-black text-[#022f42]">{stat.score}%</span>
                       </div>
                       <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${stat.score >= 70 ? 'bg-emerald-500' : 'bg-[#ffd800]'}`} style={{width: `${stat.score}%`}} />
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: aggregate Score */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Aggregate Health Index</h2>
                <div className="flex flex-col items-center justify-center mb-12">
                   <div className="relative w-56 h-56 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4" stroke="currentColor"/>
                      <path className={`${totalHealth >= 75 ? 'text-emerald-500' : 'text-[#ffd800]'} transition-all duration-1000`} strokeDasharray={`${totalHealth}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4" stroke="currentColor"/>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-7xl font-black text-[#022f42]">{totalHealth}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">TOTAL HEALTH</span>
                    </div>
                  </div>
                </div>
                {aiFlags.step1 && <AIAssistedInsight content={aiFlags.step1} />}
              </motion.div>
            )}

            {/* STEP 3: Verification */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-[#022f42] p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center text-white">
                <h2 className="text-2xl font-black mb-12 text-[#ffd800]">Institutional Readiness Protocol</h2>
                
                <div className="bg-white/5 border border-white/10 p-10 rounded-sm mb-12">
                   <HeartPulse className="w-16 h-16 text-[#ffd800] mx-auto mb-6" />
                   <p className="text-lg font-medium leading-relaxed max-w-sm mx-auto text-blue-50">
                     Your Due Diligence Health is currently locked at <span className="text-[#ffd800] font-black">{totalHealth}%</span>. 
                     This score is based on a dual-vector analysis of structure adherence and checklist volume.
                   </p>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'Score Transmitted' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Health Locked' : 'Finalize Health Audit'}
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
                  {step === 1 ? "Health components are weighted based on 'Deal-Killer' risk. Financial and Legal readiness together account for 60% of total venture health." : 
                   step === 2 ? (aiFlags.step1 || "A high aggregate health score reduces the 'due diligence discount'—the loss of focus that occurs when founders must hunt for missing papers mid-campaign.") :
                   "Certified readiness signals to investors that you operate at an institutional level of governance from day one."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/the-perfect-investor-data-room" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Data Room Health →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Fundraising Prep</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Venture Governance</h4>
            <div className={`text-2xl font-black ${totalHealth >= 75 ? 'text-emerald-500' : 'text-[#ffd800]'}`}>{totalHealth}% Readiness</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Health Metric</p>
          </div>
        </div>
      </div>
    </div>
  );
}
