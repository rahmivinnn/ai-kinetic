'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
}

interface DashboardTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange?: (tabId: string) => void;
}

export default function DashboardTabs({ 
  tabs, 
  activeTab, 
  onTabChange 
}: DashboardTabsProps) {
  
  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "cursor-pointer py-4 px-1 border-b-2 font-medium text-sm",
              tab.id === activeTab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab.href ? (
              <Link href={tab.href}>
                {tab.label}
              </Link>
            ) : (
              tab.label
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
