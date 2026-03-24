"use client";

import { useState, useEffect, useRef } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, FileText, Sparkles, ExternalLink, Download, Eye,
  Layout, ShieldCheck, TrendingUp, BarChart3, AlertTriangle, 
  Target, Calculator, FolderOpen, Image as ImageIcon, X
} from "lucide-react";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from "recharts";

// Simulated Data Pulls (In real app, this pulls from all localStorage keys)
const getCachedData = () => {
  if (typeof window === 'undefined') return {};
  return {
    score: JSON.parse(localStorage.getItem('audit_score_overview') || '{"score": 68}'),
    gaps: JSON.parse(localStorage.getItem('audit_1_3_1') || '[]'),
    financials: JSON.parse(localStorage.getItem('audit_2_1_1') || '{"mrr": 12000, "burn": 25000, "runway": 4}'),
    unitEconomics: JSON.parse(localStorage.getItem('audit_2_3_1') || '{"cac": 450, "ltv": 1800}')
  };
};

export default function InvestorReportPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Configuration State
  const [config, setConfig] = useState({
    sections: {
      execSum: true,
      score: true,
      gaps: true,
      vos: true,
      financials: true,
      checklist: true,
      roadmap: true,
      ecosystem: true,
      appendix: false
    },
    layout: 'standard', // standard | investor
    personalNote: "",
    logoUrl: null as string | null
  });

  // Report Content State (Editable)
  const [reportData, setReportData] = useState({
    executiveSummary: "Based on our comprehensive 360° diagnostic, the startup demonstrates high technical competency (82nd percentile) but secondary governance friction. The path to institutional funding requires immediate solidification of unit economics and financial reporting hygiene.",
    aiInsight: "Compared to 247 other SaaS startups at seed stage, your Fundability Score of 68% places you in the top 35%. Your team strength is exceptional (92nd percentile), but your financial governance (41st percentile) is where investors will focus."
  });

  useEffect(() => {
    setIsLoaded(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('audit_1_3_report', 'completed');
    }
  }, []);

  const toggleSection = (key: keyof typeof config.sections) => {
    setConfig({ ...config, sections: { ...config.sections, [key]: !config.sections[key] } });
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 2000);
  };

  if (!isLoaded) return null;

  // Mock Radar Data for Section 2
  const radarData = [
    { subject: 'Problem', A: 85, fullMark: 100 },
    { subject: 'Product', A: 78, fullMark: 100 },
    { subject: 'Market', A: 92, fullMark: 100 },
    { subject: 'Traction', A: 55, fullMark: 100 },
    { subject: 'Revenue', A: 48, fullMark: 100 },
    { subject: 'Team', A: 95, fullMark: 100 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.3.4 INVESTOR: Report"
        title="Investor-Ready Report Builder"
        description="Synthesize your diagnostic data into a professional fundraising narrative. One-click generation for PDF export or secure link sharing."
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
            
            {/* STEP 1: Configuration Dashboard */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                  <h2 className="text-2xl font-black text-[#022f42] mb-8 text-[#ffd800]">Report Configuration</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Logo & Note */}
                    <div className="space-y-6">
                       <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                          <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Branding (Optional)</label>
                          <div className="flex items-center gap-4">
                             <div className="w-16 h-16 bg-white border-2 border-dashed border-gray-200 rounded-sm flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-6 h-6" />
                             </div>
                             <button className="text-[10px] font-bold text-[#022f42] border border-[#022f42] px-3 py-2 rounded-sm hover:bg-[#022f42] hover:text-white transition-colors">UPLOAD LOGO</button>
                          </div>
                       </div>
                       
                       <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                          <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Personal Note to Investor</label>
                          <textarea 
                            value={config.personalNote}
                            onChange={(e) => setConfig({...config, personalNote: e.target.value})}
                            maxLength={150}
                            placeholder="Add a personalized touch (150 char max)..."
                            className="w-full bg-white p-4 border border-gray-200 rounded-sm outline-none text-sm font-medium focus:border-[#ffd800] min-h-[100px]"
                          />
                       </div>
                    </div>

                    {/* Section Toggles */}
                    <div className="bg-[#f2f6fa] p-8 rounded-sm">
                       <h3 className="text-sm font-bold text-[#022f42] uppercase tracking-widest mb-4">Included Sections</h3>
                       <div className="space-y-2">
                          {[
                            { id: 'execSum', label: 'Executive Summary', icon: Sparkles },
                            { id: 'score', label: 'Fundability Dashboard', icon: Target },
                            { id: 'gaps', label: 'Gap Analysis & Actions', icon: AlertTriangle },
                            { id: 'vos', label: 'VOS Indicator™ Profile', icon: BarChart3 },
                            { id: 'financials', label: 'Financial Health Snapshot', icon: Calculator },
                            { id: 'checklist', label: 'Readiness Checklist', icon: ShieldCheck },
                            { id: 'roadmap', label: 'Fundraising Roadmap', icon: TrendingUp },
                            { id: 'ecosystem', label: 'Ecosystem & Badge Status', icon: Layout },
                            { id: 'appendix', label: 'Appendix: Raw Data', icon: Info }
                          ].map((sec) => (
                            <button 
                              key={sec.id}
                              onClick={() => toggleSection(sec.id as any)}
                              className={`w-full flex items-center justify-between p-3 rounded-sm text-xs font-bold transition-all ${config.sections[sec.id as keyof typeof config.sections] ? 'bg-[#022f42] text-white shadow-md' : 'bg-white/50 text-[#1e4a62] grayscale'}`}
                            >
                               <div className="flex items-center gap-2">
                                  <sec.icon className={`w-3.5 h-3.5 ${config.sections[sec.id as keyof typeof config.sections] ? 'text-[#ffd800]' : 'text-gray-400'}`} />
                                  <span>{sec.label}</span>
                               </div>
                               {config.sections[sec.id as keyof typeof config.sections] ? <Check className="w-3 h-3 text-[#ffd800]" /> : <div className="w-3 h-3 border border-gray-300 rounded-full" />}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-center">
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="group bg-[#022f42] text-white px-12 py-5 font-black uppercase tracking-[0.2em] rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-2xl relative overflow-hidden"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#ffd800] border-t-transparent rounded-full animate-spin" />
                          <span>Compiling Intelligence...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-[#ffd800]" />
                          <span>Generate Full Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: The Interactive Preview (Simulated as content builder) */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div className="bg-white p-8 md:p-12 shadow-2xl rounded-sm border-t-8 border-[#022f42]">
                   <div className="flex justify-between items-center mb-12 border-b border-gray-100 pb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#022f42] text-white flex items-center justify-center font-black">NB</div>
                        <div>
                          <h1 className="text-xl font-black text-[#022f42] uppercase tracking-[0.1em]">Fundability Audit Report</h1>
                          <p className="text-[10px] font-bold text-gray-400">ID: RPT-2026-X491 | CONFIDENTIAL</p>
                        </div>
                      </div>
                      <ShieldCheck className="w-8 h-8 text-[#ffd800]" />
                   </div>

                   {/* SECTION 1: EXEC SUMMARY */}
                   {config.sections.execSum && (
                     <section className="mb-16">
                        <div className="flex items-center gap-2 mb-6 text-[#022f42]">
                           <Sparkles className="w-5 h-5 text-[#ffd800]" />
                           <h2 className="text-lg font-black uppercase tracking-widest">Executive Summary</h2>
                        </div>
                        <div className="relative group">
                           <textarea 
                             className="w-full text-sm leading-relaxed text-[#1e4a62] bg-gray-50 p-6 rounded-sm border border-transparent focus:border-[#ffd800] outline-none min-h-[120px] font-medium"
                             value={reportData.executiveSummary}
                             onChange={(e) => setReportData({...reportData, executiveSummary: e.target.value})}
                           />
                           <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[8px] font-bold bg-[#ffd800] text-[#022f42] px-2 py-1 rounded-sm uppercase tracking-tighter">Edit AI Text</span>
                           </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-[#022f42]/5 border-l-2 border-[#ffd800] rounded-sm flex gap-3">
                           <BotIcon className="w-5 h-5 text-[#022f42] shrink-0" />
                           <p className="text-[11px] italic font-medium text-[#1e4a62]">{reportData.aiInsight}</p>
                        </div>
                     </section>
                   )}

                   {/* SECTION 2: SCORE */}
                   {config.sections.score && (
                     <section className="mb-16">
                        <h2 className="text-lg font-black uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Fundability Score Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                           <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#022f42', fontSize: 10, fontWeight: 'bold' }} />
                                    <Radar name="User Score" dataKey="A" stroke="#022f42" fill="#022f42" fillOpacity={0.6} />
                                 </RadarChart>
                              </ResponsiveContainer>
                           </div>
                           <div className="bg-[#022f42] p-10 text-center rounded-sm shadow-xl">
                              <div className="text-[10px] font-black text-[#ffd800] uppercase tracking-widest mb-2">Overall Score</div>
                              <div className="text-7xl font-black text-white tracking-tighter">68<span className="text-2xl text-[#ffd800]">%</span></div>
                              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-emerald-400">
                                 <TrendingUp className="w-3.5 h-3.5" />
                                 <span>+22% from Baseline</span>
                              </div>
                           </div>
                        </div>
                     </section>
                   )}

                   <div className="p-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm text-center">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Preview restricted to primary metrics</p>
                      <button onClick={() => setStep(3)} className="bg-[#022f42] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#1b4f68]">View Full Composite Layout</button>
                   </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: FINAL DISPATCH */}
            {step === 3 && (
              <motion.div key="s3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
                <div className="bg-white p-12 shadow-2xl rounded-sm text-center">
                   <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
                      <Check className="w-12 h-12 text-white" />
                   </div>
                   <h2 className="text-3xl font-black text-[#022f42] mb-4">Report Infrastructure Locked</h2>
                   <p className="text-sm font-medium text-[#1e4a62] max-w-lg mx-auto leading-relaxed mb-12">
                      The high-fidelity PDF is being synchronized to your **Data Room (Module 2.5)** and is ready for institutional export.
                   </p>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <button className="flex items-center justify-center gap-3 p-6 bg-[#022f42] text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-[#1b4f68] transition-all shadow-xl">
                         <Download className="w-4 h-4 text-[#ffd800]" />
                         Download PDF (Standard)
                      </button>
                      <button className="flex items-center justify-center gap-3 p-6 bg-white border-2 border-[#022f42] text-[#022f42] font-black uppercase tracking-widest text-xs rounded-sm hover:bg-gray-50 transition-all">
                         <Eye className="w-4 h-4" />
                         Download PDF (Investor Mode)
                      </button>
                   </div>

                   <div className="mt-8">
                      <button className="text-[10px] font-black uppercase tracking-widest text-[#1e4a62] hover:text-[#022f42] border-b border-[#022f42]/20">Save Draft & Update Data Room</button>
                   </div>
                </div>

                <div className="bg-[#fef9c3] p-10 border-l-[6px] border-[#eab308] rounded-sm">
                   <div className="flex items-start gap-4">
                      <Sparkles className="w-6 h-6 text-[#eab308] shrink-0" />
                      <div>
                         <h4 className="font-black text-[#854d0e] uppercase tracking-widest text-sm mb-2">Verified Badge Eligibility</h4>
                         <p className="text-xs font-medium text-[#854d0e]/80 leading-relaxed">
                            Your report signals high readiness! To unlock the **FundabilityOS Verified Badge** on the cover page, ensure your Data Room checklist (2.5.2) is 100% complete.
                         </p>
                      </div>
                   </div>
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
                onClick={() => setStep(s => s + 1)}
                className="bg-[#022f42] text-white px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#1b4f68] transition-colors flex items-center gap-2 shadow-md"
              >
                {step === 1 ? 'Go to Preview' : 'Finalize Export'} <ArrowRight className="w-4 h-4"/>
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
                <p className="text-sm leading-relaxed text-blue-50 font-medium italic">
                  {step === 1 ? "Investors focus on the first 3 pages. A clean, concise Executive Summary is more valuable than 50 pages of raw data." : 
                   step === 2 ? "The AI benchmarks your data against 1,200+ startups. This 'consultant-level' context makes your case credible to skeptical VCs." :
                   "A Verified Report ID allows VCs to cross-reference your claims against our methodology. Trust is the primary currency of fundraising."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/investor-reporting-standards" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Reporting Standard →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Mastery</p>
              </div>
            </div>
          </div>

          {config.logoUrl && (
            <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Active Brand</h4>
               <img src={config.logoUrl} alt="Logo" className="h-8 mx-auto grayscale opacity-50" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BotIcon(props: any) {
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
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
