'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  href?: string;
}

export default function DashboardNav() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'exercises', label: 'Exercises' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'messages', label: 'Messages' },
    { id: 'progress', label: 'Progress' },
    { id: 'my-submissions', label: 'My Submissions' },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex space-x-8">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "cursor-pointer py-4 px-1 border-b-2 font-medium text-sm",
              item.id === activeTab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {item.href ? (
              <Link href={item.href}>
                {item.label}
              </Link>
            ) : (
              item.label
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
