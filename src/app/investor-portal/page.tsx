"use client";

import { motion } from "framer-motion";
import { Lock, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../dashboard/layout";

export default function InvestorPortalPlaceholder() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-lg border border-slate-800 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-6 border border-slate-700">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">Investor Deal Flow Portal</h2>
          <div className="inline-block px-3 py-1 bg-blaze-500/10 text-blaze-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6 relative overflow-hidden">
            <span className="relative z-10">Phase 2 - Coming Soon</span>
            <div className="absolute inset-0 bg-blaze-500/20 w-8 h-full -skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
          </div>
          
          <p className="text-slate-400 mb-8">
            Access to our curated pipeline of AI-validated, investment-ready startups is currently in private beta. Join the waitlist to access smart matching, direct data rooms, and AI-powered deal summaries.
          </p>

          <form className="w-full mb-6">
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="investor@firm.com" 
                className="flex-grow bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blaze-500 transition-colors"
                disabled
              />
              <button disabled className="px-6 py-3 rounded-lg bg-slate-800 text-slate-400 cursor-not-allowed font-medium whitespace-nowrap">
                Join Waitlist
              </button>
            </div>
          </form>

          <Link href="/dashboard" className="text-blaze-400 hover:text-blaze-300 transition-colors text-sm font-medium">
            &larr; Return to Dashboard
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
