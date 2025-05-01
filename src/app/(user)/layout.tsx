'use client';

// Removed sidebar imports
import UserNavbar from "@/components/user/navbar-updated";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check for token in both localStorage and cookies
    const token = localStorage.getItem('token');
    const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('token='));

    if (!loading && !isAuthenticated && !token && !hasCookie) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Continue rendering even if not authenticated yet, middleware will handle redirect
  // This prevents flickering during authentication check

  return (
    <>
      <UserNavbar />
      <main className="p-4 mt-16 w-full min-h-screen bg-[#EBF4FE]">
        {children}
      </main>
    </>
  );
}
