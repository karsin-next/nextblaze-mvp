"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, ArrowRight, ShieldCheck, X, Crown, Briefcase, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  timeCommitment: "Full-time" | "Part-time" | "Advisor";
}

export default function TeamCompositionPage() {

  const { user } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>([{ id: "ceo", name: "You", role: "CEO / Founder", timeCommitment: "Full-time" }]);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("CTO");
  const [newTime, setNewTime] = useState<"Full-time" | "Part-time" | "Advisor">("Part-time");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`audit_8-team_data_${user?.id}`);
      if (saved) {
        try { setMembers(JSON.parse(saved)); } catch(e) {}
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && members.length > 1) { // only save if they added more than just CEO
      localStorage.setItem(`audit_8-team_data_${user?.id}`, JSON.stringify(members));
    }
  }, [members]);
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);

  const addMember = () => {
    if (!newName.trim()) return;
    setMembers([...members, { id: Math.random().toString(), name: newName, role: newRole, timeCommitment: newTime }]);
    setNewName("");
  };

  const removeMember = (id: string) => {
    if (id === "ceo") return; // Keep founder
    setMembers(members.filter(m => m.id !== id));
    setShowAiAnalysis(false);
  };

  const runTeamAnalysis = () => {
    setShowAiAnalysis(true);
  };

  const submitModule = async () => {
    setIsSubmitting(true);
    if (typeof window !== 'undefined') localStorage.setItem(`audit_8-team_${user?.id}`, 'completed');
    setTimeout(() => {
      // Simulate completing all 8 modules and going back to the hub to see the final score
      // In a real app, this would mark the audit_session as 'completed'
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
         <div>
           <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
             Module 1.1.8
           </div>
           <h1 className="text-xl font-bold text-[#022f42]">Team Composition Audit</h1>
         </div>
         <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42]">
           Back to Hub
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Management Area */}
        <div className="lg:col-span-3 space-y-8">
          
          <div className="bg-white p-6 md:p-8 border border-[rgba(2,47,66,0.1)] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd800] rounded-full blur-[80px] opacity-10"></div>
            
            <h2 className="text-base font-bold text-[#022f42] mb-1">Build Your Executive Team</h2>
            <p className="text-[#1e4a62] text-xs mb-8">Investors invest in teams, not just ideas. Missing a technical co-founder or full-time sales leadership early on is a major red flag.</p>

            {/* Add Member Form */}
            <div className="bg-[#f2f6fa] p-4 border border-[rgba(2,47,66,0.15)] focus-within:border-[#022f42] transition-colors mb-8">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] mb-3 block border-b border-[rgba(2,47,66,0.1)] pb-2 flex justify-between">
                <span>Add Team Member</span>
                <Users className="w-3.5 h-3.5 text-[#1e4a62]" />
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name" 
                  className="w-full p-2.5 text-xs bg-white border border-[rgba(2,47,66,0.1)] focus:outline-none focus:border-[#022f42]"
                />
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-[rgba(2,47,66,0.1)] focus:outline-none focus:border-[#022f42] text-[#022f42] font-semibold"
                >
                  <option value="CTO">CTO / Technical</option>
                  <option value="CRO">CRO / Sales</option>
                  <option value="COO">COO / Ops</option>
                  <option value="CMO">CMO / Marketing</option>
                  <option value="CFO">CFO / Finance</option>
                  <option value="Product">Head of Product</option>
                  <option value="Engineer">Lead Engineer</option>
                </select>
                <div className="flex">
                  <select 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-white border border-[rgba(2,47,66,0.1)] border-r-0 focus:outline-none focus:border-[#022f42] text-[#1e4a62]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Advisor">Advisor</option>
                  </select>
                  <button 
                    onClick={addMember}
                    className="bg-[#022f42] text-white px-3 flex items-center justify-center hover:bg-[#ffd800] hover:text-[#022f42] transition-colors border-2 border-[#022f42]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Render Team List */}
            <div className="space-y-3">
              <AnimatePresence>
                {members.map(member => (
                  <motion.div 
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-4 bg-white border border-[rgba(2,47,66,0.1)] group hover:border-[#022f42] transition-colors"
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors ${member.id === 'ceo' ? 'bg-[#ffd800] text-[#022f42]' : 'bg-[#f2f6fa] text-[#1e4a62] group-hover:bg-[#022f42] group-hover:text-white'}`}>
                        {member.id === 'ceo' ? <Crown className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#022f42] mb-0.5">{member.name}</div>
                        <div className="text-[10px] uppercase font-semibold text-[#1e4a62] tracking-widest">{member.role}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 mr-4 border ${member.timeCommitment === 'Full-time' ? 'bg-green-50 text-green-700 border-green-200' : member.timeCommitment === 'Advisor' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        {member.timeCommitment}
                      </span>
                      {member.id !== "ceo" && (
                        <button onClick={() => removeMember(member.id)} className="text-[rgba(2,47,66,0.3)] hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

        </div>

        {/* AI Analysis Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          
          <button 
            onClick={runTeamAnalysis}
            disabled={showAiAnalysis}
            className={`w-full p-4 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center border-2 shadow-lg mb-6 ${showAiAnalysis ? 'bg-[#f2f6fa] border-[rgba(2,47,66,0.1)] text-[#1e4a62] cursor-not-allowed opacity-60' : 'bg-[#022f42] border-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] cursor-pointer'}`}
          >
            <Zap className={`w-4 h-4 mr-2 ${showAiAnalysis ? '' : 'text-[#ffd800]'}`} /> Analyze Team Gaps
          </button>

          <AnimatePresence>
            {showAiAnalysis && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                
                {/* Simulated Output Based on missing roles */}
                {!members.some(m => m.role.includes('CTO') || m.role.includes('Engineer')) && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 shadow-sm">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-900 flex items-center mb-1"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Critical Gap</h4>
                    <p className="text-xs text-red-800 leading-relaxed font-medium">No technical co-founder or lead engineer listed. Outsourcing core product development heavily impacts seed-stage fundability.</p>
                  </div>
                )}
                
                {members.some(m => m.timeCommitment === 'Part-time' && m.id !== 'ceo') && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 shadow-sm">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-yellow-900 flex items-center mb-1"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Risk Factor</h4>
                    <p className="text-xs text-yellow-800 leading-relaxed font-medium">Part-time executives signal lack of conviction to investors. They will want to know exactly what triggers them to go full-time.</p>
                  </div>
                )}

                <div className="bg-green-50 border-l-4 border-green-500 p-4 shadow-sm">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-green-900 flex items-center mb-1"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Strength</h4>
                  <p className="text-xs text-green-800 leading-relaxed font-medium">Solo founder established. Adding an advisor or fractional CFO early will build trust with institutional capital.</p>
                </div>

                <button 
                  onClick={submitModule}
                  disabled={isSubmitting}
                  className="w-full mt-8 p-4 bg-[#022f42] text-white font-bold tracking-widest uppercase text-[10px] hover:bg-[#ffd800] hover:text-[#022f42] border-2 border-[#022f42] transition-colors flex items-center justify-center shadow-lg"
                >
                  {isSubmitting ? "Finalizing Audit..." : <><span className="mr-2">Complete Audit & Get Score</span> <ArrowRight className="w-4 h-4" /></>}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
