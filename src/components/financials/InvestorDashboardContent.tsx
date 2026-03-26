"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, ReferenceLine, Legend
} from "recharts";
import { Target, Zap, TrendingDown, DollarSign, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DashboardConfig {
  showRunway: boolean;
  showGrowth: boolean;
  showBurn: boolean;
  showUnitEconomics: boolean;
  viewName?: string;
}

interface InvestorDashboardContentProps {
  config?: DashboardConfig;
}

// Generate month labels starting from a given month index (0=Jan)
function getMonthLabels(startMonthIndex: number, count: number): string[] {
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return Array.from({ length: count }, (_, i) => names[(startMonthIndex + i) % 12]);
}

export function InvestorDashboardContent({ config }: InvestorDashboardContentProps) {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (user?.id && typeof window !== "undefined") {
      try {
        // Priority 1: Financial Snapshot V2 (The new standard)
        const snapshot = localStorage.getItem("financial_snapshot_v2");
        // Priority 2: Startup Profile (The legacy fallback)
        const profile = localStorage.getItem(`startup_profile_${user.id}`);
        // Priority 3: Calculator Sub-modules 2.2.x
        const runwayAudit = localStorage.getItem("audit_2_2_1");
        const revenueAudit = localStorage.getItem("audit_2_2_2");
        const expenseAudit = localStorage.getItem("audit_2_2_3");

        let consolidated: any = {
          mrr: 0,
          burn: 0,
          cash: 0,
          cac: 0,
          ltv: 0,
          growth: 15,
          allocation: { payroll: 0, marketing: 0, rd: 0, ga: 0 }
        };

        if (snapshot) {
          const s = JSON.parse(snapshot);
          consolidated.mrr = s.metrics?.mrr || 0;
          consolidated.burn = s.metrics?.burn || 0;
          consolidated.cash = s.metrics?.cash || 0;
          consolidated.cac = s.metrics?.cac || 0;
          consolidated.ltv = s.metrics?.ltv || 0;
        } else if (profile) {
          const p = JSON.parse(profile);
          consolidated.mrr = parseFloat(p.mrr) || 0;
          consolidated.burn = parseFloat(p.burnRate) || 0;
          consolidated.cash = parseFloat(p.initialCash) || 0;
          consolidated.cac = parseFloat(p.cac) || 0;
          consolidated.ltv = parseFloat(p.ltv) || 0;
        }

        // Overlays for detailed growth/allocation if they exist in 2.2 sub-modules
        if (revenueAudit) {
           const rev = JSON.parse(revenueAudit).data;
           if (rev.growthRate) consolidated.growth = rev.growthRate;
        }
        if (expenseAudit) {
           const exp = JSON.parse(expenseAudit).data;
           consolidated.allocation = {
             payroll: exp.payroll || 0,
             marketing: exp.marketing || 0,
             rd: exp.rd || 0,
             ga: exp.ga || 0
           };
        }

        setData(consolidated);
      } catch(e) {
        console.error("Dashboard Data Extraction Error:", e);
      }
    }
    setIsLoaded(true);
  }, [user?.id]);

  if (!isLoaded || !data) return null;

  const { mrr, burn, cash, growth, allocation } = data;
  const netBurn = Math.max(burn - mrr, 0);
  const runwayMonths = netBurn > 0 ? +(cash / netBurn).toFixed(1) : cash > 0 ? 99 : 0;
  
  // Timeline setup
  const TODAY_MONTH_IDX = 2; // March 2026
  const MONTHS = getMonthLabels(TODAY_MONTH_IDX, 13);

  // EBDAT Data
  const ebdatData = MONTHS.slice(0, 12).map((month, i) => ({
    month,
    revenue: Math.round(mrr * Math.pow(1 + (growth/100), i)), // Exponential growth lookup
    totalCost: burn,
  }));
  const breakevenMonth = ebdatData.find(d => d.revenue >= d.totalCost);

  // Runway Data
  const runwayData = MONTHS.map((month, i) => ({
    month,
    balance: Math.max(0, cash - netBurn * i)
  }));

  // Expense Data
  const expenseMapData = MONTHS.slice(0, 12).map((month) => ({
    month,
    revenue: mrr,
    expense: burn,
  }));

  return (
    <div className="space-y-8">
      
      {/* KPI Overview Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border-l-4 border-l-[#022f42] shadow-sm rounded-sm">
          <div className="text-[#1e4a62] text-[10px] font-bold uppercase tracking-widest mb-1 flex justify-between">
            Monthly Revenue <DollarSign className="w-3.5 h-3.5 opacity-30" />
          </div>
          <div className="text-2xl font-black text-[#022f42] mt-2">RM {mrr.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 border-l-4 border-l-red-400 shadow-sm rounded-sm">
          <div className="text-[#1e4a62] text-[10px] font-bold uppercase tracking-widest mb-1 flex justify-between">
            Monthly Burn <TrendingDown className="w-3.5 h-3.5 text-red-400 opacity-50" />
          </div>
          <div className="text-2xl font-black text-[#022f42] mt-2">RM {burn.toLocaleString()}</div>
        </div>

        <div className={`p-5 border-l-4 shadow-sm rounded-sm ${runwayMonths < 6 ? "bg-red-600 border-l-red-300 text-white" : "bg-[#022f42] border-l-[#ffd800] text-white"}`}>
          <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${runwayMonths < 6 ? "text-red-100" : "text-[#b0d0e0]"}`}>Remaining Runway</div>
          <div className="text-3xl font-black mt-2 leading-none">
            {runwayMonths === 99 ? "∞" : runwayMonths}
            <span className="text-sm ml-1 opacity-60 font-medium lowercase">months</span>
          </div>
        </div>

        <div className="bg-white p-5 border-l-4 border-l-emerald-500 shadow-sm rounded-sm">
          <div className="text-[#1e4a62] text-[10px] font-bold uppercase tracking-widest mb-1">Growth Speed</div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{growth}% <span className="text-[10px] font-bold text-gray-400 uppercase ml-1">MoM</span></div>
        </div>
      </div>

      {/* Main EBDAT Chart (Always functional if Growh/Revenue present) */}
      {(config?.showGrowth ?? true) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border-2 border-[#022f42] bg-[#f2f6fa] p-1 shadow-md rounded-sm">
          <div className="bg-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 border-b border-[rgba(2,47,66,0.08)] pb-4 gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#022f42] flex items-center">
                  <Target className="w-5 h-5 mr-2 text-[#ffd800]" />
                  EBDAT Breakeven Projection
                </h2>
                <p className="text-xs text-[#1e4a62] mt-1 max-w-xl leading-relaxed">
                  Calculated using your current <strong>{growth}% MoM Growth</strong> target.
                </p>
              </div>
              <div className="text-right shrink-0">
                {breakevenMonth ? (
                  <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-sm">
                    <div className="text-[9px] font-black uppercase tracking-widest text-green-700">Projected Breakeven</div>
                    <div className="text-lg font-black text-green-600">{breakevenMonth.month} 2026/27</div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-sm">
                    <div className="text-[9px] font-black uppercase tracking-widest text-red-700">Breakeven</div>
                    <div className="text-sm font-black text-red-500">Beyond 12 Months</div>
                  </div>
                )}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ebdatData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(2,47,66,0.05)" />
                  <XAxis dataKey="month" stroke="#1e4a62" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#1e4a62" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `RM ${v/1000}k`} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '0px' }} formatter={(v: number) => `RM ${v.toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'black', paddingTop: '20px' }} />
                  <Line type="monotone" name="Revenue Plan" dataKey="revenue" stroke="#22c55e" strokeWidth={4} dot={{ r: 4, fill: '#22c55e' }} />
                  <Line type="monotone" name="OpEx Burn" dataKey="totalCost" stroke="#022f42" strokeWidth={4} dot={{ r: 4, fill: '#022f42' }} />
                  {breakevenMonth && <ReferenceLine x={breakevenMonth.month} stroke="#22c55e" strokeDasharray="5 5" />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* Secondary Row: Runway and Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Runway Trajectory */}
        {(config?.showRunway ?? true) && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 shadow-sm border border-[rgba(2,47,66,0.08)] flex flex-col rounded-sm">
            <h3 className="text-lg font-bold text-[#022f42] mb-1">Runway Burn Trajectory</h3>
            <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest">Cash Out Estimation</p>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={runwayData}>
                  <defs>
                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#022f42" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#022f42" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(2,47,66,0.05)" />
                  <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `RM ${v/1000}k`} />
                  <Tooltip formatter={(v: number) => `RM ${v.toLocaleString()}`} />
                  <Area type="stepAfter" dataKey="balance" stroke="#ffd800" strokeWidth={3} fill="url(#colorBal)" />
                  <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Expenses Map */}
        {(config?.showBurn ?? true) && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 shadow-sm border border-[rgba(2,47,66,0.08)] flex flex-col rounded-sm">
            <h3 className="text-lg font-bold text-[#022f42] mb-1">Expenses Over Revenue</h3>
            <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest">Burn Delta Visualization</p>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseMapData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(2,47,66,0.05)" />
                  <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `RM ${v/1000}k`} />
                  <Tooltip formatter={(v: number) => `RM ${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" name="Rev." fill="#022f42" radius={[2,2,0,0]} />
                  <Bar dataKey="expense" name="Spend" fill="#ef4444" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

      </div>

      {/* Unit Economics Section */}
      {(config?.showUnitEconomics ?? false) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#fcfdfd] border-2 border-[#022f42]/5 p-8 rounded-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-sm">
                 <Zap className="w-5 h-5" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-[#022f42]">Unit Economics & Efficiency</h3>
                 <p className="text-xs text-[#1e4a62]/60 font-medium italic">LTV : CAC Sensitivity Breakdown</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">LTV : CAC Ratio</div>
                 <div className={`text-4xl font-black ${(data.ltv / data.cac) >= 3 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                    {data.cac > 0 ? (data.ltv / data.cac).toFixed(1) : "0"}x
                 </div>
                 <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">Venture Target: &gt;3.0x</p>
              </div>
              <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Avg. LTV</div>
                 <div className="text-4xl font-black text-[#022f42]">RM {data.ltv.toLocaleString()}</div>
                 <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">Lifetime Revenue</p>
              </div>
              <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Avg. CAC</div>
                 <div className="text-4xl font-black text-[#022f42]">RM {data.cac.toLocaleString()}</div>
                 <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">Acquisition Cost</p>
              </div>
           </div>
        </motion.div>
      )}

      {/* AI Context Footer */}
      <div className="bg-[#022f42] p-5 rounded-sm flex items-start gap-4 border-l-4 border-[#ffd800]">
        <BookOpen className="w-5 h-5 text-[#ffd800] shrink-0 mt-1" />
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-[#ffd800] mb-2 text-white">Dynamic Reporting Context</h4>
          <p className="text-xs text-blue-100 leading-relaxed font-medium">
            These projections are synthesized from your <strong className="text-white">Module 2.1</strong> inputs and refined by <strong className="text-white">Module 2.2.1-2.2.3</strong> audit data. Change your growth rate or expense allocation in the respective modules to update these visualizations in real-time.
          </p>
        </div>
      </div>

    </div>
  );
}
