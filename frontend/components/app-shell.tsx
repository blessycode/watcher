"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  Folders,
  Globe,
  HelpCircle,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
} from "lucide-react"
import { useEffect, useState } from "react"
import { WatcherLogo } from "@/components/watcher-logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { getCachedUser, getCurrentUser, getIncidents, getMonitors, getProjects, logout } from "@/lib/api"
import type { User } from "@/lib/types"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, kbd: "D" },
  { name: "Projects", href: "/projects", icon: Folders, kbd: "P" },
  { name: "Monitors", href: "/monitors", icon: Activity, kbd: "M" },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle, badgeColor: "danger", kbd: "I" },
  { name: "Status Pages", href: "/status-pages", icon: Globe, kbd: "S" },
  { name: "Alerts", href: "/alerts", icon: Bell, kbd: "A" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, kbd: "Y" },
]

function initials(name?: string | null, email?: string | null) {
  const source = (name || email || "Watcher User").trim()
  const parts = source.includes("@") ? [source.split("@")[0]] : source.split(/\s+/)
  return parts
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "WU"
}

function useShellData() {
  const [user, setUser] = useState<User | null>(() => getCachedUser())
  const [counts, setCounts] = useState({ projects: 0, monitors: 0, incidents: 0 })

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => undefined)
    Promise.all([getProjects(), getMonitors(), getIncidents()])
      .then(([projects, monitors, incidents]) => {
        setCounts({
          projects: projects.length,
          monitors: monitors.length,
          incidents: incidents.filter((incident) => incident.status !== "resolved").length,
        })
      })
      .catch(() => undefined)
  }, [])

  return { user, counts }
}

function SidebarNav() {
  const pathname = usePathname()
  const { user, counts } = useShellData()
  const userInitials = initials(user?.name, user?.email)

  return (
    <div className="flex h-full flex-col bg-[#090A0B]">
      <div className="flex h-11 items-center border-b border-white/5 px-4">
        <Link href="/dashboard">
          <WatcherLogo />
        </Link>
      </div>

      <div className="px-3 pb-2 pt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full cursor-pointer select-none items-center gap-2 rounded border border-white/5 bg-[#151618] px-2 py-1.5 text-left transition-colors hover:bg-[#1E2024]">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#4F8CFF] text-[9px] font-bold text-white">
                {userInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold text-[#F3F4F6]">{user?.name ?? "Watcher"}</div>
                <div className="truncate text-[10px] text-[#9CA3AF]">{counts.projects} projects · {counts.monitors} monitors</div>
              </div>
              <ChevronDown className="h-3 w-3 shrink-0 text-[#9CA3AF]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60 border-white/5 bg-[#151618] text-[#F3F4F6]">
            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Workspace</DropdownMenuLabel>
            <DropdownMenuItem asChild className="text-xs hover:bg-[#1E2024]"><Link href="/projects">Projects</Link></DropdownMenuItem>
            <DropdownMenuItem asChild className="text-xs hover:bg-[#1E2024]"><Link href="/status-pages">Status pages</Link></DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem asChild className="text-xs hover:bg-[#1E2024]">
              <Link href="/projects"><Plus className="mr-2 h-3.5 w-3.5 text-[#4F8CFF]" /> Create project</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="relative z-50 flex-1 overflow-y-auto px-2 pb-4">
        <div className="px-2.5 pb-1 pt-3 text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">Workspace</div>
        <ul className="space-y-0.5">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || pathname.startsWith(item.href + "/")
            const liveBadge =
              item.href === "/projects"
                ? counts.projects
                : item.href === "/monitors"
                  ? counts.monitors
                  : item.href === "/incidents"
                    ? counts.incidents
                    : null
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex w-full cursor-pointer select-none items-center gap-2 rounded border px-2.5 py-2 text-[12px] font-semibold transition-all",
                    active
                      ? "border-[#4F8CFF]/25 bg-[#172033] text-[#F3F4F6] shadow-[inset_2px_0_0_#4F8CFF]"
                      : "border-transparent text-[#9CA3AF] hover:border-white/5 hover:bg-[#1E2024]/70 hover:text-[#F3F4F6]",
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5 shrink-0", active ? "text-[#4F8CFF]" : "text-[#9CA3AF] group-hover:text-[#F3F4F6]")} />
                  <span className="flex-1">{item.name}</span>
                  {liveBadge !== null && (
                    <span
                      className={cn(
                        "inline-flex h-4 min-w-[16px] items-center justify-center rounded border border-white/5 px-1 text-[9px] font-medium tabular-nums",
                        item.badgeColor === "danger" && liveBadge > 0
                          ? "bg-[#EF4444]/10 text-[#EF4444]"
                          : "bg-[#151618] text-[#9CA3AF]",
                      )}
                    >
                      {liveBadge}
                    </span>
                  )}
                  <ChevronDown className="hidden h-3 w-3 -rotate-90 text-[#4F8CFF] group-hover:block" />
                </a>
              </li>
            )
          })}
        </ul>

        <div className="px-2.5 pb-1 pt-5 text-[9px] font-bold uppercase tracking-wider text-[#9CA3AF]">Account</div>
        <ul className="space-y-0.5">
          <li>
            <a
              href="/settings"
              aria-current={pathname === "/settings" ? "page" : undefined}
              className={cn(
                "group flex w-full cursor-pointer select-none items-center gap-2 rounded border px-2.5 py-2 text-[12px] font-semibold transition-all",
                pathname === "/settings"
                  ? "border-[#4F8CFF]/25 bg-[#172033] text-[#F3F4F6] shadow-[inset_2px_0_0_#4F8CFF]"
                  : "border-transparent text-[#9CA3AF] hover:border-white/5 hover:bg-[#1E2024]/70 hover:text-[#F3F4F6]",
              )}
            >
              <Settings className={cn("h-3.5 w-3.5", pathname === "/settings" ? "text-[#4F8CFF]" : "text-[#9CA3AF] group-hover:text-[#F3F4F6]")} />
              <span className="flex-1">Settings</span>
            </a>
          </li>
          <li>
            <a href="/docs" className="flex w-full cursor-pointer select-none items-center gap-2 rounded border border-transparent px-2.5 py-2 text-[12px] font-semibold text-[#9CA3AF] transition-all hover:border-white/5 hover:bg-[#1E2024]/70 hover:text-[#F3F4F6]">
              <HelpCircle className="h-3.5 w-3.5" /> Documentation
            </a>
          </li>
        </ul>
      </nav>

      <div className="border-t border-white/5 bg-[#090A0B] p-3">
        <a href="/status-pages" className="block cursor-pointer rounded border border-white/5 bg-[#151618] p-2.5 text-xs transition-colors hover:bg-[#1E2024]">
          <div className="flex select-none items-center gap-1.5 font-medium text-[#F3F4F6]">
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", counts.incidents ? "bg-[#AFCBFF]" : "bg-[#4F8CFF]")} />
            {counts.incidents ? `${counts.incidents} open incidents` : "All systems operational"}
          </div>
          <div className="mt-1 select-none text-[10px] font-medium text-[#9CA3AF]">{counts.monitors} monitors · view status pages</div>
        </a>
      </div>
    </div>
  )
}

