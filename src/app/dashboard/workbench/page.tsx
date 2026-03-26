"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Circle, AlertCircle, ArrowRight, Activity, 
  Sparkles, Target, Zap, Clock, ChevronRight, RefreshCcw, Layout
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  gapId: string;
  timeEstimate: number;
  pImpact: number;
  source: string;
  status: "todo" | "doing" | "done";
};

export default function WorkbenchPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "todo" | "done">("all");

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check for imports from Stage 1 (Module 1.3.3)
    const imported = localStorage.getItem("workbench_pipeline_import");
    const existing = localStorage.getItem("active_workbench_tasks");

    let finalTasks: Task[] = [];

    if (existing) {
      try {
        finalTasks = JSON.parse(existing);
      } catch (e) {}
    }

    if (imported) {
      try {
        const newTasks = JSON.parse(imported);
        // Merge without duplicates
        newTasks.forEach((nt: any) => {
          if (!finalTasks.find(t => t.id === nt.id)) {
            finalTasks.push({
              ...nt,
              status: "todo"
            });
          }
        });
        localStorage.removeItem("workbench_pipeline_import"); // Clear the import buffer
      } catch (e) {}
    }

    // 2. If no tasks, provide some strategic defaults (placeholder logic)
    if (finalTasks.length === 0) {
      finalTasks = [
        { id: "def-1", title: "Complete 1.1x Diagnostic Suite", gapId: "diagnose", timeEstimate: 60, pImpact: 15, source: "system", status: "todo" },
        { id: "def-2", title: "Verify Revenue Model Unit Economics", gapId: "financial", timeEstimate: 45, pImpact: 8, source: "system", status: "todo" }
      ];
    }

    setTasks(finalTasks);
    localStorage.setItem("active_workbench_tasks", JSON.stringify(finalTasks));
    setIsLoaded(true);
  }, []);

  const updateTaskStatus = (id: string, newStatus: "todo" | "doing" | "done") => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    setTasks(updated);
    localStorage.setItem("active_workbench_tasks", JSON.stringify(updated));
  };

  const resetWorkbench = () => {
    if (confirm("Reset workbench? This will clear all progress and custom actions.")) {
      localStorage.removeItem("active_workbench_tasks");
      window.location.reload();
    }
  };

  // Calculations
  const completedImpact = tasks.filter(t => t.status === "done").reduce((acc, t) => acc + t.pImpact, 0);
  const potentialImpact = tasks.reduce((acc, t) => acc + t.pImpact, 0);
  const totalMinutes = tasks.reduce((acc, t) => acc + t.timeEstimate, 0);
  const progress = tasks.length > 0 ? (tasks.filter(t => t.status === "done").length / tasks.length) * 100 : 0;

  const filteredTasks = tasks.filter(t => {
    if (activeTab === "all") return true;
    if (activeTab === "todo") return t.status !== "done";
    if (activeTab === "done") return t.status === "done";
    return true;
  });

  if (!isLoaded) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 pb-32">
      
      {/* HEADER SECTION */}
      <div className="mb-10 bg-[#022f42] text-white p-10 border-b-8 border-[#ffd800] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffd800] rounded-full blur-[120px] opacity-10"></div>
        
        <div className="relative z-10">
          <div className="inline-block bg-[#ffd800] text-[#022f42] font-black px-4 py-1 mb-5 text-[10px] uppercase tracking-[0.3em]">
            Module 3.1
          </div>
          <h1 className="text-4xl font-black mb-4 uppercase italic tracking-tight">Gap Closure Workbench</h1>
          <p className="text-[#b0d0e0] text-sm max-w-2xl leading-relaxed font-medium">
            This is your operational execution engine. Below are the specific actions required to bridge the identity and execution gaps identified in your diagnostics.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 p-5">
              <span className="block text-[10px] font-black uppercase tracking-widest text-[#ffd800] mb-2">Fundability Delta</span>
              <div className="text-3xl font-black text-white flex items-baseline">
                +{completedImpact} <span className="text-xs text-[#b0d0e0] ml-2 font-bold uppercase tracking-widest">Points Gained</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5">
              <span className="block text-[10px] font-black uppercase tracking-widest text-[#ffd800] mb-2">Completion Velocity</span>
              <div className="text-3xl font-black text-white">
                {Math.round(progress)}% <span className="text-xs text-[#b0d0e0] ml-2 font-bold uppercase tracking-widest">of Roadmap</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5">
              <span className="block text-[10px] font-black uppercase tracking-widest text-[#ffd800] mb-2">Execution Hours</span>
              <div className="text-3xl font-black text-white">
                {Math.round(totalMinutes / 60)} <span className="text-xs text-[#b0d0e0] ml-2 font-bold uppercase tracking-widest">Total Plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* TASK ENGINE */}
        <div className="lg:col-span-8">
           <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex gap-6">
                {["all", "todo", "done"].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`text-xs font-black uppercase tracking-widest pb-4 relative transition-colors ${activeTab === tab ? 'text-[#022f42]' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {tab} ({tab === 'all' ? tasks.length : tasks.filter(t => tab === 'done' ? t.status === 'done' : t.status !== 'done').length})
                    {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-[-1px] left-0 right-0 h-1 bg-[#ffd800]" />}
                  </button>
                ))}
              </div>
              <button onClick={resetWorkbench} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-500 flex items-center gap-1 transition-colors">
                 <RefreshCcw className="w-3 h-3" /> Reset Ledger
              </button>
           </div>

           <div className="space-y-4">
             {filteredTasks.length === 0 ? (
               <div className="py-20 text-center bg-gray-50 border border-gray-100 italic text-gray-400 text-sm">
                 No actions found in this category.
               </div>
             ) : (
               filteredTasks.map(task => (
                 <div key={task.id} className={`p-6 border-2 transition-all duration-300 relative bg-white ${task.status === 'done' ? 'border-emerald-100 opacity-60' : 'border-[#022f42]/5 group hover:border-[#ffd800] shadow-sm hover:shadow-xl'}`}>
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 hover:border-[#ffd800]'}`}
                          >
                             {task.status === 'done' && <CheckCircle2 className="w-5 h-5" />}
                          </button>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1 block">Source: {task.source} • {task.gapId}</span>
                            <h3 className={`text-xl font-black text-[#022f42] ${task.status === 'done' ? 'line-through decoration-emerald-500/50' : ''}`}>
                              {task.title}
                            </h3>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={`text-lg font-black ${task.status === 'done' ? 'text-emerald-500' : 'text-[#022f42]'}`}>+{task.pImpact}</div>
                          <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Score Impact</div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                       <div className="flex gap-4">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                             <Clock className="w-3 h-3" /> {task.timeEstimate} MIN
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                             <Zap className="w-3 h-3" /> High Impact
                          </div>
                       </div>
                       {task.status !== 'done' && (
                         <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-gray-100">Pending Execution</span>
                         </div>
                       )}
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* SIDEBAR: AI COORDINATOR */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#022f42] text-white p-8 border-t-8 border-[#ffd800] shadow-2xl relative overflow-hidden">
              <Sparkles className="absolute top-4 right-4 w-6 h-6 text-[#ffd800] opacity-20" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffd800] mb-6">AI COORDINATOR</h4>
              
              <div className="space-y-6">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                    <p className="text-xs leading-relaxed text-[#b0d0e0] font-medium">
                      &quot;You have <strong className="text-white">{tasks.filter(t=>t.status!=='done').length} outstanding high-impact actions</strong>. Completing just these will move your Fundability Score into the <strong>Top 15%</strong> relative to peers.&quot;
                    </p>
                 </div>

                 <div className="border-t border-white/10 pt-6">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-[#ffd800] mb-4 text-center">Current Milestone</h5>
                    <div className="p-6 bg-black text-center rounded-sm border border-white/5">
                       <div className="text-3xl font-black text-white mb-1">SEED ROUND</div>
                       <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Targeting $500k - $2M</div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-[#ffd800]"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3 pt-4">
                    <button className="w-full p-4 border border-white/10 hover:border-[#ffd800] transition-colors text-[10px] font-black uppercase tracking-widest text-left flex justify-between items-center group">
                       Generate Investor Memo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full p-4 border border-white/10 hover:border-[#ffd800] transition-colors text-[10px] font-black uppercase tracking-widest text-left flex justify-between items-center group">
                       Verify Execution Logic <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
           </div>

           <div className="bg-[#fcfdfd] border-2 border-[rgba(2,47,66,0.05)] p-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-4">METHODOLOGY SYNC</h4>
              <p className="text-[11px] text-[#1e4a62] leading-relaxed mb-6">
                 All tasks in this workbench are synchronized with the <strong>Standard Venture Reporting Framework (SVRF)</strong>. Progress here directly updates your <strong>Verified Startup Profile</strong> accessible by matched investors.
              </p>
              <Link href="/dashboard/roadmap" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#022f42] hover:gap-4 transition-all">
                 View Stage 3 Roadmap <ChevronRight className="w-4 h-4" />
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
