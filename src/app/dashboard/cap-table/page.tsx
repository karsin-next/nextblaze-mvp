"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart as PieChartIcon, Plus, X, ArrowRight, DollarSign, Calculator, Lock, Percent } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import PrivacyConsentGate from "@/components/PrivacyConsentGate";

type ShareholderCategory = "Founder" | "Employee" | "Angel" | "VC" | "Options Pool";

interface Shareholder {
  id: string;
  name: string;
  category: ShareholderCategory;
  shares: number;
}

const CATEGORY_COLORS: Record<ShareholderCategory, string> = {
  "Founder": "#022f42",
  "Employee": "#1e4a62",
  "Angel": "#4a7c94",
  "VC": "#8baebf",
  "Options Pool": "#ffd800"
};

export default function CapTablePage() {
  const [shareholders, setShareholders] = useState<Shareholder[]>([
    { id: "1", name: "Founder 1", category: "Founder", shares: 1000000 },
    { id: "2", name: "Founder 2", category: "Founder", shares: 800000 },
    { id: "3", name: "ESOP", category: "Options Pool", shares: 200000 },
  ]);

  const [preMoney, setPreMoney] = useState<number>(2000000);
  const [raiseAmount, setRaiseAmount] = useState<number>(500000);
  const [targetEsopPercent, setTargetEsopPercent] = useState<number>(10); // e.g. 10%

  // Math Layer
  const oldTotalShares = shareholders.reduce((sum, s) => sum + s.shares, 0);
  const existingEsop = shareholders.filter(s => s.category === "Options Pool").reduce((sum, s) => sum + s.shares, 0);

  const pricePerShare = oldTotalShares > 0 ? preMoney / oldTotalShares : 0;
  const newInvestorShares = pricePerShare > 0 ? Math.floor(raiseAmount / pricePerShare) : 0;

  // Calculate ESOP refresh needed
  const targetEsopDecimal = targetEsopPercent / 100;
  // PostRoundTotal = OldTotal + NewInvestorShares + NewEsopShares
  // (ExistingEsop + NewEsopShares) / PostRoundTotal = targetEsopDecimal
  // (ExistingEsop + NewEsopShares) = targetEsopDecimal * (OldTotal + NewInvestorShares + NewEsopShares)
  // NewEsopShares - targetEsopDecimal*NewEsopShares = targetEsopDecimal*(OldTotal + NewInvestorShares) - ExistingEsop
  // NewEsopShares = (targetEsopDecimal * (OldTotal + NewInvestorShares) - ExistingEsop) / (1 - targetEsopDecimal)
  let newEsopShares = 0;
  if (targetEsopDecimal < 1) {
    newEsopShares = Math.floor((targetEsopDecimal * (oldTotalShares + newInvestorShares) - existingEsop) / (1 - targetEsopDecimal));
    if (newEsopShares < 0) newEsopShares = 0; // Pool is already large enough
  }

  const postRoundTotalShares = oldTotalShares + newInvestorShares + newEsopShares;
  const postMoneyValuation = preMoney + raiseAmount; // Note: valuation is pre+raise, actual post-money value of all shares might slightly differ due to ESOP refresh taking from pre-money price effectively, but standard simplified VC math uses Pre+Raise.

  const addShareholder = () => {
    setShareholders([...shareholders, { id: Date.now().toString(), name: "New Shareholder", category: "Angel", shares: 100000 }]);
  };

  const removeShareholder = (id: string) => {
    setShareholders(shareholders.filter(s => s.id !== id));
  };

  const updateShareholder = (id: string, field: keyof Shareholder, value: any) => {
    setShareholders(shareholders.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const chartDataPre = useMemo(() => {
    const data = shareholders.reduce((acc, current) => {
      const existing = acc.find(item => item.name === current.category);
      if (existing) {
        existing.value += current.shares;
      } else {
        acc.push({ name: current.category, value: current.shares, color: CATEGORY_COLORS[current.category] });
      }
      return acc;
    }, [] as { name: string, value: number, color: string }[]);
    return data;
  }, [shareholders]);

  const chartDataPost = useMemo(() => {
    const data = chartDataPre.map(item => ({ ...item }));
    
    // Add new investors
    data.push({ name: "New Investors", value: newInvestorShares, color: "#22c55e" });
    
    // Add ESOP refresh
    const esopItem = data.find(item => item.name === "Options Pool");
    if (esopItem) {
      esopItem.value += newEsopShares;
    } else if (newEsopShares > 0) {
      data.push({ name: "Options Pool", value: newEsopShares, color: CATEGORY_COLORS["Options Pool"] });
    }
    return data;
  }, [chartDataPre, newInvestorShares, newEsopShares]);


  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
         <div className="max-w-2xl">
           <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
             Phase 4: Syndicate
           </div>
           <h1 className="text-3xl font-bold text-[#022f42] mb-3">Cap Table Simulator</h1>
           <p className="text-[#1e4a62] text-sm leading-relaxed">
             Mathematically model your dilution before signing a term sheet. Input your current cap table, simulate the round parameters and ESOP refresh, to see exactly how much equity you retain.
           </p>
         </div>
         <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42] shrink-0 ml-4 hidden md:block">
           Back to Hub
         </Link>
      </div>

      <PrivacyConsentGate
        config={{
          consentKey: "cap_table",
          sensitivity: "sensitive",
          title: "Cap Table Confidentiality",
          aiExplanation: "Cap tables dictate your ownership structure. FundabilityOS processes your simulation entirely in your browser's memory. This data is NEVER written to our database. When you refresh the page or leave, it is permanently erased.",
          dataUsage: "Calculate pre/post money valuation dilution mechanics, required ESOP refresh magnitude, and equity loss per founder.",
          storageNote: "Memory ONLY (ephemeral). Never leaves your device.",
          dataPoints: ["Shareholder Names", "Share Amounts", "Pre-Money Valuation", "Target Raise"],
          skippable: false,
        }}
        onConsent={() => {}}
      >
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Current Cap Table Input */}
          <div className="xl:col-span-2 space-y-6">
            
            <div className="bg-white border border-[rgba(2,47,66,0.1)] shadow-sm">
              <div className="p-4 border-b border-[rgba(2,47,66,0.1)] bg-[#022f42] flex justify-between items-center">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-[#ffd800]" /> 1. Current Cap Table
                </h2>
                <div className="px-3 py-1 bg-[#1e4a62] text-[#b0d0e0] text-[10px] font-black tracking-widest rounded-sm flex items-center gap-2">
                  Total Pre-Round Shares: <span className="text-white text-sm">{oldTotalShares.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-12 gap-4 mb-3 text-[10px] font-black uppercase tracking-widest text-[#022f42]">
                  <div className="col-span-4">Shareholder Name</div>
                  <div className="col-span-3">Category</div>
                  <div className="col-span-3 text-right"># of Shares</div>
                  <div className="col-span-2 text-right">Pre-Money %</div>
                </div>

                <div className="space-y-3">
                  {shareholders.map((s) => {
                    const pctObject = ((s.shares / (oldTotalShares || 1)) * 100).toFixed(2);
                    return (
                      <div key={s.id} className="grid grid-cols-12 gap-4 items-center group">
                        <div className="col-span-4">
                          <input 
                            value={s.name} 
                            onChange={(e) => updateShareholder(s.id, "name", e.target.value)}
                            className="w-full border border-[rgba(2,47,66,0.2)] rounded-sm px-3 py-2 text-sm font-bold text-[#022f42] focus:border-[#022f42] outline-none"
                            placeholder="Name"
                          />
                        </div>
                        <div className="col-span-3">
                          <select 
                            value={s.category} 
                            onChange={(e) => updateShareholder(s.id, "category", e.target.value)}
                            className="w-full border border-[rgba(2,47,66,0.2)] rounded-sm px-3 py-2 text-sm text-[#022f42] bg-white focus:border-[#022f42] outline-none"
                          >
                            <option value="Founder">Founder</option>
                            <option value="Employee">Employee</option>
                            <option value="Angel">Angel</option>
                            <option value="VC">VC</option>
                            <option value="Options Pool">Options Pool</option>
                          </select>
                        </div>
                        <div className="col-span-3">
                          <input 
                            type="number"
                            min="0"
                            value={s.shares || ""} 
                            onChange={(e) => updateShareholder(s.id, "shares", parseInt(e.target.value) || 0)}
                            className="w-full border border-[rgba(2,47,66,0.2)] rounded-sm px-3 py-2 text-sm font-bold text-[#022f42] focus:border-[#022f42] outline-none text-right font-mono"
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-2">
                           <span className="font-mono text-xs font-bold text-[#1e4a62 bg-[#f2f6fa] px-2 py-1 rounded-sm w-16 text-right">
                             {pctObject}%
                           </span>
                           <button onClick={() => removeShareholder(s.id)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                             <X className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button 
                  onClick={addShareholder}
                  className="mt-6 flex items-center text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42] border border-dashed border-[#1e4a62]/30 w-full justify-center py-3 rounded-sm hover:border-[#022f42] hover:bg-[#f2f6fa] transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Shareholder/Block
                </button>
              </div>
            </div>

            {/* Post Round Results Table */}
            <div className="bg-white border border-[rgba(2,47,66,0.1)] shadow-sm">
               <div className="p-4 border-b border-[rgba(2,47,66,0.1)] bg-[#022f42] flex justify-between items-center">
                 <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                   <ArrowRight className="w-4 h-4 text-[#ffd800]" /> Post-Round Dilution Output
                 </h2>
                 <div className="px-3 py-1 bg-[#1e4a62] text-[#b0d0e0] text-[10px] font-black tracking-widest rounded-sm flex items-center gap-2">
                   Total Post-Round Shares: <span className="text-white text-sm">{postRoundTotalShares.toLocaleString()}</span>
                 </div>
               </div>
               
               <div className="p-6">
                 <div className="grid grid-cols-12 gap-4 mb-3 text-[10px] font-black uppercase tracking-widest text-[#022f42] border-b border-[#1e4a62]/10 pb-2">
                    <div className="col-span-4">Shareholder Name</div>
                    <div className="col-span-3 text-right">New Share Count</div>
                    <div className="col-span-2 text-right">Post-Money %</div>
                    <div className="col-span-3 text-right">Implied Equity Value (RM)</div>
                 </div>

                 <div className="space-y-4">
                   {/* Existing Shareholders Diluted */}
                   {shareholders.map(s => {
                     const postPct = ((s.shares / postRoundTotalShares) * 100);
                     const postVal = (postPct / 100) * postMoneyValuation;
                     return (
                       <div key={s.id} className="grid grid-cols-12 gap-4 items-center">
                         <div className="col-span-4 font-bold text-sm text-[#022f42]">{s.name}</div>
                         <div className="col-span-3 text-right font-mono text-sm text-[#1e4a62]">{s.shares.toLocaleString()}</div>
                         <div className="col-span-2 text-right">
                           <span className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-sm">
                             {postPct.toFixed(2)}%
                           </span>
                         </div>
                         <div className="col-span-3 text-right font-mono text-sm font-bold text-green-700">
                           {(postVal).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                         </div>
                       </div>
                     );
                   })}

                   {/* New ESOP Refresh Row */}
                   {newEsopShares > 0 && (
                     <div className="grid grid-cols-12 gap-4 items-center pt-2 border-t border-dashed border-[#1e4a62]/20">
                       <div className="col-span-4 font-bold text-sm text-[#ffd800] bg-[#022f42] inline-block px-2 py-1 rounded-sm w-fit">ESOP Refresh (New)</div>
                       <div className="col-span-3 text-right font-mono text-sm text-[#1e4a62]">+{newEsopShares.toLocaleString()}</div>
                       <div className="col-span-2 text-right">
                         <span className="font-mono text-xs font-bold text-[#022f42] bg-[#f2f6fa] px-2 py-1 rounded-sm">
                           {((newEsopShares / postRoundTotalShares) * 100).toFixed(2)}%
                         </span>
                       </div>
                       <div className="col-span-3 text-right font-mono text-sm font-bold text-green-700">
                         {(((newEsopShares / postRoundTotalShares)) * postMoneyValuation).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                       </div>
                     </div>
                   )}

                   {/* New Investors Row */}
                   <div className="grid grid-cols-12 gap-4 items-center pt-2 border-t border-dashed border-[#1e4a62]/20">
                       <div className="col-span-4 font-bold text-[13px] text-white bg-green-600 inline-block px-2 py-1 rounded-sm w-fit">New Investors (Lead + Sync)</div>
                       <div className="col-span-3 text-right font-mono text-[13px] font-bold text-green-600">+{newInvestorShares.toLocaleString()}</div>
                       <div className="col-span-2 text-right">
                         <span className="font-mono text-[13px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-sm">
                           {((newInvestorShares / postRoundTotalShares) * 100).toFixed(2)}%
                         </span>
                       </div>
                       <div className="col-span-3 text-right font-mono text-[15px] font-black text-green-700">
                         {raiseAmount.toLocaleString()}
                       </div>
                     </div>

                 </div>
               </div>
            </div>

          </div>

          {/* Right Column: Round Modeler & Charts */}
          <div className="xl:col-span-1 space-y-6">
            
            <div className="bg-white border border-green-200 border-t-4 border-t-green-500 shadow-sm p-6 relative overflow-hidden">
               <div className="absolute -right-6 -top-6 text-green-500/10">
                 <Calculator className="w-32 h-32" />
               </div>
               
               <h2 className="text-sm font-black text-green-800 uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2">
                 <DollarSign className="w-4 h-4" /> 2. Round Simulator
               </h2>

               <div className="space-y-5 relative z-10">
                 <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-green-900 block mb-1">Pre-Money Valuation (RM)</label>
                   <input 
                      type="number"
                      value={preMoney}
                      onChange={e => setPreMoney(Number(e.target.value))}
                      className="w-full text-xl font-black font-mono text-green-700 border-2 border-green-200 rounded-sm p-3 focus:border-green-500 outline-none"
                   />
                 </div>
                 
                 <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block mb-1">Total Raise Amount (RM)</label>
                   <input 
                      type="number"
                      value={raiseAmount}
                      onChange={e => setRaiseAmount(Number(e.target.value))}
                      className="w-full text-lg font-bold font-mono text-[#022f42] border border-[rgba(2,47,66,0.2)] rounded-sm p-3 focus:border-[#022f42] outline-none"
                   />
                 </div>

                 <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block mb-1">Target Post-Round ESOP Pool (%)</label>
                   <p className="text-[10px] text-[#1e4a62] leading-relaxed mb-2">VCs often require a 10-20% Option Pool reserved <strong className="font-bold underline">after</strong> the round closes. The refresh dilution is usually borne entirely by the founders.</p>
                   <div className="flex items-center">
                     <input 
                        type="number"
                        min="0"
                        max="30"
                        value={targetEsopPercent}
                        onChange={e => setTargetEsopPercent(Number(e.target.value))}
                        className="w-24 text-lg font-bold font-mono text-[#022f42] border border-[rgba(2,47,66,0.2)] rounded-sm p-3 focus:border-[#022f42] outline-none"
                     />
                     <span className="ml-3 font-bold text-[#1e4a62] text-xl">%</span>
                   </div>
                 </div>
               </div>

               <div className="mt-6 pt-5 border-t border-green-200">
                 <div className="flex justify-between items-center mb-1">
                   <div className="text-[10px] font-black uppercase tracking-widest text-green-800">Implied Post-Money Valuation</div>
                   <div className="font-mono text-lg font-black text-green-600">RM {postMoneyValuation.toLocaleString()}</div>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="text-[10px] font-black uppercase tracking-widest text-[#1e4a62]">Price Per Share</div>
                   <div className="font-mono text-sm font-bold text-[#1e4a62]">RM {pricePerShare.toFixed(4)}</div>
                 </div>
               </div>
            </div>

            {/* Visual Charts */}
            <div className="bg-white border border-[rgba(2,47,66,0.1)] shadow-sm p-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-[#022f42] text-center mb-4">Ownership Before & After</h3>
               
               <div className="flex flex-col gap-6">
                 <div>
                   <div className="text-xs font-bold text-center text-[#1e4a62] mb-2">Pre-Money Ownership</div>
                   <div className="h-48 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartDataPre}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {chartDataPre.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value: number) => [value.toLocaleString() + ' shares', 'Amount']} />
                        </PieChart>
                     </ResponsiveContainer>
                   </div>
                 </div>

                 <div className="h-px w-full bg-[#1e4a62]/10"></div>

                 <div>
                   <div className="text-xs font-bold text-center text-[#022f42] mb-2">Post-Money Ownership</div>
                   <div className="h-48 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartDataPost}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {chartDataPost.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value: number) => [value.toLocaleString() + ' shares', 'Amount']} />
                        </PieChart>
                     </ResponsiveContainer>
                   </div>
                 </div>
               </div>

            </div>

          </div>
        </div>
      </PrivacyConsentGate>
    </div>
  );
}
