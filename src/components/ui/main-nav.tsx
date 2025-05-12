"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Home,
  Activity,
  Layers,
  Settings,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    {
      name: '3D Home',
      href: '/enhanced-home',
      icon: <Home className="h-4 w-4 mr-2" />
    },
    {
      name: 'Pose Detection',
      href: '/pose-detection',
      icon: <Activity className="h-4 w-4 mr-2" />
    },
    {
      name: 'Enhanced Pose Detection',
      href: '/pose-detection-v2',
      icon: <Activity className="h-4 w-4 mr-2" />
    },
    {
      name: 'UI Components',
      href: '/ui-components',
      icon: <Layers className="h-4 w-4 mr-2" />
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="h-4 w-4 mr-2" />
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: <User className="h-4 w-4 mr-2" />
    }
  ];

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center">
        <Link href="/enhanced-home" className="flex items-center mr-6">
          <span className="font-bold text-xl">Kinetic AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center space-x-2">
        <Link href="/login">
          <Button variant="outline" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">
            Sign Up
          </Button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button variant="ghost" size="sm" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 md:hidden z-50">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-border flex flex-col space-y-2">
              <Link href="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="justify-start w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button size="sm" className="justify-start w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
