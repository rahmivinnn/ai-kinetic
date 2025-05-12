'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TestPage() {
  const router = useRouter();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>
      <p className="mb-4">If you can see this page, the server is working correctly.</p>
      <div className="space-y-4">
        <Button onClick={() => router.push('/login')}>Go to Login</Button>
        <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
      </div>
    </div>
  );
}
