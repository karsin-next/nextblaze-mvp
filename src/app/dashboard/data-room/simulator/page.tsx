"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, Eye, Sparkles, ExternalLink, Monitor, Share2, Lock, Zap
} from "lucide-react";
import Link from "next/link";

export default function DataRoomSimulatorPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [simulation, setSimulation] = useState({
    viewMode: "analyst", // analyst | partner
    branding: "default",
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_5_4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setSimulation(parsed.data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("audit_2_5_4", JSON.stringify({ data: simulation, step }));
  }, [simulation, step, isLoaded]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.5.4 DATA ROOM: Simulator"
        title="Investor Experience Simulation"
        description="View your collective data room through the lens of a VC analyst to identify UI friction and logic gaps."
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
            
            {/* STEP 1: simulator Toggle */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">Investor Perspective Selection</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <button 
                    onClick={()=>setSimulation({...simulation, viewMode: 'analyst'})}
                    className={`p-10 border-4 rounded-sm transition-all text-center ${simulation.viewMode === 'analyst' ? 'border-[#022f42] bg-[#f2f6fa]' : 'border-gray-50'}`}
                   >
                      <Eye className="w-10 h-10 mx-auto mb-4 text-[#022f42]" />
                      <div className="font-black uppercase tracking-widest text-xs">Associate / Analyst</div>
                      <p className="text-[10px] text-gray-400 mt-2">Focus: Granularity, Documentation, Verification.</p>
                   </button>
                   <button 
                    onClick={()=>setSimulation({...simulation, viewMode: 'partner'})}
                    className={`p-10 border-4 rounded-sm transition-all text-center ${simulation.viewMode === 'partner' ? 'border-[#022f42] bg-[#f2f6fa]' : 'border-gray-50'}`}
                   >
                      <Zap className="w-10 h-10 mx-auto mb-4 text-[#022f42]" />
                      <div className="font-black uppercase tracking-widest text-xs">General Partner (GP)</div>
                      <p className="text-[10px] text-gray-400 mt-2">Focus: Synthesis, Vision, Unit Economics.</p>
                   </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: The Mock View */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-gray-900 p-8 md:p-10 shadow-2xl border-t-[4px] border-emerald-500 rounded-sm text-white min-h-[400px]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-500 rounded-sm" />
                      <span className="font-black uppercase tracking-[0.2em] text-xs">YourVenture VDR</span>
                   </div>
                   <div className="text-[10px] font-bold text-gray-400">SESSION: INVESTOR_PROBE</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-sm flex flex-col items-center group hover:bg-white/10 cursor-not-allowed transition-all">
                        <Folder className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-[10px] font-black uppercase tracking-tighter text-gray-400">NODE_0{i}</div>
                     </div>
                   ))}
                </div>

                <div className="mt-12 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-sm italic text-xs text-emerald-100 flex items-center gap-4">
                   <Info className="w-5 h-5 shrink-0" />
                   <p>This is a structural simulation. No real files are hosted or accessible in this playground mode.</p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Share Prep */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Campaign Access Protocol</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="p-8 border-2 border-[#022f42] rounded-sm group hover:bg-[#022f42] transition-all cursor-pointer">
                      <Share2 className="w-10 h-10 text-[#022f42] group-hover:text-[#ffd800] mx-auto mb-4" />
                      <h4 className="font-black text-[#022f42] group-hover:text-white uppercase text-xs">Public Pitch Link</h4>
                      <p className="text-[10px] text-gray-400 mt-2">Pitch Deck + High Level One-Pager. 1-Click Access.</p>
                   </div>
                   <div className="p-8 border-2 border-dashed border-gray-200 rounded-sm opacity-60">
                      <Lock className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                      <h4 className="font-black text-gray-400 uppercase text-xs">VDR / Full Access</h4>
                      <p className="text-[10px] text-gray-400 mt-2">Reserved for post-term sheet or deep diligence phases.</p>
                   </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'Simulation Recorded' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Experience Certified' : 'Finalize Simulation'}
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
                  {step === 1 ? "Partner-level access requires synthesized data. Analyst-level access requires deep primary source documentation. Ensure your data room serves both paths." : 
                   step === 2 ? "A 'Self-Service' data room that is easy to navigate signals high operational maturity and reduces the friction of the due diligence process." :
                   "The transition from a public pitch to a private data room is the 'Commitment Filter'. Sharing too early can expose IP; sharing too late can stall momentum."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/the-perfect-investor-data-room" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Access Protocols →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Fundraising Prep</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">UX Fidelity</h4>
            <div className="text-2xl font-black text-[#022f42]">Institutional</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Simulated Protocol</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Folder(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
  )
}
