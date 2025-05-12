'use client';

import { ResponsiveSidebar } from '@/components/responsive-sidebar';

export default function ResponsiveDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ResponsiveSidebar>{children}</ResponsiveSidebar>;
}
