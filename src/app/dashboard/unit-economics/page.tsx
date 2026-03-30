"use client";

import { motion } from "framer-motion";
import { 
  Calculator, Activity, Wallet, CheckCircle2, ChevronRight, PlayCircle, 
  ArrowRight, DollarSign, TrendingUp, RefreshCcw, Landmark, Target,
  PieChart, LayoutDashboard, Sparkles, Scale
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const unitEconModules = [
  { id: "cac", title: "CAC Calculator", icon: Target, desc: "Quantify your acquisition costs across media and headcount.", status: "not_started", time: "4 min", num: "2.3.1" },
  { id: "ltv", title: "LTV Analytics", icon: TrendingUp, desc: "Model customer lifetime value and retention compounding.", status: "locked", time: "5 min", num: "2.3.2" },
  { id: "margin", title: "Margin Workbench", icon: Scale, desc: "Audit your COGS and gross margin scalability thresholds.", status: "locked", time: "3 min", num: "2.3.3" },
  { id: "ccc", title: "Cash Conversion Cycle", icon: Activity, desc: "Optimize your working capital and operational tie-up days.", status: "locked", time: "4 min", num: "2.3.4" },
  { id: "report", title: "Investor Report", icon: LayoutDashboard, desc: "Unified reporting view blending dashboard and unit economics.", status: "locked", time: "6 min", num: "2.3.5" },
];

export default function UnitEconomicsHubPage() {
  const { user } = useAuth();
  const [modules, setModules] = useState(unitEconModules);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Read sub-module completion
    const mockState = unitEconModules.map((m) => {
      const isCompleted = localStorage.getItem(`audit_2_3_${m.id}`) === "completed" || 
                          (m.num === "2.3.1" && localStorage.getItem("audit_2_3_1") === "completed") ||
                          (m.num === "2.3.2" && localStorage.getItem("audit_2_3_2") === "completed") ||
                          // Handle variations in storage naming
                          (localStorage.getItem(`audit_2_3_${m.id.split('/')[0]}`) === "completed");
      
      return {
        ...m,
        status: isCompleted ? "completed" : "locked"
      };
    });

    // Sequential Activation Logic
    if (mockState[0].status !== "completed") mockState[0].status = "not_started";
    for (let i = 1; i < mockState.length; i++) {
      if (mockState[i-1].status === "completed" && mockState[i].status !== "completed") {
        mockState[i].status = "not_started";
      }
    }
    
    setModules(mockState);
    const completedCount = mockState.filter(m => m.status === 'completed').length;
    setOverallProgress(Math.round((completedCount / unitEconModules.length) * 100));
  }, []);

  const resetModule = () => {
    if (typeof window === 'undefined') return;
    if (confirm("Reset all Unit Economics data?")) {
      [1,2,3,4,5].forEach(i => localStorage.removeItem(`audit_2_3_${i}`));
      ['cac', 'ltv', 'margin', 'ccc', 'report'].forEach(k => localStorage.removeItem(`audit_2_3_${k}`));
      window.location.reload();
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "not_started": return "bg-white text-[#022f42] border-[rgba(2,47,66,0.1)] hover:border-[#022f42]";
      default: return "bg-[#fcfdfd] text-[#1e4a62] border-[rgba(2,47,66,0.05)] opacity-50";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      
      {/* Premium Hub Header */}
      <div className="mb-8 bg-[#022f42] text-white p-10 shadow-2xl relative overflow-hidden group border-b-8 border-[#ffd800] rounded-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffd800] rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
        <div className="inline-block bg-[#ffd800] text-[#022f42] font-black px-4 py-1 mb-5 text-[10px] uppercase tracking-[0.3em] relative z-10">
          Module 2.3
        </div>
        <h1 className="text-4xl font-black mb-3 relative z-10 tracking-tight">CASH DYNAMICS & UNIT ECONOMICS</h1>
        <p className="text-[#b0d0e0] text-sm max-w-2xl leading-relaxed relative z-10 font-medium opacity-80 uppercase tracking-[0.05em]">
          Master your LTV:CAC logic and maximize operational efficiency. 
          A short CCC and high unit-margin are the definitive signals of a venture-scale business.
        </p>
        
        <div className="mt-10 bg-white/5 p-6 border border-white/10 relative z-10 shadow-inner">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd800] mb-3">
                <span>Efficiency Progress</span>
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
               <div className="flex flex-col sm:flex-row gap-2">
                 <button onClick={resetModule} title="Reset Progress" className="p-3 bg-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-400/10 transition-all rounded-sm">
                   <RefreshCcw className="w-4 h-4" />
                 </button>
                 <Link href={modules.find(m => m.status === 'not_started')?.id ? `/dashboard/unit-economics/${modules.find(m => m.status === 'not_started')?.id}` : '/dashboard/unit-economics/cac'} className="px-8 py-3 bg-[#ffd800] text-[#022f42] font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg active:scale-95 flex items-center gap-2">
                   {overallProgress === 100 ? "Review Work" : "Resume Analysis"} <ArrowRight className="w-3 h-3" />
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {modules.map((mod, index) => {
          const isLocked = mod.status === "locked";
          const isCompleted = mod.status === "completed";
          const href = isLocked ? "#" : `/dashboard/unit-economics/${mod.id}`;
          
          return (
            <Link key={mod.id} href={href} className={`group block p-5 border-2 transition-all duration-300 relative rounded-sm ${getStatusColor(mod.status)} ${isLocked ? "cursor-not-allowed opacity-50" : "hover:scale-[1.02] hover:shadow-2xl cursor-pointer"}`}>
               {isCompleted && (
                 <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg z-20">
                    <CheckCircle2 className="w-4 h-4" />
                 </div>
               )}
               
               <div className="flex justify-between items-start mb-4">
                 <div className="w-10 h-10 bg-[#022f42] text-[#ffd800] flex items-center justify-center font-black rounded-sm shadow-md group-hover:bg-[#ffd800] group-hover:text-[#022f42] transition-colors">
                   <mod.icon className="w-5 h-5" />
                 </div>
               </div>
               
               <div className="mb-4 min-h-[140px]">
                 <div className="text-[9px] font-black text-[#1e4a62]/40 uppercase tracking-widest mb-1">{mod.num}</div>
                 <h3 className="font-black text-[#022f42] leading-tight text-base mb-2">{mod.title}</h3>
                 <p className="text-[10px] text-[#1e4a62]/80 leading-relaxed font-medium">{mod.desc}</p>
               </div>

               {!isLocked ? (
                 <div className="flex items-center gap-2 text-[#022f42] font-black text-[9px] uppercase tracking-widest group-hover:gap-4 transition-all pt-4 border-t border-[rgba(2,47,66,0.05)]">
                   {isCompleted ? "Re-Analyze" : "Begin"} <ArrowRight className="w-3 h-3" />
                 </div>
               ) : (
                 <div className="pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-gray-400 font-black text-[8px] uppercase tracking-widest mb-1">
                      Locked
                    </div>
                 </div>
               )}
            </Link>
          );
        })}
      </div>

      {/* Actionable CTA for Final Report */}
      {overallProgress >= 80 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-4 border-[#022f42] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl rounded-sm">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#ffd800] flex items-center justify-center rounded-sm shrink-0">
                 <LayoutDashboard className="w-8 h-8 text-[#022f42]" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-[#022f42] uppercase tracking-tight">Final Report Enabled</h2>
                 <p className="text-xs text-[#1e4a62] font-medium max-w-md">Your unit economics are sufficiently audited to generate the consolidated Investor Report.</p>
              </div>
           </div>
           <Link href="/dashboard/unit-economics/report" className="bg-[#022f42] text-white px-10 py-5 font-black uppercase tracking-widest text-sm hover:bg-[#ffd800] hover:text-[#022f42] transition-all flex items-center gap-3 shadow-xl">
              Compile Investor Report <ArrowRight className="w-4 h-4" />
           </Link>
        </motion.div>
      )}

      {/* AI Strategy Insights */}
      <div className="mt-12 bg-[#f2f6fa] p-8 border border-[rgba(2,47,66,0.1)] relative overflow-hidden rounded-sm">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#ffd800]"></div>
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="bg-white p-4 shadow-md shrink-0 border border-gray-50">
             <Sparkles className="w-6 h-6 text-[#ffd800]" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#022f42] uppercase tracking-widest mb-2 flex items-center gap-2">
              Efficiency Standards
            </h4>
            <div className="text-xs text-[#1e4a62] leading-relaxed max-w-4xl space-y-4 font-medium opacity-80">
              <p>
                Module 2.3 determines the **operational sanity** of your growth. While revenue (2.2) shows scale, unit economics show whether that scale is sustainable or dilutive.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="bg-white p-4 border border-gray-100 shadow-sm">
                  <h5 className="font-black text-[9px] uppercase tracking-widest mb-2 text-[#022f42]">The 3:1 Rule</h5>
                  <p className="text-[10px]">A venture-scale business target an LTV that is at least 3x the CAC over a 3-year horizon.</p>
                </div>
                <div className="bg-white p-4 border border-gray-100 shadow-sm">
                  <h5 className="font-black text-[9px] uppercase tracking-widest mb-2 text-[#022f42]">Margin Moat</h5>
                  <p className="text-[10px]">Gross margins above 70% provide the R&amp;D budget required to maintain competitive defensibility.</p>
                </div>
                <div className="bg-white p-4 border border-gray-100 shadow-sm">
                  <h5 className="font-black text-[9px] uppercase tracking-widest mb-2 text-[#022f42]">The &quot;Holy Grail&quot;</h5>
                  <p className="text-[10px]">Customers pay you before you pay suppliers, funding your own growth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
