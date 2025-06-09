"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication status when component mounts or auth state changes
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        setAuthorized(true);
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading indicator while checking auth status
  if (loading || !authorized) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // If authorized, render children
  return <>{children}</>;
}
