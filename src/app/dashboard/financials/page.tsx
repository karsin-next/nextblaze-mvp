"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, CheckCircle2, ArrowRight, DollarSign, TrendingUp, AlertTriangle, Activity, Plus, X, BarChart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import PrivacyConsentGate from "@/components/PrivacyConsentGate";

const METRIC_LIBRARY = [
  { id: "mrr", name: "Monthly Rec. Rev (MRR)", icon: DollarSign, req: true, desc: "Total predictable monthly revenue." },
  { id: "burn", name: "Monthly Burn Rate", icon: DollarSign, req: true, desc: "Net cash spent per month." },
  { id: "cac", name: "Customer Acq. Cost", icon: BarChart, req: true, desc: "Cost to acquire a single customer." },
  { id: "ltv", name: "Lifetime Value (LTV)", icon: TrendingUp, req: false, desc: "Total revenue expected from one user." },
  { id: "runway", name: "Cash Runway", icon: PieChart, req: false, desc: "Months until cash hits zero." },
  { id: "churn", name: "Revenue Churn %", icon: Activity, req: false, desc: "Monthly revenue lost to cancellations." },
  { id: "nps", name: "Net Promoter Score", icon: CheckCircle2, req: false, desc: "Customer satisfaction metric." },
  { id: "gm", name: "Gross Margin %", icon: PieChart, req: false, desc: "Revenue minus cost of goods sold." },
];

