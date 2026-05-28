import Link from "next/link"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, MethodBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkline } from "@/components/charts"
import { monitors, sparklineData } from "@/lib/mock-data"

export default function MonitorsPage() {
  return (
    <div>
      <PageHeader
        title="Monitors"
        description="Every endpoint Watcher is probing in real time."
        actions={
          <Button size="sm" className="h-9" asChild>
            <Link href="/monitors/new">
              <Plus className="h-4 w-4 mr-1.5" /> Create Monitor
            </Link>
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="flex flex-col lg:flex-row gap-2 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8 h-9" placeholder="Search monitors…" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All statuses", "All methods", "All projects", "All regions"].map((f) => (
            <Button key={f} variant="outline" size="sm" className="h-9 bg-transparent">
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-medium px-4 py-2.5">Monitor</th>
                <th className="text-left font-medium px-4 py-2.5">Method</th>
                <th className="text-left font-medium px-4 py-2.5">Endpoint</th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
                <th className="text-right font-medium px-4 py-2.5">Uptime</th>
                <th className="text-right font-medium px-4 py-2.5">Avg Latency</th>
                <th className="text-left font-medium px-4 py-2.5 w-28">Latency</th>
                <th className="text-right font-medium px-4 py-2.5">Interval</th>
                <th className="text-right font-medium px-4 py-2.5">Last check</th>
                <th className="px-4 py-2.5 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monitors.map((m) => (
                <tr key={m.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/monitors/${m.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {m.name}
                    </Link>
                    <div className="text-[11px] text-muted-foreground">{m.project}</div>
                  </td>
                  <td className="px-4 py-3"><MethodBadge method={m.method} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[260px] truncate">
                    {m.url}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3 text-right tabular-nums">{m.uptime}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{m.avgLatency || "—"}ms</td>
                  <td className="px-4 py-3 w-28">
                    <div className="w-24 h-7">
                      <Sparkline
                        data={sparklineData(m.avgLatency || 100)}
                        color={m.status === "down" ? "#dc2626" : m.status === "degraded" ? "#d97706" : "#2563eb"}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground text-xs">{m.interval}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground text-xs">{m.lastChecked}</td>
                  <td className="px-4 py-3">
                    <button className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-accent">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
