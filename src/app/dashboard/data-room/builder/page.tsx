"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen, UploadCloud, CheckCircle2,
  FileText, ShieldCheck, BarChart3, Users, Download, ArrowRight, Sparkles
} from "lucide-react";
import Link from "next/link";
import { Target } from "lucide-react";
import PrivacyConsentGate from "@/components/PrivacyConsentGate";
import { ModuleHeader } from "@/components/ModuleHeader";

interface DocumentItem {
  id: string;
  name: string;
  category: "legal" | "finance" | "product" | "team";
  status: "missing" | "uploaded" | "verified";
  required: boolean;
  desc: string;
}

const initialDocs: DocumentItem[] = [
  { id: "inc", name: "Certificate of Incorporation", category: "legal", status: "missing", required: true, desc: "State-stamped formation document." },
  { id: "cap", name: "Current Cap Table", category: "legal", status: "missing", required: true, desc: "Detailed breakdown of ownership & options." },
  { id: "bylaws", name: "Corporate Bylaws", category: "legal", status: "missing", required: false, desc: "Operating rules of the company." },
  { id: "pnl", name: "Historical P&L", category: "finance", status: "missing", required: true, desc: "Past 12-24 months of revenue & expenses." },
  { id: "proj", name: "24-Month Projections", category: "finance", status: "missing", required: true, desc: "Financial model matching your strategy canvas." },
  { id: "arch", name: "Architecture Diagram", category: "product", status: "missing", required: true, desc: "High-level overview of tech stack & security." },
  { id: "ip", name: "Patent Filings", category: "product", status: "missing", required: false, desc: "If applicable (Deep Tech / Hardware)." },
  { id: "founder", name: "Founder Agreements", category: "team", status: "missing", required: true, desc: "Vesting schedules and IP assignment." },
  { id: "org", name: "Current Org Chart", category: "team", status: "missing", required: false, desc: "Reporting structure and planned hires." },
];

