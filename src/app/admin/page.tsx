"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, ChevronRight, ShieldCheck, Download, AlertCircle, Trash2, Edit, Activity, Users, Database, X, Save, LineChart, Building } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

// Constant Arrays for Editor Overrides
const SECTORS = [
  "B2B SaaS / Enterprise", "Fintech", "Deep Tech / AI", "HealthTech / MedTech", 
  "EdTech", "E-Commerce / D2C", "Marketplace / Network", "CleanTech / Climate", 
  "Logistics / Supply Chain", "PropTech / Real Estate", "Hardware / IoT", 
  "Cybersecurity", "Consumer Social", "Web3 / Crypto", "Mobility / Auto", "Other"
];

const STAGES = ["Pre-Seed", "Seed", "Series A", "Series B+"];

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'startups';
  const crmMode = currentView as "startups" | "investors";

  const [startups, setStartups] = useState<any[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  
  // Editorial State Hook
  const [editEntity, setEditEntity] = useState<any>(null);

  const loadData = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) return;
      const data = await res.json();
      
      let usersList: any[] = [];
      let investorsList: any[] = [];

      // Map Server Startups & merge local overrides
      data.startups.forEach((row: any) => {
        let localName = row.company;
        let localSector = "Uncategorized";
        let localScore = row.fundability_score || 0;
        let localStage = "Active Pipeline";

        if (typeof window !== 'undefined') {
           try {
             const profile = JSON.parse(localStorage.getItem(`startup_profile_${row.id}`) || "{}");
             if (profile.companyName) localName = profile.companyName;
             if (profile.industry) localSector = profile.industry;

             const score = JSON.parse(localStorage.getItem(`fundability_score_${row.id}`) || "{}");
             if (score.overall) localScore = score.overall;
           } catch(e) {}
        }
        
        usersList.push({
          id: row.id.toString(),
          name: localName,
          sector: localSector,
          score: localScore,
          status: localScore >= 80 ? "Verified Pipeline" : localScore > 0 ? "Diagnostic Active" : "Onboarding",
          founder: "Founder Data",
          registration: new Date(row.created_at).toLocaleDateString(),
          email: row.email
        });
      });

      // Map Server Investors
      data.investors.forEach((row: any) => {
        let localName = row.company;
        let localStage = "Seed";
        let localType = "Angel Syndicate";

        if (typeof window !== 'undefined') {
           try {
             const profile = JSON.parse(localStorage.getItem(`investor_profile_${row.id}`) || "{}");
             if (profile.firmName) localName = profile.firmName;
             if (profile.targetStage) localStage = profile.targetStage;
             if (profile.investorType) localType = profile.investorType;
           } catch(e) {}
        }

        investorsList.push({
          id: row.id.toString(),
          name: localName,
          type: localType,
          stage: localStage,
          registration: new Date(row.created_at).toLocaleDateString(),
          email: row.email
        });
      });

      setStartups(usersList);
      setInvestors(investorsList);
    } catch (e) {
      console.error("Critical Failure fetching Admin nodes");
    }
  };

  useEffect(() => {
    loadData();
  }, [crmMode]);

  const deleteEntity = async (id: string, name: string, type: "startup" | "investor") => {
    if (window.confirm(`CRITICAL WARNING: Are you sure you want to permanently purge all data for ${name}?`)) {
       try {
         const res = await fetch('/api/admin/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(id) })
         });
         
         const result = await res.json();
         
         if (!res.ok) {
           alert(`Deletion failed: ${result.error || 'Unknown server error'}`);
           return;
         }

         // Purge client-side localStorage keys for this user
         if (typeof window !== 'undefined') {
           const keysToPurge = Object.keys(localStorage).filter(k => {
              if (type === "startup") return k.endsWith(`_${id}`) || k.includes(id);
              if (type === "investor") return k.includes(`investor_profile_${id}`);
              return false;
           });
           keysToPurge.forEach(k => localStorage.removeItem(k));
         }

         loadData();
       } catch(e: any) {
         alert(`Network error during deletion: ${e.message}`);
         console.error("[ADMIN] Delete failed:", e);
       }
    }
  };

  const saveEdit = () => {
    if (!editEntity) return;
    
    if (crmMode === "startups") {
       const profileKey = `startup_profile_${editEntity.id}`;
       let existingProfile = {};
       try { existingProfile = JSON.parse(localStorage.getItem(profileKey) || "{}"); } catch(e) {}
       if (typeof existingProfile !== 'object' || existingProfile === null) existingProfile = {};
       
       (existingProfile as any).companyName = editEntity.name;
       (existingProfile as any).industry = editEntity.sector;
       localStorage.setItem(profileKey, JSON.stringify(existingProfile));

       const scoreKey = `fundability_score_${editEntity.id}`;
       let existingScore = {};
       try { existingScore = JSON.parse(localStorage.getItem(scoreKey) || "{}"); } catch(e) {}
       if (typeof existingScore !== 'object' || existingScore === null) existingScore = {};

       (existingScore as any).overall = parseInt(editEntity.score);
       localStorage.setItem(scoreKey, JSON.stringify(existingScore));
    } else {
       const profileKey = `investor_profile_${editEntity.id}`;
       let existingProfile = {};
       try { existingProfile = JSON.parse(localStorage.getItem(profileKey) || "{}"); } catch(e) {}
       // Bulletproof TypeError block
       if (typeof existingProfile !== 'object' || existingProfile === null) existingProfile = {};
       
       (existingProfile as any).firmName = editEntity.name;
       (existingProfile as any).targetStage = editEntity.stage;
       localStorage.setItem(profileKey, JSON.stringify(existingProfile));
    }

    setEditEntity(null);
    loadData();
  };

  const totalRegisters = startups.length;
  const activeDiagnostics = startups.filter(s => s.score > 0).length;
  const verifiedPipeline = startups.filter(s => s.score >= 80).length;

  return (
    <div className="max-w-7xl mx-auto w-full relative">
      
      {/* Editorial Modal */}
      <AnimatePresence>
        {editEntity && (
          <div className="fixed inset-0 z-[100] bg-[#022f42]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-sm w-full max-w-md shadow-2xl overflow-hidden border border-[#1e4a62]/20">
               <div className="bg-[#022f42] p-4 flex justify-between items-center text-white border-b border-white/10">
                 <div className="text-[10px] uppercase font-black tracking-widest text-[#ffd800] flex items-center">
                   <Edit className="w-4 h-4 mr-2" /> Database Override
                 </div>
                 <button onClick={() => setEditEntity(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5"/></button>
               </div>
               
               <div className="p-6 space-y-4">
                 <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block mb-1">Entity / Firm Name</label>
                   <input type="text" value={editEntity.name} onChange={e => setEditEntity({...editEntity, name: e.target.value})} className="w-full p-3 bg-[#f2f6fa] border border-[#1e4a62]/20 outline-none font-bold text-sm text-[#022f42] rounded-sm" />
                 </div>
                 
                 {crmMode === "startups" ? (
                   <>
                     <div>
                       <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block mb-1">Sector Assignment</label>
                       <select value={editEntity.sector} onChange={e => setEditEntity({...editEntity, sector: e.target.value})} className="w-full p-3 bg-[#f2f6fa] border border-[#1e4a62]/20 outline-none font-bold text-sm text-[#022f42] rounded-sm appearance-none">
                          {SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                       </select>
                     </div>
                     <div>
                       <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block mb-1 flex justify-between">
                         <span>Fundability Score</span>
                         <span className="text-red-500 font-black">MANUAL OVERRIDE</span>
                       </label>
                       <input type="number" max="100" min="0" value={editEntity.score} onChange={e => setEditEntity({...editEntity, score: e.target.value})} className="w-full p-3 bg-red-50 border border-red-200 outline-none font-black text-xl text-red-700 rounded-sm" />
                     </div>
                   </>
                 ) : (
                   <div>
                       <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block mb-1">Target Stage Mapping</label>
                       <select value={editEntity.stage} onChange={e => setEditEntity({...editEntity, stage: e.target.value})} className="w-full p-3 bg-[#f2f6fa] border border-[#1e4a62]/20 outline-none font-bold text-sm text-[#022f42] rounded-sm appearance-none">
                         {STAGES.map(stg => <option key={stg} value={stg}>{stg}</option>)}
                       </select>
                   </div>
                 )}
                 <button onClick={saveEdit} className="w-full mt-4 p-4 bg-[#022f42] text-white font-black uppercase tracking-widest text-[10px] rounded-sm flex justify-center items-center hover:bg-[#ffd800] hover:text-[#022f42] transition-colors cursor-pointer border-2 border-[#022f42]">
                   <Save className="w-4 h-4 mr-2" /> Save 
                 </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col lg:flex-row justify-between lg:items-end border-b border-[#1e4a62]/10 pb-6 gap-6">
        <div>
          <h1 className="text-3xl font-black mb-2 text-[#022f42] tracking-tight flex items-center">
            {crmMode === "startups" ? <Activity className="w-6 h-6 mr-3 text-[#1e4a62]" /> : <Building className="w-6 h-6 mr-3 text-[#1e4a62]" />}
            {crmMode === "startups" ? "Startups Master Database" : "Investor Master Database"}
          </h1>
          <p className="text-[#1e4a62] text-sm max-w-2xl">This administrative portal parses all decentralized data objects across the current physical iteration of FundabilityOS.</p>
        </div>
      </div>

      {/* Admin Conversion Funnel (Only visible for Startups) */}
      {crmMode === "startups" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 border border-[#1e4a62]/10 border-t-4 border-t-[#022f42] shadow-sm rounded-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#1e4a62]">Total Registered</div>
                <Users className="w-4 h-4 text-[#1e4a62]/40" />
              </div>
              <div className="text-3xl font-black text-[#022f42]">{totalRegisters}</div>
           </motion.div>
           
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#f2f6fa] p-5 border border-[#1e4a62]/10 border-t-4 border-t-[#1e4a62] shadow-sm rounded-sm">
              <div className="flex justify-between items-start mb-2">
                 <div className="text-[10px] uppercase font-bold tracking-widest text-[#1e4a62]">Diagnostic Active</div>
                 <LineChart className="w-4 h-4 text-[#1e4a62]/60" />
              </div>
              <div className="text-2xl font-black text-[#1e4a62]">{activeDiagnostics} <span className="text-xs font-semibold ml-1 opacity-50 uppercase tracking-widest">({totalRegisters > 0 ? Math.round((activeDiagnostics/totalRegisters)*100) : 0}%)</span></div>
           </motion.div>

           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-5 border border-[#1e4a62]/10 border-l-4 border-l-green-500 shadow-sm rounded-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 rounded-full blur-2xl opacity-10 -translate-y-10 translate-x-10"></div>
              <div className="flex justify-between items-start mb-2 relative z-10">
                 <div className="text-[10px] uppercase font-bold tracking-widest text-green-700">Verified Pipeline</div>
                 <Database className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-black text-green-600 relative z-10">{verifiedPipeline} <span className="text-xs font-semibold ml-1 opacity-50 uppercase tracking-widest text-green-800">({activeDiagnostics > 0 ? Math.round((verifiedPipeline/activeDiagnostics)*100) : 0}%)</span></div>
           </motion.div>
        </div>
      )}

      {/* Main CRM Core */}
      <div className="bg-white border border-[#1e4a62]/10 rounded-sm overflow-hidden shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#f2f6fa] border-b border-[#1e4a62]/10 text-[10px] uppercase tracking-widest text-[#1e4a62] font-black">
              <th className="px-6 py-5">{crmMode === "startups" ? "Startup Entity" : "Investor Firm"}</th>
              <th className="px-6 py-5">{crmMode === "startups" ? "Founder Record" : "Target Stage"}</th>
              <th className="px-6 py-5">Registration Date</th>
              {crmMode === "startups" && <th className="px-6 py-5 text-center">Score</th>}
              <th className="px-6 py-5">Current Stage Gate</th>
              <th className="px-6 py-5 text-right flex-1">Overrides</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {(crmMode === "startups" ? startups : investors).length === 0 ? (
              <tr>
                <td colSpan={6} className="py-24 text-center">
                  <AlertCircle className="w-8 h-8 text-[#1e4a62]/40 mx-auto mb-4" />
                  <div className="text-[#022f42] font-black text-lg mb-1">Database Empty</div>
                  <p className="text-[#1e4a62] text-sm max-w-md mx-auto">There are no {crmMode} currently registered on this specific physical node.</p>
                </td>
              </tr>
            ) : (crmMode === "startups" ? startups : investors).map((s, i) => (
              <tr key={i} className="border-b border-[#1e4a62]/5 hover:bg-[#f2f6fa]/60 transition-colors cursor-pointer group">
                <td className="px-6 py-4">
                  <div className="font-black text-[#022f42] flex items-center text-base">
                    {s.score >= 80 && <ShieldCheck className="w-5 h-5 text-[#ffd800] mr-2 drop-shadow-sm" />}
                    {s.name}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-[#1e4a62] mt-1.5 font-bold bg-white inline-block px-2 py-0.5 border border-[#1e4a62]/10 rounded-sm">{s.sector || s.type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[#022f42] font-bold text-sm block">{s.founder || s.stage}</div>
                  {s.email && <div className="text-[10px] text-gray-400 font-medium block mt-0.5">{s.email}</div>}
                </td>
                <td className="px-6 py-4 text-[#1e4a62] text-xs font-bold">{s.registration}</td>
                {crmMode === "startups" && (
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-sm border border-[#1e4a62]/10 flex items-center justify-center font-black text-sm bg-[#f2f6fa] text-[#022f42] shadow-inner">
                        {s.score > 0 ? s.score : "-"}
                      </div>
                    </div>
                  </td>
                )}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-black border rounded-sm shadow-sm ${s.score >= 80 ? 'bg-green-50 text-green-700 border-green-200' : s.score > 0 ? 'bg-[#fffcf0] text-[#022f42] border-[#ffd800]' : 'bg-[#f2f6fa] text-[#1e4a62] border-[#1e4a62]/20'}`}>
                    {s.status || "Active Pipeline"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditEntity(s)} className="text-[#1e4a62] hover:text-[#022f42] transition-colors p-2 bg-white border border-[#1e4a62]/10 rounded-sm shadow-sm hover:shadow flex items-center" title="Modify Record">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteEntity(s.id, s.name, crmMode === "startups" ? "startup" : "investor")} className="text-red-500 hover:text-white transition-colors p-2 bg-white border border-red-100 rounded-sm shadow-sm hover:bg-red-500 flex items-center" title="Permanently Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center text-sm font-bold tracking-widest uppercase animate-pulse">Initializing Data Stream...</div>}>
      <AdminDashboardContent />
    </Suspense>
  )
}
