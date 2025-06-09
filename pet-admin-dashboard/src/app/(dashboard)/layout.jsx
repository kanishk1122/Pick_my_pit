"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(true);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 8000); // 8 second fallback

    return () => clearTimeout(timer);
  }, []);

  // Check authentication status for dashboard access
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log(
        "Not authenticated in dashboard layout, redirecting to login"
      );
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Debug loading state
  useEffect(() => {
    console.log("Dashboard layout loading state:", {
      loading,
      showLoading,
      isAuthenticated,
    });
  }, [loading, showLoading, isAuthenticated]);

  // Show loading state only for a reasonable time
  if ((loading && showLoading) || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950">
        <div className="text-white text-xl mb-4">Loading dashboard...</div>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        {!loading && !isAuthenticated && (
          <div className="text-red-400 mt-4">
            Authentication failed. Redirecting to login...
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="ml-[20vw] ">
        {/* Top header */}
        <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 h-16 fixed top-0 right-0 left-64 z-10 flex items-center px-6">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-white">
              Pet Admin Dashboard
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-zinc-400">
              Logged in as: <span className="text-zinc-200">{user?.email}</span>
            </div>
            <button className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white">
              <i className="pi pi-bell text-xl"></i>
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className="pt-16 p-6">{children}</main>
      </div>
    </div>
  );
}
