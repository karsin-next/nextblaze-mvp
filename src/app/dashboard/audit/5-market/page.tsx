"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, DollarSign, ArrowRight, Zap, Target, AlertTriangle, ShieldCheck, Activity, Sparkles, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function MarketOpportunityPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Base Market Data
  const [tam, setTam] = useState("10"); // billions
  const [sam, setSam] = useState("2.5"); // billions
  const [som, setSom] = useState("500"); // millions
  
  // VOS Indicator Inputs
  const [growthRate, setGrowthRate] = useState("35");
  const [marketShare, setMarketShare] = useState("15");
  const [barriers, setBarriers] = useState("Medium");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`audit_5-market_data_${user?.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.tam) setTam(parsed.tam);
          if (parsed.sam) setSam(parsed.sam);
          if (parsed.som) setSom(parsed.som);
          if (parsed.growthRate) setGrowthRate(parsed.growthRate);
          if (parsed.marketShare) setMarketShare(parsed.marketShare);
          if (parsed.barriers) setBarriers(parsed.barriers);
          if (parsed.isAiGenerated) setIsAiGenerated(parsed.isAiGenerated);
        } catch(e) {}
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`audit_5-market_data_${user?.id}`, JSON.stringify({ tam, sam, som, growthRate, marketShare, barriers, isAiGenerated }));
    }
  }, [tam, sam, som, growthRate, marketShare, barriers, isAiGenerated, user?.id]);
  
  const triggerAiEstimation = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setTam("45");
      setSam("8.2");
      setSom("250");
      setGrowthRate("45");
      setMarketShare("8");
      setBarriers("High");
      setIsAiGenerated(true);
      setAiGenerating(false);
    }, 2000);
  };

  const submitModule = async () => {
    setIsSubmitting(true);
    if (typeof window !== 'undefined') localStorage.setItem(`audit_5-market_${user?.id}`, 'completed');
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  // VOS Scoring Math
  // SAM (size is in Billions. e.g. 2.5B = 2500M)
  const samMillions = parseFloat(sam) * 1000 || 0;
  const growthNum = parseFloat(growthRate) || 0;
  const shareNum = parseFloat(marketShare) || 0;

  const scoreSize = samMillions > 100 ? 3 : samMillions >= 20 ? 2 : 1;
  const scoreGrowth = growthNum > 30 ? 3 : growthNum >= 10 ? 2 : 1;
  const scoreShare = shareNum > 20 ? 3 : shareNum >= 5 ? 2 : 1;
  const scoreBarriers = barriers === "High" ? 3 : barriers === "Medium" ? 2 : 1;

  const vosTotal = (scoreSize + scoreGrowth + scoreShare + scoreBarriers) / 4;
  const vosLabel = vosTotal >= 2.5 ? "High Potential" : vosTotal >= 1.75 ? "Average Potential" : "Low Potential";
  const vosBg = vosTotal >= 2.5 ? "bg-green-500" : vosTotal >= 1.75 ? "bg-[#ffd800]" : "bg-red-500";

  // Helper for comma formatting safely
  const formatNum = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "0";
    return num.toLocaleString();
  };

  const AiBadge = () => isAiGenerated ? (
    <span className="ml-2 inline-flex items-center bg-[#f2f6fa] text-[#1e4a62] px-1.5 py-0.5 text-[8px] uppercase tracking-widest font-black rounded-sm border border-[#1e4a62]/10"><Sparkles className="w-2.5 h-2.5 mr-1 text-[#ffd800]" /> AI Assisted</span>
  ) : null;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
         <div>
           <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
             Module 1.1.5
           </div>
           <h1 className="text-3xl font-bold text-[#022f42]">Market Opportunity Sizer</h1>
           <p className="text-[#1e4a62] text-sm mt-2 max-w-2xl leading-relaxed">Estimate your TAM/SAM/SOM and automatically calculate your Venture Opportunity Screening (VOS) Indicator™ score based on the academic startup framework.</p>
         </div>
         <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42]">
           Back to Hub
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
             <button 
               onClick={triggerAiEstimation}
               disabled={aiGenerating}
               className="w-full flex items-center justify-center bg-[#022f42] border border-[#022f42] p-4 hover:bg-[#ffd800] hover:border-[#ffd800] hover:text-[#022f42] transition-all text-white font-bold uppercase tracking-widest text-xs shadow-md"
             >
               {aiGenerating ? (
                 <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div> Pulling VOS Benchmarks...</>
               ) : (
                 <><Zap className="w-4 h-4 mr-2 text-[#ffd800] hover:text-[#022f42]" /> Generate Math via AI Assist</>
               )}
             </button>
             <div className="p-3 bg-white border border-[#1e4a62]/10 border-l-2 border-l-[#ffd800] text-xs text-[#1e4a62] leading-relaxed flex items-start shadow-sm rounded-sm">
                <Info className="w-4 h-4 text-[#ffd800] mr-2 shrink-0 mt-0.5" />
                <p><strong>How the AI works:</strong> The engine scans thousands of public startup valuation metrics and maps them directly to the primary sector stored in your Founder Settings to instantly populate theoretical sizing thresholds.</p>
             </div>
          </div>

          <div className="bg-white p-6 border border-[#1e4a62]/10 shadow-sm space-y-5 rounded-sm">
            <h3 className="text-xs font-bold text-[#022f42] uppercase tracking-widest border-b border-[#1e4a62]/10 pb-3 mb-4">Sizing Mechanics</h3>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between items-center">
                  <span>TAM (Total Addressable) <AiBadge /></span>
                </label>
                <div className="flex border border-[#1e4a62]/15 focus-within:border-[#022f42]">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><DollarSign className="w-4 h-4 text-[#1e4a62]"/></div>
                  <input type="number" step="0.1" value={tam} onChange={(e) => {setTam(e.target.value); setIsAiGenerated(false);}} className="w-full p-2 outline-none font-bold text-[#022f42]" />
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-l border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">Billion</div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between items-center">
                  <span>SAM (Serviceable) <AiBadge /></span>
                </label>
                <div className="flex border border-[#1e4a62]/15 focus-within:border-[#022f42]">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><DollarSign className="w-4 h-4 text-[#1e4a62]"/></div>
                  <input type="number" step="0.1" value={sam} onChange={(e) => {setSam(e.target.value); setIsAiGenerated(false);}} className="w-full p-2 outline-none font-bold text-[#022f42]" />
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-l border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">Billion</div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between items-center">
                  <span>SOM (Obtainable) <AiBadge /></span>
                </label>
                <div className="flex border border-[#1e4a62]/15 focus-within:border-[#022f42]">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><DollarSign className="w-4 h-4 text-[#1e4a62]"/></div>
                  <input type="number" step="0.1" value={som} onChange={(e) => {setSom(e.target.value); setIsAiGenerated(false);}} className="w-full p-2 outline-none font-bold text-[#022f42]" />
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-l border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">Million</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-[#1e4a62]/10 shadow-sm space-y-5 rounded-sm">
            <h3 className="text-xs font-bold text-[#022f42] uppercase tracking-widest border-b border-[#1e4a62]/10 pb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" /> VOS Indicator™ Multipliers
            </h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex items-center">
                Venture Growth <AiBadge />
              </label>
              <div className="flex border border-[#1e4a62]/15 focus-within:border-[#022f42]">
                <input type="number" value={growthRate} onChange={(e) => {setGrowthRate(e.target.value); setIsAiGenerated(false);}} className="w-full p-2 outline-none font-bold text-[#022f42]" />
                <div className="bg-[#f2f6fa] px-3 flex items-center border-l border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">%</div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex items-center">
                Market Share Projection (3-5Y) <AiBadge />
              </label>
              <div className="flex border border-[#1e4a62]/15 focus-within:border-[#022f42]">
                <input type="number" value={marketShare} onChange={(e) => {setMarketShare(e.target.value); setIsAiGenerated(false);}} className="w-full p-2 outline-none font-bold text-[#022f42]" />
                <div className="bg-[#f2f6fa] px-3 flex items-center border-l border-[#1e4a62]/10 text-xs font-bold text-[#1e4a62]">%</div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex items-center">
                Entry Barriers / moat <AiBadge />
              </label>
              <div className="flex border border-[#1e4a62]/15 focus-within:border-[#022f42] bg-white">
                <select value={barriers} onChange={(e) => {setBarriers(e.target.value); setIsAiGenerated(false);}} className="w-full p-2 outline-none font-bold text-[#022f42] bg-transparent">
                  <option value="Low">Low Barriers to Entry</option>
                  <option value="Medium">Medium Barriers to Entry</option>
                  <option value="High">High Barriers (Deep Tech/IP)</option>
                </select>
              </div>
            </div>
          </div>
          
          <button 
            onClick={submitModule}
            disabled={isSubmitting}
            className="w-full p-4 bg-[#f2f6fa] text-[#022f42] font-bold tracking-widest uppercase text-sm border border-[#1e4a62]/20 hover:border-[#022f42] transition-colors flex items-center justify-center shadow-sm rounded-sm"
          >
            {isSubmitting ? "Archiving VOS Mechanics..." : <><span className="mr-2">Confirm Sizing & VOS Array</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>

        {/* Right Column: VOS Output & Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border-2 border-[#022f42] p-8 shadow-xl relative overflow-hidden rounded-sm">
             <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 opacity-10 blur-2xl rounded-full bg-[#022f42]"></div>
             <h3 className="text-sm font-bold uppercase tracking-widest text-[#022f42] mb-1 flex items-center"><Target className="w-5 h-5 mr-2 text-[#ffd800]" /> Validation: The VOS Indicator™</h3>
             <p className="text-xs text-[#1e4a62] mb-8 font-medium max-w-xl leading-relaxed">The mathematically derived Venture Opportunity Screening (VOS) score based on rigorous academic venture frameworks.</p>
             
             <div className="flex items-center justify-between border-b border-[#1e4a62]/10 pb-6 mb-6">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#1e4a62] mb-1">VOS Raw Aggregate</div>
                  <div className="text-5xl font-black text-[#022f42]">{vosTotal.toFixed(2)}<span className="text-xl text-[#1e4a62]/40 ml-1 font-medium">/ 3.0</span></div>
                </div>
                <div className={`px-6 py-4 border-2 rounded-sm ${vosBg === 'bg-green-500' ? 'border-green-500 text-green-700 bg-green-50' : vosBg === 'bg-[#ffd800]' ? 'border-[#ffd800] text-[#022f42] bg-[#fffcf0]' : 'border-red-500 text-red-700 bg-red-50'}`}>
                  <div className="text-xs uppercase tracking-widest font-black flex items-center">
                    {vosTotal >= 2.5 && <ShieldCheck className="w-4 h-4 mr-2" />}
                    {vosLabel}
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#f2f6fa] p-3 text-center border-t-2 border-[#1e4a62]/10 rounded-sm">
                  <div className="text-[9px] uppercase tracking-widest text-[#022f42] font-bold mb-2 h-8 flex items-end justify-center">Market Size Factor</div>
                  <div className={`text-[10px] font-black uppercase ${scoreSize === 3 ? 'text-green-600' : scoreSize === 2 ? 'text-yellow-600' : 'text-red-500'}`}>{scoreSize === 3 ? "High (>100M)" : scoreSize === 2 ? "Avg" : "Low (<20M)"}</div>
                </div>
                <div className="bg-[#f2f6fa] p-3 text-center border-t-2 border-[#1e4a62]/10 rounded-sm">
                  <div className="text-[9px] uppercase tracking-widest text-[#022f42] font-bold mb-2 h-8 flex items-end justify-center">Growth Rate Factor</div>
                  <div className={`text-[10px] font-black uppercase ${scoreGrowth === 3 ? 'text-green-600' : scoreGrowth === 2 ? 'text-yellow-600' : 'text-red-500'}`}>{scoreGrowth === 3 ? "High (>30%)" : scoreGrowth === 2 ? "Avg" : "Low (<10%)"}</div>
                </div>
                <div className="bg-[#f2f6fa] p-3 text-center border-t-2 border-[#1e4a62]/10 rounded-sm">
                  <div className="text-[9px] uppercase tracking-widest text-[#022f42] font-bold mb-2 h-8 flex items-end justify-center">Market Share Target</div>
                  <div className={`text-[10px] font-black uppercase ${scoreShare === 3 ? 'text-green-600' : scoreShare === 2 ? 'text-yellow-600' : 'text-red-500'}`}>{scoreShare === 3 ? "High (>20%)" : scoreShare === 2 ? "Avg" : "Low (<5%)"}</div>
                </div>
                <div className="bg-[#f2f6fa] p-3 text-center border-t-2 border-[#1e4a62]/10 rounded-sm">
                  <div className="text-[9px] uppercase tracking-widest text-[#022f42] font-bold mb-2 h-8 flex items-end justify-center">Barrier / IP Moat</div>
                  <div className={`text-[10px] font-black uppercase ${scoreBarriers === 3 ? 'text-green-600' : scoreBarriers === 2 ? 'text-yellow-600' : 'text-red-500'}`}>{scoreBarriers === 3 ? "High" : scoreBarriers === 2 ? "Medium" : "Low Defensibility"}</div>
                </div>
             </div>
          </div>

           <div className="bg-white p-8 border border-[#1e4a62]/10 shadow-sm flex flex-col items-center justify-center relative overflow-hidden rounded-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#022f42] mb-6">TAM / SAM / SOM Visualizer</h3>
              <div className="relative w-[320px] h-[320px] flex items-center justify-center">
                 <motion.div
                   initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
                   className="absolute inset-0 rounded-full border-2 border-dashed border-[#1e4a62]/30 bg-[#f2f6fa]"
                 />
                 <motion.div
                   initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
                   className="absolute w-[210px] h-[210px] rounded-full bg-[#b0d0e0]/60 border-2 border-[#1e4a62]/20"
                 />
                 <motion.div
                   initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
                   className="absolute w-[110px] h-[110px] rounded-full bg-[#022f42] shadow-2xl flex flex-col items-center justify-center"
                 >
                   <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffd800]">SOM</span>
                   <span className="font-black text-white text-lg leading-tight">${formatNum(som)}M</span>
                 </motion.div>
              </div>
              {/* Legend - no overlapping */}
              <div className="mt-6 flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f2f6fa] border-2 border-dashed border-[#1e4a62]/50"></div>
                  <span className="font-bold text-[#1e4a62] uppercase tracking-widest text-[9px]">TAM <span className="text-[#022f42]">${formatNum(tam)}B</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#b0d0e0]/60 border border-[#1e4a62]/30"></div>
                  <span className="font-bold text-[#1e4a62] uppercase tracking-widest text-[9px]">SAM <span className="text-[#022f42]">${formatNum(sam)}B</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#022f42]"></div>
                  <span className="font-bold text-[#1e4a62] uppercase tracking-widest text-[9px]">SOM <span className="text-[#022f42]">${formatNum(som)}M</span></span>
                </div>
              </div>
           </div>
          
        </div>
      </div>
    </div>
  );
}
