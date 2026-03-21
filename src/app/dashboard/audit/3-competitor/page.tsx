"use client";

import { useState, useEffect, useRef } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle2, AlertCircle, Info, 
  Target, Crosshair, Sparkles, Plus, Trash2, Activity, Link as LinkIcon, Save, Check
} from "lucide-react";
import Link from "next/link";

type Competitor = { id: string; name: string; type: string; desc: string; x: number; y: number };
type Dimension = { id: string; name: string; you: string; [compId: string]: string };

export default function CompetitorAnalysisPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    competitors: [] as Competitor[],
    you: { x: 70, y: 70 },
    dimensions: [
      { id: "d1", name: "Price", you: "" },
      { id: "d2", name: "Features", you: "" },
      { id: "d3", name: "Target Customer", you: "" }
    ] as Dimension[],
    moats: { ip: 1, network: 1, brand: 1, scale: 1 },
    uvp: { customer: "", problem: "", benefit: "", diff: "" },
    uvpOverride: undefined as string | undefined
  });

  const [newComp, setNewComp] = useState({ name: "", type: "Direct Competitor", desc: "" });
  const [newDim, setNewDim] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "", step3: "", step4: "", step5: "" });

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("audit_1_1_3_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData(parsed.data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {
        console.error("Failed to load audit 1.1.3 v2", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("audit_1_1_3_v2", JSON.stringify({ data, step }));
    }
  }, [data, step, isLoaded]);

  // Calculations
  const moatScore = Math.round(((data.moats.ip + data.moats.network + data.moats.brand + data.moats.scale) / 40) * 100);
  
  let moatLabel = "";
  if (moatScore >= 80) moatLabel = "Defensible Moat – Investor Confidence High";
  else if (moatScore >= 50) moatLabel = "Emerging Moat – Needs Development";
  else if (moatScore >= 20) moatLabel = "Weak Moat – Competitors Can Catch Up";
  else moatLabel = "No Moat – High Risk";

  // Handlers - STEP 1
  const addCompetitor = () => {
    if (!newComp.name.trim()) return;
    const cid = "c" + Date.now();
    setData(prev => ({
      ...prev,
      competitors: [...prev.competitors, { ...newComp, id: cid, x: 50, y: 50 }],
      dimensions: prev.dimensions.map(d => ({ ...d, [cid]: "" }))
    }));
    setNewComp({ name: "", type: "Direct Competitor", desc: "" });
  };

  const removeCompetitor = (id: string) => {
    setData(prev => {
      const newComps = prev.competitors.filter(c => c.id !== id);
      const newDims = prev.dimensions.map(d => {
        const copy = { ...d };
        delete copy[id];
        return copy;
      });
      return { ...prev, competitors: newComps, dimensions: newDims };
    });
  };

  useEffect(() => {
    if (data.competitors.length === 0) setAiFlags(p => ({ ...p, step1: "You haven't listed any competitors. Missing a key competitor makes you look naive to investors." }));
    else if (!data.competitors.find(c => c.type === "Indirect Competitor")) setAiFlags(p => ({ ...p, step1: "You haven't included any indirect competitors – think about alternative ways customers solve this problem (e.g. spreadsheets)." }));
    else setAiFlags(p => ({ ...p, step1: `You listed ${data.competitors.length} competitors. That's a good start. Are there any large incumbents who could enter this space?` }));
  }, [data.competitors]);

  // Handlers - STEP 2 Grid
  const handleGridDragEnd = (event: any, info: any, type: "you" | "competitor", id?: string) => {
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const draggedEl = event.target.closest('div');
    if (!draggedEl) return;
    const rect = draggedEl.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let rawX = Math.max(0, Math.min(centerX - gridRect.left, gridRect.width));
    let rawY = Math.max(0, Math.min(centerY - gridRect.top, gridRect.height));
    
    const percentX = Math.round((rawX / gridRect.width) * 100);
    const percentY = 100 - Math.round((rawY / gridRect.height) * 100);

    if (type === "you") {
      setData(prev => ({ ...prev, you: { x: percentX, y: percentY } }));
    } else if (type === "competitor" && id) {
      setData(prev => ({
        ...prev,
        competitors: prev.competitors.map(c => c.id === id ? { ...c, x: percentX, y: percentY } : c)
      }));
    }
  };

  useEffect(() => {
    if (data.you.x > 80 && data.you.y > 80) setAiFlags(p => ({...p, step2: "There's whitespace in the Premium/Advanced quadrant – but ensure customers have the budget for this."}));
    else if (data.competitors.some(c => Math.abs(c.x - data.you.x) < 10 && Math.abs(c.y - data.you.y) < 10)) {
       setAiFlags(p => ({...p, step2: "You're positioning yourself directly against a competitor. What makes you different enough to win?"}));
    } else setAiFlags(p => ({...p, step2: "Your position is in a unique whitespace – make sure you can defend it."}));
  }, [data.you, data.competitors]);

  // Handlers - STEP 3 Matrix
  const addDimension = () => {
    if (!newDim.trim()) return;
    setData(prev => ({
      ...prev,
      dimensions: [...prev.dimensions, { id: "d" + Date.now(), name: newDim, you: "" }]
    }));
    setNewDim("");
  };

  const updateMatrix = (dimId: string, compId: string | "you", val: string) => {
    setData(prev => ({
      ...prev,
      dimensions: prev.dimensions.map(d => d.id === dimId ? { ...d, [compId]: val } : d)
    }));
  };

  useEffect(() => {
    const filledYou = data.dimensions.filter(d => d.you && d.you.length > 3);
    if (filledYou.length === 0) setAiFlags(p => ({...p, step3: "You listed no advantages in any dimension – investors will see you as a me-too product."}));
    else if (filledYou.length === 1 && filledYou[0].name === "Price") setAiFlags(p => ({...p, step3: "Your only differentiator is price. This is rarely a sustainable advantage. Add non-price features."}));
    else setAiFlags(p => ({...p, step3: `You have strong differentiation points. Highlight "${filledYou[0]?.name || 'these'}" in your pitch.`}));
  }, [data.dimensions]);

  // Handlers - STEP 4 Moat
  useEffect(() => {
    if (moatScore >= 80) setAiFlags(p => ({...p, step4: "Your Moat Strength Score is excellent. You are highly defensible against incumbents."}));
    else if (data.moats.network < 3 && data.moats.ip < 3) setAiFlags(p => ({...p, step4: "Your IP and Network Effects are weak. Consider how you could introduce community features or proprietary data."}));
    else setAiFlags(p => ({...p, step4: `Your Moat Strength Score is ${moatScore}% – consider focusing on improving your weakest moats to scale safely.`}));
  }, [data.moats, moatScore]);

  // Handlers - STEP 5 UVP
  const defaultUVP = `For ${data.uvp.customer || "[target customer]"} who are struggling with ${data.uvp.problem || "[problem]"}, our solution ${data.uvp.benefit || "[provides benefit]"}. Unlike ${data.competitors.length > 0 ? data.competitors.map(c=>c.name).join(' & ') : "[competitors]"}, we ${data.uvp.diff || "[key differentiator]"}.`;

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      window.location.href = "/dashboard/audit/4-product";
    }, 1000);
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.3 Competitor Analysis"
        title="UVP & Moat Analyzer"
        description="Understand the competitive landscape, articulate a clear differentiator, and identify sustainable advantages (moats) that protect your business."
      />

      {/* Progress Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-2 w-12 md:w-20 rounded-full transition-all ${step >= i ? 'bg-indigo-500' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest">Workshop Step {step} of 5</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Identification */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2" title="Include 3-5 competitors. Missing a key competitor makes you look naive.">
                  Who&apos;s Already There? <Info className="w-4 h-4 text-gray-400" />
                </h2>
                <p className="text-[#1e4a62] mb-6 text-sm">List your direct and indirect competitors. We will map these in the next steps.</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex flex-col lg:flex-row gap-3">
                    <input type="text" value={newComp.name} onChange={e=>setNewComp({...newComp, name: e.target.value})} placeholder="Competitor Name (e.g. Salesforce)" className="p-3 border-2 border-gray-200 rounded-sm outline-none focus:border-indigo-500 flex-1 font-bold text-sm" />
                    <select value={newComp.type} onChange={e=>setNewComp({...newComp, type: e.target.value})} className="p-3 border-2 border-gray-200 rounded-sm outline-none focus:border-indigo-500 text-sm">
                      <option>Direct Competitor</option><option>Indirect Competitor</option><option>Potential Future Competitor</option>
                    </select>
                  </div>
                  <input type="text" value={newComp.desc} onChange={e=>setNewComp({...newComp, desc: e.target.value})} placeholder="Briefly describe their approach or how they solve the problem..." className="w-full p-3 border-2 border-gray-200 rounded-sm outline-none focus:border-indigo-500 text-sm" />
                  <button onClick={addCompetitor} className="bg-[#1e4a62] text-white px-6 py-2 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-[#022f42] transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4"/> Add Competitor
                  </button>
                </div>

                <div className="space-y-3 mb-8">
                  {data.competitors.map(c => (
                    <div key={c.id} className="p-4 border border-gray-200 rounded-sm flex items-start justify-between bg-gray-50/50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[#022f42]">{c.name}</span>
                          <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-800">{c.type}</span>
                        </div>
                        <p className="text-sm text-gray-600">{c.desc}</p>
                      </div>
                      <button onClick={() => removeCompetitor(c.id)} className="text-rose-400 hover:text-rose-600"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                  {data.competitors.length === 0 && <div className="p-8 text-center border-2 border-dashed border-gray-200 text-gray-400 text-sm font-bold rounded-sm">No competitors added yet.</div>}
                </div>

                <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                  <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                  <p className="text-sm text-emerald-900 font-medium">{aiFlags.step1 || "Awaiting inputs..."}</p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Positioning Map */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2" title="This map helps you see whitespace. Investors love clear whitespace positioning.">
                  Where Do You Fit? Map Your Position <Info className="w-4 h-4 text-gray-400" />
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Physically drag the competitor bubbles (and your own yellow beacon) onto the coordinate grid below to map out the market whitespace.</p>
                
                <div className="min-h-[450px] border-2 border-[#1e4a62]/20 rounded-sm relative bg-[#f2f6fa]/50 flex items-center justify-center overflow-hidden mb-8" ref={gridRef}>
                  {/* Axes lines */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-0.5 bg-gray-300"></div>
                    <div className="h-full w-0.5 bg-gray-300 absolute"></div>
                  </div>
                  {/* Axis Labels */}
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#022f42] uppercase tracking-widest bg-white px-3 py-1 shadow-sm rounded-sm">High Price / Enterprise</span>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#022f42] uppercase tracking-widest bg-white px-3 py-1 shadow-sm rounded-sm">Low Price / Mass Market</span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#022f42] uppercase tracking-widest bg-white px-3 py-1 shadow-sm rounded-sm" style={{writingMode: 'vertical-rl'}}>Broad Features / Complex</span>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#022f42] uppercase tracking-widest bg-white px-3 py-1 shadow-sm rounded-sm transform rotate-180" style={{writingMode: 'vertical-rl'}}>Niche / Simple</span>

                  {data.competitors.map((comp) => (
                    <motion.div 
                      key={comp.id} drag dragMomentum={false}
                      whileDrag={{ scale: 1.1, zIndex: 50, shadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                      onDragEnd={(e, info) => handleGridDragEnd(e, info, "competitor", comp.id)}
                      className="absolute px-4 py-2 rounded-full bg-white text-xs font-bold text-gray-700 cursor-grab active:cursor-grabbing shadow-md border-2 border-gray-200"
                      style={{ left: `${comp.x}%`, top: `${100 - comp.y}%`, x: '-50%', y: '-50%' }}
                    >
                      {comp.name}
                    </motion.div>
                  ))}

                  <motion.div 
                    drag dragMomentum={false}
                    whileDrag={{ scale: 1.1, zIndex: 60, shadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
                    onDragEnd={(e, info) => handleGridDragEnd(e, info, "you")}
                    className="absolute px-5 py-2.5 rounded-full bg-[#ffd800] text-sm font-black text-[#022f42] cursor-grab active:cursor-grabbing shadow-lg border-2 border-[#022f42] z-40 flex items-center gap-1"
                    style={{ left: `${data.you.x}%`, top: `${100 - data.you.y}%`, x: '-50%', y: '-50%' }}
                  >
                     <Sparkles className="w-3 h-3"/> YOU
                  </motion.div>
                </div>

                <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                  <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                  <p className="text-sm text-emerald-900 font-medium">{aiFlags.step2}</p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Matrix */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2" title="The goal is to identify at least 2-3 dimensions where you are clearly better.">
                  Why Will Customers Choose You? <Info className="w-4 h-4 text-gray-400" />
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Compare your startup across key dimensions. Being cheaper alone is rarely a sustainable moat.</p>
                
                <div className="overflow-x-auto mb-8 relative border border-gray-200 rounded-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#f2f6fa] text-[#022f42] uppercase font-black text-xs">
                      <tr>
                        <th className="px-6 py-4 border-b border-r border-gray-200 bg-[#e2ebf3]">Dimension</th>
                        <th className="px-6 py-4 border-b border-r border-gray-200 bg-[#ffd800]/20 text-center text-[#022f42]">✨ YOU</th>
                        {data.competitors.map(c => <th key={c.id} className="px-6 py-4 border-b border-r border-gray-200 text-center text-gray-500 font-bold">{c.name}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {data.dimensions.map(dim => (
                        <tr key={dim.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-3 border-r border-gray-200 font-bold text-[#1e4a62] whitespace-nowrap bg-white">{dim.name}</td>
                          <td className="px-2 py-2 border-r border-gray-200 bg-[#fffdf0]">
                            <input type="text" value={dim.you} onChange={e => updateMatrix(dim.id, "you", e.target.value)} placeholder="Your advantage..." className="w-full p-2 bg-transparent outline-none focus:border-b-2 focus:border-[#ffd800] text-center" />
                          </td>
                          {data.competitors.map(c => (
                            <td key={c.id} className="px-2 py-2 border-r border-gray-200">
                              <input type="text" value={dim[c.id] || ""} onChange={e => updateMatrix(dim.id, c.id, e.target.value)} placeholder="..." className="w-full p-2 bg-transparent outline-none focus:border-b-2 focus:border-gray-300 text-center text-gray-600" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-2 mb-8">
                  <input type="text" value={newDim} onChange={e=>setNewDim(e.target.value)} placeholder="Add dimension (e.g. Speed, Integrations)" className="p-3 border-2 border-gray-200 rounded-sm outline-none focus:border-indigo-500 text-sm w-64" />
                  <button onClick={addDimension} className="bg-gray-100 text-[#022f42] px-4 py-2 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4"/> Add Custom Dimension
                  </button>
                </div>

                <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                  <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                  <p className="text-sm text-emerald-900 font-medium">{aiFlags.step3}</p>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Moat Workshop */}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-indigo-600 rounded-sm">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] px-3 py-1 pb-1.5 rounded-bl-sm">The Moat Workshop</div>
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2" title="Investors assess whether you have sustainable advantages that competitors cannot easily copy.">
                  Build Your Moat <Info className="w-4 h-4 text-gray-400" />
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Assess your defensibility against the four canonical venture-scale moats.</p>
                
                <div className="space-y-6 mb-10">
                  {/* IP */}
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                    <h4 className="font-bold text-[#022f42] flex justify-between mb-2">
                       <span title="Patents, trademarks, trade secrets, proprietary tech.">1. Intellectual Property (IP) Moat</span>
                       <span className="text-indigo-600 font-black">{data.moats.ip}</span>
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">Patents, trademarks, proprietary tech or algorithms that cannot be replicated.</p>
                    <input type="range" min="1" max="10" value={data.moats.ip} onChange={e => setData({...data, moats: {...data.moats, ip: parseInt(e.target.value)}})} className="w-full accent-indigo-600" />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-1"><span>1 - No IP Protection</span><span>10 - Defensible Patent Portfolio</span></div>
                  </div>
                  
                  {/* Network */}
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                    <h4 className="font-bold text-[#022f42] flex justify-between mb-2">
                       <span title="Your product becomes more valuable as more people use it.">2. Network Effects Moat</span>
                       <span className="text-indigo-600 font-black">{data.moats.network}</span>
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">The product mathematically becomes more valuable as more users join (e.g. marketplaces, social graphs).</p>
                    <input type="range" min="1" max="10" value={data.moats.network} onChange={e => setData({...data, moats: {...data.moats, network: parseInt(e.target.value)}})} className="w-full accent-indigo-600" />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-1"><span>1 - No Network Effects</span><span>10 - Strong Multi-Sided Network</span></div>
                  </div>

                  {/* Brand Tracking */}
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                    <h4 className="font-bold text-[#022f42] flex justify-between mb-2">
                       <span title="Customers stick with you because of high switching costs or data lock-in.">3. Brand & Switching Costs</span>
                       <span className="text-indigo-600 font-black">{data.moats.brand}</span>
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">Deep data integrations, team retraining costs, or immense brand loyalty that prevents churn.</p>
                    <input type="range" min="1" max="10" value={data.moats.brand} onChange={e => setData({...data, moats: {...data.moats, brand: parseInt(e.target.value)}})} className="w-full accent-indigo-600" />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-1"><span>1 - Easy To Switch</span><span>10 - Deeply Locked In</span></div>
                  </div>

                  {/* Scale */}
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                    <h4 className="font-bold text-[#022f42] flex justify-between mb-2">
                       <span title="Your cost structure allows you to offer significantly better prices.">4. Scale & Cost Moat</span>
                       <span className="text-indigo-600 font-black">{data.moats.scale}</span>
                    </h4>
                    <p className="text-xs text-gray-500 mb-4">Operational efficiency, distribution hacks, or economies of scale competitors cannot match.</p>
                    <input type="range" min="1" max="10" value={data.moats.scale} onChange={e => setData({...data, moats: {...data.moats, scale: parseInt(e.target.value)}})} className="w-full accent-indigo-600" />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-1"><span>1 - No Scale Advantage</span><span>10 - Massive Scale Unmatchable</span></div>
                  </div>
                </div>

                <div className={`p-6 rounded-sm border-2 text-center transition-colors cursor-help ${
                  moatScore >= 80 ? 'border-emerald-500 bg-emerald-50' : moatScore >= 50 ? 'border-[#ffd800] bg-[#fffdf0]' : 'border-rose-400 bg-rose-50'
                }`} title="Calculated as the cumulative defensibility against the canonical 4 moats. Investors use this to assess long-term survival.">
                  <div className="text-sm font-black uppercase tracking-widest text-opacity-80 mb-1">Live Moat Strength Score</div>
                  <div className={`text-6xl font-black mb-2`}>{moatScore}%</div>
                  <div className={`font-bold`}>{moatLabel}</div>
                </div>

                <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                  <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                  <p className="text-sm text-emerald-900 font-medium">{aiFlags.step4}</p>
                </div>
              </motion.div>
            )}

            {/* STEP 5: UVP Summary */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-emerald-500 rounded-sm">
                <h2 className="text-3xl font-black text-[#022f42] mb-2 text-center" title="Your UVP is the first thing investors read. Make it specific.">
                  Your UVP in One Sentence
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm text-center">Refine your auto-generated Unique Value Proposition based on your map and matrix data.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <input type="text" value={data.uvp.customer} onChange={e=>setData({...data, uvp: {...data.uvp, customer: e.target.value}})} placeholder="Target Customer (e.g. SMB Finance Leaders)" className="p-3 border-2 border-gray-200 rounded-sm outline-none text-sm" />
                  <input type="text" value={data.uvp.problem} onChange={e=>setData({...data, uvp: {...data.uvp, problem: e.target.value}})} placeholder="Their Problem (e.g. to reduce churn manually)" className="p-3 border-2 border-gray-200 rounded-sm outline-none text-sm" />
                  <input type="text" value={data.uvp.benefit} onChange={e=>setData({...data, uvp: {...data.uvp, benefit: e.target.value}})} placeholder="Benefit Provided (e.g. provides AI churn prediction)" className="p-3 border-2 border-gray-200 rounded-sm outline-none text-sm" />
                  <input type="text" value={data.uvp.diff} onChange={e=>setData({...data, uvp: {...data.uvp, diff: e.target.value}})} placeholder="Key Differentiator (e.g. deliver results in 1 week)" className="p-3 border-2 border-gray-200 rounded-sm outline-none text-sm" />
                </div>
                
                <div className="bg-[#f2f6fa] border-2 border-dashed border-[#1e4a62]/20 p-6 rounded-sm mb-8 relative">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-black text-[#1e4a62]/60 uppercase tracking-widest">Editable Pitch Fragment (UVP)</label>
                    {data.uvpOverride !== undefined && (
                      <button onClick={() => setData({...data, uvpOverride: undefined})} className="text-xs font-bold text-indigo-500 hover:text-indigo-700">Restore Auto-Sync</button>
                    )}
                  </div>
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultUVP}
                    onChange={(e) => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-white p-5 border-2 border-[#1e4a62]/10 rounded-sm focus:border-emerald-500 outline-none text-[#022f42] font-medium text-lg min-h-[140px] leading-relaxed shadow-sm"
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-sm mb-10">
                  <h4 className="text-sm font-bold text-emerald-900 mb-2">Automated Defensibility Summary:</h4>
                  <p className="text-sm text-emerald-800 italic">&quot;Our competitive advantage defends against {data.competitors.length} competitors. With a Moat Strength Score of {moatScore}%, we are positioned to deeply protect our whitespace using our highest rated advantages.&quot;</p>
                </div>

                <div className="flex justify-center">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? <><Check className="w-5 h-5"/> Saved Component</> : <><Save className="w-5 h-5"/> Save UVP & Continue</>}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Controls */}
          {step < 5 && (
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                className={`font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1e4a62] hover:text-[#022f42]'}`}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4"/> Back
              </button>
              <button
                onClick={() => setStep(s => Math.min(5, s + 1))}
                className="bg-[#022f42] text-white px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#1b4f68] transition-colors flex items-center gap-2 shadow-md"
              >
                Next Workshop Step <ArrowRight className="w-4 h-4"/>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
