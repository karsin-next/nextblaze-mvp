"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, TrendingUp, AlertTriangle, ArrowRight, Activity, CalendarDays, BarChart3, Edit3, ShieldCheck, Users, Globe, Info } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface ScoreData {
  score: number;
  categoryScores: Record<string, number>;
  lastUpdated: string;
}

const categoryMeta: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  team: { label: "Team & Leadership", icon: Users, color: "#3b82f6" },
  market: { label: "Market & Positioning", icon: Globe, color: "#8b5cf6" },
  traction: { label: "Traction & Growth", icon: TrendingUp, color: "#10b981" },
  financials: { label: "Financial Governance", icon: BarChart3, color: "#f59e0b" },
  ip: { label: "IP & Differentiation", icon: ShieldCheck, color: "#ef4444" },
};

const historyData = [
  { date: "Start", score: 0 },
];

export default function ScoreDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoreHistory, setScoreHistory] = useState<{date: string; score: number}[]>([]);

  useEffect(() => {
    // Only run if user exists to prevent premature loading
    if (!user) return;

    // React useEffect cleanup + stable dependencies prevent looping
    const timer = setTimeout(() => {
      const currentScore = user.fundability_score || 58;
      setData({
        score: currentScore,
        categoryScores: { team: 75, market: 85, traction: 40, financials: 35, ip: 60 },
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });

      // Load score history from localStorage
      if (typeof window !== 'undefined') {
        const histKey = `score_history_${user?.id}`;
        const saved = localStorage.getItem(histKey);
        let hist = saved ? JSON.parse(saved) : [];
        // Append today's score if it's different from last entry
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (hist.length === 0 || hist[hist.length - 1].score !== currentScore) {
          hist.push({ date: today, score: currentScore });
          if (hist.length > 12) hist = hist.slice(-12); // keep last 12 snapshots
          localStorage.setItem(histKey, JSON.stringify(hist));
        }
        setScoreHistory(hist);
      }
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [user?.id, user?.fundability_score]);

  const getGrade = (s: number) => s >= 80 ? "Investor-Ready" : s >= 60 ? "Needs Preparation" : "Significant Gaps";
  const getColor = (s: number) => s >= 80 ? "text-green-500" : s >= 60 ? "text-[#ffd800]" : "text-red-500";
  const getBg = (s: number) => s >= 80 ? "bg-green-500" : s >= 60 ? "bg-[#ffd800]" : "bg-red-500";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-[#f2f6fa] border-t-[#022f42] rounded-full animate-spin mb-4"></div>
        <p className="text-[#1e4a62] font-medium text-sm animate-pulse">Retrieving your Fundability Snapshot...</p>
      </div>
    );
  }

  if (!data) return null;

  const radarData = Object.entries(data.categoryScores).map(([key, val]) => ({
    subject: categoryMeta[key]?.label || key,
    A: val,
    fullMark: 100,
  }));

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#022f42] mb-2 flex items-center">
            <Activity className="w-6 h-6 mr-3 text-[#ffd800]" />
            Live Fundability Score
          </h1>
          <p className="text-[#1e4a62] text-sm flex items-center">
            <CalendarDays className="w-4 h-4 mr-1.5 opacity-60" />
            Last updated: {data.lastUpdated}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="px-5 py-2.5 bg-white border border-[rgba(2,47,66,0.15)] text-[#022f42] font-bold uppercase tracking-widest text-xs hover:border-[#ffd800] transition-all flex items-center shadow-sm">
            <Edit3 className="w-3.5 h-3.5 mr-2" /> Redo Audit
          </Link>
          <Link href="/dashboard/gap-report" className="px-5 py-2.5 bg-[#022f42] text-white border-2 border-[#022f42] font-bold uppercase tracking-widest text-xs hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] transition-all flex items-center shadow-md">
            View Gap Report <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 bg-[#022f42] p-8 shadow-[0_25px_45px_-15px_rgba(2,47,66,0.25)] flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: getBg(data.score).replace('bg-', '') }}></div>
          <p className="text-[10px] text-[#b0d0e0] uppercase tracking-widest mb-4 font-bold">Overall Investor Readiness</p>
          <div className={`text-8xl font-black tracking-tighter ${getColor(data.score)}`}>{data.score}</div>
          <p className="text-xs text-[#b0d0e0] mt-1 mb-6">out of 100</p>
          
          <div className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest border ${data.score >= 80 ? "border-green-400 text-green-300 bg-green-500/10" : data.score >= 60 ? "border-yellow-400 text-yellow-300 bg-yellow-500/10" : "border-red-400 text-red-300 bg-red-500/10"}`}>
            {getGrade(data.score)}
          </div>
          
          <div className="w-full mt-10 pt-6 border-t border-[rgba(255,255,255,0.1)] text-left">
            <p className="text-xs text-[#b0d0e0] mb-2 font-medium">Peer Benchmark (Supply Chain & Deep Tech):</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-white">Top 35%</span>
              <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                <div className="h-full bg-[#b0d0e0] w-[65%]"></div>
              </div>
            </div>
            <p className="text-[10px] text-[#b0d0e0] mt-2 opacity-70">Average Series A target: 80+</p>
          </div>
        </motion.div>

        {/* Radar Chart & Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white shadow-[0_25px_45px_-15px_rgba(2,47,66,0.1)]">
          <div className="p-6 border-b border-[rgba(2,47,66,0.08)] flex justify-between items-center">
             <h2 className="text-lg font-bold text-[#022f42]">Dimension Breakdown</h2>
             <span className="text-[10px] font-bold uppercase tracking-widest bg-[#f2f6fa] text-[#1e4a62] px-2 py-1">5 Dimensions</span>
          </div>
          
          <div className="flex flex-col md:flex-row h-full">
            {/* Radar Visual */}
            <div className="md:w-1/2 h-[300px] md:h-[350px] border-b md:border-b-0 md:border-r border-[rgba(2,47,66,0.08)] p-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(2,47,66,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#022f42', fontSize: 10, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="#022f42" fill="#ffd800" fillOpacity={0.5} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            {/* List Visual */}
            <div className="md:w-1/2 p-6 flex flex-col justify-center space-y-5">
              {Object.entries(data.categoryScores).sort(([,a], [,b]) => b - a).map(([cat, score]) => {
                const meta = categoryMeta[cat];
                return (
                  <div key={cat} className="group cursor-pointer">
                    <div className="flex justify-between items-end mb-1.5">
                      <div className="flex items-center gap-2">
                        <meta.icon className="w-4 h-4" style={{ color: meta.color }} />
                        <span className="text-xs font-bold text-[#022f42]">{meta.label}</span>
                      </div>
                      <span className="text-xs font-black text-[#022f42]">{score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f2f6fa] rounded-full overflow-hidden mb-1">
                      <div className="h-full transition-all duration-1000" style={{ width: `${score}%`, backgroundColor: meta.color }}></div>
                    </div>
                    {score < 50 && (
                       <Link href="/dashboard/gap-report" className="text-[10px] text-red-500 font-medium hover:underline flex items-center gap-1">
                         Critical focus area. <span className="underline opacity-80">See Gap Report →</span>
                       </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 bg-white border border-[rgba(2,47,66,0.12)] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#022f42]">Score History Tracker</h2>
            <p className="text-xs text-[#1e4a62] mt-1 max-w-xl leading-relaxed">
              This chart records your <strong>Fundability Score (PTS)</strong> every time you visit this page after completing modules. <strong>PTS (Progress Tracking Score)</strong> measures how your overall investor-readiness has improved over time — a rising PTS indicates you are actively closing your gaps and building a stronger case for funding.
            </p>
          </div>
          {scoreHistory.length > 1 && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700 px-3 py-1 shrink-0">
              +{scoreHistory[scoreHistory.length-1].score - scoreHistory[0].score} pts since tracking began
            </span>
          )}
        </div>
        <div className="h-[250px] w-full mt-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={scoreHistory.length > 1 ? scoreHistory : [{date: 'Start', score: 0}, {date: 'Now', score: data.score}]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(2,47,66,0.1)" />
              <XAxis dataKey="date" stroke="#1e4a62" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#1e4a62" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="score" stroke="#022f42" strokeWidth={3} dot={{ fill: '#ffd800', r: 4, strokeWidth: 2, stroke: '#022f42' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Week 2 Bridge */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-3 text-[10px] uppercase tracking-widest">
            Next Step: Week 2 Activate
          </div>
          <h3 className="text-xl font-bold text-[#022f42] mb-2">Automate your Financial Score</h3>
          <p className="text-sm text-[#1e4a62] max-w-2xl">
            Currently, your Financials score ({data.categoryScores.financials}%) and Traction score ({data.categoryScores.traction}%) are based on self-reported estimates. Connect your raw data to make these metrics live and verified.
          </p>
        </div>
        <Link href="/dashboard/financials" className="shrink-0 px-8 py-4 bg-[#022f42] text-white border-2 border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] transition-all font-bold uppercase tracking-widest text-xs shadow-md">
          Connect Data
        </Link>
      </motion.div>
    </div>
  );
}
