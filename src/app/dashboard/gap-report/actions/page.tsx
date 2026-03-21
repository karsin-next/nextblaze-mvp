"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.3.3 Recommended Actions"
        title="Close the Gap Checklist"
        description="Concrete, actionable step‑by‑step tasks to close each gap, with links to relevant templates and next modules."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Feature 1: Each gap maps to a set of action items. Clicking “Add to My Plan” creates a task in the Workbench.
Feature 2: Each action is a clickable card that takes the user directly to the relevant sub‑module (e.g., “Connect your financials to see your runway”).
        </p>
        <ComingSoon module="1.3.3 Recommended Actions" title="Close the Gap Checklist" description="Concrete, actionable step‑by‑step tasks to close each gap, with links to relevant templates and next modules." />
      </div>
    </div>
  );
}
