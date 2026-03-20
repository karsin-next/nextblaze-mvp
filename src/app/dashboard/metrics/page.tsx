"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, ReferenceLine, Legend
} from "recharts";
import { Download, DollarSign, Target, Zap, AlertTriangle, ShieldCheck, Sparkles, ArrowRight, Settings, BookOpen, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Generate month labels starting from a given month index (0=Jan)
function getMonthLabels(startMonthIndex: number, count: number): string[] {
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return Array.from({ length: count }, (_, i) => names[(startMonthIndex + i) % 12]);
}

export default function InvestorDashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user?.id && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`startup_profile_${user.id}`);
        if (saved) setProfile(JSON.parse(saved));
      } catch(e) {}
    }
  }, [user?.id]);

  // Pull real values from profile, default to 0
  const mrr = parseFloat(profile?.mrr || "0") || 0;
  const burnRate = parseFloat(profile?.burnRate || "0") || 0;
  const cac = parseFloat(profile?.cac || "0") || 0;
  const ltv = parseFloat(profile?.ltv || "0") || 0;
  const initialCash = parseFloat(profile?.initialCash || "0") || 0;

  // Derived metrics
  const netBurn = Math.max(burnRate - mrr, 0); // monthly cash consumed
  const runwayMonths = netBurn > 0 ? +(initialCash / netBurn).toFixed(1) : initialCash > 0 ? 99 : 0;
  const ltvCac = cac > 0 ? +(ltv / cac).toFixed(1) : 0;
  const hasData = mrr > 0 || burnRate > 0;

  // Timeline: start from March 2026 (current month) = index 2
  const TODAY_MONTH_IDX = 2; // March
  const TODAY_YEAR = 2026;
  const MONTHS = getMonthLabels(TODAY_MONTH_IDX, 13); // 13 months: Mar → Mar+12

  // Runway Burn Trajectory — starts from this month's initialCash, decreases by netBurn each month
  const runwayData = MONTHS.map((month, i) => {
    const balance = initialCash - netBurn * i;
    return { month, balance: Math.round(balance) };
  });

  // Expenses Over Revenue Map — each month shows MRR (flat) vs Burn
  const burnVsRevenueData = MONTHS.slice(0, 12).map((month) => ({
    month,
    revenue: mrr,
    expense: burnRate,
  }));

  // EBDAT Breakeven — project when cumulative revenue overtakes cumulative cost
  const ebdatData = MONTHS.slice(0, 12).map((month, i) => ({
    month,
    revenue: Math.round(mrr * (1 + i * 0.05)), // gentle 5% growth assumption
    totalCost: burnRate,
  }));
  const breakevenMonth = ebdatData.find(d => d.revenue >= d.totalCost);

  // Cash out date
  const cashOutMonths = runwayMonths < 99 ? Math.floor(runwayMonths) : null;
  const cashOutDate = cashOutMonths !== null
    ? getMonthLabels(TODAY_MONTH_IDX + cashOutMonths, 1)[0] + " " + (cashOutMonths >= (12 - TODAY_MONTH_IDX) ? TODAY_YEAR + 1 : TODAY_YEAR)
    : "Not applicable";

  const hasNoFinancialSetup = !profile || (mrr === 0 && burnRate === 0);

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 text-[#022f42]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-[rgba(2,47,66,0.12)] pb-6">
        <div>
          <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">Module 2.2</div>
          <h1 className="text-3xl font-bold text-[#022f42]">Investor Dashboard</h1>
          <p className="text-sm text-[#1e4a62] mt-1">
            All charts are calculated from your financial inputs in{" "}
            <Link href="/dashboard/settings" className="underline font-bold hover:text-[#022f42]">Company Settings</Link>.
            Timeline starts <strong>March 2026</strong> (current month) and projects forward 12 months.
          </p>
        </div>
        <Link href="/dashboard/financials" className="flex items-center gap-2 px-5 py-2.5 bg-[#022f42] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#ffd800] hover:text-[#022f42] transition-all rounded-sm">
          <Download className="w-3.5 h-3.5" /> Connect Financial Data
        </Link>
      </div>

      {/* No data warning */}
      {hasNoFinancialSetup && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-yellow-50 border border-yellow-200 border-l-4 border-l-yellow-500 p-5 rounded-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-1">No Financial Data Detected</div>
            <p className="text-xs text-yellow-800 leading-relaxed">
              Your MRR, Burn Rate, and other metrics are currently at zero. The charts below are based on <strong>RM 0</strong> inputs.
              Go to <Link href="/dashboard/settings" className="underline font-bold">Company Settings</Link> to enter your actual numbers — everything will update automatically.
            </p>
          </div>
        </motion.div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 border-l-4 border-l-[#022f42] shadow-sm rounded-sm">
          <div className="text-[#1e4a62] text-[10px] font-bold uppercase tracking-widest mb-1 flex justify-between">
            Monthly Revenue <DollarSign className="w-3.5 h-3.5 opacity-50" />
          </div>
          <div className="text-2xl font-black text-[#022f42] mt-2">
            {mrr > 0 ? `RM ${mrr.toLocaleString()}` : "RM 0"}
          </div>
          <p className="text-[10px] text-[#1e4a62] mt-1">{mrr === 0 ? "No revenue entered yet" : "From Company Settings"}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-5 border-l-4 border-l-red-400 shadow-sm rounded-sm">
          <div className="text-[#1e4a62] text-[10px] font-bold uppercase tracking-widest mb-1 flex justify-between">
            Monthly Burn <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-black text-[#022f42] mt-2">
            {burnRate > 0 ? `RM ${burnRate.toLocaleString()}` : "RM 0"}
          </div>
          <p className="text-[10px] text-[#1e4a62] mt-1">Net burn: RM {netBurn.toLocaleString()}/mo</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`p-5 border-l-4 shadow-xl rounded-sm ${runwayMonths < 6 ? "bg-red-600 border-l-red-300" : "bg-[#022f42] border-l-[#ffd800]"}`}>
          <div className="text-[#b0d0e0] text-[10px] font-bold uppercase tracking-widest mb-1">Runway Remaining</div>
          <div className="text-3xl font-black text-white mt-2 leading-none">
            {initialCash > 0 && netBurn === 0 ? "∞" : runwayMonths > 0 ? `${runwayMonths}` : "0"}
            <span className="text-sm ml-1 text-[#b0d0e0] font-medium lowercase">months</span>
          </div>
          <div className="mt-2 text-[10px] font-bold text-[#b0d0e0]">
            {cashOutMonths !== null && cashOutMonths > 0 ? `Cash out: ${cashOutDate}` : initialCash === 0 ? "Enter cash balance in Settings" : "Runway uncapped"}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-5 border-l-4 border-l-green-500 shadow-sm rounded-sm">
          <div className="text-[#1e4a62] text-[10px] font-bold uppercase tracking-widest mb-1 flex justify-between">
            LTV : CAC Ratio <Zap className="w-3.5 h-3.5 text-green-500" />
          </div>
          <div className={`text-2xl font-black mt-2 ${ltvCac >= 3 ? "text-green-600" : ltvCac > 0 ? "text-yellow-600" : "text-[#1e4a62]"}`}>
            {ltvCac > 0 ? `${ltvCac}x` : "—"}
          </div>
          <p className="text-[10px] text-[#1e4a62] mt-1">{ltvCac >= 3 ? "Healthy (target: >3x)" : ltvCac > 0 ? "Below target (aim for >3x)" : "Enter LTV & CAC in Settings"}</p>
        </motion.div>
      </div>

      {/* AI Explanation Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-6 bg-[#022f42] border-l-4 border-[#ffd800] p-5 flex items-start gap-3 rounded-sm shadow-md">
        <Sparkles className="w-5 h-5 text-[#ffd800] shrink-0 mt-0.5" />
        <div>
          <div className="text-[9px] font-black uppercase tracking-widest text-[#ffd800] mb-2">AI Assisted — How These Charts Work</div>
          <div className="text-xs text-[#b0d0e0] leading-relaxed space-y-2">
            <p><strong className="text-white">📅 Timeline:</strong> All charts start from <strong className="text-white">March 2026</strong> (current month) and project <strong className="text-white">12 months forward</strong> to February 2027. The x-axis shows months in sequence.</p>
            <p><strong className="text-white">🔥 Runway Burn Trajectory:</strong> Calculated as <code className="bg-white/10 px-1 rounded text-[#ffd800]">Cash Balance − (Net Burn × Month)</code>. Net Burn = Burn Rate − MRR. The red line at RM 0 is the danger threshold. When the curve crosses it, cash runs out.</p>
            <p><strong className="text-white">📊 Expenses Over Revenue Map:</strong> Shows your monthly Burn Rate vs MRR side by side. The gap between these two bars = your monthly cash consumption. To survive, the Revenue bar must eventually exceed the Expense bar.</p>
            <p><strong className="text-white">📈 EBDAT Breakeven:</strong> Projects when Revenue line crosses the Cost line. A 5% monthly revenue growth assumption is applied. Investors want to see this crossover within 18 months.</p>
          </div>
        </div>
      </motion.div>

      {/* EBDAT Chart */}
      <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="mb-8 border-2 border-[#022f42] bg-[#f2f6fa] p-1 shadow-md rounded-sm">
        <div className="bg-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 border-b border-[rgba(2,47,66,0.08)] pb-4 gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#022f42] flex items-center">
                <Target className="w-5 h-5 mr-2 text-[#ffd800]" />
                EBDAT Breakeven Projection
              </h2>
              <p className="text-xs text-[#1e4a62] mt-1 max-w-xl leading-relaxed">
                This chart projects when your <strong>Monthly Revenue</strong> will exceed your <strong>Total Operating Costs</strong>.
                A 5% monthly growth rate is applied to your current MRR as an optimistic base case.
              </p>
            </div>
            <div className="text-right shrink-0">
              {breakevenMonth ? (
                <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-sm">
                  <div className="text-[9px] font-black uppercase tracking-widest text-green-700">Projected Breakeven</div>
                  <div className="text-lg font-black text-green-600">{breakevenMonth.month}</div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-sm">
                  <div className="text-[9px] font-black uppercase tracking-widest text-red-700">Breakeven</div>
                  <div className="text-sm font-black text-red-500">{mrr === 0 && burnRate === 0 ? "No Data" : "Beyond 12 months"}</div>
                </div>
              )}
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ebdatData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(2,47,66,0.1)" />
                <XAxis dataKey="month" stroke="#1e4a62" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#1e4a62" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `RM ${(val/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: '2px', fontSize: '11px' }} formatter={(val: number) => [`RM ${val.toLocaleString()}`, ""]} />
                <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                {breakevenMonth && <ReferenceLine x={breakevenMonth.month} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'top', value: 'BREAKEVEN', fill: '#22c55e', fontSize: 9, fontWeight: 'bold' }} />}
                <Line type="monotone" name="Monthly Revenue" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" name="Monthly Costs" dataKey="totalCost" stroke="#022f42" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* AI Tips */}
          <div className="mt-4 bg-[#f2f6fa] p-4 rounded-sm border-l-4 border-[#ffd800]">
            <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-2 flex items-center"><BookOpen className="w-3 h-3 mr-1.5 text-[#ffd800]" /> What Investors Look For</div>
            <p className="text-xs text-[#1e4a62] leading-relaxed">Investors expect to see a clear breakeven trajectory within <strong>18 months at seed stage</strong>. If your revenue line is flat (MRR = 0), focus on your first paying customer before your next investor meeting. Even RM 1 of recurring revenue signals commercial viability.</p>
          </div>
        </div>
      </motion.div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Runway Burn Trajectory */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-white p-6 shadow-sm border border-[rgba(2,47,66,0.08)] flex flex-col rounded-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#022f42]">Runway Burn Trajectory</h3>
            <p className="text-xs text-[#1e4a62] mt-1 leading-relaxed">
              Starting from <strong>March 2026</strong> with your current cash balance of <strong>RM {initialCash.toLocaleString()}</strong>.
              Each month, your net burn of <strong>RM {netBurn.toLocaleString()}</strong> is deducted.
              The red line at RM 0 is when cash runs out.
            </p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={runwayData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#022f42" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#022f42" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(2,47,66,0.1)" />
                <XAxis dataKey="month" stroke="#1e4a62" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#1e4a62" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `RM ${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`RM ${v.toLocaleString()}`, "Balance"]} contentStyle={{ fontSize: '11px', borderRadius: '2px' }} />
                <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} label={{ value: "Cash Zero", position: "right", fill: "#ef4444", fontSize: 9 }} />
                <Area type="monotone" dataKey="balance" stroke="#ffd800" strokeWidth={3} fillOpacity={1} fill="url(#colorBal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 bg-[#f2f6fa] rounded-sm border-l-4 border-[#ffd800] text-xs text-[#1e4a62] leading-relaxed">
            <strong className="text-[#022f42]">Formula:</strong> Balance = Initial Cash − (Net Burn × Month). Net Burn = Burn Rate − MRR. Enter your cash balance in <Link href="/dashboard/settings" className="underline font-bold">Settings</Link> to activate this chart.
          </div>
        </motion.div>

        {/* Expenses Over Revenue */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="bg-white p-6 shadow-sm border border-[rgba(2,47,66,0.08)] flex flex-col rounded-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#022f42]">Expenses Over Revenue Map</h3>
            <p className="text-xs text-[#1e4a62] mt-1 leading-relaxed">
              Month-by-month comparison of your <strong>MRR (Revenue)</strong> vs <strong>Burn Rate (Expenses)</strong>.
              The blue bars represent your revenue; the red bars represent spending.
              The gap is your monthly cash consumption.
            </p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={burnVsRevenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(2,47,66,0.1)" />
                <XAxis dataKey="month" stroke="#1e4a62" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#1e4a62" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `RM ${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`RM ${v.toLocaleString()}`, ""]} contentStyle={{ fontSize: '11px', borderRadius: '2px' }} />
                <Legend wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                <Bar dataKey="revenue" name="Revenue (MRR)" fill="#022f42" radius={[2,2,0,0]} />
                <Bar dataKey="expense" name="Expenses (Burn)" fill="#ef4444" opacity={0.8} radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 bg-[#f2f6fa] rounded-sm border-l-4 border-[#ffd800] text-xs text-[#1e4a62] leading-relaxed">
            <strong className="text-[#022f42]">Target:</strong> Revenue bar should exceed the Expense bar. If both bars are equal height, you are breakeven. Update your MRR and Burn Rate in <Link href="/dashboard/settings" className="underline font-bold">Settings</Link> to see real data.
          </div>
        </motion.div>
      </div>

      {/* CTA Row */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white border border-[#1e4a62]/10 p-6 rounded-sm shadow-sm">
        <div className="text-[9px] font-black uppercase tracking-widest text-[#1e4a62] mb-4 flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#ffd800]" /> AI Assisted — Recommended Next Steps
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/settings" className="inline-flex items-center bg-[#022f42] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#ffd800] hover:text-[#022f42] transition-all rounded-sm">
            <Settings className="w-3.5 h-3.5 mr-2" /> Update Financial Settings
          </Link>
          <Link href="/dashboard/financials" className="inline-flex items-center bg-white border-2 border-[#022f42] text-[#022f42] px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#022f42] hover:text-white transition-all rounded-sm">
            <ArrowRight className="w-3.5 h-3.5 mr-2" /> Connect Real Financial Data
          </Link>
          <Link href="/dashboard/unit-economics" className="inline-flex items-center bg-white border-2 border-[#1e4a62]/20 text-[#1e4a62] px-5 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#022f42] hover:text-[#022f42] transition-all rounded-sm">
            <ArrowRight className="w-3.5 h-3.5 mr-2" /> Run Unit Economics Analysis
          </Link>
          <Link href="/dashboard/afn-calculator" className="inline-flex items-center bg-white border-2 border-[#1e4a62]/20 text-[#1e4a62] px-5 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#022f42] hover:text-[#022f42] transition-all rounded-sm">
            <ArrowRight className="w-3.5 h-3.5 mr-2" /> Calculate How Much to Raise (AFN)
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
