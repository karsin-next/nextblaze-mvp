"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Building, Target, PieChart, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function InvestorSettingsPage() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    firmName: "",
    investorType: "Angel Syndicate",
    targetStage: "Pre-Seed",
    thesis: "",
    checkSize: "$100k - $500k"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`investor_profile_${user.id}`);
      if (saved) {
        try { setProfile(JSON.parse(saved)); } catch(e) {}
      } else if (user?.email) {
        setProfile(p => ({...p, firmName: user.email || "" }));
      }
    }
  }, [user?.id, user?.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (typeof window !== 'undefined' && user?.id) {
      localStorage.setItem(`investor_profile_${user.id}`, JSON.stringify(profile));
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      <div className="mb-10">
         <div className="inline-block bg-[#022f42] text-[#ffd800] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest rounded-sm">
           Deal Flow Operations
         </div>
         <h1 className="text-3xl font-bold text-[#022f42] mb-3">Firm Settings & Deal Criteria</h1>
         <p className="text-[#1e4a62] text-sm leading-relaxed max-w-2xl">
           Configure your capital deployment parameters. The AI Matcher uses these precise logic gates to instantly surface the highest-scoring verified startups crossing your exact thesis.
         </p>
      </div>

      <div className="bg-white border border-[#1e4a62]/10 rounded-sm shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] p-8">
        
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-green-50 border-l-4 border-green-500 p-4 flex items-center shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-sm text-green-800 font-bold">Investment Parameters Successfully Locked.</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                <span>Entity / Firm Name</span>
              </label>
              <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden shadow-sm">
                <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><Building className="w-4 h-4 text-[#1e4a62]"/></div>
                <input required value={profile.firmName} onChange={e => setProfile({...profile, firmName: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm" placeholder="e.g. NextBlaze Ventures" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                <span>Investor Classification</span>
              </label>
              <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden shadow-sm">
                <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><UserRoleIcon className="w-4 h-4 text-[#1e4a62]"/></div>
                <select required value={profile.investorType} onChange={e => setProfile({...profile, investorType: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm bg-transparent appearance-none">
                   <option value="Angel Syndicate">Angel Syndicate</option>
                   <option value="Micro VC">Micro VC</option>
                   <option value="Venture Capital">Venture Capital</option>
                   <option value="Family Office">Family Office</option>
                   <option value="Corporate VC">Corporate VC</option>
                   <option value="Private Equity">Private Equity</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                <span>Target Entry Stage</span>
              </label>
              <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden shadow-sm">
                <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><PieChart className="w-4 h-4 text-[#1e4a62]"/></div>
                <select required value={profile.targetStage} onChange={e => setProfile({...profile, targetStage: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm bg-transparent appearance-none">
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B+">Series B+</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                 <span>Standard Check Size</span>
               </label>
               <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden shadow-sm">
                 <div className="bg-[#f2f6fa] px-3 flex items-center border-r border-[#1e4a62]/10"><Briefcase className="w-4 h-4 text-[#1e4a62]"/></div>
                 <select required value={profile.checkSize} onChange={e => setProfile({...profile, checkSize: e.target.value})} className="w-full p-3 font-bold text-[#022f42] text-sm outline-none bg-transparent appearance-none">
                     <option value="$50k - $100k">$50k - $100k</option>
                     <option value="$100k - $500k">$100k - $500k</option>
                     <option value="$500k - $2M">$500k - $2M</option>
                     <option value="$2M - $5M">$2M - $5M</option>
                     <option value="$5M+">$5M+</option>
                 </select>
               </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] flex justify-between">
                <span>Investment Thesis / Moat Requirements</span>
              </label>
              <div className="flex border border-[#1e4a62]/15 bg-white focus-within:border-[#022f42] rounded-sm overflow-hidden shadow-sm">
                <div className="bg-[#f2f6fa] px-3 pt-3 border-r border-[#1e4a62]/10"><Target className="w-4 h-4 text-[#1e4a62]"/></div>
                <textarea required value={profile.thesis} onChange={e => setProfile({...profile, thesis: e.target.value})} className="w-full p-3 outline-none font-bold text-[#022f42] text-sm min-h-[100px]" placeholder="e.g. We back technical founders building deep-tech B2B infrastructure with proprietary LLM distribution loops." />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 mt-8 font-bold tracking-widest uppercase text-xs border-2 transition-all flex items-center justify-center rounded-sm shadow-md ${
              isSubmitting ? "bg-white text-[rgba(2,47,66,0.4)] border-transparent cursor-not-allowed" : "bg-[#022f42] text-white border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-[#1e4a62] border-t-transparent rounded-full animate-spin mr-3"></div> Syncing Parameters...</>
            ) : (
              <><span className="mr-2">Save Deal Criteria</span> <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

// User Icon fallback
function UserRoleIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
