"use client";

import { CheckCircle2, Circle, Lock, ArrowRight, PlayCircle, FileText, Download } from "lucide-react";
import Link from "next/link";

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

export default function RoadmapPage() {
  return (
    <div className="max-w-4xl mx-auto text-[#022f42] p-6 lg:p-10 text-[#022f42]">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#022f42]">
          Your Fundraising Roadmap
        </h1>
        <p className="text-[#1e4a62] mt-2 text-lg">
          A step-by-step curriculum to close your Seed round, tailored to your fundability score.
        </p>
      </div>

      <div className="relative border-l-4 border-[rgba(2,47,66,0.12)] ml-4 space-y-12 pb-12">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-8 md:pl-12">
            {/* Timeline Node */}
            <div className={`absolute -left-[22px] top-1 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#f2f6fa] shadow-sm ${
              step.status === 'completed' ? 'bg-green-500 text-white' : 
              step.status === 'in-progress' ? 'bg-[#ffd800] text-[#022f42]' : 
              'bg-[#e2e8f0] text-[#64748b]'
            }`}>
              {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
               step.status === 'in-progress' ? <PlayCircle className="w-5 h-5" fill="currentColor" /> : 
               <Lock className="w-4 h-4" />}
            </div>

            {/* Content Card */}
            <div className={`bg-white p-6 md:p-8 border ${
              step.status === 'in-progress' ? 'border-[#ffd800] shadow-[0_25px_45px_-15px_rgba(255,216,0,0.15)] ring-1 ring-[#ffd800]' : 
              'border-[rgba(2,47,66,0.12)] shadow-sm opacity-75'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold uppercase tracking-widest ${
                  step.status === 'in-progress' ? 'text-[#022f42] bg-[#ffd800] px-2 py-0.5' : 'text-[#64748b]'
                }`}>
                  {step.phase}
                </span>
                <span className="text-xs font-bold text-[#1e4a62] uppercase tracking-wider">{step.time}</span>
              </div>
              <h3 className={`text-2xl font-bold mt-3 mb-3 ${step.status === 'locked' ? 'text-[#1e4a62]' : 'text-[#022f42]'}`}>
                {step.title}
              </h3>
              <p className="text-[#1e4a62] mb-6 leading-relaxed">
                {step.description}
              </p>
              
              {step.status === 'in-progress' ? (
                <div className="space-y-4">
                  <div className="bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] p-4 flex items-center justify-between group cursor-pointer hover:border-[#ffd800] transition-colors">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-[#022f42] mr-3" />
                      <div>
                        <div className="font-bold text-[#022f42] text-sm">Download Financial Template</div>
                        <div className="text-xs text-[#1e4a62] mt-0.5">XLSX • 2.4MB</div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-[#1e4a62] group-hover:text-[#022f42]" />
                  </div>
                  <button className="w-full sm:w-auto px-6 py-3 bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] font-bold uppercase tracking-widest transition-all text-xs flex items-center justify-center border-2 border-[#022f42] hover:border-[#ffd800]">
                    {step.action} <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ) : (
                <button disabled className="px-6 py-3 bg-[#f2f6fa] text-[#1e4a62] font-bold uppercase tracking-widest text-xs flex items-center border border-[rgba(2,47,66,0.12)]">
                  <Lock className="w-3 h-3 mr-2" /> {step.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
