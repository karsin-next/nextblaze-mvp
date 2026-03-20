"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bug, Lightbulb, MessageSquare, Trash2, CheckCircle, Clock, Filter } from "lucide-react";

type FeedbackEntry = {
  id: number;
  type: "bug" | "feature";
  message: string;
  timestamp: string;
  status: "open" | "resolved";
};

export default function AdminTelemetryPage() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "bug" | "feature">("all");

  const loadEntries = () => {
    const data = JSON.parse(localStorage.getItem("feedback_submissions") || "[]");
    setEntries(data.reverse()); // newest first
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const toggleStatus = (id: number) => {
    const updated = entries.map(e =>
      e.id === id ? { ...e, status: e.status === "open" ? "resolved" : "open" } : e
    ) as FeedbackEntry[];
    setEntries(updated);
    localStorage.setItem("feedback_submissions", JSON.stringify([...updated].reverse()));
  };

  const deleteEntry = (id: number) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("feedback_submissions", JSON.stringify([...updated].reverse()));
  };

  const filtered = filter === "all" ? entries : entries.filter(e => e.type === filter);
  const bugCount = entries.filter(e => e.type === "bug").length;
  const featureCount = entries.filter(e => e.type === "feature").length;
  const openCount = entries.filter(e => e.status === "open").length;

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8">
      <div className="mb-8 border-b border-[#1e4a62]/10 pb-6">
        <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
          Admin Control
        </div>
        <h1 className="text-3xl font-black text-[#022f42] tracking-tight flex items-center">
          <MessageSquare className="w-6 h-6 mr-3 text-[#1e4a62]" />
          User Feedback & Telemetry
        </h1>
        <p className="text-[#1e4a62] text-sm mt-2">Live view of all user-submitted bug reports and feature requests from the &quot;YES, HOW CAN I HELP?&quot; bubble.</p>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 border border-[#1e4a62]/10 border-t-4 border-t-[#022f42] shadow-sm rounded-sm text-center">
          <div className="text-3xl font-black text-[#022f42]">{entries.length}</div>
          <div className="text-[10px] text-[#1e4a62] uppercase tracking-widest font-bold mt-1">Total Submissions</div>
        </div>
        <div className="bg-white p-5 border border-[#1e4a62]/10 border-t-4 border-t-red-500 shadow-sm rounded-sm text-center">
          <div className="text-3xl font-black text-red-500">{bugCount}</div>
          <div className="text-[10px] text-[#1e4a62] uppercase tracking-widest font-bold mt-1">Bug Reports</div>
        </div>
        <div className="bg-white p-5 border border-[#1e4a62]/10 border-t-4 border-t-blue-500 shadow-sm rounded-sm text-center">
          <div className="text-3xl font-black text-blue-500">{featureCount}</div>
          <div className="text-[10px] text-[#1e4a62] uppercase tracking-widest font-bold mt-1">Feature Requests</div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="w-4 h-4 text-[#1e4a62]" />
        {(["all", "bug", "feature"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-colors ${filter === f ? "bg-[#022f42] text-white border-[#022f42]" : "bg-white text-[#1e4a62] border-[#1e4a62]/20 hover:border-[#022f42]"}`}
          >
            {f === "all" ? "All" : f === "bug" ? "Bugs" : "Feature Requests"}
          </button>
        ))}
        <span className="ml-auto text-[10px] font-bold text-[#1e4a62] uppercase tracking-widest">
          {openCount} Open
        </span>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-24 text-center bg-white border border-[#1e4a62]/10 rounded-sm">
            <MessageSquare className="w-8 h-8 text-[#1e4a62]/30 mx-auto mb-3" />
            <p className="text-[#022f42] font-bold">No submissions yet.</p>
            <p className="text-[#1e4a62] text-sm mt-1">User feedback from the bubble will appear here in real-time.</p>
          </div>
        ) : filtered.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white border rounded-sm p-4 flex items-start gap-4 shadow-sm ${entry.status === "resolved" ? "opacity-60 border-[#1e4a62]/10" : "border-[#1e4a62]/15"}`}
          >
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${entry.type === "bug" ? "bg-red-50 border border-red-100" : "bg-blue-50 border border-blue-100"}`}>
              {entry.type === "bug" ? <Bug className="w-4 h-4 text-red-500" /> : <Lightbulb className="w-4 h-4 text-blue-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${entry.type === "bug" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                  {entry.type === "bug" ? "Bug Report" : "Feature Request"}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm ${entry.status === "open" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                  {entry.status}
                </span>
                <span className="text-[9px] text-[#1e4a62] ml-auto">
                  {new Date(entry.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-[#022f42] font-medium leading-relaxed">{entry.message}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleStatus(entry.id)} className="p-2 border rounded-sm text-[#1e4a62] hover:text-green-600 hover:border-green-300 transition-colors" title={entry.status === "open" ? "Mark Resolved" : "Reopen"}>
                {entry.status === "open" ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              </button>
              <button onClick={() => deleteEntry(entry.id)} className="p-2 border rounded-sm text-[#1e4a62] hover:text-red-600 hover:border-red-300 transition-colors" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
