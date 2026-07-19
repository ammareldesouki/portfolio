"use client";

import { AuthProvider } from "@/lib/auth-context";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="dark flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <AuthGuard>
        <div className="dark min-h-screen flex bg-[#050505] text-on-surface">
          <SideNavBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 md:ml-sidebar-width flex flex-col min-h-screen">
            <TopAppBar title="Dashboard" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
            <main className="flex-1 p-margin-mobile md:p-margin-desktop overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
