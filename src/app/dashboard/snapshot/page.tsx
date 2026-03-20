"use client";

import { Download, Share2, Eye, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

export default function InvestorSnapshotPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{companyName: string, industry: string}>({ companyName: "", industry: "" });
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
       try {
         const p = JSON.parse(localStorage.getItem(`startup_profile_${user.id}`) || "{}");
         setProfile(p);
         const s = JSON.parse(localStorage.getItem(`fundability_score_${user.id}`) || "{}");
         if (s.overall) setScore(s.overall);
       } catch (e) {}
    }
  }, [user?.id]);
  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 text-[#022f42]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#022f42]">
            Investor Snapshot
          </h1>
          <p className="text-[#1e4a62] mt-2 text-lg">
            A one-page verifiable summary of your startup&apos;s health to share with investors.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-[rgba(2,47,66,0.12)] hover:bg-[#f2f6fa] text-[#022f42] transition-colors text-xs font-bold uppercase tracking-widest shadow-sm">
            <Share2 className="w-4 h-4" />
            <span>Share Link</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-2.5 bg-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] text-white transition-all text-xs font-bold uppercase tracking-widest shadow-lg">
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* The Snapshot Document */}
      <div className="bg-white p-10 md:p-14 shadow-[0_35px_55px_-18px_rgba(2,47,66,0.15)] border border-[rgba(2,47,66,0.12)] relative overflow-hidden">
        
        {/* Verification Badge */}
        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 flex items-center shadow-md">
           <CheckCircle2 className="w-3 h-3 mr-1.5" /> FundabilityOS Verified Data
        </div>

        <div className="flex justify-between items-start border-b-2 border-[#022f42] pb-8 mb-8 mt-4">
           <div>
              <h2 className="text-4xl font-black text-[#022f42] tracking-tight">{profile.companyName || "Your Startup"}</h2>
              <div className="text-lg text-[#1e4a62] mt-1 font-medium">{profile.industry || "Uncategorized Sector"}</div>
              <div className="flex items-center mt-4 space-x-4 text-sm font-semibold text-[#022f42] uppercase tracking-wider">
                 <span>San Francisco, CA</span>
                 <span className="text-[rgba(2,47,66,0.2)]">|</span>
                 <span>Founded 2023</span>
                 <span className="text-[rgba(2,47,66,0.2)]">|</span>
                 <span>Delaware C-Corp</span>
              </div>
           </div>
           <div className="text-right">
              <div className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest mb-1">Fundability Score</div>
              <div className="text-6xl font-black text-[#ffd800] drop-shadow-sm">{score > 0 ? score : "-"}</div>
              <div className="text-xs text-[#022f42] mt-1 font-bold uppercase tracking-wider bg-[#f2f6fa] px-2 py-1 inline-block">Percentile: 42nd</div>
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
           {/* Left Column */}
           <div className="space-y-8">
              <div>
                 <h3 className="text-lg font-bold text-[#022f42] uppercase tracking-widest border-b border-[rgba(2,47,66,0.12)] pb-2 mb-4">Financial Health</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f2f6fa] p-4 border-l-4 border-[#022f42]">
                       <div className="text-xs text-[#1e4a62] uppercase tracking-widest font-bold mb-1">MRR</div>
                       <div className="text-2xl font-black text-[#022f42]">$11,000</div>
                    </div>
                    <div className="bg-[#f2f6fa] p-4 border-l-4 border-red-500">
                       <div className="text-xs text-[#1e4a62] uppercase tracking-widest font-bold mb-1">Burn Rate</div>
                       <div className="text-2xl font-black text-red-600">-$15,000</div>
                    </div>
                    <div className="bg-[#f2f6fa] p-4 border-l-4 border-[#ffd800]">
                       <div className="text-xs text-[#1e4a62] uppercase tracking-widest font-bold mb-1">Runway</div>
                       <div className="text-2xl font-black text-[#022f42]">6.5 mos</div>
                    </div>
                    <div className="bg-[#f2f6fa] p-4 border-l-4 border-green-500">
                       <div className="text-xs text-[#1e4a62] uppercase tracking-widest font-bold mb-1">Gross Margin</div>
                       <div className="text-2xl font-black text-[#022f42]">77.5%</div>
                    </div>
                 </div>
              </div>

              <div>
                 <h3 className="text-lg font-bold text-[#022f42] uppercase tracking-widest border-b border-[rgba(2,47,66,0.12)] pb-2 mb-4">Traction</h3>
                 <ul className="space-y-3 text-sm text-[#022f42] font-medium">
                    <li className="flex justify-between items-center bg-[#f2f6fa] p-3">
                       <span>Active Customers</span> <span className="font-bold text-lg">42</span>
                    </li>
                    <li className="flex justify-between items-center bg-[#f2f6fa] p-3">
                       <span>MoM Growth (Avg 6mo)</span> <span className="font-bold text-lg text-green-600">12.4%</span>
                    </li>
                    <li className="flex justify-between items-center bg-[#f2f6fa] p-3">
                       <span>LTV / CAC Ratio</span> <span className="font-bold text-lg">6.9x</span>
                    </li>
                 </ul>
              </div>
           </div>

           {/* Right Column */}
           <div className="space-y-8">
              <div>
                 <h3 className="text-lg font-bold text-[#022f42] uppercase tracking-widest border-b border-[rgba(2,47,66,0.12)] pb-2 mb-4">The Round</h3>
                 <div className="bg-[#022f42] text-white p-6 shadow-md border-l-4 border-[#ffd800]">
                    <div className="text-xs text-[#b0d0e0] uppercase tracking-widest font-bold mb-1">Seeking Pre-Seed</div>
                    <div className="text-4xl font-black text-[#ffd800] mb-4">$750k</div>
                    <div className="flex justify-between text-sm font-medium border-t border-[#1b4f68] pt-3">
                       <span className="text-[#b0d0e0]">Instrument:</span> 
                       <span className="font-bold">SAFE (Post-Money)</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium pt-2">
                       <span className="text-[#b0d0e0]">Valuation Cap:</span> 
                       <span className="font-bold">$6M</span>
                    </div>
                 </div>
              </div>

              <div>
                 <h3 className="text-lg font-bold text-[#022f42] uppercase tracking-widest border-b border-[rgba(2,47,66,0.12)] pb-2 mb-4">Data Room</h3>
                 <div className="space-y-2">
                    <button className="w-full flex justify-between items-center p-4 bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] hover:border-[#ffd800] transition-colors group">
                       <div className="font-bold text-[#022f42] text-sm">Pitch Deck (Q2 2024)</div>
                       <Eye className="w-4 h-4 text-[#1e4a62] group-hover:text-[#ffd800]" />
                    </button>
                    <button className="w-full flex justify-between items-center p-4 bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] hover:border-[#ffd800] transition-colors group">
                       <div className="font-bold text-[#022f42] text-sm">Financial Model (24mo)</div>
                       <Eye className="w-4 h-4 text-[#1e4a62] group-hover:text-[#ffd800]" />
                    </button>
                    <button className="w-full flex justify-between items-center p-4 bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] hover:border-[#ffd800] transition-colors group">
                       <div className="font-bold text-[#022f42] text-sm flex items-center">
                          Cap Table
                          <ShieldAlert className="w-3 h-3 ml-2 text-yellow-600" />
                       </div>
                       <Eye className="w-4 h-4 text-[#1e4a62] group-hover:text-[#ffd800]" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(2,47,66,0.12)] text-center text-xs text-[#1e4a62] font-semibold uppercase tracking-wider">
           Generated by FundabilityOS FundabilityOS — Confidential
        </div>
      </div>
    </div>
  );
}
