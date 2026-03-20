"use client";

import { motion } from "framer-motion";
import { Building2, Network, BadgeDollarSign, FileSignature } from "lucide-react";

export default function ExecutionEnginePlaceholder() {
  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 text-[#022f42] min-h-[80vh] flex flex-col justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#f2f6fa] border-4 border-[#022f42] mb-6 shadow-sm text-[#022f42]">
          <Building2 className="w-10 h-10" />
        </div>
        <div className="inline-block px-4 py-1.5 bg-[#022f42] text-white border-l-4 border-[#ffd800] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
          Phase 3 Transaction Hub
        </div>
        <h1 className="text-5xl font-bold mb-4 text-[#022f42]">Deal Execution Engine</h1>
        <p className="text-[#1e4a62] text-xl max-w-3xl mx-auto leading-relaxed">
          Transitioning from SaaS tool to Fintech platform. This engine handles the actual flow of capital, SPV creation, and legal deal closing.
        </p>
      </motion.div>

      <div className="bg-white shadow-[0_35px_55px_-18px_rgba(2,47,66,0.15)] border border-[rgba(2,47,66,0.12)] p-10 md:p-14 mb-10 overflow-hidden relative">
        {/* Abstract Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd800] rounded-full blur-[100px] opacity-20 -z-0 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="grid md:grid-cols-2 gap-12 relative z-10">
           <div>
             <h2 className="text-3xl font-bold text-[#022f42] mb-6">Closing rounds on-platform.</h2>
             <p className="text-[#1e4a62] leading-relaxed mb-6 font-medium text-lg">
               The ultimate goal of FundabilityOS. Once a startup aligns with an investor via the Deal Flow network, the Execution Engine structures the SAFE note or equity round instantly.
             </p>
             <ul className="space-y-4">
               <li className="flex items-start text-[#022f42] font-semibold">
                 <FileSignature className="w-6 h-6 text-[#ffd800] mr-4 shrink-0" />
                 <div>
                   <span className="block mb-1 text-lg">Automated Legal SPVs</span>
                   <span className="text-sm text-[#1e4a62] font-normal">Roll up multiple angel checks into a single cap table entry automatically.</span>
                 </div>
               </li>
               <li className="flex items-start text-[#022f42] font-semibold mt-4">
                 <Network className="w-6 h-6 text-[#ffd800] mr-4 shrink-0" />
                 <div>
                   <span className="block mb-1 text-lg">Escrow & API Wiring</span>
                   <span className="text-sm text-[#1e4a62] font-normal">Secure fund transfer mechanics baked directly into the FundabilityOS ecosystem.</span>
                 </div>
               </li>
             </ul>
           </div>
           
           <div className="bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] p-8 flex flex-col justify-center">
             <div className="text-center">
               <BadgeDollarSign className="w-16 h-16 text-[#ffd800] mx-auto mb-4" />
               <h3 className="text-2xl font-bold text-[#022f42] mb-3">1 - 2% Success Fee</h3>
               <p className="text-[#1e4a62] leading-relaxed text-sm">
                 Our ultimate monetization strategy. By facilitating the actual transaction, FundabilityOS takes a standard brokerage fee on capital successfully raised through the platform.
               </p>
               <div className="mt-8 pt-6 border-t border-[rgba(2,47,66,0.12)] text-xs font-bold uppercase tracking-widest text-[#022f42]">
                 Launching Q4 2024
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
