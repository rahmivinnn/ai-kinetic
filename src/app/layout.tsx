import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { MainNav } from "@/components/ui/main-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kinetic AI - Physiotherapy Platform",
  description: "AI-powered physiotherapy platform for personalized recovery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-border sticky top-0 z-50 bg-background">
              <div className="container mx-auto py-4">
                <MainNav />
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-border py-6 bg-muted/50">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Kinetic AI. All rights reserved.</p>
              </div>
            </footer>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
