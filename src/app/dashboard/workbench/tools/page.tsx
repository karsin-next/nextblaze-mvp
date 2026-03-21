"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="3.1.2 Tool Library"
        title="Resources and Templates for Every Task"
        description="Access to all templates (cap table, financial model, pitch deck outline, etc.) referenced in the action plan."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Searchable library with filters by category. One‑click download (template file).
        </p>
        <ComingSoon module="3.1.2 Tool Library" title="Resources and Templates for Every Task" description="Access to all templates (cap table, financial model, pitch deck outline, etc.) referenced in the action plan." />
      </div>
    </div>
  );
}
