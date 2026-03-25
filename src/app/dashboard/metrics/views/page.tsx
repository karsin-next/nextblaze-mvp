"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, Eye, Sparkles, ExternalLink, Share2, Layout, Lock,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function CustomViewsPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [config, setConfig] = useState({
    showRunway: true,
    showGrowth: true,
    showBurn: true,
    showUnitEconomics: false,
    viewName: "Seed Round Dashboard"
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_2_4");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setConfig(parsed.data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("audit_2_2_4", JSON.stringify({ data: config, step }));
  }, [config, step, isLoaded]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/unit-economics", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.2.4 INVESTOR: Views"
        title="Custom Reporting Canvas"
        description="Configure specific visibility toggles for your metrics to create tailored views for board members, lead investors, or internal retrospectives."
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
            
            {/* STEP 1: Configuration */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center text-[#ffd800]">View Configuration</h2>
                <div className="space-y-4">
                   <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Dashboard Alias</label>
                      <input type="text" value={config.viewName} onChange={e=>setConfig({...config, viewName: e.target.value})} className="w-full p-4 border border-gray-100 rounded-sm outline-none font-bold text-xl text-[#022f42] focus:border-[#ffd800]" />
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Runway & Burn Curves', key: 'showRunway' },
                        { label: 'Revenue & Growth Index', key: 'showGrowth' },
                        { label: 'Expense Allocation Pie', key: 'showBurn' },
                        { label: 'Unit Economics (CAC/LTV)', key: 'showUnitEconomics' }
                      ].map(toggle => (
                        <button 
                          key={toggle.key}
                          onClick={()=>setConfig({...config, [toggle.key]: !config[toggle.key as keyof typeof config]})}
                          className={`p-6 border-2 rounded-sm flex items-center justify-between transition-all ${config[toggle.key as keyof typeof config] ? 'border-[#022f42] bg-[#f2f6fa]' : 'border-gray-50 opacity-60'}`}
                        >
                           <span className="font-bold text-sm text-[#022f42]">{toggle.label}</span>
                           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${config[toggle.key as keyof typeof config] ? 'bg-[#ffd800] border-[#ffd800]' : 'border-gray-200'}`}>
                              {config[toggle.key as keyof typeof config] && <Check className="w-3 h-3 text-[#022f42]" />}
                           </div>
                        </button>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Preview Mock */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-[#f2f6fa] p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 bg-[#ffd800] text-[#022f42] font-black text-[10px] uppercase tracking-widest shadow-md">RECIPIENT PREVIEW</div>
                <h3 className="text-xl font-black text-[#022f42] mb-8">{config.viewName}</h3>
                
                <div className="grid grid-cols-2 gap-4 opacity-70">
                   {config.showRunway && <div className="p-10 bg-white border border-gray-200 flex flex-col items-center justify-center"><Activity className="w-8 h-8 text-[#022f42] mb-2" /><div className="text-[10px] font-bold">Runway</div></div>}
                   {config.showGrowth && <div className="p-10 bg-white border border-gray-200 flex flex-col items-center justify-center"><TrendingUp className="w-8 h-8 text-emerald-500 mb-2" /><div className="text-[10px] font-bold">Growth</div></div>}
                   {config.showBurn && <div className="p-10 bg-white border border-gray-200 flex flex-col items-center justify-center"><Layout className="w-8 h-8 text-blue-500 mb-2" /><div className="text-[10px] font-bold">Expenses</div></div>}
                   {config.showUnitEconomics && <div className="p-10 bg-white border border-gray-100 flex flex-col items-center justify-center"><Sparkles className="w-8 h-8 text-[#ffd800] mb-2" /><div className="text-[10px] font-bold">Economics</div></div>}
                </div>

                <div className="mt-8 p-6 bg-white/50 border border-dashed border-[#022f42]/20 text-center italic text-xs text-[#1e4a62]">
                   &quot;A secure, read-only link will be generated for outside stakeholders.&quot;
                </div>
              </motion.div>
            )}

            {/* STEP 3: Dispatch */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-[#022f42] p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center text-white">
                <h2 className="text-2xl font-black mb-12 text-[#ffd800]">Reporting Infrastructure Active</h2>
                
                <div className="bg-white/5 border border-white/10 p-10 rounded-sm mb-12 flex flex-col items-center">
                   <Share2 className="w-16 h-16 text-[#ffd800] mb-6" />
                   <h4 className="font-black text-xl mb-2">{config.viewName}</h4>
                   <p className="text-sm font-medium text-blue-50 max-w-sm">
                     Configuration state has been committed to your local governance vault. 
                     Staging links are ready for peer-review before official dispatch.
                   </p>
                </div>

                <div className="flex justify-center mt-6">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'View Persisted' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Infrastructure Locked' : 'Finalize View Setup'}
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
                  {step === 1 ? "Custom views allow you to control the narrative. Board members need granular burn; prospective investors need growth and unit economics." : 
                   step === 2 ? "Consistency in reporting format builds trust. If the layout of your 'Custom View' changes every month, it signals operational instability." :
                   "The most effective founder-investor relationships are built on 'No Surprises'. Providing a live dashboard reduces the friction of monthly reporting."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/investor-reporting-standards" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Custom Views →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Governance Visibility</h4>
            <div className="text-2xl font-black text-[#022f42] flex items-center justify-center gap-2">
               <Eye className="w-5 h-5" /> 
               <span>Public</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Staging Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Zap(props: any) {
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
      <path d="M4 14.71 12 2.7l1.09 1.09L8.38 15.11l4.7 4.19-8.3 1.95L4.7 13.62l-1.09-1.09L5.62 14.03l-1.62-.68Z" />
      <path d="M14.71 4 2.7 12l1.09 1.09 11.32-4.71 4.19 4.7 1.95-8.3-7.63-1.09-1.09 1.09 0.41 1.62-0.68-1.62Z" />
    </svg>
  )
}
