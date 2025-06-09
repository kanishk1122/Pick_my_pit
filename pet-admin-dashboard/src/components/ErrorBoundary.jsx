"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ErrorBoundary({ error, reset }) {
  const pathname = usePathname();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="max-w-md w-full p-6 bg-zinc-800 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">
          Something went wrong!
        </h2>
        <p className="text-zinc-300 mb-6">
          An error occurred while rendering this page. Please try again or
          contact support if the problem persists.
        </p>
        <div className="text-left bg-zinc-900 p-4 rounded mb-6 overflow-auto max-h-40">
          <p className="text-red-300 text-sm font-mono">
            {error.message || "Unknown error"}
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
