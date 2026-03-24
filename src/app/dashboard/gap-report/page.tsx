"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle, Search, Lightbulb, FileText,
  CheckCircle2, ChevronRight, ArrowRight, RefreshCw, Eye, List
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const subModules = [
  { id: "top-3", title: "Top 3 Critical Gaps", icon: AlertTriangle, desc: "Identify the high-impact red flags stopping your round.", status: "not_started", time: "3 min" },
  { id: "deep-dive", title: "Gap Deep Dive Analysis", icon: Search, desc: "Why these gaps matter to institutional investors.", status: "locked", time: "5 min" },
  { id: "actions", title: "Gap Closure Action Plan", icon: Lightbulb, desc: "Step-by-step roadmap to resolve each fracture.", status: "locked", time: "4 min" },
  { id: "report", title: "Investor-Ready Report", icon: FileText, desc: "Generate a professional PDF narrative for VCs.", status: "locked", time: "2 min" },
];

export default function GapHubPage() {
  const { user } = useAuth();
  const [modules, setModules] = useState(subModules);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Read completed modules from localStorage
    const mockState = subModules.map((m) => {
      const isCompleted = !!localStorage.getItem(`audit_1_3_${m.id.replace(/-/g, '_')}`);
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
    if (confirm("Are you sure you want to reset your analysis progress for this module?")) {
      subModules.forEach(m => {
        localStorage.removeItem(`audit_1_3_${m.id.replace(/-/g, '_')}`);
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
      <div className="mb-8 bg-rose-900 text-white p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-4 text-[10px] uppercase tracking-widest relative z-10">
          Module 1.3
        </div>
        <h1 className="text-3xl font-bold mb-3 relative z-10">Gap Analysis Report</h1>
        <p className="text-rose-100 text-sm max-w-2xl leading-relaxed relative z-10">
          Isolate the specific fractures in your execution. This module builds the bridge between where you are and where an institutional investor needs you to be.
        </p>

        <div className="mt-8 bg-white/10 p-4 border border-white/20 relative z-10 flex items-center justify-between">
          <div className="flex-1 mr-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-rose-100 mb-2">
              <span>Report Readiness</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="h-2 bg-rose-950 overflow-hidden">
              <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={resetProgress} className="px-6 py-2.5 bg-transparent text-rose-100 font-bold uppercase tracking-widest text-xs border border-rose-100/30 hover:bg-rose-100/10 transition-colors shrink-0 flex items-center gap-2">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
            <Link href={`/dashboard/gap-report/${modules.find(m => m.status === 'not_started')?.id || 'top-3'}`} className="px-6 py-2.5 bg-[#ffd800] text-[#022f42] font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors shrink-0">
              {overallProgress === 100 ? "View Report" : "Continue"}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod, index) => {
          const href = `/dashboard/gap-report/${mod.id}`;

          return (
            <Link key={mod.id} href={href} className={`block p-5 border-2 transition-all duration-300 relative ${getStatusColor(mod.status)} hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
               <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 flex items-center justify-center font-bold text-lg opacity-40">
                     1.3.{index + 1}
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

      <div className="mt-8 flex gap-4">
        <Link href="/dashboard/gap-report/all" className="flex-1 p-4 bg-white border border-[rgba(2,47,66,0.1)] rounded-sm hover:border-[#022f42] transition-colors flex items-center justify-between group">
           <div className="flex items-center gap-3">
             <div className="bg-[#f2f6fa] p-2 rounded-sm group-hover:bg-[#022f42] group-hover:text-white transition-colors">
               <List className="w-4 h-4" />
             </div>
             <div>
               <h4 className="text-sm font-bold text-[#022f42]">Full Gap Inventory</h4>
               <p className="text-[10px] text-[#1e4a62] opacity-60 uppercase font-bold tracking-widest">View all {">"}15 identified markers</p>
             </div>
           </div>
           <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      <div className="mt-12 bg-white p-6 border border-[rgba(2,47,66,0.1)] flex items-start gap-4">
        <div className="bg-rose-50 p-3 rounded-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#022f42] mb-1">Critical Path Isolation</h4>
          <p className="text-xs text-[#1e4a62] leading-relaxed font-medium">
            This module doesn&#39;t just list problems—it prioritizes them based on investor psychology. A critical gap in Module 1.1.1 (Problem) is 10x more likely to kill a deal than a warning in Module 1.1.8 (Team) at the pre-seed stage. Use this intelligence to focus your limited founder time where it actually moves the needle.
          </p>
        </div>
      </div>
    </div>
  );
}
