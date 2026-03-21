"use client";

import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Lightbulb, AlertCircle, BarChart3, CheckCircle2, ChevronRight, Info, ExternalLink } from "lucide-react";
import Link from "next/link";

const questions = [
  {
    id: "target",
    question: "Who exactly is experiencing this pain?",
    helper: "Investors need to calculate your Total Addressable Market (TAM). The more specific you are (e.g., 'B2B SaaS Founders' vs 'Businesses'), the more accurate your TAM calculation will be in later modules.",
    type: "text",
    placeholder: "e.g., Mid-market logistics managers...",
  },
  {
    id: "frequency",
    question: "How often does this problem occur?",
    helper: "Frequency is a key indicator of pain. Daily problems are painkillers; yearly problems are vitamins.",
    type: "choice",
    options: ["Multiple times a day", "Daily or Weekly", "Monthly or rarely"],
  },
  {
    id: "workaround",
    question: "How are they solving it today (the workaround)?",
    helper: "If they have a workaround, your solution must be 10x better to force a switch.",
    type: "choice",
    options: ["Using a direct competitor", "Manual in-house workaround (Excel/Paper)", "They do nothing (unsolved)"],
  },
  {
    id: "impact",
    question: "What is the quantifiable impact of this problem?",
    helper: "Time lost, money wasted, or revenue missed. Investors only care about quantifiable pain.",
    type: "text",
    placeholder: "e.g., Losing $5k per month in wasted inventory...",
  }
];

