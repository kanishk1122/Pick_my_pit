import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { ReduxProvider } from "@/redux/provider";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pet Admin Dashboard",
  description: "Admin dashboard for pet management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-zinc-900`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
