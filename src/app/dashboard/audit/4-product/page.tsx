"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.1.4"
        title="MVP & Adoption Readiness"
        description="Evaluate your product’s development stage, uniqueness, and readiness for customers. Investors assess risk through this lens."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Feature 1: Slider‑based: Concept → Prototype → Beta → Live with paying customers.. AI asks follow‑ups based on stage (e.g., if Beta, “How many beta users? What’s their NPS?”).
Feature 2: AI ask for existing website and check for product readiness by on research.
        </p>
        <ComingSoon />
      </div>
    </div>
  );
}
