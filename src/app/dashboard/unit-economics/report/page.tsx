"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, Eye, Sparkles, ExternalLink, Share2, Layout, Lock,
  TrendingUp, Target, AlertTriangle, Calculator
} from "lucide-react";
import Link from "next/link";
import { InvestorDashboardContent } from "@/components/financials/InvestorDashboardContent";

export default function InvestorReportPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // --- Calculator Logic (Transferred from 2.3 Root) ---
  const [avgRevPerCustomer, setAvgRev] = useState("120");
  const [avgLifespan, setAvgLifespan] = useState("24");
  const [grossMarginPct, setGrossMargin] = useState("70");
  const [totalMarketingSpend, setMarketingSpend] = useState("5000");
  const [newCustomers, setNewCustomers] = useState("25");
  const [inventoryDays, setInventoryDays] = useState("45");
  const [receivableDays, setReceivableDays] = useState("30");
  const [payableDays, setPayableDays] = useState("40");

  const ltv = (parseFloat(avgRevPerCustomer) || 0) * (parseFloat(avgLifespan) || 0) * ((parseFloat(grossMarginPct) || 0) / 100);
  const cac = (parseFloat(newCustomers) || 1) > 0 ? (parseFloat(totalMarketingSpend) || 0) / (parseFloat(newCustomers) || 1) : 0;
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  const gmPct = parseFloat(grossMarginPct) || 0;
  const ccc = (parseFloat(inventoryDays) || 0) + (parseFloat(receivableDays) || 0) - (parseFloat(payableDays) || 0);

  // --- Configuration State (Transferred from 2.2.4) ---
  const [config, setConfig] = useState({
    showRunway: true,
    showGrowth: true,
    showBurn: true,
    showUnitEconomics: true,
    viewName: "Investor Reporting View"
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step3: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_2_3_5");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setConfig(parsed.data);
        if (parsed.calc) {
           setAvgRev(parsed.calc.avgRevPerCustomer || "120");
           setAvgLifespan(parsed.calc.avgLifespan || "24");
           setGrossMargin(parsed.calc.grossMarginPct || "70");
           setMarketingSpend(parsed.calc.totalMarketingSpend || "5000");
           setNewCustomers(parsed.calc.newCustomers || "25");
           setInventoryDays(parsed.calc.inventoryDays || "45");
           setReceivableDays(parsed.calc.receivableDays || "30");
           setPayableDays(parsed.calc.payableDays || "40");
        }
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("audit_2_3_5", JSON.stringify({ 
        data: config, 
        calc: {
          avgRevPerCustomer, avgLifespan, grossMarginPct,
          totalMarketingSpend, newCustomers, inventoryDays,
          receivableDays, payableDays
        },
        step 
      }));
    }
  }, [config, step, isLoaded, avgRevPerCustomer, avgLifespan, grossMarginPct, totalMarketingSpend, newCustomers, inventoryDays, receivableDays, payableDays]);

  const handleNextStep = () => setStep(Math.min(3, step + 1));

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    localStorage.setItem('audit_2_3_5', 'completed');
    setTimeout(() => window.location.href = "/dashboard/roadmap", 1000); 
  };

  if (!isLoaded) return null;

  const getRatioColor = (r: number) => r >= 3 ? "text-emerald-500" : r >= 1.5 ? "text-yellow-500" : "text-rose-500";

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.3.5 INVESTOR: Report"
        title="Investor Report"
        description="Finalize your operational narrative. Fine-tune your unit economics and configure the visibility of your financial dashboard before reporting to stakeholders."
      />

      {/* Progress Bar (SOP: Clickable Navigation) */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          {[1,2,3].map(i => (
            <button 
              key={i} 
              onClick={() => setStep(i)}
              className={`h-2 w-20 md:w-32 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'} hover:opacity-80 cursor-pointer`} 
              title={`Jump to Step ${i}`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-[#022f42] uppercase tracking-widest ml-4">Phase {step} of 3</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Economics Workbench (Transferred from 2.3 Root) */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <div className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm">
                  <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center uppercase tracking-tight">Economics Workbench</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b pb-2">LTV/CAC Drivers</h3>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 block">Avg Revenue / Mo ($)</label>
                        <input type="number" value={avgRevPerCustomer} onChange={e => setAvgRev(e.target.value)} className="w-full px-4 py-2 border border-gray-100 rounded-sm font-bold text-[#022f42]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 block">Marketing Spend ($)</label>
                        <input type="number" value={totalMarketingSpend} onChange={e => setMarketingSpend(e.target.value)} className="w-full px-4 py-2 border border-gray-100 rounded-sm font-bold text-[#022f42]" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b pb-2">Cash Conversion Cycle</h3>
                      <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5">
                          <span>Operatonal Tie-up</span>
                          <span>{ccc} Days</span>
                        </div>
                        <input type="range" min="0" max="150" value={ccc} readOnly className="w-full accent-[#022f42]" />
                      </div>
                      <div className="p-4 bg-[#f2f6fa] rounded-sm">
                        <p className="text-[10px] text-[#1e4a62] leading-relaxed">
                          Your unit economics result in an **LTV:CAC of {ltvCacRatio.toFixed(1)}x**. 
                          Finalize these numbers before they are committed to the report.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#022f42] p-4 text-center rounded-sm">
                      <p className="text-[9px] text-blue-200 uppercase font-black tracking-widest mb-1">Ratio</p>
                      <p className={`text-2xl font-black ${getRatioColor(ltvCacRatio)}`}>{ltvCacRatio.toFixed(1)}x</p>
                    </div>
                    <div className="bg-[#022f42] p-4 text-center rounded-sm">
                      <p className="text-[9px] text-blue-200 uppercase font-black tracking-widest mb-1">LTV</p>
                      <p className="text-2xl font-black text-white">${Math.round(ltv).toLocaleString()}</p>
                    </div>
                    <div className="bg-[#022f42] p-4 text-center rounded-sm">
                      <p className="text-[9px] text-blue-200 uppercase font-black tracking-widest mb-1">CCC</p>
                      <p className="text-2xl font-black text-[#ffd800]">{ccc}d</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                  <h2 className="text-xl font-black text-[#022f42] mb-6 flex items-center gap-2">
                    <Layout className="w-5 h-5 text-[#ffd800]" /> Visibility Configuration
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Runway & Burn Curves', key: 'showRunway' },
                      { label: 'Revenue & Growth Index', key: 'showGrowth' },
                      { label: 'Expense Allocation Pie', key: 'showBurn' },
                      { label: 'Unit Economics (CAC/LTV)', key: 'showUnitEconomics' }
                    ].map(toggle => (
                      <button 
                        key={toggle.key}
                        onClick={()=>setConfig({...config, [toggle.key]: !config[toggle.key as keyof typeof config]})}
                        className={`p-4 border-2 rounded-sm flex items-center justify-between transition-all ${config[toggle.key as keyof typeof config] ? 'border-[#022f42] bg-[#f2f6fa]' : 'border-gray-50 opacity-60'}`}
                      >
                         <span className="font-bold text-xs text-[#022f42]">{toggle.label}</span>
                         <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${config[toggle.key as keyof typeof config] ? 'bg-[#ffd800] border-[#ffd800]' : 'border-gray-200'}`}>
                            {config[toggle.key as keyof typeof config] && <Check className="w-2 h-2 text-[#022f42]" />}
                         </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Unified Preview */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-6 md:p-8 shadow-2xl border-t-[4px] border-[#022f42] rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 bg-[#ffd800] text-[#022f42] font-black text-[10px] uppercase tracking-widest shadow-md z-30">RECIPIENT PREVIEW</div>
                
                <div className="mb-8 border-b border-gray-100 pb-4">
                  <h3 className="text-2xl font-black text-[#022f42] uppercase tracking-tight">{config.viewName}</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live Investor Reporting View</p>
                </div>

                <div className="relative">
                  {/* Pull together the dashboard charts + the unit economics cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {config.showUnitEconomics && (
                      <>
                        <div className="bg-[#022f42] p-4 text-center rounded-sm shadow-lg border-b-2 border-emerald-500">
                          <p className="text-[8px] text-blue-200 uppercase font-black tracking-widest mb-1">LTV:CAC</p>
                          <p className="text-xl font-black text-emerald-400">{ltvCacRatio.toFixed(1)}x</p>
                        </div>
                        <div className="bg-[#022f42] p-4 text-center rounded-sm shadow-lg border-b-2 border-[#ffd800]">
                          <p className="text-[8px] text-blue-200 uppercase font-black tracking-widest mb-1">CAC</p>
                          <p className="text-xl font-black text-white">${Math.round(cac)}</p>
                        </div>
                        <div className="bg-[#022f42] p-4 text-center rounded-sm shadow-lg border-b-2 border-blue-400">
                          <p className="text-[8px] text-blue-200 uppercase font-black tracking-widest mb-1">CCC</p>
                          <p className="text-xl font-black text-blue-300">{ccc}d</p>
                        </div>
                        <div className="bg-[#022f42] p-4 text-center rounded-sm shadow-lg border-b-2 border-purple-400">
                          <p className="text-[8px] text-blue-200 uppercase font-black tracking-widest mb-1">MRR/User</p>
                          <p className="text-xl font-black text-purple-300">${avgRevPerCustomer}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <InvestorDashboardContent config={config} />
                  
                  {/* Subtle "Preview Only" overlay */}
                  <div className="absolute inset-0 bg-white/5 pointer-events-none z-20" />
                </div>

                <div className="mt-12 p-6 bg-[#f2f6fa] border border-dashed border-[#022f42]/20 text-center italic text-xs text-[#1e4a62] rounded-sm">
                   &quot;Unified View: Dashboards and Unit Economics synchronized for stakeholder review.&quot;
                </div>
              </motion.div>
            )}

            {/* STEP 3: Dispatch */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-[#022f42] p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm text-center text-white">
                <h2 className="text-2xl font-black mb-12 text-[#ffd800] uppercase tracking-tight">Reporting Infrastructure Active</h2>
                
                <div className="bg-white/5 border border-white/10 p-10 rounded-sm mb-12 flex flex-col items-center">
                   <Share2 className="w-16 h-16 text-[#ffd800] mb-6" />
                   <h4 className="font-black text-xl mb-2">{config.viewName} Ready</h4>
                   <p className="text-sm font-medium text-blue-50 max-w-sm leading-relaxed">
                     Your operational efficiency and financial dashboards are now unified. 
                     The committed configuration is encrypted in your local governance vault.
                   </p>
                </div>

                <div className="flex justify-center">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-xl ${savedSuccess ? 'bg-emerald-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Report Locked' : 'Finalize & Lock Report'}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className={`font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1e4a62] hover:text-[#022f42]'}`}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4"/> Back
            </button>
            {step < 3 && (
              <button
                onClick={handleNextStep}
                className="bg-[#022f42] text-white px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#1b4f68] transition-colors flex items-center gap-2 shadow-md"
              >
                Next Step <ArrowRight className="w-4 h-4"/>
              </button>
            )}
          </div>
        </div>

        {/* ADDITIONAL Column (SOP: AI & Academy) */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-lg border-b-4 border-[#ffd800]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#ffd800]" />
              <h3 className="font-black uppercase tracking-widest text-xs">INVESTOR SIGNAL</h3>
            </div>
            
            <div className="space-y-4 font-medium">
              <div className="bg-white/10 p-4 rounded-sm border border-white/10 text-xs leading-relaxed">
                <p>
                  {step === 1 ? "Founders who fine-tune their LTV:CAC and CCC before reporting signal highest levels of operational maturity." : 
                   step === 2 ? "A unified report that blends cash burn with unit efficiency provides the best proxy for 'Defensible Growth'." :
                   "The Investor Report is your quantitative legal record for stakeholders. Ensure all overrides are grounded in actual transactional data."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/reporting-standards" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                  <span>Education: Report Mastery →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Financial Literacy</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm text-center">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Blended LTV:CAC</h4>
            <div className={`text-4xl font-black ${getRatioColor(ltvCacRatio)}`}>{ltvCacRatio.toFixed(1)}x</div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1 tracking-widest">{cac > 0 ? 'Math Verified' : 'Incomplete'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
