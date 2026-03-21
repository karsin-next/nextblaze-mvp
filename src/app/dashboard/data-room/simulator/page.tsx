"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="2.5.3 Investor Access Simulator"
        title="Simulate and Share when Ready"
        description="Practice giving access to a data room without actually storing sensitive docs"
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: User clicks “Simulate Investor Access” and sees a mock view of what an investor would see. No real data is shared.
        </p>
        <ComingSoon module="2.5.3 Investor Access Simulator" title="Simulate and Share when Ready" description="Practice giving access to a data room without actually storing sensitive docs" />
      </div>
    </div>
  );
}
