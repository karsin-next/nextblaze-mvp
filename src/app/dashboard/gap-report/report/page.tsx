"use client";

import { useState, useEffect, useRef } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft,
  Check, Sparkles, Download, Eye,
  Layout, ShieldCheck, TrendingUp, BarChart3, AlertTriangle, 
  Target, Calculator, Info, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

export default function InvestorReportPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'standard' | 'investor'>('standard');
  const printRef = useRef<HTMLDivElement>(null);

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
    personalNote: "",
    logoUrl: null as string | null
  });

  // Report Content State (Editable)
  const [reportData, setReportData] = useState({
    executiveSummary: "Based on our comprehensive 360° diagnostic, the startup demonstrates high technical competency (82nd percentile) but secondary governance friction. The path to institutional funding requires immediate solidification of unit economics and financial reporting hygiene.",
    aiInsight: "Compared to 247 other SaaS startups at seed stage, your Fundability Score of 68% places you in the top 35%. Your team strength is exceptional (92nd percentile), but your financial governance (41st percentile) is where investors will focus.",
    companyName: "Your Startup",
    founderName: "Founder Name",
  });

  // Live score data pulled from diagnostic cache
  const [liveData, setLiveData] = useState({
    score: 68,
    problem: 85, product: 78, market: 92, traction: 55, revenue: 48, team: 95,
    mrr: 12000, burn: 25000, runway: 4, cac: 450, ltv: 1800,
  });

  useEffect(() => {
    setIsLoaded(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('audit_1_3_report', 'completed');
      try {
        const s = JSON.parse(localStorage.getItem('audit_score_overview') || '{}');
        const f = JSON.parse(localStorage.getItem('audit_2_1_1') || '{}');
        const u = JSON.parse(localStorage.getItem('audit_2_3_1') || '{}');
        setLiveData(prev => ({
          ...prev,
          score: s?.score ?? prev.score,
          mrr: f?.mrr ?? prev.mrr,
          burn: f?.burn ?? prev.burn,
          runway: f?.runway ?? prev.runway,
          cac: u?.cac ?? prev.cac,
          ltv: u?.ltv ?? prev.ltv,
        }));
      } catch(e) {}
    }
  }, []);

  const toggleSection = (key: keyof typeof config.sections) => {
    setConfig({ ...config, sections: { ...config.sections, [key]: !config.sections[key] } });
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(2);
    }, 2000);
  };

  // Core PDF print function
  const handlePrint = (printMode: 'standard' | 'investor') => {
    setMode(printMode);
    setIsPrinting(true);
    // Allow state to propagate before printing
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 600);
  };

  const radarData = [
    { subject: 'Problem', A: liveData.problem },
    { subject: 'Product', A: liveData.product },
    { subject: 'Market', A: liveData.market },
    { subject: 'Traction', A: liveData.traction },
    { subject: 'Revenue', A: liveData.revenue },
    { subject: 'Team', A: liveData.team },
  ];

  const scoreLabel = liveData.score >= 80 ? "Investor-Ready" : liveData.score >= 60 ? "Fundable with Focus" : "Early-Stage";
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  if (!isLoaded) return null;

  return (
    <>
      {/* ═══════════════════════════════════════
          PRINT STYLESHEET — Hidden from screen 
          ═══════════════════════════════════════ */}
      <style>{`
        @media print {
          /* Reset everything for print */
          html, body {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }

          /* Hide UI elements specifically */
          nav, header, aside, footer, .no-print, [data-no-print], .screen-only {
            display: none !important;
          }

          /* Reset layout containers that might have fixed heights or overflows */
          main, div {
             height: auto !important;
             overflow: visible !important;
             position: static !important;
             margin: 0 !important;
             padding: 0 !important;
          }

          /* Target the report container specifically */
          #investor-print-report {
            display: block !important;
            position: absolute !important;
            top: 0;
            left: 0;
            width: 100% !important;
            background: white !important;
            z-index: 99999;
          }

          /* Page layout */
          @page {
            size: A4;
            margin: 15mm;
          }
          
          .print-page-break { page-break-before: always; }
          
          /* Force colors */
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
        }
        
        @media screen {
          #investor-print-report { display: none; }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          HIDDEN PRINT DOCUMENT (A4-formatted)
          ═══════════════════════════════════════ */}
      <div id="investor-print-report" ref={printRef}>
        {/* COVER PAGE */}
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 0 40px', fontFamily: 'sans-serif' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, borderBottom: '3px solid #022f42', paddingBottom: 24 }}>
              <div style={{ fontFamily: 'sans-serif' }}>
                <div style={{ fontWeight: 900, fontSize: 10, letterSpacing: 4, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>FundabilityOS™</div>
                <div style={{ fontWeight: 900, fontSize: 22, color: '#022f42', textTransform: 'uppercase', letterSpacing: 2 }}>Investor-Ready Report</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>Confidential</div>
                <div style={{ fontSize: 9, color: '#aaa', marginTop: 4 }}>Report ID: RPT-{Date.now().toString().slice(-6)}</div>
              </div>
            </div>

            <div style={{ marginTop: 80, marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd800', background: '#022f42', display: 'inline-block', padding: '4px 12px', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 20 }}>
                {mode === 'investor' ? 'Investor Presentation Mode' : 'Standard Diagnostic Report'}
              </div>
              <h1 style={{ fontSize: 42, fontWeight: 900, color: '#022f42', lineHeight: 1.1, margin: '0 0 12px' }}>{reportData.companyName}</h1>
              <p style={{ fontSize: 14, color: '#555', fontWeight: 600 }}>Compiled by: {reportData.founderName} · {today}</p>
            </div>

            {config.personalNote && (
              <div style={{ borderLeft: '4px solid #ffd800', paddingLeft: 16, marginTop: 32 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Personal Note</div>
                <p style={{ fontSize: 13, color: '#333', fontStyle: 'italic', lineHeight: 1.6 }}>{config.personalNote}</p>
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#022f42' }}>{liveData.score}<span style={{ fontSize: 12, color: '#aaa', fontWeight: 600 }}>/100 Fundability</span></div>
            <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 2 }}>{scoreLabel}</div>
          </div>
        </div>

        {/* SECTION 1: EXECUTIVE SUMMARY */}
        {config.sections.execSum && (
          <div className="print-page-break" style={{ padding: '40px 0', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: '#888', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Section 1</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#022f42', marginBottom: 24, borderBottom: '2px solid #022f42', paddingBottom: 12 }}>Executive Summary</h2>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: '#333', marginBottom: 24 }}>{reportData.executiveSummary}</p>
            <div style={{ background: '#f8f5d8', borderLeft: '4px solid #ffd800', padding: '16px 20px', borderRadius: 4 }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: '#999', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>AI Benchmark Insight</div>
              <p style={{ fontSize: 12, color: '#444', fontStyle: 'italic', lineHeight: 1.7 }}>{reportData.aiInsight}</p>
            </div>
          </div>
        )}

        {/* SECTION 2: SCORE DASHBOARD */}
        {config.sections.score && (
          <div className="print-page-break" style={{ padding: '40px 0', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: '#888', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Section 2</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#022f42', marginBottom: 24, borderBottom: '2px solid #022f42', paddingBottom: 12 }}>Fundability Score Dashboard</h2>
            <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ background: '#022f42', padding: '32px 48px', borderRadius: 8, textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#ffd800', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>Overall Score</div>
                <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>{liveData.score}<span style={{ fontSize: 24, color: '#ffd800' }}>%</span></div>
                <div style={{ fontSize: 11, color: '#aec6d833', marginTop: 12, textTransform: 'uppercase', letterSpacing: 2 }}>{scoreLabel}</div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                {[
                  { label: 'Problem', val: liveData.problem },
                  { label: 'Product', val: liveData.product },
                  { label: 'Market', val: liveData.market },
                  { label: 'Traction', val: liveData.traction },
                  { label: 'Revenue', val: liveData.revenue },
                  { label: 'Team', val: liveData.team },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 4 }}>
                      <span>{item.label}</span><span>{item.val}%</span>
                    </div>
                    <div style={{ height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.val}%`, background: item.val >= 70 ? '#10b981' : '#ffd800', borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: FINANCIAL SNAPSHOT */}
        {config.sections.financials && (
          <div className="print-page-break" style={{ padding: '40px 0', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: '#888', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Section 3</div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#022f42', marginBottom: 24, borderBottom: '2px solid #022f42', paddingBottom: 12 }}>Financial Health Snapshot</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
              {[
                { label: 'Monthly Recurring Revenue', value: `$${(liveData.mrr/1000).toFixed(1)}k`, good: liveData.mrr > 10000 },
                { label: 'Monthly Burn Rate', value: `$${(liveData.burn/1000).toFixed(1)}k`, good: liveData.burn < 30000 },
                { label: 'Estimated Runway', value: `${liveData.runway} months`, good: liveData.runway > 6 },
                { label: 'LTV:CAC Ratio', value: `${(liveData.ltv/liveData.cac).toFixed(1)}x`, good: liveData.ltv/liveData.cac > 3 },
              ].map(item => (
                <div key={item.label} style={{ padding: '20px 24px', background: item.good ? '#f0fdf4' : '#fff7ed', border: `1px solid ${item.good ? '#86efac' : '#fed7aa'}`, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: item.good ? '#16a34a' : '#ea580c' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER on every page via CSS would need position:fixed — instead, add at document end */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: 16, marginTop: 40, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#bbb', fontFamily: 'sans-serif' }}>
          <span>FundabilityOS™ Confidential Report · {today}</span>
          <span>fundabilityos.com</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          SCREEN-ONLY UI 
          ═══════════════════════════════════════ */}
      <div className="screen-only p-6 max-w-7xl mx-auto pb-32" data-no-print>
        <ModuleHeader 
          badge="1.3.4 INVESTOR: Report"
          title="Investor-Ready Report Builder"
          description="Synthesize your diagnostic data into a professional fundraising narrative. One-click PDF export for institutional-grade reporting."
        />

        {/* Progress Bar */}
        <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
          <div className="flex gap-1 md:gap-2">
            {[1,2,3].map(i => (
              <button 
                key={i} 
                onClick={() => setStep(i)}
                className={`h-2 w-20 md:w-32 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'} hover:opacity-80 cursor-pointer`} 
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
                <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <div className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                    <h2 className="text-2xl font-black text-[#022f42] mb-8">Report Configuration</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Branding & Personal Note */}
                      <div className="space-y-6">
                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm space-y-4">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Report Identity</label>
                          <input 
                            type="text" 
                            value={reportData.companyName}
                            onChange={e => setReportData({...reportData, companyName: e.target.value})}
                            placeholder="Company Name"
                            className="w-full p-3 border border-gray-200 rounded-sm outline-none focus:border-[#ffd800] text-sm font-bold"
                          />
                          <input 
                            type="text" 
                            value={reportData.founderName}
                            onChange={e => setReportData({...reportData, founderName: e.target.value})}
                            placeholder="Founder Name"
                            className="w-full p-3 border border-gray-200 rounded-sm outline-none focus:border-[#ffd800] text-sm"
                          />
                        </div>
                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                          <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Personal Note to Investor</label>
                          <textarea 
                            value={config.personalNote}
                            onChange={(e) => setConfig({...config, personalNote: e.target.value})}
                            maxLength={200}
                            placeholder="Add a personalized touch (200 char max)..."
                            className="w-full bg-white p-4 border border-gray-200 rounded-sm outline-none text-sm font-medium focus:border-[#ffd800] min-h-[100px]"
                          />
                        </div>
                      </div>

                      {/* Section Toggles */}
                      <div className="bg-[#f2f6fa] p-8 rounded-sm">
                        <h3 className="text-sm font-bold text-[#022f42] uppercase tracking-widest mb-4">Include Sections</h3>
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
                            { id: 'appendix', label: 'Appendix: Raw Data', icon: Info },
                          ].map((sec) => (
                            <button 
                              key={sec.id}
                              onClick={() => toggleSection(sec.id as keyof typeof config.sections)}
                              className={`w-full flex items-center justify-between p-3 rounded-sm text-xs font-bold transition-all ${config.sections[sec.id as keyof typeof config.sections] ? 'bg-[#022f42] text-white shadow-md' : 'bg-white/50 text-[#1e4a62]'}`}
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
                        className="bg-[#022f42] text-white px-12 py-5 font-black uppercase tracking-[0.2em] rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-2xl"
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

              {/* STEP 2: Preview */}
              {step === 2 && (
                <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                  <div className="bg-white p-8 md:p-12 shadow-2xl rounded-sm border-t-8 border-[#022f42]">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Preview — {reportData.companyName}</p>
                        <h1 className="text-xl font-black text-[#022f42] uppercase tracking-[0.1em]">Fundability Audit Report</h1>
                      </div>
                      <ShieldCheck className="w-8 h-8 text-[#ffd800]" />
                    </div>

                    {/* Editable Executive Summary */}
                    {config.sections.execSum && (
                      <section className="mb-12">
                        <div className="flex items-center gap-2 mb-4 text-[#022f42]">
                          <Sparkles className="w-4 h-4 text-[#ffd800]" />
                          <h2 className="text-sm font-black uppercase tracking-widest">Executive Summary</h2>
                        </div>
                        <div className="relative group">
                          <textarea 
                            className="w-full text-sm leading-relaxed text-[#1e4a62] bg-gray-50 p-5 rounded-sm border border-transparent focus:border-[#ffd800] outline-none min-h-[100px] font-medium"
                            value={reportData.executiveSummary}
                            onChange={(e) => setReportData({...reportData, executiveSummary: e.target.value})}
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[8px] font-bold bg-[#ffd800] text-[#022f42] px-2 py-1 rounded-sm uppercase">Editable</span>
                          </div>
                        </div>
                      </section>
                    )}

                    {/* Score Visual */}
                    {config.sections.score && (
                      <section className="mb-12">
                        <h2 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-gray-100 pb-3">Fundability Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                          <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#022f42', fontSize: 10, fontWeight: 700 }} />
                                <Radar name="Score" dataKey="A" stroke="#022f42" fill="#022f42" fillOpacity={0.5} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="bg-[#022f42] p-8 text-center rounded-sm">
                            <div className="text-[10px] font-black text-[#ffd800] uppercase tracking-widest mb-2">Overall Score</div>
                            <div className="text-7xl font-black text-white">{liveData.score}<span className="text-2xl text-[#ffd800]">%</span></div>
                            <div className="mt-3 text-xs font-bold text-emerald-400">{scoreLabel}</div>
                          </div>
                        </div>
                      </section>
                    )}

                    <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm text-center">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">All selected sections will be included in the PDF</p>
                      <button onClick={() => setStep(3)} className="bg-[#022f42] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#1b4f68]">Proceed to Export</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Export */}
              {step === 3 && (
                <motion.div key="s3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-8">
                  <div className="bg-white p-12 shadow-2xl rounded-sm text-center">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-[#022f42] mb-4">Report Ready to Export</h2>
                    <p className="text-sm font-medium text-[#1e4a62] max-w-lg mx-auto leading-relaxed mb-4">
                      Your {reportData.companyName} investor report has been compiled with {Object.values(config.sections).filter(Boolean).length} sections active.
                    </p>
                    <p className="text-xs text-gray-400 font-medium mb-12">
                      Click a button below → your browser&apos;s print dialog will open → select &quot;Save as PDF&quot;
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <button 
                        onClick={() => handlePrint('standard')}
                        disabled={isPrinting}
                        className="flex items-center justify-center gap-3 p-6 bg-[#022f42] text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-[#1b4f68] transition-all shadow-xl disabled:opacity-60"
                      >
                        {isPrinting ? <div className="w-4 h-4 border-2 border-[#ffd800] border-t-transparent rounded-full animate-spin" /> : <Download className="w-4 h-4 text-[#ffd800]" />}
                        Download PDF (Standard)
                      </button>
                      <button 
                        onClick={() => handlePrint('investor')}
                        disabled={isPrinting}
                        className="flex items-center justify-center gap-3 p-6 bg-white border-2 border-[#022f42] text-[#022f42] font-black uppercase tracking-widest text-xs rounded-sm hover:bg-gray-50 transition-all disabled:opacity-60"
                      >
                        {isPrinting ? <div className="w-4 h-4 border-2 border-[#022f42] border-t-transparent rounded-full animate-spin" /> : <Eye className="w-4 h-4" />}
                        Download PDF (Investor Mode)
                      </button>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-sm text-left max-w-2xl mx-auto">
                      <p className="text-xs font-bold text-blue-700">💡 How to save as PDF:</p>
                      <p className="text-xs text-blue-600 mt-1">When the print dialog opens → Destination → &quot;Save as PDF&quot; → Save. On Mac you can also use <strong>Cmd+P → PDF button</strong>.</p>
                    </div>
                  </div>

                  <div className="bg-[#fef9c3] p-8 border-l-[6px] border-[#eab308] rounded-sm">
                    <div className="flex items-start gap-4">
                      <Sparkles className="w-6 h-6 text-[#eab308] shrink-0" />
                      <div>
                        <h4 className="font-black text-[#854d0e] uppercase tracking-widest text-sm mb-2">Verified Badge Eligibility</h4>
                        <p className="text-xs font-medium text-[#854d0e]/80 leading-relaxed">
                          To unlock the FundabilityOS Verified Badge on your cover page, ensure your Data Room checklist (2.5.2) is 100% complete.
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
                  onClick={() => step === 1 ? handleGenerate() : setStep(s => s + 1)}
                  className="bg-[#022f42] text-white px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#1b4f68] transition-colors flex items-center gap-2 shadow-md"
                >
                  {step === 1 ? 'Generate Report' : 'Proceed to Export'} <ArrowRight className="w-4 h-4"/>
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-lg border-b-4 border-[#ffd800]">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#ffd800]" />
                <h3 className="font-black uppercase tracking-widest text-xs">Quick Guide</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-sm border border-white/10">
                  <p className="text-sm leading-relaxed text-blue-50 font-medium">
                    {step === 1 ? "Configure your company info and select which sections to include. Fewer sections = a more focused, impactful investor document." : 
                     step === 2 ? "Review and edit the AI-generated content inline. Click any text area to customize your Executive Summary before exporting." :
                     "Click either PDF button to open the browser print dialog. Select 'Save as PDF' as the destination."}
                  </p>
                </div>
                <hr className="border-white/10" />
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest">Modules Synced</div>
                <div className="grid grid-cols-3 gap-1">
                  {['1.1.1','1.1.5','1.1.6','1.1.7','1.1.8','1.2.1'].map(m => (
                    <div key={m} className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-1 rounded text-center">{m}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Report Completeness</h4>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black text-[#022f42]">{Object.values(config.sections).filter(Boolean).length}/9</div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ffd800] transition-all duration-500" style={{width: `${(Object.values(config.sections).filter(Boolean).length / 9) * 100}%`}} />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">sections active</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
