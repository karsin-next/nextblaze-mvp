"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "karsin@nextblaze.asia" && password === "NextBlazeAdmin2024!") {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem("admin_auth_token", "true");
      }
      router.push("/admin");
    } else {
      setError("Invalid credentials. System Operators only.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f6fa] flex items-center justify-center p-4 text-[#022f42]">
      <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-[0_15px_30px_-10px_rgba(2,47,66,0.1)] border border-[#1e4a62]/10">
        <div className="text-center mb-8 border-b border-[#1e4a62]/10 pb-6">
           <div className="w-14 h-14 bg-[#022f42] rounded-md mx-auto mb-4 flex items-center justify-center text-[#ffd800] shadow-inner border border-[#022f42]">
             <Lock className="w-7 h-7" />
           </div>
           <h1 className="text-3xl font-black mb-1 text-[#022f42] tracking-tight">Operator Gateway</h1>
           <p className="text-[#1e4a62] text-[10px] font-bold uppercase tracking-widest mt-2">NextBlaze Central Auth</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-700 p-3 text-[10px] uppercase font-bold mb-6 rounded-sm border border-red-200 text-center tracking-widest">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
           <div>
             <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block mb-1.5">Operator Email</label>
             <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-4 border border-[#1e4a62]/20 font-bold text-sm outline-none focus:border-[#022f42] bg-[#f2f6fa]" placeholder="karsin@nextblaze.asia" />
           </div>
           <div>
             <label className="text-[10px] font-bold uppercase tracking-widest text-[#022f42] block mb-1.5">Master Password</label>
             <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-4 border border-[#1e4a62]/20 font-bold text-sm outline-none focus:border-[#022f42] bg-[#f2f6fa]" placeholder="••••••••" />
           </div>
           
           <button type="submit" className="w-full bg-[#022f42] text-white p-4 font-bold uppercase tracking-widest text-xs hover:bg-[#ffd800] hover:text-[#022f42] transition-colors flex justify-center items-center rounded-sm mt-8 shadow-md">
              Authenticate Operator <ArrowRight className="w-4 h-4 ml-2" />
           </button>
        </form>
      </div>
    </div>
  );
}
