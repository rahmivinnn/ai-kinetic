import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOut,
  Settings,
  User,
  Home,
  Dumbbell,
  Video,
  MessageSquare,
  BarChart2,
  Menu,
  PhoneCall,
  Activity
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function UserNavbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Navigation items
  const navItems = [
    { id: "dashboard", title: "Dashboard", href: "/dashboard", icon: Home },
    { id: "exercise", title: "Exercise Plan", href: "/dashboard#exercise-plan", icon: Dumbbell },
    { id: "real-time-pose", title: "Real-Time Pose", href: "/real-time-pose-detection", icon: Activity },
    { id: "video-library", title: "Video Library", href: "/video-library", icon: Video },
    { id: "video-call", title: "Video Call", href: "/video-call", icon: PhoneCall },
    { id: "messages", title: "Messages", href: "/messages", icon: MessageSquare },
    { id: "analytics", title: "Analytics", href: "/progress-analytics", icon: BarChart2 },
  ];

  // Handle navigation with client-side routing
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    router.push(href);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-[#004586] to-[#01042A] shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center" prefetch={false}>
              <img
                src="/kinetic-logo.png"
                alt="Kinetic AI"
                className="h-8 w-auto"
              />
              <span className="ml-2 font-semibold text-lg text-white">Kinetic AI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-10 space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white hover:bg-white/10 transition-colors"
                  onClick={(e) => handleNavigation(e, item.href)}
                >
                  <item.icon className="h-4 w-4 mr-2 text-[#BB78FA]" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Navigation Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px] bg-gradient-to-b from-[#004586] to-[#01042A] border-r-0">
                <div className="py-4">
                  <div className="px-3 py-2">
                    <h2 className="text-lg font-semibold text-white">Navigation</h2>
                  </div>
                  <div className="mt-4 space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsOpen(false);
                          router.push(item.href);
                        }}
                      >
                        <item.icon className="h-5 w-5 mr-3 text-[#BB78FA]" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-white/30">
                  <Avatar className="h-8 w-8 bg-white/10">
                    <AvatarImage src={user?.profilePicture || ''} alt={user?.firstName || ''} />
                    <AvatarFallback className="text-white">{user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#01042A] text-white border-[#004586]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs leading-none text-white/70">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white">
                  <Link href="/profile" className="text-white hover:text-white">
                    <User className="mr-2 h-4 w-4 text-[#BB78FA]" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white">
                  <Link href="/settings" className="text-white hover:text-white">
                    <Settings className="mr-2 h-4 w-4 text-[#BB78FA]" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={logout} className="text-white focus:bg-white/10 focus:text-white">
                  <LogOut className="mr-2 h-4 w-4 text-[#BB78FA]" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
