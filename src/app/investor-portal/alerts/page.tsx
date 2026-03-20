"use client";

import { useState } from "react";
import { Bell, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    { label: "New startup scores above my threshold", enabled: true },
    { label: "Startup in my target industry goes visible", enabled: true },
    { label: "Weekly deal flow digest summary", enabled: false },
    { label: "Startup I bookmarked updates their metrics", enabled: true },
  ]);

  const toggle = (i: number) => {
    setAlerts(prev => prev.map((a, j) => j === i ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-[#022f42] mb-2">Module B: Automated Deal Alerts</h1>
      <p className="text-[#1e4a62] mb-8">Save your criteria and receive instant notifications when matching startups complete the FundabilityOS process.</p>

      <div className="bg-white shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] p-8 mb-8">
        <h3 className="text-lg font-bold text-[#022f42] mb-4 flex items-center"><Bell className="w-5 h-5 text-[#ffd800] mr-3" /> Alert Preferences</h3>
        <div className="space-y-4">
          {alerts.map((alert, i) => (
            <div key={i} onClick={() => toggle(i)} className={`flex items-center justify-between p-4 cursor-pointer transition-all border-l-4 ${alert.enabled ? "border-green-500 bg-green-50" : "border-[rgba(2,47,66,0.12)] bg-[#f2f6fa]"}`}>
              <span className={`font-medium ${alert.enabled ? "text-[#022f42]" : "text-[#1e4a62]"}`}>{alert.label}</span>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${alert.enabled ? "bg-green-500" : "bg-gray-300"}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${alert.enabled ? "left-6" : "left-0.5"}`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] p-6 mb-8">
        <h3 className="font-bold text-[#022f42] mb-2">📚 How Deal Alerts Work</h3>
        <p className="text-sm text-[#1e4a62] leading-relaxed">When a startup completes the FundabilityOS process and toggles their profile to &quot;Visible,&quot; our system checks their data against your saved criteria. If there is a match, you receive an immediate notification with a link to their AI-Generated Deal Memo.</p>
      </div>

      <Link href="/investor-portal/deal-memos" className="inline-flex items-center px-8 py-4 bg-[#022f42] text-white font-bold uppercase tracking-widest text-sm border-2 border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] transition-all">
        View Deal Memos <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}
