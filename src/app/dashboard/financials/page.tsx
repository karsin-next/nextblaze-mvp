"use client";

import { motion } from "framer-motion";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { Download, ArrowUpRight, TrendingDown } from "lucide-react";

const burnData = [
  { month: "Jan", burn: 12000, revenue: 5000 },
  { month: "Feb", burn: 14000, revenue: 6500 },
  { month: "Mar", burn: 13500, revenue: 7200 },
  { month: "Apr", burn: 15000, revenue: 8500 },
  { month: "May", burn: 16000, revenue: 10000 },
  { month: "Jun", burn: 15000, revenue: 11000 },
];

export default function FinancialHealthDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Financial Health
          </h1>
          <p className="text-slate-400 mt-2">
            Automated tracking via connected accounts (Mock Data).
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm font-medium border border-slate-700">
          <Download className="w-4 h-4" />
          <span>Export P&L</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <div className="text-slate-400 text-sm font-medium mb-1">Monthly Recurring Revenue</div>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold">$11,000</span>
            <span className="flex items-center text-green-400 text-sm font-medium bg-green-400/10 px-2 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 10%
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <div className="text-slate-400 text-sm font-medium mb-1">Current Burn Rate</div>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold">$15,000</span>
            <span className="flex items-center text-red-400 text-sm font-medium bg-red-400/10 px-2 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-1" /> 7.1%
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border-blaze-500/20">
          <div className="text-slate-400 text-sm font-medium mb-1">Estimated Runway</div>
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blaze-300 to-white">
              6.5<span className="text-2xl ml-1 text-slate-300">mos</span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6 h-96 border border-slate-800">
          <h3 className="text-lg font-semibold mb-6">Burn vs Revenue Track</h3>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={burnData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="burn" stroke="#ef4444" fillOpacity={1} fill="url(#colorBurn)" strokeWidth={2} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6 h-96 border border-slate-800 flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Simplified P&L Analysis</h3>
          <div className="space-y-4 flex-grow">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Total Revenue (YTD)</span>
              <span className="font-medium">$55,200</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Total Expenses (YTD)</span>
              <span className="font-medium text-red-400">$85,500</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400 ml-4 line-relaxed">└ Payroll & Contractors</span>
              <span className="font-medium text-slate-300">$60,000</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400 ml-4">└ Software & Subscriptions</span>
              <span className="font-medium text-slate-300">$8,500</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-slate-200 font-semibold">Net Income</span>
              <span className="font-bold text-red-400">-$30,300</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
