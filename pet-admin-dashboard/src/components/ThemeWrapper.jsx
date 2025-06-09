"use client";
import { ThemeProvider } from "@/context/ThemeContext";

export function ThemeWrapper({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
