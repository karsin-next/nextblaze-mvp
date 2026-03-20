"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, MessageSquare, Briefcase, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProblemDiagnosticPage() {

  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`audit_1-problem_data_${user?.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.step) setStep(parsed.step);
        } catch(e) {}
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(answers).length > 0) {
      localStorage.setItem(`audit_1-problem_data_${user?.id}`, JSON.stringify({ answers, step }));
    }
  }, [answers, step]);

  const handleSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
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
    if (typeof window !== 'undefined') localStorage.setItem(`audit_1-problem_${user?.id}`, 'completed');
    // Simulating API save call
    setTimeout(() => {
      // In a real app we hit /api/audit/submodule
      router.push("/dashboard");
    }, 1500);
  };

  // The questions for 1.1.1 with B2B vs DeepTech branching
  const isDeepTech = answers["q_industry"] === "Deep Tech";
  
  const questions = [
    {
      id: "q_industry",
      text: "First, what is your primary business model or industry focus?",
      options: [
        { value: "B2B SaaS", label: "B2B SaaS", icon: Briefcase },
        { value: "Deep Tech", label: "Deep Tech", icon: Zap },
        { value: "Consumer Marketplaces", label: "Consumer / Marketplaces", icon: Users },
      ]
    },
    {
      id: "q_problem_urgency",
      text: isDeepTech ? "Does your technology solve a fundamentally impossible problem today, or is it an incremental improvement?" : "How urgent is the problem you're solving for your target customer?",
      options: [
        { value: "critical", label: isDeepTech ? "Impossible today based on current physics/code limitations." : "Top 3 priorities. They are actively seeking solutions.", icon: Target },
        { value: "important", label: isDeepTech ? "Significant 10x improvement over current methods." : "Important, but they haven't allocated budget yet.", icon: AlertTriangle },
        { value: "nice_to_have", label: isDeepTech ? "Incremental efficiency gain (faster/cheaper)." : "Nice to have. We have to educate them on the need.", icon: MessageSquare },
      ]
    },
    {
      id: "q_current_alternative",
      text: "What are your prospect's current alternatives to using your solution?",
      options: [
        { value: "manual", label: "Manual workarounds (spreadsheets, internal scripts).", icon: FileText },
        { value: "competitors", label: "Direct competitors with similar features.", icon: ShieldCheck },
        { value: "nothing", label: "They just live with the pain.", icon: AlertCircle },
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)] flex flex-col justify-center">
      
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
         <div>
           <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
             Module 1.1.1
           </div>
           <h1 className="text-xl font-bold text-[#022f42]">The Problem Diagnostic</h1>
         </div>
         <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42]">
           Back to Hub
         </Link>
      </div>

      {/* Question Area */}
      <div className="flex-1">
        {isSubmitting ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#f2f6fa] border-t-[#022f42] rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-bold text-[#022f42] mb-2">Analyzing Responses...</h2>
            <p className="text-sm text-[#1e4a62]">Saving your baseline to the Data Engine.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step > 0 && (
                <button 
                  onClick={() => setStep(s => s - 1)}
                  className="mb-6 text-[10px] font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42] flex items-center transition-colors border border-transparent hover:border-[rgba(2,47,66,0.1)] px-3 py-1.5 rounded-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Previous Question
                </button>
              )}
              <h2 className="text-2xl lg:text-3xl font-bold text-[#022f42] mb-8 leading-tight">
                {questions[step].text}
              </h2>
              
              <div className="space-y-4">
                {questions[step].options.map((opt) => {
                  const isSelected = answers[questions[step].id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(questions[step].id, opt.value)}
                      className={`w-full text-left p-6 border-2 transition-all flex items-center group ${
                        isSelected 
                          ? "border-[#022f42] bg-[#022f42] text-white" 
                          : "border-[rgba(2,47,66,0.15)] bg-white text-[#022f42] hover:border-[#ffd800] hover:bg-[#f2f6fa]"
                      }`}
                    >
                      {opt.icon && <opt.icon className={`w-6 h-6 mr-4 ${isSelected ? "text-[#ffd800]" : "text-[#1e4a62] group-hover:text-[#022f42]"}`} />}
                      <span className="text-lg font-medium select-none flex-1">{opt.label}</span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-[#ffd800] ml-4" />}
                    </button>
                  );
                })}
              </div>

              {step === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 p-4 bg-[#f2f6fa] border-l-4 border-[#ffd800] rounded-sm flex items-start">
                   <AlertCircle className="w-5 h-5 text-[#ffd800] mr-3 mt-0.5 shrink-0" />
                   <div>
                     <h4 className="text-xs font-bold uppercase tracking-widest text-[#022f42] mb-1">Why only these 3 models?</h4>
                     <p className="text-xs text-[#1e4a62] leading-relaxed">
                       FundabilityOS mathematically optimizes its downstream unit economics and valuation engines based on standard venture physics: <strong>recurring revenue (B2B)</strong>, <strong>transactional networks (Consumer)</strong>, or <strong>IP-heavy moats (Deep Tech)</strong>. While your specific sector may vary, your core mechanical logic maps to one of these three fundational templates.
                     </p>
                   </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Footer Progress */}
      {!isSubmitting && (
        <div className="mt-12 pt-6 border-t border-[rgba(2,47,66,0.1)] flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-widest text-[#1e4a62]">
            Question {step + 1} of {questions.length}
          </div>
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? "w-8 bg-[#022f42]" : "w-4 bg-[rgba(2,47,66,0.1)]"}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Ensure icons used in options are mapped correctly
import { Target, AlertTriangle, FileText, ShieldCheck, AlertCircle, Users } from "lucide-react";
