"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Folders,
  Activity,
  AlertTriangle,
  Globe,
  Bell,
  BarChart3,
  Settings,
  Search,
  HelpCircle,
  ChevronDown,
  Plus,
  Menu,
  Github,
  CalendarDays,
  SlidersHorizontal,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { WatcherLogo } from "@/components/watcher-logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, kbd: "D" },
  { name: "Projects", href: "/projects", icon: Folders, badge: "6", kbd: "P" },
  { name: "Monitors", href: "/monitors", icon: Activity, badge: "24", kbd: "M" },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle, badge: "2", badgeColor: "danger", kbd: "I" },
  { name: "Status Pages", href: "/status-pages", icon: Globe, kbd: "S" },
  { name: "Alerts", href: "/alerts", icon: Bell, kbd: "A" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, kbd: "Y" },
]

function SidebarNav() {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col bg-[#090A0B]">
      {/* Logo */}
      <div className="px-4 h-11 flex items-center border-b border-white/5">
        <Link href="/dashboard">
          <WatcherLogo />
        </Link>
      </div>

      {/* Workspace switcher */}
      <div className="px-3 pt-3 pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2 rounded border border-white/5 bg-[#151618] hover:bg-[#1E2024] transition-colors px-2 py-1.5 text-left select-none cursor-pointer">
              <div className="h-5 w-5 rounded bg-[#4F8CFF] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                W
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold text-[#F3F4F6] truncate">Watcher</div>
                <div className="text-[10px] text-[#9CA3AF] truncate">Pro · 24 monitors</div>
              </div>
              <ChevronDown className="h-3 w-3 text-[#9CA3AF] shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60 bg-[#151618] border-white/5 text-[#F3F4F6]">
            <DropdownMenuLabel className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider">Workspaces</DropdownMenuLabel>
            <DropdownMenuItem className="hover:bg-[#1E2024] text-xs">Watcher Cloud</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#1E2024] text-xs">Globex Probes</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="hover:bg-[#1E2024] text-xs">
              <Plus className="h-3.5 w-3.5 mr-2 text-[#4F8CFF]" /> Create workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav */}
      <nav className="px-2 flex-1 overflow-y-auto pb-4 scrollbar-thin">
        <div className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-bold px-2.5 pt-3 pb-1">
          Workspace
        </div>
        <ul className="space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded px-2.5 py-1.5 text-[12px] font-medium transition-colors select-none group",
                    active
                      ? "bg-[#1E2024] text-[#F3F4F6]"
                      : "text-[#9CA3AF] hover:bg-[#1E2024]/50 hover:text-[#F3F4F6]",
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5 shrink-0 transition-colors", active ? "text-[#4F8CFF]" : "text-[#9CA3AF] group-hover:text-[#F3F4F6]")} />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "min-w-[16px] h-4 px-1 inline-flex items-center justify-center rounded text-[9px] font-medium tabular-nums border",
                        item.badgeColor === "danger"
                          ? "bg-[#EF4444]/10 text-[#EF4444] border-white/5"
                          : "bg-[#151618] text-[#9CA3AF] border-white/5",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.kbd && (
                    <kbd className="hidden group-hover:inline-flex items-center justify-center h-4 w-4 rounded border border-white/5 bg-[#151618] text-[8px] font-mono text-[#9CA3AF] uppercase select-none">
                      {item.kbd}
                    </kbd>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="text-[9px] uppercase tracking-wider text-[#9CA3AF] font-bold px-2.5 pt-5 pb-1">
          Account
        </div>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-2 rounded px-2.5 py-1.5 text-[12px] font-medium transition-colors group select-none",
                pathname === "/settings"
                  ? "bg-[#1E2024] text-[#F3F4F6]"
                  : "text-[#9CA3AF] hover:bg-[#1E2024]/50 hover:text-[#F3F4F6]",
              )}
            >
              <Settings className={cn("h-3.5 w-3.5", pathname === "/settings" ? "text-[#4F8CFF]" : "text-[#9CA3AF] group-hover:text-[#F3F4F6]")} />
              <span className="flex-1">Settings</span>
              <kbd className="hidden group-hover:inline-flex items-center justify-center h-4 w-4 rounded border border-white/5 bg-[#151618] text-[8px] font-mono text-[#9CA3AF] select-none">
                ,
              </kbd>
            </Link>
          </li>
          <li>
            <Link
              href="/docs"
              className="flex items-center gap-2 rounded px-2.5 py-1.5 text-[12px] font-medium text-[#9CA3AF] hover:bg-[#1E2024]/50 hover:text-[#F3F4F6] transition-colors select-none"
            >
              <HelpCircle className="h-3.5 w-3.5" /> Documentation
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com"
              className="flex items-center gap-2 rounded px-2.5 py-1.5 text-[12px] font-medium text-[#9CA3AF] hover:bg-[#1E2024]/50 hover:text-[#F3F4F6] transition-colors select-none"
            >
              <Github className="h-3.5 w-3.5" /> GitHub
            </Link>
          </li>
        </ul>
      </nav>

      {/* Status footer */}
      <div className="border-t border-white/5 p-3 bg-[#090A0B]">
        <div className="rounded border border-white/5 bg-[#151618] p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-[#F3F4F6] select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shrink-0" />
            All systems operational
          </div>
          <div className="text-[#9CA3AF] text-[10px] mt-1 select-none font-medium">
            12 regions · last check 8s ago
          </div>
        </div>
      </div>
    </div>
  )
}

