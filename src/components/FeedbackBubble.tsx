"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bug, Lightbulb, X, Send, CheckCircle2 } from "lucide-react";

export function FeedbackBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"bug" | "feature">("bug");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Persist to localStorage for Admin Dashboard
    const entry = {
      id: Date.now(),
      type,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: "open"
    };
    const existing = JSON.parse(localStorage.getItem('feedback_submissions') || '[]');
    existing.push(entry);
    localStorage.setItem('feedback_submissions', JSON.stringify(existing));

    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => {
        setSubmitted(false);
        setMessage("");
      }, 500);
    }, 2000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-[#022f42] text-[#ffd800] rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform border border-[#1e4a62]/20 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Floating Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 bg-white shadow-[0_20px_40px_-15px_rgba(2,47,66,0.2)] rounded-sm z-[9999] border border-[#1e4a62]/10 overflow-hidden flex flex-col"
          >
            {submitted ? (
              <div className="p-8 flex flex-col items-center justify-center text-center h-64">
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
                <h4 className="font-black text-[#022f42] text-lg mb-1">Feedback Logged.</h4>
                <p className="text-xs text-[#1e4a62] font-medium leading-relaxed">Your message has been received. The NextBlaze team will review it shortly.</p>
              </div>
            ) : (
              <>
                <div className="bg-[#022f42] p-4 flex justify-between items-center text-white">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#ffd800]">YES, HOW CAN I HELP?</div>
                  <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-5 flex-1">
                  <div className="flex bg-[#f2f6fa] p-1 rounded-sm border border-[#1e4a62]/10 mb-4">
                    <button 
                      onClick={() => setType("bug")}
                      className={`flex-1 flex items-center justify-center py-2 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors ${type === 'bug' ? 'bg-white text-red-600 shadow-sm border border-red-100' : 'text-[#1e4a62] hover:bg-[#e4ebf2]'}`}
                    >
                      <Bug className="w-3.5 h-3.5 mr-1.5" /> Bug Report
                    </button>
                    <button 
                      onClick={() => setType("feature")}
                      className={`flex-1 flex items-center justify-center py-2 text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors ${type === 'feature' ? 'bg-white text-blue-600 shadow-sm border border-blue-100' : 'text-[#1e4a62] hover:bg-[#e4ebf2]'}`}
                    >
                      <Lightbulb className="w-3.5 h-3.5 mr-1.5" /> Idea / Feature
                    </button>
                  </div>
                  
                  <textarea 
                    autoFocus
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={type === 'bug' ? "Describe the issue clearly..." : "What feature would accelerate your startup?"}
                    className="w-full h-32 p-3 text-sm text-[#022f42] font-medium border border-[#1e4a62]/20 rounded-sm focus:outline-none focus:border-[#022f42] resize-none mb-4"
                  />
                  
                  <button 
                    onClick={handleSubmit} 
                    disabled={!message.trim()}
                    className={`w-full p-3 text-[10px] font-black uppercase tracking-widest rounded-sm transition-all flex justify-center items-center ${!message.trim() ? 'bg-[#f2f6fa] text-[#1e4a62]/50 border border-[#1e4a62]/10 cursor-not-allowed' : 'bg-[#022f42] text-white border border-[#022f42] hover:bg-[#ffd800] hover:text-[#022f42] hover:border-[#ffd800] shadow-md cursor-pointer'}`}
                  >
                    Transmit Data <Send className="w-3.5 h-3.5 ml-2" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
