"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Map, 
  Target, 
  FileText, 
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  LineChart,
  School
} from "lucide-react";

const navigation = [
  { name: "Fundability Score", href: "/dashboard", icon: Target },
  { name: "Financial Health", href: "/dashboard/financials", icon: BarChart3 },
  { name: "Fundraising Roadmap", href: "/dashboard/roadmap", icon: Map },
  { name: "Investor Snapshot", href: "/dashboard/snapshot", icon: FileText },
];

const ecosystemNav = [
  { name: "Investor Portal", href: "/investor-portal", icon: LayoutDashboard, placeholder: true },
  { name: "Education Hub", href: "/education", icon: School, placeholder: true },
  { name: "Deal Execution", href: "/execution", icon: ShieldCheck, placeholder: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 glass border-r border-slate-800/50 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blaze-400 to-blaze-600">
              NextBlaze
            </span>
          </div>
          <nav className="p-4 space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
              Fundability OS
            </div>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-blaze-500/10 text-blaze-400 border border-blaze-500/20" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-2">
              Ecosystem
            </div>
            {ecosystemNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-800/30 transition-colors"
                title="Coming Soon in Phase 2/3"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 opacity-70" />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Soon</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800/50">
          <Link href="/" className="flex items-center space-x-3 text-slate-400 hover:text-white px-3 py-2 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
