"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="2.5.1"
        title="Investor‑Ready Data Room Setup"
        description="Pre-built a well‑organised folder structure that matches investor due diligence expectations."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: User sees a visual folder tree (e.g., “Legal,” “Financial,” “IP,” etc.) and can create the folders in their own cloud storage (e.g., Google Drive) by clicking a button.
        </p>
        <ComingSoon />
      </div>
    </div>
  );
}
