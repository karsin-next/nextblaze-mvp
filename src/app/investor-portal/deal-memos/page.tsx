"use client";

import { FileText, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const memos = [
  {
    name: "PayLater.my", score: 88, mrr: 45000, burn: 32000, runway: 14, growth: 31,
    strengths: ["Strong MRR with 31% MoM growth", "LTV:CAC ratio of 4.2x", "Clean cap table, Delaware C-Corp"],
    weaknesses: ["High burn rate relative to current stage", "Team lacks CFO-level hire"],
    aiSummary: "PayLater.my demonstrates exceptional product-market fit with strong unit economics. The primary risk is burn rate management. Recommend further diligence on the path to profitability."
  },
  {
    name: "AgroSense AI", score: 82, mrr: 15000, burn: 12000, runway: 22, growth: 22,
    strengths: ["Capital-efficient operations", "Strong IP portfolio (3 patents)", "22% MoM growth"],
    weaknesses: ["Small total addressable market concern", "Single geography concentration"],
    aiSummary: "AgroSense AI shows strong capital efficiency and defensible IP. Market size questions should be explored during due diligence. Geographic expansion plan is key."
  },
  {
    name: "GridSolar Systems", score: 91, mrr: 120000, burn: 85000, runway: 18, growth: 15,
    strengths: ["$120k MRR at scale", "18-month runway", "Government contracts secured", "Verified Badge earned"],
    weaknesses: ["Growth decelerating (15% MoM)", "Heavy CAPEX requirements"],
    aiSummary: "GridSolar is the most mature deal in the pipeline. Revenue is proven but growth deceleration needs investigation. Strong fit for climate-focused funds."
  },
];

export default function DealMemosPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-[#022f42] mb-2">Module C: AI-Generated Deal Memos</h1>
      <p className="text-[#1e4a62] mb-8">Standardized, data-rich one-pagers for each startup. No polished pitch decks — just the data.</p>

      <div className="space-y-8 mb-8">
        {memos.map((m, i) => (
          <div key={i} className="bg-white shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] overflow-hidden">
            <div className="bg-[#022f42] p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{m.name}</h2>
                <div className="flex gap-6 mt-2 text-sm text-[#b0d0e0]">
                  <span>MRR: <strong className="text-white">${m.mrr.toLocaleString()}</strong></span>
                  <span>Burn: <strong className="text-white">${m.burn.toLocaleString()}</strong></span>
                  <span>Runway: <strong className="text-white">{m.runway}mo</strong></span>
                  <span>Growth: <strong className="text-green-400">{m.growth}%</strong></span>
                </div>
              </div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-xl ${m.score >= 80 ? "bg-green-500 text-white" : "bg-yellow-500 text-[#022f42]"}`}>
                {m.score}
              </div>
            </div>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-[#022f42] mb-3 flex items-center"><CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> Strengths</h4>
                <ul className="space-y-2">{m.strengths.map((s, j) => <li key={j} className="text-sm text-[#1e4a62] flex items-start"><span className="text-green-500 mr-2">+</span>{s}</li>)}</ul>
              </div>
              <div>
                <h4 className="font-bold text-[#022f42] mb-3 flex items-center"><AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" /> Risk Factors</h4>
                <ul className="space-y-2">{m.weaknesses.map((w, j) => <li key={j} className="text-sm text-[#1e4a62] flex items-start"><span className="text-yellow-500 mr-2">!</span>{w}</li>)}</ul>
              </div>
            </div>
            <div className="mx-6 mb-6 bg-[#f2f6fa] p-4 border-l-4 border-[#ffd800]">
              <p className="text-xs font-bold uppercase tracking-widest text-[#022f42] mb-1">AI Analysis</p>
              <p className="text-sm text-[#1e4a62]">{m.aiSummary}</p>
            </div>
          </div>
        ))}
      </div>

      <Link href="/investor-portal/data-room" className="inline-flex items-center px-8 py-4 bg-[#022f42] text-white font-bold uppercase tracking-widest text-sm border-2 border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] transition-all">
        Access Verified Data Room <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}
