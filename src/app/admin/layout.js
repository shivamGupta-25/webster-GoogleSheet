"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Menu, Home, FileText, Users, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isActive = (path) => {
    return pathname === path;
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Content", href: "/admin/content", icon: FileText },
    { name: "Workshop", href: "/admin/workshop", icon: Users },
    { name: "Techelons", href: "/admin/techelons", icon: Users },
    { name: "Techelons Content", href: "/admin/techelons-content", icon: FileText },
    { name: "Techelons Registrations", href: "/admin/techelons-registrations", icon: Users },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-14 items-center border-b px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {!isCollapsed && (
            <Link href="/" className="font-semibold">
              Websters Admin
            </Link>
          )}
        </div>
        
        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-2">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="border-t p-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "ml-16" : "ml-64"
      )}>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
} 