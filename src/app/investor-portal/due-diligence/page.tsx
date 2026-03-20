"use client";

import { useState } from "react";
import { ShieldCheck, Upload, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const ddItems = [
  { name: "Articles of Incorporation", status: "received", notes: "Verified Delaware C-Corp" },
  { name: "Shareholder Agreement", status: "received", notes: "Standard terms, no unusual provisions" },
  { name: "Cap Table (Current)", status: "received", notes: "Clean structure, 20% ESOP pool" },
  { name: "Audited Financials (Latest FY)", status: "requested", notes: "Requested on March 15" },
  { name: "IP Assignment Agreements", status: "received", notes: "All IP assigned to company" },
  { name: "Key Customer Contracts", status: "pending", notes: "" },
  { name: "Employment Agreements (Founders)", status: "pending", notes: "" },
];

export default function DueDiligencePage() {
  const [items, setItems] = useState(ddItems);

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-[#022f42] mb-2">Module F: Digital Due Diligence Room</h1>
      <p className="text-[#1e4a62] mb-8">A secure space to request, share, and track additional due diligence documents with startups.</p>

      <div className="bg-white shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#022f42]">PayLater.my — DD Tracker</h3>
          <span className="text-xs font-bold uppercase tracking-widest bg-[#f2f6fa] text-[#1e4a62] px-3 py-1">{items.filter(i => i.status === "received").length}/{items.length} received</span>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className={`flex items-center justify-between p-4 border-l-4 transition-colors ${item.status === "received" ? "border-green-500 bg-green-50" : item.status === "requested" ? "border-yellow-500 bg-yellow-50" : "border-[rgba(2,47,66,0.12)] bg-[#f2f6fa]"}`}>
              <div className="flex items-center gap-3">
                {item.status === "received" ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" /> : <FileText className="w-5 h-5 text-[#1e4a62]/40 shrink-0" />}
                <div>
                  <p className="font-medium text-[#022f42]">{item.name}</p>
                  {item.notes && <p className="text-xs text-[#1e4a62] mt-0.5">{item.notes}</p>}
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${item.status === "received" ? "bg-green-200 text-green-800" : item.status === "requested" ? "bg-yellow-200 text-yellow-800" : "bg-gray-200 text-gray-600"}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link href="/investor-portal/execution" className="inline-flex items-center px-8 py-4 bg-[#022f42] text-white font-bold uppercase tracking-widest text-sm border-2 border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] transition-all">
        Deal Execution Hub <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}
