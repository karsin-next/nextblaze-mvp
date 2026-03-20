"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, AlertTriangle, Battery, BatteryCharging, Zap, Target, Sparkles, Info, TrendingUp, Users, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const questions = [
  {
    id: "q_40_rule",
    text: "The Sean Ellis Test: How would your active users feel if they could no longer use your product today?",
    tip: "The '40% Rule' is the gold standard for PMF. If 40%+ of surveyed users say 'Very Disappointed', you have likely found PMF. Companies like Slack and Superhuman used this exact test.",
    learn: "Most pre-PMF startups see this number under 20%. That's okay — the goal of this stage is to understand the gap, not to be perfect.",
    options: [
      { value: "very_disappointed", label: "Very disappointed (>40% — They rely on it heavily)", points: 5, icon: "🚀", color: "green" },
      { value: "somewhat", label: "Somewhat disappointed (20-40% — It's useful but replaceable)", points: 2, icon: "⚠️", color: "yellow" },
      { value: "not_disappointed", label: "Not disappointed (<20% — They barely use it)", points: 0, icon: "🔴", color: "red" },
    ]
  },
  {
    id: "q_pain_killer",
    text: "Classify your product: Is it a Vitamin, Painkiller, or something else?",
    tip: "VCs almost always prefer 'Painkillers'. Vitamins are nice-to-haves that users abandon when budgets are cut. Painkillers create urgency and tolerate premium pricing.",
    learn: "Examples: Slack (Painkiller — kills email chaos), Calm (Vitamin — nice for mental health), a novelty fidget app (Candy). Painkillers are 3-5x more fundable at pre-Series A.",
    options: [
      { value: "painkiller", label: "Painkiller: Customers lose sleep, money, or time without us.", points: 5, icon: "💊", color: "green" },
      { value: "vitamin", label: "Vitamin: We make things better, faster, or healthier.", points: 2, icon: "🌿", color: "yellow" },
      { value: "candy", label: "Candy: It's just fun, creative, or trendy.", points: 0, icon: "🍬", color: "red" },
    ]
  },
  {
    id: "q_retention",
    text: "What does your early retention curve look like at 90 days?",
    tip: "The 'Smiling Curve' is the rarest and most valuable retention shape. It shows users who initially churned came back, indicating they truly missed the product.",
    learn: "Industry benchmarks: Consumer apps aim for >25% D30 retention. B2B SaaS aims for >85% annual retention. A 'sinking ship' curve (trending to 0%) almost always precedes startup failure within 18 months.",
    options: [
      { value: "smiling", label: "Smiling Curve: Dips, then re-engages upward — a power user signal.", points: 5, icon: "😊", color: "green" },
      { value: "flattening", label: "Flattening: Drops initially, stabilizes at a healthy floor (~20-40%).", points: 3, icon: "➡️", color: "yellow" },
      { value: "zero", label: "Sinking Ship: Trends toward absolute zero over 90 days.", points: 0, icon: "📉", color: "red" },
    ]
  },
  {
    id: "q_nps",
    text: "What is your Net Promoter Score (NPS) or Referral Rate?",
    tip: "NPS = (% Promoters) - (% Detractors). A score of 50+ is excellent. A score above 70 is world-class (Apple is ~72). High NPS means your CAC will drop over time as word-of-mouth compounds.",
    learn: "Organic referrals reduce CAC by 30-60%. If users aren't voluntarily recommending you, your PMF is likely weaker than your engagement metrics suggest.",
    options: [
      { value: "high_nps", label: "High NPS (50+): Users actively refer and champion us.", points: 5, icon: "📣", color: "green" },
      { value: "mid_nps", label: "Average NPS (20-50): Some advocates but limited organic growth.", points: 2, icon: "🟡", color: "yellow" },
      { value: "low_nps", label: "Low/Negative NPS (<20): More detractors than promoters.", points: 0, icon: "🔕", color: "red" },
    ]
  },
  {
    id: "q_expansion",
    text: "Is your revenue expanding organically within your existing customer base?",
    tip: "Net Revenue Retention (NRR) > 100% is a superpower for SaaS businesses — it means your existing customers are spending MORE over time even without new customer acquisition.",
    learn: "Best-in-class SaaS companies (Snowflake, Datadog) maintain NRR of 130-160%. For non-SaaS, look at repeat purchase rate and Average Order Value growth.",
    options: [
      { value: "expanding", label: "Yes — users upgrade, buy more seats, or increase consumption.", points: 5, icon: "📈", color: "green" },
      { value: "stable", label: "Stable — revenue is flat, neither growing nor shrinking.", points: 2, icon: "◼️", color: "yellow" },
      { value: "contracting", label: "Contracting — losing revenue faster than gaining new customers.", points: 0, icon: "📉", color: "red" },
    ]
  }
];

