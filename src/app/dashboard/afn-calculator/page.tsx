"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, DollarSign, Calculator, AlertTriangle, ArrowRight, ShieldCheck, Info } from "lucide-react";

export default function AFNCalculatorPage() {
  // Base Inputs
  const [salesCurrent, setSalesCurrent] = useState(1000000);
  const [salesProjected, setSalesProjected] = useState(2000000);
  const [assets, setAssets] = useState(800000); // Current Assets needed for current sales
  const [spontaneousLiabilities, setSpontaneousLiabilities] = useState(200000); // AP/Accruals tied to sales
  const [netProfitMargin, setNetProfitMargin] = useState(15); // %
  const [payoutRatio, setPayoutRatio] = useState(0); // % of profit paid as dividends (rare in startups, usually 0)

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // AFN Math Logic
  const salesIncrease = salesProjected - salesCurrent;
  
  // A* / S0 = Capital Intensity Ratio (Assets / Current Sales)
  const requiredAssetIncrease = (assets / salesCurrent) * salesIncrease;
  
  // L* / S0 = Spontaneous Liabilities Ratio
  const liabilityIncrease = (spontaneousLiabilities / salesCurrent) * salesIncrease;
  
  // M * S1 * (1 - RR) = Addition to Retained Earnings
  const retainedEarnings = (netProfitMargin / 100) * salesProjected * (1 - (payoutRatio / 100));
  
  // Final AFN Formula
  const afn = requiredAssetIncrease - liabilityIncrease - retainedEarnings;

  const handleCalculate = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      <div className="mb-10">
        <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
          Module 2.4.4
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#022f42] mb-2 flex items-center">
          <Calculator className="w-6 h-6 mr-3 text-[#1e4a62]" /> Additional Funds Needed (AFN)
        </h1>
        <p className="text-[#1e4a62] text-sm max-w-2xl leading-relaxed">
          Growth consumes cash. The AFN formula calculates the exact amount of external capital your startup requires to sustain its projected revenue growth mathematically, preventing cash flow insolvencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] border border-[#1e4a62]/10 rounded-sm">
            <h2 className="text-sm font-black text-[#022f42] uppercase tracking-widest mb-6 border-b border-[#1e4a62]/10 pb-3 flex items-center">
              Target Growth Profile
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 flex justify-between">
                  <span>Current Year Revenue</span>
                </label>
                <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] overflow-hidden rounded-sm">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><DollarSign className="w-4 h-4 text-[#1e4a62]"/></div>
                  <input type="number" value={salesCurrent} onChange={(e) => setSalesCurrent(Number(e.target.value))} className="w-full p-2.5 outline-none font-bold text-[#022f42] text-sm" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 flex justify-between">
                  <span>Projected Next Year Revenue</span> <span className="text-green-600">{(salesIncrease > 0 ? ((salesIncrease/salesCurrent)*100).toFixed(0) : 0)}% Growth</span>
                </label>
                <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] overflow-hidden rounded-sm">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><TrendingUp className="w-4 h-4 text-[#1e4a62]"/></div>
                  <input type="number" value={salesProjected} onChange={(e) => setSalesProjected(Number(e.target.value))} className="w-full p-2.5 outline-none font-bold text-[#022f42] text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] border border-[#1e4a62]/10 rounded-sm">
            <h2 className="text-sm font-black text-[#022f42] uppercase tracking-widest mb-6 border-b border-[#1e4a62]/10 pb-3">
               Balance Sheet Mechanics
            </h2>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 flex items-center">
                  Total Operating Assets
                  <span className="ml-2 group relative">
                    <Info className="w-3 h-3 text-[#1e4a62]" />
                    <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full w-48 bg-[#022f42] text-white text-[9px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      Assets tied directly to generating sales (cash, inventory, receivables).
                    </div>
                  </span>
                </label>
                <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] overflow-hidden rounded-sm">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><DollarSign className="w-4 h-4 text-[#1e4a62]"/></div>
                  <input type="number" value={assets} onChange={(e) => setAssets(Number(e.target.value))} className="w-full p-2.5 outline-none font-bold text-[#022f42] text-sm" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 flex items-center">
                  Spontaneous Liabilities
                  <span className="ml-2 group relative">
                    <Info className="w-3 h-3 text-[#1e4a62]" />
                    <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full w-48 bg-[#022f42] text-white text-[9px] p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      Liabilities that naturally expand with sales (accounts payable, accrued wages). Excludes formal debt.
                    </div>
                  </span>
                </label>
                <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] overflow-hidden rounded-sm">
                  <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><DollarSign className="w-4 h-4 text-[#1e4a62]"/></div>
                  <input type="number" value={spontaneousLiabilities} onChange={(e) => setSpontaneousLiabilities(Number(e.target.value))} className="w-full p-2.5 outline-none font-bold text-[#022f42] text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 block">Net Profit Margin (%)</label>
                   <input type="number" value={netProfitMargin} onChange={(e) => setNetProfitMargin(Number(e.target.value))} className="w-full p-2.5 outline-none font-bold text-[#022f42] text-sm border border-[#1e4a62]/15 rounded-sm" />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 block">Payout Ratio (%)</label>
                   <input type="number" value={payoutRatio} onChange={(e) => setPayoutRatio(Number(e.target.value))} className="w-full p-2.5 outline-none font-bold text-[#022f42] text-sm border border-[#1e4a62]/15 rounded-sm" />
                 </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCalculate}
            disabled={isAnalyzing}
            className={`w-full p-4 font-black tracking-widest uppercase text-xs flex items-center justify-center transition-all shadow-md rounded-sm ${
              isAnalyzing 
                ? "bg-white text-[rgba(2,47,66,0.3)] border border-[#1e4a62]/10 cursor-not-allowed" 
                : "bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42]"
            }`}
          >
            {isAnalyzing ? (
              <><div className="w-4 h-4 border-2 border-[#1e4a62] border-t-transparent rounded-full animate-spin mr-3"></div> Computing Assets...</>
            ) : (
              <>Calculate AFN Requirement <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </button>
        </div>

        {/* Output Panel View */}
        <div>
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full bg-[#f2f6fa] border-2 border-dashed border-[#1e4a62]/20 rounded-sm flex flex-col items-center justify-center p-10 text-center text-[#1e4a62]">
                 <Calculator className="w-12 h-12 mb-4 opacity-20" />
                 <h3 className="font-bold uppercase tracking-widest text-xs mb-2">Awaiting Parameters</h3>
                 <p className="text-sm max-w-sm">Input your revenue and balance sheet constraints to calculate your exact capital deficit.</p>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#022f42] rounded-sm shadow-2xl overflow-hidden relative border border-[#022f42]">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd800] rounded-full blur-[100px] opacity-10"></div>
                 
                 <div className="p-8 pb-0">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#b0d0e0] flex justify-between items-center mb-6">
                       <span>Total Capital Shortfall</span>
                       {afn > 0 ? <AlertTriangle className="w-4 h-4 text-[#ffd800]" /> : <ShieldCheck className="w-4 h-4 text-green-400" />}
                    </h3>

                    <div className="mb-8">
                       <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 bg-white mb-2 inline-block ${afn > 0 ? 'text-red-700' : 'text-green-700'}`}>
                         {afn > 0 ? 'External Capital Required' : 'Self-Sustaining Operations'}
                       </span>
                       <div className={`text-6xl font-black ${afn > 0 ? 'text-[#ffd800]' : 'text-green-400'}`}>
                          ${Math.abs(afn).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-8">
                    <h4 className="text-xs font-black text-[#022f42] uppercase tracking-widest mb-6 border-b border-[#1e4a62]/10 pb-3">
                       Mathematical Breakdown
                    </h4>

                    <div className="space-y-4 text-sm font-medium">
                       <div className="flex justify-between items-center bg-[#f2f6fa] p-3 rounded-sm border border-[#1e4a62]/5">
                          <span className="text-[#1e4a62]">Required Asset Increase</span>
                          <span className="font-bold text-[#022f42]">+ ${requiredAssetIncrease.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                       </div>
                       <div className="flex justify-between items-center bg-[#f2f6fa] p-3 rounded-sm border border-[#1e4a62]/5">
                          <span className="text-[#1e4a62] flex items-center">Spontaneous Liabilities <span className="mx-2 opacity-30 text-[10px]">(Subtract)</span></span>
                          <span className="font-bold text-green-600">- ${liabilityIncrease.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                       </div>
                       <div className="flex justify-between items-center bg-[#f2f6fa] p-3 rounded-sm border border-[#1e4a62]/5">
                          <span className="text-[#1e4a62] flex items-center">Retained Earnings <span className="mx-2 opacity-30 text-[10px]">(Subtract)</span></span>
                          <span className="font-bold text-green-600">- ${retainedEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#1e4a62]/10">
                       <p className="text-xs text-[#1e4a62] leading-relaxed">
                         {afn > 0 
                           ? `You are projecting a $${salesIncrease.toLocaleString()} increase in revenue. To support this growth, you must expand assets by $${requiredAssetIncrease.toLocaleString(undefined, { maximumFractionDigits: 0 })}. Your internal cash flows (liabilities + retained earnings) only cover $${(liabilityIncrease + retainedEarnings).toLocaleString(undefined, { maximumFractionDigits: 0 })}, leaving a dangerous $${afn.toLocaleString(undefined, { maximumFractionDigits: 0 })} deficit. You must raise this amount to reach your target.`
                           : `Your internal cash generation (profits + liabilities growth) exceeds your asset requirements. You have a surplus of $${Math.abs(afn).toLocaleString(undefined, { maximumFractionDigits: 0 })} and do not strictly require external venture capital for this growth phase.`}
                       </p>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
