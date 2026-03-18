"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../dashboard/layout";

export default function EducationHubPlaceholder() {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-lg border border-slate-800 flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-6 border border-slate-700">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">Corporate Finance & Education Hub</h2>
          <div className="inline-block px-3 py-1 bg-blaze-500/10 text-blaze-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
            Phase 3 - Coming Soon
          </div>
          
          <p className="text-slate-400 mb-8">
            Master corporate finance and confidently navigate your fundraising journey. The full Learning Management System packed with video courses and master template library is currently in production.
          </p>

          <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700">
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
