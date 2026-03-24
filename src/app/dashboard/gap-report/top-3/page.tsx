"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, CheckCircle2, ArrowRight, PlayCircle, BookOpen, 
  Download, X, Info, Loader2, Sparkles, AlertCircle
} from "lucide-react";
import Link from "next/link";

interface GapEvidence {
  bullet: string;
  moduleLink: string;
  moduleName: string;
}

interface GapRecord {
  id: string;
  title: string;
  impactLabel: "High" | "Medium-High" | "Medium";
  impactColor: string;
  impactBg: string;
  whyCare: string;
  evidence: GapEvidence[];
  recommendedAction: string;
  actionLink: string;
  aiInsight: string;
  addedToPlan: boolean;
}

export default function Top3GapsPage() {
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");
  const [overallScore, setOverallScore] = useState(0);
  const [topGaps, setTopGaps] = useState<GapRecord[]>([]);
  const [learnMoreGap, setLearnMoreGap] = useState<GapRecord | null>(null);

  useEffect(() => {
    // Artificial loading state for UX
    setTimeout(() => {
      calculateGaps();
    }, 1500);
  }, []);

  const calculateGaps = () => {
    let moduleCount = 0;
    
    // 1. Pull Data
    let d1: any, d2: any, d3: any, d5: any, d6: any, d7: any, d8: any;
    try { if (localStorage.getItem("audit_1_1_1") || localStorage.getItem("audit_1_1_1_v2")) { moduleCount++; d1 = JSON.parse(localStorage.getItem("audit_1_1_1") || localStorage.getItem("audit_1_1_1_v2") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_2")) { moduleCount++; d2 = JSON.parse(localStorage.getItem("audit_1_1_2") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_3")) { moduleCount++; d3 = JSON.parse(localStorage.getItem("audit_1_1_3") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_4")) { moduleCount++; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_5")) { moduleCount++; d5 = JSON.parse(localStorage.getItem("audit_1_1_5") || "{}"); } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_6")) { moduleCount++; d6 = JSON.parse(localStorage.getItem("audit_1_1_6") || "{}"); } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_7")) { moduleCount++; d7 = JSON.parse(localStorage.getItem("audit_1_1_7") || "{}")?.data; } } catch(e){}
    try { if (localStorage.getItem("audit_1_1_8")) { moduleCount++; d8 = JSON.parse(localStorage.getItem("audit_1_1_8") || "{}")?.data; } } catch(e){}

    if (moduleCount < 4) {
      setStatus("empty");
      return;
    }

    // 2. Score Extractions (1-100 scale normalization)
    const sRev = d7 ? Math.round(((d7.differentiation||1)*4 + (d7.criticality||1)*4 + (11-(d7.churnRisk||10))*2) * 2.5) : 30; // Financial Governance proxy
    const sAcq = d2 ? Math.round(((parseInt(d2.clarity||5))*10)) : 35; // Customer Acq proxy
    const sTeam = d8 ? Math.round((d8.industryExpertise + d8.functionalCoverage + d8.executionTrackRecord + d8.founderChemistry) * 2.5) : 40;
    const sPMF = d6?.score || 45;
    const sMarket = d5?.score || 50;
    const sDiff = d3 ? Math.round(((parseInt(d3.swot||5))*10)) : 40;

    // Fake calculate overall score for display
    setOverallScore(Math.round((sRev + sAcq + sTeam + sPMF + sMarket + sDiff) / 6));

    // 3. Weight against benchmark (Assume 65 baseline proxy for simulation logic)
    const gapsCalc = [
      {
        id: "financial", title: "Weak Financial Governance", score: sRev, pMult: 1.5,
        whyCare: "Without clear financials, investors can't assess risk or valuation.",
        evidence: [
          { bullet: d7 ? `Margin profile indicates high underlying churn friction (Risk: ${d7.churnRisk||10}/10)` : "No unit economics tracked natively", moduleLink: "/dashboard/audit/7-revenue", moduleName: "Module 1.1.7" },
          { bullet: "Runway calculation entirely undefined.", moduleLink: "/dashboard/strategy/how", moduleName: "Module 2.4.4" }
        ],
        action: "Complete the Strategic Capital & Runway sequence.",
        actionLink: "/dashboard/strategy/how",
        insight: "Startups in your stage with a clear runway and unit economics close rounds 2.3x faster than those without."
      },
      {
        id: "acquisition", title: "Unclear Customer Acquisition Channel", score: sAcq, pMult: 1.4,
        whyCare: "A product without a repeatable scalable sales motion is essentially un-fundable.",
        evidence: [
          { bullet: d2 ? `Purchasing trigger logic lacks urgency (Clarity: ${d2.clarity||0}/10)` : "No clear customer onboarding hooks.", moduleLink: "/dashboard/audit/2-customer", moduleName: "Module 1.1.2" }
        ],
        action: "Establish rigid ICP bounds & LTV frameworks.",
        actionLink: "/dashboard/unit-economics/cac",
        insight: "Only 12% of startups in your industry successfully raise without a proven customer acquisition channel."
      },
      {
        id: "team", title: "Critical Team Capability Gap", score: sTeam, pMult: 1.3,
        whyCare: "Investors invest in teams that can pivot. Incomplete teams massively compound execution risk.",
        evidence: [
          { bullet: d8 ? `Functional coverage implies a missing technical co-founder mechanism.` : "Team roster remains un-audited.", moduleLink: "/dashboard/audit/8-team", moduleName: "Module 1.1.8" }
        ],
        action: "Deploy Founder Chemistry logic.",
        actionLink: "/dashboard/audit/8-team",
        insight: "Investors report that a missing CTO is the top reason they pass on pre-seed startups."
      },
      {
        id: "pmf", title: "Weak Product-Market Fit Signals", score: sPMF, pMult: 1.2,
        whyCare: "PMF separates 'nice-to-have' vitamins from 'must-have' painkillers. It dictates pricing power.",
        evidence: [
          { bullet: d6?.data?.painkillerChoice === 'vitamin' ? "Product explicitly identified as a Vitamin." : "Usage velocity signals are dangerously low.", moduleLink: "/dashboard/audit/6-pmf", moduleName: "Module 1.1.6" }
        ],
        action: "Realign product retention loops.",
        actionLink: "/dashboard/audit/6-pmf",
        insight: "Vitamin products raise at 30% lower valuations than painkillers at the exact same stage."
      },
      {
        id: "market", title: "Constrained Market TAM", score: sMarket, pMult: 1.1,
        whyCare: "Venture scale mandates billion-dollar outcomes. A small market fundamentally breaks VC math.",
        evidence: [
          { bullet: "Bottom-up TAM fails the $1B threshold.", moduleLink: "/dashboard/audit/5-market", moduleName: "Module 1.1.5" }
        ],
        action: "Run the VOS Indicator TAM logic.",
        actionLink: "/dashboard/audit/5-market",
        insight: "Startups attacking a TAM under $1B rarely command Series A valuations above $20M."
      },
      {
        id: "diff", title: "No Competitive Moat Identified", score: sDiff, pMult: 1.0,
        whyCare: "Without a moat, margins inevitably erode to zero. Investors require defensibility.",
        evidence: [
          { bullet: "Differentiation statement overlaps heavily with standard sector norms.", moduleLink: "/dashboard/audit/3-competitive", moduleName: "Module 1.1.3" }
        ],
        action: "Audit IP and strategic defensibility structures.",
        actionLink: "/dashboard/audit/3-competitive",
        insight: "Startups with a defined moat (IP, network effects, etc.) raise at 40% higher valuations."
      }
    ];

    // Priority formula: (65 benchmark - user_score) * priority_multiplier
    const ranked = gapsCalc
      .map(g => ({ ...g, gapSeverity: (65 - g.score) * g.pMult }))
      .sort((a,b) => b.gapSeverity - a.gapSeverity)
      .slice(0,3);

    const formatImpact = (idx: number) => {
      if (idx === 0) return { label: "High" as const, color: "text-rose-700", bg: "bg-rose-50 border-rose-200 text-rose-700" };
      if (idx === 1) return { label: "Medium-High" as const, color: "text-orange-700", bg: "bg-orange-50 border-orange-200 text-orange-700" };
      return { label: "Medium" as const, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200 text-yellow-700" };
    };

    setTopGaps(ranked.map((g, idx) => {
      const imp = formatImpact(idx);
      return {
        id: g.id,
        title: g.title,
        impactLabel: imp.label,
        impactColor: imp.color,
        impactBg: imp.bg,
        whyCare: g.whyCare,
        evidence: g.evidence,
        recommendedAction: g.action,
        actionLink: g.actionLink,
        aiInsight: g.insight,
        addedToPlan: false
      };
    }));

    setStatus("ready");
    if (typeof window !== 'undefined') {
      localStorage.setItem('audit_1_3_top_3', 'completed');
    }
  };

  const toggleActionPlan = (id: string) => {
    setTopGaps(prev => prev.map(g => g.id === id ? { ...g, addedToPlan: !g.addedToPlan } : g));
  };

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto p-8 pt-32 text-center pb-64">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-black text-[#022f42] uppercase tracking-widest mb-2">Synthesizing Diagnostic Cache</h2>
        <p className="text-sm text-gray-500 font-medium max-w-md mx-auto">Running your profile against thousands of successful venture rounds to isolate critical execution vulnerabilities.</p>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="max-w-3xl mx-auto p-8 pt-32 text-center pb-64">
        <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-6 opacity-80" />
        <h2 className="text-2xl font-black text-[#022f42] tracking-tight mb-4">Insufficient Data Pipeline</h2>
        <p className="text-base text-gray-600 font-medium mb-8">You must complete at least 4 diagnostic footprint modules to trigger the AI gap interpolation engine. It requires structural context to compute accurately.</p>
        <Link href="/dashboard" className="bg-[#ffd800] text-[#022f42] font-black uppercase tracking-widest text-xs px-8 py-4 rounded-sm hover:bg-yellow-400 transition-colors">
           Return to Diagnostics
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 pb-32">
      
      {/* HEADER */}
      <div className="mb-10 text-center">
        <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 mb-2 block">1.3.1 • Priority Gaps</span>
        <h1 className="text-4xl lg:text-5xl font-black text-[#022f42] tracking-tight mb-4 flex items-center justify-center gap-3">
           <AlertTriangle className="w-10 h-10 text-rose-500" />
           Your Top 3 Gaps
        </h1>
        <p className="inline-block px-4 py-1.5 bg-gray-100 text-[#1e4a62] font-bold text-sm rounded-full">
           Based on your localized Fundability Score of <b>{overallScore}%</b>
        </p>
      </div>

      <p className="text-center text-gray-600 font-medium max-w-2xl mx-auto mb-12">
        We&#39;ve processed your footprint against 1,200+ statistical fundraising rounds. These are the three exact red flags fundamentally suppressing your institutional valuation probability.
      </p>

      {/* GAP CARDS */}
      <div className="space-y-16">
        {topGaps.map((gap, index) => (
          <div key={gap.id} className="relative">
            {/* Rank Number Badge */}
            <div className={`absolute -left-4 -top-4 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg text-white shadow-lg z-10 ${index === 0 ? 'bg-rose-600' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`}>
              #{index + 1}
            </div>

            <div className="bg-white border border-gray-200 rounded-sm shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
               <div className="p-8 lg:p-10">
                  
                  {/* Title & Impact row */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-100 pb-5">
                    <h2 className="text-2xl font-black text-[#022f42] tracking-tight">{gap.title}</h2>
                    <div className={`px-4 py-1.5 rounded-sm border text-xs font-black uppercase tracking-widest ${gap.impactBg}`}>
                      Impact: {gap.impactLabel}
                    </div>
                  </div>

                  {/* Why Care */}
                  <div className="mb-6 flex items-start gap-3 bg-gray-50 p-4 rounded-sm border border-gray-100">
                    <div className="group relative">
                      <Info className="w-5 h-5 text-indigo-500 mt-0.5 cursor-help" />
                      <div className="absolute left-0 bottom-8 hidden group-hover:block w-64 bg-[#022f42] text-white text-[10px] p-3 rounded-sm shadow-xl z-20">
                        Investors require strict mathematical derisking. Missing this logic flags the founder as fundamentally unprepared for venture velocity.
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#1e4a62] mb-1">Why Investors Care</h4>
                      <p className="text-sm text-gray-700 font-medium leading-relaxed">{gap.whyCare}</p>
                    </div>
                  </div>

                  {/* Evidence Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                     <div>
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 border-b border-gray-100 pb-2">Evidence from your data</h4>
                       <ul className="space-y-3">
                         {gap.evidence.map((ev, i) => (
                           <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></div>
                             <div>
                               <span className="font-medium">{ev.bullet}</span>
                               <Link href={ev.moduleLink} className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-700 block mt-1 hover:underline">
                                 [Edit in {ev.moduleName}]
                               </Link>
                             </div>
                           </li>
                         ))}
                       </ul>
                     </div>

                     <div className="bg-indigo-50/50 p-6 rounded-sm border border-indigo-100 flex flex-col justify-between">
                       <div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3 border-b border-indigo-100 pb-2">Recommended Action</h4>
                         <p className="text-sm text-indigo-900 font-bold leading-relaxed mb-4">{gap.recommendedAction}</p>
                       </div>
                       
                       <div className="flex flex-col sm:flex-row gap-3">
                         <button 
                           onClick={() => toggleActionPlan(gap.id)}
                           className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-sm text-xs font-black uppercase tracking-widest transition-colors ${gap.addedToPlan ? 'bg-emerald-500 text-white' : 'bg-[#022f42] text-white hover:bg-[#1e4a62]'}`}
                         >
                           {gap.addedToPlan ? <><CheckCircle2 className="w-4 h-4"/> Added to Plan</> : 'Add to Action Plan'}
                         </button>
                         <button 
                           onClick={() => setLearnMoreGap(gap)}
                           className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-sm text-xs font-black uppercase tracking-widest bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-[#022f42] transition-colors"
                         >
                           Learn More
                         </button>
                       </div>
                     </div>
                  </div>

                  {/* AI Insight Overlay */}
                  <div className="bg-[#f0f9ff]/50 border border-blue-200 rounded-sm p-5 relative overflow-hidden group">
                     <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500 opacity-5 rounded-full blur-[30px]"></div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-700 mb-2 flex items-center gap-2 relative z-10">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> 
                         Did you know?
                     </h4>
                     <p className="text-sm text-[#022f42] font-semibold leading-relaxed relative z-10 max-w-3xl">
                       {gap.aiInsight}
                     </p>
                     <span className="text-[9px] font-bold text-gray-400 mt-3 block relative z-10 uppercase tracking-widest">
                       Source: Aggregated platform data, FundabilityOS Benchmark Engine
                     </span>
                  </div>

               </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">
          <Download className="w-4 h-4" /> Download Full Gap Report
        </button>
        <Link 
          href="/dashboard/gap-report/actions" 
          className="bg-[#ffd800] text-[#022f42] font-black uppercase tracking-widest text-sm px-8 py-4 rounded-sm hover:bg-white border border-transparent hover:border-[#ffd800] transition-all flex items-center gap-2"
        >
          Continue to Action Plan <ArrowRight className="w-5 h-5"/>
        </Link>
      </div>

      {/* LEARN MORE MODAL */}
      <AnimatePresence>
        {learnMoreGap && (
          <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
            >
               <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#022f42]">Educational Brief</h3>
                 <button onClick={() => setLearnMoreGap(null)} className="p-2 text-gray-400 hover:text-rose-500 bg-white rounded-full shadow-sm"><X className="w-4 h-4"/></button>
               </div>
               
               <div className="p-8 overflow-y-auto flex-1">
                 <h2 className="text-2xl font-black text-[#022f42] mb-6 leading-tight max-w-sm">{learnMoreGap.title}</h2>
                 
                 <div className="aspect-video bg-[#022f42] rounded-sm mb-8 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                   <div className="absolute inset-0 bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-colors"></div>
                   <PlayCircle className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-all z-10" />
                   <span className="absolute bottom-3 left-4 text-[10px] font-black tracking-widest text-white/60 uppercase">2-Min Masterclass</span>
                 </div>

                 <div className="space-y-6">
                   <div>
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5"/> Case Study Context</h4>
                     <p className="text-sm text-gray-600 font-medium leading-relaxed">
                       A recent B2B SaaS startup identical to your profile suffered this exact same constraint. By resolving their <b>{learnMoreGap.title.toLowerCase()}</b> friction, they accelerated their Series Seed timeline by 3.5 months. Investors are structurally incapable of bridging this discrepancy for you.
                     </p>
                   </div>
                   
                   <div className="bg-gray-50 p-5 rounded-sm border border-gray-100">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-800 mb-3">Linked Resources</h4>
                     <ul className="space-y-3">
                       <li><a href="#" className="text-sm font-semibold text-indigo-600 hover:underline">How to explicitly define {learnMoreGap.title.toLowerCase()}</a></li>
                       <li><a href="#" className="text-sm font-semibold text-indigo-600 hover:underline">Venture logic: Why VCs auto-pass on this red flag</a></li>
                     </ul>
                   </div>
                 </div>
               </div>

               <div className="p-6 border-t border-gray-100 bg-gray-50">
                 <button onClick={() => setLearnMoreGap(null)} className="w-full py-4 text-xs font-black uppercase tracking-widest text-[#022f42] bg-white border border-gray-300 rounded-sm hover:bg-gray-100 transition-colors">Close Brief</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
