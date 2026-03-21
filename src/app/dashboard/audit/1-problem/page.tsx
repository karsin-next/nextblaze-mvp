"use client";

import { useState, useEffect } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Lightbulb, AlertCircle, CheckCircle2, ChevronRight, 
  Info, ExternalLink, Activity, Target, Save, Check
} from "lucide-react";
import Link from "next/link";

export default function PainExplorerPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State
  const [data, setData] = useState({
    problemDesc: "",
    whoTitle: "",
    whoCompany: "",
    whoDay: "",
    currentSolution: "",
    missingSolution: "",
    intensity: 5,
    frequency: 5,
    alternatives: 5,
    finalSummary: ""
  });

  const [aiFlags, setAiFlags] = useState({
    step1: "",
    step2: "",
    step3: "",
    step4: "",
    step5: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("audit_1_1_1_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data || data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {
        console.error("Failed to load audit 1.1.1 v2", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("audit_1_1_1_v2", JSON.stringify({ data, step }));
    }
  }, [data, step, isLoaded]);

  // Live AI Feedback Handlers
  const handleProblemDescChange = (val: string) => {
    setData(prev => ({ ...prev, problemDesc: val }));
    if (val.length < 20) setAiFlags(p => ({ ...p, step1: "Too vague – investors won't understand the pain." }));
    else if (!val.includes("struggle") && !val.includes("waste") && !val.includes("cannot") && !val.includes("hard")) {
      setAiFlags(p => ({ ...p, step1: "Consider adding a verb that describes the struggle (e.g., 'struggle to', 'cannot', 'waste time')." }));
    } else {
      setAiFlags(p => ({ ...p, step1: "Good – you described a quantifiable struggle." }));
    }
  };

  const handleWhoChange = (field: string, val: string) => {
    const newData = { ...data, [field]: val };
    setData(newData);
    if (!newData.whoTitle) {
      setAiFlags(p => ({ ...p, step2: "You haven't specified a decision-maker – investors will ask who signs the cheque." }));
    } else {
      setAiFlags(p => ({ ...p, step2: "Strong! Investors love specific B2B titles." }));
    }
  };

  const handleSolutionChange = (val: string) => {
    setData(prev => ({ ...prev, currentSolution: val, missingSolution: "" }));
    if (val === "Use a competitor product") {
      setAiFlags(p => ({ ...p, step3: "If customers are already using a competitor, your differentiator needs to be clear – we'll help in Module 1.1.3." }));
    } else if (val === "Manual workaround") {
      setAiFlags(p => ({ ...p, step3: "Manual workarounds are great! It proves they care enough to try, but lack the right software." }));
    } else {
      setAiFlags(p => ({ ...p, step3: "" }));
    }
  };

  const generateSummary = () => {
    const freqWords = data.frequency > 7 ? "daily" : data.frequency > 4 ? "regularly" : "occasionally";
    const altWords = data.alternatives > 7 ? "highly inadequate" : data.alternatives > 4 ? "tolerable but flawed" : "mostly functional";
    const intWords = data.intensity > 7 ? "severe operational pain and lost revenue" : "noticeable friction in their workflow";
    
    return `${data.whoTitle || "[Customer]"} at ${data.whoCompany || "[Company]"} experiences the problem of ${data.problemDesc.substring(0, 50) || "[problem]"} ${freqWords}. The current alternatives are ${altWords}, and the problem causes ${intWords}. We are building a solution to replace their current ${data.currentSolution || "workarounds"}.`;
  };

  useEffect(() => {
    if (step === 5 && !data.finalSummary) {
      setData(prev => ({ ...prev, finalSummary: generateSummary() }));
    }
  }, [step]);

  // Math calculated to give 0-100 based on founder specs (Higher Intensity & Frequency & Bad Alerts = High Score)
  const getSeverityScore = () => {
    // Spec requested: (Intensity x Frequency) / (Alternatives + 1). 
    // We invert alternative's denominator impact so 10 (no good solutions) = High score.
    const altFactor = 11 - data.alternatives; // if alt=10 (bad), altFactor=1.
    const raw = (data.intensity * data.frequency) / (altFactor);
    // Max raw: (10 * 10) / 1 = 100.
    return Math.min(Math.round(raw), 100);
  };

  const score = getSeverityScore();
  let scoreLabel = "";
  if (score >= 80) scoreLabel = "Critical Problem – Investors will pay attention";
  else if (score >= 50) scoreLabel = "Significant Problem – Worth Solving";
  else if (score >= 20) scoreLabel = "Moderate Problem – Needs Stronger Justification";
  else scoreLabel = "Low Severity – May Be Hard to Fund";

  // AI Feedback on Sliders
  useEffect(() => {
    let msg = "";
    if (score >= 80) msg = "Your severity score is excellent – this is a strong signal to investors. This is a clear painkiller opportunity.";
    else if (data.intensity >= 8) msg = "At level 8+, investors see this as a 'painkiller'. But ensure frequency is high enough to justify subscription pricing.";
    else if (data.intensity <= 4) msg = "At level 4 or below, this is a 'vitamin' – nice to have but very hard to sell in a B2B market.";
    setAiFlags(p => ({ ...p, step4: msg }));
  }, [data.intensity, data.frequency, data.alternatives, score]);

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      window.location.href = "/dashboard/audit/2-customer";
    }, 1000);
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.1 Problem Explorer"
        title="Pain & Need Explorer Workshop"
        description="Core Philosophy: Investors don't invest in solutions; they invest in problems worth solving. This module ensures you can communicate your problem with extreme rigor."
      />

      {/* Progress Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-2 w-12 md:w-20 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest">Step {step} of 5</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Interactive Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2 group cursor-pointer">
                  Describe the Problem <span title="Be specific. Instead of 'cash flow problems', say 'SMEs don't know their runway'."><Info className="w-4 h-4 text-gray-400 group-hover:text-[#ffd800] transition-colors" /></span>
                </h2>
                <p className="text-[#1e4a62] mb-6 text-sm">Provide the qualitative foundation. (Max 250 characters)</p>
                
                <textarea 
                  value={data.problemDesc}
                  onChange={(e) => handleProblemDescChange(e.target.value)}
                  maxLength={250}
                  className="w-full p-4 border-2 border-[#1e4a62]/20 rounded-sm focus:border-[#ffd800] focus:ring-0 outline-none min-h-[150px] resize-none text-[#022f42] font-medium"
                  placeholder="Example: Early-stage SaaS founders struggle to build investor-ready financial models without spending weeks in spreadsheets."
                />
                <div className="text-right text-xs text-gray-400 mt-2 font-bold">{data.problemDesc.length}/250</div>

                {aiFlags.step1 && (
                  <div className={`mt-6 p-4 rounded-sm flex gap-3 items-start border ${data.problemDesc.length > 20 && !aiFlags.step1.includes("vague") ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                    <Activity className={`w-5 h-5 mt-0.5 ${data.problemDesc.length > 20 && !aiFlags.step1.includes("vague") ? 'text-emerald-500' : 'text-amber-500'}`} />
                    <div>
                      <h4 className={`text-sm font-bold ${data.problemDesc.length > 20 && !aiFlags.step1.includes("vague") ? 'text-emerald-900' : 'text-amber-900'}`}>Live AI Feedback</h4>
                      <p className={`text-sm ${data.problemDesc.length > 20 && !aiFlags.step1.includes("vague") ? 'text-emerald-800' : 'text-amber-800'}`}>{aiFlags.step1}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2 group cursor-pointer">
                  Who Experiences This Problem? <span title="Don't just say 'businesses'. Say 'CFOs at mid-market SaaS companies'."><Info className="w-4 h-4 text-gray-400 group-hover:text-[#ffd800] transition-colors" /></span>
                </h2>
                <p className="text-[#1e4a62] mb-6 text-sm">Customer Definition. Be highly specific about the decision-maker.</p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-2">Job Title / Role (The Buyer)</label>
                    <input type="text" value={data.whoTitle} onChange={(e) => handleWhoChange("whoTitle", e.target.value)} placeholder="e.g. VP of Logistics, CFO, Engineering Manager" className="w-full p-3 border-2 border-[#1e4a62]/20 rounded-sm focus:border-[#ffd800] outline-none text-[#022f42] font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-2">Company Size / Industry</label>
                    <input type="text" value={data.whoCompany} onChange={(e) => handleWhoChange("whoCompany", e.target.value)} placeholder="e.g. Mid-market Series B tech companies" className="w-full p-3 border-2 border-[#1e4a62]/20 rounded-sm focus:border-[#ffd800] outline-none text-[#022f42] font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-2">Typical day-to-day scenario</label>
                    <textarea value={data.whoDay} onChange={(e) => handleWhoChange("whoDay", e.target.value)} placeholder="e.g. They spend their mornings compiling reports manually across 3 disparate systems..." className="w-full p-3 border-2 border-[#1e4a62]/20 rounded-sm focus:border-[#ffd800] outline-none text-[#022f42] font-medium h-24 resize-none" />
                  </div>
                </div>

                {aiFlags.step2 && (
                  <div className={`mt-6 p-4 rounded-sm flex gap-3 items-start border ${!data.whoTitle ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <AlertCircle className={`w-5 h-5 mt-0.5 ${!data.whoTitle ? 'text-rose-500' : 'text-emerald-500'}`} />
                    <div>
                      <h4 className={`text-sm font-bold ${!data.whoTitle ? 'text-rose-900' : 'text-emerald-900'}`}>Live AI Flag</h4>
                      <p className={`text-sm ${!data.whoTitle ? 'text-rose-800' : 'text-emerald-800'}`}>{aiFlags.step2}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2 group cursor-pointer">
                  Current Solutions & Alternatives <span title="If you say 'none', investors will assume there is no market. Excel is always a competitor."><Info className="w-4 h-4 text-gray-400 group-hover:text-[#ffd800] transition-colors" /></span>
                </h2>
                <p className="text-[#1e4a62] mb-6 text-sm">How do customers currently solve this problem in the market today?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {["They ignore it (live with the pain)", "Manual workaround", "Use a competitor product", "Use a non-obvious substitute", "Other"].map(opt => (
                     <button
                       key={opt}
                       onClick={() => handleSolutionChange(opt)}
                       className={`p-4 text-left border-2 rounded-sm font-bold text-sm transition-all flex items-center justify-between ${
                         data.currentSolution === opt ? "border-[#ffd800] bg-[#ffd800]/10 text-[#022f42]" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                       }`}
                     >
                       {opt}
                       {data.currentSolution === opt && <CheckCircle2 className="w-4 h-4 text-[#ffd800]"/>}
                     </button>
                  ))}
                </div>

                {data.currentSolution === "Use a competitor product" && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mb-6">
                    <label className="block text-sm font-bold text-[#022f42] mb-2 ml-1">What&apos;s missing from that solution?</label>
                    <textarea value={data.missingSolution} onChange={(e) => setData({...data, missingSolution: e.target.value})} placeholder="e.g. It's built for enterprise, so it's far too expensive and complex for SMBs..." className="w-full p-4 border-2 border-indigo-200 rounded-sm focus:border-indigo-500 outline-none text-[#022f42] font-medium" />
                  </motion.div>
                )}

                {data.currentSolution === "Manual workaround" && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mb-6">
                    <label className="block text-sm font-bold text-[#022f42] mb-2 ml-1">What makes the manual process painful?</label>
                    <textarea value={data.missingSolution} onChange={(e) => setData({...data, missingSolution: e.target.value})} placeholder="e.g. Spreadsheets crash, data gets corrupted, takes 3 analysts full time..." className="w-full p-4 border-2 border-indigo-200 rounded-sm focus:border-indigo-500 outline-none text-[#022f42] font-medium" />
                  </motion.div>
                )}

                {aiFlags.step3 && (
                  <div className={`p-4 rounded-sm flex gap-3 items-start border bg-emerald-50 border-emerald-200`}>
                    <Activity className={`w-5 h-5 mt-0.5 text-emerald-500`} />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">Strategic Context</h4>
                      <p className={`text-sm text-emerald-800`}>{aiFlags.step3}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-indigo-600 rounded-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] px-3 py-1 pb-1.5 rounded-bl-sm">The Pain Workshop</div>
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Visual Ranking (Severity)</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Dial in the raw metrics of your market opportunity.</p>
                
                <div className="space-y-8 mb-10">
                  {/* Gauge 1 */}
                  <div className="bg-[#f2f6fa] p-5 rounded-sm border border-[#1e4a62]/10 group">
                    <div className="flex justify-between items-center mb-2">
                       <label className="text-sm font-bold text-[#1e4a62] mb-1 flex items-center gap-1 group">
                         Problem Intensity <span title="Is this a minor annoyance or a massive blocker?"><Info className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" /></span>
                      </label>
                       <span className={`font-black text-xl ${data.intensity > 7 ? 'text-red-500' : data.intensity > 4 ? 'text-amber-500' : 'text-emerald-500'}`}>{data.intensity}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-2">
                      <span>1 (Minor annoyance)</span>
                      <input type="range" min="1" max="10" value={data.intensity} onChange={e => setData({...data, intensity: parseInt(e.target.value)})} className="flex-1 accent-indigo-600" />
                      <span>10 (Crippling risk)</span>
                    </div>
                  </div>

                  {/* Gauge 2 */}
                  <div className="bg-[#f2f6fa] p-5 rounded-sm border border-[#1e4a62]/10 group">
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="font-bold text-[#022f42] flex items-center gap-2 cursor-help" title="A problem that happens daily creates urgency. A yearly problem may not justify a dedicated SaaS solution.">
                         Frequency <Info className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                       </h4>
                       <span className="font-black text-xl text-indigo-600">{data.frequency}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-2">
                      <span>1 (Once a year)</span>
                      <input type="range" min="1" max="10" value={data.frequency} onChange={e => setData({...data, frequency: parseInt(e.target.value)})} className="flex-1 accent-indigo-600" />
                      <span>10 (Multiple times a day)</span>
                    </div>
                  </div>

                  {/* Gauge 3 */}
                  <div className="bg-[#f2f6fa] p-5 rounded-sm border border-[#1e4a62]/10 group">
                    <div className="flex justify-between items-center mb-2">
                       <h4 className="font-bold text-[#022f42] flex items-center gap-2 cursor-help" title="If existing solutions are terrible, your opportunity is huge. If they're good, you need a 10x improvement.">
                         Alternatives Quality <Info className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                       </h4>
                       <span className={`font-black text-xl ${data.alternatives > 7 ? 'text-emerald-500' : 'text-amber-500'}`}>{data.alternatives}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-2">
                      <span>1 (Perfectly solved)</span>
                      <input type="range" min="1" max="10" value={data.alternatives} onChange={e => setData({...data, alternatives: parseInt(e.target.value)})} className="flex-1 accent-indigo-600" />
                      <span>10 (No good solution exists)</span>
                    </div>
                  </div>
                </div>

                {/* Score Render */}
                <div className={`p-6 rounded-sm border-2 text-center transition-colors cursor-help ${
                  score >= 80 ? 'border-red-500 bg-red-50' : score >= 50 ? 'border-amber-500 bg-amber-50' : 'border-[#1e4a62]/20 bg-[#f2f6fa]'
                }`} title="Calculated using: (Intensity × Frequency) heavily weighted against the inadequacy of exiting Alternatives. Higher is better.">
                  <div className="text-sm font-black uppercase tracking-widest text-[#1e4a62] mb-1">Live Problem Severity Score</div>
                  <div className={`text-6xl font-black mb-2 ${score >= 80 ? 'text-red-600' : score >= 50 ? 'text-amber-600' : 'text-[#022f42]'}`}>{score}</div>
                  <div className={`font-bold ${score >= 80 ? 'text-red-800' : score >= 50 ? 'text-amber-800' : 'text-[#1e4a62]'}`}>{scoreLabel}</div>
                </div>

                {aiFlags.step4 && (
                  <div className="mt-6 p-4 rounded-sm flex gap-3 items-start border bg-emerald-50 border-emerald-200">
                    <Target className="w-5 h-5 mt-0.5 text-emerald-500" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">AI Venture Analysis</h4>
                      <p className="text-sm text-emerald-800">{aiFlags.step4}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-emerald-500 rounded-sm">
                <h2 className="text-3xl font-black text-[#022f42] mb-2 text-center">Summary & Investor-Ready Statement</h2>
                <p className="text-[#1e4a62] mb-8 text-sm text-center">Review and refine your auto-generated problem statement for the Executive Summary.</p>
                
                <div className="bg-[#f2f6fa] border-2 border-dashed border-[#1e4a62]/20 p-6 rounded-sm mb-8">
                  <label className="block text-xs font-black text-[#1e4a62]/60 uppercase tracking-widest mb-3">Editable Pitch Fragment</label>
                  <textarea 
                    value={data.finalSummary}
                    onChange={(e) => setData({...data, finalSummary: e.target.value})}
                    className="w-full bg-white p-5 border-2 border-[#1e4a62]/10 rounded-sm focus:border-emerald-500 outline-none text-[#022f42] font-medium text-lg min-h-[180px] leading-relaxed shadow-sm"
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-sm mb-10 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">Formatting Complete</h4>
                    <p className="text-sm text-emerald-800">Your statement is strong. This text will now automatically pipe into your <strong>Investor Snapshot (Module 4.2)</strong> and the <strong>Gap Analysis Report (Module 1.3)</strong> if your score is below threshold.</p>
                    <p className="text-sm text-emerald-800 mt-2 italic">Consider adding a direct quote from a customer interview to make the execution even more compelling.</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? <><Check className="w-5 h-5"/> Saved Successfully</> : <><Save className="w-5 h-5"/> Save & Continue</>}
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
                Next Step <ArrowRight className="w-4 h-4"/>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
