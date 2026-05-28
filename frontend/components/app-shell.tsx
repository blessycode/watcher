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
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Folders, badge: "6" },
  { name: "Monitors", href: "/monitors", icon: Activity, badge: "24" },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle, badge: "2", badgeColor: "bg-red-500" },
  { name: "Status Pages", href: "/status-pages", icon: Globe },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

function SidebarNav() {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 h-14 flex items-center border-b border-border">
        <Link href="/dashboard">
          <WatcherLogo />
        </Link>
      </div>

      {/* Workspace switcher */}
      <div className="px-3 pt-3 pb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-2 rounded-md border border-border bg-card hover:bg-accent/40 transition-colors px-2.5 py-2 text-left">
              <div className="h-7 w-7 rounded bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                A
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">Acme Corp</div>
                <div className="text-[11px] text-muted-foreground truncate">Pro · 24 monitors</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuItem>Acme Corp</DropdownMenuItem>
            <DropdownMenuItem>Globex Industries</DropdownMenuItem>
            <DropdownMenuItem>Initech</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus className="h-3.5 w-3.5 mr-2" /> Create workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav */}
      <nav className="px-2 flex-1 overflow-y-auto pb-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 pt-3 pb-1.5">
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
                    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "min-w-5 h-5 px-1.5 inline-flex items-center justify-center rounded text-[10px] font-semibold tabular-nums",
                        item.badgeColor
                          ? `${item.badgeColor} text-white`
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 pt-5 pb-1.5">
          Account
        </div>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                pathname === "/settings"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover:bg-accent hover:text-foreground",
              )}
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </li>
          <li>
            <Link
              href="/docs"
              className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              <HelpCircle className="h-4 w-4" /> Documentation
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com"
              className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              <Github className="h-4 w-4" /> GitHub
            </Link>
          </li>
        </ul>
      </nav>

      {/* Status footer */}
      <div className="border-t border-border p-3">
        <div className="rounded-md border border-border bg-secondary/40 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50" />
              <span className="relative rounded-full bg-emerald-500 h-1.5 w-1.5" />
            </span>
            All systems operational
          </div>
          <div className="text-muted-foreground text-[10px] mt-1">
            12 regions · last check 8s ago
          </div>
        </div>
      </div>
    </div>
  )
}

function TopBar() {
  return (
    <div className="h-14 border-b border-border/80 bg-background/70 backdrop-blur-xl sticky top-0 z-20">
      <div className="h-full px-4 lg:px-6 flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarNav />
          </SheetContent>
        </Sheet>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8 h-9 bg-card" placeholder="Search monitors, incidents, projects…" />
          <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 h-5 items-center rounded border border-border bg-background px-1.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden h-9 bg-transparent md:inline-flex">
            <Link href="/projects">
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
              Production
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden h-9 bg-transparent xl:inline-flex">
            <Link href="/analytics">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
              Last 24h
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9 hidden sm:inline-flex bg-transparent">
            <Link href="/monitors/new"><Plus className="h-4 w-4 mr-1.5" /> Monitor</Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-9 w-9 relative">
            <Link href="/incidents" aria-label="View incidents">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">JD</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>
                <div className="text-sm font-medium">Jordan Davis</div>
                <div className="text-xs text-muted-foreground font-normal">jordan@acme.com</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/settings">Profile settings</Link></DropdownMenuItem>
              <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/docs">Documentation</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/login">Log out</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div
        className="pointer-events-none fixed inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 30% 0%, rgba(143,183,255,0.09), transparent 34%), radial-gradient(circle at 85% 12%, rgba(167,139,250,0.06), transparent 30%)",
        }}
      />
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border/80 bg-sidebar/95 backdrop-blur-xl lg:block">
        <SidebarNav />
      </aside>
      <div className="relative lg:pl-64">
        <TopBar />
        <main className="p-4 lg:p-6 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>
  )
}
