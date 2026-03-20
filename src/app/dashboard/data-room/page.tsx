"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen, UploadCloud, CheckCircle2,
  FileText, ShieldCheck, BarChart3, Users, Download, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Target } from "lucide-react";
import PrivacyConsentGate from "@/components/PrivacyConsentGate";

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
  const [docs, setDocs] = useState<DocumentItem[]>(initialDocs);
  const [activeCategory, setActiveCategory] = useState("legal");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});

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

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
            Module 2.5
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#022f42] mb-2">Fundraising Data Room Builder</h1>
          <p className="text-[#1e4a62] text-sm max-w-2xl">
            A chaotic data room kills deals during due diligence. Use this checklist to securely organize the mandatory files institutional investors will request.
          </p>
        </div>
        
        {/* Progress Tracker */}
        <div className="bg-white p-4 border border-[rgba(2,47,66,0.15)] shadow-sm min-w-[250px] shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#022f42]">Diligence Readiness</span>
            <span className="text-sm font-black text-[#022f42]">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-[#f2f6fa] overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${progressPercent === 100 ? "bg-green-500" : "bg-[#ffd800]"}`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          {progressPercent === 100 && (
            <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> All required documents prepped.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Category Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const catDocs = docs.filter(d => d.category === cat.id);
            const catCompleted = catDocs.filter(d => d.status === "uploaded").length;
            
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left p-4 flex items-center justify-between transition-colors border-l-4 ${
                  isActive 
                    ? "bg-white border-[#022f42] shadow-sm" 
                    : "bg-[#f2f6fa] border-transparent text-[#1e4a62] hover:bg-white hover:border-[rgba(2,47,66,0.1)]"
                }`}
              >
                <div className="flex items-center">
                  <cat.icon className={`w-4 h-4 mr-3 ${isActive ? cat.color : "opacity-50"}`} />
                  <span className={`text-xs font-bold ${isActive ? "text-[#022f42]" : ""}`}>{cat.name}</span>
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catCompleted === catDocs.length ? "bg-green-100 text-green-700" : "bg-[rgba(2,47,66,0.1)] text-[#022f42]"}`}>
                  {catCompleted}/{catDocs.length}
                </div>
              </button>
            );
          })}

          <div className="mt-8 bg-[#022f42] p-6 text-white text-center shadow-lg relative overflow-hidden group border-2 border-[#022f42]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffd800] blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <FolderOpen className="w-8 h-8 text-[#ffd800] mx-auto mb-3" />
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Sync to Investor Portal</h3>
            <p className="text-[10px] text-[#b0d0e0] mb-4 leading-relaxed">
              Once 100% ready, sync this data room to generate trackable links for VCs in Week 4.
            </p>
            <button 
              disabled={progressPercent < 100}
              className={`w-full py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                progressPercent === 100 
                  ? "bg-[#ffd800] text-[#022f42] hover:bg-white" 
                  : "bg-[rgba(255,255,255,0.1)] text-white/50 cursor-not-allowed"
              }`}
            >
              Sync Room
            </button>
          </div>
        </div>

        {/* File Roster */}
        <div className="md:col-span-3">
          <PrivacyConsentGate
            config={{
              consentKey: "data_room_upload",
              sensitivity: "sensitive",
              title: "You're about to upload confidential company documents",
              aiExplanation:
                "The Data Room requires sensitive legal and financial documents that institutional investors will review during due diligence — incorporation certificates, cap tables, P&L statements, and founder agreements. FundabilityOS uses these files only to track which documents you have prepared. The actual file contents are never sent to or stored on our servers. Files exist in your browser only and are referenced by name.",
              dataUsage: "Track document readiness progress, calculate your Diligence Readiness %, and unlocking the Sync to Investor Portal feature when 100% complete.",
              storageNote: "File contents are never stored on our servers. Only the filename and upload status are tracked in this browser session. Closing the browser clears all file references.",
              dataPoints: [
                "Certificate of Incorporation — legal formation proof",
                "Current Cap Table — ownership breakdown",
                "Historical P&L — financial performance",
                "24-Month Projections — financial model",
                "Founder Agreements — vesting & IP assignment",
              ],
              skippable: true,
            }}
            onConsent={() => {}}
            onSkip={() => {}}
          >
          <div className="bg-white border border-[rgba(2,47,66,0.15)] shadow-sm">
            
            <div className="p-6 border-b border-[rgba(2,47,66,0.1)] bg-[#f2f6fa] flex items-center justify-between">
               <h2 className="text-lg font-bold text-[#022f42] flex items-center">
                 {categories.find(c => c.id === activeCategory)?.name} Documents
               </h2>
               <Link href="/dashboard/templates" className="text-[10px] flex items-center font-bold uppercase tracking-widest text-[#1e4a62] hover:text-[#022f42] bg-white px-3 py-1.5 border border-[rgba(2,47,66,0.1)] shadow-sm">
                 <Download className="w-3.5 h-3.5 mr-1.5" /> Missing a template?
               </Link>
            </div>

            <div className="divide-y divide-[rgba(2,47,66,0.08)]">
              {docs.filter(d => d.category === activeCategory).map(doc => (
                <div key={doc.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#f2f6fa]/50 transition-colors">
                  
                  <div className="flex items-start">
                    <div className="mt-1 mr-4">
                      {doc.status === "uploaded" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-[rgba(2,47,66,0.2)]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold text-sm ${doc.status === "uploaded" ? "text-green-700" : "text-[#022f42]"}`}>
                          {doc.name}
                        </h3>
                        {doc.required && <span className="text-[9px] font-bold uppercase tracking-widest bg-red-100 text-red-700 px-1.5 rounded-sm">Req</span>}
                      </div>
                      <p className="text-xs text-[#1e4a62]">{doc.desc}</p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
                    {doc.status === "uploaded" ? (
                       <button className="w-full md:w-auto px-6 py-2 border-2 border-[rgba(2,47,66,0.1)] text-[#022f42] font-bold uppercase tracking-widest text-[10px] hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all">
                         Remove File
                       </button>
                    ) : (
                       <>
                       {/* Hidden file input for real OS file picker */}
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
                         className="w-full md:w-auto px-6 py-2 border-2 border-dashed border-[#022f42] bg-white text-[#022f42] font-bold uppercase tracking-widest text-[10px] hover:bg-[#022f42] hover:text-white transition-all flex items-center justify-center min-w-[140px]"
                       >
                         {uploadingId === doc.id ? (
                           <div className="flex items-center"><div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div> Uploading</div>
                         ) : (
                           <><UploadCloud className="w-3.5 h-3.5 mr-2" /> Select File</>
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
        </div>

      </div>
    </div>
  );
}
