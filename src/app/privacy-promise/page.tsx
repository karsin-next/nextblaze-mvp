"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Trash2, Eye, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    icon: Shield,
    title: "Just Enough Data",
    desc: "We only collect what is strictly needed to deliver your next insight — nothing more. We never ask for bank credentials, tax returns, or legal documents upfront.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: Sparkles,
    title: "Just in Time Insights",
    desc: "Your data is processed in the moment to generate your Fundability Score, runway charts, and gap analysis. Sensitive data (CSVs, transactions) is never written to our database.",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  {
    icon: Lock,
    title: "Zero Sensitive Storage",
    desc: "Bank-level data, transaction details, uploaded files, and cap table information exist only in memory during your session. When you log out, they are gone — permanently.",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    icon: Eye,
    title: "You Are Always in Control",
    desc: "Delete your session data anytime with one click. Delete your entire account and all stored data with another. We will never sell, broker, or share your startup's information without explicit, per-investor consent.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
];

const stored = [
  "Your email address (to log you in)",
  "Your company name and industry sector",
  "Your startup's funding stage and region",
  "Module completion flags (e.g. 'Audit 1.1 completed')",
  "Manually entered high-level metrics (MRR, Burn Rate) — disclosed below",
  "Your dashboard preferences and saved searches",
];

const notStored = [
  "Bank account credentials or OAuth tokens",
  "Individual transaction records",
  "Uploaded CSV or spreadsheet contents",
  "Cap table data or term sheet documents",
  "Legal documents uploaded to the Data Room",
  "Investor communication content",
];

export default function PrivacyPromisePage() {
  return (
    <div className="bg-[#f2f6fa] min-h-screen text-[#022f42]">
      {/* Hero */}
      <div className="bg-[#022f42] text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ffd800] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ffd800]/10 border border-[#ffd800]/30 text-[#ffd800] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Lock className="w-3.5 h-3.5" /> Our Privacy Promise
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            Just enough data.<br />
            <span className="text-[#ffd800]">Just in time insights.</span><br />
            Zero sensitive storage.
          </h1>
          <p className="text-[#b0d0e0] text-lg leading-relaxed max-w-2xl mx-auto">
            FundabilityOS is built on a simple belief: you should not have to surrender your startup&apos;s most sensitive data to get investor-ready. We take only what we need, when we need it, and nothing more.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Four Pillars */}
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {pillars.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`bg-white border ${p.border} p-6 rounded-sm shadow-sm`}>
              <div className={`w-10 h-10 ${p.bg} ${p.color} rounded-sm flex items-center justify-center mb-4`}>
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#022f42] mb-2">{p.title}</h3>
              <p className="text-sm text-[#1e4a62] leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* What We Store vs Don't */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white border border-green-200 p-6 rounded-sm shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-green-700 mb-4 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> We Store (Minimal, Non-Sensitive)
            </div>
            <ul className="space-y-2">
              {stored.map((item, i) => (
                <li key={i} className="text-sm text-[#1e4a62] flex items-start gap-2">
                  <span className="text-green-500 font-bold shrink-0">✓</span> {item}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-[#1e4a62] mt-4 bg-green-50 p-2 rounded-sm border border-green-100">
              <strong>Disclosure:</strong> High-level metrics (MRR, Burn Rate, Cash Balance) are stored in your local browser storage only — not on our servers — to enable progress tracking between sessions. You can clear these at any time from Settings.
            </p>
          </div>

          <div className="bg-white border border-red-100 p-6 rounded-sm shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-red-700 mb-4 flex items-center">
              <Lock className="w-3.5 h-3.5 mr-1.5" /> We Never Store (Ephemeral Only)
            </div>
            <ul className="space-y-2">
              {notStored.map((item, i) => (
                <li key={i} className="text-sm text-[#1e4a62] flex items-start gap-2">
                  <span className="text-red-400 font-bold shrink-0">✕</span> {item}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-[#1e4a62] mt-4 bg-red-50 p-2 rounded-sm border border-red-100">
              All sensitive data is processed in memory only. When your session ends, it is permanently deleted. No exceptions.
            </p>
          </div>
        </div>

        {/* Verified Badge Policy */}
        <div className="bg-[#022f42] text-white p-8 rounded-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffd800] rounded-full blur-[80px] opacity-10"></div>
          <div className="relative z-10">
            <div className="text-[#ffd800] text-[10px] font-black uppercase tracking-widest mb-3">Verified Fundability Badge</div>
            <h3 className="text-xl font-black mb-3">The badge proves mastery — not data surrender.</h3>
            <p className="text-[#b0d0e0] text-sm leading-relaxed">
              Your Verified Badge is earned by completing our 8 audit modules and demonstrating that your startup fundamentals are investor-ready. It does not require uploading financial documents, sharing bank data, or storing sensitive information. The badge is a signal of preparation — not a data extraction mechanism.
            </p>
          </div>
        </div>

        {/* Phase 4 Disclosure */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-sm mb-12">
          <div className="text-[10px] font-black uppercase tracking-widest text-yellow-700 mb-2">Future Paid Features (Phase 4)</div>
          <p className="text-sm text-yellow-800 leading-relaxed">
            When Phase 4 launches (Investor Matching, Data Room), users who wish to be discoverable by investors may opt in to store additional information. This will be a <strong>separate, explicit, revocable opt-in</strong> with a clear explanation of exactly what is stored, why, and how to remove it at any time. No existing data will be automatically shared.
          </p>
        </div>

        {/* Delete controls */}
        <div className="bg-white border border-[#1e4a62]/10 p-6 rounded-sm shadow-sm mb-12">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-4 flex items-center">
            <Trash2 className="w-3.5 h-3.5 mr-1.5 text-red-500" /> Your Data Controls
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-[#1e4a62]/10 p-4 rounded-sm">
              <p className="text-sm font-bold text-[#022f42] mb-1">Clear session data</p>
              <p className="text-xs text-[#1e4a62] mb-3">Wipes all locally stored financial metrics from this browser immediately.</p>
              <Link href="/dashboard/settings" className="text-xs font-bold text-[#022f42] underline flex items-center">Go to Settings <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </div>
            <div className="border border-red-100 p-4 rounded-sm">
              <p className="text-sm font-bold text-red-700 mb-1">Delete my account</p>
              <p className="text-xs text-[#1e4a62] mb-3">Permanently removes your email, company profile, and all completion flags from our database. Irreversible.</p>
              <Link href="/dashboard/settings" className="text-xs font-bold text-red-600 underline flex items-center">Go to Settings <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-sm text-[#1e4a62]">Questions about your data? Email us at <strong>privacy@nextblaze.asia</strong></p>
          <Link href="/dashboard" className="inline-flex items-center mt-4 bg-[#022f42] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#ffd800] hover:text-[#022f42] transition-all rounded-sm">
            Back to Dashboard <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>
        </div>

      </div>
    </div>
  );
}
