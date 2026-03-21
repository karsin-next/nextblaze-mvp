"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="3.2.4"
        title="The Ultimate Goal"
        description="Earn the Verified Badge by completing all core modules and consenting to profile visibility. This signals to investors that your startup has undergone rigorous self‑assessment."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Automatic badge assignment upon completion. Displayed on your profile and any shared materials. Link to publicly available profile of the startup.
        </p>
        <ComingSoon />
      </div>
    </div>
  );
}
