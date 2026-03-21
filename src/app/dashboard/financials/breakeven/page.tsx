"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="2.1.2 EBDAT Breakeven"
        title="Survival Revenue Calculator"
        description="Determine the revenue needed to cover cash fixed costs and variable costs – the point where you stop burning cash."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: User inputs fixed operating costs, interest expenses, and variable cost percentage. System calculates EBDAT breakeven revenue and shows a chart (similar to academic Figure 4.2).
        </p>
        <ComingSoon module="2.1.2 EBDAT Breakeven" title="Survival Revenue Calculator" description="Determine the revenue needed to cover cash fixed costs and variable costs – the point where you stop burning cash." />
      </div>
    </div>
  );
}