export default function FinancialsConnectPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Array of metric IDs that are currently on the canvas
  const [activeIds, setActiveIds] = useState<string[]>([]);
  // Store the actual numeric values for the active metrics
  const [values, setValues] = useState<Record<string, string>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check for missing required metrics
  const missingRequired = METRIC_LIBRARY.filter(m => m.req && !activeIds.includes(m.id));

  const addMetric = (id: string) => {
    if (!activeIds.includes(id)) {
      setActiveIds([...activeIds, id]);
    }
  };

  const removeMetric = (id: string) => {
    setActiveIds(activeIds.filter(x => x !== id));
    const newVals = { ...values };
    delete newVals[id];
    setValues(newVals);
  };

  const updateValue = (id: string, val: string) => {
    setValues(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/metrics");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
         <div className="max-w-2xl">
           <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
             Module 2.1
           </div>
           <h1 className="text-3xl font-bold text-[#022f42] mb-3">Custom Metrics Builder</h1>
           <p className="text-[#1e4a62] text-sm leading-relaxed">
             Drop the raw spreadsheets. Build your custom Investor Dashboard by adding your core KPIs to the canvas below, and self-report their current values to generate your Unit Economics.
           </p>
         </div>
         <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42] shrink-0 ml-4">
           Back to Hub
         </Link>
      </div>

      {/* Privacy Consent Gate — wraps the entire metrics canvas */}
      <PrivacyConsentGate
        config={{
          consentKey: "financials_metrics",
          sensitivity: "high-level",
          title: "You're about to enter your financial metrics",
          aiExplanation:
            "To generate your Investor Dashboard charts (Runway Trajectory, Revenue vs Burn, EBITDA Breakeven), FundabilityOS needs your core financial KPIs. These numbers let us instantly calculate how many months of runway you have, whether your unit economics are investor-grade, and where your biggest fundability gaps are. Without them, all charts will show zero. You don't need exact figures — best-estimate values are perfectly valid at this stage.",
          dataUsage: "Calculate runway, generate Investor Dashboard charts, benchmark unit economics (LTV:CAC ratio, burn multiple), and identify fundraising gaps in your Gap Analysis Report.",
          storageNote: "Stored in your browser's localStorage only — never sent to our servers. Cleared instantly with the 'Clear Session Data' button in Settings.",
          dataPoints: [
            "Monthly Recurring Revenue (MRR) — how much revenue comes in each month",
            "Monthly Burn Rate — how much cash you spend each month",
            "Customer Acquisition Cost (CAC) — average cost to get one customer",
            "Lifetime Value (LTV) — average revenue from one customer over their lifetime",
            "Cash Runway (optional) — months until cash hits zero",
          ],
          skippable: true,
        }}
        onConsent={() => {}}
        onSkip={() => {}}
      >

      {success ? (
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-20 flex flex-col items-center text-center bg-white border border-[rgba(2,47,66,0.1)] shadow-xl mt-12">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
            <h3 className="text-3xl font-bold text-[#022f42] mb-3">Telemetry Locked!</h3>
            <p className="text-[#1e4a62] text-lg">Your custom metrics have been validated. Routing you to your Investor Dashboard...</p>
         </motion.div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Library */}
        <div className="lg:col-span-4 space-y-4">
           <h2 className="text-sm font-bold text-[#022f42] uppercase tracking-widest mb-4 flex items-center border-b border-[rgba(2,47,66,0.1)] pb-3">
             <Activity className="w-4 h-4 mr-2 text-[#1e4a62]" /> Metrics Library
           </h2>
           
           <div className="space-y-2">
             {METRIC_LIBRARY.filter(m => !activeIds.includes(m.id)).map(m => (
               <motion.div 
                 layoutId={`metric-${m.id}`}
                 key={m.id} 
                 className="bg-white border border-[rgba(2,47,66,0.1)] p-3 cursor-pointer hover:border-[#022f42] flex items-center justify-between group transition-colors shadow-sm"
                 onClick={() => addMetric(m.id)}
               >
                 <div className="flex items-center">
                   <div className="w-8 h-8 rounded-full bg-[#f2f6fa] flex items-center justify-center mr-3 text-[#1e4a62]">
                     <m.icon className="w-4 h-4" />
                   </div>
                   <div>
                     <div className="text-[11px] font-bold text-[#022f42] flex items-center">
                       {m.name}
                       {m.req && <span className="ml-2 text-[8px] bg-[#ffd800] text-[#022f42] px-1.5 py-0.5 rounded-sm tracking-widest uppercase">Required</span>}
                     </div>
                     <div className="text-[9px] text-[rgba(2,47,66,0.6)]">{m.desc}</div>
                   </div>
                 </div>
                 <Plus className="w-4 h-4 text-[rgba(2,47,66,0.3)] group-hover:text-[#022f42] transition-colors" />
               </motion.div>
             ))}
             
             {METRIC_LIBRARY.filter(m => !activeIds.includes(m.id)).length === 0 && (
               <div className="text-center p-8 border border-dashed border-[rgba(2,47,66,0.2)] text-[#1e4a62] text-xs font-bold uppercase tracking-widest">
                 All templates deployed.
               </div>
             )}
           </div>
        </div>

        {/* Right Col: Canvas */}
        <div className="lg:col-span-8">
          <div className="bg-[#f2f6fa] border-2 border-dashed border-[rgba(2,47,66,0.15)] p-6 min-h-[500px] relative">
            
            <h2 className="text-sm font-bold text-[#022f42] uppercase tracking-widest mb-6 flex items-center border-b border-[rgba(2,47,66,0.1)] pb-3">
               Active Canvas Pipeline
            </h2>
            
            {missingRequired.length > 0 && activeIds.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-yellow-50 border-l-4 border-[#ffd800] p-4 shadow-sm">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex items-center mb-1"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Suggestion: Add Benchmarks</h4>
                 <p className="text-xs text-[#1e4a62] leading-relaxed">
                   To generate a robust investor dashboard, the system highly recommends tracking <strong>{missingRequired.map(m => m.name).join(', ')}</strong>. Click them in the library to add them to your canvas.
                 </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {activeIds.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-20 text-[rgba(2,47,66,0.4)]">
                     <BarChart className="w-12 h-12 mb-4 opacity-50" />
                     <p className="text-sm font-bold uppercase tracking-widest">Canvas is empty</p>
                     <p className="text-xs mt-2">Click metrics from the library to build your dashboard.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeIds.map(id => {
                const m = METRIC_LIBRARY.find(x => x.id === id)!;
                return (
                  <motion.div 
                    layoutId={`metric-${m.id}`}
                    key={m.id} 
                    className="bg-white border border-[#022f42] p-4 shadow-md relative"
                  >
                    <button onClick={() => removeMetric(id)} className="absolute top-2 right-2 text-[rgba(2,47,66,0.3)] hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center mb-4">
                       <div className="w-6 h-6 rounded-full bg-[#022f42] flex items-center justify-center mr-2 text-white">
                         <m.icon className="w-3 h-3" />
                       </div>
                       <div className="text-xs font-bold text-[#022f42] uppercase tracking-wider">{m.name}</div>
                    </div>
                    
                    <div className="flex border-b-2 border-[rgba(2,47,66,0.1)] focus-within:border-[#ffd800] transition-colors">
                      <input 
                        type="number" 
                        value={values[id] || ""}
                        onChange={(e) => updateValue(id, e.target.value)}
                        placeholder="0.00" 
                        className="w-full py-2 outline-none font-bold text-[#022f42] text-xl" 
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {activeIds.length > 0 && (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || activeIds.some(id => !values[id]) || missingRequired.length > 0}
                className={`w-full p-4 mt-8 font-bold tracking-widest uppercase text-xs border-2 transition-all flex items-center justify-center ${
                  (activeIds.some(id => !values[id]) || missingRequired.length > 0 || isSubmitting) ? "bg-white text-[rgba(2,47,66,0.4)] border-transparent cursor-not-allowed" : "bg-[#022f42] text-white border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] shadow-xl cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-[#1e4a62] border-t-transparent rounded-full animate-spin mr-3"></div> Formatting Canvas...</>
                ) : (
                  <><span className="mr-2">{missingRequired.length > 0 ? "Add Required Metrics to Continue" : activeIds.some(id => !values[id]) ? "Fill All Values to Continue" : "Generate Dashboard"}</span> <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            )}

          </div>
        </div>

      </div>
      )}
      </PrivacyConsentGate>
    </div>
  );
}
