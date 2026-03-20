"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Kanban, Plus, MoreVertical, Building2, User, DollarSign, Calendar, Target, CheckCircle2, ChevronRight, X, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PrivacyConsentGate from "@/components/PrivacyConsentGate";

const STAGES = [
  { id: "lead", name: "Lead Identified", color: "border-gray-300", bg: "bg-gray-100" },
  { id: "pitch", name: "Initial Pitch", color: "border-blue-300", bg: "bg-blue-100" },
  { id: "diligence", name: "Deep Diligence", color: "border-purple-300", bg: "bg-purple-100" },
  { id: "term_sheet", name: "Term Sheet", color: "border-orange-300", bg: "bg-orange-100" },
  { id: "committed", name: "Committed", color: "border-green-300", bg: "bg-green-100" },
  { id: "closed", name: "Closed / Wired", color: "border-emerald-500", bg: "bg-emerald-200" }
];

interface InvestorCard {
  id: string;
  firm: string;
  partner: string;
  checkSize: number;
  lastContact: string;
  notes: string;
  stage: string;
}

export default function CrmPage() {
  const { user } = useAuth();
  const [investors, setInvestors] = useState<InvestorCard[]>([]);
  const [targetRaise, setTargetRaise] = useState<number>(1000000); // Default 1M
  const [isLoaded, setIsLoaded] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // New Card Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<InvestorCard | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !user?.id) return;
    const stored = localStorage.getItem(`crm_${user.id}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.investors) setInvestors(parsed.investors);
        if (parsed.targetRaise) setTargetRaise(parsed.targetRaise);
      } catch (e) {}
    } else {
      // Default dummy data for empty state
      setInvestors([
        { id: "1", firm: "Sequoia Surge", partner: "Rajan A.", checkSize: 500000, lastContact: new Date().toISOString().split("T")[0], notes: "Intro via mutual connection. Next step: send deck.", stage: "lead" },
        { id: "2", firm: "500 Global", partner: "Khailee Ng", checkSize: 250000, lastContact: new Date().toISOString().split("T")[0], notes: "Loved the PMF metrics. Scheduled technical deep dive.", stage: "pitch" },
      ]);
    }
    setIsLoaded(true);
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded && user?.id) {
      localStorage.setItem(`crm_${user.id}`, JSON.stringify({ investors, targetRaise }));
    }
  }, [investors, targetRaise, isLoaded, user?.id]);

  const committedTotal = investors
    .filter(i => i.stage === "committed" || i.stage === "closed")
    .reduce((sum, i) => sum + (i.checkSize || 0), 0);
    
  const progressPercent = targetRaise > 0 ? Math.min(100, Math.round((committedTotal / targetRaise) * 100)) : 0;

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    // Slight delay to allow drag image to snapshot before making original transparent
    setTimeout(() => {
      const el = document.getElementById(`card-${id}`);
      if (el) el.classList.add('opacity-40');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, id: string) => {
    setDraggedId(null);
    const el = document.getElementById(`card-${id}`);
    if (el) el.classList.remove('opacity-40');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    if (!draggedId) return;
    setInvestors(prev => prev.map(inv => inv.id === draggedId ? { ...inv, stage: targetStage } : inv));
  };

  const openNewCardModal = (stageId: string = "lead") => {
    setEditingCard({
      id: Date.now().toString(),
      firm: "",
      partner: "",
      checkSize: 0,
      lastContact: new Date().toISOString().split("T")[0],
      notes: "",
      stage: stageId
    });
    setIsModalOpen(true);
  };

  const openEditCardModal = (card: InvestorCard) => {
    setEditingCard({ ...card });
    setIsModalOpen(true);
  };

  const saveCard = () => {
    if (!editingCard || !editingCard.firm.trim()) return;
    
    setInvestors(prev => {
      const exists = prev.find(i => i.id === editingCard.id);
      if (exists) {
        return prev.map(i => i.id === editingCard.id ? editingCard : i);
      } else {
        return [...prev, editingCard];
      }
    });
    setIsModalOpen(false);
  };

  const deleteCard = (id: string) => {
    if (confirm("Remove this investor from your pipeline?")) {
      setInvestors(prev => prev.filter(i => i.id !== id));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
         <div className="max-w-2xl">
           <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
             Phase 4: Syndicate
           </div>
           <h1 className="text-3xl font-bold text-[#022f42] mb-3">Investor CRM</h1>
           <p className="text-[#1e4a62] text-sm leading-relaxed">
             Track your live fundraising pipeline. Move investors through stages, track committed capital, and ensure your follow-ups hit the mark.
           </p>
         </div>
         <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42] shrink-0 ml-4 hidden md:block">
           Back to Hub
         </Link>
      </div>

      <PrivacyConsentGate
        config={{
          consentKey: "crm",
          sensitivity: "high-level",
          title: "Investor Pipeline Privacy",
          aiExplanation: "Your fundraising conversations are highly confidential. FundabilityOS stores your CRM board locally in your web browser. This data is NEVER synced to our cloud databases. You retain total control.",
          dataUsage: "Render your Kanban board, track capital committed vs target, and remind you of follow-ups.",
          storageNote: "Stored securely in your browser's localStorage. Clear it anytime via Settings.",
          skippable: false,
        }}
        onConsent={() => {}}
      >
        
        {/* Round Progress Bar */}
        <div className="bg-white border border-[rgba(2,47,66,0.1)] shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center gap-6 rounded-sm">
          <div className="shrink-0 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#f2f6fa] border-4 border-[#022f42] flex items-center justify-center font-black text-xl text-[#022f42]">
              {progressPercent}%
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-[#1e4a62]">Round Progress</div>
              <div className="font-mono text-xl font-black text-[#022f42]">
                <span className="text-green-600">RM {(committedTotal / 1000000).toFixed(2)}M</span>
                <span className="text-[#1e4a62]/40 text-lg"> / RM {(targetRaise / 1000000).toFixed(2)}M</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="h-3 w-full bg-[#f2f6fa] rounded-full overflow-hidden border border-[#1e4a62]/10">
               <motion.div 
                 className={`h-full ${progressPercent >= 100 ? 'bg-green-500' : 'bg-[#ffd800]'}`}
                 initial={{ width: 0 }}
                 animate={{ width: `${progressPercent}%` }}
                 transition={{ duration: 1, ease: "easeOut" }}
               />
            </div>
          </div>
          
          <div className="shrink-0 flex flex-col items-end gap-1">
             <label className="text-[9px] uppercase font-black tracking-widest text-[#1e4a62]">Target Raise Size</label>
             <input 
               type="number"
               value={targetRaise}
               onChange={e => setTargetRaise(Number(e.target.value) || 0)}
               className="w-32 font-mono text-sm font-bold text-[#022f42] border border-[rgba(2,47,66,0.2)] rounded-sm px-2 py-1 text-right focus:border-[#022f42] outline-none"
             />
          </div>
        </div>

        {/* Kanban Board */}
        {isLoaded && (
          <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x">
            {STAGES.map(stage => {
              const columnInvestors = investors.filter(i => i.stage === stage.id);
              const columnTotal = columnInvestors.reduce((s, i) => s + (i.checkSize || 0), 0);

              return (
                <div 
                  key={stage.id} 
                  className={`flex-shrink-0 w-80 flex flex-col bg-white border border-[rgba(2,47,66,0.1)] shadow-sm rounded-sm snap-start`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {/* Column Header */}
                  <div className={`p-3 border-b border-[rgba(2,47,66,0.1)] ${stage.bg} flex justify-between items-center sticky top-0`}>
                    <div className="flex items-center gap-2">
                       <span className={`w-2.5 h-2.5 rounded-full border-2 bg-white ${stage.color}`}></span>
                       <h3 className="text-xs font-black uppercase tracking-widest text-[#022f42]">{stage.name}</h3>
                       <span className="text-[10px] font-bold bg-white text-[#1e4a62] px-1.5 py-0.5 rounded-sm shadow-sm">{columnInvestors.length}</span>
                    </div>
                  </div>
                  
                  {/* Column Summary */}
                  {columnTotal > 0 && (
                    <div className="px-3 py-1.5 bg-[#f2f6fa] border-b border-[rgba(2,47,66,0.05)] flex justify-between items-center">
                      <span className="text-[9px] uppercase font-bold text-[#1e4a62]">Pipeline Value</span>
                      <span className="font-mono text-xs font-bold text-[#022f42]">RM {(columnTotal).toLocaleString()}</span>
                    </div>
                  )}

                  {/* Cards Area */}
                  <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px] bg-[#fdfdfd]">
                    <AnimatePresence>
                      {columnInvestors.map(inv => (
                        <motion.div
                          key={inv.id}
                          id={`card-${inv.id}`}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          draggable
                          onDragStart={(e: any) => handleDragStart(e, inv.id)}
                          onDragEnd={(e: any) => handleDragEnd(e, inv.id)}
                          onClick={() => openEditCardModal(inv)}
                          className="bg-white border border-[rgba(2,47,66,0.15)] p-3 rounded-sm shadow-sm cursor-grab active:cursor-grabbing hover:border-[#022f42] hover:shadow-md transition-all group"
                        >
                           <div className="flex justify-between items-start mb-2">
                             <div className="font-bold text-sm text-[#022f42] leading-tight flex items-center gap-1.5">
                               {inv.firm}
                             </div>
                             <div className="font-mono text-xs font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-sm">
                               {inv.checkSize >= 1000000 ? `${(inv.checkSize/1000000).toFixed(1)}M` : `${inv.checkSize/1000}k`}
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-1.5 text-xs text-[#1e4a62] mb-3">
                             <User className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{inv.partner || "No Contact"}</span>
                           </div>

                           <div className="flex items-center justify-between text-[10px] text-[#1e4a62] font-medium border-t border-[rgba(2,47,66,0.05)] pt-2 mt-2">
                             <div className="flex items-center gap-1 bg-[#f2f6fa] px-1.5 py-0.5 rounded-sm">
                               <Calendar className="w-3 h-3" /> {new Date(inv.lastContact).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                             </div>
                             {inv.notes && (
                               <div className="w-4 h-4 rounded-full bg-[#1e4a62]/10 flex items-center justify-center text-[#022f42]" title={inv.notes}>
                                 ...
                               </div>
                             )}
                           </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    <button 
                      onClick={() => openNewCardModal(stage.id)}
                      className="w-full py-2 border border-dashed border-[#1e4a62]/20 rounded-sm text-[10px] font-bold text-[#1e4a62] uppercase tracking-widest hover:border-[#022f42] hover:bg-[#f2f6fa] hover:text-[#022f42] transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </PrivacyConsentGate>

      {/* Edit/New Card Modal */}
      {isModalOpen && editingCard && (
        <div className="fixed inset-0 bg-[#022f42]/80 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-sm w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="p-4 bg-[#022f42] flex justify-between items-center text-white">
              <h2 className="text-sm font-bold uppercase tracking-widest">{investors.find(i => i.id === editingCard.id) ? "Edit Investor Deal" : "New Investor"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-[#ffd800] p-1"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-1 block">Firm Name <span className="text-red-500">*</span></label>
                  <div className="flex border border-[#1e4a62]/20 rounded-sm overflow-hidden focus-within:border-[#022f42]">
                    <div className="bg-[#f2f6fa] px-3 flex items-center"><Building2 className="w-4 h-4 text-[#1e4a62]" /></div>
                    <input autoFocus value={editingCard.firm} onChange={e => setEditingCard({...editingCard, firm: e.target.value})} className="w-full p-2 text-sm font-bold text-[#022f42] outline-none" placeholder="e.g. Sequoia Capital" />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-1 block">Partner/Contact Name</label>
                  <div className="flex border border-[#1e4a62]/20 rounded-sm overflow-hidden focus-within:border-[#022f42]">
                    <div className="bg-[#f2f6fa] px-3 flex items-center"><User className="w-4 h-4 text-[#1e4a62]" /></div>
                    <input value={editingCard.partner} onChange={e => setEditingCard({...editingCard, partner: e.target.value})} className="w-full p-2 text-sm text-[#022f42] outline-none" placeholder="e.g. Roelof Botha" />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-1 block">Target Check (RM)</label>
                  <div className="flex border border-[#1e4a62]/20 rounded-sm overflow-hidden focus-within:border-[#022f42]">
                    <div className="bg-[#f2f6fa] px-3 flex items-center text-[#1e4a62] font-mono font-bold">RM</div>
                    <input type="number" value={editingCard.checkSize || ""} onChange={e => setEditingCard({...editingCard, checkSize: Number(e.target.value)})} className="w-full p-2 text-sm font-bold font-mono text-[#022f42] outline-none text-right" />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-1 block">Pipeline Stage</label>
                  <select 
                    value={editingCard.stage} 
                    onChange={e => setEditingCard({...editingCard, stage: e.target.value})}
                    className="w-full border border-[#1e4a62]/20 rounded-sm p-2 text-sm font-bold text-[#022f42] outline-none focus:border-[#022f42] bg-white"
                  >
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-1 block">Last Contact Date</label>
                  <div className="flex border border-[#1e4a62]/20 rounded-sm overflow-hidden focus-within:border-[#022f42]">
                    <div className="bg-[#f2f6fa] px-2 flex items-center"><Calendar className="w-4 h-4 text-[#1e4a62]" /></div>
                    <input type="date" value={editingCard.lastContact} onChange={e => setEditingCard({...editingCard, lastContact: e.target.value})} className="w-full p-2 text-sm text-[#022f42] outline-none" />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#022f42] mb-1 block">Deal Notes / Next Steps</label>
                  <textarea 
                    value={editingCard.notes} 
                    onChange={e => setEditingCard({...editingCard, notes: e.target.value})}
                    className="w-full border border-[#1e4a62]/20 rounded-sm p-3 text-sm text-[#022f42] outline-none focus:border-[#022f42] h-24 resize-none"
                    placeholder="Log conversation history here..."
                  />
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-[#f2f6fa] border-t border-[rgba(2,47,66,0.1)] flex justify-between items-center">
              {investors.find(i => i.id === editingCard.id) ? (
                <button onClick={() => deleteCard(editingCard.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-sm transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              ) : (
                <div></div>
              )}
              <div className="flex gap-2 text-xs font-bold uppercase tracking-widest">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-[#1e4a62]/20 text-[#1e4a62] hover:bg-white rounded-sm transition-colors">Cancel</button>
                <button 
                  onClick={saveCard} 
                  disabled={!editingCard.firm.trim()}
                  className="px-6 py-2 bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] disabled:opacity-50 rounded-sm transition-colors"
                >
                  Save Deal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
