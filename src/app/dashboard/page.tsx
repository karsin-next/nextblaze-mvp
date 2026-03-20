"use client";

import { motion } from "framer-motion";
import { 
  Target, Users, ShieldCheck, 
  TrendingUp, Globe, BarChart3, ChevronRight, CheckCircle2, PlayCircle, ClipboardList, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

const subModules = [
  { id: "1-problem", title: "The Problem Diagnostic", icon: Target, desc: "Are you solving a real, painful problem?", status: "not_started", time: "3 min" },
  { id: "2-customer", title: "Customer Clarity Scan", icon: Users, desc: "Who exactly is your early adopter?", status: "locked", time: "4 min" },
  { id: "3-competitor", title: "Competitive Positioning", icon: ShieldCheck, desc: "Where is your white space?", status: "locked", time: "5 min" },
  { id: "4-product", title: "Product Readiness", icon: PlayCircle, desc: "Stage of development & uniqueness.", status: "locked", time: "2 min" },
  { id: "5-market", title: "Market Opportunity Sizer", icon: Globe, desc: "TAM/SAM/SOM and timing.", status: "locked", time: "4 min" },
  { id: "6-pmf", title: "Product-Market Fit Probe", icon: TrendingUp, desc: "Vitamin vs. Painkiller analysis.", status: "locked", time: "3 min" },
  { id: "7-revenue", title: "Revenue Model Explorer", icon: BarChart3, desc: "Pricing power and margins.", status: "locked", time: "4 min" },
  { id: "8-team", title: "Team Composition Audit", icon: Users, desc: "Founding team strength and gaps.", status: "locked", time: "3 min" },
];

export default function AuditHubPage() {
  const { user } = useAuth();
  const [modules, setModules] = useState(subModules);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || !user?.id) return;
    
    // Read completed modules from localStorage scoped to user
    const mockState = subModules.map((m) => {
      const isCompleted = localStorage.getItem(`audit_${m.id}_${user.id}`) === 'completed';
      return {
        ...m,
        status: isCompleted ? "completed" : "not_started"
      };
    });
    
    setModules(mockState);
    const completedCount = mockState.filter(m => m.status === 'completed').length;
    setOverallProgress(Math.round((completedCount / subModules.length) * 100));
  }, [user?.id]);

  const resetAudit = () => {
    if (typeof window === 'undefined' || !user?.id) return;
    if (confirm("Are you sure you want to wipe this diagnostic? All progress will be lost.")) {
      subModules.forEach(m => {
        localStorage.removeItem(`audit_${m.id}_${user.id}`);
        localStorage.removeItem(`audit_${m.id}_data_${user.id}`);
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd800] rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-4 text-[10px] uppercase tracking-widest relative z-10">
          Module 1.1
        </div>
        <h1 className="text-3xl font-bold mb-3 relative z-10">The 360° Fundability Audit</h1>
        <p className="text-[#b0d0e0] text-sm max-w-2xl leading-relaxed relative z-10">
          Stop guessing. Start measuring exactly where you stand through an investor&apos;s lens. Complete these 8 core diagnostics to establish your baseline fundability score and identify critical gaps.
        </p>
        
        <div className="mt-8 bg-white/10 p-4 border border-white/20 relative z-10 flex items-center justify-between">
          <div className="flex-1 mr-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#b0d0e0] mb-2">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="h-2 bg-[rgba(2,47,66,0.5)] overflow-hidden">
              <div className="h-full bg-[#ffd800] transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={resetAudit} className="px-6 py-2.5 bg-transparent text-[#b0d0e0] font-bold uppercase tracking-widest text-xs border border-[#b0d0e0]/30 hover:bg-[#b0d0e0]/10 transition-colors shrink-0">
              Reset Audit
            </button>
            <Link href={modules.find(m => m.status === 'not_started')?.id ? `/dashboard/audit/${modules.find(m => m.status === 'not_started')?.id}` : '#'} className="px-6 py-2.5 bg-[#ffd800] text-[#022f42] font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors shrink-0">
              {overallProgress === 0 ? "Start Audit" : overallProgress === 100 ? "Audit Complete" : "Continue"}
            </Link>
            <Link href="/dashboard/score" className="px-6 py-2.5 bg-white text-[#022f42] font-bold uppercase tracking-widest text-xs border border-transparent hover:border-white hover:bg-transparent hover:text-white transition-colors shrink-0 flex items-center">
              View Live Score <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod, index) => {
          const isLocked = mod.status === "locked";
          const href = isLocked ? "#" : `/dashboard/audit/${mod.id}`;
          
          return (
            <Link key={mod.id} href={href} className={`block p-5 border-2 transition-all duration-300 relative ${getStatusColor(mod.status)} ${isLocked ? "cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-lg cursor-pointer"}`}>
               {mod.status === "in_progress" && (
                 <span className="absolute -top-3 -right-3 flex h-6 w-6">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#022f42] opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-6 w-6 bg-[#022f42]"></span>
                 </span>
               )}
               
               <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 flex items-center justify-center font-bold text-lg opacity-40">
                     {index + 1}
                   </div>
                   <mod.icon className={`w-6 h-6 ${isLocked ? "opacity-40" : ""}`} />
                 </div>
                 <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${isLocked ? "opacity-40" : ""}`}>{mod.time}</span>
                   {getStatusIcon(mod.status)}
                 </div>
               </div>
               
               <div className="pl-11">
                 <h3 className={`font-bold mb-1 ${isLocked ? "opacity-60" : ""}`}>{mod.title}</h3>
                 <p className={`text-xs ${isLocked ? "opacity-50" : "opacity-80"}`}>{mod.desc}</p>
               </div>
            </Link>
          );
        })}
      </div>

      {/* ML Training Consent Notice */}
      <div className="mt-12 bg-white p-6 border border-[rgba(2,47,66,0.1)] flex items-start gap-4">
        <ClipboardList className="w-6 h-6 text-[#1e4a62] shrink-0 mt-1" />
        <div>
          <h4 className="text-sm font-bold text-[#022f42] mb-1">Data Engine Privacy</h4>
          <p className="text-xs text-[#1e4a62] leading-relaxed">
            By completing this audit, you consent to your anonymized data being used to train the FundabilityOS models. This allows us to provide peer benchmarking, predictive scoring, and highly personalized gap analysis while keeping your specific company data private and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
