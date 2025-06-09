"use client";
import { ThemeProvider } from "@/context/ThemeContext";

export function ThemeWrapper({ children }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">{children}</div>
    </ThemeProvider>
  );
}
