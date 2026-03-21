"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="2.4.4 HOW: Cash Flow Projection"
        title="36‑Month Projector"
        description="Build a simple cash flow forecast to support the use of funds."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Editable spreadsheet‑like table with monthly revenue, expenses, and net cash flow. Auto‑calculates cumulative cash.Charts show cumulative cash and peak funding needed.
        </p>
        <ComingSoon module="2.4.4 HOW: Cash Flow Projection" title="36‑Month Projector" description="Build a simple cash flow forecast to support the use of funds." />
      </div>
    </div>
  );
}
