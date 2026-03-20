"use client";

import { motion } from "framer-motion";
import { ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RecoverScreen() {
  const [submitted, setSubmitted] = useState(false);

  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f6fa] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#022f42] rounded-full blur-[100px] opacity-[0.03] -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center text-[#022f42] font-black text-3xl tracking-tight mb-8">
           Fundability<span className="text-yellow-500">OS</span>
        </Link>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white shadow-[0_35px_55px_-18px_rgba(2,47,66,0.15)] border-t-[6px] border-[#ffd800] p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <KeyRound className="w-10 h-10 text-[#ffd800] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#022f42] mb-2">Recover Access</h1>
            <p className="text-[#1e4a62] text-sm">We&apos;ll email you instructions to reset your password.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleRecover} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#022f42] mb-2">
                  Work Email
                </label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-3 bg-[#f2f6fa] border-2 border-transparent focus:border-[#ffd800] focus:bg-white focus:outline-none transition-all text-[#022f42] placeholder-[#1e4a62]/50 text-sm"
                  placeholder="founder@startup.com"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] border-2 border-[#022f42] hover:border-[#ffd800] py-4 font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center mt-6 shadow-md"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
               <h3 className="text-xl font-bold text-[#022f42] mb-2">Check your email</h3>
               <p className="text-sm text-[#1e4a62] leading-relaxed">
                 If an account exists for that email, we have sent a secure recovery link.
               </p>
            </div>
          )}

          <div className="mt-8 text-center border-t border-[rgba(2,47,66,0.12)] pt-6">
            <Link href="/login" className="text-[#022f42] font-bold hover:text-[#ffd800] transition-colors uppercase tracking-widest text-xs flex items-center justify-center">
              <ArrowLeft className="w-3 h-3 mr-2" /> Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
