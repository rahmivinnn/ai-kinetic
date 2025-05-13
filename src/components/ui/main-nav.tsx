"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { AnimatePresence, motion } from 'framer-motion';

interface MainNavProps {
  className?: string;
}

// Ripple effect component
const RippleEffect = ({
  x,
  y,
  size,
  color = 'rgba(255, 255, 255, 0.4)',
  duration = 600
}: {
  x: number;
  y: number;
  size: number;
  color?: string;
  duration?: number;
}) => {
  return (
    <motion.span
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        backgroundColor: color,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 0 }}
      transition={{ duration: duration / 1000 }}
      onAnimationComplete={() => null}
    />
  );
};

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Create ripple effect
  const createRipple = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, size = 100) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();

    // Get click position relative to the element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create a new ripple
    const ripple = {
      id: rippleIdRef.current,
      x,
      y,
      size
    };

    // Increment the ID for the next ripple
    rippleIdRef.current += 1;

    // Add the new ripple to the array
    setRipples(prev => [...prev, ripple]);

    // Remove the ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  }, []);

  // Handle navigation with animation
  const handleNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    // Create ripple effect
    createRipple(e);

    // Set active link for animation
    setActiveLink(href);

    // Navigate after a short delay for animation
    setTimeout(() => {
      router.push(href);
      setIsMenuOpen(false);
    }, 150);
  }, [createRipple, router]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener for clicks outside the navigation
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

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
    <div ref={navRef} className={cn('flex items-center justify-between relative', className)}>
      <div className="flex items-center">
        <Link href="/enhanced-home" className="flex items-center mr-6 relative z-20">
          <span className="font-bold text-xl">Kinetic AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 relative z-20">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative main-nav-link overflow-hidden',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
              onClick={(e) => {
                // Use the navigation handler with animations
                handleNavigation(e, item.href);
              }}
              data-active={pathname === item.href ? "true" : "false"}
              style={{ touchAction: 'manipulation' }}
            >
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.icon}
                <span className="pointer-events-none ml-2">{item.name}</span>
              </motion.div>

              {/* Ripple effects */}
              {ripples.map(ripple => (
                <RippleEffect
                  key={ripple.id}
                  x={ripple.x}
                  y={ripple.y}
                  size={ripple.size}
                  color={pathname === item.href ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)'}
                />
              ))}
            </Link>
          ))}
        </nav>
      </div>

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center space-x-2 relative z-20">
        <Link
          href="/login"
          onClick={(e) => {
            createRipple(e as any, 100);
            setTimeout(() => {
              router.push('/login');
            }, 150);
            e.preventDefault();
          }}
          className="relative overflow-hidden"
        >
          <Button variant="outline" size="sm" className="relative overflow-hidden">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </motion.div>
          </Button>

          {/* Ripple effects */}
          {ripples.map(ripple => (
            <RippleEffect
              key={ripple.id}
              x={ripple.x}
              y={ripple.y}
              size={ripple.size}
              color="rgba(0, 0, 0, 0.1)"
            />
          ))}
        </Link>

        <Link
          href="/register"
          onClick={(e) => {
            createRipple(e as any, 100);
            setTimeout(() => {
              router.push('/register');
            }, 150);
            e.preventDefault();
          }}
          className="relative overflow-hidden"
        >
          <Button size="sm" className="relative overflow-hidden">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.div>
          </Button>

          {/* Ripple effects */}
          {ripples.map(ripple => (
            <RippleEffect
              key={ripple.id}
              x={ripple.x}
              y={ripple.y}
              size={ripple.size}
              color="rgba(255, 255, 255, 0.3)"
            />
          ))}
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden relative z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            createRipple(e as any, 50);
            toggleMenu();
          }}
          className="relative overflow-hidden"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.div>

          {/* Ripple effects */}
          {ripples.map(ripple => (
            <RippleEffect
              key={ripple.id}
              x={ripple.x}
              y={ripple.y}
              size={ripple.size}
              color="rgba(0, 0, 0, 0.1)"
            />
          ))}
        </Button>
      </div>

      {/* Mobile Menu - Using fixed positioning to avoid layout issues */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop for closing the menu when clicking outside */}
            <motion.div
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={toggleMenu}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.div
              className="fixed top-16 left-0 right-0 bg-background border-b border-border p-4 md:hidden z-50 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <nav className="flex flex-col space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors main-nav-link overflow-hidden',
                        pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                      onClick={(e) => {
                        handleNavigation(e, item.href);
                      }}
                      data-active={pathname === item.href ? "true" : "false"}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {item.icon}
                      <span className="pointer-events-none ml-2">{item.name}</span>

                      {/* Ripple effects */}
                      {ripples.map(ripple => (
                        <RippleEffect
                          key={ripple.id}
                          x={ripple.x}
                          y={ripple.y}
                          size={ripple.size}
                          color={pathname === item.href ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)'}
                        />
                      ))}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="pt-2 mt-2 border-t border-border flex flex-col space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.05 }}
                >
                  <Link
                    href="/login"
                    className="w-full overflow-hidden relative"
                    onClick={(e) => {
                      createRipple(e as any, 150);
                      setTimeout(() => {
                        router.push('/login');
                        setIsMenuOpen(false);
                      }, 150);
                      e.preventDefault();
                    }}
                  >
                    <Button variant="outline" size="sm" className="justify-start w-full relative">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                    {/* Ripple effects */}
                    {ripples.map(ripple => (
                      <RippleEffect
                        key={ripple.id}
                        x={ripple.x}
                        y={ripple.y}
                        size={ripple.size}
                        color="rgba(0, 0, 0, 0.1)"
                      />
                    ))}
                  </Link>
                  <Link
                    href="/register"
                    className="w-full overflow-hidden relative"
                    onClick={(e) => {
                      createRipple(e as any, 150);
                      setTimeout(() => {
                        router.push('/register');
                        setIsMenuOpen(false);
                      }, 150);
                      e.preventDefault();
                    }}
                  >
                    <Button size="sm" className="justify-start w-full relative">
                      Sign Up
                    </Button>
                    {/* Ripple effects */}
                    {ripples.map(ripple => (
                      <RippleEffect
                        key={ripple.id}
                        x={ripple.x}
                        y={ripple.y}
                        size={ripple.size}
                        color="rgba(255, 255, 255, 0.3)"
                      />
                    ))}
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
