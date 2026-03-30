"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, Target, Sparkles, ExternalLink, MessageCircle, HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function WhyRaisePage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    intent: "scale",
    milestone1: "",
    milestone2: "",
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_4_2");
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
    if (isLoaded) localStorage.setItem("audit_2_4_2", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // AI Feedback Updates
  useEffect(() => {
    if (data.intent === "survival") setAiFlags(p => ({...p, step1: "Fundraising for survival is high-risk. Investors prefer to fund 'growth fuel' rather than 'life support'. Reframe as 'Strategic Pivot for Market Capture'."}));
    else setAiFlags(p => ({...p, step1: ""}));
  }, [data.intent]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    localStorage.setItem("audit_2_4_2", "completed");
    setTimeout(() => window.location.href = "/dashboard/strategy/when", 1000); 
  };

  const defaultSummary = `We are raising primarily to ${data.intent === 'scale' ? 'accelerate existing market traction' : 'secure a strategic foothold'}. Core milestones include: ${data.milestone1 || '[Milestone 1]'} and ${data.milestone2 || '[Milestone 2]'}. This round is timed to capitalize on our recent unit economic stability.`;

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.4.2 STRATEGY: Why?"
        title="The Strategic Intent"
        description="Define the core logic behind your capital request. Why are you raising, and why now?"
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
            
            {/* STEP 1: Intent */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">Core Raising Rationale</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'scale', title: 'Growth & Scaling', desc: 'Pour fuel on proven unit economics.' },
                    { id: 'product', title: 'R&D / Product', desc: 'Build the core technology moat.' },
                    { id: 'survival', title: 'Survival / Runway', desc: 'Bridge to the next milestone.' },
                    { id: 'opportunity', title: 'Market Opportunity', desc: 'Capture a sudden sector void.' }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={()=>setData({...data, intent: opt.id})}
                      className={`p-6 border-2 rounded-sm text-left transition-all ${data.intent === opt.id ? 'border-[#022f42] bg-[#f2f6fa] ring-2 ring-[#ffd800]' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="font-black text-[#022f42] uppercase text-xs mb-1">{opt.title}</div>
                      <div className="text-sm text-gray-500 font-medium">{opt.desc}</div>
                    </button>
                  ))}
                </div>
                {aiFlags.step1 && <div className="mt-8"><AIAssistedInsight content={aiFlags.step1} /></div>}
              </motion.div>
            )}

            {/* STEP 2: Milestones */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8">Value-Inflection Milestones</h2>
                <div className="space-y-6">
                   <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Primary Milestone (e.g., $1M ARR)</label>
                      <input type="text" value={data.milestone1} onChange={e=>setData({...data, milestone1: e.target.value})} className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-bold" placeholder="Reach $1M ARR within 12 months" />
                   </div>
                   <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Secondary Milestone (e.g., 50k Users)</label>
                      <input type="text" value={data.milestone2} onChange={e=>setData({...data, milestone2: e.target.value})} className="w-full p-4 border border-gray-100 rounded-sm outline-none focus:border-[#ffd800] font-bold" placeholder="Launch Enterprise Tier v2" />
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Narrative */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">The Raising Narrative</h2>
                <div className="bg-[#f2f6fa] border-2 border-dashed border-gray-100 p-8 rounded-sm mb-8 italic">
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultSummary}
                    onChange={(e) => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-white p-6 border border-gray-100 outline-none text-[#022f42] font-semibold text-lg min-h-[160px] leading-relaxed resize-none shadow-inner"
                  />
                </div>
                <div className="flex justify-center">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Strategy Locked' : 'Finalize Strategic Why'}
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
                  {step === 1 ? (aiFlags.step1 || "Investors look for 'Value Inflections'—moments where a small dollar input results in a massive increase in enterprise value.") : 
                   step === 2 ? "A milestone should be binary (it happened or it didn't). Vague goals like 'improve marketing' are red flags for professional VCs." :
                   "Your narrative is the hook. It must move from a generic 'we need money' to a specific 'this capital secures X position'."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/fundraising-strategy-canvas" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Strategy Canvas →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Fundraising Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Milestone Progress</h4>
            <div className="text-2xl font-black text-[#022f42]">{data.milestone1 ? '1/2 Defined' : '0/2 Defined'}</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Strategic Foundation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
