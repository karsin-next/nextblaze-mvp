"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const company = (form.elements.namedItem("company") as HTMLInputElement).value;
    const founderName = (form.elements.namedItem("founderName") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const role = (form.elements.namedItem("role") as HTMLSelectElement).value;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, founderName, email, password, role }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    await refresh();
    router.push(data.role === "investor" ? "/investor-portal" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f2f6fa] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ffd800] rounded-full blur-[100px] opacity-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center text-[#022f42] font-black text-3xl tracking-tight mb-8">
           Fundability<span className="text-yellow-500">OS</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-[0_35px_55px_-18px_rgba(2,47,66,0.15)] border-t-[6px] border-[#022f42] p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#022f42] mb-2">Create Account</h1>
            <p className="text-[#1e4a62] text-sm font-semibold flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-[#ffd800] mr-2" /> 100% Free for Early Adopters
            </p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 mb-6 text-center">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-black text-[#022f42] uppercase tracking-widest mb-1.5 block">Company Name</label>
              <input name="company" type="text" required className="w-full px-4 py-3 bg-[#f2f6fa] border-2 border-transparent focus:border-[#ffd800] focus:bg-white focus:outline-none transition-all text-[#022f42] placeholder-[#1e4a62]/50 text-sm" placeholder="Your Startup Name" />
            </div>
            <div>
              <label className="text-xs font-black text-[#022f42] uppercase tracking-widest mb-1.5 block">Founder Full Name</label>
              <input name="founderName" type="text" required className="w-full px-4 py-3 bg-[#f2f6fa] border-2 border-transparent focus:border-[#ffd800] focus:bg-white focus:outline-none transition-all text-[#022f42] placeholder-[#1e4a62]/50 text-sm" placeholder="e.g. Jane Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#022f42] mb-2">Work Email</label>
              <input name="email" type="email" required className="w-full px-4 py-3 bg-[#f2f6fa] border-2 border-transparent focus:border-[#ffd800] focus:bg-white focus:outline-none transition-all text-[#022f42] placeholder-[#1e4a62]/50 text-sm" placeholder="founder@startup.com" />
              {/* Privacy trust badge */}
              <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded-sm">
                <span className="text-green-600 text-base">🔒</span>
                <p className="text-[10px] text-green-800 leading-tight">
                  <strong>Just enough data. Just in time insights.</strong> We ask only what&apos;s needed to help you today. No bank details required to start.
                </p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#022f42] mb-2">Secure Password</label>
              <input name="password" type="password" required minLength={6} className="w-full px-4 py-3 bg-[#f2f6fa] border-2 border-transparent focus:border-[#ffd800] focus:bg-white focus:outline-none transition-all text-[#022f42] placeholder-[#1e4a62]/50 text-sm tracking-widest" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#022f42] mb-2">I am a...</label>
              <select name="role" className="w-full px-4 py-3 bg-[#f2f6fa] border-2 border-transparent focus:border-[#ffd800] focus:bg-white focus:outline-none transition-all text-[#022f42] text-sm">
                <option value="startup">Startup / SME Founder</option>
                <option value="investor">Investor / VC / Angel</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] border-2 border-[#022f42] hover:border-[#ffd800] py-4 font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center mt-6 disabled:opacity-50">
              {loading ? "Creating account..." : <>Sign Up <ArrowRight className="w-4 h-4 ml-2" /></>}
            </button>
            <p className="text-[10px] text-center text-[#1e4a62] mt-2">
              By signing up you agree to our{" "}
              <Link href="/privacy-promise" className="underline font-bold hover:text-[#022f42]">Privacy Promise</Link>.
              Zero sensitive data stored. Ever.
            </p>
          </form>

          <div className="mt-8 text-center border-t border-[rgba(2,47,66,0.12)] pt-6">
            <p className="text-[#1e4a62] text-xs leading-relaxed">
              Already have an account? <br />
              <Link href="/login" className="text-[#022f42] font-bold hover:text-[#ffd800] transition-colors underline decoration-2 underline-offset-4 mt-1 inline-block">Sign in here</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

