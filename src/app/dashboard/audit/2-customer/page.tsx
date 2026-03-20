"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Crosshair, MapPin, Briefcase, Zap, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CustomerClarityPage() {

  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [persona, setPersona] = useState({
    role: "",
    industry: "",
    companySize: "",
    primaryPain: "",
    buyingTrigger: ""
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`audit_2-customer_data_${user?.id}`);
      if (saved) {
        try { setPersona(JSON.parse(saved)); } catch(e) {}
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && persona.role !== "") {
      localStorage.setItem(`audit_2-customer_data_${user?.id}`, JSON.stringify(persona));
    }
  }, [persona]);

  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const simulateAiSuggestion = (field: string) => {
    // Mocking an AI suggestion based on user input
    setAiSuggestion(null);
    setTimeout(() => {
      if (field === 'role' && persona.role.toLowerCase().includes('hr')) {
         setAiSuggestion("AI Insight: For HR tech, VP of People usually holds the budget, but Recruiting Managers feel the pain most acutely.");
      } else if (field === 'industry' && persona.industry.toLowerCase().includes('health')) {
         setAiSuggestion("AI Insight: Healthcare sales cycles are typically 9-18 months. Have you mapped out the compliance/security buyer persona as well?");
      }
    }, 600);
  };

  const submitModule = async () => {
    setIsSubmitting(true);
    if (typeof window !== 'undefined') localStorage.setItem(`audit_2-customer_${user?.id}`, 'completed');
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const isComplete = Object.values(persona).every(val => val.length > 0);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
         <div>
           <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
             Module 1.1.2
           </div>
           <h1 className="text-xl font-bold text-[#022f42]">Customer Clarity Scan</h1>
         </div>
         <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42]">
           Back to Hub
         </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Form Area */}
        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold text-[#022f42] mb-2 leading-tight">Define Your Early Adopter</h2>
          <p className="text-[#1e4a62] text-sm mb-8">Investors invest in specific customer acquisition strategies. Vague personas (e.g., &quot;small businesses&quot;) are a red flag.</p>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); submitModule(); }}>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#022f42] uppercase tracking-widest flex items-center">
                <Crosshair className="w-3.5 h-3.5 mr-2 text-[#1e4a62]" /> Target Role / Title
              </label>
              <input 
                type="text" 
                placeholder="e.g. VP of Sales, DevSecOps Engineer" 
                className="w-full p-4 bg-white border border-[rgba(2,47,66,0.15)] focus:border-[#022f42] focus:ring-1 focus:ring-[#022f42] outline-none transition-all placeholder:text-[rgba(2,47,66,0.3)]"
                value={persona.role}
                onChange={(e) => setPersona({...persona, role: e.target.value})}
                onBlur={() => simulateAiSuggestion('role')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#022f42] uppercase tracking-widest flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-2 text-[#1e4a62]" /> Target Industry
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. B2B SaaS, Logistics" 
                  className="w-full p-4 bg-white border border-[rgba(2,47,66,0.15)] focus:border-[#022f42] outline-none transition-all placeholder:text-[rgba(2,47,66,0.3)]"
                  value={persona.industry}
                  onChange={(e) => setPersona({...persona, industry: e.target.value})}
                  onBlur={() => simulateAiSuggestion('industry')}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#022f42] uppercase tracking-widest flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-2 text-[#1e4a62]" /> Company Size
                </label>
                <select 
                  className="w-full p-4 bg-white border border-[rgba(2,47,66,0.15)] focus:border-[#022f42] outline-none transition-all text-[#022f42]"
                  value={persona.companySize}
                  onChange={(e) => setPersona({...persona, companySize: e.target.value})}
                  required
                >
                  <option value="" disabled>Select scale...</option>
                  <option value="1-10">Micro (1-10 employees)</option>
                  <option value="11-50">Small (11-50 employees)</option>
                  <option value="51-200">Mid-market (51-200 employees)</option>
                  <option value="201-1000">Commercial (201-1000 employees)</option>
                  <option value="1000+">Enterprise (1000+ employees)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#022f42] uppercase tracking-widest flex items-center">
                <Zap className="w-3.5 h-3.5 mr-2 text-[#1e4a62]" /> Primary Pain Point
              </label>
              <textarea 
                rows={2}
                placeholder="What exactly is broken in their day-to-day?" 
                className="w-full p-4 bg-white border border-[rgba(2,47,66,0.15)] focus:border-[#022f42] outline-none transition-all placeholder:text-[rgba(2,47,66,0.3)] resize-none"
                value={persona.primaryPain}
                onChange={(e) => setPersona({...persona, primaryPain: e.target.value})}
                required
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#022f42] uppercase tracking-widest flex items-center">
                <Target className="w-3.5 h-3.5 mr-2 text-[#1e4a62]" /> The Buying Trigger
              </label>
              <input 
                type="text" 
                placeholder="What specific event makes them look for a solution today?" 
                className="w-full p-4 bg-white border border-[rgba(2,47,66,0.15)] focus:border-[#022f42] outline-none transition-all placeholder:text-[rgba(2,47,66,0.3)]"
                value={persona.buyingTrigger}
                onChange={(e) => setPersona({...persona, buyingTrigger: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={!isComplete || isSubmitting}
              className={`mt-4 w-full p-4 flex items-center justify-center font-bold tracking-widest uppercase transition-all ${
                isComplete && !isSubmitting
                  ? "bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] border-2 border-[#022f42] cursor-pointer" 
                  : "bg-[#f2f6fa] text-[#1e4a62] border-2 border-[rgba(2,47,66,0.1)] cursor-not-allowed opacity-70"
              }`}
            >
              {isSubmitting ? (
                 <div className="flex items-center"><div className="w-4 h-4 border-2 border-[#f2f6fa] border-t-transparent rounded-full animate-spin mr-3"></div> Saving to Profile...</div>
              ) : (
                <>Save Persona <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview / AI Sidebar */}
        <div className="md:col-span-2">
          <div className="sticky top-8">
            <div className="bg-[#f2f6fa] border border-[rgba(2,47,66,0.08)] p-6 mb-4 relative overflow-hidden">
              <div className="flex items-center text-[#1e4a62] mb-4 border-b border-[rgba(2,47,66,0.08)] pb-2 text-[10px] font-bold uppercase tracking-widest">
                <Users className="w-3.5 h-3.5 mr-2" /> Live Preview
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#1e4a62] font-semibold mb-1">Target Persona</div>
                  <div className="text-sm font-bold text-[#022f42] line-clamp-2 min-h-[1.25rem]">
                    {persona.role || <span className="text-[rgba(2,47,66,0.3)] font-normal italic">Waiting for input...</span>}
                  </div>
                </div>

                <div className="flex gap-2 text-xs">
                  <span className="bg-white border border-[rgba(2,47,66,0.1)] px-2 py-1 text-[#022f42] font-semibold rounded-sm">
                    {persona.industry || "Industry"}
                  </span>
                  <span className="bg-white border border-[rgba(2,47,66,0.1)] px-2 py-1 text-[#022f42] font-semibold rounded-sm">
                    {persona.companySize ? `${persona.companySize} emp.` : "Size"}
                  </span>
                </div>

                <div>
                  <div className="text-[9px] uppercase tracking-widest text-[#1e4a62] font-semibold mb-1">Primary Pain</div>
                  <div className="text-xs text-[#022f42] bg-white p-2 border border-[rgba(2,47,66,0.1)] min-h-[3rem] italic">
                    {persona.primaryPain ? `"${persona.primaryPain}"` : <span className="text-[rgba(2,47,66,0.3)] font-normal">Waiting for input...</span>}
                  </div>
                </div>
              </div>
            </div>

            {aiSuggestion && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#022f42] p-5 text-white shadow-lg border-l-4 border-[#ffd800]">
                 <h4 className="flex items-center text-xs font-bold uppercase tracking-widest text-[#ffd800] mb-2">
                   <Sparkles className="w-3.5 h-3.5 mr-2" /> AI Assistant
                 </h4>
                 <p className="text-xs leading-relaxed text-[#b0d0e0]">
                   {aiSuggestion}
                 </p>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Needed imports
import { Target, AlertTriangle, FileText, ShieldCheck, AlertCircle } from "lucide-react";
