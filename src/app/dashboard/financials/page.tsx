"use client";

import { motion } from "framer-motion";
import { 
  Calculator, Activity, Wallet, CheckCircle2, ChevronRight, PlayCircle, 
  ArrowRight, DollarSign, TrendingUp, RefreshCcw, Landmark
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const financialModules = [
  { id: "metrics", title: "Scenario & Metrics Simulator", icon: Calculator, desc: "Define your core KPIs and stress-test your runway.", status: "not_started", time: "5 min", num: "2.1.1" },
  { id: "breakeven", title: "EBDAT Breakeven Analysis", icon: Activity, desc: "Find the exact date your business becomes default alive.", status: "locked", time: "4 min", num: "2.1.2" },
  { id: "cash-flow", title: "Cash Flow Snapshot", icon: Wallet, desc: "Visualize your 12-month trailing vs. projected flow.", status: "locked", time: "3 min", num: "2.1.3" },
];

export default function FinancialsHubPage() {
  const { user } = useAuth();
  const [modules, setModules] = useState(financialModules);
  const [overallProgress, setOverallProgress] = useState(0);
  const [runway, setRunway] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Read sub-module completion from localStorage
    const mockState = financialModules.map((m) => {
      // Check for multiple possible completion keys to ensure robustness
      const isCompleted = localStorage.getItem(`audit_2_1_${m.id}`) === "completed" || 
                          localStorage.getItem(`audit_2_1_${m.num.replace(/\./g,'_')}`) === "completed" ||
                          localStorage.getItem(`audit_2_1_${m.num.split('.').pop()}`) === "completed" ||
                          (m.num === "2.1.1" && localStorage.getItem("audit_2_1_1") === "completed");
      
      return {
        ...m,
        status: isCompleted ? "completed" : "locked"
      };
    });

    // Sequential Activation Logic: 2.1.1 (Metrics) -> 2.1.2 (Breakeven) -> 2.1.3 (Cash Flow)
    // 2.1.1 is always the entry point if not completed
    if (mockState[0].status !== "completed") mockState[0].status = "not_started";
    
    // 2.1.2 unlocks ONLY IF 2.1.1 is done
    if (mockState[0].status === "completed" && mockState[1].status !== "completed") {
      mockState[1].status = "not_started";
    }
    
    // 2.1.3 unlocks ONLY IF 2.1.2 is done
    if (mockState[1].status === "completed" && mockState[2].status !== "completed") {
      mockState[2].status = "not_started";
    }
    
    setModules(mockState);
    const completedCount = mockState.filter(m => m.status === 'completed').length;
    setOverallProgress(Math.round((completedCount / financialModules.length) * 100));

    // Get current runway for summary
    const snapshot = localStorage.getItem("financial_snapshot_v2");
    if (snapshot) {
      try {
        const parsed = JSON.parse(snapshot);
        const mrr = parsed.metrics?.mrr || 0;
        const burn = parsed.metrics?.burn || 0;
        const cash = parsed.metrics?.cash || 0;
        const netBurn = Math.max(0, burn - mrr);
        const r = netBurn > 0 ? Math.floor(cash / netBurn) : (mrr >= burn ? 99 : 0);
        setRunway(r);
      } catch (e) {}
    }
  }, []);

  const resetModule = () => {
    if (typeof window === 'undefined') return;
    if (confirm("Are you sure you want to reset all financial data? All inputs and simulations will be cleared.")) {
      localStorage.removeItem("financial_snapshot_v2");
      localStorage.removeItem("audit_2_1_1");
      localStorage.removeItem("audit_2_1_2");
      localStorage.removeItem("audit_2_1_3");
      localStorage.removeItem("audit_2_1_metrics");
      localStorage.removeItem("audit_2_1_breakeven");
      localStorage.removeItem("audit_2_1_cash_flow");
      window.location.reload();
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "in_progress": return "bg-[#ffd800] text-[#022f42] border-[#ffd800]";
      case "not_started": return "bg-white text-[#022f42] border-[rgba(2,47,66,0.1)] hover:border-[#022f42]";
      default: return "bg-[#fcfdfd] text-[#1e4a62] border-[rgba(2,47,66,0.05)] opacity-50";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8">
      {/* Premium Hub Header */}
      <div className="mb-8 bg-[#022f42] text-white p-10 shadow-2xl relative overflow-hidden group border-b-8 border-[#ffd800]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffd800] rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
        <div className="inline-block bg-[#ffd800] text-[#022f42] font-black px-4 py-1 mb-5 text-[10px] uppercase tracking-[0.3em] relative z-10">
          Module 2.1
        </div>
        <h1 className="text-3xl font-bold mb-3 relative z-10">Manual Financial Input</h1>
        <p className="text-[#b0d0e0] text-sm max-w-2xl leading-relaxed relative z-10 font-medium">
          Transition from qualitative hypotheses to quantitative proof. Use these modules to build your financial foundation and generate your investor-ready runway trajectory.
        </p>
        
        <div className="mt-10 bg-white/5 p-6 border border-white/20 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd800] mb-3">
                <span>Activation Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <div className="h-1.5 bg-white/10 overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-[#ffd800]"
                ></motion.div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 shrink-0">
               <div className="text-right border-r border-white/10 pr-6 hidden md:block">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Calculated Runway</span>
                  <span className="text-3xl font-black text-white">{runway === null ? "--" : runway === 99 ? "∞" : `${runway} MO`}</span>
               </div>
               <div className="flex flex-col sm:flex-row gap-2">
                 <button onClick={resetModule} className="p-3 bg-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-400/10 transition-all rounded-sm">
                   <RefreshCcw className="w-4 h-4" />
                 </button>
                 <Link href={modules.find(m => m.status === 'not_started')?.id ? `/dashboard/financials/${modules.find(m => m.status === 'not_started')?.id}` : '/dashboard/financials/metrics'} className="px-8 py-3 bg-[#ffd800] text-[#022f42] font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg active:scale-95">
                   {overallProgress === 0 ? "Initial Setup" : overallProgress === 100 ? "Re-Simulate" : "Continue"}
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, index) => {
          const isLocked = mod.status === "locked";
          const isCompleted = mod.status === "completed";
          const href = isLocked ? "#" : `/dashboard/financials/${mod.id}`;
          
          return (
            <Link key={mod.id} href={href} className={`group block p-6 border-2 transition-all duration-300 relative ${getStatusColor(mod.status)} ${isLocked ? "cursor-not-allowed opacity-50" : "hover:scale-[1.02] hover:shadow-2xl cursor-pointer"}`}>
               {isCompleted && (
                 <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-1 rounded-full shadow-lg z-20">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
               )}
               
               <div className="flex justify-between items-start mb-6">
                 <div className="w-10 h-10 bg-[#022f42] text-[#ffd800] flex items-center justify-center font-black rounded-sm shadow-md group-hover:bg-[#ffd800] group-hover:text-[#022f42] transition-colors">
                   <mod.icon className="w-5 h-5" />
                 </div>
                 <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1e4a62]/40 bg-[#f2f6fa] px-2 py-1 rounded-sm">
                   {mod.time}
                 </div>
               </div>
               
               <div className="mb-4">
                 <div className="text-[10px] font-black text-[#1e4a62]/40 uppercase tracking-widest mb-1">{mod.num}</div>
                 <h3 className="font-black text-[#022f42] leading-tight text-lg mb-2">{mod.title}</h3>
                 <p className="text-[11px] text-[#1e4a62]/80 leading-relaxed min-h-[3rem]">{mod.desc}</p>
               </div>

               {!isLocked ? (
                 <div className="flex items-center gap-2 text-[#022f42] font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all pt-4 border-t border-[rgba(2,47,66,0.05)]">
                   {isCompleted ? "Edit Parameters" : "Begin Module"} <ArrowRight className="w-3 h-3" />
                 </div>
               ) : (
                 <div className="pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest mb-1">
                      Locked By Dependency <ChevronRight className="w-3 h-3" />
                    </div>
                    <p className="text-[9px] text-gray-400 leading-tight">
                      Requires completion of {financialModules[index - 1]?.num} to ensure mathematical data integrity.
                    </p>
                 </div>
               )}
            </Link>
          );
        })}
      </div>

      {/* Compliance & Benchmarking Footnote */}
      <div className="mt-16 bg-[#f2f6fa] p-10 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#022f42]"></div>
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="bg-white p-4 shadow-sm shrink-0 border border-gray-50">
             <Landmark className="w-8 h-8 text-[#022f42]" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#022f42] uppercase tracking-widest mb-3">Institutional Benchmark Compliance</h4>
            <p className="text-xs text-[#1e4a62] leading-relaxed max-w-3xl">
              By reporting your financials through FundabilityOS, you ensure that your metrics are aligned with the <strong>Standard Venture Reporting Framework (SVRF)</strong>. This data is used to populate your automated Data Room (Module 2.5) and calculate your LTV:CAC ratios, which are critical for Series A readiness. All data remains local unless you explicitly authorize an investor data-share.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
               <div className="flex items-center gap-2 text-[10px] font-bold text-[#022f42]/60 bg-white px-3 py-1.5 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> GAAP Aligned
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-[#022f42]/60 bg-white px-3 py-1.5 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> SVRF Compliant
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-[#022f42]/60 bg-white px-3 py-1.5 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> SOC2 Simulation
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
