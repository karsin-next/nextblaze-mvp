"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.1.3 Competitor Analysis"
        title="SWOT & Moat Analyzer"
        description="Assess your competitive landscape and differentiate your unique value proposition. Investors want to know why you win."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Feature 1: Interactive SWOT quadrant: user drags factors into Strengths, Weaknesses, Opportunities, Threats. AI compares to industry benchmarks. Visual positioning map.
Feature 2: Interactive 2×2 grid (Price vs. Features). User places competitors and then drops their own company. AI highlights white space.
        </p>
        <ComingSoon module="1.1.3 Competitor Analysis" title="SWOT & Moat Analyzer" description="Assess your competitive landscape and differentiate your unique value proposition. Investors want to know why you win." />
      </div>
    </div>
  );
}
