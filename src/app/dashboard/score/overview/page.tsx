"use client";

import { ModuleHeader } from "@/components/ModuleHeader";
import { ComingSoon } from "@/components/ComingSoon";

export default function Page() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.2.1"
        title="Your Fundability Score"
        description="A dynamic percentage score (0‑100%) summarising your overall investor‑readiness. The North Star metric."
      />
      <div className="bg-white border-[#ffd800] border-l-[4px] p-8 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)]">
        <h3 className="text-lg font-bold text-[#022f42] mb-4">Methodology Parameters</h3>
        <p className="text-sm text-[#1e4a62]/80 bg-[#1e4a62]/5 p-3 rounded-sm border border-[#1e4a62]/10 mb-6">
          [DEV] This module will implement: Feature 1: Dynamic score calculated from all diagnostic inputs. Score is calculated from all Week 1 answers, using a weighted formula derived from the VOS Indicator and other frameworks. Score is displayed with a gauge chart and colour coding. Updated in real time as you complete modules.
Feature 2: Link to 1.3.4 to generate report on Fundability Score.
        </p>
        <ComingSoon />
      </div>
    </div>
  );
}
