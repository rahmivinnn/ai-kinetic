"use client";

import { Calendar, Home, Inbox, Search } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Exercise Categories",
    url: "/exercise-categories",
    icon: Inbox,
  },
  {
    title: "Video Library",
    url: "/video-library",
    icon: Inbox,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: Calendar,
  },
  {
    title: "Analytics",
    url: "/progress-analytics",
    icon: Search,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="mt-10 w-[100px]">
      <SidebarContent className="bg-gradient-to-l from-[#004586] to-[#01042A]">
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="text-2xl font-semibold mb-2"></span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-transparent active:bg-transparent"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center justify-start lg:justify-center"
                    >
                      <item.icon className="text-[#BB78FA]" />
                      <span className="flex lg:hidden text-white">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
