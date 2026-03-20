"use client";

import { FolderOpen, FileText, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const documents = [
  { name: "Financial Dashboard (Live)", type: "Dashboard", status: "verified", startup: "PayLater.my" },
  { name: "Cap Table - Current", type: "Spreadsheet", status: "verified", startup: "PayLater.my" },
  { name: "24-Month Financial Model", type: "Excel", status: "verified", startup: "PayLater.my" },
  { name: "Bank Statement Summary", type: "PDF", status: "verified", startup: "AgroSense AI" },
  { name: "IP Patent Filing", type: "PDF", status: "verified", startup: "AgroSense AI" },
  { name: "Revenue Growth Dashboard", type: "Dashboard", status: "pending", startup: "GridSolar Systems" },
  { name: "Corporate Articles of Association", type: "PDF", status: "verified", startup: "GridSolar Systems" },
];

export default function DataRoomPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-[#022f42] mb-2">Module D: Verified Data Room</h1>
      <p className="text-[#1e4a62] mb-8">Access the raw, validated financial data that startups used in their FundabilityOS process. No investor-specific projections — just verified truth.</p>

      <div className="space-y-3 mb-8">
        {documents.map((doc, i) => (
          <div key={i} className="bg-white p-5 shadow-[0_10px_20px_-8px_rgba(2,47,66,0.08)] border-l-4 border-[#022f42] hover:border-[#ffd800] transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-[#ffd800] shrink-0" />
              <div>
                <h4 className="font-bold text-[#022f42]">{doc.name}</h4>
                <p className="text-xs text-[#1e4a62]">{doc.startup} &middot; {doc.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${doc.status === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {doc.status === "verified" ? "✓ Verified" : "⏳ Pending"}
              </span>
              <button className="text-sm font-bold text-[#022f42] hover:text-[#ffd800] uppercase tracking-widest transition-colors">View</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] p-6 mb-8">
        <h3 className="font-bold text-[#022f42] mb-2 flex items-center"><Lock className="w-4 h-4 text-[#ffd800] mr-2" /> Data Verification Process</h3>
        <p className="text-sm text-[#1e4a62] leading-relaxed">All documents in the Verified Data Room have been cross-referenced against the startup&apos;s connected bank data and FundabilityOS diagnostic results. &quot;Verified&quot; status means the data has been algorithmically validated.</p>
      </div>

      <Link href="/investor-portal/messaging" className="inline-flex items-center px-8 py-4 bg-[#022f42] text-white font-bold uppercase tracking-widest text-sm border-2 border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] transition-all">
        Contact Founders <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}
