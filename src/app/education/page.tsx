"use client";

import { motion } from "framer-motion";
import { GraduationCap, PlayCircle, BookOpen, Sparkles } from "lucide-react";

export default function EducationHubPlaceholder() {
  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 text-[#022f42] min-h-[80vh] flex flex-col justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#f2f6fa] border-4 border-[#022f42] mb-6 shadow-sm text-[#022f42]">
          <GraduationCap className="w-10 h-10" />
        </div>
        <div className="inline-block px-4 py-1.5 bg-white border border-[#ffd800] text-[#022f42] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
          Phase 3 Curriculum
        </div>
        <h1 className="text-5xl font-bold mb-4 text-[#022f42]">Startup Capital Curriculum</h1>
        <p className="text-[#1e4a62] text-xl max-w-2xl mx-auto leading-relaxed">
          Tactical knowledge on scaling operations, mastering equity mechanics, and executing successful B2B go-to-market strategies across Asian borders. Free for early adopters.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border-t-4 border-[#022f42] shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] flex flex-col">
           <div className="aspect-video bg-[#022f42] flex items-center justify-center group cursor-pointer relative overflow-hidden">
             <div className="absolute inset-0 bg-[#ffd800]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <PlayCircle className="w-16 h-16 text-[#ffd800] opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
           </div>
           <div className="p-6 flex-grow flex flex-col">
             <h3 className="font-bold text-xl mb-3 text-[#022f42]">Cap Tables 101</h3>
             <p className="text-sm text-[#1e4a62] mb-6 flex-grow">A deep dive into dilution, option pools, and how SAFE notes convert over multiple priced rounds.</p>
             <div className="flex items-center text-xs font-bold text-[#ffd800] uppercase tracking-widest pt-4 border-t border-[rgba(2,47,66,0.12)]">
               <Sparkles className="w-3 h-3 mr-2" /> Early Access Unlocked
             </div>
           </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border-t-4 border-[#022f42] shadow-[0_25px_45px_-15px_rgba(2,47,66,0.15)] flex flex-col">
           <div className="aspect-video bg-[#022f42] flex items-center justify-center group cursor-pointer relative overflow-hidden">
             <div className="absolute inset-0 bg-[#ffd800]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <PlayCircle className="w-16 h-16 text-[#ffd800] opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
           </div>
           <div className="p-6 flex-grow flex flex-col">
             <h3 className="font-bold text-xl mb-3 text-[#022f42]">Enterprise B2B Hooks</h3>
             <p className="text-sm text-[#1e4a62] mb-6 flex-grow">How to structure pilots that mandatorily convert to 6-figure ACV contracts. Proven scripts included.</p>
             <div className="flex items-center text-xs font-bold text-[#ffd800] uppercase tracking-widest pt-4 border-t border-[rgba(2,47,66,0.12)]">
               <Sparkles className="w-3 h-3 mr-2" /> Early Access Unlocked
             </div>
           </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#f2f6fa] border border-[rgba(2,47,66,0.12)] shadow-sm flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
           <BookOpen className="w-12 h-12 text-[#1e4a62] mb-4 opacity-50" />
           <h3 className="font-bold text-lg mb-2 text-[#022f42]">Interactive LMS Architecture</h3>
           <p className="text-sm text-[#1e4a62] mb-6">Progress tracking, quizzes, and automated certifications coming in Phase 3.</p>
           <button disabled className="px-6 py-3 bg-white text-[#1e4a62] font-bold uppercase tracking-widest text-xs border border-[rgba(2,47,66,0.12)]">
             In Development
           </button>
        </motion.div>
      </div>
    </div>
  );
}