function TopBar() {
  return (
    <div className="h-11 border-b border-white/5 bg-[#151618] sticky top-0 z-20">
      <div className="h-full px-4 lg:px-6 flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8 text-[#F3F4F6] hover:bg-[#1E2024]">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-56 border-r border-white/5 bg-[#090A0B]">
            <SidebarNav />
          </SheetContent>
        </Sheet>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF]" />
          <Input
            className="pl-8 h-7 bg-[#0C0D0E] border-white/5 text-[12px] text-[#F3F4F6] placeholder:text-[#9CA3AF] rounded focus-visible:ring-1 focus-visible:ring-[#4F8CFF] focus-visible:border-[#4F8CFF]"
            placeholder="Search monitors, incidents..."
          />
          <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 h-4 items-center rounded border border-white/5 bg-[#151618] px-1 text-[9px] font-mono text-[#9CA3AF] select-none">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden h-7 border-white/5 bg-transparent text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1E2024] text-[12px] md:inline-flex px-2.5">
            <Link href="/projects">
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 text-[#4F8CFF]" />
              Production
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden h-7 border-white/5 bg-transparent text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1E2024] text-[12px] xl:inline-flex px-2.5">
            <Link href="/analytics">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-[#4F8CFF]" />
              Last 24h
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-7 border-white/5 bg-transparent text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1E2024] text-[12px] px-2.5">
            <Link href="/monitors/new">
              <Plus className="h-3.5 w-3.5 mr-1 text-[#4F8CFF]" /> Monitor
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-7 w-7 relative hover:bg-[#1E2024] rounded">
            <Link href="/incidents" aria-label="View incidents">
              <Bell className="h-3.5 w-3.5 text-[#9CA3AF] hover:text-[#F3F4F6]" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full select-none focus:outline-none cursor-pointer">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-[#1E2024] text-[#4F8CFF] text-[9px] font-semibold border border-white/5">JD</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-[#151618] border-white/5 text-[#F3F4F6]">
              <DropdownMenuLabel>
                <div className="text-[12px] font-medium">Jordan Davis</div>
                <div className="text-[10px] text-[#9CA3AF] font-normal">jordan@acme.com</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem asChild className="hover:bg-[#1E2024] text-xs"><Link href="/settings">Profile settings</Link></DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#1E2024] text-xs">Keyboard shortcuts</DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-[#1E2024] text-xs"><Link href="/docs">Documentation</Link></DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem asChild className="hover:bg-[#1E2024] text-xs"><Link href="/login">Log out</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#F3F4F6]">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-white/5 bg-[#090A0B] lg:block">
        <SidebarNav />
      </aside>
      <div className="relative lg:pl-56">
        <TopBar />
        <main className="p-4 lg:p-6 max-w-[1440px] mx-auto">{children}</main>
      </div>
    </div>
  )
}
