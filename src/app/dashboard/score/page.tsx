"use client";

import { motion } from "framer-motion";
import { 
  Trophy, BarChart3, LineChart, Target, 
  CheckCircle2, ChevronRight, ArrowRight, RefreshCw, Eye
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const subModules = [
  { id: "overview", title: "Fundability Score Breakdown", icon: Trophy, desc: "Interactive 6-axis radar and what-if simulator.", status: "not_started", time: "2 min" },
  { id: "breakdown", title: "Key Criteria Breakdown", icon: Target, desc: "Detailed analysis of each core funding pillar.", status: "locked", time: "3 min" },
  { id: "benchmark", title: "Benchmark Comparison", icon: BarChart3, desc: "See how you stack up against peer aggregates.", status: "locked", time: "4 min" },
  { id: "history", title: "Score History & Timeline", icon: LineChart, desc: "Track your diagnostic evolution over time.", status: "locked", time: "2 min" },
];

export default function ScoreHubPage() {
  const { user } = useAuth();
  const [modules, setModules] = useState(subModules);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Read completed modules from localStorage
    const mockState = subModules.map((m) => {
      const isCompleted = !!localStorage.getItem(`audit_1_2_${m.id}`);
      return {
        ...m,
        status: isCompleted ? "completed" : "not_started"
      };
    });
    
    setModules(mockState);
    const completedCount = mockState.filter(m => m.status === 'completed').length;
    setOverallProgress(Math.round((completedCount / subModules.length) * 100));
  }, []);

  const resetProgress = () => {
    if (typeof window === 'undefined') return;
    if (confirm("Are you sure you want to reset your viewing progress for this module?")) {
      subModules.forEach(m => {
        localStorage.removeItem(`audit_1_2_${m.id}`);
      });
      setModules(subModules.map(m => ({ ...m, status: "not_started" })));
      setOverallProgress(0);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-700 border-green-200";
      case "in_progress": return "bg-[#ffd800] text-[#022f42] border-[#ffd800]";
      case "not_started": return "bg-white text-[#022f42] border-[rgba(2,47,66,0.15)] hover:border-[#022f42]";
      default: return "bg-[#f2f6fa] text-[#1e4a62] border-[rgba(2,47,66,0.05)] opacity-60";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in_progress": return <ChevronRight className="w-5 h-5 text-[#022f42]" />;
      case "not_started": return <ChevronRight className="w-5 h-5 opacity-50" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8">
      <div className="mb-8 bg-[#022f42] text-white p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-4 text-[10px] uppercase tracking-widest relative z-10">
          Module 1.2
        </div>
        <h1 className="text-3xl font-bold mb-3 relative z-10">Live Fundability Score</h1>
        <p className="text-[#b0d0e0] text-sm max-w-2xl leading-relaxed relative z-10">
          Your diagnostic brain. This module synthesizes all inputs from your 360° Audit into a benchmarked, actionable score that mirrors institutional execution thresholds.
        </p>
        
        <div className="mt-8 bg-white/10 p-4 border border-white/20 relative z-10 flex items-center justify-between">
          <div className="flex-1 mr-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#b0d0e0] mb-2">
              <span>Analysis Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="h-2 bg-[rgba(2,47,66,0.5)] overflow-hidden">
              <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={resetProgress} className="px-6 py-2.5 bg-transparent text-[#b0d0e0] font-bold uppercase tracking-widest text-xs border border-[#b0d0e0]/30 hover:bg-[#b0d0e0]/10 transition-colors shrink-0 flex items-center gap-2">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
            <Link href={`/dashboard/score/${modules.find(m => m.status === 'not_started')?.id || 'overview'}`} className="px-6 py-2.5 bg-[#ffd800] text-[#022f42] font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors shrink-0">
              {overallProgress === 100 ? "View Results" : "Continue"}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod, index) => {
          const href = `/dashboard/score/${mod.id}`;
          
          return (
            <Link key={mod.id} href={href} className={`block p-5 border-2 transition-all duration-300 relative ${getStatusColor(mod.status)} hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
               <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 flex items-center justify-center font-bold text-lg opacity-40">
                     1.2.{index + 1}
                   </div>
                   <mod.icon className="w-6 h-6" />
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{mod.time}</span>
                   {getStatusIcon(mod.status)}
                 </div>
               </div>
               
               <div className="pl-11">
                 <h3 className="font-bold mb-1">{mod.title}</h3>
                 <p className="text-xs opacity-80">{mod.desc}</p>
               </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 bg-white p-6 border border-[rgba(2,47,66,0.1)] flex items-start gap-4">
        <div className="bg-indigo-50 p-3 rounded-sm">
          <Eye className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#022f42] mb-1">Score Calibration</h4>
          <p className="text-xs text-[#1e4a62] leading-relaxed">
            This score is not absolute—it is relative to your current stage and sector. As you complete more workshops in the Activate (Week 2) and Accelerate (Week 3) stages, your score will dynamically update to reflect your increased execution maturity.
          </p>
        </div>
      </div>
    </div>
  );
}
