"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.1.6 Product‑Market Fit & Traction"
        title="Painkiller vs. Vitamin Test"
        description="Determine whether your product is a “must‑have” (painkiller) or “nice‑to‑have” (vitamin). Investors prefer painkillers. Determine whether you have early tractions."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Feature 1: Short questionnaire about customer behavior (e.g., “Would they pay 2x? Can they switch easily?”). AI calculates a PMF score and labels you as painkiller/vitamin.
Feature 2: Multiple‑choice questions (e.g., “If we discontinued your product tomorrow, how upset would your users be?”). AI calculates add-on to the PMF score based on the 40% rule.
        </p>
        <ComingSoon module="1.1.6 Product‑Market Fit & Traction" title="Painkiller vs. Vitamin Test" description="Determine whether your product is a “must‑have” (painkiller) or “nice‑to‑have” (vitamin). Investors prefer painkillers. Determine whether you have early tractions." />
      </div>
    </div>
  );
}
