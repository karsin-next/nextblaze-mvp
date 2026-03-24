"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface AcademyCTAProps {
  moduleName: string;
  sourceModule: string;
}

export function AcademyCTA({ moduleName, sourceModule }: AcademyCTAProps) {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="bg-[#022f42] text-white p-8 mt-12 rounded-sm text-center">
      <h3 className="!text-white text-2xl font-black mb-4">Ready to test your {moduleName}?</h3>
      <p className="text-[#b0d0e0] mb-6 font-medium">Log into FundabilityOS to run the dedicated diagnostic module for this framework.</p>
      <Link href="/login" className="bg-[#ffd800] text-black px-8 py-3 font-bold text-sm uppercase tracking-widest shadow-md hover:bg-[#fff09e] transition-colors inline-block rounded-sm">
        Launch Module {sourceModule}
      </Link>
    </div>
  );
}
