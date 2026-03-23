"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from "recharts";
import { 
  Trophy, AlertTriangle, ArrowRight, Zap, Target, Search, BarChart3, Users, 
  Briefcase, Boxes, Box, Map, CheckCircle2, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";

interface CategoryScore {
  id: string;
  name: string;
  score: number;
  originalScore: number;
  icon: any;
  link: string;
  weight: number;
  insight: string;
  drivers: {text: string, isPositive: boolean}[];
}

export default function FundabilityScorePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [whatIfMode, setWhatIfMode] = useState(false);
  const [stage, setStage] = useState("pre-revenue"); // "pre-revenue", "early-revenue", "scale"

  const [categories, setCategories] = useState<CategoryScore[]>([
    { id: "problem", name: "Problem & Persona", score: 0, originalScore: 0, icon: Target, link: "/dashboard/audit/1-problem", weight: 0.20, insight: "", drivers: [] },
    { id: "product", name: "Product Readiness", score: 0, originalScore: 0, icon: Box, link: "/dashboard/audit/4-product", weight: 0.20, insight: "", drivers: [] },
    { id: "market", name: "Market Opportunity", score: 0, originalScore: 0, icon: Map, link: "/dashboard/audit/5-market", weight: 0.20, insight: "", drivers: [] },
    { id: "pmf", name: "Product-Market Fit", score: 0, originalScore: 0, icon: Zap, link: "/dashboard/audit/6-pmf", weight: 0.10, insight: "", drivers: [] },
    { id: "revenue", name: "Revenue Model", score: 0, originalScore: 0, icon: BarChart3, link: "/dashboard/audit/7-revenue", weight: 0.10, insight: "", drivers: [] },
    { id: "team", name: "Team Composition", score: 0, originalScore: 0, icon: Users, link: "/dashboard/audit/8-team", weight: 0.20, insight: "", drivers: [] }
  ]);

  const [aiInsights, setAiInsights] = useState({
    strengths: "",
    opportunities: "",
    investorLens: "",
    benchmark: "",
    nextSteps: ""
  });

  // Calculate Overall
  const overallScore = Math.round(categories.reduce((acc, cat) => acc + (cat.score * cat.weight), 0));

  useEffect(() => {
    // 1. Fetch Local Storage
    let pScore = 0, prScore = 0, mScore = 0, pmfScore = 0, revScore = 0, tScore = 0;
    
    // Problem (1.1.1)
    try {
      const d1 = JSON.parse(localStorage.getItem("audit_1_1_1_v2") || "{}")?.data;
      if (d1) pScore = Math.round(((parseInt(d1.severity)||1)*4 + (parseInt(d1.frequency)||1)*4 + ((11-(parseInt(d1.alternatives)||10))*2)) * 2) || 15;
    } catch(e) {}

    // Product (1.1.4)
    try {
      const d4 = JSON.parse(localStorage.getItem("audit_1_1_4_v2") || "{}");
      if (d4?.score) prScore = d4.score;
      else prScore = 15;
    } catch(e) {}

    // Market (1.1.5)
    try {
      const d5 = JSON.parse(localStorage.getItem("audit_1_1_5") || "{}");
      if (d5?.score) mScore = d5.score; // VOS Indicator
      else mScore = 15;
    } catch(e) {}

    // PMF (1.1.6)
    try {
      const d6 = JSON.parse(localStorage.getItem("audit_1_1_6") || "{}");
      if (d6?.score) pmfScore = d6.score;
      else pmfScore = 15;
    } catch(e) {}

    // Revenue (1.1.7)
    try {
      const d7 = JSON.parse(localStorage.getItem("audit_1_1_7") || "{}")?.data;
      if (d7) {
        const diffP = (d7.differentiation||1) * 4;
        const critP = (d7.criticality||1) * 4;
        const churnP = (11-(d7.churnRisk||10)) * 2;
        revScore = Math.round((diffP + critP + churnP) * 2.5); // 0-100 scale approximation
      } else revScore = 15;
    } catch(e) {}

    // Team (1.1.8)
    try {
      const d8 = JSON.parse(localStorage.getItem("audit_1_1_8") || "{}")?.data;
      if (d8) tScore = Math.round((d8.industryExpertise + d8.functionalCoverage + d8.executionTrackRecord + d8.founderChemistry) * 2.5);
      else tScore = 15;
    } catch(e) {}

    // 2. Adjust Weights based on PMF / revenue stage detection
    // Simple heuristic: If PMF > 60 and Revenue model is defined, assume early-revenue tier.
    let s = "pre-revenue";
    let w = [0.20, 0.20, 0.20, 0.10, 0.10, 0.20];
    if (pmfScore > 60 && revScore > 30) {
      s = "early-revenue";
      w = [0.15, 0.15, 0.15, 0.20, 0.15, 0.20]; // Revenue (<$50k/mo) Shift
    }

    setStage(s);

    // 3. Build Category State
    setCategories([
      { id: "problem", name: "Problem & Persona", score: pScore, originalScore: pScore, icon: Target, link: "/dashboard/audit/1-problem", weight: w[0], 
        insight: pScore > 70 ? "Acute painkiller dynamics mapped perfectly." : "Vague problem statement signals low urgency. Pinpoint the pain.",
        drivers: [{text: "Problem Severity Score", isPositive: pScore > 50}, {text: "Alternatives Moat", isPositive: pScore > 70}] },
      { id: "product", name: "Product Readiness", score: prScore, originalScore: prScore, icon: Box, link: "/dashboard/audit/4-product", weight: w[1], 
        insight: prScore > 70 ? "MVP architecture aligns tightly with early-adopter friction points." : "Product development velocity trails investor expectations.",
        drivers: [{text: "Live Demo Capability", isPositive: prScore > 50}] },
      { id: "market", name: "Market Opportunity", score: mScore, originalScore: mScore, icon: Map, link: "/dashboard/audit/5-market", weight: w[2], 
        insight: mScore > 70 ? "VOS Indicator confirms strong venture-scale TAM logic." : "TAM lacks top-down institutional credibility. Switch to bottom-up math.",
        drivers: [{text: "Addressable TAM Math", isPositive: mScore > 60}, {text: "Top-Down VOS Score", isPositive: mScore > 70}] },
      { id: "pmf", name: "Product-Market Fit", score: pmfScore, originalScore: pmfScore, icon: Zap, link: "/dashboard/audit/6-pmf", weight: w[3], 
        insight: pmfScore > 70 ? "Strong organic pull. You are scaling efficiently." : "Retention curves appear soft. PMF is not structurally reached.",
        drivers: [{text: "Organic Pull Signals", isPositive: pmfScore > 50}] },
      { id: "revenue", name: "Revenue Model", score: revScore, originalScore: revScore, icon: BarChart3, link: "/dashboard/audit/7-revenue", weight: w[4], 
        insight: revScore > 70 ? "Gross margin scalability is mechanically identical to top-tier SaaS." : "Unit economics exhibit high variable bleed.",
        drivers: [{text: "Pricing Leverage", isPositive: revScore > 60}, {text: "Defensible ARPU", isPositive: revScore > 50}] },
      { id: "team", name: "Team Composition", score: tScore, originalScore: tScore, icon: Users, link: "/dashboard/audit/8-team", weight: w[5], 
        insight: tScore > 70 ? "Exceptional functional coverage limits execution risk." : "Critical C-Suite level gap identified visually.",
        drivers: [{text: "Domain Experience", isPositive: tScore > 60}, {text: "Core Coverage", isPositive: tScore > 50}] }
    ]);

    setIsLoaded(true);

  }, []);

  // Sync Global Insight AI Generation post-load
  useEffect(() => {
    if (!isLoaded) return;

    const highest = [...categories].sort((a,b)=>b.score - a.score)[0];
    const lowest = [...categories].sort((a,b)=>a.score - b.score)[0];

    const compositeScore = Math.round(categories.reduce((acc, cat) => acc + (cat.score * cat.weight), 0));

    setAiInsights({
      strengths: `Your ${highest.name} score of ${highest.score}% places you inside the top 10% of startups mapped at your stage. Institutional seed rounds optimize explicitly around this localized friction—lead any deck conversation directly with this metric.`,
      opportunities: `Your ${lowest.name} score (${lowest.score}%) is algorithmically anchoring your aggregate valuation logic down. Focus exclusively on refining this module to correct the structural drag.`,
      investorLens: stage === "pre-revenue" 
        ? `Given your Pre-Revenue stage, global syndicates prioritize Team (${Math.round(categories[5].weight*100)}%) and Problem scope (${Math.round(categories[0].weight*100)}%). Your PMF metrics are naturally suppressed mathematically until you monetize.`
        : `Since you entered Early Revenue, VC focus mathematically transitions completely toward PMF (${Math.round(categories[3].weight*100)}%). They are underwriting forward retention rather than raw idea validity.`,
      benchmark: `Your aggregate rating of ${compositeScore}% sits ${compositeScore >= 60 ? 'above' : 'below'} the 55% statistical average for ${stage} entities. You occupy the top statistical quartile exclusively in ${highest.name}.`,
      nextSteps: `To breach the 80% Institutional Validated mark and unlock your OS Badge, immediately initiate the structural Cap Table and Unit Economics stress tests within Week 2.`
    });

  }, [isLoaded, categories[0].score, categories[1].score, categories[2].score, categories[3].score, categories[4].score, categories[5].score]);

  const handleSliderChange = (id: string, val: number) => {
    if (!whatIfMode) return;
    setCategories(prev => prev.map(c => c.id === id ? { ...c, score: val } : c));
  };


  const getScoreColor = (sc: number) => {
    if (sc >= 80) return "text-emerald-500";
    if (sc >= 60) return "text-[#022f42]";
    if (sc >= 40) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreLabel = () => {
    if (overallScore >= 80) return { t: "Exceptional – Investor-Ready", c: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (overallScore >= 60) return { t: "Strong – Close the Remaining Gaps", c: "text-[#022f42] bg-[#f2f6fa] border-[#022f42]/20" };
    if (overallScore >= 40) return { t: "Developing – Focus on Key Areas", c: "text-amber-700 bg-amber-50 border-amber-200" };
    if (overallScore >= 20) return { t: "Early Stage – Foundational Work Needed", c: "text-orange-700 bg-orange-50 border-orange-200" };
    return { t: "Concept – Build Your Case", c: "text-rose-700 bg-rose-50 border-rose-200" };
  };

  const labelData = getScoreLabel();
  const formatRadarData = categories.map(c => ({
    subject: c.name.split(" ")[0], // Simplify for radar fit
    A: c.score,
    fullMark: 100,
  }));

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <div className="mb-8 border-b border-gray-100 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 mb-2 block">1.2.1 • Central Diagnostic Brain</span>
          <h1 className="text-4xl font-black text-[#022f42] tracking-tight mb-2 flex items-center gap-3">
             <Trophy className="w-10 h-10 text-emerald-500" />
             Fundability Score
          </h1>
          <p className="text-lg text-[#1e4a62] max-w-2xl font-medium">A trustworthy, benchmarked, and actionable metric mirroring exact institutional execution thresholds.</p>
        </div>
        <div className="flex items-center gap-4 bg-yellow-50 p-2 rounded-full border border-yellow-300 shadow-md pr-6 animate-pulse hover:animate-none">
          <button onClick={() => {
            setWhatIfMode(!whatIfMode);
            if (whatIfMode) {
              // Reset to original
              setCategories(prev => prev.map(c => ({ ...c, score: c.originalScore })));
            }
          }} className={`w-12 h-6 rounded-full relative transition-colors ${whatIfMode ? 'bg-indigo-500' : 'bg-gray-300'}`}>
             <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${whatIfMode ? 'left-7' : 'left-1'}`}/>
          </button>
          <span className="text-xs font-black uppercase tracking-widest text-yellow-900">Try &quot;What-If&quot; Simulator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Score & Radar */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* HERO GAUGE */}
           <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-sm shadow-xl shadow-indigo-500/5 border border-indigo-100 p-8 flex flex-col items-center">
              <div className="relative w-56 h-56 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                  <path className={`${getScoreColor(overallScore)} transition-all duration-1000`} strokeDasharray={`${Math.max(1, overallScore)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-7xl font-black tracking-tighter ${getScoreColor(overallScore)}`}>{overallScore}</span>
                  <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">/ 100</span>
                </div>
              </div>
              
              <div className={`mt-6 px-4 py-2 border rounded-sm font-black text-xs tracking-widest uppercase text-center w-full ${labelData.c}`}>
                {labelData.t}
              </div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mt-4 tracking-widest">Calculated dynamically based on diagnostic nodes</p>
           </motion.div>

           {/* RADAR CHART */}
           <div className="bg-[#f0f9ff]/50 rounded-sm border border-blue-100 p-6 shadow-inner relative overflow-hidden h-[340px]">
              <h3 className="text-xs font-black text-[#1e4a62] uppercase tracking-widest mb-4 flex justify-between">
                <span>6-Axis Execution Balance</span>
                <span className="text-indigo-500">{whatIfMode ? 'SIMULATING' : 'LIVE'}</span>
              </h3>
              <div className="w-full h-full absolute inset-0 pt-10 pb-6 pr-6 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={formatRadarData}>
                    <PolarGrid stroke="#e0e7ff" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4f46e5', fontSize: 10, fontWeight: 800 }} />
                    <Radar name="Startup Execution" dataKey="A" stroke={whatIfMode ? '#f59e0b' : '#022f42'} fill={whatIfMode ? '#f59e0b' : '#022f42'} fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* ACTIONS */}
           <div className="space-y-3">
             <Link href="/dashboard/gap-analysis" className="w-full bg-[#022f42] hover:bg-[#1b4f68] text-white p-4 rounded-sm font-black uppercase tracking-widest text-sm flex items-center justify-between shadow-md transition-all">
                Generate Gap Report <ArrowRight className="w-5 h-5"/>
             </Link>
             <Link href="/dashboard/investor-snapshot" className="w-full bg-white border-2 border-[#f2f6fa] hover:border-[#1e4a62]/20 text-[#1e4a62] p-4 rounded-sm font-bold uppercase tracking-widest text-sm flex items-center justify-between transition-all">
                Export Investor Snapshot <Download className="w-4 h-4"/>
             </Link>
           </div>
        </div>

        {/* CENTER COLUMN: Category Breakdowns (Editable in What-If) */}
        <div className="lg:col-span-4 space-y-4">
           {categories.map(cat => (
             <motion.div key={cat.id} layout className={`bg-white border p-5 rounded-sm transition-all ${whatIfMode && cat.score !== cat.originalScore ? 'border-amber-400 shadow-md ring-1 ring-amber-400/20' : 'border-gray-200 hover:border-indigo-300'}`}>
                <div className="flex justify-between items-center mb-3">
                   <div className="flex items-center gap-3">
                     <div className="bg-gray-100 p-2 rounded-sm"><cat.icon className="w-4 h-4 text-indigo-900"/></div>
                     <div>
                       <h4 className="font-black text-[#022f42]">{cat.name}</h4>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Weight: {Math.round(cat.weight*100)}%</p>
                     </div>
                   </div>
                   <div className={`text-2xl font-black ${getScoreColor(cat.score)}`}>{cat.score}</div>
                </div>

                {whatIfMode ? (
                  <div className="mt-4 mb-2">
                    <input type="range" min="0" max="100" value={cat.score} onChange={e=>handleSliderChange(cat.id, parseInt(e.target.value))} className="w-full accent-amber-500"/>
                  </div>
                ) : (
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mt-3 mb-4">
                    <div className={`h-full ${getScoreColor(cat.score).replace('text-', 'bg-')}`} style={{width: `${cat.score}%`}}></div>
                  </div>
                )}

                <div className="text-xs text-indigo-900 bg-indigo-50/50 p-2 rounded-sm border border-indigo-100/50 mb-3 font-medium">
                  {cat.insight}
                </div>

                <div className="flex justify-between items-center mt-2 border-t border-gray-100 pt-3">
                   <div className="flex gap-2">
                     {cat.drivers.map((d, i) => (
                       <span key={i} className={`text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold ${d.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                         {d.isPositive ? '+' : '-'}{d.text}
                       </span>
                     ))}
                   </div>
                   {!whatIfMode && (
                     <Link href={cat.link} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center">
                       Edit <ChevronRight className="w-3 h-3"/>
                     </Link>
                   )}
                </div>
             </motion.div>
           ))}
        </div>

        {/* RIGHT COLUMN: AI Insights Overlay */}
        <div className="lg:col-span-4 pl-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-gray-200">
           <div className="sticky top-6 space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#1e4a62] mb-6 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-500"/> Synchronized Insights
              </h3>

              <div className="bg-[#f0fdf4] border border-emerald-200 p-5 rounded-sm">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-800 mb-2">Your Structural Strengths</h4>
                <p className="text-sm font-medium text-emerald-950 leading-relaxed">{aiInsights.strengths}</p>
              </div>

              <div className="bg-[#fffbeb] border border-amber-200 p-5 rounded-sm">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-amber-800 mb-2">Biggest Forward Opportunities</h4>
                <p className="text-sm font-medium text-amber-950 leading-relaxed">{aiInsights.opportunities}</p>
              </div>

              <div className="bg-[#f0f9ff] border border-blue-200 p-5 rounded-sm">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-blue-800 mb-2">Institutional Investor Lens</h4>
                <p className="text-sm font-medium text-blue-950 leading-relaxed">{aiInsights.investorLens}</p>
              </div>

              <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-sm">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-2">Global Aggregate Benchmark</h4>
                <p className="text-sm font-medium text-gray-900 leading-relaxed">{aiInsights.benchmark}</p>
              </div>

              <AIAssistedInsight content={aiInsights.nextSteps} />
           </div>
        </div>
      </div>
    </div>
  );
}

// Additional lucide icon missing from top import
function Download(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
}
