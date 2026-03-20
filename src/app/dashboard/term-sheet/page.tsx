"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, BookOpen, ShieldAlert, FileText, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import PrivacyConsentGate from "@/components/PrivacyConsentGate";

type Grade = "red" | "yellow" | "green" | null;

interface AnalysisResult {
  id: string;
  originalText: string;
  grade: Grade;
  category: string;
  explanation: string;
  recommendation: string;
}

const CLAUSE_LIBRARY = [
  {
    title: "Liquidation Preference",
    clean: "1x Non-Participating",
    toxic: "2x (or higher) Participating",
    explanation: "This dictates who gets paid first if the company is sold. '1x Non-Participating' means the investor gets their money back OR converts to common stock (whichever is higher). 'Participating' means they get their money back AND then take their % of whatever is left (double dipping)."
  },
  {
    title: "Anti-Dilution",
    clean: "Broad-Based Weighted Average",
    toxic: "Full Ratchet",
    explanation: "Protects investors if you raise money later at a lower valuation (a 'down round'). 'Full Ratchet' is incredibly toxic: if you issue even one share at a lower price, ALL of their existing shares are repriced down to that new price, causing massive founder dilution."
  },
  {
    title: "Board Composition",
    clean: "2 Founders, 1 VC (Seed/A)",
    toxic: "Loss of Board Control",
    explanation: "The Board fires and hires the CEO. At Seed/Series A, founders should retain structural control (e.g. 2 out of 3 seats). Beware of clauses giving investors disproportionate veto rights over operational decisions."
  },
  {
    title: "Drag-Along Rights",
    clean: "Triggered by Majority of Preferred AND Common",
    toxic: "Triggered by Preferred Only",
    explanation: "Forces minority shareholders to agree to a sale of the company. A clean clause requires a majority of both founders (common) and investors (preferred) to trigger. A toxic one allows investors to force you to sell your own company."
  }
];