function TopBar() {
  const { user, counts } = useShellData()

  async function signOut() {
    await logout().catch(() => undefined)
    window.location.href = "/login"
  }

  return (
    <div className="sticky top-0 z-20 h-11 border-b border-white/5 bg-[#151618]">
      <div className="flex h-full items-center gap-3 px-4 lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#F3F4F6] hover:bg-[#1E2024] lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 border-r border-white/5 bg-[#090A0B] p-0">
            <SidebarNav />
          </SheetContent>
        </Sheet>

        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
          <Input
            className="h-7 rounded border-white/5 bg-[#0C0D0E] pl-8 text-[12px] text-[#F3F4F6] placeholder:text-[#9CA3AF] focus-visible:border-[#4F8CFF] focus-visible:ring-1 focus-visible:ring-[#4F8CFF]"
            placeholder="Search monitors, incidents..."
          />
          <kbd className="absolute right-2 top-1/2 hidden h-4 -translate-y-1/2 select-none items-center rounded border border-white/5 bg-[#151618] px-1 font-mono text-[9px] text-[#9CA3AF] sm:inline-flex">
            Ctrl K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden h-7 border-white/5 bg-transparent px-2.5 text-[12px] text-[#9CA3AF] hover:bg-[#1E2024] hover:text-[#F3F4F6] md:inline-flex">
            <Link href="/projects">
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 text-[#4F8CFF]" />
              Production
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden h-7 border-white/5 bg-transparent px-2.5 text-[12px] text-[#9CA3AF] hover:bg-[#1E2024] hover:text-[#F3F4F6] xl:inline-flex">
            <Link href="/analytics">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-[#4F8CFF]" />
              Last 24h
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-7 border-white/5 bg-transparent px-2.5 text-[12px] text-[#9CA3AF] hover:bg-[#1E2024] hover:text-[#F3F4F6]">
            <Link href="/monitors/new">
              <Plus className="mr-1 h-3.5 w-3.5 text-[#4F8CFF]" /> Monitor
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative h-7 w-7 rounded hover:bg-[#1E2024]">
            <Link href="/incidents" aria-label="View incidents">
              <Bell className="h-3.5 w-3.5 text-[#9CA3AF] hover:text-[#F3F4F6]" />
              {counts.incidents > 0 && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#EF4444]" />}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="cursor-pointer select-none rounded-full focus:outline-none">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="border border-white/5 bg-[#1E2024] text-[9px] font-semibold text-[#4F8CFF]">
                    {initials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 border-white/5 bg-[#151618] text-[#F3F4F6]">
              <DropdownMenuLabel>
                <div className="text-[12px] font-medium">{user?.name ?? "Watcher user"}</div>
                <div className="text-[10px] font-normal text-[#9CA3AF]">{user?.email ?? "Signed in"}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem asChild className="text-xs hover:bg-[#1E2024]"><Link href="/settings">Profile settings</Link></DropdownMenuItem>
              <DropdownMenuItem asChild className="text-xs hover:bg-[#1E2024]"><Link href="/docs">Documentation</Link></DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem onClick={signOut} className="text-xs hover:bg-[#1E2024]">Log out</DropdownMenuItem>
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
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-56 border-r border-white/5 bg-[#090A0B] lg:block">
        <SidebarNav />
      </aside>
      <div className="relative lg:pl-56">
        <TopBar />
        <main className="mx-auto max-w-[1440px] p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
