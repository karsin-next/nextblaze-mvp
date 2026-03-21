"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.1.5"
        title="TAM / SAM / SOM & VOS Indicator"
        description="Size your market opportunity using a structured framework. Investors use this to decide if the business can scale."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Feature 1: Guided calculator: user inputs total addressable market, serviceable market, and share. AI auto‑fills industry benchmarks. Outputs a “Market Potential Score” based on VOS Indicator™ criteria.
Feature 2: Interactive TAM/SAM/SOM calculator: user inputs total market size, target segment, and projected share. AI pulls industry benchmarks for comparison.
        </p>
        <ComingSoon />
      </div>
    </div>
  );
}
