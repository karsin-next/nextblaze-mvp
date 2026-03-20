"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Mail, FileText, CheckCircle2, TrendingUp, DollarSign, Activity, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function StartupProfileViewer() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    // Determine if it's the mocked active local user or a static mock
    if (typeof params.id === 'string' && params.id.startsWith("mock-")) {
      setProfile({
        name: params.id === "mock-1" ? "NeuroSync" : params.id === "mock-2" ? "VaultPay" : "MediChain",
        industry: params.id === "mock-1" ? "Deep Tech" : params.id === "mock-2" ? "Fintech" : "HealthTech",
        founderName: "Mock Founder",
        oneLiner: params.id === "mock-1" ? "Brain-computer interfaces for remote operating machinery." : params.id === "mock-2" ? "Cross-border B2B payments using stablecoin rails." : "Blockchain verified electronic health records.",
        score: params.id === "mock-1" ? 82 : params.id === "mock-2" ? 94 : 71,
        targetAsk: params.id === "mock-1" ? "$2.5M" : params.id === "mock-2" ? "$8.0M" : "$750K",
        preMoney: params.id === "mock-1" ? "$12M" : params.id === "mock-2" ? "$35M" : "$4M",
        instrument: params.id === "mock-1" ? "SAFE" : params.id === "mock-2" ? "Priced Equity" : "Convertible Note"
      });
    } else {
      // Pull from local browser!
      try {
        const stored = JSON.parse(localStorage.getItem(`startup_profile_${params.id}`) || "{}");
        let activeUserScore = Math.floor(Math.random() * 40) + 40;
        const scoreDataRaw = localStorage.getItem(`fundability_score_${params.id}`);
        if (scoreDataRaw) {
           try { activeUserScore = JSON.parse(scoreDataRaw).overall; } catch(e) {}
        }
        setProfile({
          name: stored.companyName || "Unknown Sandbox Startup",
          industry: stored.industry || "N/A",
          founderName: stored.founderName || "N/A",
          oneLiner: stored.oneLiner || "The startup hasn't configured their one-liner in the dashboard settings yet. Ask them to fill out the Founder Settings panel.",
          score: activeUserScore || 55,
          targetAsk: "TBD", preMoney: "TBD", instrument: "TBD"
        });
      } catch(e) {}
    }
  }, [params.id]);

  if (!profile) return <div className="p-20 text-center font-bold text-[#022f42] uppercase tracking-widest text-sm animate-pulse">Decrypting Deal Room...</div>;

  return (
    <div className="max-w-5xl mx-auto w-full">
       <button onClick={() => router.push('/investor-portal')} className="flex items-center text-xs font-bold text-[#1e4a62] hover:text-[#022f42] uppercase tracking-widest mb-8 transition-colors bg-[#f2f6fa] px-3 py-1.5 rounded-sm">
         <ArrowLeft className="w-4 h-4 mr-2" /> Back to Deal Flow
       </button>

       {/* Hero Section */}
       <div className="flex flex-col md:flex-row md:items-start justify-between mb-12 border-b border-[#1e4a62]/10 pb-12">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center mb-4 gap-3">
               <div className="w-16 h-16 bg-[#022f42] rounded-md shadow-inner flex items-center justify-center text-3xl font-bold text-white border border-[#022f42]/20">
                 {profile.name.charAt(0)}
               </div>
               <div>
                 <h1 className="text-4xl font-black text-[#022f42] tracking-tight">{profile.name}</h1>
                 <div className="text-xs font-bold uppercase tracking-widest text-[#1e4a62]/80 mt-1">{profile.industry}</div>
               </div>
            </div>
            
            <p className="text-[#1e4a62] text-lg mt-6 leading-relaxed bg-[#f2f6fa] p-4 border-l-4 border-[#022f42] rounded-sm italic">
              &quot;{profile.oneLiner}&quot;
            </p>
          </div>
          
          <div className="mt-8 md:mt-0 flex flex-col items-center justify-center p-8 bg-white border-2 border-[#1e4a62]/10 rounded-sm shadow-xl min-w-[200px]">
             <div className="text-[10px] uppercase tracking-widest text-[#1e4a62] font-bold mb-3 flex items-center">
               Fundability Score {profile.score >= 80 && <ShieldCheck className="w-3.5 h-3.5 ml-1 text-[#ffd800]" />}
             </div>
             <div className="text-6xl font-black text-[#022f42] tracking-tighter">{profile.score}</div>
             <div className="w-full h-1.5 bg-[#f2f6fa] mt-4 rounded-full overflow-hidden">
               <div className={`h-full ${profile.score >= 80 ? 'bg-[#ffd800]' : 'bg-[#1e4a62]'}`} style={{ width: `${Math.min(100, Math.max(0, profile.score))}%` }}></div>
             </div>
          </div>
       </div>

       {/* Grid Canvas */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         {/* Details */}
         <div className="col-span-2 space-y-8">
            <div className="bg-white p-8 border border-[#1e4a62]/10 shadow-sm rounded-sm">
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#022f42] border-b border-[#1e4a62]/10 pb-4 mb-6 flex items-center">
                 <TrendingUp className="w-4 h-4 mr-2" /> Round Mechanics
               </h3>
               <div className="grid grid-cols-3 gap-6">
                  <div className="bg-[#f2f6fa] p-4 rounded-sm border border-[#1e4a62]/5">
                    <div className="text-[10px] uppercase text-[#1e4a62] font-bold mb-1 tracking-widest">Target Ask</div>
                    <div className="text-2xl font-black text-[#022f42]">{profile.targetAsk}</div>
                  </div>
                  <div className="bg-[#f2f6fa] p-4 rounded-sm border border-[#1e4a62]/5">
                    <div className="text-[10px] uppercase text-[#1e4a62] font-bold mb-1 tracking-widest">Pre-Money Val</div>
                    <div className="text-2xl font-black text-[#022f42]">{profile.preMoney}</div>
                  </div>
                  <div className="bg-[#f2f6fa] p-4 rounded-sm border border-[#1e4a62]/5">
                    <div className="text-[10px] uppercase text-[#1e4a62] font-bold mb-1 tracking-widest">Instrument</div>
                    <div className="text-2xl font-black text-[#022f42]">{profile.instrument}</div>
                  </div>
               </div>
            </div>

            <div className="bg-[#f2f6fa] p-8 border border-[#1e4a62]/10 shadow-sm relative overflow-hidden group rounded-sm">
               <div className="absolute inset-0 bg-white/70 backdrop-blur-[3px] z-10 flex items-center justify-center opacity-100 group-hover:bg-white/80 transition-all">
                 <button className="bg-[#022f42] text-white px-6 py-4 text-xs font-bold uppercase tracking-widest flex items-center hover:bg-[#ffd800] hover:text-[#022f42] transition-colors rounded-sm shadow-2xl scale-100 group-hover:scale-105">
                   <FileText className="w-4 h-4 mr-2" /> Request Data Room Access
                 </button>
               </div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#022f42] border-b border-[#1e4a62]/10 pb-4 mb-6 flex items-center">
                 <ShieldCheck className="w-4 h-4 mr-2" /> Due Diligence Vault
               </h3>
               <div className="space-y-4 filter blur-[3px] opacity-40 select-none">
                 <div className="flex items-center space-x-4"><div className="w-8 h-8 bg-[#022f42] rounded"></div><div className="h-4 bg-[#022f42] rounded w-3/4"></div></div>
                 <div className="flex items-center space-x-4"><div className="w-8 h-8 bg-[#022f42] rounded"></div><div className="h-4 bg-[#022f42] rounded w-full"></div></div>
                 <div className="flex items-center space-x-4"><div className="w-8 h-8 bg-[#022f42] rounded"></div><div className="h-4 bg-[#022f42] rounded w-5/6"></div></div>
               </div>
            </div>
         </div>

         {/* Sidebar Action */}
         <div className="col-span-1">
            <div className="bg-[#022f42] p-8 text-white rounded-sm shadow-2xl sticky top-24 border border-[#022f42]">
               <h3 className="text-xl font-bold mb-2 flex items-center tracking-tight">
                 <Users className="w-5 h-5 mr-2 text-[#ffd800]" /> Express Interest
               </h3>
               <p className="text-xs text-[#b0d0e0] mb-8 leading-relaxed font-medium">
                 Send a direct signal to <strong>{profile.founderName}</strong> to open messaging and coordinate a diligence call.
               </p>
               
               {requested ? (
                 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#ffd800] border border-[#ffd800] text-[#022f42] p-4 rounded-sm flex items-center justify-center text-sm font-black uppercase tracking-widest shadow-inner">
                   <CheckCircle2 className="w-5 h-5 mr-2" /> Signal Sent
                 </motion.div>
               ) : (
                 <button onClick={() => setRequested(true)} className="w-full bg-[#f2f6fa] text-[#022f42] py-4 text-xs font-black uppercase tracking-widest hover:bg-[#ffd800] transition-colors flex items-center justify-center rounded-sm">
                   <Mail className="w-4 h-4 mr-2" /> Request Intro
                 </button>
               )}

               <div className="mt-6 pt-6 border-t border-white/10 text-[10px] text-white/50 text-center uppercase tracking-widest font-bold">
                 Secured by NextBlaze Escrow
               </div>
            </div>
         </div>
       </div>

    </div>
  );
}
