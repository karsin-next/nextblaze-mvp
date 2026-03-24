"use client";

import { useState, useEffect } from "react";
import { AIAssistedInsight } from "@/components/AIAssistedInsight";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Info, Activity, Save, 
  Check, UserPlus, Users, X, AlertTriangle, Briefcase, Plus, TrendingUp, ShieldAlert, Award, Sparkles, ExternalLink
} from "lucide-react";
import Link from "next/link";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  commitment: string;
  experience: string;
  responsibility: string;
  linkedin: string;
  startupExperience: string;
  education: string;
}

export default function TeamScorecardPage() {
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Data State
  const [data, setData] = useState({
    team: [] as TeamMember[],
    industryExpertise: 5,
    functionalCoverage: 5,
    executionTrackRecord: 5,
    founderChemistry: 5,
    networkStrength: 5,
    uvpOverride: undefined as string | undefined
  });

  const [aiFlags, setAiFlags] = useState({ step1: "", step2: "", step4: "" });

  // Persistence (SOP: Privacy-First Hybrid)
  useEffect(() => {
    const saved = localStorage.getItem("audit_1_1_8");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) setData(parsed.data);
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    } else {
      setData(d => ({
        ...d,
        team: [{
          id: Date.now().toString(),
          name: "",
          role: "Co-Founder & CEO",
          commitment: "full-time",
          experience: "",
          responsibility: "",
          linkedin: "",
          startupExperience: "first",
          education: ""
        }]
      }))
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem("audit_1_1_8", JSON.stringify({ data, step }));
  }, [data, step, isLoaded]);

  // Calculations
  const teamScore = Math.round((data.industryExpertise + data.functionalCoverage + data.executionTrackRecord + data.founderChemistry) * 2.5);

  // AI Feedback Updates
  useEffect(() => {
    if (data.team.length === 1) setAiFlags(p => ({...p, step1: "Solo founder alert. Investors prefer co-founding teams for execution redundancy."}));
    else setAiFlags(p => ({...p, step1: ""}));

    if (data.functionalCoverage < 6) setAiFlags(p => ({...p, step2: "Functional gaps detected. Map advisory nodes to bridge execution holes."}));
    else setAiFlags(p => ({...p, step2: "Balanced functional core signals higher execution velocity."}));
  }, [data]);

  const handleNextStep = () => setStep(Math.min(5, step + 1));

  const addTeamMember = () => {
    setData(p => ({
      ...p,
      team: [...p.team, {
        id: Date.now().toString(), name: "", role: "Core Member", commitment: "full-time", experience: "", responsibility: "", linkedin: "", startupExperience: "first", education: ""
      }]
    }));
  };

  const updateTeam = (id: string, field: keyof TeamMember, val: string) => {
    setData(p => ({ ...p, team: p.team.map(t => t.id === id ? { ...t, [field]: val } : t) }));
  };

  const defaultSummary = `Founding team of ${data.team.length} with core focus on ${data.team.slice(0,2).map(t => t.role).join(" and ")}. Team strength index: ${teamScore}/100. Core leverage in ${data.industryExpertise > 7 ? 'Industry Expertise' : 'Execution Track Record'}. ${data.networkStrength > 7 ? 'Strong network nodes established.' : 'Expanding advisory reach.'}`;

  const handleSaveAndContinue = () => {
    setSavedSuccess(true);
    setTimeout(() => window.location.href = "/dashboard/score", 1000); 
  };

  if (!isLoaded) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto pb-32">
      <ModuleHeader 
        badge="1.1.8 Team Scorecard"
        title="Founding Team Audit"
        description="Build a comprehensive, investor-ready view of your team that mathematically highlights compounding strengths and identifies functional gaps."
      />

      {/* Progress Bar (SOP: Clickable Navigation) */}
      <div className="bg-white shadow-sm border border-gray-100 p-4 mb-6 rounded-sm flex items-center justify-between">
        <div className="flex gap-1 md:gap-2">
          {[1,2,3,4,5].map(i => (
            <button 
              key={i} 
              onClick={() => setStep(i)}
              className={`h-2 w-10 md:w-16 rounded-full transition-all ${step >= i ? 'bg-[#ffd800]' : 'bg-gray-200'} hover:opacity-80 cursor-pointer`} 
              title={`Jump to Step ${i}`}
            />
          ))}
        </div>
        <span className="text-sm font-bold text-[#022f42] uppercase tracking-widest ml-4">Step {step} of 5</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Team Roster */}
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black text-[#022f42]">Build Your Team Roster</h2>
                  <button onClick={addTeamMember} className="bg-[#022f42] text-white p-2 rounded-sm hover:bg-[#1b4f68] transition-colors shadow-md">
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-6">
                  {data.team.map((m) => (
                    <div key={m.id} className="p-6 border border-gray-100 bg-gray-50 rounded-sm relative group">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" value={m.name} onChange={e=>updateTeam(m.id, 'name', e.target.value)} placeholder="Name" className="p-3 border border-gray-200 rounded-sm outline-none focus:border-[#ffd800] font-bold" />
                        <input type="text" value={m.role} onChange={e=>updateTeam(m.id, 'role', e.target.value)} placeholder="Role (e.g. CTO)" className="p-3 border border-gray-200 rounded-sm outline-none focus:border-[#ffd800]" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Assessment */}
            {step === 2 && (
              <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8">Team Strength Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {['industryExpertise', 'functionalCoverage', 'executionTrackRecord', 'founderChemistry'].map(key => (
                    <div key={key} className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <label className="text-xs font-black uppercase text-gray-400 mb-2 block">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-[#022f42] w-8">{data[key as keyof typeof data] as number}</span>
                        <input type="range" min="1" max="10" value={data[key as keyof typeof data] as number} onChange={e=>setData({...data, [key]: parseInt(e.target.value)})} className="w-full accent-[#022f42]" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Gap Analysis */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-amber-500 rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8">Structural Gap Analysis</h2>
                <div className="p-8 border-2 border-dashed border-gray-100 rounded-sm text-center">
                   <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                   <p className="text-[#022f42] font-bold">Heuristic scan complete.</p>
                   <p className="text-sm text-gray-400 mt-1">Based on your functional coverage score ({data.functionalCoverage}/10), we recommend identifying a strategic advisor for GTM operations.</p>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Network */}
            {step === 4 && (
              <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#022f42] rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#022f42] mb-10">Scorecard Analytics</h2>
                 <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                      <path className={`${teamScore >= 70 ? 'text-emerald-500' : 'text-[#ffd800]'} transition-all duration-1000`} strokeDasharray={`${Math.max(1, teamScore)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" stroke="currentColor"/>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-6xl font-black text-[#022f42]">{teamScore}</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">/ 100</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Pitch */}
            {step === 5 && (
              <motion.div key="s5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 md:p-10 shadow-lg border-t-[4px] border-[#ffd800] rounded-sm">
                <h2 className="text-2xl font-black text-[#022f42] mb-8 text-center">Team Narrative Pitch</h2>
                <div className="bg-[#f2f6fa] border-2 border-dashed border-gray-100 p-8 rounded-sm mb-8">
                  <textarea 
                    value={data.uvpOverride !== undefined ? data.uvpOverride : defaultSummary}
                    onChange={(e) => setData({...data, uvpOverride: e.target.value})}
                    className="w-full bg-white p-6 border border-gray-100 outline-none text-[#022f42] font-semibold text-lg min-h-[160px] leading-relaxed resize-none shadow-inner"
                  />
                </div>
                <div className="flex justify-center">
                  <button onClick={handleSaveAndContinue} className={`px-12 py-5 font-black uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 shadow-lg ${savedSuccess ? 'bg-green-500 text-white' : 'bg-[#ffd800] hover:bg-[#ffe24d] text-[#022f42]'}`}>
                    {savedSuccess ? 'Saved' : 'Complete Team Audit'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
            <button
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className={`font-bold text-sm tracking-widest uppercase flex items-center gap-2 transition-colors ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-[#1e4a62] hover:text-[#022f42]'}`}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4"/> Back
            </button>
            {step < 5 && (
              <button
                onClick={handleNextStep}
                className="bg-[#022f42] text-white px-8 py-3 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#1b4f68] transition-colors flex items-center gap-2 shadow-md"
              >
                Next Step <ArrowRight className="w-4 h-4"/>
              </button>
            )}
          </div>
        </div>

        {/* ADDITIONAL Column (SOP: AI & Academy) */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-lg border-b-4 border-[#ffd800]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#ffd800]" />
              <h3 className="font-black uppercase tracking-widest text-xs">ADDITIONAL INSIGHTS</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-sm border border-white/10">
                <p className="text-sm leading-relaxed text-blue-50 font-medium">
                  {step === 1 ? (aiFlags.step1 || "A team is the atomic unit of execution. Investors bet on the jockeys, not the horse.") : 
                   step === 2 ? (aiFlags.step2 || "Functional coverage ensures that the startup can survive the loss of any single node.") :
                   step === 4 ? "Execution track record is the most correlated metric with second-round funding success." :
                   "A balanced team scorecard signals a mature founding perspective."}
                </p>
              </div>

              <hr className="border-white/10" />

              <div className="group">
                <Link 
                  href="/academy/the-founding-team-scorecard" 
                  className="flex items-center justify-between text-[#ffd800] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors text-left"
                >
                  <span>Education: Team Scorecard →</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </Link>
                <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Academy: Leadership & Ops</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Team Intensity</h4>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-[#022f42]">{teamScore}%</div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${teamScore >= 70 ? 'bg-emerald-500' : 'bg-[#ffd800]'}`} style={{width: `${teamScore}%`}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
