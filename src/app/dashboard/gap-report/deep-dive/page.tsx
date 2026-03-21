"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.3.2 Gap Deep Dive"
        title="Understand Each Gap"
        description="For each gap, see the specific answers that triggered it and why it matters to investors."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Expandable section showing original answers and investor‑centric commentary. Expandable cards showing original answers, investor rationale, and a “Why This Matters” button.
        </p>
        <ComingSoon module="1.3.2 Gap Deep Dive" title="Understand Each Gap" description="For each gap, see the specific answers that triggered it and why it matters to investors." />
      </div>
    </div>
  );
}
