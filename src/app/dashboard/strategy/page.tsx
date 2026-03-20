"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, PieChart, Target, Zap,
  ArrowRight, Landmark, Flag, Info, Sparkles, CheckCircle2, BookOpen, Settings
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function FundraisingStrategyPage() {
  const { user } = useAuth();
  const [raiseAmount, setRaiseAmount] = useState(500000);
  const [preMoney, setPreMoney] = useState(2000000);
  const [instrument, setInstrument] = useState("SAFE");
  const [milestones, setMilestones] = useState(["", "", ""]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user?.id && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`startup_profile_${user.id}`);
        if (saved) setProfile(JSON.parse(saved));
      } catch(e) {}
    }
  }, [user?.id]);

  const postMoney = preMoney + raiseAmount;
  const dilution = (raiseAmount / postMoney) * 100;
  const mrr = parseFloat(profile?.mrr || "0") || 0;
  const burnRate = parseFloat(profile?.burnRate || "0") || 0;
  const netBurn = Math.max(burnRate - mrr, 0);
  const runwayMonths = netBurn > 0 ? Math.floor((parseFloat(profile?.initialCash || "0") || 0) / netBurn) : 0;

  const handleMilestoneChange = (index: number, value: string) => {
    const updated = [...milestones];
    updated[index] = value;
    setMilestones(updated);
  };

  const addMilestone = () => {
    if (milestones.length < 5) setMilestones([...milestones, ""]);
  };

  const removeMilestone = (i: number) => {
    setMilestones(milestones.filter((_, idx) => idx !== i));
  };

  const saveMilestones = () => {
    if (user?.id && typeof window !== "undefined") {
      const existing = JSON.parse(localStorage.getItem(`startup_profile_${user.id}`) || "{}");
      existing.strategyMilestones = milestones;
      existing.raiseAmount = raiseAmount;
      existing.preMoney = preMoney;
      existing.instrument = instrument;
      localStorage.setItem(`startup_profile_${user.id}`, JSON.stringify(existing));
    }
  };

  const generateStrategy = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const filledMilestones = milestones.filter(m => m.trim());
      const dilutionLabel = dilution > 25 ? "high — investors may push back" : dilution < 10 ? "very low — consider if you're undervaluing" : "within healthy seed range (15–20%)";
      setAiReport(
        `At a RM ${preMoney.toLocaleString()} pre-money valuation, raising RM ${raiseAmount.toLocaleString()} gives up ${dilution.toFixed(1)}% equity — ${dilutionLabel}. ` +
        `Your post-money valuation will be RM ${postMoney.toLocaleString()}. ` +
        (mrr > 0 ? `With your current MRR of RM ${mrr.toLocaleString()}, your implied ARR multiple is ${(preMoney / (mrr * 12)).toFixed(1)}x — ` + (preMoney / (mrr * 12) > 20 ? "aggressive for this stage. Be ready to justify this with strong traction data." : "reasonable for seed stage.") : "You have no MRR yet — this is a pre-revenue valuation. You will need strong team and market signals to justify this number. ") +
        (filledMilestones.length > 0 ? ` Your milestone roadmap shows: "${filledMilestones.join('" → "')}" — make sure each milestone is tied to a specific, investor-verifiable metric that signals product-market fit or revenue growth.` : "")
      );
      setIsAnalyzing(false);
    }, 1500);
  };

  const getInstrumentDescription = () => {
    switch(instrument) {
      case "SAFE": return "Standardized YC agreement. High velocity. No interest, no maturity date. Converts to equity at the next priced round based on a defined Valuation Cap.";
      case "Convertible": return "Debt that converts to equity later. Accrues interest (typically 4–8%), has a maturity date (12–24 months), and includes a discount (15–25%) and/or a valuation cap.";
      case "Priced": return "Direct sale of equity at a fixed price per share. Requires a lead investor, a 409A valuation, board formation, and extensive legal documentation (Series A/B standard).";
      default: return "";
    }
  };

  const milestoneExamples = [
    "Reach RM 50K MRR within 6 months",
    "Launch enterprise tier with 3 paying customers",
    "Expand to Singapore market",
    "Hire CTO and lead engineer",
    "Complete ISO 27001 certification",
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      <div className="mb-8">
        <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">Module 2.3</div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#022f42] mb-2">Fundraising Strategy Canvas</h1>
        <p className="text-[#1e4a62] text-sm max-w-2xl">
          Define the mechanics of your next round. Adjust the raise amount and pre-money valuation below — all numbers update in real time. Your financial data from Settings is used to calculate dilution context.
        </p>
      </div>

      {/* Context ribbon from Settings */}
      {profile && (mrr > 0 || burnRate > 0) ? (
        <div className="mb-6 bg-[#022f42] border-l-4 border-[#ffd800] p-4 flex items-start gap-3 rounded-sm">
          <Sparkles className="w-4 h-4 text-[#ffd800] shrink-0 mt-0.5" />
          <div className="text-xs text-[#b0d0e0] leading-relaxed">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#ffd800] block mb-1">AI Assisted — Your Context</span>
            MRR: <strong className="text-white">RM {mrr.toLocaleString()}</strong> &nbsp;|&nbsp;
            Monthly Burn: <strong className="text-white">RM {burnRate.toLocaleString()}</strong> &nbsp;|&nbsp;
            Runway: <strong className="text-white">{runwayMonths > 0 ? `${runwayMonths} months` : "Update cash balance in Settings"}</strong> &nbsp;|&nbsp;
            ARR Multiple at this valuation: <strong className="text-white">{mrr > 0 ? `${(preMoney / (mrr * 12)).toFixed(1)}x` : "Pre-revenue"}</strong>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 border-l-4 border-l-yellow-400 p-4 flex items-start gap-3 rounded-sm">
          <Info className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-800">
            No financial data found. <Link href="/dashboard/settings" className="font-bold underline">Enter your MRR and Burn Rate in Settings</Link> to enable richer AI analysis of your valuation.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Input Form */}
        <div className="lg:col-span-7 space-y-6">

          {/* Round Mechanics */}
          <div className="bg-white p-6 md:p-8 shadow-sm border border-[rgba(2,47,66,0.1)] rounded-sm">
            <h2 className="text-lg font-bold text-[#022f42] mb-6 flex items-center border-b border-[rgba(2,47,66,0.1)] pb-3">
              <Landmark className="w-5 h-5 mr-3 text-[#1e4a62]" /> Round Mechanics
            </h2>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-2 block">Target Raise Amount (RM)</label>
                <div className="flex border border-[rgba(2,47,66,0.15)] bg-white focus-within:border-[#022f42] transition-colors rounded-sm overflow-hidden">
                  <div className="bg-[#f2f6fa] px-4 flex items-center border-r border-[rgba(2,47,66,0.15)] text-xs font-bold text-[#1e4a62]">RM</div>
                  <input type="number" value={raiseAmount} onChange={(e) => setRaiseAmount(Number(e.target.value))} className="w-full p-3 outline-none font-bold text-[#022f42]" />
                </div>
                <p className="text-[10px] text-[#1e4a62] mt-1">Typical seed round in Southeast Asia: RM 500K – RM 5M</p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-2 block">Pre-Money Valuation (RM)</label>
                <div className="flex border border-[rgba(2,47,66,0.15)] bg-white focus-within:border-[#022f42] transition-colors rounded-sm overflow-hidden">
                  <div className="bg-[#f2f6fa] px-4 flex items-center border-r border-[rgba(2,47,66,0.15)] text-xs font-bold text-[#1e4a62]">RM</div>
                  <input type="number" value={preMoney} onChange={(e) => setPreMoney(Number(e.target.value))} className="w-full p-3 outline-none font-bold text-[#022f42]" />
                </div>
                <p className="text-[10px] text-[#1e4a62] mt-1">This is what you claim your company is worth BEFORE the investor puts money in</p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 block">Instrument Type</label>
                <select value={instrument} onChange={(e) => setInstrument(e.target.value)} className="w-full p-3 border border-[rgba(2,47,66,0.15)] outline-none bg-white font-semibold text-[#022f42] focus:border-[#022f42] appearance-none rounded-sm">
                  <option value="SAFE">Y-Combinator SAFE (Post-Money)</option>
                  <option value="Convertible">Convertible Note</option>
                  <option value="Priced">Priced Equity Round</option>
                </select>
                <div className="mt-2 bg-[#f2f6fa] border-l-2 border-[#1e4a62] p-3 text-xs text-[#1e4a62] flex items-start rounded-sm">
                  <Info className="w-4 h-4 mr-2 shrink-0 text-[#1e4a62] mt-0.5" />
                  {getInstrumentDescription()}
                </div>
              </div>
            </div>
          </div>

          {/* Capital Efficiency Milestones */}
          <div className="bg-white p-6 md:p-8 shadow-sm border border-[rgba(2,47,66,0.1)] rounded-sm">
            <h2 className="text-lg font-bold text-[#022f42] mb-2 flex items-center border-b border-[rgba(2,47,66,0.1)] pb-3">
              <Flag className="w-5 h-5 mr-3 text-[#1e4a62]" /> Capital Efficiency Milestones
            </h2>

            {/* Clarification Panel */}
            <div className="mb-5 bg-[#022f42] p-4 border-l-4 border-[#ffd800] rounded-sm flex items-start gap-3">
              <BookOpen className="w-4 h-4 text-[#ffd800] shrink-0 mt-0.5" />
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#ffd800] mb-1">What Are Capital Efficiency Milestones?</div>
                <p className="text-xs text-[#b0d0e0] leading-relaxed">
                  These are the <strong className="text-white">specific, measurable goals</strong> this raise of <strong className="text-white">RM {raiseAmount.toLocaleString()}</strong> is designed to achieve <em>before</em> your next fundraise.
                  Each milestone must be verifiable by an investor (e.g. &quot;RM 1M ARR&quot;, &quot;10 enterprise contracts signed&quot;, &quot;FDA approval received&quot;).
                  They answer the investor question: <em className="text-[#ffd800]">&quot;If I give you this money, what will you have achieved when you come back to us?&quot;</em>
                </p>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="mb-5 p-4 bg-[#f2f6fa] border border-[#1e4a62]/10 rounded-sm relative overflow-hidden">
              <div className="absolute left-[27px] top-[40px] bottom-[40px] w-0.5 bg-[#1e4a62]/20 z-0"></div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-white border-2 border-[#1e4a62] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 bg-[#1e4a62] rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#1e4a62]">NOW — Pre-Money</div>
                    <div className="text-sm font-black text-[#022f42]">RM {preMoney.toLocaleString()} valuation</div>
                  </div>
                </div>
                <div className="flex items-start shadow-sm bg-white p-3 border border-yellow-200 rounded-sm ml-8">
                  <Zap className="w-4 h-4 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-700">Capital Deployment</div>
                    <div className="text-sm font-black text-[#022f42]">+ RM {raiseAmount.toLocaleString()} from investors</div>
                  </div>
                </div>
                {milestones.filter(m => m.trim()).map((m, i) => (
                  <div key={i} className="flex items-start ml-2">
                    <div className="w-5 h-5 rounded-full bg-[#ffd800] border-2 border-[#022f42] flex items-center justify-center shrink-0 text-[8px] font-black text-[#022f42]">{i+1}</div>
                    <div className="ml-3 text-sm text-[#022f42] font-semibold">{m}</div>
                  </div>
                ))}
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-green-500 shrink-0" />
                  <div className="ml-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-green-700">Series A / Next Round Ready</div>
                    <div className="text-xs text-[#1e4a62]">All milestones above achieved → justify higher valuation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestone inputs */}
            <div className="space-y-3">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#f2f6fa] text-[#022f42] font-bold flex items-center justify-center shrink-0 border border-[rgba(2,47,66,0.1)] text-xs">{i+1}</div>
                  <input
                    type="text"
                    placeholder={milestoneExamples[i] || "e.g. Expand to new market"}
                    value={m}
                    onChange={(e) => handleMilestoneChange(i, e.target.value)}
                    className="flex-1 p-3 text-sm border border-[rgba(2,47,66,0.15)] focus:border-[#022f42] outline-none rounded-sm"
                  />
                  {milestones.length > 1 && (
                    <button onClick={() => removeMilestone(i)} className="text-red-400 hover:text-red-600 text-xs font-bold px-2">✕</button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              {milestones.length < 5 && (
                <button onClick={addMilestone} className="text-xs font-bold text-[#1e4a62] border border-[#1e4a62]/20 px-4 py-2 hover:bg-[#f2f6fa] rounded-sm transition-colors">
                  + Add Milestone
                </button>
              )}
              <button onClick={saveMilestones} className="flex items-center text-xs font-bold text-[#022f42] border border-[#022f42] px-4 py-2 hover:bg-[#022f42] hover:text-white rounded-sm transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Save Milestones
              </button>
            </div>
          </div>
        </div>

        {/* Live Calculation Sidebar */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#022f42] p-8 text-white relative overflow-hidden shadow-2xl rounded-sm">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffd800] rounded-full blur-[80px] opacity-20"></div>

            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#ffd800] mb-6 flex items-center">
              <PieChart className="w-4 h-4 mr-2" /> Live Round Physics
            </h3>

            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-xs text-[#b0d0e0] font-medium mb-1">Post-Money Valuation</p>
                <p className="text-4xl font-black">RM {postMoney.toLocaleString()}</p>
                <p className="text-[10px] text-[#b0d0e0] mt-1">Pre-Money + Raise = Post-Money</p>
              </div>

              <div className="pt-5 border-t border-white/10">
                <p className="text-xs text-[#b0d0e0] font-medium mb-2">Founder Dilution</p>
                <div className="flex items-end justify-between mb-2">
                  <p className={`text-4xl font-black ${dilution > 25 ? "text-red-400" : "text-[#ffd800]"}`}>
                    {dilution.toFixed(1)}%
                  </p>
                  <span className={`text-xs px-2 py-1 tracking-widest uppercase font-bold mb-1 rounded-sm ${dilution > 25 ? "bg-red-500/20 text-red-300" : dilution < 10 ? "bg-yellow-500/20 text-yellow-300" : "bg-green-500/20 text-green-300"}`}>
                    {dilution > 25 ? "High Risk" : dilution < 10 ? "Too Low?" : "Healthy"}
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 flex overflow-hidden rounded-full">
                  <div className="bg-[#ffd800] rounded-l-full" style={{ width: `${dilution}%` }}></div>
                  <div className="bg-white/20" style={{ width: `${100 - dilution}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold tracking-widest uppercase mt-2 text-[#b0d0e0]">
                  <span>New Investor %</span>
                  <span>Founders retain %</span>
                </div>
              </div>

              {mrr > 0 && (
                <div className="pt-5 border-t border-white/10">
                  <p className="text-xs text-[#b0d0e0] font-medium mb-1">ARR Revenue Multiple</p>
                  <p className="text-2xl font-black text-white">{(preMoney / (mrr * 12)).toFixed(1)}x</p>
                  <p className="text-[10px] text-[#b0d0e0] mt-1">Industry benchmark at seed: 10–20x ARR</p>
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateStrategy}
            disabled={isAnalyzing}
            className="w-full p-4 font-bold tracking-widest uppercase text-xs flex items-center justify-center transition-all shadow-md bg-white text-[#022f42] border-2 border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] rounded-sm"
          >
            {isAnalyzing ? (
              <><div className="w-4 h-4 border-2 border-[#022f42] border-t-transparent rounded-full animate-spin mr-3"></div> Analysing Strategy...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2 text-[#ffd800]" /> Generate AI Strategy Analysis</>
            )}
          </button>
          <p className="text-[10px] text-center text-[#1e4a62]">Analysis uses your Settings data (MRR, Burn Rate) + the values entered above</p>

          {/* AI Report Output */}
          <AnimatePresence>
            {aiReport && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-l-4 border-green-500 p-6 shadow-sm rounded-sm">
                <h4 className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-3">
                  <Sparkles className="w-4 h-4 mr-2 text-[#ffd800]" /> AI Assisted — Strategy Analysis
                </h4>
                <p className="text-sm text-[#1e4a62] leading-relaxed">{aiReport}</p>
                <div className="mt-5 space-y-2">
                  <button onClick={saveMilestones} className="w-full py-3 bg-[#022f42] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#ffd800] hover:text-[#022f42] transition-colors flex items-center justify-center rounded-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Save Strategy
                  </button>
                  <Link href="/dashboard/snapshot" className="w-full py-3 border-2 border-[#022f42] text-[#022f42] text-[10px] font-bold uppercase tracking-widest hover:bg-[#f2f6fa] transition-colors flex items-center justify-center rounded-sm">
                    View Investor Snapshot <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Links */}
          <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-4 rounded-sm space-y-2">
            <div className="text-[9px] font-black uppercase tracking-widest text-[#1e4a62] mb-3">Relevant Next Steps</div>
            <Link href="/dashboard/afn-calculator" className="flex items-center text-xs font-bold text-[#022f42] hover:text-[#1e4a62] py-1">
              <ArrowRight className="w-3.5 h-3.5 mr-2 text-[#ffd800]" /> Calculate How Much to Raise (AFN)
            </Link>
            <Link href="/dashboard/settings" className="flex items-center text-xs font-bold text-[#022f42] hover:text-[#1e4a62] py-1">
              <Settings className="w-3.5 h-3.5 mr-2 text-[#ffd800]" /> Update Financial Settings
            </Link>
            <Link href="/dashboard/cap-table" className="flex items-center text-xs font-bold text-[#022f42] hover:text-[#1e4a62] py-1">
              <ArrowRight className="w-3.5 h-3.5 mr-2 text-[#ffd800]" /> Model Dilution in Cap Table Simulator
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
