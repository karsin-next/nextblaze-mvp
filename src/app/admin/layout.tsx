"use client";
import Link from "next/link";
import { Users, LogOut, Building, Activity, MessageSquare } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'startups';
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem("admin_auth_token");
      if (!isAuth) {
        router.push("/admin/login");
      } else {
        setAuth(true);
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth_token");
    router.push("/admin/login");
  };

  if (pathname === '/admin/login') return <>{children}</>;
  if (!auth) return <div className="min-h-screen bg-[#f2f6fa] flex items-center justify-center font-bold text-[#022f42] text-sm uppercase tracking-widest animate-pulse">Verifying Secure Gateway...</div>;

  return (
    <div className="flex flex-1 min-h-screen overflow-hidden bg-[#f2f6fa] text-[#022f42]">
      <div className="w-64 bg-white border-r border-[#1e4a62]/10 hidden md:flex flex-col flex-shrink-0 shadow-xl z-20 relative">
        <div className="py-6 px-4">
          <div className="text-xl font-black tracking-tight text-[#022f42] mb-8 px-3 border-b border-[#1e4a62]/10 pb-6 flex items-center">
            NextBlaze<span className="text-[#ffd800] px-1.5 py-0.5 bg-[#022f42] rounded-sm ml-1 text-[10px] tracking-widest uppercase shadow-inner">Admin</span>
          </div>
          
          <h2 className="text-[10px] font-bold text-[#1e4a62] uppercase tracking-widest mb-4 px-3">System Routing</h2>
          <nav className="space-y-2">
            <Link 
              href="/admin?view=startups" 
              className={`flex items-center space-x-3 px-3 py-3 rounded-sm font-black transition-all ${currentView === 'startups' ? 'bg-[#f2f6fa] border-l-4 border-l-[#022f42] text-[#022f42] shadow-inner' : 'text-[#1e4a62]/70 hover:bg-gray-50 hover:text-[#022f42]'}`}
            >
              <Activity className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">Startup CRM</span>
            </Link>
            
            <Link 
              href="/admin?view=investors" 
              className={`flex items-center space-x-3 px-3 py-3 rounded-sm font-black transition-all ${currentView === 'investors' ? 'bg-[#f2f6fa] border-l-4 border-l-[#022f42] text-[#022f42] shadow-inner' : 'text-[#1e4a62]/70 hover:bg-gray-50 hover:text-[#022f42]'}`}
            >
              <Building className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">Investor CRM</span>
            </Link>

            <Link 
              href="/admin/telemetry" 
              className={`flex items-center space-x-3 px-3 py-3 rounded-sm font-black transition-all ${pathname === '/admin/telemetry' ? 'bg-[#f2f6fa] border-l-4 border-l-[#ffd800] text-[#022f42] shadow-inner' : 'text-[#1e4a62]/70 hover:bg-gray-50 hover:text-[#022f42]'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs uppercase tracking-widest">User Feedback</span>
            </Link>
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-[#1e4a62]/10 pb-8 bg-white z-10 w-full relative">
           <div className="bg-[#f2f6fa] p-3 rounded-sm mb-4 border border-[#1e4a62]/5 w-full overflow-hidden">
              <div className="text-[9px] font-bold uppercase tracking-widest text-[#1e4a62]">Active Operator</div>
              <div className="text-xs font-black text-[#022f42] truncate w-full block mt-0.5" title="karsin@nextblaze.asia">karsin@nextblaze.asia</div>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-3 py-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white font-black transition-colors rounded-sm text-[10px] uppercase tracking-widest border border-red-200 hover:border-red-600 shadow-sm">
             <LogOut className="w-3.5 h-3.5" />
             <span>Terminate Master Session</span>
           </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0 bg-[#f2f6fa] h-screen overflow-y-auto p-4 md:p-8 lg:p-12 relative">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout(props: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f2f6fa] flex items-center justify-center font-bold text-[#022f42]">Loading Database Subsystem...</div>}>
      <AdminLayoutContent {...props} />
    </Suspense>
  );
}
