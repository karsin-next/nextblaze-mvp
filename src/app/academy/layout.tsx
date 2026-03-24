"use client";

import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#022f42] border-t-[#ffd800] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-1 overflow-hidden bg-[#f2f6fa]">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-[#f2f6fa]">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
