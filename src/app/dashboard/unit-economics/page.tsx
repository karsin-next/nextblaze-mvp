"use client";

import { useState } from "react";
import { ArrowRight, Target, Activity, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function UnitEconomicsPage() {
  // LTV & CAC Core
  const [avgRevPerCustomer, setAvgRev] = useState("120");
  const [avgLifespan, setAvgLifespan] = useState("24");
  const [grossMarginPct, setGrossMargin] = useState("70");
  const [totalMarketingSpend, setMarketingSpend] = useState("5000");
  const [newCustomers, setNewCustomers] = useState("25");

  // VOS Indicator Cash Conversion Cycle (CCC) Inputs
  const [inventoryDays, setInventoryDays] = useState("45");
  const [receivableDays, setReceivableDays] = useState("30");
  const [payableDays, setPayableDays] = useState("40");

  const ltv = (parseFloat(avgRevPerCustomer) || 0) * (parseFloat(avgLifespan) || 0) * ((parseFloat(grossMarginPct) || 0) / 100);
  const cac = (parseFloat(newCustomers) || 1) > 0 ? (parseFloat(totalMarketingSpend) || 0) / (parseFloat(newCustomers) || 1) : 0;
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  const gmPct = parseFloat(grossMarginPct) || 0;

  const ccc = (parseFloat(inventoryDays) || 0) + (parseFloat(receivableDays) || 0) - (parseFloat(payableDays) || 0);

  const getRatioColor = (r: number) => r >= 3 ? "text-green-500" : r >= 1.5 ? "text-yellow-500" : "text-red-500";
  const getRatioLabel = (r: number) => r >= 3 ? "Healthy" : r >= 1.5 ? "Needs Improvement" : "Unsustainable";

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#022f42] mb-3">Module 2.3: Cash Dynamics & Unit Economics</h1>
        <p className="text-[#1e4a62] text-sm max-w-2xl leading-relaxed">Calculate your LTV:CAC logic and manage your Cash Conversion Cycle (CCC). A shorter CCC indicates a capital-efficient organization requiring less external funding to scale.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left Column - Core Unit Econ */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 shadow-sm border border-[#1e4a62]/10 border-t-4 border-t-[#022f42] space-y-5 rounded-sm">
              <h3 className="font-bold text-[#022f42] text-sm uppercase tracking-widest mb-4">LTV Pipeline</h3>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 block">Avg Revenue per Customer / Mo</label>
                <div className="flex border border-[#1e4a62]/10 focus-within:border-[#022f42]">
                  <span className="bg-[#f2f6fa] px-3 flex items-center font-bold text-[#1e4a62] border-r border-[#1e4a62]/10">$</span>
                  <input type="number" value={avgRevPerCustomer} onChange={e => setAvgRev(e.target.value)} className="w-full px-3 py-2 outline-none text-[#022f42] font-bold text-lg" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 block">Avg Customer Lifespan</label>
                <div className="flex border border-[#1e4a62]/10 focus-within:border-[#022f42]">
                  <input type="number" value={avgLifespan} onChange={e => setAvgLifespan(e.target.value)} className="w-full px-3 py-2 outline-none text-[#022f42] font-bold text-lg" />
                  <span className="bg-[#f2f6fa] px-3 flex items-center text-[10px] font-bold uppercase tracking-widest text-[#1e4a62] border-l border-[#1e4a62]/10">mo</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 block">Gross Margin</label>
                <div className="flex border border-[#1e4a62]/10 focus-within:border-[#022f42]">
                  <input type="number" value={grossMarginPct} onChange={e => setGrossMargin(e.target.value)} className="w-full px-3 py-2 outline-none text-[#022f42] font-bold text-lg" />
                  <span className="bg-[#f2f6fa] px-3 flex items-center font-bold text-[#1e4a62] border-l border-[#1e4a62]/10">%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm border border-[#1e4a62]/10 border-t-4 border-t-[#ffd800] space-y-5 rounded-sm">
              <h3 className="font-bold text-[#022f42] text-sm uppercase tracking-widest mb-4">CAC Pipeline</h3>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 block">Total Marketing Spend / Mo</label>
                <div className="flex border border-[#1e4a62]/10 focus-within:border-[#022f42]">
                  <span className="bg-[#f2f6fa] px-3 flex items-center font-bold text-[#1e4a62] border-r border-[#1e4a62]/10">$</span>
                  <input type="number" value={totalMarketingSpend} onChange={e => setMarketingSpend(e.target.value)} className="w-full px-3 py-2 outline-none text-[#022f42] font-bold text-lg" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-1.5 block">Customers Acquired</label>
                <div className="flex border border-[#1e4a62]/10 focus-within:border-[#022f42]">
                  <input type="number" value={newCustomers} onChange={e => setNewCustomers(e.target.value)} className="w-full px-3 py-2 outline-none text-[#022f42] font-bold text-lg" />
                  <span className="bg-[#f2f6fa] px-3 flex items-center text-[10px] font-bold uppercase tracking-widest text-[#1e4a62] border-l border-[#1e4a62]/10">users</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#022f42] p-4 text-center rounded-sm">
              <p className="text-[10px] text-[#b0d0e0] uppercase tracking-widest mb-1.5 font-bold">LTV</p>
              <p className="text-3xl font-black text-[#ffd800]">${Math.round(ltv).toLocaleString()}</p>
            </div>
            <div className="bg-[#022f42] p-4 text-center rounded-sm">
              <p className="text-[10px] text-[#b0d0e0] uppercase tracking-widest mb-1.5 font-bold">CAC</p>
              <p className="text-3xl font-black text-white">${Math.round(cac).toLocaleString()}</p>
            </div>
            <div className="bg-[#022f42] p-4 text-center rounded-sm">
              <p className="text-[10px] text-[#b0d0e0] uppercase tracking-widest mb-1.5 font-bold">LTV:CAC</p>
              <p className={`text-3xl font-black ${getRatioColor(ltvCacRatio)}`}>{ltvCacRatio.toFixed(1)}x</p>
            </div>
            <div className={`p-4 text-center rounded-sm ${gmPct >= 60 ? "bg-green-600" : gmPct >= 40 ? "bg-yellow-600" : "bg-red-600"}`}>
              <p className="text-[10px] text-white/80 uppercase tracking-widest mb-1.5 font-bold">Gross Margin</p>
              <p className="text-3xl font-black text-white">{gmPct}%</p>
            </div>
          </div>
        </div>

        {/* Right Column - CCC Academic Implementation */}
        <div className="lg:col-span-5 bg-white border-2 border-[#022f42] p-8 shadow-xl relative rounded-sm">
           <h3 className="text-lg font-bold text-[#022f42] mb-1 flex items-center">
             <Activity className="w-5 h-5 text-[#ffd800] mr-2" /> Cash Conversion Cycle
           </h3>
           <p className="text-xs text-[#1e4a62] mb-6 leading-relaxed">Adjust your operational terms below. A lower CCC means your cash is tied up for fewer days, vastly decreasing the amount of external capital required to scale.</p>
           
           <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] bg-[#f2f6fa] px-2 py-1 border border-[#1e4a62]/10">+ ICP (Inventory Conversion)</label>
                  <span className="font-bold text-[#022f42]">{inventoryDays} Days</span>
                </div>
                <input type="range" min="0" max="120" value={inventoryDays} onChange={e => setInventoryDays(e.target.value)} className="w-full accent-[#022f42]" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] bg-[#f2f6fa] px-2 py-1 border border-[#1e4a62]/10">+ RCP (Receivable Collection)</label>
                  <span className="font-bold text-[#022f42]">{receivableDays} Days</span>
                </div>
                <input type="range" min="0" max="120" value={receivableDays} onChange={e => setReceivableDays(e.target.value)} className="w-full accent-[#022f42]" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] bg-[#ffd800]/20 border border-[#ffd800]/50 px-2 py-1">- PDP (Payable Deferral)</label>
                  <span className="font-bold text-[#022f42]">{payableDays} Days</span>
                </div>
                <input type="range" min="0" max="120" value={payableDays} onChange={e => setPayableDays(e.target.value)} className="w-full accent-[#ffd800]" />
              </div>
           </div>

           <div className="mt-8 pt-6 border-t border-[#1e4a62]/10">
             <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#1e4a62] mb-1">Total Conversion Cycle</div>
                  <div className="text-sm font-medium text-[#1e4a62]/60">ICP + RCP - PDP</div>
                </div>
                <div className={`text-4xl font-black ${ccc <= 30 ? 'text-green-500' : ccc <= 60 ? 'text-[#ffd800] text-[#022f42]' : 'text-red-500'}`}>
                  {ccc} <span className="text-sm font-bold uppercase tracking-widest text-[#1e4a62]/60 ml-1">Days</span>
                </div>
             </div>
           </div>
        </div>

      </div>

      {ccc > 60 && (
         <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 flex items-start shadow-sm rounded-sm">
           <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0" />
           <div>
             <h4 className="text-xs font-bold uppercase tracking-widest text-red-900 mb-1">Warning: Dangerous Capital Drag</h4>
             <p className="text-xs text-red-800/80 leading-relaxed font-medium">Your Cash Conversion Cycle is <strong>{ccc} days</strong>. Your capital is trapped in operations for too long. To avoid relying on heavy VC dilution just to fund working capital, you must negotiate better terms with suppliers (push PDP up) or aggressively collect from customers (push RCP down).</p>
           </div>
         </motion.div>
      )}

      <div className="bg-white shadow-sm p-6 mb-8 border-l-4 border-[#022f42] rounded-sm">
        <h3 className="font-bold text-[#022f42] mb-3 flex items-center"><Target className="w-4 h-4 mr-2" /> Academic Framework: CCC Mastery</h3>
        <div className="space-y-3 text-sm text-[#1e4a62] leading-relaxed">
          <p><strong>Cash Conversion Cycle (CCC)</strong> is the metric investors use to see how fast you convert cash-out (expenses/inventory) back into cash-in (revenue). A massive startup scaling on a 90-day CCC will burn through VC capital infinitely faster than a startup with a 15-day CCC.</p>
          <p><em>The Math: Let suppliers finance your growth. Collect cash from customers before you have to pay the bills. If you can achieve a negative CCC, your customers are literally funding your expansion.</em></p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href="/dashboard/roadmap" className="inline-flex items-center px-8 py-4 bg-[#022f42] text-white font-bold uppercase tracking-widest text-sm hover:bg-[#ffd800] hover:text-[#022f42] transition-colors rounded-sm shadow-xl">
          Save Economics & Proceed <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
