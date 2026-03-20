"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Compass, Briefcase, MessageSquare, Settings, Bell, Star } from "lucide-react";

export default function InvestorPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname === '/investor-portal/onboarding') return <>{children}</>;

  return (
    <div className="flex flex-1 min-h-screen overflow-hidden bg-white text-[#022f42]">
      <div className="w-64 bg-[#f2f6fa] border-r border-[#1e4a62]/10 hidden md:flex flex-col flex-shrink-0">
        <div className="py-6 px-4">
          <Link href="/">
             <div className="text-xl font-bold tracking-tight text-[#022f42] mb-8 px-3 flex items-center">
               NextBlaze<span className="text-[#ffd800] px-1 bg-[#022f42] rounded-sm ml-1 text-sm leading-tight tracking-widest uppercase py-0.5">Capital</span>
             </div>
          </Link>
          <div className="space-y-1">
            <Link href="/investor-portal" className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm ${pathname === '/investor-portal' ? 'bg-[#022f42] text-white font-bold' : 'text-[#1e4a62] hover:bg-[#e0e8f0]'}`}>
              <Compass className="w-4 h-4" /> <span>Deal Discovery</span>
            </Link>
            <Link href="#" className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm text-[#1e4a62] hover:bg-[#e0e8f0]`}>
              <Briefcase className="w-4 h-4" /> <span>My Portfolio</span>
            </Link>
            <Link href="#" className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm text-[#1e4a62] hover:bg-[#e0e8f0]`}>
              <Star className="w-4 h-4" /> <span>Saved Startups</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0 bg-white h-screen overflow-y-auto">
        <header className="h-16 border-b border-[#1e4a62]/10 flex items-center justify-end px-8 space-x-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 w-full">
          <button className="text-[#1e4a62] hover:text-[#022f42]"><Search className="w-5 h-5" /></button>
          <button className="text-[#1e4a62] hover:text-[#022f42]"><Bell className="w-5 h-5" /></button>
          <div className="w-8 h-8 rounded-full bg-[#ffd800] text-[#022f42] flex items-center justify-center font-bold text-xs uppercase cursor-pointer border border-[#022f42]/20">VC</div>
        </header>
        <main className="p-8 w-full max-w-[1400px]">
          {children}
        </main>
      </div>
    </div>
  );
}
