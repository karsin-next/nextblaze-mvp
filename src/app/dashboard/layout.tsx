"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap, PieChart, Map, FileText, BarChart3,
  CheckSquare, FolderOpen, GraduationCap, ShieldCheck, Eye, Target, Settings,
  Calculator, Activity, Users, Table2, FileSearch, Kanban,
  ChevronRight, User, Lightbulb, Swords, Package, Globe, TrendingUp, DollarSign, HeartHandshake,
  LineChart, LayoutDashboard, Layers
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Full sitemap tree structure
const siteMap = [
  {
    label: "Week 1: DIAGNOSE",
    items: [
      {
        name: "360° Fundability Audit",
        href: "/dashboard",
        icon: Zap,
        children: [
          { name: "1.1 Problem & Hypothesis", href: "/dashboard/audit/1-problem", icon: Lightbulb },
          { name: "1.2 Customer Persona", href: "/dashboard/audit/2-customer", icon: User },
          { name: "1.3 Competitor Analysis", href: "/dashboard/audit/3-competitor", icon: Swords },
          { name: "1.4 Product Stage", href: "/dashboard/audit/4-product", icon: Package },
          { name: "1.5 Market Opportunity", href: "/dashboard/audit/5-market", icon: Globe },
          { name: "1.6 Traction & PMF", href: "/dashboard/audit/6-pmf", icon: TrendingUp },
          { name: "1.7 Revenue Model", href: "/dashboard/audit/7-revenue", icon: DollarSign },
          { name: "1.8 Team Composition", href: "/dashboard/audit/8-team", icon: HeartHandshake },
        ],
      },
      { name: "Live Fundability Score", href: "/dashboard/score", icon: Target },
      { name: "Gap Analysis Report", href: "/dashboard/gap-report", icon: BarChart3 },
    ],
  },
  {
    label: "Week 2: ACTIVATE",
    items: [
      { name: "Financials Connect", href: "/dashboard/financials", icon: PieChart,
        children: [
          { name: "Unit Economics", href: "/dashboard/unit-economics", icon: LineChart },
        ],
      },
      { name: "Investor Dashboard", href: "/dashboard/metrics", icon: LayoutDashboard },
      { name: "Valuation & Strategy", href: "/dashboard/strategy", icon: Map },
      { name: "AFN Forecaster", href: "/dashboard/afn-calculator", icon: Calculator },
      { name: "Data Room Builder", href: "/dashboard/data-room", icon: FolderOpen },
    ],
  },
  {
    label: "Week 3: ACCELERATE",
    items: [
      { name: "Gap Closure Workbench", href: "/dashboard/workbench", icon: Activity },
      { name: "VC Matcher Network", href: "/dashboard/investors", icon: Users },
      { name: "Action Plan / Roadmap", href: "/dashboard/roadmap", icon: CheckSquare },
      { name: "Toolbox & Templates", href: "/dashboard/templates", icon: FolderOpen, soon: true },
      { name: "Micro-Lessons", href: "/dashboard/lessons", icon: GraduationCap, soon: true },
    ],
  },
  {
    label: "Week 4: PACKAGE",
    items: [
      { name: "Investor Snapshot", href: "/dashboard/snapshot", icon: FileText },
      { name: "Verified Badge", href: "/dashboard/badge", icon: ShieldCheck, soon: true },
      { name: "Visibility Toggle", href: "/dashboard/visibility", icon: Eye, soon: true },
    ],
  },
  {
    label: "Phase 4: SYNDICATE",
    items: [
      { name: "Cap Table Simulator", href: "/dashboard/cap-table", icon: Table2, soon: true },
      { name: "Term Sheet Analyzer", href: "/dashboard/term-sheet", icon: FileSearch, soon: true },
      { name: "Investor CRM", href: "/dashboard/crm", icon: Kanban, soon: true },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Company Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [identity, setIdentity] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`startup_profile_${user.id}`);
      if (saved) {
        try { setIdentity(JSON.parse(saved)); } catch(e) {}
      }
    }
  }, [user?.id]);

  const isActive = (href: string) => pathname === href;
  const isAnyChildActive = (children?: { href: string }[]) =>
    children?.some(c => pathname === c.href) ?? false;

  return (
    <div className="flex flex-1 overflow-hidden bg-[#f2f6fa]">
      {/* Sidebar */}
      <div className="w-64 bg-[#022f42] border-r border-[#1b4f68] hidden md:flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="py-5">

          {/* User Identity Box */}
          <div className="px-4 mb-5">
            {identity ? (
              <div className="bg-white/5 border border-[#1b4f68] p-3 rounded-sm shadow-inner">
                <div className="w-8 h-8 bg-[#ffd800] text-[#022f42] rounded-sm font-black flex items-center justify-center text-lg mb-2 shadow-sm">
                  {identity.companyName ? identity.companyName.charAt(0) : "S"}
                </div>
                <h2 className="text-sm font-bold text-white leading-tight truncate">{identity.companyName || "Unregistered Startup"}</h2>
                <p className="text-[10px] text-[#b0d0e0] font-medium mt-0.5 truncate">{identity.founderName || "Founder"}</p>
                {user?.email && <p className="text-[9px] text-white/70 truncate leading-tight mt-1 bg-black/20 px-1.5 py-0.5 rounded-sm">{user.email}</p>}
              </div>
            ) : (
              <div className="bg-white/5 border border-[#1b4f68] p-3 rounded-sm shadow-inner cursor-pointer" onClick={() => window.location.href='/dashboard/settings'}>
                <h2 className="text-sm font-bold text-[#ffd800] leading-tight truncate">{user?.company || "Unregistered Startup"}</h2>
                {user?.email && <p className="text-[9px] text-white/70 truncate leading-tight mt-1 bg-black/20 px-1.5 py-0.5 rounded-sm">{user.email}</p>}
              </div>
            )}
          </div>

          {/* Full Sitemap Navigation */}
          {siteMap.map((section) => (
            <div key={section.label} className="mt-4">
              {/* Section header */}
              <div className="px-4 mb-1">
                <h3 className="text-[9px] font-black text-[#b0d0e0]/60 uppercase tracking-widest">{section.label}</h3>
              </div>

              <nav className="px-2 space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const childActive = isAnyChildActive((item as any).children);

                  return (
                    <div key={item.href}>
                      {/* Top-level item */}
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-sm transition-colors text-[12px] group ${
                          active
                            ? "bg-[#1b4f68] text-[#ffd800] font-black"
                            : childActive
                            ? "text-white font-semibold"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <item.icon className={`w-3.5 h-3.5 shrink-0 ${active ? "text-[#ffd800]" : childActive ? "text-white/80" : "text-white/40 group-hover:text-white/60"}`} />
                          <span className={`truncate ${active ? "text-[#ffd800] font-black" : ""}`}>{item.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {(item as any).soon && (
                            <span className="text-[7px] font-black uppercase tracking-widest text-[#ffd800]/50 bg-[#ffd800]/10 px-1 py-0.5 rounded-sm">Soon</span>
                          )}
                          {(item as any).children && (
                            <ChevronRight className={`w-3 h-3 ${childActive ? "text-[#ffd800]" : "text-white/30"}`} />
                          )}
                        </div>
                      </Link>

                      {/* Sub-items (level 2) */}
                      {(item as any).children && (
                        <div className="ml-3 mt-0.5 mb-1 border-l border-[#1b4f68]/60 pl-2 space-y-0.5">
                          {(item as any).children.map((child: any) => {
                            const childIsActive = isActive(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`flex items-center gap-2 px-2 py-1 rounded-sm transition-colors text-[11px] ${
                                  childIsActive
                                    ? "bg-[#1b4f68] text-[#ffd800] font-black"
                                    : "text-white/50 hover:text-white hover:bg-white/5"
                                }`}
                              >
                                <child.icon className={`w-3 h-3 shrink-0 ${childIsActive ? "text-[#ffd800]" : "text-white/30"}`} />
                                <span className={childIsActive ? "text-[#ffd800] font-black" : ""}>{child.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          ))}

        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f2f6fa]">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
