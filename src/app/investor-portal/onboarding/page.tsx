"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InvestorOnboarding() {
  const router = useRouter();
  
  const finish = () => {
    if (typeof window !== 'undefined') localStorage.setItem('investor_profile_setup', 'true');
    router.push('/investor-portal');
  };

  return (
    <div className="min-h-screen bg-[#022f42] flex items-center justify-center p-4">
       <div className="max-w-xl w-full bg-white p-10 rounded-sm shadow-2xl">
          <div className="mb-8 border-b border-[rgba(2,47,66,0.1)] pb-6">
             <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-3 text-[10px] uppercase tracking-widest rounded-sm">
               Investor Partner
             </div>
             <h1 className="text-2xl font-bold text-[#022f42] mb-2">Welcome to Deal Flow</h1>
             <p className="text-[#1e4a62] text-sm leading-relaxed">Calibrate your AI Deal Matcher by mapping your investment thesis below. The engine will surface the highest-scoring verified startups that match your profile.</p>
          </div>
          
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42]">Typical Stage</label>
                <select className="w-full p-3 border border-[#1e4a62]/20 text-sm focus:border-[#022f42] outline-none bg-transparent font-medium">
                   <option>Pre-Seed ($250K - $1M)</option>
                   <option>Seed ($1M - $3M)</option>
                   <option>Series A ($3M - $10M)</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42]">Target Verticals (Multi-select)</label>
                <div className="grid grid-cols-2 gap-3">
                   {["B2B SaaS", "Fintech", "HealthTech", "Deep Tech", "Consumer", "Marketplace"].map((v, i) => (
                      <label key={i} className="flex items-center space-x-2 border border-[#1e4a62]/10 p-3 cursor-pointer hover:bg-[#f2f6fa] rounded-sm transition-colors border-l-4 hover:border-l-[#022f42]">
                         <input type="checkbox" className="accent-[#022f42]" defaultChecked={i < 2} />
                         <span className="text-sm font-bold text-[#022f42]">{v}</span>
                      </label>
                   ))}
                </div>
             </div>
             
             <button onClick={finish} className="w-full p-4 bg-[#022f42] text-white font-bold uppercase tracking-widest text-xs flex items-center justify-center hover:bg-[#ffd800] hover:text-[#022f42] transition-colors mt-8 rounded-sm">
                Initialize Deal Flow Engine <ArrowRight className="w-4 h-4 ml-2" />
             </button>
          </div>
       </div>
    </div>
  );
}