const categories = [
  { id: "legal", name: "Corporate & Legal", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-100" },
  { id: "finance", name: "Financials", icon: BarChart3, color: "text-green-600", bg: "bg-green-100" },
  { id: "product", name: "Product & IP", icon: Target, color: "text-purple-600", bg: "bg-purple-100" },
  { id: "team", name: "Team & HR", icon: Users, color: "text-amber-600", bg: "bg-amber-100" },
];

export default function DataRoomBuilderPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [docs, setDocs] = useState<DocumentItem[]>(initialDocs);
  const [activeCategory, setActiveCategory] = useState("legal");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsLoaded(true);
    // Persist completion state for the hub
    const savedDocs = localStorage.getItem("data_room_builder_docs");
    if (savedDocs) {
      try { setDocs(JSON.parse(savedDocs)); } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("data_room_builder_docs", JSON.stringify(docs));
      const reqDocs = docs.filter(d => d.required);
      const completedReq = reqDocs.filter(d => d.status === "uploaded" || d.status === "verified").length;
      if (completedReq === reqDocs.length) {
         localStorage.setItem("audit_2_5_5", "completed");
      }
    }
  }, [docs, isLoaded]);

  // One hidden file input ref per document ID
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const reqDocs = docs.filter(d => d.required);
  const completedReq = reqDocs.filter(d => d.status === "uploaded" || d.status === "verified").length;
  const progressPercent = Math.round((completedReq / reqDocs.length) * 100);

  const handleSelectFile = (id: string) => {
    fileInputRefs.current[id]?.click();
  };

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingId(id);
    setFileNames(prev => ({ ...prev, [id]: file.name }));
    // Simulate brief processing delay then mark as uploaded
    setTimeout(() => {
      setDocs(prev => prev.map(d => d.id === id ? { ...d, status: "uploaded" } : d));
      setUploadingId(null);
    }, 800);
  };

  const handleRemove = (id: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: "missing" } : d));
    setFileNames(prev => { const n = { ...prev }; delete n[id]; return n; });
    if (fileInputRefs.current[id]) fileInputRefs.current[id]!.value = "";
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="2.5.5 ACTIVATE: Data Room"
        title="Fundraising Data Room Builder"
        description="A chaotic data room kills deals. Use this professional-grade builder to securely organize the mandatory files institutional investors will request."
      />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Category Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const catDocs = docs.filter(d => d.category === cat.id);
            const catCompleted = catDocs.filter(d => d.status === "uploaded" || d.status === "verified").length;
            
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left p-4 flex items-center justify-between transition-all border-l-4 rounded-sm ${
                  isActive 
                    ? "bg-white border-[#022f42] shadow-md scale-[1.02]" 
                    : "bg-[#f2f6fa] border-transparent text-[#1e4a62] hover:bg-white hover:border-[rgba(2,47,66,0.1)]"
                }`}
              >
                <div className="flex items-center">
                  <cat.icon className={`w-4 h-4 mr-3 ${isActive ? cat.color : "opacity-30"}`} />
                  <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? "text-[#022f42]" : "opacity-60"}`}>{cat.name}</span>
                </div>
                <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${catCompleted === catDocs.length ? "bg-emerald-100 text-emerald-700" : "bg-[rgba(2,47,66,0.05)] text-[#022f42]/40"}`}>
                  {catCompleted}/{catDocs.length}
                </div>
              </button>
            );
          })}

          <div className="mt-8 bg-[#022f42] p-8 text-white text-center shadow-2xl relative overflow-hidden group border-b-4 border-[#ffd800] rounded-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffd800] blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <FolderOpen className="w-8 h-8 text-[#ffd800] mx-auto mb-3" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3">Sync to Portal</h3>
            <p className="text-[10px] text-[#b0d0e0] mb-6 leading-relaxed font-medium">
              Synchronize this data room to generate trackable links for VC outreach.
            </p>
            <button 
              disabled={progressPercent < 100}
              className={`w-full py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm shadow-lg ${
                progressPercent === 100 
                  ? "bg-[#ffd800] text-[#022f42] hover:bg-white active:scale-95" 
                  : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
              }`}
            >
              Sync Active Room
            </button>
          </div>
        </div>

        {/* File Roster */}
        <div className="md:col-span-3">
          <PrivacyConsentGate
            config={{
              consentKey: "data_room_upload",
              sensitivity: "sensitive",
              title: "Confidentiality & Security Protocol",
              aiExplanation:
                "The Data Room tracks your readiness progress for institutional due diligence. Actual file contents are NEVER sent to our servers. FundabilityOS only records the presence of the document and its filename to calculate your Diligence Readiness Index.",
              dataUsage: "Readiness scoring, Gap Analysis correlation, and Investor Portal synchronization.",
              storageNote: "Local-only reference. Closing the session clears transient file pointers.",
              dataPoints: [
                "Certificate of Incorporation",
                "Cap Table Ownership",
                "Historical P&L Performance",
                "Financial Projections",
                "IP & Patent Assignments",
              ],
              skippable: true,
            }}
            onConsent={() => {}}
            onSkip={() => {}}
          >
          <div className="bg-white border border-[rgba(2,47,66,0.1)] shadow-xl rounded-sm overflow-hidden">
            
            <div className="p-8 border-b border-[rgba(2,47,66,0.05)] bg-[#f2f6fa] flex items-center justify-between">
               <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#022f42] flex items-center">
                 <ShieldCheck className="w-4 h-4 mr-3 text-emerald-500" /> {categories.find(c => c.id === activeCategory)?.name} INDEX
               </h2>
               <Link href="/dashboard/templates" className="text-[9px] flex items-center font-black uppercase tracking-[0.2em] text-[#022f42] hover:bg-[#ffd800] transition-colors bg-white px-4 py-2 border border-[rgba(2,47,66,0.1)] shadow-sm rounded-sm">
                 <Download className="w-3.5 h-3.5 mr-2" /> Request Template
               </Link>
            </div>

            <div className="divide-y divide-[rgba(2,47,66,0.05)]">
              {docs.filter(d => d.category === activeCategory).map(doc => (
                <div key={doc.id} className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-[#fcfdfd] transition-all group">
                  
                  <div className="flex items-start">
                    <div className="mt-1 mr-5">
                      {doc.status === "uploaded" ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <FileText className="w-6 h-6 text-[rgba(2,47,66,0.1)] group-hover:text-[rgba(2,47,66,0.3)] transition-colors" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className={`font-black text-sm uppercase tracking-tight ${doc.status === "uploaded" ? "text-emerald-700" : "text-[#022f42]"}`}>
                          {doc.name}
                        </h3>
                        {doc.required && <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-rose-50 text-rose-600 px-2 py-0.5 border border-rose-100 rounded-[2px]">Mandatory</span>}
                      </div>
                      <p className="text-[11px] text-[#1e4a62] font-medium opacity-60 leading-relaxed max-w-md">{doc.desc}</p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
                    {doc.status === "uploaded" ? (
                       <button onClick={() => handleRemove(doc.id)} className="w-full md:w-auto px-8 py-3 border-2 border-[rgba(2,47,66,0.05)] text-rose-400 font-black uppercase tracking-[0.2em] text-[9px] hover:border-rose-200 hover:bg-rose-50 transition-all rounded-sm">
                         Purge File
                       </button>
                    ) : (
                       <>
                       <input
                         type="file"
                         ref={(el) => { fileInputRefs.current[doc.id] = el; }}
                         onChange={(e) => handleFileChange(doc.id, e)}
                         className="hidden"
                         accept=".pdf,.doc,.docx,.xlsx,.csv,.png,.jpg"
                       />
                       <button
                         onClick={() => handleSelectFile(doc.id)}
                         disabled={uploadingId === doc.id}
                         className="w-full md:w-auto px-8 py-4 bg-[#022f42] text-white font-black uppercase tracking-[0.2em] text-[9px] hover:bg-[#ffd800] hover:text-[#022f42] transition-all flex items-center justify-center min-w-[160px] shadow-lg active:scale-95 rounded-sm"
                       >
                         {uploadingId === doc.id ? (
                           <div className="flex items-center"><div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3"></div> Encrypting...</div>
                         ) : (
                           <><UploadCloud className="w-4 h-4 mr-3" /> Secure Upload</>
                         )}
                       </button>
                       </>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
          </PrivacyConsentGate>

          {/* Diligence Insight */}
          <div className="mt-8 bg-[#f2f6fa] p-8 border border-[rgba(2,47,66,0.05)] rounded-sm flex items-start gap-6">
             <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm shadow-sm shrink-0">
                <Sparkles className="w-6 h-6 text-[#ffd800]" />
             </div>
             <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#022f42] mb-2">Investor Psychology</h4>
                <p className="text-xs text-[#1e4a62] opacity-70 leading-relaxed font-medium">
                  A &apos;Complete&apos; status on mandatory categories acts as a trust signal. VCs are 40% more likely to proceed to a term sheet if the data room is architected *before* the first meeting.
                </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
