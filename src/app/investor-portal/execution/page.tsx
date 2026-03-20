"use client";

import { Rocket, FileText, ShieldCheck } from "lucide-react";

export default function ExecutionPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-[#022f42] mb-2">Module G: Deal Execution Hub</h1>
      <p className="text-[#1e4a62] mb-8">Tools to co-create term sheets, manage allocations, and close rounds directly on the platform.</p>

      <div className="bg-white shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] p-8 mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#f2f6fa] border-4 border-[#ffd800] mb-6">
          <Rocket className="w-10 h-10 text-[#022f42]" />
        </div>
        <div className="inline-block px-4 py-1.5 bg-[#022f42] text-[#ffd800] text-xs font-bold uppercase tracking-widest mb-6">
          Coming Soon — Phase 3
        </div>
        <h2 className="text-2xl font-bold text-[#022f42] mb-4">The final piece of the puzzle</h2>
        <p className="text-[#1e4a62] max-w-2xl mx-auto leading-relaxed mb-8">
          The Deal Execution Hub will enable investors and founders to co-create and e-sign term sheets, manage allocation processes, and close funding rounds — all within a single, trusted ecosystem.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] border-l-4 border-[#022f42]">
          <FileText className="w-8 h-8 text-[#ffd800] mb-3" />
          <h4 className="font-bold text-[#022f42] mb-2">SAFE Note Generator</h4>
          <p className="text-sm text-[#1e4a62]">Auto-generate YC-standard SAFE notes with customizable valuation caps and discount rates.</p>
        </div>
        <div className="bg-white p-6 shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] border-l-4 border-[#022f42]">
          <ShieldCheck className="w-8 h-8 text-[#ffd800] mb-3" />
          <h4 className="font-bold text-[#022f42] mb-2">E-Signature Integration</h4>
          <p className="text-sm text-[#1e4a62]">Digitally sign term sheets and closing documents with legal-grade electronic signatures.</p>
        </div>
        <div className="bg-white p-6 shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] border-l-4 border-[#022f42]">
          <Rocket className="w-8 h-8 text-[#ffd800] mb-3" />
          <h4 className="font-bold text-[#022f42] mb-2">Allocation Manager</h4>
          <p className="text-sm text-[#1e4a62]">Manage syndicate allocations, co-investor commitments, and round closing logistics.</p>
        </div>
      </div>

      <div className="bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] p-6">
        <h3 className="font-bold text-[#022f42] mb-2">📚 Educational Guide: Closing Your First Deal</h3>
        <p className="text-sm text-[#1e4a62] leading-relaxed">Understanding the legal mechanics of closing a funding round is critical. Key concepts include: SAFE vs Priced Round, Pro-rata rights, Information rights, Board seat allocation, and Anti-dilution provisions. Full course materials will be available when this module launches.</p>
      </div>
    </div>
  );
}
