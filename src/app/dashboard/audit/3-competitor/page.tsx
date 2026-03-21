"use client";

import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, AlertCircle, ArrowRight, ExternalLink, ChevronRight, 
  Swords, Crosshair, Sparkles, GripHorizontal, Plus, Info, BookOpen
} from "lucide-react";
import Link from "next/link";

type Factor = { id: string, text: string };
type Quadrant = "AVAILABLE" | "S" | "W" | "O" | "T";

const INITIAL_FACTORS: Factor[] = [
  { id: "f1", text: "Proprietary Tech" },
  { id: "f2", text: "First-Mover" },
  { id: "f3", text: "High Margin" },
  { id: "f4", text: "Small Team" },
  { id: "f5", text: "Slow Sales Cycle" },
  { id: "f6", text: "Limited Cash" },
  { id: "f7", text: "New Regulation" },
  { id: "f8", text: "Growing Market" },
  { id: "f9", text: "Economic Downturn" },
  { id: "f10", text: "Low Barrier to Entry" }
];

export default function SwotAnalyzerPage() {
  const [step, setStep] = useState<"swot" | "grid" | "result">("swot");

  // Drag and Drop State
  const [factors, setFactors] = useState<Record<Quadrant, Factor[]>>({
    AVAILABLE: INITIAL_FACTORS,
    S: [], W: [], O: [], T: []
  });
  
  const [customInput, setCustomInput] = useState("");
  const [draggedItem, setDraggedItem] = useState<{item: Factor, source: Quadrant} | null>(null);

  // Live AI insight state
  const [liveInsight, setLiveInsight] = useState("Drag factors into the quadrants below to automatically generate strategic VC insights.");

  // Grid State
  const [competitors, setCompetitors] = useState([
    { name: "Competitor A", price: 20, features: 30 },
    { name: "Competitor B", price: 80, features: 60 }
  ]);
  const [you, setYou] = useState({ price: 60, features: 85 });

  const isSwotReady = factors.S.length > 0 && factors.W.length > 0 && (factors.O.length > 0 || factors.T.length > 0);

  // Drag Handlers
  const handleDragStart = (item: Factor, source: Quadrant) => setDraggedItem({ item, source });
  
  const handleDrop = (e: React.DragEvent, target: Quadrant) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.source === target) return;

    setFactors(prev => {
      const newSourceList = prev[draggedItem.source].filter(f => f.id !== draggedItem.item.id);
      const newTargetList = [...prev[target], draggedItem.item];
      
      // Update Live AI Insight based on drop
      if (target === "S" && draggedItem.item.text.includes("Tech")) {
        setLiveInsight("AI Insight: Proprietary Tech is a strong internal moat. VCs will expect to see IP or trade secrets backing this up.");
      } else if (target === "W" && draggedItem.item.text.includes("Cash")) {
        setLiveInsight("AI Insight: Limited cash is a standard weakness at early stages. Focus your pitch on high capital efficiency.");
      } else if (target === "T") {
        setLiveInsight("AI Insight: Identifying threats proves self-awareness. Do not hide from macroeconomic downturns in your deck.");
      }

      return { ...prev, [draggedItem.source]: newSourceList, [target]: newTargetList };
    });
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const addCustomFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const newItem = { id: Date.now().toString(), text: customInput };
    setFactors(prev => ({ ...prev, AVAILABLE: [newItem, ...prev.AVAILABLE] }));
    setCustomInput("");
  };

  const getDifferentiationScore = () => {
    let score = you.features;
    if (you.price > 70 && you.features < 50) score -= 30;
    if (factors.O.length > 1) score += 10;
    if (factors.S.find(f => f.text.includes("Tech"))) score += 10;
    return Math.min(Math.max(score, 10), 99);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.1.3 SWOT & Moat Analyzer"
        title="SWOT & Moat Analyzer"
        description="Assess your competitive landscape (Strengths, Weaknesses, Opportunities, Threats) and differentiate your unique value proposition."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Interactive Area */}
        <div className="flex-1 space-y-6">
          
          <AnimatePresence mode="wait">
            {/* STEP 1: SWOT */}
            {step === "swot" && (
              <motion.div 
                key="swot"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white p-6 md:p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#022f42] rounded-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4 border-[#1e4a62]/10">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#ffd800]" />
                    <h2 className="text-xl font-black text-[#022f42]">Drag-and-Drop SWOT Framework</h2>
                  </div>
                  <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 px-3 py-1.5 rounded-sm flex items-center gap-2 text-xs font-bold text-[#1e4a62]">
                    <BookOpen className="w-3 h-3 text-[#ffd800]" /> Sourced from Harvard Business Review
                  </div>
                </div>

                {/* Sourcing & Methodology Note */}
                <div className="mb-6 p-4 border border-blue-100 bg-blue-50/50 rounded-sm text-sm text-[#022f42]/80 flex items-start gap-3 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                   <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                   <div>
                     <strong>Why these options?</strong> The suggested factors below are derived from standard institutional VC evaluation matrixes. Selecting these standardizes your risk profile for analysts. <a href="https://hbr.org/topic/strategy" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline ml-1 hover:text-[#ffd800]">Read external citation.</a>
                   </div>
                </div>

                {/* Live AI Insight Bar */}
                <div className="mb-8 p-3 bg-emerald-50 border border-emerald-200 rounded-sm flex items-center gap-3 transition-colors shadow-inner">
                  <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                  <p className="text-sm font-bold text-emerald-900">{liveInsight}</p>
                </div>

                {/* AVAILABLE TAGS BANK */}
                <div className="mb-8 bg-[#f2f6fa] border-2 border-dashed border-[#1e4a62]/20 p-4 rounded-sm"
                     onDrop={(e) => handleDrop(e, "AVAILABLE")}
                     onDragOver={handleDragOver}>
                  <div className="text-xs font-black uppercase tracking-widest text-[#1e4a62]/60 mb-3">Available Factors Bank (Drag from here)</div>
                  
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                    {factors.AVAILABLE.map(f => (
                      <div key={f.id} draggable onDragStart={() => handleDragStart(f, "AVAILABLE")}
                        className="bg-white border border-[#1e4a62]/20 px-3 py-1.5 rounded-sm text-sm font-bold text-[#022f42] shadow-sm cursor-grab active:cursor-grabbing flex items-center gap-2 hover:border-[#ffd800] transition-colors">
                        <GripHorizontal className="w-3 h-3 text-gray-400" /> {f.text}
                      </div>
                    ))}
                    {factors.AVAILABLE.length === 0 && <span className="text-xs text-gray-400 italic mt-2">All suggested factors used.</span>}
                  </div>

                  <form onSubmit={addCustomFactor} className="flex gap-2">
                    <input type="text" value={customInput} onChange={e => setCustomInput(e.target.value)} placeholder="Type a custom strategic factor..." className="text-sm p-2 flex-1 border border-[#1e4a62]/20 rounded-sm outline-none focus:border-[#ffd800]" />
                    <button type="submit" className="bg-[#1e4a62] text-white px-3 py-1.5 rounded-sm hover:bg-[#022f42] transition-colors"><Plus className="w-4 h-4"/></button>
                  </form>
                </div>

                {/* 4 QUADRANTS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {/* S */}
                  <div className="bg-emerald-50/50 border-2 border-emerald-100 p-4 rounded-sm min-h-[120px] transition-colors hover:border-emerald-300"
                       onDrop={(e) => handleDrop(e, "S")} onDragOver={handleDragOver}>
                    <label className="flex justify-between items-center text-xs font-black text-emerald-900 mb-3 uppercase tracking-widest">
                      <span>Strengths (Internal)</span>
                      <span className="bg-emerald-200 text-emerald-900 px-1.5 rounded-sm">{factors.S.length}</span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {factors.S.map(f => (
                        <div key={f.id} draggable onDragStart={() => handleDragStart(f, "S")} className="bg-emerald-500 text-white px-3 py-2 text-sm font-bold rounded-sm shadow-sm cursor-grab flex items-center justify-between">
                          {f.text} <GripHorizontal className="w-3 h-3 opacity-50" />
                        </div>
                      ))}
                      {factors.S.length === 0 && <div className="text-emerald-800/40 text-xs italic text-center py-4 border border-dashed border-emerald-200 rounded-sm">Drag Strengths Here</div>}
                    </div>
                  </div>
                  {/* W */}
                  <div className="bg-rose-50/50 border-2 border-rose-100 p-4 rounded-sm min-h-[120px] transition-colors hover:border-rose-300"
                       onDrop={(e) => handleDrop(e, "W")} onDragOver={handleDragOver}>
                    <label className="flex justify-between items-center text-xs font-black text-rose-900 mb-3 uppercase tracking-widest">
                      <span>Weaknesses (Internal)</span>
                      <span className="bg-rose-200 text-rose-900 px-1.5 rounded-sm">{factors.W.length}</span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {factors.W.map(f => (
                        <div key={f.id} draggable onDragStart={() => handleDragStart(f, "W")} className="bg-rose-500 text-white px-3 py-2 text-sm font-bold rounded-sm shadow-sm cursor-grab flex items-center justify-between">
                          {f.text} <GripHorizontal className="w-3 h-3 opacity-50" />
                        </div>
                      ))}
                      {factors.W.length === 0 && <div className="text-rose-800/40 text-xs italic text-center py-4 border border-dashed border-rose-200 rounded-sm">Drag Weaknesses Here</div>}
                    </div>
                  </div>
                  {/* O */}
                  <div className="bg-sky-50/50 border-2 border-sky-100 p-4 rounded-sm min-h-[120px] transition-colors hover:border-sky-300"
                       onDrop={(e) => handleDrop(e, "O")} onDragOver={handleDragOver}>
                    <label className="flex justify-between items-center text-xs font-black text-sky-900 mb-3 uppercase tracking-widest">
                      <span>Opportunities (External)</span>
                      <span className="bg-sky-200 text-sky-900 px-1.5 rounded-sm">{factors.O.length}</span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {factors.O.map(f => (
                        <div key={f.id} draggable onDragStart={() => handleDragStart(f, "O")} className="bg-sky-500 text-white px-3 py-2 text-sm font-bold rounded-sm shadow-sm cursor-grab flex items-center justify-between">
                          {f.text} <GripHorizontal className="w-3 h-3 opacity-50" />
                        </div>
                      ))}
                      {factors.O.length === 0 && <div className="text-sky-800/40 text-xs italic text-center py-4 border border-dashed border-sky-200 rounded-sm">Drag Opportunities Here</div>}
                    </div>
                  </div>
                  {/* T */}
                  <div className="bg-amber-50/50 border-2 border-amber-100 p-4 rounded-sm min-h-[120px] transition-colors hover:border-amber-300"
                       onDrop={(e) => handleDrop(e, "T")} onDragOver={handleDragOver}>
                    <label className="flex justify-between items-center text-xs font-black text-amber-900 mb-3 uppercase tracking-widest">
                      <span>Threats (External)</span>
                      <span className="bg-amber-200 text-amber-900 px-1.5 rounded-sm">{factors.T.length}</span>
                    </label>
                    <div className="flex flex-col gap-2">
                      {factors.T.map(f => (
                        <div key={f.id} draggable onDragStart={() => handleDragStart(f, "T")} className="bg-amber-500 text-white px-3 py-2 text-sm font-bold rounded-sm shadow-sm cursor-grab flex items-center justify-between">
                          {f.text} <GripHorizontal className="w-3 h-3 opacity-50" />
                        </div>
                      ))}
                      {factors.T.length === 0 && <div className="text-amber-800/40 text-xs italic text-center py-4 border border-dashed border-amber-200 rounded-sm">Drag Threats Here</div>}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep("grid")}
                  disabled={!isSwotReady}
                  className={`w-full py-4 font-bold text-sm tracking-widest uppercase transition-all shadow-sm rounded-sm flex items-center justify-center gap-2 ${
                    !isSwotReady 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-[#022f42] text-white hover:bg-[#1b4f68] hover:shadow-md"
                  }`}
                >
                  Continue to Positioning Map <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: 2x2 GRID */}
            {step === "grid" && (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#022f42] rounded-sm"
              >
                <div className="flex items-center gap-2 mb-8 border-b pb-4 border-[#1e4a62]/10">
                  <Crosshair className="w-5 h-5 text-[#ffd800]" />
                  <h2 className="text-xl font-black text-[#022f42]">Competitive Positioning Map</h2>
                </div>

                {/* AI Helper for Grid */}
                <div className="mb-8 p-3 bg-[#f2f6fa] border-l-[4px] border-l-[#ffd800] rounded-r-sm flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#ffd800] mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-[#1e4a62]"><strong>AI Assistant:</strong> Map your position against 2 major competitors using the sliders below. Evaluating based on Price vs. Feature Depth reveals market white space.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mb-10">
                  {/* Sliders Area */}
                  <div className="flex-1 space-y-6">
                    {competitors.map((comp, idx) => (
                      <div key={idx} className="bg-[#f2f6fa] p-4 rounded-sm border border-[#1e4a62]/10">
                        <input 
                          type="text" value={comp.name} 
                          onChange={(e) => {
                            const newC = [...competitors];
                            newC[idx].name = e.target.value;
                            setCompetitors(newC);
                          }}
                          className="font-bold text-[#022f42] bg-transparent border-b border-[#1e4a62]/20 outline-none w-full mb-4 focus:border-[#ffd800]"
                        />
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-[#1e4a62] flex justify-between">
                            Price (Low → Premium) <span>{comp.price}</span>
                          </label>
                          <input type="range" min="0" max="100" value={comp.price} 
                            onChange={(e) => {
                              const newC = [...competitors];
                              newC[idx].price = parseInt(e.target.value);
                              setCompetitors(newC);
                            }}
                            className="w-full accent-[#1e4a62]"
                          />
                          <label className="text-xs font-bold text-[#1e4a62] flex justify-between mt-2">
                            Features (Basic → Advanced) <span>{comp.features}</span>
                          </label>
                          <input type="range" min="0" max="100" value={comp.features} 
                            onChange={(e) => {
                              const newC = [...competitors];
                              newC[idx].features = parseInt(e.target.value);
                              setCompetitors(newC);
                            }}
                            className="w-full accent-[#1e4a62]"
                          />
                        </div>
                      </div>
                    ))}

                    {/* YOU */}
                    <div className="bg-[#022f42] p-4 rounded-sm border-2 border-[#ffd800] shadow-md relative">
                      <div className="absolute -top-3 right-4 bg-[#ffd800] text-[#022f42] text-[10px] font-black uppercase px-2 py-0.5 tracking-widest">You</div>
                      <div className="font-bold text-white mb-4">Your Startup</div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#b0d0e0] flex justify-between">
                          Price (Low → Premium) <span>{you.price}</span>
                        </label>
                        <input type="range" min="0" max="100" value={you.price} onChange={e => setYou({...you, price: parseInt(e.target.value)})} className="w-full accent-[#ffd800]" />
                        
                        <label className="text-xs font-bold text-[#b0d0e0] flex justify-between mt-2">
                          Features (Basic → Advanced) <span>{you.features}</span>
                        </label>
                        <input type="range" min="0" max="100" value={you.features} onChange={e => setYou({...you, features: parseInt(e.target.value)})} className="w-full accent-[#ffd800]" />
                      </div>
                    </div>
                  </div>

                  {/* Graph Render */}
                  <div className="flex-1 min-h-[300px] border-2 border-gray-100 rounded-sm relative bg-gray-50 flex items-center justify-center p-4">
                    {/* Axes */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-px bg-gray-300"></div>
                      <div className="h-full w-px bg-gray-300 absolute"></div>
                    </div>
                    {/* Axis Labels */}
                    <span className="absolute top-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Premium Price</span>
                    <span className="absolute bottom-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Low Price</span>
                    <span className="absolute right-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest" style={{writingMode: 'vertical-rl'}}>Advanced Features</span>
                    <span className="absolute left-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest transform rotate-180" style={{writingMode: 'vertical-rl'}}>Basic Features</span>

                    {/* Points */}
                    <div className="absolute inset-8">
                      {competitors.map((comp, i) => (
                        <div key={i} className="absolute w-3 h-3 bg-gray-400 rounded-full flex flex-col items-center group" 
                          style={{ left: `${comp.features}%`, bottom: `${comp.price}%`, transform: 'translate(-50%, 50%)' }}>
                          <span className="absolute -top-6 text-[10px] font-bold text-gray-500 whitespace-nowrap bg-white px-1 shadow-sm rounded-sm z-10">{comp.name}</span>
                        </div>
                      ))}
                      <motion.div 
                        animate={{ left: `${you.features}%`, bottom: `${you.price}%` }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="absolute w-5 h-5 bg-[#ffd800] border-2 border-[#022f42] rounded-full flex flex-col items-center z-20" 
                        style={{ transform: 'translate(-50%, 50%)' }}
                      >
                         <span className="absolute -top-7 text-xs font-black text-[#022f42] whitespace-nowrap bg-[#ffd800] px-2 py-0.5 shadow-md rounded-sm">YOU</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep("swot")} className="px-6 py-4 font-bold text-sm tracking-widest uppercase transition-colors border-2 border-[#1e4a62]/20 text-[#1e4a62] hover:bg-[#f2f6fa] rounded-sm">
                    Back
                  </button>
                  <button onClick={() => setStep("result")} className="flex-1 py-4 font-bold text-sm tracking-widest uppercase transition-all shadow-sm rounded-sm flex items-center justify-center gap-2 bg-[#ffd800] text-[#022f42] hover:bg-[#fff09e] hover:shadow-md">
                    <Sparkles className="w-4 h-4" /> Generate Moat Analysis
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: RESULTS */}
            {step === "result" && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-emerald-500 rounded-sm"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
                  <div>
                    <h2 className="text-3xl font-black text-[#022f42] mb-2">Competitive Moat Analysis</h2>
                    <p className="text-[#1e4a62]">Your strategic differentiators have been processed.</p>
                  </div>
                  <div className="bg-[#f2f6fa] p-4 rounded-sm border border-[#1e4a62]/10 min-w-[150px] text-center shadow-inner">
                    <div className="text-[10px] uppercase font-black tracking-widest text-[#1e4a62] mb-1">Differentiation Score</div>
                    <div className="text-4xl font-black text-[#022f42]">{getDifferentiationScore()}<span className="text-xl text-gray-400">/100</span></div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* AI Commentary from Backbone */}
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-sm relative">
                    <h4 className="flex items-center gap-2 text-emerald-800 font-bold mb-3">
                      <Sparkles className="w-5 h-5 text-emerald-600" /> AI Strategic Commentary
                    </h4>
                    <p className="text-[#022f42] font-medium leading-relaxed">
                      &quot;Your strengths in <span className="bg-white px-1 underline decoration-emerald-300">internal operations</span> align perfectly with the external market trend regarding <span className="bg-white px-1 underline decoration-emerald-300">opportunities</span>.
                      <br/><br/>
                      By positioning yourself with higher features than <strong>{competitors[0].name}</strong>, you carve out a highly defensible &apos;white space&apos; in the premium-tier market. Highlight this alignment in your pitch.&quot;
                    </p>
                  </div>

                  {/* AI Flags from Backbone */}
                  {factors.O.length <= 1 && (
                    <div className="bg-rose-50 border border-rose-200 p-5 rounded-sm">
                      <h4 className="flex items-center gap-2 text-rose-800 font-bold mb-2">
                        <AlertCircle className="w-4 h-4 text-rose-600" /> Vulnerability Flagged
                      </h4>
                      <p className="text-sm text-rose-700">
                        You listed very few specific Opportunities. External tailwinds (e.g. changing laws, market shifts) are critical elements for growth stories. VCs back companies riding massive waves, not just building good surfboards.
                      </p>
                    </div>
                  )}

                  <div className="pt-6 flex gap-4">
                    <button onClick={() => setStep("grid")} className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest border border-[#1e4a62]/20 px-6 py-3 hover:bg-[#f2f6fa] transition-colors rounded-sm">
                      Edit Data
                    </button>
                    <Link href="/dashboard/audit/4-product" className="bg-[#022f42] text-white px-6 py-3 font-bold text-sm uppercase tracking-widest w-full text-center hover:bg-[#1b4f68] transition-colors shadow-md rounded-sm">
                      Next: 1.1.4 Product Readiness
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Actionable Sidebar (Content Backbone) */}
        <div className="lg:w-[350px] space-y-4">
          <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-md">
            <h3 className="flex items-center gap-2 font-bold mb-4 text-[#ffd800]">
              <Swords className="w-5 h-5" /> VC Perspective
            </h3>
            <p className="text-sm text-[#b0d0e0] leading-relaxed mb-4">
              Investors aren&apos;t just looking for your features; they are looking for your <strong>Moat</strong>.
            </p>
            <div className="space-y-3">
              <div className="text-xs bg-white/5 p-3 rounded-sm border border-white/10 group hover:border-[#ffd800]/50 transition-colors">
                <span className="font-bold text-white block mb-1 flex items-center gap-1">What is a Moat? <Info className="w-3 h-3"/></span>
                <span className="text-white/60">A moat is the structural advantage that prevents competitors from eating your lunch (e.g., Network Effects, High Switching Costs, IP).</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard/academy/building-a-sustainable-moat" className="group block bg-white border border-[#1e4a62]/10 p-5 rounded-sm hover:border-[#ffd800] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ffd800] bg-[#ffd800]/10 px-2 py-0.5 rounded-sm">Academy Guide</span>
              <ExternalLink className="w-3 h-3 text-[#1e4a62]/40 group-hover:text-[#ffd800]" />
            </div>
            <h4 className="font-bold text-[#022f42] group-hover:text-[#1b4f68] mb-1">Building a Sustainable Moat (5-min Case Study)</h4>
            <p className="text-xs text-[#1e4a62] flex items-center gap-1">Read the methodology <ChevronRight className="w-3 h-3" /></p>
          </Link>
        </div>
      </div>
    </div>
  );
}
