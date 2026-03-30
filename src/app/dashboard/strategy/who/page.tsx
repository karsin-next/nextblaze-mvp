"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, Users, Target, Sparkles, ExternalLink, Globe, Landmark
} from "lucide-react";
import Link from "next/link";

export default function FundraisingWhoPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    archetype: [] as string[],
    sectorFocus: "agnostic",
    geography: "global",
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_4_5");
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
    if (isLoaded) localStorage.setItem("audit_2_4_5", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // AI Feedback Updates
  useEffect(() => {
    if (data.archetype.includes('cvc') && data.archetype.length === 1) setAiFlags(p => ({...p, step1: "Focusing solely on Corporate VCs (CVCs) can lead to 'signaling risk' if they have a right-to-first-refusal. Balance your list with financial VCs."}));
    else if (data.archetype.length > 3) setAiFlags(p => ({...p, step1: "A broad archetype selection is strong for pipeline volume but requires distinct pitching narratives for each group (e.g., Angels value vision; VCs value unit economics)."}));
    else setAiFlags(p => ({...p, step1: ""}));
  }, [data.archetype]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const toggleArchetype = (id: string) => {
    setData(p => ({
      ...p,
      archetype: p.archetype.includes(id) ? p.archetype.filter(a => a !== id) : [...p.archetype, id]
    }));
  };

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    localStorage.setItem("audit_2_4_5", "completed");
    setTimeout(() => window.location.href = "/dashboard/strategy/roadmap", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.4.5 STRATEGY: Who?"
        title="Investor Archetypes"
        description="Identify and profile the ideal capital partners based on your sector, stage, and strategic growth requirements."
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
            
            {/* STEP 1: Archetypes */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">Investor Category Targeting</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'angel', title: 'High Net Worth / Angels', desc: 'Fast decision makers, value vision & team.' },
                    { id: 'vc', title: 'Venture Capital (Institutional)', desc: 'Focus on 10x+ returns, metrics & governance.' },
                    { id: 'cvc', title: 'Corporate VC', desc: 'Strategic alignment, potential M&A channel.' },
                    { id: 'family', title: 'Family Offices', desc: 'Long-term horizon, value stable growth & legacy.' }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={()=>toggleArchetype(opt.id)}
                      className={`p-6 border-2 rounded-sm text-left transition-all ${data.archetype.includes(opt.id) ? 'border-[#022f42] bg-[#f2f6fa] ring-2 ring-[#ffd800]' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-black text-[#022f42] uppercase text-xs">{opt.title}</div>
                        {data.archetype.includes(opt.id) && <Check className="w-4 h-4 text-[#022f42]" />}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">{opt.desc}</div>
                    </button>
                  ))}
                </div>
                {aiFlags.step1 && <div className="mt-8"><AIAssistedInsight content={aiFlags.step1} /></div>}
              </motion.div>
            )}

            {/* STEP 2: Sector Logic */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Sector Expertise Requirements</h2>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      {['agnostic', 'vertical-specific', 'deep-tech', 'impact-only'].map(f => (
                        <button 
                          key={f}
                          onClick={()=>setData({...data, sectorFocus: f})}
                          className={`flex-1 py-4 px-2 border-2 rounded-sm font-black uppercase text-[10px] tracking-widest transition-all ${data.sectorFocus === f ? 'bg-[#022f42] text-white border-[#022f42]' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                        >
                          {f.replace('-', ' ')}
                        </button>
                      ))}
                   </div>
                   <div className="p-8 bg-gray-50 rounded-sm italic text-[#1e4a62] text-center border-2 border-dashed border-gray-100">
                      &quot;Targeting <span className="text-[#022f42] font-black">{data.sectorFocus}</span> investors implies we need to lead the narrative with {data.sectorFocus === 'agnostic' ? '&apos;raw unit economics and growth velocity&apos;' : '&apos;deep mechanical moats and industry-specific tailwinds&apos;'}.&quot;
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Summary Match */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">The Target Profile Map</h2>
                
                <div className="bg-black text-white p-10 rounded-sm relative overflow-hidden mb-8">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd800] rounded-full blur-[80px] opacity-20" />
                   <div className="relative z-10">
                      <h4 className="text-[10px] font-black uppercase text-[#ffd800] tracking-[0.3em] mb-6">Aggregate Target Match</h4>
                      <div className="flex flex-wrap justify-center gap-4 mb-8">
                         {data.archetype.length > 0 ? data.archetype.map(a => (
                           <div key={a} className="bg-white/10 px-6 py-3 rounded-full border border-white/20 text-xs font-black uppercase tracking-widest">
                              {a}
                           </div>
                         )) : <span className="text-gray-500 italic">No archetypes selected</span>}
                      </div>
                      <div className="text-sm font-medium text-gray-400">
                        Primarily focused on <span className="text-white font-bold">{data.sectorFocus}</span> opportunities at a <span className="text-white font-bold">{data.geography}</span> scale.
                      </div>
                   </div>
                </div>

                <div className="flex justify-center mt-12">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Profile Committed' : 'Lock Investor Archetype'}
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
                  {step === 1 ? (aiFlags.step1 || "Archetype selection determines the 'language' of your pitch. Institutional VCs care about TAM; Angels care about Founder conviction.") : 
                   step === 2 ? "Sector focus is a doubling-down on your expertise. Horizontal investors look for go-to-market playbooks; Vertical investors look for deep knowledge moats." :
                   "The ideal target profile is a triad: Capital Type + Sector Depth + Geographic Reach."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/fundraising-strategy-canvas" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Investor Profile →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Fundraising Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Matching Index</h4>
            <div className="text-2xl font-black text-[#022f42]">{data.archetype.length} Types</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Multi-Archetype Scope</p>
          </div>
        </div>
      </div>
    </div>
  );
}
