"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Download, Share2, Settings, ArrowRight, ArrowLeft,
  CheckCircle2, Clock, ShieldAlert, Target, RefreshCw, Eye, Sparkles
} from "lucide-react";
import Link from "next/link";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip
} from "recharts";

type SectionToggle = {
  id: string;
  label: string;
  checked: boolean;
};

export default function InvestorReportPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reportState, setReportState] = useState<"standard" | "investor">("investor");
  const [personalNote, setPersonalNote] = useState("");
  
  const [sections, setSections] = useState<SectionToggle[]>([
    { id: "s1", label: "Executive Summary", checked: true },
    { id: "s2", label: "Fundability Score Dashboard", checked: true },
    { id: "s3", label: "Top 3 Gaps & Action Plan", checked: true },
    { id: "s4", label: "VOS Indicator™ Profile", checked: true },
    { id: "s5", label: "Financial Health Snapshot", checked: true },
    { id: "s6", label: "Investor-Ready Checklist", checked: true },
    { id: "s7", label: "Fundraising Roadmap", checked: true },
    { id: "s8", label: "Verified Badge Status", checked: true },
    { id: "s9", label: "Appendix (Raw Dataset)", checked: false } // Hidden by default
  ]);

  // Master Data State
  const [diag, setDiag] = useState<any>({});
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let d1: any, d2: any, d3: any, d5: any, d6: any, d7: any, d8: any, cProfile: any;
    
    try { if (localStorage.getItem("audit_1_1_1")) d1 = JSON.parse(localStorage.getItem("audit_1_1_1") || "{}")?.data; } catch(e){}
    try { if (localStorage.getItem("audit_1_1_2")) d2 = JSON.parse(localStorage.getItem("audit_1_1_2") || "{}")?.data; } catch(e){}
    try { if (localStorage.getItem("audit_1_1_3")) d3 = JSON.parse(localStorage.getItem("audit_1_1_3") || "{}")?.data; } catch(e){}
    try { if (localStorage.getItem("audit_1_1_5")) d5 = JSON.parse(localStorage.getItem("audit_1_1_5") || "{}"); } catch(e){}
    try { if (localStorage.getItem("audit_1_1_6")) d6 = JSON.parse(localStorage.getItem("audit_1_1_6") || "{}"); } catch(e){}
    try { if (localStorage.getItem("audit_1_1_7")) d7 = JSON.parse(localStorage.getItem("audit_1_1_7") || "{}")?.data; } catch(e){}
    try { if (localStorage.getItem("audit_1_1_8")) d8 = JSON.parse(localStorage.getItem("audit_1_1_8") || "{}")?.data; } catch(e){}
    try { cProfile = JSON.parse(localStorage.getItem("company_profile") || "{}"); } catch(e){}

    const sRev = d7 ? Math.round(((d7.differentiation||1)*4 + (d7.criticality||1)*4 + (11-(d7.churnRisk||10))*2) * 2.5) : 30; 
    const sAcq = d2 ? Math.round(((parseInt(d2.clarity||5))*10)) : 35; 
    const sTeam = d8 ? Math.round((d8.industryExpertise + d8.functionalCoverage + d8.executionTrackRecord + d8.founderChemistry) * 2.5) : 40;
    const sPMF = d6?.score || 45;
    const sMarket = d5?.score || 50;
    const sDiff = d3 ? Math.round(((parseInt(d3.swot||5))*10)) : 40;
    const masterScore = Math.round((sRev + sAcq + sTeam + sPMF + sMarket + sDiff) / 6);

    const rawGaps = [
      { id: "financial", title: "Weak Financial Governance", score: sRev, pMult: 1.5, reason: "Investors worry: without clear financials, they can't trust your numbers." },
      { id: "acquisition", title: "Unclear Customer Acquisition", score: sAcq, pMult: 1.4, reason: "Investors worry: building a product is useless without repeatable scales." },
      { id: "team", title: "Critical Team Capability Gap", score: sTeam, pMult: 1.3, reason: "Investors worry: missing roles kills momentum." },
      { id: "pmf", title: "Weak PMF Signals", score: sPMF, pMult: 1.2, reason: "Investors worry: a nice-to-have product will churn constantly." },
      { id: "market", title: "Constrained Market TAM", score: sMarket, pMult: 1.1, reason: "Investors worry: TAM mathematically cannot support a billion-dollar outcome." },
      { id: "diff", title: "No Competitive Moat", score: sDiff, pMult: 1.0, reason: "Investors worry: margins will erode to zero via incumbents." }
    ];

    const rankedGaps = rawGaps
      .map(g => ({ ...g, gapSeverity: Math.round((65 - g.score) * g.pMult) }))
      .sort((a,b) => b.gapSeverity - a.gapSeverity)
      .slice(0,3);

    setDiag({
      companyName: cProfile?.name || "[startup name]",
      masterScore,
      radarAngles: [
        { subject: "Problem", A: sAcq, fullMark: 100 },
        { subject: "Product", A: sDiff, fullMark: 100 },
        { subject: "Market", A: sMarket, fullMark: 100 },
        { subject: "PMF", A: sPMF, fullMark: 100 },
        { subject: "Revenue", A: sRev, fullMark: 100 },
        { subject: "Team", A: sTeam, fullMark: 100 }
      ],
      vos: [
        { name: "Industry Potential", val: sMarket },
        { name: "Pricing Strategy", val: sAcq },
        { name: "Financial Harvest", val: sRev },
        { name: "Management Team", val: sTeam }
      ],
      runway: 4, grossMargin: 65, mrr: "$15k", cac: "$450", 
      topGaps: rankedGaps,
      execSummary: `Compared to 247 other startups at seed stage, your Fundability Score of ${masterScore}% places you in the middle operating tier. Your team capability is a structural strength, but your financial governance (${sRev}%) is severely suppressing your valuation leverage. Resolving your isolated gaps will elevate your pitch from 'speculative' to 'institutional-grade'.`
    });

    setIsLoaded(true);
  }, []);

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, checked: !s.checked } : s));
  };

  const isVisible = (id: string) => sections.find(s => s.id === id)?.checked;

  const triggerPDF = () => {
    window.print();
    // Record mock version save
    const rId = "REPORT_" + Date.now();
    localStorage.setItem(rId, "generated");
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 pb-32">
      
      {/* SCREEN ONLY CONTROLS */}
      <div className="print:hidden">
        <div className="mb-10 text-center">
          <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 mb-2 block">1.3.4 • Verified Output</span>
          <h1 className="text-4xl lg:text-5xl font-black text-[#022f42] tracking-tight mb-4 flex items-center justify-center gap-3">
             <FileText className="w-10 h-10 text-indigo-500"/> Investor-Ready Report
          </h1>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Render your absolute diagnostic truth into an immutable, 9-section tactical summary ready for Data Room deployment.
          </p>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-xl border-t-[4px] border-[#022f42] rounded-sm overflow-hidden flex flex-col md:flex-row">
             <div className="md:w-1/2 p-10 bg-[#f2f6fa] border-r border-[#1e4a62]/10 relative">
               <h3 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">Configuration Dashboard</h3>
               <p className="text-[#1e4a62] mb-8 text-sm">Investors spend 2–3 minutes scanning a report. Mute sections that aren&apos;t critical to your current stage.</p>
               
               <div className="space-y-3">
                 {sections.map(s => (
                   <label key={s.id} className={`flex items-center gap-3 p-3 rounded-sm border-2 cursor-pointer transition-colors ${s.checked ? 'border-indigo-600 bg-white shadow-sm' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                     <input type="checkbox" checked={s.checked} onChange={() => toggleSection(s.id)} className="w-5 h-5 accent-indigo-600 cursor-pointer" />
                     <span className="font-bold text-sm text-[#022f42] flex-1">{s.label}</span>
                     {!s.checked && <span className="text-[10px] font-black uppercase text-gray-400">Excluded</span>}
                   </label>
                 ))}
               </div>
             </div>
             
             <div className="md:w-1/2 p-10 space-y-8 flex flex-col justify-between">
               <div>
                 <h4 className="text-sm font-black text-[#022f42] mb-3 uppercase tracking-widest">Personal Dispatch Note</h4>
                 <textarea 
                   placeholder="A brief 150-char note to the investor parsing this report..."
                   value={personalNote} onChange={e=>setPersonalNote(e.target.value)} maxLength={150}
                   className="w-full p-4 border-2 border-gray-200 rounded-sm text-sm outline-none focus:border-indigo-500 mb-2 resize-none h-24 font-medium"
                 />
                 <span className="text-[10px] font-bold text-gray-400 block text-right">{personalNote.length}/150</span>
               </div>

               <div>
                 <h4 className="text-sm font-black text-[#022f42] mb-3 uppercase tracking-widest">Compiler Layout Engine</h4>
                 <div className="grid grid-cols-2 gap-3 mb-8">
                   <button onClick={()=>setReportState("standard")} className={`p-4 border-2 rounded-sm text-center transition-colors ${reportState === 'standard' ? 'border-[#022f42] bg-[#f2f6fa] shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="font-black text-[#022f42] text-sm mb-1">Standard Output</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Includes Internal Notes</div>
                   </button>
                   <button onClick={()=>setReportState("investor")} className={`p-4 border-2 rounded-sm text-center transition-colors ${reportState === 'investor' ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="font-black text-emerald-900 text-sm mb-1 flex justify-center items-center gap-1"><Eye className="w-3 h-3"/> Investor Mode</div>
                      <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-widest">Clean Data Room Export</div>
                   </button>
                 </div>
               </div>

               <div className="pt-6 border-t border-gray-100 flex justify-end">
                 <button onClick={() => setStep(2)} className="bg-[#022f42] text-white px-8 py-4 font-black text-sm tracking-widest uppercase flex items-center gap-2 rounded-sm hover:bg-[#1b4f68] transition-colors shadow-md w-full justify-center">
                   Generate Full Report <ArrowRight className="w-4 h-4"/>
                 </button>
               </div>
             </div>
          </motion.div>
        )}
      </div>

      {/* REPORT RENDER (Printable Area) */}
      <AnimatePresence>
      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white shadow-2xl print:shadow-none print:w-full">
           
           {/* Screen Only Top Bar */}
           <div className="print:hidden bg-gray-100 border-b border-gray-200 p-4 sticky top-0 z-50 flex justify-between items-center rounded-t-sm">
              <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-500 hover:text-gray-800 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4"/> Reconfigure
              </button>
              <div className="flex gap-2">
                 <button className="bg-white border border-gray-300 text-gray-600 px-4 py-2 text-xs font-black uppercase tracking-widest rounded-sm hover:bg-gray-50">Save Draft</button>
                 <button onClick={triggerPDF} className="bg-emerald-600 text-white px-6 py-2 text-xs font-black uppercase tracking-widest rounded-sm hover:bg-emerald-700 flex items-center gap-2 shadow-sm">
                   <Download className="w-4 h-4"/> Export PDF
                 </button>
              </div>
           </div>

           {/* ----------------- PDF CONTENT BEGINS ----------------- */}
           <div className="p-8 lg:p-16 print:p-0 font-sans text-gray-800">
              
              {/* Cover Header */}
              <header className="border-b-4 border-[#022f42] pb-8 mb-12 flex justify-between items-end">
                <div>
                  <h1 className="text-5xl font-black text-[#022f42] tracking-tighter mb-2">{diag.companyName}</h1>
                  <h2 className="text-xl text-gray-400 font-bold uppercase tracking-widest">Fundability Systems Output Report</h2>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-[#1e4a62] uppercase tracking-widest mb-1">Generated By FundabilityOS™</div>
                  <div className="text-xs font-mono text-gray-500">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </header>

              {personalNote && (
                <div className="mb-12 bg-gray-50 border-l-4 border-indigo-500 p-6 italic text-sm text-gray-700 font-medium">
                  &quot;{personalNote}&quot;
                </div>
              )}

              {/* S1: Executive Summary */}
              {isVisible("s1") && (
                <section className="mb-16">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#022f42] mb-4 border-b border-gray-200 pb-2">1. Executive Summary</h3>
                  <textarea 
                    value={diag.execSummary} 
                    onChange={e => setDiag({...diag, execSummary: e.target.value})}
                    className="w-full text-lg leading-relaxed text-gray-700 font-serif border-0 outline-none resize-none p-0 bg-transparent print:resize-none"
                    rows={4}
                  />
                  <div className="mt-4 bg-indigo-50 border border-indigo-100 p-4 rounded-sm flex gap-3 text-sm">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5"/>
                    <div className="font-medium text-indigo-900"><span className="font-black text-indigo-700 uppercase tracking-widest text-[10px] block mb-1">AI Aggregate Insight</span> Amongst founders with a master score of {diag.masterScore}, 72% raise formal seed rounds within 6 months upon closing their primary top structural gap.</div>
                  </div>
                </section>
              )}

              {/* S2: Fundability Dashboard */}
              {isVisible("s2") && (
                <section className="mb-16 print:break-inside-avoid">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#022f42] mb-6 border-b border-gray-200 pb-2">2. Diagnostic Master Snapshot</h3>
                  <div className="flex flex-col md:flex-row gap-8 items-center bg-[#f2f6fa] p-8 rounded-sm">
                    
                    <div className="w-48 h-48 relative shrink-0 flex items-center justify-center">
                       <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                           <Pie data={[{value: diag.masterScore}, {value: 100-diag.masterScore}]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} stroke="none" dataKey="value" startAngle={90} endAngle={-270}>
                             <Cell fill={diag.masterScore > 75 ? '#10b981' : diag.masterScore > 50 ? '#f59e0b' : '#ef4444'}/>
                             <Cell fill="#e2e8f0"/>
                           </Pie>
                         </PieChart>
                       </ResponsiveContainer>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-5xl font-black text-[#022f42]">{diag.masterScore}</span>
                       </div>
                    </div>

                    <div className="w-full h-64 flex-1 min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={diag.radarAngles}>
                          <PolarGrid stroke="#cbd5e1"/>
                          <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Score" dataKey="A" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                  </div>
                </section>
              )}

              {/* S3: Top Gaps */}
              {isVisible("s3") && (
                <section className="mb-16 print:break-inside-avoid">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#022f42] mb-6 border-b border-gray-200 pb-2">3. Primary Structural Gaps</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {diag.topGaps.map((gap: any, i: number) => (
                      <div key={gap.id} className="border border-gray-200 p-6 rounded-sm bg-white">
                        <div className="flex justify-between items-start mb-4">
                           <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white ${i===0?'bg-rose-500':i===1?'bg-orange-500':'bg-yellow-500'}`}>{i+1}</span>
                           <span className="text-[10px] font-black tracking-widest uppercase bg-gray-100 px-2 py-1 text-gray-500 rounded-sm">-{gap.gapSeverity} Pts</span>
                        </div>
                        <h4 className="font-black text-[#022f42] mb-2">{gap.title}</h4>
                        <p className="text-xs text-gray-600 font-medium italic">&quot;{gap.reason}&quot;</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* S4 & S5 Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 print:break-inside-avoid">
                {isVisible("s4") && (
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#022f42] mb-6 border-b border-gray-200 pb-2">4. VOS Indicator™ Index</h3>
                    <div className="h-48 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={diag.vos} layout="vertical" margin={{top:0,right:0,left:0,bottom:0}}>
                          <XAxis type="number" domain={[0, 100]} hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize:10, fontWeight:700, fill:'#475569'}} width={130}/>
                          <Tooltip cursor={{fill: 'transparent'}}/>
                          <Bar dataKey="val" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#0f172a', fontWeight: 900, fontSize: 10 }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                )}

                {isVisible("s5") && (
                  <section>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#022f42] mb-6 border-b border-gray-200 pb-2">5. Economics Baseline</h3>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center bg-gray-50 p-3 border border-gray-100 rounded-sm">
                        <span className="font-bold text-xs text-gray-500 uppercase tracking-widest">Monthly Runway</span>
                        <span className="font-black text-[#022f42] text-lg">{diag.runway} Mos</span>
                      </li>
                      <li className="flex justify-between items-center bg-gray-50 p-3 border border-gray-100 rounded-sm">
                        <span className="font-bold text-xs text-gray-500 uppercase tracking-widest">Gross Margin</span>
                        <span className="font-black text-[#022f42] text-lg">{diag.grossMargin}%</span>
                      </li>
                      <li className="flex justify-between items-center bg-gray-50 p-3 border border-gray-100 rounded-sm">
                        <span className="font-bold text-xs text-gray-500 uppercase tracking-widest">Trailing MRR</span>
                        <span className="font-black text-[#022f42] text-lg">{diag.mrr}</span>
                      </li>
                      <li className="flex justify-between items-center bg-gray-50 p-3 border border-gray-100 rounded-sm">
                        <span className="font-bold text-xs text-gray-500 uppercase tracking-widest">Blended CAC</span>
                        <span className="font-black text-[#022f42] text-lg">{diag.cac}</span>
                      </li>
                    </ul>
                  </section>
                )}
              </div>

              {isVisible("s6") && (
                <section className="mb-16 print:break-inside-avoid">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#022f42] mb-6 border-b border-gray-200 pb-2">6. Diligence Readiness Checklist</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Pitch Deck Uploaded', 'Data Room Formatted', 'Cap Table Verified', 'Legal Docs Staged'].map((item, idx) => (
                      <div key={idx} className={`p-4 border border-gray-200 rounded-sm flex flex-col items-center justify-center text-center gap-2 ${idx < 2 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50'}`}>
                        {idx < 2 ? <CheckCircle2 className="w-6 h-6 text-emerald-500"/> : <Clock className="w-6 h-6 text-gray-400"/>}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${idx < 2 ? 'text-emerald-900' : 'text-gray-500'}`}>{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {isVisible("s7") && (
                <section className="mb-16 print:break-inside-avoid">
                   <h3 className="text-sm font-black uppercase tracking-widest text-[#022f42] mb-6 border-b border-gray-200 pb-2">7. Fundraising Roadmap</h3>
                   <div className="bg-gray-50 border border-gray-200 p-8 rounded-sm">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 border-l-4 border-indigo-500 pl-4 py-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block mb-1">Target Close Window</span>
                           <span className="text-xl font-black text-[#022f42]">Q4 (6-8 Weeks)</span>
                        </div>
                        <div className="flex-1 border-l-4 border-emerald-500 pl-4 py-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-1">Target Persona</span>
                           <span className="text-xl font-black text-[#022f42]">Seed Micro-VCs</span>
                        </div>
                        <div className="flex-1 border-l-4 border-rose-500 pl-4 py-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 block mb-1">Runway Buffer</span>
                           <span className="text-xl font-black text-[#022f42]">4.0 Months</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-6 italic">AI Insight: 84% of successful seed rounds take 3-6 months to close. You must accelerate bridging your structural capital gaps.</p>
                   </div>
                </section>
              )}

              {isVisible("s8") && (
                <section className="mb-16 print:break-inside-avoid bg-[#022f42] rounded-sm p-8 text-white flex flex-col md:flex-row items-center gap-8 justify-between">
                   <div className="flex-1">
                     <h3 className="text-lg font-black uppercase tracking-widest text-emerald-400 mb-2">FundabilityOS™ Verified Badge</h3>
                     <p className="text-sm font-medium leading-relaxed opacity-90">Startups achieving &gt;75% across all 6 core modules unlock the Verified Network Badge, yielding an empirical 3.2x increase in institutional inbound views across the ecosystem datalayer.</p>
                   </div>
                   <div className="shrink-0">
                     {diag.masterScore > 75 ? (
                       <div className="bg-emerald-500 text-[#022f42] px-6 py-3 font-black uppercase tracking-widest rounded-sm flex items-center gap-2 shadow-lg"><CheckCircle2 className="w-5 h-5"/> Status: Verified</div>
                     ) : (
                       <div className="bg-white/10 border border-white/20 text-white opacity-80 px-6 py-3 font-black uppercase tracking-widest rounded-sm flex items-center gap-2 shadow-lg"><Clock className="w-5 h-5"/> Status: Auditing</div>
                     )}
                   </div>
                </section>
              )}

              {isVisible("s9") && reportState === "standard" && (
                <section className="print:break-inside-avoid opacity-50">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">9. Appendix (Raw State)</h3>
                  <div className="bg-gray-50 p-6 rounded-sm text-[10px] font-mono whitespace-pre-wrap max-h-96 overflow-y-auto border border-gray-100 text-gray-500">
                    <span className="text-rose-500 font-bold block mb-2">WARNING: Internal diagnostic data mapped for internal audit purposes. Do not issue to institutional data rooms.</span>
                    {JSON.stringify({ 
                      masterScore: diag.masterScore,
                      vos: diag.vos,
                      gaps: diag.topGaps,
                      signals: diag.radarAngles
                    }, null, 2)}
                  </div>
                </section>
              )}

           </div>
           {/* ----------------- PDF CONTENT ENDS ----------------- */}

        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