export default function TermSheetPage() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [activeLibraryTab, setActiveLibraryTab] = useState<string | null>(null);

  const simulateAnalysis = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const text = inputText.toLowerCase();
      let grade: Grade = "yellow";
      let category = "General Clause";
      let explanation = "This clause requires manual legal review. We did not detect any of the standard venture traps, but you should verify definitions.";
      let recommendation = "Ask your counsel to verify this doesn't include hidden veto rights.";

      if (text.includes("liquidation preference")) {
        category = "Liquidation Preference";
        if (text.includes("participating") && !text.includes("non-participating")) {
          grade = "red";
          explanation = "We detected a 'Participating' liquidation preference. This is heavily investor-favorable and allows them to 'double dip' on an exit.";
          recommendation = "Push back aggressively for a 1x Non-Participating preference, which is the venture standard.";
        } else if (text.includes("2x") || text.includes("3x")) {
          grade = "red";
          explanation = "We detected a multiple > 1x. This means investors get guaranteed multiples of their money back before you see a dime.";
          recommendation = "Reject multiples entirely. Standard is 1x.";
        } else if (text.includes("non-participating") && text.includes("1x")) {
          grade = "green";
          explanation = "Clean 1x Non-Participating preference detected. This is founder-friendly and venture standard.";
          recommendation = "Acceptable. No changes needed.";
        }
      } else if (text.includes("anti-dilution") || text.includes("ratchet")) {
        category = "Anti-Dilution";
        if (text.includes("full ratchet")) {
          grade = "red";
          explanation = "EXTREME DANGER: 'Full Ratchet' detected. If you do a down-round, investor shares are instantly repriced to the lowest price, wiping out founders.";
          recommendation = "Absolute dealbreaker. Demand 'Broad-Based Weighted Average' anti-dilution.";
        } else if (text.includes("weighted average")) {
          grade = "green";
          explanation = "Broad-based weighted average anti-dilution is standard market practice.";
          recommendation = "Acceptable. Standard downside protection.";
        }
      } else if (text.includes("board") || text.includes("directors")) {
        category = "Board of Directors";
        grade = "yellow";
        explanation = "Board composition clause detected. The AI cannot read math, but you must ensure you retain a majority of seats (e.g. 2 of 3) at this stage.";
        recommendation = "Ensure the voting math doesn't give investors a functional veto over standard operations.";
      }

      setResults(prev => [{
        id: Date.now().toString(),
        originalText: inputText,
        grade,
        category,
        explanation,
        recommendation
      }, ...prev]);
      
      setInputText("");
      setIsAnalyzing(false);
    }, 1500);
  };

  const clearResults = () => {
    setResults([]);
  };

  const getGradeUI = (grade: Grade) => {
    switch(grade) {
      case "red": return { icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Predatory" };
      case "yellow": return { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Negotiate" };
      case "green": return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-200", label: "Clean" };
      default: return { icon: FileText, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200", label: "Unknown" };
    }
  };

  const redFlags = results.filter(r => r.grade === "red");
  const yellowFlags = results.filter(r => r.grade === "yellow");

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
         <div className="max-w-2xl">
           <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
             Phase 4: Syndicate
           </div>
           <h1 className="text-3xl font-bold text-[#022f42] mb-3">Term Sheet Analyzer</h1>
           <p className="text-[#1e4a62] text-sm leading-relaxed">
             An active, educational shield against predatory term sheets. Paste individual clauses below to instantly detect toxic structures like Full Ratchets or Participating Preferences before you sign.
           </p>
         </div>
         <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42] shrink-0 ml-4 hidden md:block">
           Back to Hub
         </Link>
      </div>

      <PrivacyConsentGate
        config={{
          consentKey: "term_sheet",
          sensitivity: "sensitive",
          title: "Legal Document Confidentiality",
          aiExplanation: "Term sheets contain strictly confidential investor offers. Our grading engine processes the text entirely in your browser's local memory. The text of your term sheet NEVER touches our database.",
          dataUsage: "Natural language processing to scan for venture-standard vs predatory legal clauses and generate a negotiation agenda.",
          storageNote: "Memory ONLY (ephemeral). Erased upon closing the tab.",
          skippable: false,
        }}
        onConsent={() => {}}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Analyzer */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Input Form */}
            <div className="bg-white border border-[rgba(2,47,66,0.1)] shadow-sm">
               <div className="p-4 border-b border-[rgba(2,47,66,0.1)] bg-[#022f42] flex justify-between items-center">
                 <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                   <FileSearch className="w-4 h-4 text-[#ffd800]" /> 1. Paste Clause
                 </h2>
                 <span className="text-[10px] text-[#b0d0e0] font-black tracking-widest uppercase bg-[#1e4a62] px-2 py-0.5 rounded-sm flex items-center gap-1">
                   <Sparkles className="w-3 h-3 text-[#ffd800]" /> AI Assisted
                 </span>
               </div>
               <div className="p-6">
                 <textarea
                   value={inputText}
                   onChange={e => setInputText(e.target.value)}
                   placeholder="Paste a paragraph from your term sheet here (e.g. 'In the event of any liquidation or winding up of the Company, the holders of Series A Preferred Stock shall be entitled to receive...')"
                   className="w-full h-40 p-4 border border-[rgba(2,47,66,0.2)] rounded-sm text-sm text-[#022f42] font-mono focus:border-[#022f42] outline-none resize-none leading-relaxed"
                 />
                 <div className="mt-4 flex justify-between items-center">
                   <p className="text-[10px] text-[#1e4a62] uppercase font-bold tracking-widest">Test with &quot;1x non-participating&quot; or &quot;full ratchet&quot;</p>
                   <button
                     onClick={simulateAnalysis}
                     disabled={isAnalyzing || !inputText.trim()}
                     className="px-6 py-3 bg-[#022f42] text-white text-[11px] font-black uppercase tracking-widest rounded-sm hover:bg-[#ffd800] hover:text-[#022f42] transition-colors disabled:opacity-50 flex items-center gap-2"
                   >
                     {isAnalyzing ? (
                        <><div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Scanning...</>
                     ) : (
                        <><Sparkles className="w-4 h-4" /> Analyze Clause</>
                     )}
                   </button>
                 </div>
               </div>
            </div>

            {/* Results Stream */}
            <AnimatePresence>
              {results.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-[rgba(2,47,66,0.1)] shadow-sm"
                >
                  <div className="p-4 border-b border-[rgba(2,47,66,0.1)] bg-[#f2f6fa] flex justify-between items-center">
                    <h2 className="text-sm font-bold text-[#022f42] uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#1e4a62]" /> Analysis Stream
                    </h2>
                    <button onClick={clearResults} className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700 underline">Clear All</button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {results.map((r) => {
                      const ui = getGradeUI(r.grade);
                      return (
                        <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`border-l-4 ${ui.border} bg-white shadow-sm p-4 rounded-sm border-t border-r border-b`}>
                           <div className="flex justify-between items-start mb-3">
                             <div className="flex items-center gap-2">
                               <ui.icon className={`w-5 h-5 ${ui.color}`} />
                               <span className={`text-xs font-black uppercase tracking-widest ${ui.color} bg-white px-2 py-0.5 rounded-sm border ${ui.border}`}>{ui.label}</span>
                               <span className="text-sm font-bold text-[#022f42] ml-2">{r.category}</span>
                             </div>
                           </div>
                           
                           <div className="bg-[#f2f6fa] p-3 text-[11px] font-mono text-[#1e4a62] border border-[#1e4a62]/10 rounded-sm mb-4 italic">
                             &quot;{r.originalText.substring(0, 150)}{r.originalText.length > 150 ? '...' : ''}&quot;
                           </div>

                           <div className="space-y-3">
                             <div>
                               <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-1">AI Explanation</div>
                               <p className="text-sm text-[#1e4a62] leading-relaxed">{r.explanation}</p>
                             </div>
                             <div>
                               <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-1">Counter-Strategy</div>
                               <div className="flex items-start gap-2 bg-[#ffd800]/10 border border-[#ffd800]/30 p-3 rounded-sm">
                                 <ArrowRight className="w-4 h-4 text-[#022f42] shrink-0 mt-0.5" />
                                 <p className="text-sm text-[#022f42] font-semibold">{r.recommendation}</p>
                               </div>
                             </div>
                           </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Negotiation Agenda */}
            {results.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#022f42] border border-[#1b4f68] rounded-sm p-6 text-white shadow-lg">
                 <h2 className="text-sm font-black text-[#ffd800] uppercase tracking-widest flex items-center gap-2 mb-4">
                   <AlertCircle className="w-5 h-5" /> Prioritized Negotiation Agenda
                 </h2>
                 {redFlags.length === 0 && yellowFlags.length === 0 ? (
                   <div className="flex items-center gap-3 text-green-400 bg-green-400/10 p-4 border border-green-400/20 rounded-sm">
                     <CheckCircle2 className="w-5 h-5 shrink-0" />
                     <p className="text-sm font-bold">No structural red flags detected in the analyzed clauses. Proceed with standard legal review.</p>
                   </div>
                 ) : (
                   <ul className="space-y-3">
                     {redFlags.map((r, i) => (
                       <li key={`red-${i}`} className="flex items-start gap-3 bg-red-500/10 p-3 border border-red-500/20 rounded-sm">
                         <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                         <div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-red-400">Dealbreaker</div>
                           <p className="text-sm font-semibold">{r.recommendation}</p>
                         </div>
                       </li>
                     ))}
                     {yellowFlags.map((r, i) => (
                       <li key={`yellow-${i}`} className="flex items-start gap-3 bg-amber-500/10 p-3 border border-amber-500/20 rounded-sm mt-3">
                         <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                         <div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-amber-400">Pushback Required</div>
                           <p className="text-sm font-semibold">{r.recommendation}</p>
                         </div>
                       </li>
                     ))}
                   </ul>
                 )}
              </motion.div>
            )}

          </div>

          {/* Right Column: Library */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-bold text-[#022f42] uppercase tracking-widest mb-4 flex items-center border-b border-[rgba(2,47,66,0.1)] pb-3">
              <BookOpen className="w-4 h-4 mr-2 text-[#1e4a62]" /> Clause Library
            </h2>
            
            <div className="space-y-2">
              {CLAUSE_LIBRARY.map((item, index) => {
                const isActive = activeLibraryTab === index.toString();
                return (
                  <div key={index} className="bg-white border border-[rgba(2,47,66,0.1)] shadow-sm rounded-sm overflow-hidden">
                    <button 
                      onClick={() => setActiveLibraryTab(isActive ? null : index.toString())}
                      className="w-full p-4 flex justify-between items-center text-left hover:bg-[#f2f6fa] transition-colors"
                    >
                      <span className="text-sm font-bold text-[#022f42]">{item.title}</span>
                      {isActive ? <ChevronUp className="w-4 h-4 text-[#1e4a62]" /> : <ChevronDown className="w-4 h-4 text-[#1e4a62]" />}
                    </button>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: "auto", opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-[#f2f6fa] border-t border-[rgba(2,47,66,0.1)]"
                        >
                          <div className="p-4 space-y-4">
                            <div>
                              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-green-700 mb-1">
                                <CheckCircle2 className="w-3 h-3" /> Standard (Clean)
                              </div>
                              <p className="text-sm font-bold text-[#022f42]">{item.clean}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-red-600 mb-1">
                                <ShieldAlert className="w-3 h-3" /> Toxic (Predatory)
                              </div>
                              <p className="text-sm font-bold text-[#022f42]">{item.toxic}</p>
                            </div>
                            <div className="pt-3 border-t border-[rgba(2,47,66,0.1)]">
                              <p className="text-xs text-[#1e4a62] leading-relaxed">{item.explanation}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-800 flex items-center gap-2 mb-2">
                <AlertCircle className="w-3 h-3" /> Legal Disclaimer
              </h4>
              <p className="text-xs text-blue-900 leading-relaxed">
                FundabilityOS is an educational tool, not a law firm. This analyzer simulates venture capital best practices for term sheets. Always consult qualified legal counsel (preferably VC-specialized lawyers) before signing any binding agreements.
              </p>
            </div>

          </div>

        </div>
      </PrivacyConsentGate>
    </div>
  );
}
