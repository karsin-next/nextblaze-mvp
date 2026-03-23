"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, ReferenceArea, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Cell
} from "recharts";
import { 
  Calendar, TrendingUp, LineChart as LineChartIcon, Map, Target, ShieldCheck, 
  ChevronDown, History, Sparkles, AlertCircle, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";

export default function ScoreHistoryPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentCategories, setCurrentCategories] = useState<{name:string, score:number}[]>([]);
  
  const [historySnapshot, setHistorySnapshot] = useState("Mod 1.2.1");
  const [showAvgTrajectory, setShowAvgTrajectory] = useState(false);

  useEffect(() => {
    // Calculate current live score
    let pScore = 15, prScore = 15, mScore = 15, pmfScore = 15, revScore = 15, tScore = 15;
    try { const d1 = JSON.parse(localStorage.getItem("audit_1_1_1") || localStorage.getItem("audit_1_1_1_v2") || "{}")?.data; if (d1) pScore = Math.round(((parseInt(d1.severity)||1)*4 + (parseInt(d1.frequency)||1)*4 + ((11-(parseInt(d1.alternatives)||10))*2)) * 2); } catch(e) {}
    try { const d4 = JSON.parse(localStorage.getItem("audit_1_1_4") || "{}"); if (d4?.score) prScore = d4.score; } catch(e) {}
    try { const d5 = JSON.parse(localStorage.getItem("audit_1_1_5") || "{}"); if (d5?.score) mScore = d5.score; } catch(e) {}
    try { const d6 = JSON.parse(localStorage.getItem("audit_1_1_6") || "{}"); if (d6?.score) pmfScore = d6.score; } catch(e) {}
    try { const d7 = JSON.parse(localStorage.getItem("audit_1_1_7") || "{}")?.data; if (d7) revScore = Math.round(((d7.differentiation||1)*4 + (d7.criticality||1)*4 + (11-(d7.churnRisk||10))*2) * 2.5); } catch(e) {}
    try { const d8 = JSON.parse(localStorage.getItem("audit_1_1_8") || "{}")?.data; if (d8) tScore = Math.round((d8.industryExpertise + d8.functionalCoverage + d8.executionTrackRecord + d8.founderChemistry) * 2.5); } catch(e) {}

    const total = Math.round(pScore*0.2 + prScore*0.2 + mScore*0.2 + pmfScore*0.1 + revScore*0.1 + tScore*0.2);
    setCurrentScore(total);
    setCurrentCategories([
      { name: "Problem", score: pScore },
      { name: "Product", score: prScore },
      { name: "Market", score: mScore },
      { name: "PMF", score: pmfScore },
      { name: "Revenue", score: revScore },
      { name: "Team", score: tScore }
    ]);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  // Mocked Timeline History anchored to Current Score
  const timelineData = [
    { week: "Mod 1.1.1", score: Math.max(12, currentScore - 42), event: "Started FundabilityOS. Initial Audit triggered.", avg: 30, top: 40 },
    { week: "Mod 1.1.2", score: Math.max(22, currentScore - 30), event: "+10% – Clarified Problem Severity logic.", avg: 34, top: 48 },
    { week: "Mod 1.1.3", score: Math.max(38, currentScore - 20), event: "+16% – TAM calculated & Founding Team verified.", avg: 38, top: 55 },
    { week: "Mod 1.1.4", score: Math.max(45, currentScore - 12), event: "+7% – MVP architecture registered.", avg: 42, top: 62 },
    { week: "Mod 1.1.5", score: Math.max(58, currentScore - 5), event: "+13% – Unit Economics structurally locked.", avg: 48, top: 70 },
    { week: "Mod 1.2.1", score: currentScore, event: "Current Diagnostic Master Score.", avg: 52, top: 76 }
  ];

  // Impact bar chart
  const impactData = [
    { category: "Basic Setup", impact: 5, fill: "#10b981", full: "+5 pts" },
    { category: "Team Roster", impact: 12, fill: "#10b981", full: "+12 pts" },
    { category: "Unit Economics", impact: 18, fill: "#10b981", full: "+18 pts" },
    { category: "Financial Foundation", impact: -4, fill: "#ef4444", full: "-4 pts" },
    { category: "TAM & Market", impact: 9, fill: "#10b981", full: "+9 pts" }
  ].sort((a,b) => b.impact - a.impact);

  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xl w-64">
          <p className="font-black text-gray-500 text-[10px] uppercase tracking-widest mb-2">{label}</p>
          <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
            <span className="text-3xl font-black text-indigo-600">{payload[0].value}%</span>
          </div>
          <p className="text-xs font-semibold text-gray-700 leading-snug">{payload[0].payload.event}</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-sm shadow-lg">
          <p className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">{payload[0].payload.category}</p>
          <p className={`font-black text-lg ${payload[0].value > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{payload[0].value > 0 ? '+' : ''}{payload[0].value} points</p>
        </div>
      );
    }
    return null;
  };

  const selectedSnapshot = timelineData.find(t => t.week === historySnapshot) || timelineData[5];
  const pointsSinceSnapshot = currentScore - selectedSnapshot.score;

  // Mock Radar data dynamically tied to current scale
  const radarData = currentCategories.map(c => ({
    subject: c.name,
    user: c.score,
    avg: Math.min(85, c.score * 0.8 + 10)
  }));
  const bestCategory = currentCategories.reduce((prev, curr) => (curr.score) > (prev?.score || 0) ? curr : prev, currentCategories[0]);
  const pScore = currentCategories.find(c => c.name === "Problem")?.score || 15;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 pb-32">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-gray-100 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 mb-2 block flex items-center gap-2">
             1.2.4 • Temporal Analytics
          </span>
          <h1 className="text-4xl font-black text-[#022f42] tracking-tight mb-2 flex items-center gap-3">
             <History className="w-9 h-9 text-indigo-500" />
             Your Improvement Timeline
          </h1>
          <p className="text-lg text-[#1e4a62] font-medium max-w-2xl">
             Visualize score velocity, trace exactly which architectural pivots unlocked institutional value, and gauge longitudinal trajectory against top peers.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/score/overview" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#022f42] bg-gray-100 hover:bg-gray-200 rounded-sm inline-block">Score Hub</Link>
          <Link href="/dashboard/score/benchmark" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 rounded-sm inline-block">View Benchmarks</Link>
        </div>
      </div>

      <div className="space-y-12">

        {/* SECTION 1: SCORE TIMELINE */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 lg:p-10 relative overflow-hidden">
           <h2 className="text-xl font-black text-[#022f42] mb-1 flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-indigo-500" /> Score Velocity
           </h2>
           <p className="text-sm text-gray-500 font-medium mb-8">Longitudinal diagnostic tracking mapped across execution milestones.</p>
           
           <div className="h-[400px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }} tickMargin={12} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<CustomLineTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }} />
                  
                  {/* Color Zones */}
                  <ReferenceArea y1={0} y2={33} fill="#fee2e2" fillOpacity={0.2} strokeOpacity={0} />
                  <ReferenceArea y1={34} y2={66} fill="#fef08a" fillOpacity={0.15} strokeOpacity={0} />
                  <ReferenceArea y1={67} y2={100} fill="#d1fae5" fillOpacity={0.2} strokeOpacity={0} />

                  {/* Lines */}
                  {showAvgTrajectory && (
                     <>
                     <Line type="monotone" name="Top Quartile" dataKey="top" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="3 3" dot={false} activeDot={false} />
                     <Line type="monotone" name="Avg Startup" dataKey="avg" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" dot={false} activeDot={false} />
                     </>
                  )}
                  <Line type="monotone" name="Your Score" dataKey="score" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute top-2 right-2 text-[9px] font-bold text-gray-400 uppercase flex flex-col gap-1 items-end">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-100 border border-emerald-300"></div> Investor Ready (67-100)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-100 border border-yellow-300"></div> Developing (34-66)</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-100 border border-rose-300"></div> High Risk (0-33)</span>
              </div>
           </div>

           <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={showAvgTrajectory} onChange={() => setShowAvgTrajectory(!showAvgTrajectory)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${showAvgTrajectory ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showAvgTrajectory ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-[#022f42] transition-colors">Compare Global Trajectory</span>
              </label>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-sm">
                  Velocity: +{(currentScore - timelineData[0].score)} pts / 6 wks
                </span>
              </div>
           </div>
        </div>

        {/* SECTION 2 & 3: IMPACT MAP & BENCHMARK RADAR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Section 2: Impact Map */}
           <div className="bg-white border text-left border-gray-200 rounded-sm shadow-sm p-8">
              <h3 className="text-lg font-black text-[#022f42] mb-1 flex items-center gap-2">
                 <Target className="w-5 h-5 text-emerald-500" /> Impact Attribution Map
              </h3>
              <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed">Isolates exact categorical inputs yielding maximum valuation leverage.</p>
              
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={impactData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#374151' }} width={110} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="impact" radius={[0, 4, 4, 0]} maxBarSize={40}>
                      {impactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[11px] text-gray-500 font-semibold flex items-start gap-2">
                   <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                   Notice: Financial Foundation updates pulled your score down by 4 points recently. This is normal when substituting assumptions with hard financial constraints. Reality overrides optimism.
                </p>
              </div>
           </div>

           {/* Section 3.2: AI Radar & Predictive Insights */}
           <div className="bg-[#022f42] border text-left rounded-sm shadow-sm p-8 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
              
              <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2 relative z-10">
                 <Sparkles className="w-5 h-5 text-[#ffd800]" /> Predictive AI Insights
              </h3>
              <p className="text-xs text-[#b0d0e0] font-medium mb-6 relative z-10">Aggregated inference logic mapped to peer outcomes.</p>
              
              <div className="h-[200px] w-full relative z-10 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#1e4a62" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#b0d0e0', fontSize: 9, fontWeight: 700 }} />
                    <Radar name="Segment Avg" dataKey="avg" stroke="#9ca3af" strokeWidth={1} strokeDasharray="3 3" fill="none" />
                    <Radar name="Your Profile" dataKey="user" stroke="#ffd800" strokeWidth={2} fill="#ffd800" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 space-y-3 relative z-10">
                 <div className="bg-white/10 border border-white/10 p-4 rounded-sm">
                   <p className="text-xs text-white leading-relaxed font-medium">
                     <span className="text-[#ffd800] font-bold">Insight:</span> Startups that clear the 60% Team benchmark execute follow-on funding 2.3x faster. You are tracking to nullify this risk metric. 
                   </p>
                 </div>
                 <div className="bg-white/10 border border-white/10 p-4 rounded-sm flex items-start gap-3 justify-between group cursor-pointer hover:bg-white/20 transition-colors">
                   <p className="text-xs text-white leading-relaxed font-medium">
                     <span className="text-emerald-400 font-bold">Recommendation:</span> Users matching your exact curve gained +15 points simply by running the <b>LTV Estimator</b> inside Unit Economics.
                   </p>
                   <ArrowRight className="w-4 h-4 text-[#b0d0e0] shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
           </div>

        </div>

        {/* SECTION 4: HISTORICAL SNAPSHOTS */}
        <div className="bg-[#f0f9ff]/50 border border-blue-100 p-8 rounded-sm shadow-sm relative overflow-hidden">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
             <div>
               <h3 className="text-xl font-black text-[#022f42] mb-1">Time Machine</h3>
               <p className="text-sm text-gray-600 font-medium">Revisit read-only historical states to extract comparative deltas.</p>
             </div>
             
             <div className="relative">
                <span className="absolute -left-16 top-3 text-[10px] font-bold uppercase tracking-widest text-indigo-400">Rewind</span>
                <select 
                  value={historySnapshot}
                  onChange={(e) => setHistorySnapshot(e.target.value)}
                  className="appearance-none bg-white border border-indigo-200 text-indigo-900 font-black text-sm px-6 py-3 pr-12 rounded-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                >
                  {timelineData.map(t => (
                    <option key={t.week} value={t.week}>{t.week} — Score: {t.score}%</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-indigo-500 pointer-events-none" />
             </div>
           </div>

           <AnimatePresence mode="wait">
             <motion.div 
               key={historySnapshot}
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
               className="bg-white p-6 rounded-sm shadow-sm border border-gray-100"
             >
               <h4 className="text-xs font-black uppercase tracking-widest text-[#1e4a62] mb-6 flex items-center justify-between">
                 Snapshot Delta: {historySnapshot} → Present
                 {pointsSinceSnapshot > 0 && (
                   <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] border border-emerald-200 shadow-inner">
                     +{pointsSinceSnapshot} Points Gained
                   </span>
                 )}
                 {pointsSinceSnapshot <= 0 && historySnapshot !== "Mod 1.2.1" && (
                   <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] border border-gray-200">
                     Neutral Vector
                   </span>
                 )}
               </h4>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="border-r border-gray-100 pr-6">
                   <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Score Profile Then</p>
                   <div className="text-3xl font-black text-gray-400 opacity-60 line-through decoration-rose-300 mb-2">
                     {selectedSnapshot.score}%
                   </div>
                   <p className="text-xs text-gray-500 font-medium leading-relaxed italic border-l-2 border-gray-200 pl-3">
                     {selectedSnapshot.event}
                   </p>
                 </div>
                 <div className="border-r border-gray-100 px-6 hidden md:block">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Metrics Altered</p>
                    <ul className="text-xs font-semibold text-gray-600 space-y-2">
                      <li className="flex justify-between border-b border-gray-50 pb-1">
                        <span>Problem Severity:</span>
                        <span className="text-[#022f42] shrink-0"><span className="text-gray-400 mx-1">{Math.max(5, pScore-20)}</span> → {pScore}</span>
                      </li>
                      <li className="flex justify-between border-b border-gray-50 pb-1">
                        <span>Runway Est:</span>
                        <span className="text-[#022f42] shrink-0"><span className="text-gray-400 mx-1">Unknown</span> → 12mo</span>
                      </li>
                    </ul>
                 </div>
                 <div className="pl-6 pt-2">
                    <AIAssistedInsight content={ pointsSinceSnapshot > 10 ? "Massive structural maturation over this timeframe. Key infrastructure parameters were securely quantified forcing score multiplier activation." : "Granular adjustments executing smoothly. Real-time compounding effect will trigger upon next major module completion sequence." } />
                 </div>
               </div>
             </motion.div>
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
