"use client";

import { CheckCircle2, Circle, Lock, ArrowRight, PlayCircle, FileText, Download, Sparkles } from "lucide-react";
import Link from "next/link";
import { ModuleHeader } from "@/components/ModuleHeader";
import { useState, useEffect } from "react";

const steps = [
  {
    phase: "Phase 1: Readiness",
    title: "Financial Model & Data Room",
    status: "in-progress",
    description: "Build a robust 24-month financial model and structure your initial corporate documents.",
    action: "Complete Financial Lesson",
    time: "Est: 2 weeks"
  },
  {
    phase: "Phase 2: Narrative",
    title: "Pitch Deck & Executive Summary",
    status: "locked",
    description: "Translate your traction into a compelling narrative for early-stage investors.",
    action: "Unlock after Phase 1",
    time: "Est: 3 weeks"
  },
  {
    phase: "Phase 3: Outreach",
    title: "Investor Targeting & CRM",
    status: "locked",
    description: "Identify 50+ right-fit investors and begin warm outbound sequencing.",
    action: "Unlock after Phase 2",
    time: "Est: 1 month"
  },
  {
    phase: "Phase 4: Execution",
    title: "Term Sheets & Due Diligence",
    status: "locked",
    description: "Navigate term sheets, coordinate legal due diligence, and close the round.",
    action: "Unlock after Phase 3",
    time: "Est: 2-3 months"
  }
];

export default function FundraisingRoadmapPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Persist completion state for the hub
    localStorage.setItem("audit_2_4_6", "completed");
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.4.6 STRATEGY: Roadmap"
        title="Fundraising Roadmap"
        description="A synchronized, phased curriculum designed to take you from initial readiness to a successful round closure."
      />

      <div className="mt-12 max-w-4xl mx-auto">
        <div className="relative border-l-4 border-[rgba(2,47,66,0.12)] ml-4 space-y-12 pb-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative pl-8 md:pl-12 font-medium">
              {/* Timeline Node */}
              <div className={`absolute -left-[22px] top-1 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#f2f6fa] shadow-sm ${
                step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                step.status === 'in-progress' ? 'bg-[#ffd800] text-[#022f42]' : 
                'bg-[#e2e8f0] text-[#64748b]'
              }`}>
                {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                 step.status === 'in-progress' ? <PlayCircle className="w-5 h-5" fill="currentColor" /> : 
                 <Lock className="w-4 h-4" />}
              </div>

              {/* Content Card */}
              <div className={`bg-white p-6 md:p-8 border rounded-sm transition-all duration-300 ${
                step.status === 'in-progress' ? 'border-[#022f42] shadow-2xl scale-[1.01]' : 
                'border-[rgba(2,47,66,0.12)] shadow-sm opacity-75 hover:opacity-100'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                    step.status === 'in-progress' ? 'text-[#022f42] bg-[#ffd800] px-2 py-0.5' : 'text-[#b0d0e0]'
                  }`}>
                    {step.phase}
                  </span>
                  <span className="text-[10px] font-black text-[#1e4a62] uppercase tracking-widest">{step.time}</span>
                </div>
                <h3 className={`text-xl font-black mt-3 mb-3 uppercase tracking-tight ${step.status === 'locked' ? 'text-[#1e4a62]/60' : 'text-[#022f42]'}`}>
                  {step.title}
                </h3>
                <p className="text-xs text-[#1e4a62]/80 mb-6 leading-relaxed">
                  {step.description}
                </p>
                
                {step.status === 'in-progress' ? (
                  <div className="space-y-4">
                    <div className="bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] p-4 flex items-center justify-between group cursor-pointer hover:border-[#022f42] transition-colors rounded-sm shadow-inner">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm mr-4 shadow-sm">
                           <FileText className="w-4 h-4 text-[#022f42]" />
                        </div>
                        <div>
                          <div className="font-black text-[#022f42] text-[11px] uppercase tracking-wider">Download Financial Template</div>
                          <div className="text-[10px] text-[#1e4a62] font-medium opacity-60">XLSX • 2.4MB</div>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-[#1e4a62] group-hover:text-[#022f42] group-hover:translate-y-0.5 transition-transform" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                       <button className="flex-1 px-8 py-4 bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] font-black uppercase tracking-[0.2em] transition-all text-[10px] flex items-center justify-center border-2 border-[#022f42] shadow-lg active:scale-95">
                         {step.action} <ArrowRight className="w-4 h-4 ml-2" />
                       </button>
                    </div>
                  </div>
                ) : (
                  <button disabled className="px-6 py-3 bg-[#f2f6fa] text-[#1e4a62]/40 font-black uppercase tracking-widest text-[9px] flex items-center border border-[rgba(2,47,66,0.05)] opacity-50">
                    <Lock className="w-3 h-3 mr-2" /> {step.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Summary AI */}
      <div className="mt-16 bg-[#022f42] p-10 text-white relative overflow-hidden rounded-sm border-b-8 border-[#ffd800] shadow-2xl max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd800] rounded-full blur-[100px] opacity-10"></div>
        <div className="relative z-10 flex items-start gap-6">
           <div className="w-12 h-12 bg-[#ffd800] flex items-center justify-center rounded-sm shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 text-[#022f42]" />
           </div>
           <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffd800] mb-3">AI Velocity Insight</h4>
              <p className="text-sm font-medium leading-relaxed text-[#b0d0e0] max-w-2xl">
                Based on your current fundability trajectory, you are approximately <strong className="text-white">4 months away</strong> from being round-ready. Completing Phase 1 (Data Room) will unlock the Investor Matchmaker (2.4.5) to accelerate Phase 3.
              </p>
           </div>
        </div>
      </div>

    </div>
  );
}
