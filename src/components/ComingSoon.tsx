"use client";

import { motion } from "framer-motion";
import { Clock, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  module: string;
  title: string;
  description: string;
  phase: string;
  eta?: string;
}

export function ComingSoon({ module, title, description, phase, eta }: Props) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          {/* Badge */}
          <div className="inline-flex items-center bg-[#ffd800] text-[#022f42] font-bold px-4 py-1.5 mb-6 text-[10px] uppercase tracking-widest rounded-sm shadow-md">
            <Clock className="w-3.5 h-3.5 mr-2" />
            Coming Soon — {phase}
          </div>

          {/* Pulsing icon */}
          <div className="w-20 h-20 bg-[#022f42] rounded-sm flex items-center justify-center mx-auto mb-6 shadow-2xl relative">
            <Sparkles className="w-8 h-8 text-[#ffd800] animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ffd800] rounded-full animate-ping" />
          </div>

          {/* Module tag */}
          <div className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest mb-2">{module}</div>
          <h1 className="text-3xl font-black text-[#022f42] mb-4 tracking-tight">{title}</h1>
          <p className="text-[#1e4a62] text-sm leading-relaxed mb-8 max-w-md mx-auto">{description}</p>

          {/* ETA */}
          {eta && (
            <div className="inline-block bg-white border border-[#1e4a62]/10 text-[#1e4a62] text-xs font-bold px-5 py-2 rounded-sm shadow-sm mb-8">
              Estimated: {eta}
            </div>
          )}

          {/* Progress bar (decorative) */}
          <div className="h-1.5 bg-[#f2f6fa] rounded-full overflow-hidden mb-8 mx-auto max-w-xs">
            <motion.div
              className="h-full bg-[#ffd800] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "35%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>

          <Link href="/dashboard" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#022f42] hover:text-[#1e4a62] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Back to Dashboard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
