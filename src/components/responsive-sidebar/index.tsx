'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, ChevronRight, Home, BarChart2, Users, Settings,
  FileText, Calendar, MessageSquare, Activity, Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Define menu items with their icons, paths, and labels
export const menuItems = [
  {
    icon: Home,
    path: '/responsive-dashboard',
    label: 'Dashboard',
    description: 'Overview of your activity and key metrics'
  },
  {
    icon: Activity,
    path: '/responsive-dashboard/analytics',
    label: 'Analytics',
    description: 'Detailed statistics and performance metrics'
  },
  {
    icon: Calendar,
    path: '/responsive-dashboard/appointments',
    label: 'Appointments',
    description: 'Manage your scheduled sessions'
  },
  {
    icon: Video,
    path: '/responsive-dashboard/videos',
    label: 'Videos',
    description: 'Your uploaded and analyzed videos'
  },
  {
    icon: MessageSquare,
    path: '/responsive-dashboard/messages',
    label: 'Messages',
    description: 'Communication with your trainers and team'
  },
  {
    icon: Users,
    path: '/responsive-dashboard/clients',
    label: 'Clients',
    description: 'Manage your client relationships'
  },
  {
    icon: FileText,
    path: '/responsive-dashboard/reports',
    label: 'Reports',
    description: 'View and generate detailed reports'
  },
  {
    icon: Settings,
    path: '/responsive-dashboard/settings',
    label: 'Settings',
    description: 'Configure your account preferences'
  },
];

interface ResponsiveSidebarProps {
  children: React.ReactNode;
}

export const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle window resize to determine if we're on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:w-20",
          isMobile && "hidden"
        )}
      >
        {/* Sidebar Header with subtle blue gradient */}
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30">
          <div className="flex items-center">
            {/* Logo removed as requested */}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none hover:bg-blue-100/50 dark:hover:bg-blue-800/30 transition-colors"
          >
            <ChevronRight
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                !isOpen && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-5 px-2">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "flex items-center p-2 rounded-md transition-all duration-200 group",
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                    )}
                    onClick={() => isMobile && setMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 mr-3 transition-colors",
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      )}
                    />
                    {isOpen && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {!isOpen && (
                      <div className="absolute left-full ml-6 bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50 whitespace-nowrap">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg md:hidden"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30">
                <div className="flex items-center">
                  {/* Logo removed as requested */}
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none hover:bg-blue-100/50 dark:hover:bg-blue-800/30 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-5 px-2">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center p-2 rounded-md transition-all duration-200",
                            isActive
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 mr-3",
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-400"
                            )}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300 overflow-auto",
        isOpen ? "md:ml-64" : "md:ml-20"
      )}>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default ResponsiveSidebar;
