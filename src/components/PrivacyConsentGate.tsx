"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, AlertTriangle, CheckCircle2, X, ChevronRight, Sparkles, Eye } from "lucide-react";
import Link from "next/link";

export type DataSensitivity = "non-sensitive" | "high-level" | "sensitive";

export interface PrivacyConsentConfig {
  /** Unique key stored in localStorage so consent is remembered per data type */
  consentKey: string;
  /** Sensitivity level drives the colour and icon */
  sensitivity: DataSensitivity;
  /** Short heading for the consent panel */
  title: string;
  /** AI-generated explanation of WHY this data is needed */
  aiExplanation: string;
  /** What FundabilityOS will do with the data */
  dataUsage: string;
  /** Where/how it is stored */
  storageNote: string;
  /** Optional list of specific data points being requested */
  dataPoints?: string[];
  /** If true the user can skip and still use the page without providing data */
  skippable?: boolean;
}

interface Props {
  config: PrivacyConsentConfig;
  /** Called when the user grants consent — render children after this */
  onConsent: () => void;
  /** Called if user skips (only shown when skippable = true) */
  onSkip?: () => void;
  children: React.ReactNode;
}

const sensitivityMeta: Record<DataSensitivity, { label: string; color: string; bg: string; border: string; icon: typeof Shield }> = {
  "non-sensitive": {
    label: "Non-Sensitive",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-300",
    icon: CheckCircle2,
  },
  "high-level": {
    label: "High-Level Metric",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    icon: Eye,
  },
  "sensitive": {
    label: "Sensitive Data",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-300",
    icon: AlertTriangle,
  },
};

export default function PrivacyConsentGate({ config, onConsent, onSkip, children }: Props) {
  const [consented, setConsented] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(`privacy_consent_${config.consentKey}`);
    if (stored === "true") {
      setConsented(true);
    } else {
      setConsented(false);
      setTimeout(() => setAnimateIn(true), 80);
    }
  }, [config.consentKey]);

  const handleConsent = () => {
    localStorage.setItem(`privacy_consent_${config.consentKey}`, "true");
    setConsented(true);
    onConsent();
  };

  const handleSkip = () => {
    setConsented(true); // hide the gate
    onSkip?.();
  };

  // Still loading consent state
  if (consented === null) return null;

  // Already consented — render children directly
  if (consented) return <>{children}</>;

  const meta = sensitivityMeta[config.sensitivity];
  const Icon = meta.icon;

  return (
    <div className="w-full">
      {/* Consent Gate Panel */}
      <div
        className={`transition-all duration-300 ${animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className={`border-2 ${meta.border} ${meta.bg} rounded-sm shadow-lg overflow-hidden`}>
          
          {/* Header bar */}
          <div className="bg-[#022f42] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#ffd800]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#ffd800]">
                Privacy Sensitivity Check
              </span>
            </div>
            {/* Sensitivity badge */}
            <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${meta.border} ${meta.bg} ${meta.color}`}>
              <Icon className="w-3 h-3" />
              {meta.label}
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Title */}
            <h3 className="text-lg font-black text-[#022f42]">{config.title}</h3>

            {/* AI Explanation */}
            <div className="flex items-start gap-3 bg-white border border-[#1e4a62]/10 p-4 rounded-sm">
              <Sparkles className="w-4 h-4 text-[#ffd800] shrink-0 mt-0.5" />
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-[#1e4a62] mb-1">
                  ✨ AI Assisted — Why We Need This
                </div>
                <p className="text-sm text-[#1e4a62] leading-relaxed">{config.aiExplanation}</p>
              </div>
            </div>

            {/* What data specifically */}
            {config.dataPoints && config.dataPoints.length > 0 && (
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-2">
                  Data Being Requested
                </div>
                <ul className="space-y-1">
                  {config.dataPoints.map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#1e4a62]">
                      <ChevronRight className="w-3.5 h-3.5 text-[#ffd800] shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Data usage + storage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white border border-[#1e4a62]/10 p-3 rounded-sm">
                <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-1">Used To</div>
                <p className="text-xs text-[#1e4a62] leading-relaxed">{config.dataUsage}</p>
              </div>
              <div className="bg-white border border-[#1e4a62]/10 p-3 rounded-sm">
                <div className="text-[9px] font-black uppercase tracking-widest text-[#022f42] mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> How It&apos;s Stored
                </div>
                <p className="text-xs text-[#1e4a62] leading-relaxed">{config.storageNote}</p>
              </div>
            </div>

            {/* Consent checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setChecked(!checked)}
                className={`w-5 h-5 shrink-0 border-2 rounded-sm flex items-center justify-center mt-0.5 transition-all cursor-pointer ${
                  checked ? "bg-[#022f42] border-[#022f42]" : "border-[#1e4a62]/30 group-hover:border-[#022f42]"
                }`}
              >
                {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-[#022f42] leading-relaxed">
                I understand what data is requested and why. I consent to FundabilityOS processing this information to generate my investor insights.{" "}
                <Link href="/privacy-promise" className="underline font-bold hover:text-[#1e4a62]" target="_blank">
                  Read our Privacy Promise
                </Link>
              </span>
            </label>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleConsent}
                disabled={!checked}
                className={`flex-1 py-3 px-6 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 rounded-sm transition-all ${
                  checked
                    ? "bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42]"
                    : "bg-[#f2f6fa] text-[#022f42]/30 border border-[#022f42]/10 cursor-not-allowed"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                I Consent — Proceed
              </button>
              {config.skippable && (
                <button
                  onClick={handleSkip}
                  className="flex-1 sm:flex-initial py-3 px-6 font-bold uppercase tracking-widest text-xs border-2 border-[#1e4a62]/20 text-[#1e4a62] hover:border-[#022f42] hover:text-[#022f42] rounded-sm transition-all"
                >
                  Skip for Now
                </button>
              )}
            </div>

            <p className="text-[10px] text-[#1e4a62] text-center">
              Your consent is remembered for this browser session. You can revoke it anytime from{" "}
              <Link href="/dashboard/settings" className="underline font-bold">Settings → Clear Session Data</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
