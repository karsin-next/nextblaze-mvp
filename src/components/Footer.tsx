"use client";

import Link from "next/link";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#022f42] text-[#b0d0e0] py-16 px-6 border-t-[3px] border-[#ffd800] w-full mt-auto">
      <div className="max-w-[1280px] mx-auto grid md:grid-cols-3 gap-12">
        <div>
          <div className="text-white font-bold text-3xl tracking-tight mb-3">
            Fundability<span className="text-[#ffd800]">OS</span>
          </div>
          <p className="text-sm text-[#b0d0e0]/80 mb-4">
            Get your startup fundable to scale across Asia.
          </p>
          {/* Privacy tagline */}
          <Link href="/privacy-promise" className="inline-flex items-center gap-2 text-[10px] font-bold text-[#ffd800]/70 hover:text-[#ffd800] transition-colors uppercase tracking-widest border border-[#ffd800]/20 px-3 py-1.5 rounded-sm hover:border-[#ffd800]/50">
            <Lock className="w-3 h-3" /> Our Privacy Promise
          </Link>
        </div>
        <div>
          <strong className="text-white block mb-2 font-semibold">Offices</strong>
          <p>Singapore · Tokyo<br/>Seoul · Kuala Lumpur</p>
        </div>
        <div>
          <strong className="text-white block mb-2 font-semibold">Contact</strong>
          <p>hello@nextblaze.asia</p>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-10 pt-6 border-t border-[#1b4f68] flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-medium text-sm">© {new Date().getFullYear()} FundabilityOS — All rights reserved.</p>
        <p className="text-[10px] text-[#b0d0e0]/60 flex items-center gap-1.5">
          <Lock className="w-3 h-3" />
          Just enough data. Just in time insights. Zero sensitive storage.
        </p>
      </div>
    </footer>
  );
}

