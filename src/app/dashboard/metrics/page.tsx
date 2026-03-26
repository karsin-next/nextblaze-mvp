"use client";

import { motion } from "framer-motion";
import { 
  Calculator, Activity, Wallet, CheckCircle2, ChevronRight, PlayCircle, 
  ArrowRight, DollarSign, TrendingUp, RefreshCcw, Landmark, Flame, 
  Eye, PieChart, LayoutDashboard, Sparkles
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const investorModules = [
  { id: "runway", title: "Runway & Burn Visualizer", icon: Flame, desc: "Monitor your proximity to zero-cash and model survival scenarios.", status: "not_started", time: "5 min", num: "2.2.1" },
  { id: "revenue", title: "Revenue & Growth Index", icon: TrendingUp, desc: "Track your MoM growth velocity and compounding impact.", status: "locked", time: "4 min", num: "2.2.2" },
  { id: "expenses", title: "Expense Allocation Audit", icon: PieChart, desc: "Audit your capital efficiency and institutional bucket distribution.", status: "locked", time: "3 min", num: "2.2.3" },
  { id: "views", title: "Custom Reporting Canvas", icon: Eye, desc: "Launch your personalized investor dashboard and reporting views.", status: "locked", time: "5 min", num: "2.2.4" },
];

export default function InvestorDashboardHubPage() {
  const { user } = useAuth();
  const [modules, setModules] = useState(investorModules);
  const [overallProgress, setOverallProgress] = useState(0);
  const [runway, setRunway] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Read sub-module completion from localStorage
    const mockState = investorModules.map((m) => {
      const isCompleted = localStorage.getItem(`audit_2_2_${m.id}`) === "completed" || 
                          (m.num === "2.2.1" && localStorage.getItem("audit_2_2_1") === "completed") ||
                          (m.num === "2.2.2" && localStorage.getItem("audit_2_2_2") === "completed") ||
                          (m.num === "2.2.3" && localStorage.getItem("audit_2_2_3") === "completed") ||
                          (m.num === "2.2.4" && localStorage.getItem("audit_2_2_4") === "completed");
      
      return {
        ...m,
        status: isCompleted ? "completed" : "locked"
      };
    });

    // Sequential Activation Logic
    if (mockState[0].status !== "completed") mockState[0].status = "not_started";
    if (mockState[0].status === "completed" && mockState[1].status !== "completed") mockState[1].status = "not_started";
    if (mockState[1].status === "completed" && mockState[2].status !== "completed") mockState[2].status = "not_started";
    if (mockState[2].status === "completed" && mockState[3].status !== "completed") mockState[3].status = "not_started";
    
    setModules(mockState);
    const completedCount = mockState.filter(m => m.status === 'completed').length;
    setOverallProgress(Math.round((completedCount / investorModules.length) * 100));

    // Get current runway from financial snapshot if available
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
    if (confirm("Are you sure you want to reset all Investor Dashboard data?")) {
      localStorage.removeItem("audit_2_2_1");
      localStorage.removeItem("audit_2_2_2");
      localStorage.removeItem("audit_2_2_3");
      localStorage.removeItem("audit_2_2_4");
      localStorage.removeItem("audit_2_2_runway");
      localStorage.removeItem("audit_2_2_revenue");
      localStorage.removeItem("audit_2_2_expenses");
      localStorage.removeItem("audit_2_2_views");
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
          Module 2.2
        </div>
        <h1 className="text-4xl font-black mb-3 relative z-10 tracking-tight">INVESTOR DASHBOARD</h1>
        <p className="text-[#b0d0e0] text-sm max-w-2xl leading-relaxed relative z-10 font-medium opacity-80">
          Consolidate your financial narrative into high-fidelity visualizations. 
          Use these sub-modules to audit your burn, growth, and capital efficiency before generating your live reporting views.
        </p>
        
        <div className="mt-10 bg-white/5 p-6 border border-white/10 relative z-10 shadow-inner">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[#ffd800] mb-3">
                <span>Narrative Completion</span>
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
               <div className="text-right border-r border-white/20 pr-6 hidden md:block">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Current Runway</span>
                  <span className="text-3xl font-black text-white leading-none">{runway === null ? "--" : runway === 99 ? "∞" : `${runway} MO`}</span>
               </div>
               <div className="flex flex-col sm:flex-row gap-2">
                 <button onClick={resetModule} title="Reset Audit" className="p-3 bg-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-400/10 transition-all rounded-sm">
                   <RefreshCcw className="w-4 h-4" />
                 </button>
                 <Link href={modules.find(m => m.status === 'not_started')?.id ? `/dashboard/metrics/${modules.find(m => m.status === 'not_started')?.id}` : '/dashboard/metrics/runway'} className="px-8 py-3 bg-[#ffd800] text-[#022f42] font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg active:scale-95 flex items-center gap-2">
                   {overallProgress === 100 ? "Review Dashboard" : "Resume Audit"} <ArrowRight className="w-3 h-3" />
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {modules.map((mod, index) => {
          const isLocked = mod.status === "locked";
          const isCompleted = mod.status === "completed";
          const href = isLocked ? "#" : `/dashboard/metrics/${mod.id}`;
          
          return (
            <Link key={mod.id} href={href} className={`group block p-6 border-2 transition-all duration-300 relative rounded-sm ${getStatusColor(mod.status)} ${isLocked ? "cursor-not-allowed opacity-50" : "hover:scale-[1.02] hover:shadow-2xl cursor-pointer"}`}>
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
               
               <div className="mb-4 min-h-[140px]">
                 <div className="text-[10px] font-black text-[#1e4a62]/40 uppercase tracking-widest mb-1">{mod.num}</div>
                 <h3 className="font-black text-[#022f42] leading-tight text-lg mb-2">{mod.title}</h3>
                 <p className="text-[11px] text-[#1e4a62]/80 leading-relaxed">{mod.desc}</p>
               </div>

               {!isLocked ? (
                 <div className="flex items-center gap-2 text-[#022f42] font-black text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all pt-4 border-t border-[rgba(2,47,66,0.05)]">
                   {isCompleted ? "Edit Metrics" : "Begin Audit"} <ArrowRight className="w-3 h-3" />
                 </div>
               ) : (
                 <div className="pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-gray-400 font-black text-[8px] uppercase tracking-widest mb-1">
                      Locked By Dependency
                    </div>
                 </div>
               )}
            </Link>
          );
        })}
      </div>

      {/* Actionable CTA for Dashboard Launch */}
      {overallProgress >= 75 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-4 border-[#022f42] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl rounded-sm">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#ffd800] flex items-center justify-center rounded-sm shrink-0">
                 <LayoutDashboard className="w-8 h-8 text-[#022f42]" />
              </div>
              <div>
                 <h2 className="text-xl font-black text-[#022f42] uppercase tracking-tight">Consolidated View Ready</h2>
                 <p className="text-xs text-[#1e4a62] font-medium max-w-md">Your financial narrative is sufficiently complete to generate custom reporting views for stakeholders.</p>
              </div>
           </div>
           <Link href="/dashboard/metrics/views" className="bg-[#022f42] text-white px-10 py-5 font-black uppercase tracking-widest text-sm hover:bg-[#ffd800] hover:text-[#022f42] transition-all flex items-center gap-3 shadow-xl">
              Launch Custom Canvas <Eye className="w-4 h-4" />
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
              Investor Communication Framework
            </h4>
            <div className="text-xs text-[#1e4a62] leading-relaxed max-w-4xl space-y-4 font-medium opacity-80">
              <p>
                Module 2.2 transforms raw numbers into **investor-ready storytelling**. While qualitative audit responses establish trust, the **Investor Dashboard** provides the quantitative backbone required for term sheet negotiations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="bg-white p-4 border border-gray-100 shadow-sm">
                  <h5 className="font-black text-[9px] uppercase tracking-widest mb-2 text-[#022f42]">Growth Signal</h5>
                  <p className="text-[10px]">Your MoM growth rate is the primary proxy for Product-Market Fit velocity.</p>
                </div>
                <div className="bg-white p-4 border border-gray-100 shadow-sm">
                  <h5 className="font-black text-[9px] uppercase tracking-widest mb-2 text-[#022f42]">Burn Logic</h5>
                  <p className="text-[10px]">Capital efficiency audit ensures you aren&apos;t leaking cash into low-ROI overhead.</p>
                </div>
                <div className="bg-white p-4 border border-gray-100 shadow-sm">
                  <h5 className="font-black text-[9px] uppercase tracking-widest mb-2 text-[#022f42]">Reporting Standards</h5>
                  <p className="text-[10px]">Custom views allow you to control the data narrative for different investor types.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
