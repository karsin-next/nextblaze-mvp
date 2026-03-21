"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.3.1"
        title="Top 3 Gaps Identifier"
        description="AI identifies the three biggest weaknesses holding back your score, with plain‑language explanations."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Feature 1: Based on diagnostic answers, AI extracts the lowest‑scoring areas and ranks them by impact.
Feature 2: Report displayed on screen, with each gap explained in plain language.
        </p>
        <ComingSoon />
      </div>
    </div>
  );
}