export default function PmfProbePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`audit_6-pmf_data_${user?.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.answers) setAnswers(parsed.answers);
          if (typeof parsed.step === 'number') setStep(parsed.step);
        } catch(e) {}
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(answers).length > 0) {
      localStorage.setItem(`audit_6-pmf_data_${user?.id}`, JSON.stringify({ answers, step }));
    }
  }, [answers, step, user?.id]);

  const handleSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setShowTip(false);
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(s => s + 1);
      } else {
        submitModule();
      }
    }, 400);
  };

  const submitModule = async () => {
    setIsSubmitting(true);
    if (typeof window !== 'undefined') localStorage.setItem(`audit_6-pmf_${user?.id}`, 'completed');
    setTimeout(() => { router.push("/dashboard"); }, 1500);
  };

  const totalPoints = Object.entries(answers).reduce((sum, [qId, val]) => {
    const q = questions.find(q => q.id === qId);
    const opt = q?.options.find(o => o.value === val);
    return sum + (opt?.points || 0);
  }, 0);

  const maxPoints = questions.length * 5;
  const pmfSignalStrength = Math.round((totalPoints / maxPoints) * 100);

  const pmfLabel = pmfSignalStrength >= 70 ? "Strong PMF Signal" : pmfSignalStrength >= 40 ? "Emerging PMF" : "Pre-PMF";
  const pmfColor = pmfSignalStrength >= 70 ? "text-green-600 bg-green-50 border-green-200" : pmfSignalStrength >= 40 ? "text-yellow-700 bg-yellow-50 border-yellow-200" : "text-red-600 bg-red-50 border-red-200";

  const currentQ = questions[step];

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
            Module 1.1.6
          </div>
          <h1 className="text-2xl font-bold text-[#022f42]">Traction & PMF Validator</h1>
          <p className="text-[#1e4a62] text-sm mt-1 max-w-2xl leading-relaxed">
            Product-Market Fit (PMF) is the single most important milestone before raising a VC round. This module uses the Sean Ellis Test, retention curves, and NPS analysis to determine your PMF signal strength.
          </p>
        </div>
        <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42] shrink-0 ml-4">
          Back to Hub
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#1e4a62] mb-2">
          <span>Signal {step + 1} of {questions.length}</span>
          {Object.keys(answers).length > 0 && <span className={`px-2 py-0.5 border rounded-sm text-[9px] ${pmfColor}`}>{pmfLabel}: {pmfSignalStrength}%</span>}
        </div>
        <div className="h-1.5 bg-[#f2f6fa] rounded-full overflow-hidden">
          <div className="h-full bg-[#022f42] transition-all duration-500 rounded-full" style={{ width: `${((step) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Question Panel */}
        <div className="lg:col-span-2">
          {isSubmitting ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-white border border-[rgba(2,47,66,0.1)] p-12 rounded-sm">
              <Zap className="w-14 h-14 text-[#ffd800] animate-pulse mb-5" />
              <h2 className="text-xl font-bold text-[#022f42] mb-2">Calculating PMF Signal...</h2>
              <p className="text-sm text-[#1e4a62] text-center max-w-sm">Analyzing your traction signals against investor-grade PMF benchmarks.</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-[rgba(2,47,66,0.1)] shadow-[0_10px_30px_-10px_rgba(2,47,66,0.1)] p-8 rounded-sm"
              >
                <h2 className="text-xl font-bold text-[#022f42] mb-6 leading-tight">
                  {currentQ.text}
                </h2>

                <div className="space-y-3 mb-6">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(currentQ.id, opt.value)}
                        className={`w-full text-left p-5 border-2 rounded-sm transition-all flex items-center gap-4 ${
                          isSelected
                            ? "border-[#ffd800] bg-[#fffcf0] text-[#022f42] shadow-sm"
                            : "border-[rgba(2,47,66,0.1)] bg-white text-[#1e4a62] hover:border-[#022f42] hover:bg-[#f2f6fa]"
                        }`}
                      >
                        <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                        <span className="text-sm font-bold">{opt.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#ffd800] ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-4 border-t border-[#1e4a62]/10">
                  <button
                    onClick={() => setStep(s => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#1e4a62] flex items-center disabled:opacity-30"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous
                  </button>
                  <button
                    onClick={() => setShowTip(!showTip)}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#1e4a62] flex items-center hover:text-[#022f42]"
                  >
                    <Info className="w-3.5 h-3.5 mr-1 text-[#ffd800]" /> {showTip ? "Hide Insight" : "Show Insight"}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Right Sidebar: Tips & Educational Content */}
        <div className="space-y-4">

          {/* Tip Panel */}
          <AnimatePresence>
            {showTip && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-[#022f42] p-5 rounded-sm border-l-4 border-[#ffd800] shadow-lg">
                <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-[#ffd800] mb-3">
                  <Sparkles className="w-3 h-3 mr-1.5" /> AI Insight
                </div>
                <p className="text-xs text-[#b0d0e0] leading-relaxed">{currentQ.tip}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Educational Content */}
          <div className="bg-white border border-[#1e4a62]/10 p-5 rounded-sm shadow-sm">
            <div className="flex items-center text-[9px] font-black uppercase tracking-widest text-[#1e4a62] mb-3">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#022f42]" /> Why This Matters
            </div>
            <p className="text-xs text-[#1e4a62] leading-relaxed">{currentQ.learn}</p>
          </div>

          {/* PMF Score Card */}
          {Object.keys(answers).length > 0 && (
            <div className="bg-white border border-[#1e4a62]/10 p-5 rounded-sm shadow-sm">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#1e4a62] mb-3 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Running PMF Score
              </div>
              <div className="text-4xl font-black text-[#022f42]">{pmfSignalStrength}%</div>
              <div className={`text-[9px] font-bold uppercase tracking-widest mt-2 px-2 py-1 border rounded-sm inline-block ${pmfColor}`}>{pmfLabel}</div>
              <div className="mt-3 space-y-1.5">
                {questions.slice(0, step + 1).map(q => {
                  const ans = answers[q.id];
                  const opt = q.options.find(o => o.value === ans);
                  return ans ? (
                    <div key={q.id} className="flex items-center gap-2 text-[10px]">
                      {opt && opt.points >= 4 ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" /> : opt && opt.points >= 2 ? <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shrink-0" /> : <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                      <span className="text-[#1e4a62] truncate">{opt?.label.substring(0, 35)}...</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Key Benchmarks */}
          <div className="bg-[#f2f6fa] border border-[#1e4a62]/10 p-4 rounded-sm">
            <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-3">Investor Benchmarks</div>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between"><span className="text-[#1e4a62]">Sean Ellis Test (PMF)</span><span className="font-bold text-[#022f42]">≥40% &quot;Very Disappointed&quot;</span></div>
              <div className="flex justify-between"><span className="text-[#1e4a62]">D30 Retention (Consumer)</span><span className="font-bold text-[#022f42]">&gt;25%</span></div>
              <div className="flex justify-between"><span className="text-[#1e4a62]">Annual Retention (B2B)</span><span className="font-bold text-[#022f42]">&gt;85%</span></div>
              <div className="flex justify-between"><span className="text-[#1e4a62]">NPS (Good)</span><span className="font-bold text-[#022f42]">&gt;50</span></div>
              <div className="flex justify-between"><span className="text-[#1e4a62]">NRR (Best-in-class SaaS)</span><span className="font-bold text-[#022f42]">&gt;120%</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
