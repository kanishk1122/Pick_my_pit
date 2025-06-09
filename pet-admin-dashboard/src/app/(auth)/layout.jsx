"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(true);

  // Add timeout for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log(
        "Already authenticated in auth layout, redirecting to dashboard"
      );
      router.push("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  // Simple loading indicator that won't get stuck forever
  if (loading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="text-white text-xl">Loading authentication...</div>
      </div>
    );
  }

  return <>{children}</>;
}
