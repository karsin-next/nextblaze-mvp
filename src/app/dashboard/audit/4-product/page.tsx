"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, CheckCircle2, AlertCircle, Activity, 
  Lightbulb, Palette, Rocket, BadgeCheck, Users, HelpCircle, Save, Check
} from "lucide-react";
import Link from "next/link";

export default function ProductReadinessPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    status: "", // Concept, Prototype, MVP, Live
    builtSoFar: "",
    timeline: "",
    risks: "",
    testingPlan: [] as string[],
    testedUsers: "",
    metrics: { registered: "", active: "", paying: "", growth: "" },
    feedbackMethods: [] as string[],
    feedbackExample: "",
    gap: "",
    isGapBlocking: false,
    validationParams: [] as string[],
    validationExample: "",
    painkiller: "", // switchable, annoying, trouble
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "", step3: "", step4: "" });

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("audit_1_1_4_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData(parsed.data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("audit_1_1_4_v2", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Scoring Logic
  let scoreExistence = 0, scoreTraction = 0, scoreFeedback = 0, scoreValidation = 0, scorePainkiller = 0;
  
  if (data.status === "Concept") scoreExistence = 0;
  else if (data.status === "Prototype") scoreExistence = 10;
  else if (data.status === "MVP") scoreExistence = 25;
  else if (data.status === "Live") scoreExistence = 40;

  if (data.status === "Live" && parseInt(data.metrics.paying) > 0) {
    const p = parseInt(data.metrics.paying);
    if (p > 50) scoreTraction = 15;
    else if (p > 10) scoreTraction = 10;
    else scoreTraction = 5;
  }

  if (data.feedbackMethods.length > 0 && !data.feedbackMethods.includes("No formal feedback")) scoreFeedback = 10;
  
  if (data.validationParams.length > 0 && !data.validationParams.includes("No validation yet")) {
    scoreValidation = 10;
    if (data.validationExample.length > 10) scoreValidation = 20;
  }

  if (data.painkiller === "trouble") scorePainkiller = 15;
  else if (data.painkiller === "annoying") scorePainkiller = 5;

  const totalScore = scoreExistence + scoreTraction + scoreFeedback + scoreValidation + scorePainkiller;

  // AI Feedback Updates
  useEffect(() => {
    if (data.status === "Concept" || data.status === "Prototype") {
      setAiFlags(p => ({...p, step1: "You selected an early-stage phase. Investors will expect a clear timeline to MVP. We'll help define that."}));
    } else if (data.status) {
      setAiFlags(p => ({...p, step1: "You have a tangible product in-market. Focus on retention and feedback loops moving forward."}));
    }
  }, [data.status]);

  useEffect(() => {
    if ((data.status === "Concept" || data.status === "Prototype") && data.risks.length > 0 && data.risks.length < 10) {
      setAiFlags(p => ({...p, step2: "You identified a timeline risk but it's very brief. Be specific about constraints (e.g. dev hiring, auth API access)."}));
    } else if (data.status === "Live" || data.status === "MVP") {
      if (data.feedbackMethods.length > 0 && data.feedbackExample.length < 10) {
        setAiFlags(p => ({...p, step2: "You collect feedback but didn't mention acting on it. Add one example of a change you made."}));
      } else if (data.metrics.paying && parseInt(data.metrics.paying) === 0) {
        setAiFlags(p => ({...p, step2: "No paying customers yet—that's okay! Focus on getting your first 3-5 paid users as a primary goal."}));
      } else {
        setAiFlags(p => ({...p, step2: "Your metrics and feedback loop have been logged."}));
      }
    }
  }, [data.status, data.risks, data.feedbackMethods, data.feedbackExample, data.metrics]);

  useEffect(() => {
    if (data.validationParams.includes("No validation yet")) {
      setAiFlags(p => ({...p, step3: "You haven't validated your product. Try running 5 customer interviews this week to de-risk development."}));
    } else if (data.painkiller === "switchable") {
      setAiFlags(p => ({...p, step3: "Your product might be a clear 'nice-to-have'. Focus on finding an adjacent problem that's much more painful."}));
    } else if (data.painkiller === "trouble") {
      setAiFlags(p => ({...p, step3: "This is a Painkiller—investors love this. Emphasize this absolute urgency in your pitch."}));
    }
  }, [data.validationParams, data.painkiller]);

  const handleNextStep = () => {
    if (step === 1 && !data.status) return;
    setStep(Math.min(5, step + 1));
  };

  const handleCheckbox = (arrName: "testingPlan" | "feedbackMethods" | "validationParams", val: string, exclusiveVal: string) => {
    setData(prev => {
      const arr = prev[arrName];
      if (val === exclusiveVal) return { ...prev, [arrName]: [val] };
      let newArr = arr.filter(i => i !== exclusiveVal);
      if (newArr.includes(val)) newArr = newArr.filter(i => i !== val);
      else newArr = [...newArr, val];
      return { ...prev, [arrName]: newArr };
    });
  };

  const defaultSummary = `Our product is currently a ${data.status ? data.status.toLowerCase() : "[phase]"}. We have ${data.metrics.active || "0"} active users and ${data.metrics.paying || "0"} paying customers. ${data.validationExample || "[Validation example]"}. The biggest gap we're addressing next is ${data.gap || "[gap]"}. Based on user analysis, this is a ${data.painkiller === "trouble" ? "painkiller" : data.painkiller === "annoying" ? "vitamin" : "[nice-to-have]"}.`;

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/audit/5-market", 1000);
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.4 Product Readiness"
        title="MVP & Adoption Readiness"
        description="Articulate the current state of your product, validate that it genuinely solves the core problem, and prove it to investors."
      />

      {/* Progress Bar */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-2 w-10 md:w-16 rounded-full transition-all ${step >= i ? 'bg-[#022f42]' : 'bg-gray-200'}`} />
          ))}
        </div>
        <span className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest">Assessment Step {step} of 5</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Status */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2">
                  Does your product exist in a form someone can use today? <span title="Be honest. A clear prototype with a concrete build plan is often better than an over-promised MVP."><Info className="w-4 h-4 text-gray-400" /></span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 mb-8">
                  <button onClick={() => setData({...data, status: "Concept"})} className={`p-6 border-2 rounded-sm text-left transition-all ${data.status === "Concept" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}>
                    <Lightbulb className={`w-8 h-8 mb-3 ${data.status === "Concept" ? "text-indigo-600" : "text-gray-400"}`} />
                    <h3 className="font-black text-[#022f42] mb-1">Concept Only</h3>
                    <p className="text-xs text-gray-500">We have an idea and sketches, but nothing built yet.</p>
                  </button>
                  <button onClick={() => setData({...data, status: "Prototype"})} className={`p-6 border-2 rounded-sm text-left transition-all ${data.status === "Prototype" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}>
                    <Palette className={`w-8 h-8 mb-3 ${data.status === "Prototype" ? "text-indigo-600" : "text-gray-400"}`} />
                    <h3 className="font-black text-[#022f42] mb-1">Prototype / Mockup</h3>
                    <p className="text-xs text-gray-500">We have clickable wireframes or Figma designs.</p>
                  </button>
                  <button onClick={() => setData({...data, status: "MVP"})} className={`p-6 border-2 rounded-sm text-left transition-all ${data.status === "MVP" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}>
                    <Rocket className={`w-8 h-8 mb-3 ${data.status === "MVP" ? "text-indigo-600" : "text-gray-400"}`} />
                    <h3 className="font-black text-[#022f42] mb-1">Working MVP</h3>
                    <p className="text-xs text-gray-500">A functional product is live with early testers.</p>
                  </button>
                  <button onClick={() => setData({...data, status: "Live"})} className={`p-6 border-2 rounded-sm text-left transition-all ${data.status === "Live" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}>
                    <BadgeCheck className={`w-8 h-8 mb-3 ${data.status === "Live" ? "text-indigo-600" : "text-gray-400"}`} />
                    <h3 className="font-black text-[#022f42] mb-1">Live Product</h3>
                    <p className="text-xs text-gray-500">Product is broadly live and generating revenue.</p>
                  </button>
                </div>

                {aiFlags.step1 && (
                  <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <AIAssistedInsight content={aiFlags.step1} />
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2A: Building Track */}
            {step === 2 && (data.status === "Concept" || data.status === "Prototype") && (
              <motion.div key="s2a" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">You&apos;re in building mode. Let&apos;s get specific.</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Investors invest in execution. Define exactly what&apos;s built and what remains.</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-2 flex justify-between">
                       <span>What&apos;s Built So Far? <span title="Investors want to see you grasp the scope of work. Be specific about APIs, frontend, etc."><Info className="w-4 h-4 text-gray-400 inline cursor-help"/></span></span>
                    </label>
                    <textarea value={data.builtSoFar} onChange={e=>setData({...data, builtSoFar: e.target.value})} maxLength={300} placeholder="e.g. Figma prototype finished. Frontend 40% coded. Database mapped." className="w-full p-4 border-2 border-gray-200 rounded-sm outline-none focus:border-indigo-500 min-h-[100px] text-sm font-medium"/>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                      <label className="block text-sm font-bold text-[#022f42] mb-2">Timeline to MVP</label>
                      <input type="month" value={data.timeline} onChange={e=>setData({...data, timeline: e.target.value})} className="w-full p-4 border-2 border-gray-200 rounded-sm outline-none focus:border-indigo-500 text-sm font-medium"/>
                    </div>
                    <div className="w-full md:w-2/3">
                      <label className="block text-sm font-bold text-[#022f42] mb-2 flex justify-between">
                        <span>Biggest risk to timeline? <span title="Investors know things break. Identify constraints."><Info className="w-4 h-4 text-gray-400 inline cursor-help"/></span></span>
                      </label>
                      <input type="text" value={data.risks} onChange={e=>setData({...data, risks: e.target.value})} maxLength={200} placeholder="e.g. Waiting on partner API access..." className="w-full p-4 border-2 border-gray-200 rounded-sm outline-none focus:border-indigo-500 text-sm font-medium"/>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-3 mt-4">User Testing Plan</label>
                    <div className="space-y-2 mb-4">
                      {["Internal team testing", "Beta waitlist", "Paid pilot", "Public beta", "No formal testing plan"].map(plan => (
                        <label key={plan} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={data.testingPlan.includes(plan)} onChange={() => handleCheckbox("testingPlan", plan, "No formal testing plan")} className="w-5 h-5 accent-indigo-600 rounded-sm" />
                          <span className="text-sm font-medium text-[#022f42]">{plan}</span>
                        </label>
                      ))}
                    </div>
                    {data.testingPlan.length > 0 && !data.testingPlan.includes("No formal testing plan") && (
                      <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}}>
                        <label className="block text-xs font-bold text-indigo-800 mb-1">Expected number of testers before launch?</label>
                        <input type="number" value={data.testedUsers} onChange={e=>setData({...data, testedUsers: e.target.value})} className="p-2 border-b-2 border-indigo-300 w-32 bg-transparent outline-none focus:border-indigo-600 text-sm font-bold"/>
                      </motion.div>
                    )}
                  </div>
                </div>

                {aiFlags.step2 && (
                  <div className="mt-8 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <AIAssistedInsight content={aiFlags.step2} />
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2B: Live Track */}
            {step === 2 && (data.status === "MVP" || data.status === "Live") && (
              <motion.div key="s2b" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2">Great—you have something live. Let&apos;s quantify it.</h2>
                <p className="text-[#1e4a62] mb-8 text-sm">Even small numbers are valuable. A startup with 10 passionate customers beats one with 1,000 disengaged ones.</p>

                <div className="overflow-x-auto border border-gray-200 rounded-sm mb-8">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#f2f6fa] text-[#022f42] uppercase font-black text-xs">
                      <tr><th className="px-5 py-4 border-b">Metric</th><th className="px-5 py-4 border-b border-l text-center">Value</th></tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-5 py-4 font-bold text-[#1e4a62]">Total registered users <span title="Include all who signed up."><Info className="w-4 h-4 text-gray-400 inline ml-1 cursor-help"/></span></td>
                        <td className="px-5 py-2 border-l border-gray-100 bg-white"><input type="number" value={data.metrics.registered} onChange={e=>setData({...data, metrics: {...data.metrics, registered: e.target.value}})} className="w-full p-2 outline-none text-center font-bold font-mono focus:border-b-2 border-indigo-500" placeholder="0"/></td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-5 py-4 font-bold text-[#1e4a62]">30-Day Active Users <span title="Users who actually performed a key action."><Info className="w-4 h-4 text-gray-400 inline ml-1 cursor-help"/></span></td>
                        <td className="px-5 py-2 border-l border-gray-100 bg-white"><input type="number" value={data.metrics.active} onChange={e=>setData({...data, metrics: {...data.metrics, active: e.target.value}})} className="w-full p-2 outline-none text-center font-bold font-mono focus:border-b-2 border-indigo-500" placeholder="0"/></td>
                      </tr>
                      <tr className="border-b bg-[#fffdf0]">
                        <td className="px-5 py-4 font-bold text-[#1e4a62]">Paying Customers <span title="Paid at least once."><Info className="w-4 h-4 text-gray-400 inline ml-1 cursor-help"/></span></td>
                        <td className="px-5 py-2 border-l border-gray-100"><input type="number" value={data.metrics.paying} onChange={e=>setData({...data, metrics: {...data.metrics, paying: e.target.value}})} className="w-full p-2 outline-none bg-transparent text-center font-black text-indigo-600 font-mono focus:border-b-2 border-indigo-500" placeholder="0"/></td>
                      </tr>
                      <tr>
                        <td className="px-5 py-4 font-bold text-[#1e4a62]">Monthly Active Users (MAU) Growth (%) <span title="Compare last 30 days to prev 30 days."><Info className="w-4 h-4 text-gray-400 inline ml-1 cursor-help"/></span></td>
                        <td className="px-5 py-2 border-l border-gray-100 bg-white"><input type="text" value={data.metrics.growth} onChange={e=>setData({...data, metrics: {...data.metrics, growth: e.target.value}})} className="w-full p-2 outline-none text-center font-bold font-mono focus:border-b-2 border-indigo-500" placeholder="e.g. +15%"/></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-3">Feedback Loop Validation</label>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {["In-app widget", "User interviews", "NPS Surveys", "Support tickets", "App Store reviews", "No formal feedback"].map(fb => (
                        <label key={fb} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={data.feedbackMethods.includes(fb)} onChange={() => handleCheckbox("feedbackMethods", fb, "No formal feedback")} className="w-4 h-4 accent-indigo-600 rounded-sm" />
                          <span className="text-sm font-medium text-[#022f42]">{fb}</span>
                        </label>
                      ))}
                    </div>
                    {data.feedbackMethods.length > 0 && !data.feedbackMethods.includes("No formal feedback") && (
                      <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}}>
                        <input type="text" value={data.feedbackExample} onChange={e=>setData({...data, feedbackExample: e.target.value})} maxLength={200} placeholder="Example of a feature added based on feedback..." className="w-full p-3 border-b-2 border-indigo-300 bg-transparent outline-none focus:border-indigo-600 text-sm font-medium"/>
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#022f42] mb-2">Biggest limitation in current product?</label>
                    <textarea value={data.gap} onChange={e=>setData({...data, gap: e.target.value})} maxLength={250} placeholder="e.g. Dashboard is basic, users must export to Excel." className="w-full p-4 border-2 border-gray-200 rounded-sm outline-none focus:border-indigo-500 min-h-[80px] text-sm font-medium mb-2"/>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={data.isGapBlocking} onChange={e=>setData({...data, isGapBlocking: e.target.checked})} className="w-5 h-5 accent-rose-500 rounded-sm"/>
                      <span className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest text-[10px]">Blocking adoption natively</span>
                    </label>
                  </div>
                </div>

                {aiFlags.step2 && (
                  <div className="mt-8 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <AIAssistedInsight content={aiFlags.step2} />
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: Problem/Solution Fit */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-2 flex items-center gap-2" title="Linking directly to Module 1.1.1 Problem Statement.">
                  Problem-Fit Validation <Info className="w-4 h-4 text-gray-400" />
                </h2>
                <p className="text-[#1e4a62] mb-8 text-sm">How do you know for sure your product solves the problem?</p>

                <div className="mb-8">
                  <label className="block text-sm font-bold text-[#022f42] mb-3">Empirical Validation Evidence</label>
                  <div className="space-y-3 mb-4">
                    {["Customer interviews confirming need", "Beta users provided feedback", "Paid specifically for this problem", "Quantifiable ROI (time/money)", "No validation yet"].map(ev => (
                      <label key={ev} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={data.validationParams.includes(ev)} onChange={() => handleCheckbox("validationParams", ev, "No validation yet")} className="w-5 h-5 accent-indigo-600 rounded-sm" />
                        <span className="text-sm font-medium text-[#022f42]">{ev}</span>
                      </label>
                    ))}
                  </div>
                  {data.validationParams.length > 0 && !data.validationParams.includes("No validation yet") && (
                    <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}}>
                      <textarea value={data.validationExample} onChange={e=>setData({...data, validationExample: e.target.value})} placeholder="Share specific example: e.g. Customer reduced reporting time from 4hr to 20m..." className="w-full p-4 border-2 border-indigo-200 rounded-sm outline-none focus:border-indigo-500 min-h-[80px] text-sm font-medium"/>
                    </motion.div>
                  )}
                </div>

                <div className="bg-[#f2f6fa] border border-gray-200 p-6 rounded-sm mb-6">
                  <label className="block text-sm font-bold text-[#022f42] mb-4 flex items-center gap-2">
                    If you stopped offering your product tomorrow, what would they do? <span title="The 'Painkiller vs Vitamin' test."><HelpCircle className="w-4 h-4 text-gray-400 cursor-help"/></span>
                  </label>
                  <div className="space-y-3">
                    <button onClick={() => setData({...data, painkiller: "switchable"})} className={`w-full p-4 border-2 rounded-sm text-left flex items-center gap-4 transition-colors ${data.painkiller === 'switchable' ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <span className="text-2xl">🔄</span> 
                      <div><div className="font-bold text-sm text-[#022f42]">Find another solution fast</div><div className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">They&apos;d switch to a competitor within days</div></div>
                    </button>
                    <button onClick={() => setData({...data, painkiller: "annoying"})} className={`w-full p-4 border-2 rounded-sm text-left flex items-center gap-4 transition-colors ${data.painkiller === 'annoying' ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <span className="text-2xl">😤</span> 
                      <div><div className="font-bold text-sm text-[#022f42]">Be annoyed but adapt</div><div className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">They&apos;d manage without it, though slower</div></div>
                    </button>
                    <button onClick={() => setData({...data, painkiller: "trouble"})} className={`w-full p-4 border-2 rounded-sm text-left flex items-center gap-4 transition-colors ${data.painkiller === 'trouble' ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <span className="text-2xl">🆘</span> 
                      <div><div className="font-bold text-sm text-[#022f42]">Be in real operational trouble</div><div className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Their operations would halt drastically</div></div>
                    </button>
                  </div>
                </div>

                {aiFlags.step3 && (
                  <div className="mt-6 flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <Activity className="w-5 h-5 mt-0.5 text-emerald-500 shrink-0" />
                    <AIAssistedInsight content={aiFlags.step3} />
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: Readiness Score */}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-emerald-500 rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-6 text-center">Your Product Readiness Score</h2>

                <div className="flex flex-col items-center justify-center mb-10">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                      <path className={`${totalScore >= 80 ? 'text-emerald-500' : totalScore >= 50 ? 'text-indigo-500' : 'text-amber-500'} transition-all duration-1000`} strokeDasharray={`${totalScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor"/>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-5xl font-black text-[#022f42]">{totalScore}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e4a62] mt-1">/ 100</span>
                    </div>
                  </div>
                  <div className="text-center font-bold font-mono text-sm tracking-widest uppercase mt-4 text-[#1e4a62]">
                    Status: {totalScore >= 86 ? 'Scaling (PMF Found)' : totalScore >= 61 ? 'Traction Active' : totalScore >= 31 ? 'Building Phase' : 'Early Concept'}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-sm overflow-hidden mb-6">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b"><td className="p-3 font-bold text-[#1e4a62] bg-[#f2f6fa]">Product Status Tier</td><td className="p-3 text-right font-black">{scoreExistence}/40</td></tr>
                      <tr className="border-b"><td className="p-3 font-bold text-[#1e4a62]">Revenue / Scale Traction</td><td className="p-3 text-right font-black">{scoreTraction}/15</td></tr>
                      <tr className="border-b"><td className="p-3 font-bold text-[#1e4a62] bg-[#f2f6fa]">Feedback Pipelines</td><td className="p-3 text-right font-black">{scoreFeedback}/10</td></tr>
                      <tr className="border-b"><td className="p-3 font-bold text-[#1e4a62]">Validation Artifacts</td><td className="p-3 text-right font-black">{scoreValidation}/20</td></tr>
                      <tr><td className="p-3 font-bold text-[#1e4a62] bg-[#f2f6fa]">Painkiller Assessment</td><td className="p-3 text-right font-black">{scorePainkiller}/15</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-sm">
                  <h4 className="text-sm font-bold text-emerald-900 mb-1">AI Strategic Insight</h4>
                  <p className="text-sm text-emerald-800">
                    Your score is {totalScore}. {totalScore >= 80 ? "You are in a dominant position—investors will see you as vastly de-risked. Emphasize scaling metrics." : "You are early. Highlight product vision and validation interviews as next milestones."}
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Investor Summary */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border border-gray-100 rounded-sm">
                <h2 className="text-3xl font-black text-[#022f42] mb-2 text-center">Investor-Ready Product Pulse</h2>
                <p className="text-[#1e4a62] mb-8 text-sm text-center">Refine this automated executive summary for inclusion in the final snapshot.</p>

                <div className="bg-[#f2f6fa] border-2 border-dashed border-[#1e4a62]/20 p-6 rounded-sm mb-8 relative">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-black text-[#1e4a62]/60 uppercase tracking-widest">Snapshot Final Format</label>
                    {data.uvpOverride !== undefined && (
                      <button onClick={() => setData({...data, uvpOverride: undefined})} className="text-xs font-bold text-indigo-500 hover:text-indigo-700">Restore Auto-Sync</button>
                    )}
                  </div>
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultSummary}
                    onChange={(e) => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-white p-5 border-2 border-[#1e4a62]/10 rounded-sm focus:border-emerald-500 outline-none text-[#022f42] font-medium text-lg min-h-[160px] leading-relaxed shadow-sm resize-none"
                  />
                </div>

                <div className="flex justify-center flex-col md:flex-row gap-4">
                  <Link href="/dashboard/financials" className="px-8 py-4 font-bold uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-500 hover:bg-gray-50">
                    Save & Return Later
                  </Link>
                  <button onClick={handleSaveAndContinue} className={`px-12 py-4 font-black uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? <><Check className="w-5 h-5"/> Saved Component</> : <><Save className="w-5 h-5"/> Continue to Module 1.1.5</>}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation */}
          {step < 5 && (
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} className={`font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1e4a62] hover:text-[#022f42]'}`} disabled={step === 1}>
                <ArrowLeft className="w-4 h-4"/> Back
              </button>
              <button onClick={handleNextStep} disabled={step === 1 && !data.status} className={`px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm transition-colors flex items-center gap-2 shadow-md ${step === 1 && !data.status ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#022f42] text-white hover:bg-[#1b4f68]'}`}>
                Next Step <ArrowRight className="w-4 h-4"/>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
