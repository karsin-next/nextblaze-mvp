"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="2.1.1"
        title="Scenario-Based Financial Simulator"
        description="Enter your 3 key revenue metrics -- monthly revenue, monthly burn, and current cash balance. This gives instant runway and burn visuals without sensitive data. Explore “what if” scenarios by adjusting revenue, burn, or cash assumptions."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Feature 1: Simple form: three numeric fields. After submission, the system calculates runway (cash / burn) and shows a chart. Data is used only for current session; no storage (or optional storage if user consents).
Feature 2: Interactive sliders for each of the three metrics. The runway and dashboard update in real time.
        </p>
        <ComingSoon />
      </div>
    </div>
  );
}
