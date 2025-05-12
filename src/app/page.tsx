"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to enhanced home page
    router.push('/enhanced-home');
  }, [router]);
  // Return null as we're redirecting
  return null;
}
