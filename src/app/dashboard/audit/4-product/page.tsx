"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Code2, Rocket, PlayCircle, Link as LinkIcon, UploadCloud, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const stages = [
  { id: 1, label: "Concept", desc: "Idea phase, market research, wireframes.", icon: Lightbulb, score: 10 },
  { id: 2, label: "Prototype", desc: "Non-functional mockup or click-through demo.", icon: Code2, score: 30 },
  { id: 3, label: "MVP (Beta)", desc: "Core features built. Private testing with early users.", icon: Rocket, score: 60 },
  { id: 4, label: "Live Product", desc: "Publicly available. Active user base.", icon: PlayCircle, score: 100 },
];

export default function ProductReadinessPage() {

  const { user } = useAuth();
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(2);
  const [demoLink, setDemoLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`audit_4-product_data_${user?.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.currentStage) setCurrentStage(parsed.currentStage);
          if (parsed.demoLink) setDemoLink(parsed.demoLink);
        } catch(e) {}
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`audit_4-product_data_${user?.id}`, JSON.stringify({ currentStage, demoLink }));
    }
  }, [currentStage, demoLink]);
  const [uploadMock, setUploadMock] = useState(false);

  const simulateUpload = () => {
    setUploadMock(true);
    setTimeout(() => {
      setUploadMock(false);
      setDemoLink("uploaded_demo_v2.mp4 (Ready for Analysis)");
    }, 1500);
  };

  const submitModule = async () => {
    setIsSubmitting(true);
    if (typeof window !== 'undefined') localStorage.setItem(`audit_4-product_${user?.id}`, 'completed');
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 min-h-[calc(100vh-100px)]">
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
         <div>
           <div className="inline-block bg-[#ffd800] text-[#022f42] font-bold px-3 py-1 mb-2 text-[10px] uppercase tracking-widest">
             Module 1.1.4
           </div>
           <h1 className="text-xl font-bold text-[#022f42]">Product Readiness</h1>
         </div>
         <Link href="/dashboard" className="text-xs font-bold text-[#1e4a62] uppercase tracking-widest hover:text-[#022f42]">
           Back to Hub
         </Link>
      </div>

      <div className="bg-white border border-[rgba(2,47,66,0.1)] p-8 shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] mb-8">
        <h2 className="text-lg font-bold text-[#022f42] mb-8">Where is your product today?</h2>
        
        {/* Interactive Timeline Slider */}
        <div className="relative mb-16 px-4">
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#f2f6fa] -translate-y-1/2 mx-4 z-0"></div>
          <motion.div 
            className="absolute top-1/2 left-0 h-2 bg-[#022f42] -translate-y-1/2 mx-4 z-0 transition-all duration-300"
            style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
          ></motion.div>

          <div className="flex justify-between relative z-10">
            {stages.map((stage) => {
              const isActive = currentStage === stage.id;
              const isPast = currentStage > stage.id;
              
              return (
                <div 
                  key={stage.id} 
                  className="flex flex-col items-center cursor-pointer group w-24"
                  onClick={() => setCurrentStage(stage.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mb-3 border-4 ${isActive ? "bg-[#ffd800] border-[#022f42] scale-125 shadow-lg" : isPast ? "bg-[#022f42] border-[#022f42] text-white" : "bg-white border-[rgba(2,47,66,0.2)] text-[rgba(2,47,66,0.4)] group-hover:border-[#022f42]"}`}>
                    <stage.icon className={`w-4 h-4 ${isActive ? "text-[#022f42]" : ""}`} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest text-center transition-colors ${isActive ? "text-[#022f42]" : "text-[#1e4a62] opacity-60"}`}>
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Details */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#f2f6fa] p-6 border-l-4 border-[#022f42] mb-8"
          >
            <h3 className="text-sm font-bold text-[#022f42] mb-1">{stages[currentStage-1].label} Phase</h3>
            <p className="text-xs text-[#1e4a62]">{stages[currentStage-1].desc}</p>
            
            <div className="mt-4 pt-4 border-t border-[rgba(2,47,66,0.08)] flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e4a62]">Investor Readiness Signal:</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${currentStage >= 3 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {currentStage >= 3 ? "Traction Ready" : "Vision Capital"}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Evidence Upload */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#022f42]">Provide Evidence (Optional)</h3>
          <p className="text-xs text-[#1e4a62] mb-4">A tangible demo drastically improves early-stage fundability. Our AI will analyze your product flow.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[rgba(2,47,66,0.15)] p-4 focus-within:border-[#022f42] transition-colors relative">
              <label className="text-[9px] font-bold uppercase tracking-widest text-[#1e4a62] absolute -top-2 left-3 bg-white px-1">Demo Link</label>
              <div className="flex items-center mt-2">
                <LinkIcon className="w-4 h-4 text-[rgba(2,47,66,0.4)] mr-2" />
                <input 
                  type="url" 
                  value={demoLink}
                  onChange={(e) => setDemoLink(e.target.value)}
                  placeholder="https://yourapp.com or Figma prototype" 
                  className="w-full bg-transparent text-sm outline-none text-[#022f42] placeholder:text-[rgba(2,47,66,0.3)]"
                />
              </div>
            </div>

            <div 
              className={`border border-[rgba(2,47,66,0.15)] border-dashed p-4 flex items-center justify-center cursor-pointer transition-colors ${uploadMock ? "bg-[#f2f6fa]" : "hover:bg-[#f2f6fa] hover:border-[#022f42]"}`}
              onClick={simulateUpload}
            >
              {uploadMock ? (
                 <div className="w-5 h-5 border-2 border-[#1e4a62] border-t-transparent flex items-center rounded-full animate-spin"></div>
              ) : (
                <div className="flex items-center text-xs font-bold text-[#1e4a62] uppercase tracking-widest">
                  <UploadCloud className="w-4 h-4 mr-2" /> Upload Video
                </div>
              )}
            </div>
          </div>
          
          {demoLink.includes("Ready for Analysis") && (
            <div className="mt-2 text-[10px] font-bold text-green-600 flex items-center bg-green-50 p-2 border border-green-200">
               <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> File securely uploaded. AI analysis will run in the background.
            </div>
          )}
        </div>

      </div>

      <button 
        onClick={submitModule}
        disabled={isSubmitting}
        className="w-full p-4 bg-[#022f42] text-white font-bold tracking-widest uppercase text-sm border-2 border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] transition-colors flex items-center justify-center shadow-lg"
      >
        {isSubmitting ? "Updating Profile..." : <><span className="mr-2">Save Readiness Stage</span> <ArrowRight className="w-4 h-4" /></>}
      </button>

    </div>
  );
}
