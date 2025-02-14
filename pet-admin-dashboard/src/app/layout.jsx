import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/context/ThemeContext';
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <div className="flex">
            <Sidebar />
            <div className="pl-64 w-full">
              <Navbar />
              <main className="pt-16 min-h-screen bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:via-black dark:to-black">
                <div className="container mx-auto p-8 max-w-7xl">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
