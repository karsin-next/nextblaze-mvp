"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.1.2 Customer Persona"
        title="Who Exactly? Persona Builder"
        description="Define your ideal customer segments, their buying triggers, and how to reach them. This builds the “customer” part of your pitch and validates go‑to‑market fit."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Feature 1: Drag‑and‑drop persona creation: demographics, psychographics, channel preferences, buying triggers. 
Feature 2: Auto‑generates a “customer journey map” based on inputs. AI suggests look-alike customer profiles from research.
        </p>
        <ComingSoon module="1.1.2 Customer Persona" title="Who Exactly? Persona Builder" description="Define your ideal customer segments, their buying triggers, and how to reach them. This builds the “customer” part of your pitch and validates go‑to‑market fit." />
      </div>
    </div>
  );
}
