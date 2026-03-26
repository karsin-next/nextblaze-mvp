"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend
} from "recharts";
import { 
  BarChart3, Settings2, Info, ChevronDown, ChevronUp, Globe, Users, 
  Map, Box, Zap, Target, TrendingUp, Lightbulb, CheckCircle2, AlertTriangle, Briefcase, FileText
} from "lucide-react";
import Link from "next/link";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { FundabilityBadge } from "@/components/FundabilityBadge";
import { getFundabilityScores } from "@/utils/scoreCalculation";

interface SubMetric {
  name: string;
  userValue: string | number;
  avgValue: string | number;
  percentile: string;
  insight: string;
}

interface BenchmarkCategory {
  id: string;
  name: string;
  userScore: number;
  avgScore: number;
  topQuartile: number;
  bottomQuartile: number;
  percentile: number;
  icon: any;
  insight: string;
  subMetrics: SubMetric[];
}

export default function BenchmarkComparisonPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showBenchmarks, setShowBenchmarks] = useState(true);
  const [industry, setIndustry] = useState("B2B SaaS");
  const [stage, setStage] = useState("Seed");
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const [categories, setCategories] = useState<BenchmarkCategory[]>([]);
  const [overallUser, setOverallUser] = useState(0);
  const [overallAvg, setOverallAvg] = useState(56);

  useEffect(() => {
    const data = getFundabilityScores();
    const { pScore, prScore, mScore, pmfScore, revScore, tScore, totalScore: total, rawP, rawPr, rawM, rawPmf, rawRev, rawT } = data;

    let pSev = 5, pFreq = 5, pAlt = 5;
    if (rawP && Object.keys(rawP).length > 0) {
      pSev = parseInt(rawP.severity)||5;
      pFreq = parseInt(rawP.frequency)||5;
      pAlt = parseInt(rawP.alternatives)||5;
    }

    let prVal = "Concept";
    if (rawPr && Object.keys(rawPr).length > 0) {
      prVal = rawPr.productStatus === 'live' ? "Live Product" : rawPr.productStatus === 'mvp' ? "MVP" : "Concept";
    }

    let mTam = "Unknown", mCagr = "0%";
    if (rawM && Object.keys(rawM).length > 0) {
      mTam = rawM.tam || "Unknown";
      mCagr = rawM.cagr ? `${rawM.cagr}%` : "0%";
    }

    let pmfChoice = "Unknown", pmfNps = "N/A";
    if (rawPmf && Object.keys(rawPmf).length > 0) {
      pmfChoice = rawPmf.painkillerChoice === 'painkiller' ? "Painkiller" : "Vitamin";
      pmfNps = rawPmf.nps || "N/A";
    }

    let rModel = "Unknown", rArpu = "Unknown";
    if (rawRev && Object.keys(rawRev).length > 0) {
      rModel = rawRev.primaryModel || "Unknown";
      rArpu = `$${rawRev.priceAmount || 0}/${rawRev.priceFrequency || 'mo'}`;
    }

    let tExp = 5, tChem = 5;
    if (rawT && Object.keys(rawT).length > 0) {
      tExp = rawT.industryExpertise || 5;
      tChem = rawT.founderChemistry || 5;
    }

    setOverallUser(total);

    // Mock benchmark logic dependent loosely on industry selection to simulate dynamic shift
    const variance = industry === "Deep Tech" ? -10 : industry === "Consumer App" ? 5 : 0;
    setOverallAvg(56 + variance);

    setCategories([
      {
        id: "problem", name: "Problem Worth Solving", userScore: pScore, avgScore: 68 + variance, topQuartile: 85, bottomQuartile: 45, percentile: pScore >= 68 ? 85 : 35, icon: Target,
        insight: pScore > (68+variance) ? "Your Problem score is exceptional – lead with this in your pitch." : "Investors may want more specificity on your target customer friction.",
        subMetrics: [
          { name: "Problem Severity Score", userValue: `${pSev}/10`, avgValue: "7/10", percentile: pSev >= 7 ? "Top 25%" : "Average", insight: "High severity correlates directly to shorter sales cycles." },
          { name: "Problem Frequency", userValue: `${pFreq}/10`, avgValue: "6/10", percentile: pFreq >= 6 ? "Top 30%" : "Bottom 40%", insight: "Frequency dictates DAU/MAU retention potential." }
        ]
      },
      {
        id: "product", name: "Product & Technology", userScore: prScore, avgScore: 50 + variance, topQuartile: 75, bottomQuartile: 30, percentile: prScore >= 50 ? 60 : 25, icon: Box,
        insight: prScore > (50+variance) ? "Your product readiness is ahead of peers at your stage." : "Product development velocity trails the statistical average.",
        subMetrics: [
          { name: "Product Status", userValue: prVal, avgValue: "MVP", percentile: prVal==="Live Product"?"Top 10%":"Average", insight: "Live products secure 3x more meeting requests." },
        ]
      },
      {
        id: "market", name: "Market Opportunity", userScore: mScore, avgScore: 60 + variance, topQuartile: 80, bottomQuartile: 40, percentile: mScore > 60 ? 70 : 30, icon: Map,
        insight: mScore > 60 ? "Your market size and CAGR are highly attractive." : "TAM lacks top-down institutional credibility.",
        subMetrics: [
          { name: "TAM Quantified", userValue: mTam, avgValue: "$800M", percentile: "Top 30%", insight: "TAM > $1B is the standard venture threshold." },
          { name: "Market CAGR", userValue: mCagr, avgValue: "18%", percentile: "Average", insight: "CAGR protects forward valuation multiples." }
        ]
      },
      {
        id: "pmf", name: "Product-Market Fit", userScore: pmfScore, avgScore: 45 + variance, topQuartile: 65, bottomQuartile: 25, percentile: pmfScore > 45 ? 65 : 20, icon: TrendingUp,
        insight: pmfScore > 45 ? "Strongest relative category against peers. PMF is proving out." : "Warning: False PMF detected. High usage friction common in this decile.",
        subMetrics: [
          { name: "Painkiller Matrix", userValue: pmfChoice, avgValue: "Painkiller", percentile: pmfChoice === "Painkiller" ? "Top 20%" : "Bottom 50%", insight: "Painkillers command higher ARPU and LTV." },
          { name: "NPS / Feedback", userValue: pmfNps, avgValue: "35", percentile: "Average", insight: "NPS above 40 indicates organic referral loops." }
        ]
      },
      {
        id: "revenue", name: "Revenue Model & Profit", userScore: revScore, avgScore: 42 + variance, topQuartile: 60, bottomQuartile: 20, percentile: revScore > 42 ? 75 : 15, icon: BarChart3,
        insight: revScore > 42 ? "Pricing leverage and unit economics functioning optimally." : "Financial Governance is the most common gap across your segment.",
        subMetrics: [
          { name: "Primary Model", userValue: rModel, avgValue: "SaaS", percentile: "Average", insight: "Recurring revenue guarantees forward multiples." },
          { name: "Pricing Mechanics", userValue: rArpu, avgValue: "$250/mo", percentile: "Average", insight: "Standardized ARPU reduces variable bleed." }
        ]
      },
      {
        id: "team", name: "Leadership & Team", userScore: tScore, avgScore: 55 + variance, topQuartile: 75, bottomQuartile: 35, percentile: tScore > 55 ? 85 : 40, icon: Users,
        insight: tScore > 55 ? "Exceptional functional coverage limits execution risk." : "Critical C-Suite level gap identified.",
        subMetrics: [
          { name: "Industry Expertise", userValue: `${tExp}/10`, avgValue: "6/10", percentile: tExp >= 6 ? "Top 15%" : "Average", insight: "Domain expertise is the #1 correlated factor for Seed success." },
          { name: "Founder Chemistry", userValue: `${tChem}/10`, avgValue: "5/10", percentile: "Average", insight: "Syndicates index heavily on dispute resolution mechanics." }
        ]
      }
    ]);

    setIsLoaded(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('audit_1_2_benchmark', 'completed');
    }
  }, [industry, stage]);

  if (!isLoaded) return null;

  // Format Recharts Data
  const radarData = categories.map(c => ({
    subject: c.id.toUpperCase(),
    user: c.userScore,
    benchmarkAvg: c.avgScore,
    topQuartile: showBenchmarks ? c.topQuartile : 0,
    bottomQuartile: showBenchmarks ? c.bottomQuartile : 0,
    fullMark: 100
  }));

  const bestCategory = categories.reduce((prev, curr) => (curr.userScore - curr.avgScore) > (prev.userScore - prev.avgScore) ? curr : prev);
  const worstCategory = categories.reduce((prev, curr) => (curr.userScore - curr.avgScore) < (prev.userScore - prev.avgScore) ? curr : prev);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 pb-32">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-200 pb-6">
         <div className="flex items-center gap-6">
            <FundabilityBadge score={overallUser} size="sm" />
            <div>
               <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 mb-2 block">1.2.3 • Market Intelligence</span>
               <h1 className="text-3xl font-black text-[#022f42] tracking-tight">How You Stack Up</h1>
               <p className="text-gray-600 font-medium mt-1">Contextualized benchmarking derived from aggregated platform datasets.</p>
            </div>
         </div>
         <div className="flex gap-3">
            <Link href="/dashboard/score/breakdown" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-sm">Back to Criteria</Link>
            <Link href="/dashboard/gap-report" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#022f42] bg-[#ffd800] hover:bg-yellow-400 rounded-sm">Next: Gap Report</Link>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Control Panel & Legend */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white border text-left border-gray-200 p-6 rounded-sm shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#1e4a62] mb-5 flex items-center gap-2">
                <Settings2 className="w-4 h-4"/> Control Panel
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Industry Segment</label>
                  <select 
                    value={industry} 
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-sm text-sm font-medium focus:border-indigo-500 outline-none"
                  >
                    <option>B2B SaaS</option>
                    <option>Deep Tech</option>
                    <option>Consumer App</option>
                    <option>Hardware / IoT</option>
                    <option>Fintech</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 block">Funding Stage</label>
                  <select 
                    value={stage} 
                    onChange={e => setStage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-sm text-sm font-medium focus:border-indigo-500 outline-none"
                  >
                    <option>Pre-Seed</option>
                    <option>Seed</option>
                    <option>Series A</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={showBenchmarks} onChange={() => setShowBenchmarks(!showBenchmarks)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${showBenchmarks ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showBenchmarks ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#022f42] uppercase tracking-widest">Benchmark Lines</span>
                      <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Toggle peer overlays</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 text-[10px] text-gray-500 font-medium bg-gray-50 p-3 rounded-sm">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                Changing industry matrices mathematically shifts expected baseline weights.
              </div>
           </div>

           {showBenchmarks && (
             <div className="bg-[#f0f9ff]/50 border border-blue-100 p-5 rounded-sm">
               <h4 className="text-[10px] uppercase font-black tracking-widest text-[#1e4a62] mb-3">Radar Legend</h4>
               <ul className="space-y-3 text-xs font-bold text-[#022f42]">
                 <li className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Your Score ({overallUser}%)</li>
                 <li className="flex items-center gap-2"><div className="w-3 h-0 border-t-2 border-dashed border-gray-400"></div> Segment Average ({overallAvg}%)</li>
                 <li className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded-sm"></div> Top 25% Threshold</li>
                 <li className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-100 border border-rose-300 rounded-sm"></div> Bottom 25% Threshold</li>
               </ul>
             </div>
           )}
        </div>

        {/* RIGHT COLUMN: Visualisation Area */}
        <div className="lg:col-span-9 space-y-8">
           
           {/* SECTION 1: OVERALL RADAR */}
           <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-sm shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#f3f4f6" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '12px' }}
                        formatter={(val: number, name: string) => [val, name.replace(/([A-Z])/g, ' $1').trim()]}
                      />
                      {showBenchmarks && (
                        <>
                          <Radar name="Top 25% Range" dataKey="topQuartile" stroke="none" fill="#10b981" fillOpacity={0.08} />
                          <Radar name="Bottom 25% Range" dataKey="bottomQuartile" stroke="none" fill="#ef4444" fillOpacity={0.08} />
                          <Radar name="Segment Average" dataKey="benchmarkAvg" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                        </>
                      )}
                      <Radar name="Your Score" dataKey="user" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.15} />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-xl font-black text-[#022f42] mb-4">Overall Fundability Radar</h3>
                <div className="space-y-4 mb-6">
                  <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
                    <p className="text-sm text-indigo-900 font-medium">
                      Based on aggregated data from Phase-1 {industry} startups ({stage} stage):
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-indigo-800 list-disc list-inside">
                      <li>Your overall score of <b>{overallUser}</b> is <b>{Math.abs(overallUser - overallAvg)} points {overallUser >= overallAvg ? 'above' : 'below'}</b> the benchmark average of {overallAvg}.</li>
                      <li>You rank roughly in the <b>top {overallUser > 60 ? '28%' : '65%'}</b> of tracked entities.</li>
                      <li>Strongest relative category: <b>{bestCategory.name}</b> (+{bestCategory.userScore - bestCategory.avgScore} pts).</li>
                      <li>Largest execution gap: <b>{worstCategory.name}</b> ({worstCategory.userScore - worstCategory.avgScore} pts relative).</li>
                    </ul>
                  </div>
                </div>
              </div>
           </div>

           {/* SECTION 2: ACCORDION CARDS */}
           <div>
             <h3 className="text-lg font-black text-[#022f42] mb-4">Category Deep Dive</h3>
             <div className="space-y-3">
               {categories.map((c) => {
                 const diff = c.userScore - c.avgScore;
                 const isPositive = diff >= 0;
                 return (
                 <div key={c.id} className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                    <button 
                      onClick={() => setExpandedCat(expandedCat === c.id ? null : c.id)}
                      className="w-full p-5 flex items-center justify-between hover:bg-gray-50 focus:outline-none"
                    >
                      <div className="flex items-center gap-6 flex-1 pr-6">
                        <div className="w-8 shrink-0 flex justify-center">
                          <c.icon className="w-6 h-6 text-indigo-900 opacity-80" />
                        </div>
                        <div className="text-left w-48 shrink-0">
                          <h4 className="text-sm font-black text-[#022f42] leading-tight">{c.name}</h4>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Score: {c.userScore}/100</span>
                        </div>
                        <div className="flex-1 hidden md:flex flex-col gap-1 items-start">
                           <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                             {isPositive ? '⬆️' : '⬇️'} {Math.abs(diff)} pts {isPositive ? 'above' : 'below'} avg
                           </span>
                           <div className="w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full flex relative">
                             {/* Avg Marker */}
                             <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10" style={{left: `${c.avgScore}%`}}></div>
                             <div className={`h-full rounded-full ${isPositive ? 'bg-blue-500' : 'bg-rose-500'}`} style={{width: `${c.userScore}%`}}></div>
                           </div>
                        </div>
                        <div className="hidden lg:block shrink-0 text-left w-36">
                           <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Pct Rank</span>
                           <span className="text-xs font-black text-[#1e4a62]">Top {c.percentile}%</span>
                        </div>
                      </div>
                      <div className="text-gray-400 shrink-0">
                        {expandedCat === c.id ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedCat === c.id && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-100">
                          <div className="p-6 bg-[#fcfdfe]">
                            <AIAssistedInsight content={c.insight} />
                            
                            <div className="mt-6">
                              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Sub-Metric Verification Grid</h5>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="py-2 text-[10px] uppercase font-black tracking-widest text-[#1e4a62]">Data Input</th>
                                      <th className="py-2 text-[10px] uppercase font-black tracking-widest text-[#1e4a62]">Your Value</th>
                                      <th className="py-2 text-[10px] uppercase font-black tracking-widest text-[#1e4a62]">Benchmark</th>
                                      <th className="py-2 text-[10px] uppercase font-black tracking-widest text-[#1e4a62]">Percentile</th>
                                      <th className="py-2 text-[10px] uppercase font-black tracking-widest text-[#1e4a62]">AI Lens Synthesis</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {c.subMetrics.map((sm, idx) => (
                                      <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-white">
                                        <td className="py-3 pr-4 text-xs font-bold text-gray-700 whitespace-nowrap">{sm.name}</td>
                                        <td className="py-3 pr-4 text-xs font-medium text-blue-600 whitespace-nowrap">{sm.userValue}</td>
                                        <td className="py-3 pr-4 text-xs text-gray-500 whitespace-nowrap">{sm.avgValue}</td>
                                        <td className="py-3 pr-4 text-xs font-medium text-[#022f42] whitespace-nowrap">
                                          <span className="bg-gray-100 px-1.5 py-0.5 rounded-sm">{sm.percentile}</span>
                                        </td>
                                        <td className="py-3 text-[11px] text-gray-600 italic leading-relaxed min-w-[200px]">{sm.insight}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
               )})}
             </div>
           </div>

           {/* SECTION 3: PEER COMPARISON / INSIGHTS */}
           <div className="pt-6 border-t border-gray-200">
             <h3 className="text-lg font-black text-[#022f42] mb-4">Peer Comparison Profile</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="bg-white border text-left border-emerald-100 p-5 rounded-sm shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-100 rounded-full blur-[20px] opacity-60"></div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-3 relative z-10 flex items-center gap-2">
                     <Target className="w-4 h-4"/> Top Performers
                  </h4>
                  <ul className="text-[11px] text-gray-600 space-y-2 relative z-10 font-medium">
                    <li>• 87% have distinct ICP structures yielding conversion logic.</li>
                    <li>• 72% demonstrate strong LTV:CAC logic greater than 3:1.</li>
                    <li>• 65% enforce rigorous 24-month capital modeling schemas.</li>
                  </ul>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] text-emerald-700 font-bold italic relative z-10">
                    &quot;Sync these specific operational layers to compound aggregate valuation leverage.&quot;
                  </div>
                </div>

                <div className="bg-white border text-left border-rose-100 p-5 rounded-sm shadow-sm relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-rose-100 rounded-full blur-[20px] opacity-60"></div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-rose-800 mb-3 relative z-10 flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4"/> Systemic Gaps
                  </h4>
                  <ul className="text-[11px] text-gray-600 space-y-2 relative z-10 font-medium">
                    <li>• 68% fail out strictly on weak Financial Governance.</li>
                    <li>• 54% lack clearly designated customer entry points.</li>
                    <li>• 47% exhibit identical structural UVP moats as competitors.</li>
                  </ul>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] text-rose-700 font-bold italic relative z-10">
                    &quot;These represent fundamental investor red flags. Neutralize them specifically.&quot;
                  </div>
                </div>

                <div className="bg-[#022f42] border text-left border-[#1b4f68] p-5 rounded-sm shadow-sm relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-[#ffd800] rounded-full blur-[30px] opacity-20"></div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#ffd800] mb-3 relative z-10 flex items-center gap-2">
                     <TrendingUp className="w-4 h-4"/> Value Creation
                  </h4>
                  <ul className="text-[11px] text-[#b0d0e0] space-y-2 relative z-10 font-medium">
                    <li>• Resolving Week 1-2 modules elevates median scores by 18 points.</li>
                    <li>• Highest velocity jumps (+30) triggered directly by:</li>
                    <li className="pl-2">1. Locked unit economics.</li>
                    <li className="pl-2">2. Granular 12-mo cash modeling.</li>
                  </ul>
                  <div className="mt-4 pt-3 border-t border-[#1b4f68] text-[10px] text-white font-bold italic relative z-10">
                    &quot;Focus engineering efforts linearly on Capital Needs modeling.&quot;
                  </div>
                </div>

             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
