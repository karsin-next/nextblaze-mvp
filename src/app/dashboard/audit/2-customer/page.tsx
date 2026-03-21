"use client";

import { useState } from "react";
import { ModuleHeader } from "@/components/ModuleHeader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, CheckCircle2, ChevronRight, ExternalLink, Users, 
  Map as MapIcon, Target, Tag, AlertCircle, Sparkles, ArrowRight
} from "lucide-react";
import Link from "next/link";

const demographicOptions = ["B2B Enterprise", "B2B SMB", "B2C Millennials", "Gen Z", "High Net Worth", "Students"];
const channelOptions = ["Outbound Cold Email", "LinkedIn Social Selling", "TikTok/IG Ads", "SEO & Content", "Channel Partnerships", "Direct Sales Team"];
const triggerOptions = ["Contract Renewals", "Regulatory Changes", "Budget Cycles", "Life Events", "Urgent Crises"];

export default function PersonaBuilderPage() {
  const [personaName, setPersonaName] = useState("");
  const [selectedDemographics, setSelectedDemographics] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const isReady = personaName.length > 2 && selectedDemographics.length > 0 && selectedChannels.length > 0 && selectedTriggers.length > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ModuleHeader 
        badge="1.1.2 Who Exactly? Persona Builder"
        title="Who Exactly? Persona Builder"
        description="Define your ideal customer segments, their buying triggers, and how to reach them. This builds the 'customer' part of your pitch and validates go-to-market fit."
      />

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Interactive Area */}
        <div className="flex-1 space-y-6">
          
          {/* Builder State */}
          <div className={`bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-[#022f42] rounded-sm transition-all ${isGenerated ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}>
            
            <div className="flex items-center gap-2 mb-8 border-b pb-4 border-[#1e4a62]/10">
              <Users className="w-5 h-5 text-[#ffd800]" />
              <h2 className="text-xl font-black text-[#022f42]">Construct Ideal Customer Profile (ICP)</h2>
            </div>

            <div className="space-y-8">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-[#022f42] mb-2">Persona Name</label>
                <input 
                  type="text" 
                  value={personaName}
                  onChange={(e) => setPersonaName(e.target.value)}
                  placeholder="e.g., 'Enterprise CTO Sarah'"
                  className="w-full p-4 border-2 border-[#1e4a62]/20 rounded-sm focus:border-[#ffd800] focus:ring-0 outline-none transition-colors text-[#022f42] font-medium"
                />
              </div>

              {/* Demographics */}
              <div>
                <label className="block text-sm font-bold text-[#022f42] mb-2 flex justify-between">
                  <span>Demographics Matrix</span>
                  <span className="text-[#1e4a62]/50 text-xs font-normal">Select 1-2</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {demographicOptions.map((tag) => (
                     <button
                       key={tag}
                       onClick={() => toggleSelection(tag, selectedDemographics, setSelectedDemographics)}
                       className={`px-4 py-2 border text-sm font-bold rounded-sm transition-colors ${
                         selectedDemographics.includes(tag) 
                          ? "bg-[#022f42] text-white border-[#022f42]" 
                          : "bg-white text-[#1e4a62] border-[#1e4a62]/20 hover:border-[#022f42]"
                       }`}
                     >
                       {tag}
                     </button>
                  ))}
                </div>
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-bold text-[#022f42] mb-2 flex justify-between">
                  <span>Go-To-Market Channels</span>
                  <span className="text-[#1e4a62]/50 text-xs font-normal">Select acquisition paths</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {channelOptions.map((tag) => (
                     <button
                       key={tag}
                       onClick={() => toggleSelection(tag, selectedChannels, setSelectedChannels)}
                       className={`px-4 py-2 border text-sm font-bold rounded-sm transition-colors ${
                         selectedChannels.includes(tag) 
                          ? "bg-[#022f42] text-white border-[#022f42]" 
                          : "bg-white text-[#1e4a62] border-[#1e4a62]/20 hover:border-[#022f42]"
                       }`}
                     >
                       {tag}
                     </button>
                  ))}
                </div>
              </div>

              {/* Triggers */}
              <div>
                <label className="block text-sm font-bold text-[#022f42] mb-2 flex justify-between">
                  <span>Purchase Triggers</span>
                  {selectedTriggers.length === 0 && <span className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Missing Trigger</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {triggerOptions.map((tag) => (
                     <button
                       key={tag}
                       onClick={() => toggleSelection(tag, selectedTriggers, setSelectedTriggers)}
                       className={`px-4 py-2 border text-sm font-bold rounded-sm transition-colors ${
                         selectedTriggers.includes(tag) 
                          ? "bg-[#ffd800] text-[#022f42] border-[#ffd800]" 
                          : "bg-white text-[#1e4a62] border-[#1e4a62]/20 hover:border-[#ffd800]"
                       }`}
                     >
                       {tag}
                     </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setIsGenerated(true)}
                  disabled={!isReady}
                  className={`w-full py-4 font-bold text-sm tracking-widest uppercase transition-all shadow-sm rounded-sm flex items-center justify-center gap-2 ${
                    !isReady 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-[#ffd800] text-[#022f42] hover:bg-[#fff09e] hover:shadow-md"
                  }`}
                >
                  <Sparkles className="w-4 h-4" /> Synthesize Journey Map
                </button>
              </div>

            </div>
          </div>

          {/* AI Result State */}
          <AnimatePresence>
            {isGenerated && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 md:p-10 shadow-[0_15px_30px_-15px_rgba(2,47,66,0.1)] border-t-[4px] border-emerald-500 rounded-sm"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-[#022f42] flex items-center gap-2">
                    <MapIcon className="w-6 h-6 text-emerald-500" /> Customer Journey Map
                  </h3>
                  <button onClick={() => setIsGenerated(false)} className="text-xs font-bold text-[#1e4a62] border px-3 py-1 hover:bg-gray-50">Edit Profile</button>
                </div>

                {/* Simulated AI Journey Diagram */}
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-[#f2f6fa] -translate-y-1/2 z-0 hidden md:block"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    
                    <div className="bg-white border-2 border-[#1e4a62]/10 p-5 rounded-sm shadow-sm relative">
                      <div className="absolute -top-3 left-4 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-emerald-200">
                        1. Awareness
                      </div>
                      <p className="text-sm font-bold text-[#022f42] mt-2 mb-1">{personaName}</p>
                      <p className="text-xs text-[#1e4a62]">Is reached via <strong className="text-[#022f42]">{selectedChannels[0] || "Channels"}</strong>.</p>
                    </div>

                    <div className="bg-white border-2 border-[#1e4a62]/10 p-5 rounded-sm shadow-sm relative">
                      <div className="absolute -top-3 left-4 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border border-emerald-200">
                        2. Consideration
                      </div>
                      <p className="text-sm font-bold text-[#022f42] mt-2 mb-1">Evaluating Options</p>
                      <p className="text-xs text-[#1e4a62]">Driven by the urgent need of <strong className="text-[#022f42]">{selectedTriggers[0]}</strong>.</p>
                      {selectedTriggers.length === 0 && (
                        <p className="text-xs text-red-500 mt-2 font-bold">— Missing Trigger Flagged</p>
                      )}
                    </div>

                    <div className="bg-[#022f42] text-white p-5 rounded-sm shadow-sm relative border-2 border-[#022f42]">
                      <div className="absolute -top-3 left-4 bg-[#ffd800] text-[#022f42] text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                        3. Acquisition
                      </div>
                      <p className="text-sm font-bold text-[#ffd800] mt-2 mb-1">Conversion Event</p>
                      <p className="text-xs text-[#b0d0e0]">Commits to your solution as the primary vendor.</p>
                    </div>

                  </div>
                </div>

                <div className="mt-8 bg-amber-50 border border-amber-200 p-4 rounded-sm flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">AI Look-Alike Suggestion</h4>
                    <p className="text-xs text-amber-800 mt-1">Based on targeting {selectedDemographics.join(', ')} via {selectedChannels[0]}, similar startups also found success targeting <strong>Mid-Market Operations</strong> via <strong>Webinars</strong>. Consider expanding your TAM horizontally.</p>
                  </div>
                </div>
                
                <div className="pt-8 flex justify-end">
                  <Link href="/dashboard/audit/3-competitor" className="bg-[#022f42] text-white px-8 py-3 font-bold text-sm uppercase tracking-widest hover:bg-[#1b4f68] transition-colors shadow-md rounded-sm flex items-center gap-2">
                    Next: 1.1.3 Moat Analyzer <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Actionable Sidebar (Content Backbone) */}
        <div className="lg:w-[350px] space-y-4">
          <div className="bg-[#022f42] text-white p-6 rounded-sm shadow-md">
            <h3 className="flex items-center gap-2 font-bold mb-4 text-[#ffd800]">
              <Target className="w-5 h-5" /> VC Perspective
            </h3>
            <p className="text-sm text-[#b0d0e0] leading-relaxed mb-4">
              Investors want to see that you know your customer so well you can draw them. Avoid generic labels like &quot;everyone&quot;.
            </p>
            <div className="space-y-3">
              <div className="text-xs bg-white/5 p-3 rounded-sm border border-white/10 group hover:border-[#ffd800]/50 transition-colors">
                <span className="font-bold text-white block mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 text-[#ffd800]" /> Purchase Triggers
                </span>
                <span className="text-white/60">If you cannot identify a specific event that forces a purchase, VCs will assume sales cycles are unscalable.</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard/academy/how-to-create-a-customer-persona-that-investors-believe" className="group block bg-white border border-[#1e4a62]/10 p-5 rounded-sm hover:border-[#ffd800] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ffd800] bg-[#ffd800]/10 px-2 py-0.5 rounded-sm">Academy Guide</span>
              <ExternalLink className="w-3 h-3 text-[#1e4a62]/40 group-hover:text-[#ffd800]" />
            </div>
            <h4 className="font-bold text-[#022f42] group-hover:text-[#1b4f68] mb-1">How to Create a Customer Persona That Investors Believe</h4>
            <p className="text-xs text-[#1e4a62] flex items-center gap-1">Read the methodology <ChevronRight className="w-3 h-3" /></p>
          </Link>
        </div>
      </div>
    </div>
  );
}
