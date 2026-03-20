"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, AlertCircle, ArrowRight, Activity, Cpu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Task = {
  id: string;
  module: string;
  title: string;
  impact: "High" | "Medium" | "Low";
  status: "open" | "in_progress" | "done";
  path: string;
};

export default function WorkbenchPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(true);

  // Cash Flow states
  const [monthlyBurn, setMonthlyBurn] = useState(15000);
  const [currentCash, setCurrentCash] = useState(85000);
  const runway = currentCash / monthlyBurn;

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      setTimeout(() => {
        setIsSynthesizing(false);
        const scoreDataRaw = localStorage.getItem(`fundability_score_${user.id}`);
        const generatedTasks: Task[] = [];
        
        if (scoreDataRaw) {
          try {
            const score = JSON.parse(scoreDataRaw);
            
            // Logic Parser creating actionable tasks based on Audit Score
            if (score.problem < 70) {
              generatedTasks.push({ id: 't1', module: 'Module 1.1.1', title: 'Refine Problem & Vision Statement', impact: 'High', status: 'open', path: '/dashboard/audit/1-problem' });
            }
            if (score.customer < 80) {
              generatedTasks.push({ id: 't2', module: 'Module 1.1.2', title: 'Narrow Ideal Customer Profile (ICP)', impact: 'High', status: 'open', path: '/dashboard/audit/2-customer' });
            }
            if (score.pmf < 60) {
              generatedTasks.push({ id: 't3', module: 'Module 1.1.6', title: 'Run Customer Retention Analysis (Low PMF Warning)', impact: 'High', status: 'open', path: '/dashboard/audit/6-pmf' });
            }
            if (score.team < 75) {
               generatedTasks.push({ id: 't4', module: 'Module 1.1.8', title: 'Audit Team Composition & Equity Split', impact: 'Medium', status: 'open', path: '/dashboard/audit/8-team' });
            }
          } catch(e){}
        }

        // Add default tasks if score is high
        if (generatedTasks.length === 0) {
           generatedTasks.push({ id: 't5', module: 'Module 2.4', title: 'Simulate Term Sheet Strategies', impact: 'Medium', status: 'open', path: '/dashboard/strategy' });
           generatedTasks.push({ id: 't6', module: 'Module 2.5', title: 'Upload Missing Pitch Deck to Data Room', impact: 'High', status: 'open', path: '/dashboard/data-room' });
        }

        setTasks(generatedTasks);
      }, 1500); // Simulate AI analysis
    }
  }, [user?.id]);

  const toggleStatus = (id: string, currentStatus: string) => {
    setTasks(tasks.map(t => {
       if (t.id === id) {
          return { ...t, status: currentStatus === "open" ? "done" : "open" };
       }
       return t;
    }));
  };

  const completedCount = tasks.filter(t => t.status === "done").length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div>
          <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
            Module 3.1
          </div>
          <h1 className="text-3xl font-bold text-[#022f42] mb-2 flex items-center">
             Gap Closure Workbench
          </h1>
          <p className="text-[#1e4a62] text-sm max-w-xl leading-relaxed">
            The Phase 1 Diagnostic flagged specific structural weaknesses. This operational ledger automatically sequences the absolute highest-ROI actions required to maximize your Fundability Score.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Task Ledger */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#1e4a62]/10 rounded-sm shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] overflow-hidden">
             <div className="p-6 border-b border-[#1e4a62]/10 bg-[#f2f6fa]/50 flex justify-between items-center">
                <h2 className="text-sm font-black text-[#022f42] uppercase tracking-widest flex items-center">
                  <Activity className="w-4 h-4 mr-2" /> Task Engine
                </h2>
                <div className="text-[10px] font-bold bg-[#022f42] text-white px-2 py-1 uppercase tracking-widest rounded-sm">
                   {completedCount} / {tasks.length} Resolved
                </div>
             </div>

             {/* Progress Bar */}
             <div className="w-full h-1 bg-[#f2f6fa]">
                <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
             </div>

             <div className="p-6">
               {isSynthesizing ? (
                 <div className="flex flex-col items-center justify-center py-16 text-[#1e4a62]">
                    <Cpu className="w-8 h-8 animate-pulse mb-4 text-[#ffd800]" />
                    <div className="text-xs uppercase font-bold tracking-widest">Compiling Remediation Vectors...</div>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {tasks.map((task) => (
                     <div key={task.id} className={`flex items-start p-4 border rounded-sm transition-all ${task.status === 'done' ? 'bg-[#f2f6fa] border-[#1e4a62]/10 opacity-70' : 'bg-white border-[#1e4a62]/20 shadow-sm hover:border-[#022f42]'}`}>
                        <button onClick={() => toggleStatus(task.id, task.status)} className="mt-1 shrink-0 group">
                           {task.status === "done" ? (
                             <CheckCircle2 className="w-5 h-5 text-green-500" />
                           ) : (
                             <Circle className="w-5 h-5 text-[#1e4a62]/40 group-hover:text-[#ffd800]" />
                           )}
                        </button>
                        <div className="ml-4 flex-1">
                           <div className="flex justify-between items-start mb-1">
                              <div>
                                 <span className="text-[9px] font-bold uppercase tracking-widest text-[#1e4a62] bg-[#f2f6fa] px-2 py-0.5 rounded-sm">{task.module}</span>
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${task.impact === 'High' ? 'text-red-600' : 'text-[#1e4a62]'}`}>
                                {task.impact} Impact
                              </span>
                           </div>
                           <h3 className={`text-sm font-bold text-[#022f42] ${task.status === 'done' ? 'line-through' : ''}`}>
                             {task.title}
                           </h3>
                        </div>
                        <div className="ml-4 shrink-0 flex flex-col justify-center">
                           {task.status !== 'done' && (
                             <Link href={task.path} className="text-[10px] font-black uppercase tracking-widest text-white bg-[#022f42] px-3 py-1.5 rounded-sm hover:bg-[#ffd800] hover:text-[#022f42] transition-colors flex items-center">
                               Execute <ArrowRight className="w-3 h-3 ml-1" />
                             </Link>
                           )}
                        </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Phase 3 Cash Flow Widget */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd800] rounded-full blur-[60px] opacity-10"></div>
             
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#ffd800] mb-6 flex items-center">
               <AlertCircle className="w-4 h-4 mr-2" /> Cash Flow Health Check
             </h3>

             <div className="space-y-5 relative z-10">
                <div>
                   <label className="text-[9px] uppercase tracking-widest font-bold text-[#b0d0e0] block mb-1">Operating Cash Balance</label>
                   <div className="flex border-b border-white/20 pb-1">
                      <span className="text-xl font-black mr-1">$</span>
                      <input type="number" value={currentCash} onChange={(e) => setCurrentCash(Number(e.target.value))} className="bg-transparent outline-none w-full text-xl font-black text-white" />
                   </div>
                </div>
                <div>
                   <label className="text-[9px] uppercase tracking-widest font-bold text-[#b0d0e0] block mb-1">Monthly Burn Velocity</label>
                   <div className="flex border-b border-white/20 pb-1">
                      <span className="text-xl font-black mr-1 text-red-400">-$</span>
                      <input type="number" value={monthlyBurn} onChange={(e) => setMonthlyBurn(Number(e.target.value))} className="bg-transparent outline-none w-full text-xl font-black text-red-400" />
                   </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                   <div className="text-[10px] uppercase font-bold tracking-widest text-[#b0d0e0] mb-2">Live Runway</div>
                   <div className={`text-4xl font-black ${runway < 6 ? 'text-red-400' : runway < 12 ? 'text-[#ffd800]' : 'text-green-400'}`}>
                      {runway === Infinity ? '∞' : runway.toFixed(1)} <span className="text-sm font-medium uppercase tracking-widest text-white/50">Months</span>
                   </div>
                   
                   {runway < 6 && (
                     <div className="mt-3 bg-red-500/20 border border-red-500/50 p-2 text-[10px] font-bold text-red-200">
                        CRITICAL WARNING: Insolvency risk within 6 months. Prioritize bridging capital tasks immediately.
                     </div>
                   )}
                </div>
             </div>
           </div>

           <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-6 rounded-sm text-center shadow-inner">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1e4a62] mb-2">Next Phase Module</h3>
              <p className="text-xs text-[#022f42] font-black mb-4">VC Targeting & Matching</p>
              <Link href="/dashboard/investors" className="inline-flex w-full px-4 py-3 bg-white border border-[#1e4a62]/20 text-[#022f42] text-[10px] font-black uppercase tracking-widest items-center justify-center rounded-sm hover:border-[#ffd800] hover:bg-[#ffd800] transition-colors shadow-sm">
                 Open Matcher <ArrowRight className="w-3 h-3 ml-2" />
               </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
