"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, Calendar, Clock, Sparkles, ExternalLink, AlertCircle, Compass
} from "lucide-react";
import Link from "next/link";

export default function FundraisingWhenPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    currentRunway: 12,
    expectedCloseMonths: 6,
    bufferMonths: 3,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_4_3");
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
    if (isLoaded) localStorage.setItem("audit_2_4_3", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const startRaisingIn = Math.max(0, data.currentRunway - data.expectedCloseMonths - data.bufferMonths);
  const dropDeadDate = data.currentRunway;

  // AI Feedback Updates
  useEffect(() => {
    if (data.currentRunway < 6) setAiFlags(p => ({...p, step1: "Critical: You have less than 6 months of runway. Standard fundraising cycles are 6-9 months. You are already in the 'Red Zone'—consider alternative bridge funding immediately."}));
    else if (data.currentRunway < 12) setAiFlags(p => ({...p, step1: "High Priority: You have 6-12 months of runway. You should be in 'Full Campaign Mode' now to avoid desperation pricing."}));
    else setAiFlags(p => ({...p, step1: ""}));
  }, [data.currentRunway]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/strategy/who", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.4.3 STRATEGY: When?"
        title="Fundraising Timeline"
        description="Strategically time your market entry based on your current cash proximity and the standard institutional closing velocity."
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
            
            {/* STEP 1: Current Proximity */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Runway Remaining</h2>
                <div className="space-y-12">
                   <div className="max-w-xs mx-auto">
                      <div className="bg-[#f2f6fa] border-4 border-[#022f42] p-10 rounded-sm">
                         <div className="text-6xl font-black text-[#022f42]">{data.currentRunway}</div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Months Left</div>
                      </div>
                      <input type="range" min="0" max="36" value={data.currentRunway} onChange={e=>setData({...data, currentRunway: parseInt(e.target.value)})} className="w-full mt-6 accent-[#022f42]" />
                   </div>
                   {aiFlags.step1 && <AIAssistedInsight content={aiFlags.step1} />}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Market Velocity */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">Expected Closing Cycle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <label className="text-xs font-black uppercase text-gray-400 mb-4 block tracking-widest">Target Close (Months)</label>
                      <div className="text-4xl font-black text-[#022f42] mb-4">{data.expectedCloseMonths} MO</div>
                      <input type="range" min="3" max="18" value={data.expectedCloseMonths} onChange={e=>setData({...data, expectedCloseMonths: parseInt(e.target.value)})} className="w-full accent-[#022f42]" />
                      <p className="text-[10px] text-gray-400 mt-2 italic">*Global average for Seed: 6.2 months.</p>
                   </div>
                   <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <label className="text-xs font-black uppercase text-gray-400 mb-4 block tracking-widest">Safe Buffer (Months)</label>
                      <div className="text-4xl font-black text-[#022f42] mb-4">{data.bufferMonths} MO</div>
                      <input type="range" min="0" max="6" value={data.bufferMonths} onChange={e=>setData({...data, bufferMonths: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Back-calculated Timeline */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">The Execution Roadmap</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                   <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-sm">
                      <h4 className="text-[10px] font-black uppercase text-emerald-600 mb-2">Campaign Start</h4>
                      <div className="text-3xl font-black text-emerald-700">{startRaisingIn === 0 ? 'START NOW' : `In ${startRaisingIn} MO`}</div>
                   </div>
                   <div className="p-6 bg-amber-50 border border-amber-100 rounded-sm">
                      <h4 className="text-[10px] font-black uppercase text-amber-600 mb-2">Target Close</h4>
                      <div className="text-3xl font-black text-amber-700">In {Math.max(0, data.currentRunway - data.bufferMonths)} MO</div>
                   </div>
                   <div className="p-6 bg-rose-50 border border-rose-100 rounded-sm">
                      <h4 className="text-[10px] font-black uppercase text-rose-600 mb-2">Drop-Dead Date</h4>
                      <div className="text-3xl font-black text-rose-700">In {dropDeadDate} MO</div>
                   </div>
                </div>

                <div className="bg-[#022f42] text-white p-10 rounded-sm relative overflow-hidden">
                   <div className="relative z-10 flex flex-col items-center">
                      <Clock className="w-10 h-10 text-[#ffd800] mb-4" />
                      <p className="text-lg font-medium max-w-md mx-auto leading-relaxed">
                        To maintain a "Default Alive" stance, your fundraising process must initiate 
                        <span className="text-[#ffd800] font-black mx-1">{data.expectedCloseMonths + data.bufferMonths} months</span> 
                        prior to your absolute zero-cash date.
                      </p>
                   </div>
                </div>

                <div className="flex justify-center mt-12">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Timeline Committed' : 'Lock Fundraising Timeline'}
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
                  {step === 1 ? (aiFlags.step1 || "Runway is your primary leverage. The more months you have left, the more 'optionality' you possess during term-sheet negotiations.") : 
                   step === 2 ? "A buffer is essential. Market conditions, legal due diligence, and holiday season stalls can easily add 60-90 days to a standard close cycle." :
                   "The back-calculation method forces you to confront the reality of 'Zero Cash Date' before it becomes an emergency."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/fundraising-strategy-canvas" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Timing & Runway →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Fundraising Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Alert Status</h4>
            <div className={`text-2xl font-black ${data.currentRunway < 6 ? 'text-rose-500' : 'text-emerald-500'}`}>{data.currentRunway < 6 ? 'DANGER' : 'HEALTHY'}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{data.currentRunway} Months Margin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