export default function PainExplorerPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  const currentQ = questions[step];

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else setCompleted(true);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  // Simulated AI Assessment Calculation
  const getSeverityScore = () => {
    let score = 50; // Base score
    if (answers.frequency === "Multiple times a day") score += 25;
    if (answers.frequency === "Daily or Weekly") score += 15;
    if (answers.workaround === "Manual in-house workaround (Excel/Paper)") score += 15;
    if (answers.workaround === "They do nothing (unsolved)") score -= 10; // Harder to educate market
    if (answers.impact?.length > 10) score += 10;
    return Math.min(score, 100);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.1.1"
        title="Pain & Need Explorer"
        description="Understand if your solution tackles a real, painful problem that customers are willing to pay to fix. Your answers shape the 'problem' section of your investor pitch."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Interactive Area */}
        <div className="flex-1">
          {!completed ? (
            <div className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#022f42] rounded-sm relative overflow-hidden min-h-[400px]">
              
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-[#f2f6fa]">
                <motion.div 
                  className="h-full bg-[#ffd800]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / questions.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-[#022f42]/40 tracking-widest uppercase">
                  Question {step + 1} of {questions.length}
                </span>
                <span className="bg-[#f2f6fa] text-[#022f42] text-xs px-2 py-1 rounded-sm font-bold flex items-center gap-1">
                  <Lightbulb className="w-3 h-3 text-[#ffd800]" /> Diagnostics
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-2xl md:text-3xl font-black text-[#022f42] mb-3 leading-tight">
                    {currentQ.question}
                  </h2>
                  <p className="text-[#1e4a62] mb-8 text-sm md:text-base flex items-start gap-2 bg-[#f2f6fa] p-3 border-l-2 border-[#1e4a62]/20">
                    <Info className="w-4 h-4 mt-0.5 shrink-0 text-[#1b4f68]" />
                    {currentQ.helper}
                  </p>

                  <div className="space-y-3">
                    {currentQ.type === "text" ? (
                      <textarea
                        className="w-full p-4 border-2 border-[#1e4a62]/20 rounded-sm focus:border-[#ffd800] focus:ring-0 outline-none transition-colors min-h-[120px] text-[#022f42]"
                        placeholder={currentQ.placeholder}
                        value={answers[currentQ.id] || ""}
                        onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                      />
                    ) : (
                      currentQ.options?.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setAnswers({ ...answers, [currentQ.id]: opt })}
                          className={`w-full text-left p-4 min-h-[4rem] border-2 rounded-sm transition-all duration-200 font-medium whitespace-normal break-words ${
                            answers[currentQ.id] === opt 
                              ? "border-[#ffd800] bg-[#ffd800]/5 text-[#022f42] shadow-sm transform scale-[1.01]" 
                              : "border-[#1e4a62]/10 text-[#1e4a62] hover:border-[#1e4a62]/30 hover:bg-[#f2f6fa]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            {opt}
                            {answers[currentQ.id] === opt && <CheckCircle2 className="w-5 h-5 text-[#ffd800]" />}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-white via-white to-transparent flex items-center justify-between mt-10">
                <button
                  onClick={handlePrev}
                  disabled={step === 0}
                  className={`flex items-center gap-2 font-bold text-sm tracking-widest uppercase transition-colors ${step === 0 ? "text-gray-300 cursor-not-allowed" : "text-[#1e4a62] hover:text-[#022f42]"}`}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQ.id]}
                  className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm tracking-widest uppercase transition-all shadow-sm ${
                    !answers[currentQ.id] 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-[#022f42] text-white hover:bg-[#1b4f68] hover:shadow-md"
                  }`}
                >
                  {step === questions.length - 1 ? "Analyze" : "Next"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* Results State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#ffd800] rounded-sm"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
                <div>
                  <h2 className="text-3xl font-black text-[#022f42] mb-2">Pain Analysis Complete</h2>
                  <p className="text-[#1e4a62]">Your problem statement has been simulated against venture benchmarks.</p>
                </div>
                <div className="bg-[#f2f6fa] p-4 rounded-sm border border-[#1e4a62]/10 min-w-[150px] text-center">
                  <div className="text-[10px] uppercase font-black tracking-widest text-[#1e4a62] mb-1">Severity Score</div>
                  <div className="text-4xl font-black text-[#022f42]">{getSeverityScore()}<span className="text-xl text-gray-400">/100</span></div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#ffd800]/10 border border-[#ffd800]/30 p-5 rounded-sm relative">
                  <div className="absolute -top-3 left-4 bg-[#ffd800] text-[#022f42] text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                    AI Problem Statement
                  </div>
                  <p className="text-[#022f42] font-medium leading-relaxed mt-2">
                    &quot;We are solving a high-frequency problem for <strong className="bg-[#ffd800]/30 px-1">{answers.target}</strong> who currently rely on <strong className="bg-[#ffd800]/30 px-1">{answers.workaround.toLowerCase()}</strong>. Left unsolved, this results in <strong className="bg-[#ffd800]/30 px-1">{answers.impact}</strong>.&quot;
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-green-100 bg-green-50/50 p-5 rounded-sm">
                    <h4 className="flex items-center gap-2 text-green-800 font-bold mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" /> VC Positive Signals
                    </h4>
                    <p className="text-sm text-green-700">
                      {answers.frequency.includes("Daily") ? "The daily frequency makes this a clear 'Painkiller' rather than a 'Vitamin'." : "The quantifiable financial impact is clear."}
                    </p>
                  </div>
                  <div className="border border-amber-100 bg-amber-50/50 p-5 rounded-sm">
                    <h4 className="flex items-center gap-2 text-amber-800 font-bold mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" /> Potential Red Flags
                    </h4>
                    <p className="text-sm text-amber-700">
                      {answers.workaround === "They do nothing (unsolved)" 
                        ? "Because they currently 'do nothing', you will face high customer education costs to convince them this is a problem worth paying for." 
                        : "Ensure your solution is quantifiably 10x better than their current workaround, or switching costs will kill adoption."}
                    </p>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button onClick={() => {setStep(0); setCompleted(false); setAnswers({});}} className="text-sm font-bold text-[#1e4a62] uppercase tracking-widest border border-[#1e4a62]/20 px-6 py-3 hover:bg-[#f2f6fa] transition-colors rounded-sm">
                    Retake Assessment
                  </button>
                  <Link href="/dashboard/audit/2-customer" className="bg-[#022f42] text-white px-6 py-3 font-bold text-sm uppercase tracking-widest w-full text-center hover:bg-[#1b4f68] transition-colors shadow-md rounded-sm">
                    Continue to 1.1.2 Personas
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Actionable Sidebar (Content Backbone) */}
        <div className="lg:w-[350px] space-y-4">
          <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-md">
            <h3 className="flex items-center gap-2 font-bold mb-4 text-[#ffd800]">
              <BarChart3 className="w-5 h-5" /> VC Perspective
            </h3>
            <p className="text-sm text-[#b0d0e0] leading-relaxed mb-4">
              Investors evaluate the problem before anything else. If the pain isn&apos;t acute, they won&apos;t care about your solution.
            </p>
            <div className="space-y-3">
              <div className="text-xs bg-white/5 p-3 rounded-sm border border-white/10">
                <span className="font-bold text-white block mb-1">Painkiller vs. Vitamin</span>
                <span className="text-white/60">If customers already have a workaround, your product must be 10x better, or they won&apos;t adopt it.</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard/academy/the-problem-slide-that-wins" className="group block bg-white border border-[#1e4a62]/10 p-5 rounded-sm hover:border-[#ffd800] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ffd800] bg-[#ffd800]/10 px-2 py-0.5 rounded-sm">Academy Guide</span>
              <ExternalLink className="w-3 h-3 text-[#1e4a62]/40 group-hover:text-[#ffd800]" />
            </div>
            <h4 className="font-bold text-[#022f42] group-hover:text-[#1b4f68] mb-1">The Problem Slide That Wins</h4>
            <p className="text-xs text-[#1e4a62] flex items-center gap-1">Read the methodology <ChevronRight className="w-3 h-3" /></p>
          </Link>
        </div>
      </div>
    </div>
  );
}
