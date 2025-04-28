'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-lg border-2 border-blue-200">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="text-center">Test Page</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-center text-lg">
            If you can see this page, the application is working correctly!
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
