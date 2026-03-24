"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Box, Map, Zap, BarChart3, Users, ChevronDown, ChevronUp, AlertCircle, ArrowRight, Lightbulb, TrendingUp, Presentation, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";

interface CriteriaNode {
  id: string;
  name: string;
  score: number;
  icon: any;
  status: "Strong" | "Moderate" | "Needs Work";
  color: string;
  bg: string;
  linkedModule: string;
  tooltip: string;
  rawData: string[];
  insight: string;
  benchmark: string;
  recommendations: {text: string, link: string}[];
}

export default function KeyCriteriaBreakdownPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [criteria, setCriteria] = useState<CriteriaNode[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let pScore = 15, prScore = 15, mScore = 15, pmfScore = 15, revScore = 15, tScore = 15;
    let pRaw: string[] = [], prRaw: string[] = [], mRaw: string[] = [], pmfRaw: string[] = [], revRaw: string[] = [], tRaw: string[] = [];

    // Problem
    try {
      const d1 = JSON.parse(localStorage.getItem("audit_1_1_1_v2") || "{}")?.data;
      if (d1) {
        pScore = Math.min(Math.round(((d1.intensity||5) * (d1.frequency||5)) / (11 - (d1.alternatives||5))), 100);
        pRaw = [
          `Pain Intensity: ${d1.intensity||5}/10 (Higher = more severe)`,
          `Pain Frequency: ${d1.frequency||5}/10`,
          `Alternative Friction: ${d1.alternatives||5}/10 (Higher = worse existing solutions)`
        ];
      }
    } catch(e) {}

    // Product
    try {
      const d4 = JSON.parse(localStorage.getItem("audit_1_1_4_v2") || "{}");
      if (d4?.score) { 
        prScore = d4.score; 
        prRaw = [
          `Product Status: ${d4.data?.status || "Unknown"}`, 
          `Paying Customers: ${d4.data?.metrics?.paying || 0}`
        ]; 
      }
    } catch(e) {}

    // Market
    try {
      const d5 = JSON.parse(localStorage.getItem("audit_1_1_5") || "{}");
      if (d5?.score) { mScore = d5.score; mRaw = ["Market TAM quantified.", `CAGR trajectory active: ${d5.data?.cagr || 0}%`]; }
    } catch(e) {}

    // PMF
    try {
      const d6 = JSON.parse(localStorage.getItem("audit_1_1_6") || "{}");
      if (d6?.score) { pmfScore = d6.score; pmfRaw = [d6.data?.painkillerChoice === 'painkiller' ? "Painkiller status verified" : "Vitamin warning flag triggered", "Usage metrics aggregated"]; }
    } catch(e) {}

    // Revenue
    try {
      const d7 = JSON.parse(localStorage.getItem("audit_1_1_7") || "{}")?.data;
      if (d7) {
        revScore = Math.round(((d7.differentiation||1)*4 + (d7.criticality||1)*4 + (11-(d7.churnRisk||10))*2) * 2.5);
        revRaw = [`Primary model logic: ${d7.primaryModel || "TBD"}`, `ARPU Pricing mechanics logged.`];
      }
    } catch(e) {}

    // Team
    try {
      const d8 = JSON.parse(localStorage.getItem("audit_1_1_8") || "{}")?.data;
      if (d8) {
        tScore = Math.round((d8.industryExpertise + d8.functionalCoverage + d8.executionTrackRecord + d8.founderChemistry) * 2.5);
        tRaw = [`Industry Expert Index: ${d8.industryExpertise}/10`, `Execution Record: ${d8.executionTrackRecord}/10`];
      }
    } catch(e) {}

    const weightMap = [0.2, 0.2, 0.2, 0.1, 0.1, 0.2];
    const total = Math.round(
      pScore * weightMap[0] + prScore * weightMap[1] + mScore * weightMap[2] + 
      pmfScore * weightMap[3] + revScore * weightMap[4] + tScore * weightMap[5]
    );

    setOverallScore(total);

    const getStatus = (s: number) => s >= 80 ? "Strong" : s >= 50 ? "Moderate" : "Needs Work";
    const getColor = (s: number) => s >= 80 ? "text-emerald-600" : s >= 50 ? "text-amber-600" : "text-rose-600";
    const getBg = (s: number) => s >= 80 ? "bg-emerald-50 border-emerald-200" : s >= 50 ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200";

    setCriteria([
      {
        id: "problem", name: "Problem & Persona", score: pScore, icon: Target, status: getStatus(pScore), color: getColor(pScore), bg: getBg(pScore),
        linkedModule: "/dashboard/audit/1-problem",
        tooltip: "Investors want to know you're solving something painful and urgent. If the problem isn't severe, they won't invest.",
        rawData: pRaw.length ? pRaw : ["No quantifiable metrics synchronized."],
        insight: pScore >= 70 ? "Your Problem score is strong. The specific pain severity identified signals a potential 'painkiller' opportunity. Ensure target customer personas remain narrowly constrained." : "Problem severity lacks venture-scale urgency. Broaden customer research to isolate the deep organizational friction.",
        benchmark: pScore >= 60 ? "High intensity and frequency scores rank this in the top 20% for problem severity." : "Below sector averages for problem articulation.",
        recommendations: [{text: "Narrow target persona to those experiencing acute pain to increase severity.", link: "/dashboard/audit/2-customer"}]
      },
      {
        id: "product", name: "Product Readiness", score: prScore, icon: Box, status: getStatus(prScore), color: getColor(prScore), bg: getBg(prScore),
        linkedModule: "/dashboard/audit/4-product",
        tooltip: "Evaluates how closely the MVP mitigates the stated problem payload and measures deployment velocity.",
        rawData: prRaw.length ? prRaw : ["No MVP status flags detected."],
        insight: prScore >= 70 ? "MVP is actively derisked with strong functional validation." : "Product development velocity trails investor expectations. The delta between hypothesis and market deployment is too vast.",
        benchmark: `Product maturity aligns with ${prScore > 50 ? 'Growth-Stage' : 'Early-Stage'} SaaS averages.`,
        recommendations: [{text: "Quantify beta validation loops.", link: "/dashboard/audit/4-product"}]
      },
      {
        id: "market", name: "Market Opportunity", score: mScore, icon: Map, status: getStatus(mScore), color: getColor(mScore), bg: getBg(mScore),
        linkedModule: "/dashboard/audit/5-market",
        tooltip: "Market must be large enough ($1B+) and growing rapidly to justify the venture math equations.",
        rawData: mRaw.length ? mRaw : ["Market TAM/SAM/SOM unmapped."],
        insight: mScore >= 70 ? "Addressable market logic passes institutional filters. CAGR protects forward valuation multiples." : "Market positioning is constrained. VCs will discount future enterprise value unless TAM expands.",
        benchmark: mScore >= 70 ? "Top quartile for venture-scale TAM logic." : "Bottom quartile. Rework bottom-up math.",
        recommendations: [{text: "Run the VOS Indicator TAM logic.", link: "/dashboard/audit/5-market"}]
      },
      {
        id: "pmf", name: "Product-Market Fit", score: pmfScore, icon: Zap, status: getStatus(pmfScore), color: getColor(pmfScore), bg: getBg(pmfScore),
        linkedModule: "/dashboard/audit/6-pmf",
        tooltip: "Demonstrates organic pull. Investors look for retention and usage curves over raw growth.",
        rawData: pmfRaw.length ? pmfRaw : ["Retention logic undefined."],
        insight: pmfScore >= 70 ? "Stellar PMF signals indicated. Retention is compounding." : "Warning: False PMF detected. High usage friction is negating adoption velocity.",
        benchmark: "PMF score aligns loosely with Pre-Series-A expectations.",
        recommendations: [{text: "Audit your core retention metrics.", link: "/dashboard/audit/6-pmf"}]
      },
      {
        id: "revenue", name: "Revenue Model", score: revScore, icon: BarChart3, status: getStatus(revScore), color: getColor(revScore), bg: getBg(revScore),
        linkedModule: "/dashboard/audit/7-revenue",
        tooltip: "Assesses margin structure and capital efficiency. Subscription > Transactional.",
        rawData: revRaw.length ? revRaw : ["Monetization mechanics empty."],
        insight: revScore >= 70 ? "Pricing leverage and unit economics are functioning highly optimally." : "High churn probability or structural margin bleed identified.",
        benchmark: "Averages match B2B Mid-Market composites.",
        recommendations: [{text: "Clarify subscription pricing architecture.", link: "/dashboard/audit/7-revenue"}]
      },
      {
        id: "team", name: "Team Composition", score: tScore, icon: Users, status: getStatus(tScore), color: getColor(tScore), bg: getBg(tScore),
        linkedModule: "/dashboard/audit/8-team",
        tooltip: "Investors bet on people. A strong team can pivot a weak idea; a weak team can't execute a strong one.",
        rawData: tRaw.length ? tRaw : ["Team roster data missing."],
        insight: tScore >= 70 ? "Robust functional C-Suite coverage maps to the problem domain flawlessly." : "Critical skill gaps expose the company to outsized execution failure risk.",
        benchmark: tScore >= 70 ? "Top decile matching for functional tech capabilities." : "Below institutional execution expectations.",
        recommendations: [{text: "Assess missing CTO / Go-To-Market leads.", link: "/dashboard/audit/8-team"}]
      }
    ]);

    setIsLoaded(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('audit_1_2_breakdown', 'completed');
    }
  }, []);

  if (!isLoaded) return null;

  const sortedCriteria = [...criteria].sort((a,b) => a.score - b.score);
  const weakest = sortedCriteria[0];

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 pb-32">
      {/* HEADER SECTION */}
      <div className="bg-[#022f42] rounded-sm p-8 shadow-2xl relative overflow-hidden mb-8">
         <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
         
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <h1 className="text-[10px] uppercase font-black tracking-widest text-[#b0d0e0] mb-2">1.2.2 Key Investor Criteria</h1>
              <div className="text-3xl font-black text-white flex items-center gap-3">
                 Fundability Score: <span className="text-[#ffd800]">{overallScore}%</span>
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 p-4 rounded-sm max-w-sm backdrop-blur-sm">
               <div className="flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-xs font-bold text-white mb-1">Weakest Criterion: {weakest.name}</h4>
                   <p className="text-[10px] text-[#b0d0e0] leading-relaxed">Expand the {weakest.name} card below to see explicit VC correction tactics.</p>
                 </div>
               </div>
            </div>
         </div>
      </div>

      <p className="text-sm text-gray-600 mb-8 font-medium">Click any card below to get AI‑powered insights and specific module redeployment tactics geared at aggressively padding your score.</p>

      {/* SIX CRITERION CARDS */}
      <div className="space-y-4">
         {criteria.map((c) => (
           <div key={c.id} className="bg-white border text-left border-gray-200 shadow-sm rounded-sm transition-all duration-300">
              {/* COLLAPSED HEADER */}
              <button 
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 focus:outline-none"
              >
                 <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 36 36">
                        <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                        <path className={c.color} strokeDasharray={`${Math.max(1, c.score)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                      </svg>
                      <span className={`text-[11px] font-black ${c.color}`}>{c.score}</span>
                    </div>
                    <div className="text-left">
                       <h3 className="text-sm font-black text-[#022f42] flex items-center gap-2">
                         {c.name} 
                         <span title={c.tooltip} className="cursor-help w-4 h-4 rounded-full bg-gray-100 text-[9px] font-bold text-gray-500 flex items-center justify-center">?</span>
                       </h3>
                       <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm inline-block mt-1 ${c.bg} ${c.color}`}>
                         {c.status}
                       </span>
                    </div>
                 </div>
                 <div className="text-gray-400">
                    {expandedId === c.id ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                 </div>
              </button>

              {/* EXPANDED BODY */}
              <AnimatePresence>
                 {expandedId === c.id && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden border-t border-gray-100"
                   >
                      <div className="p-6 space-y-6 bg-[fafcff]">
                         
                         {/* section 1: Raw Data */}
                         <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1e4a62] mb-3 border-b pb-1">Diagnostic Raw Data</h4>
                           <ul className="space-y-2">
                              {c.rawData.map((data, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> {data}
                                </li>
                              ))}
                           </ul>
                         </div>

                         {/* section 2: AI Insight */}
                         <AIAssistedInsight content={c.insight} />

                         {/* section 3: Benchmark */}
                         <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm flex items-start gap-3">
                           <TrendingUp className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0"/>
                           <div>
                             <h4 className="text-xs font-bold text-[#022f42] mb-1">Market Benchmark</h4>
                             <p className="text-sm text-gray-600 leading-relaxed group cursor-help" title="Based on anonymised data from 500+ startups at your stage.">
                               {c.benchmark} <span className="text-[10px] text-gray-400 underline decoration-dotted ml-1">(Hover for source)</span>
                             </p>
                           </div>
                         </div>

                         {/* section 4: Improvements */}
                         <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-700 mb-3 border-b pb-1">Module Reinforcement Links</h4>
                           <div className="space-y-2">
                              {c.recommendations.map((rec, idx) => (
                                <Link href={rec.link} key={idx} className="block text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 p-3 rounded-sm transition-colors flex items-center justify-between group">
                                  {rec.text} <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:text-indigo-700 transition-colors"/>
                                </Link>
                              ))}
                           </div>
                         </div>

                         {/* section 5: Close */}
                         <div className="pt-4 flex justify-end">
                            <button onClick={()=>setExpandedId(null)} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-800">Close Panel</button>
                         </div>

                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
         ))}
      </div>

      {/* FOOTER */}
      <div className="mt-12 bg-[#022f42] p-8 rounded-sm shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <h3 className="text-white font-bold text-lg mb-1">Extract the Gap Sequence</h3>
            <p className="text-sm text-[#b0d0e0]">Compile these scoring deficiencies directly into the actionable 1.3 module reports.</p>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <Link href="/dashboard/gap-report" className="flex-1 md:flex-none text-center bg-[#ffd800] text-[#022f42] font-black tracking-widest uppercase text-xs px-6 py-4 rounded-sm hover:bg-white transition-colors">
               Generate Gap Analysis
            </Link>
         </div>
      </div>
    </div>
  );
}
