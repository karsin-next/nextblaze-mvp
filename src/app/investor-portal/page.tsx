"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Filter, Star, Zap, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DiscoveryDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [deals, setDeals] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"affinity" | "score">("affinity");
  const [investorProfile, setInvestorProfile] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
       const invProfileRaw = localStorage.getItem(`investor_profile_${user.id}`);
       if (!invProfileRaw) {
         router.push('/investor-portal/onboarding');
         return;
       }
       const profile = JSON.parse(invProfileRaw);
       setInvestorProfile(profile);

       let mockList = [
         { id: "mock-1", name: "NeuroSync", oneLiner: "Brain-computer interfaces for remote operating machinery.", sector: "Deep Tech", stage: "Seed", score: 82, ask: "$2.5M", affinity: 45 },
         { id: "mock-2", name: "VaultPay", oneLiner: "Cross-border B2B payments using stablecoin rails.", sector: "Fintech", stage: "Series A", score: 94, ask: "$8.0M", affinity: 60 },
         { id: "mock-3", name: "MediChain", oneLiner: "Blockchain verified electronic health records.", sector: "HealthTech", stage: "Pre-Seed", score: 71, ask: "$750K", affinity: 20 },
       ];

       const keys = Object.keys(localStorage);
       const startupKeys = keys.filter(k => k.startsWith('startup_profile_'));
       
       startupKeys.forEach(startupKey => {
         try {
           const startupData = JSON.parse(localStorage.getItem(startupKey) || "{}");
           const userId = startupKey.replace('startup_profile_', '');
           
           let activeUserScore = Math.floor(Math.random() * 40) + 40;
           const scoreDataRaw = localStorage.getItem(`fundability_score_${userId}`);
           if (scoreDataRaw) {
              try { activeUserScore = JSON.parse(scoreDataRaw).overall; } catch(e) {}
           }

           // Calculate Affinity
           let affinityScore = 50;
           if (startupData.industry && profile.thesis?.toLowerCase().includes(startupData.industry.toLowerCase())) {
              affinityScore += 35;
           }
           if (activeUserScore >= 80) affinityScore += 10;
           affinityScore = Math.min(affinityScore + Math.floor(Math.random()*10), 99);

           mockList.unshift({
             id: userId,
             name: startupData.companyName || "Unknown Startup",
             oneLiner: startupData.oneLiner || "A stealth startup currently traversing the FundabilityOS diagnostic.",
             sector: startupData.industry || "B2B SaaS",
             stage: "Seed",
             score: activeUserScore || 50,
             ask: "TBD",
             affinity: affinityScore
           });
         } catch (e) {}
       });
       
       setDeals(mockList);
    }
  }, [user?.id, router]);

  const displayedDeals = [...deals].sort((a,b) => {
    if (sortBy === "affinity") return b.affinity - a.affinity;
    return b.score - a.score;
  });

  return (
    <div className="max-w-6xl w-full">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-[#1e4a62]/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#022f42] mb-2 flex items-center">Deal Discovery <Zap className="w-6 h-6 ml-3 text-[#ffd800] fill-current" /></h1>
          <p className="text-[#1e4a62] text-sm">AI-Curated pipeline matching your exact thesis: <strong className="text-[#022f42]">&quot;{investorProfile?.targetStage} / {investorProfile?.checkSize}&quot;</strong></p>
        </div>
        <div className="flex bg-white border border-[#1e4a62]/10 rounded-sm shadow-sm overflow-hidden text-[10px] font-bold uppercase tracking-widest shrink-0">
           <button onClick={() => setSortBy("affinity")} className={`px-4 py-3 flex items-center transition-colors border-r border-[#1e4a62]/10 ${sortBy === 'affinity' ? 'bg-[#022f42] text-white' : 'text-[#1e4a62] hover:bg-gray-50'}`}>
              <Zap className={`w-3 h-3 mr-2 ${sortBy === 'affinity' ? 'text-[#ffd800]' : ''}`} /> Match Affinity
           </button>
           <button onClick={() => setSortBy("score")} className={`px-4 py-3 flex items-center transition-colors ${sortBy === 'score' ? 'bg-[#022f42] text-white' : 'text-[#1e4a62] hover:bg-gray-50'}`}>
              <TrendingUp className={`w-3 h-3 mr-2 ${sortBy === 'score' ? 'text-[#ffd800]' : ''}`} /> Fundability Score
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedDeals.map(deal => (
          <div key={deal.id} className="border border-[#1e4a62]/10 p-6 rounded-sm hover:shadow-xl hover:border-[#022f42]/30 transition-all bg-white group cursor-pointer relative" onClick={() => router.push(`/investor-portal/startup/${deal.id}`)}>
            <div className="absolute top-6 right-6 text-[#1e4a62]/20 group-hover:text-[#ffd800] transition-colors"><Star className="w-5 h-5 fill-current" /></div>
            
            <div className="flex items-center mb-5">
               <div className="w-14 h-14 bg-[#022f42] rounded-md shadow-inner flex items-center justify-center text-2xl font-bold text-white mr-4">
                 {deal.name.charAt(0)}
               </div>
               <div>
                  <h3 className="font-bold text-xl text-[#022f42] flex items-center">
                    {deal.name} {deal.score >= 80 && <ShieldCheck className="w-5 h-5 text-[#ffd800] ml-2 drop-shadow-sm" />}
                  </h3>
                  <div className="flex flex-wrap items-center text-[10px] font-bold uppercase tracking-widest text-[#1e4a62]/80 mt-1">
                     <span className="bg-[#f2f6fa] px-2 py-0.5 rounded-sm border border-[#1e4a62]/10 mr-2">{deal.sector}</span>
                     <span className="bg-[#f2f6fa] px-2 py-0.5 rounded-sm border border-[#1e4a62]/10 mr-2">{deal.stage}</span>
                     {deal.affinity > 70 && <span className="text-green-600 border border-green-200 bg-green-50 px-2 py-0.5 rounded-sm flex items-center"><Zap className="w-3 h-3 mr-1" /> {deal.affinity}% Match</span>}
                  </div>
               </div>
            </div>
            
            <p className="text-sm text-[#022f42]/80 mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
               {deal.oneLiner}
            </p>

            <div className="grid grid-cols-2 gap-4 border-t border-[#1e4a62]/10 pt-4 mt-auto">
               <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-3 rounded-sm">
                 <div className="text-[10px] uppercase tracking-widest text-[#1e4a62]/80 mb-1 font-bold">Fundability Score</div>
                 <div className="font-bold text-2xl text-[#022f42] flex items-center">
                   {deal.score}<span className="text-sm text-[#1e4a62]/50 ml-1">/100</span>
                 </div>
               </div>
               <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-3 rounded-sm">
                 <div className="text-[10px] uppercase tracking-widest text-[#1e4a62]/80 mb-1 font-bold">Target Ask</div>
                 <div className="font-bold text-2xl text-[#022f42]">{deal.ask}</div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
