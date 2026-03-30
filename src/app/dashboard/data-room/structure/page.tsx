"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, Folder, FolderPlus, Sparkles, ExternalLink, ShieldCheck, ListTree
} from "lucide-react";
import Link from "next/link";

export default function DataRoomStructurePage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    selectedFolders: ["legal", "financial", "team", "product", "ip"],
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_5_1");
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
    if (isLoaded) localStorage.setItem("audit_2_5_1", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // AI Feedback Updates
  useEffect(() => {
    if (!data.selectedFolders.includes('ip')) setAiFlags(p => ({...p, step1: "Caution: Missing IP (Intellectual Property) folder. This is a red flag for tech-heavy VCs who prioritize asset ownership verification."}));
    else setAiFlags(p => ({...p, step1: ""}));
  }, [data.selectedFolders]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const toggleFolder = (id: string) => {
    setData(p => ({
      ...p,
      selectedFolders: p.selectedFolders.includes(id) ? p.selectedFolders.filter(f => f !== id) : [...p.selectedFolders, id]
    }));
  };

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    localStorage.setItem("audit_2_5_1", "completed");
    setTimeout(() => window.location.href = "/dashboard/data-room/checklist", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.5.1 ACTIVATE: Data Room"
        title="Structure Template"
        description="Establish a professional folder hierarchy that matches institutional due diligence standards."
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
            
            {/* STEP 1: Taxonomy Selection */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">Data Room Blueprint</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'legal', title: '01. Legal & Corporate', desc: 'Articles, Bylaws, Board Minutes.' },
                    { id: 'financial', title: '02. Financial & Tax', desc: 'P&L, Cap Table, Tax Filings.' },
                    { id: 'product', title: '03. Product & Tech', desc: 'Roadmap, Tech Stack, Security.' },
                    { id: 'ip', title: '04. IP & Assets', desc: 'Patents, Trademarks, Open Source.' },
                    { id: 'team', title: '05. Team & HR', desc: 'Contracts, Org Chart, Hiring.' },
                    { id: 'market', title: '06. Market & GTM', desc: 'Customer List, Case Studies.' }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={()=>toggleFolder(opt.id)}
                      className={`p-6 border-2 rounded-sm text-left transition-all ${data.selectedFolders.includes(opt.id) ? 'border-[#022f42] bg-[#f2f6fa] ring-2 ring-[#ffd800]' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-black text-[#022f42] uppercase text-xs">{opt.title}</div>
                        {data.selectedFolders.includes(opt.id) && <Check className="w-4 h-4 text-[#022f42]" />}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">{opt.desc}</div>
                    </button>
                  ))}
                </div>
                {aiFlags.step1 && <div className="mt-8"><AIAssistedInsight content={aiFlags.step1} /></div>}
              </motion.div>
            )}

            {/* STEP 2: Visual Tree */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-[#022f42] p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-white">
                <h2 className="text-2xl font-black mb-8">Visual Folder Hierarchy</h2>
                <div className="space-y-4 font-mono text-sm">
                   <div className="flex items-center gap-2 text-[#ffd800]">
                      <Folder className="w-5 h-5" /> <span>DATA_ROOM_ROOT</span>
                   </div>
                   {data.selectedFolders.map((f, i) => (
                      <div key={f} className={`flex items-center gap-2 pl-8 border-l border-white/10 ml-2 ${i === data.selectedFolders.length - 1 ? 'border-l-transparent pb-4' : 'pb-4'}`}>
                         <span className="text-white/20">└──</span>
                         <Folder className="w-4 h-4 text-blue-400" />
                         <span className="font-bold uppercase tracking-widest">{f}</span>
                      </div>
                   ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Setup Completion */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-12">Taxonomy Protocol Active</h2>
                
                <div className="bg-gray-50 border border-gray-100 p-10 rounded-sm mb-12">
                   <ShieldCheck className="w-16 h-16 text-[#022f42] mx-auto mb-6" />
                   <p className="text-lg font-medium text-[#1e4a62] leading-relaxed max-w-sm mx-auto">
                      Your data room structure is now locked to <span className="text-[#022f42] font-black">{data.selectedFolders.length} core nodes</span>.
                   </p>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Taxonomy Locked' : 'Finalize Structure'}
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
                  {step === 1 ? (aiFlags.step1 || "Structure defines professionalism. A messy data room signals a messy operation, often causing investors to stall their process.") : 
                   step === 2 ? "A hierarchical 01-09 numbering system ensures the most critical documents (Legal/Financial) are encountered first by the analyst." :
                   "Locking your taxonomy early prevents 'document sprawl' and ensures every file has a designated home before the campaign launches."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/the-perfect-investor-data-room" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Data Room Setup →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Fundraising Prep</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Nodes Prepped</h4>
            <div className="text-2xl font-black text-[#022f42]">{data.selectedFolders.length} Folders</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Taxonomy Scale</p>
          </div>
        </div>
      </div>
    </div>
  );
}
