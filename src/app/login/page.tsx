"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    await refresh();
    router.push(data.role === "investor" ? "/investor-portal" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f2f6fa] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#022f42] rounded-full blur-[100px] opacity-[0.03] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center text-[#022f42] font-black text-3xl tracking-tight mb-8">
           Fundability<span className="text-yellow-500">OS</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-[0_35px_55px_-18px_rgba(2,47,66,0.15)] border-t-[6px] border-[#022f42] p-8 md:p-10">
          <div className="text-center mb-8">
            <p className="text-[#1e4a62] text-sm">Secure sign in for Early Adopters</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 mb-6 text-center">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#022f42] mb-2">Work Email</label>
              <input name="email" type="email" required className="w-full px-4 py-3 bg-[#f2f6fa] border-2 border-transparent focus:border-[#ffd800] focus:bg-white focus:outline-none transition-all text-[#022f42] placeholder-[#1e4a62]/50 text-sm" placeholder="founder@startup.com" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#022f42] mb-2">Secure Password</label>
              <input name="password" type="password" required className="w-full px-4 py-3 bg-[#f2f6fa] border-2 border-transparent focus:border-[#ffd800] focus:bg-white focus:outline-none transition-all text-[#022f42] placeholder-[#1e4a62]/50 text-sm tracking-widest" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center text-sm text-[#1e4a62] cursor-pointer">
                <input type="checkbox" className="mr-2 accent-[#022f42]" /> Remember device
              </label>
              <Link href="/recover" className="text-xs font-bold text-[#022f42] hover:text-[#ffd800] transition-colors">Recover access</Link>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#022f42] text-white hover:bg-[#ffd800] hover:text-[#022f42] border-2 border-[#022f42] hover:border-[#ffd800] py-4 font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center mt-6 disabled:opacity-50">
              {loading ? "Signing in..." : <>Access System <ArrowRight className="w-4 h-4 ml-2" /></>}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[rgba(2,47,66,0.12)] pt-6">
            <Lock className="w-4 h-4 text-[#1e4a62] mx-auto mb-3 opacity-50" />
            <p className="text-[#1e4a62] text-xs leading-relaxed">
              Don&apos;t have an account yet? <br />
              <Link href="/register" className="text-[#022f42] font-bold hover:text-[#ffd800] transition-colors underline decoration-2 underline-offset-4 mt-1 inline-block">Join the Early Adopter Program</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
