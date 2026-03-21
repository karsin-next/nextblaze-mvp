"use client";

import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Rocket, Activity, FileCheck, ArrowRight, ExternalLink, ChevronRight, 
  AlertTriangle, CheckCircle2, Link as LinkIcon, Users, DollarSign, Sparkles
} from "lucide-react";
import Link from "next/link";

const maturityStages = [
  { level: 1, name: "Idea / Concept", desc: "No code written. Pitch deck only." },
  { level: 2, name: "Prototype / Wireframes", desc: "Clickable Figma or basic alpha. Not for public." },
  { level: 3, name: "Closed Beta / MVP", desc: "Real code. Testing with limited early adopters." },
  { level: 4, name: "Live publicly", desc: "Available for anyone to use. Active iteration." }
];

export default function ProductReadinessPage() {
  const [maturity, setMaturity] = useState(1);
  const [traction, setTraction] = useState({
    waitlist: "",
    users: "",
    revenue: "",
    demoLink: ""
  });
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const currentStage = maturityStages.find(s => s.level === maturity)!;

  const getAiFeedback = () => {
    const rev = parseInt(traction.revenue || "0");
    const usr = parseInt(traction.users || "0");
    const wait = parseInt(traction.waitlist || "0");
    
    if (maturity === 4 && usr < 10 && rev === 0) {
      return {
        type: "danger",
        title: "False Start Indicator",
        text: "You marked your product as 'Live' but have virtually zero users or revenue. Investors view this negatively as it indicates an inability to distribute a finished product. Consider repositioning as 'Closed Beta' while you figure out acquisition."
      };
    }
    
    if (maturity <= 2 && wait > 500) {
      return {
        type: "success",
        title: "Strong Demand Validation",
        text: `Excellent early traction. A waitlist of ${wait}+ before writing production code proves you are solving a severe pain point. Highlight this 'Proof of Life' on slide 3 of your pitch deck.`
      };
    }

    if (maturity === 3 && usr > 50) {
      return {
        type: "success",
        title: "Healthy Beta Cycle",
        text: "You have enough users in your Beta to extract statistically significant feedback. Investors will want to see quotes and NPS scores from these early adopters."
      };
    }

    if (!traction.demoLink) {
      return {
        type: "warning",
        title: "Missing 'Proof of Life'",
        text: "You haven't provided a demo link. VCs vastly prefer seeing a rough, unpolished Loom video of the product over polished slides."
      };
    }

    return {
      type: "neutral",
      title: "Stage-Traction Alignment",
      text: "Your reported traction metrics generally align with your selected product maturity stage. Focus on accelerating your primary KPI for the next funding milestone."
    };
  };

  const isReady = traction.waitlist || traction.users || traction.revenue || traction.demoLink;
  const feedback = getAiFeedback();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.1.4 MVP & Adoption Readiness"
        title="MVP & Adoption Readiness"
        description="Align your product's technical maturity with your empirical traction data. Investors evaluate technical risk strictly against distribution success."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Interactive Area */}
        <div className="flex-1 space-y-6">
          
          <div className={`bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#022f42] rounded-sm transition-all ${isAnalyzed ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}>
            
            <div className="flex items-center gap-2 mb-8 border-b pb-4 border-[#1e4a62]/10">
              <Rocket className="w-5 h-5 text-[#ffd800]" />
              <h2 className="text-xl font-black text-[#022f42]">Product Maturity Slider</h2>
            </div>
            
            {/* Slider */}
            <div className="mb-12">
              <input 
                type="range" 
                min="1" max="4" step="1" 
                value={maturity} 
                onChange={(e) => setMaturity(parseInt(e.target.value))}
                className="w-full accent-[#022f42] h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-4">
                {maturityStages.map((stage) => (
                  <div key={stage.level} className={`text-center w-1/4 px-2 transition-all ${maturity === stage.level ? 'opacity-100 transform scale-105' : 'opacity-40'}`}>
                    <div className={`w-4 h-4 mx-auto rounded-full mb-2 ${maturity >= stage.level ? 'bg-[#ffd800]' : 'bg-gray-300'}`}></div>
                    <p className="text-xs font-black text-[#022f42] uppercase tracking-widest leading-tight">{stage.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f2f6fa] p-6 rounded-sm border border-[#1e4a62]/10 mb-8 border-l-[4px] border-l-[#022f42]">
              <h3 className="text-[#022f42] font-black text-lg mb-1">{currentStage.name}</h3>
              <p className="text-[#1e4a62] text-sm">{currentStage.desc}</p>
            </div>

            <div className="flex items-center gap-2 mb-6 border-b pb-4 border-[#1e4a62]/10 mt-12">
              <Activity className="w-5 h-5 text-[#ffd800]" />
              <h2 className="text-xl font-black text-[#022f42]">&apos;Proof of Life&apos; Traction</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-[#022f42] mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-[#1e4a62]"/> Waitlist / Emails</label>
                <input type="number" value={traction.waitlist} onChange={e => setTraction({...traction, waitlist: e.target.value})} placeholder="e.g. 500" className="w-full p-3 border-2 border-[#1e4a62]/20 rounded-sm focus:border-[#ffd800] focus:ring-0 outline-none transition-colors text-[#022f42] font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#022f42] mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1e4a62]"/> Active Users (MAU)</label>
                <input type="number" value={traction.users} onChange={e => setTraction({...traction, users: e.target.value})} placeholder="e.g. 50" className="w-full p-3 border-2 border-[#1e4a62]/20 rounded-sm focus:border-[#ffd800] focus:ring-0 outline-none transition-colors text-[#022f42] font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#022f42] mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-[#1e4a62]"/> MRR / Revenue ($)</label>
                <input type="number" value={traction.revenue} onChange={e => setTraction({...traction, revenue: e.target.value})} placeholder="e.g. 1000" className="w-full p-3 border-2 border-[#1e4a62]/20 rounded-sm focus:border-[#ffd800] focus:ring-0 outline-none transition-colors text-[#022f42] font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#022f42] mb-2 flex items-center gap-2"><LinkIcon className="w-4 h-4 text-[#1e4a62]"/> Demo / Video Link</label>
                <input type="url" value={traction.demoLink} onChange={e => setTraction({...traction, demoLink: e.target.value})} placeholder="e.g. youtube.com/watch..." className="w-full p-3 border-2 border-[#1e4a62]/20 rounded-sm focus:border-[#ffd800] focus:ring-0 outline-none transition-colors text-[#022f42] font-medium" />
              </div>
            </div>

            <button
              onClick={() => setIsAnalyzed(true)}
              disabled={!isReady}
              className={`w-full py-4 font-bold text-sm tracking-widest uppercase transition-all shadow-sm rounded-sm flex items-center justify-center gap-2 ${
                !isReady 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-[#ffd800] text-[#022f42] hover:bg-[#fff09e] hover:shadow-md"
              }`}
            >
              Analyze Traction Alignment <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {isAnalyzed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-emerald-500 rounded-sm"
              >
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                  <h3 className="text-2xl font-black text-[#022f42] flex items-center gap-2">
                    <FileCheck className="w-6 h-6 text-emerald-500" /> Diagnostic Assessment
                  </h3>
                  <button onClick={() => setIsAnalyzed(false)} className="text-xs font-bold text-[#1e4a62] border px-3 py-1 hover:bg-gray-50">Edit Data</button>
                </div>

                <div className={`p-6 rounded-sm border-l-[4px] mb-8 relative ${
                  feedback.type === 'danger' ? 'bg-rose-50 border-rose-500' :
                  feedback.type === 'success' ? 'bg-emerald-50 border-emerald-500' :
                  feedback.type === 'warning' ? 'bg-amber-50 border-amber-500' :
                  'bg-sky-50 border-sky-500'
                }`}>
                  <h4 className={`flex items-center gap-2 font-bold mb-3 ${
                    feedback.type === 'danger' ? 'text-rose-800' :
                    feedback.type === 'success' ? 'text-emerald-800' :
                    feedback.type === 'warning' ? 'text-amber-800' :
                    'text-sky-800'
                  }`}>
                    {feedback.type === 'danger' ? <AlertTriangle className="w-5 h-5"/> : <Sparkles className="w-5 h-5"/>}
                    {feedback.title}
                  </h4>
                  <p className="text-[#022f42] font-medium leading-relaxed">{feedback.text}</p>
                </div>

                <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-5 rounded-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1e4a62] mb-3">Recorded Metrics to Investor Dashboard</h4>
                  <div className="flex flex-wrap gap-4">
                    {traction.waitlist && <div className="bg-white px-3 py-1.5 border rounded-sm text-sm font-bold text-[#022f42]"><span className="text-gray-400 font-normal mr-2">Waitlist</span> {traction.waitlist}</div>}
                    {traction.users && <div className="bg-white px-3 py-1.5 border rounded-sm text-sm font-bold text-[#022f42]"><span className="text-gray-400 font-normal mr-2">MAU</span> {traction.users}</div>}
                    {traction.revenue && <div className="bg-white px-3 py-1.5 border rounded-sm text-sm font-bold text-[#022f42]"><span className="text-gray-400 font-normal mr-2">MRR</span> ${traction.revenue}</div>}
                    {traction.demoLink && <div className="bg-white px-3 py-1.5 border rounded-sm text-sm font-bold text-[#022f42] flex items-center gap-1"><span className="text-gray-400 font-normal mr-2 text-xs">Demo</span> Linked <CheckCircle2 className="w-3 h-3 text-emerald-500"/></div>}
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <Link href="/dashboard/audit/5-market" className="bg-[#022f42] text-white px-8 py-3 font-bold text-sm uppercase tracking-widest hover:bg-[#1b4f68] transition-colors shadow-md rounded-sm flex items-center gap-2">
                    Next: 1.1.5 Market Sizing <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Actionable Sidebar (Content Backbone) */}
        <div className="lg:w-[350px] space-y-4">
          <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-md">
            <h3 className="flex items-center gap-2 font-bold mb-4 text-[#ffd800]">
              <Rocket className="w-5 h-5" /> VC Perspective
            </h3>
            <p className="text-sm text-[#b0d0e0] leading-relaxed mb-4">
              Investors care more about <strong className="text-white">Empirical Traction</strong> than technical perfection. Code is a commodity; distribution is a moat.
            </p>
            <div className="space-y-3">
              <div className="text-xs bg-white/5 p-3 rounded-sm border border-white/10 group hover:border-[#ffd800]/50 transition-colors">
                <span className="font-bold text-white block mb-1">Pre-Seed vs Seed</span>
                <span className="text-white/60">Pre-seed investors back ideas with proof of demand (waitlists). Seed investors back live products with proof of retention (active users).</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard/academy/what-investors-actually-mean-by-mvp" className="group block bg-white border border-[#1e4a62]/10 p-5 rounded-sm hover:border-[#ffd800] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ffd800] bg-[#ffd800]/10 px-2 py-0.5 rounded-sm">Academy Guide</span>
              <ExternalLink className="w-3 h-3 text-[#1e4a62]/40 group-hover:text-[#ffd800]" />
            </div>
            <h4 className="font-bold text-[#022f42] group-hover:text-[#1b4f68] mb-1">What Investors Actually Mean by MVP</h4>
            <p className="text-xs text-[#1e4a62] flex items-center gap-1">Read the methodology <ChevronRight className="w-3 h-3" /></p>
          </Link>
        </div>
      </div>
    </div>
  );
}
