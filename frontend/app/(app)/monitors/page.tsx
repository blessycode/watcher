"use client"

import Link from "next/link"
import { CheckCircle2, MoreHorizontal, Pause, Play, Plus, Search, Trash2, Zap } from "lucide-react"
import { useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { MethodBadge, StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Sparkline } from "@/components/charts"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { monitors as seedMonitors, sparklineData } from "@/lib/mock-data"
import { runMonitorCheck } from "@/lib/api"

export default function MonitorsPage() {
  const [items, setItems] = useState(seedMonitors)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [method, setMethod] = useState("all")
  const [runningId, setRunningId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return items.filter((monitor) => {
      const haystack = `${monitor.name} ${monitor.url} ${monitor.project} ${monitor.region}`.toLowerCase()
      const matchesQuery = haystack.includes(query.toLowerCase())
      const matchesStatus = status === "all" || monitor.status === status
      const matchesMethod = method === "all" || monitor.method === method
      return matchesQuery && matchesStatus && matchesMethod
    })
  }, [items, method, query, status])

  async function runCheck(id: string) {
    setRunningId(id)
    const check = await runMonitorCheck(id)
    setItems((current) =>
      current.map((monitor) =>
        monitor.id === id
          ? {
              ...monitor,
              status: check.success ? "operational" : "down",
              avgLatency: check.latency_ms ?? 0,
              lastResponseCode: check.status_code ?? 0,
              lastChecked: "just now",
            }
          : monitor,
      ),
    )
    setRunningId(null)
  }

  function togglePause(id: string) {
    setItems((current) =>
      current.map((monitor) =>
        monitor.id === id
          ? {
              ...monitor,
              status: monitor.status === "paused" ? "operational" : "paused",
              isActive: monitor.status === "paused",
            }
          : monitor,
      ),
    )
  }

  return (
    <div>
      <PageHeader
        title="Monitors"
        description="Every endpoint Watcher is probing in real time."
        actions={
          <Button size="sm" className="h-7 rounded px-3 text-[11px]" asChild>
            <Link href="/monitors/new">
              <Plus className="mr-1 h-3 w-3" /> Create Monitor
            </Link>
          </Button>
        }
      />

      <div className="mb-3 flex flex-col gap-2 lg:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-8 w-full rounded border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="Search monitors, URLs, projects..."
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", "operational", "degraded", "down", "paused"].map((value) => (
            <button
              key={value}
              onClick={() => setStatus(value)}
              className={`h-8 rounded border px-2.5 text-[11px] capitalize transition-colors ${
                status === value
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {value === "all" ? "All statuses" : value}
            </button>
          ))}
          {["all", "GET", "POST", "PUT", "PATCH"].map((value) => (
            <button
              key={value}
              onClick={() => setMethod(value)}
              className={`h-8 rounded border px-2.5 text-[11px] transition-colors ${
                method === value
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {value === "all" ? "All methods" : value}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-border bg-secondary text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-3.5 py-2 text-left">Monitor</th>
                <th className="px-3.5 py-2 text-left">Method</th>
                <th className="px-3.5 py-2 text-left">Endpoint</th>
                <th className="px-3.5 py-2 text-left">Status</th>
                <th className="px-3.5 py-2 text-right">Uptime</th>
                <th className="px-3.5 py-2 text-right">Avg latency</th>
                <th className="w-24 px-3.5 py-2 text-left">Trend</th>
                <th className="px-3.5 py-2 text-right">Interval</th>
                <th className="px-3.5 py-2 text-right">Last check</th>
                <th className="w-8 px-3.5 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((monitor) => (
                <tr key={monitor.id} className="transition-colors hover:bg-accent/60">
                  <td className="px-3.5 py-2.5">
                    <Link href={`/monitors/${monitor.id}`} className="font-semibold text-foreground transition-colors hover:text-primary">
                      {monitor.name}
                    </Link>
                    <div className="text-[10px] text-muted-foreground">{monitor.project}</div>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <MethodBadge method={monitor.method} />
                  </td>
                  <td className="max-w-[260px] truncate px-3.5 py-2.5 font-mono text-[10.5px] text-muted-foreground">
                    {monitor.url}
                  </td>
                  <td className="px-3.5 py-2.5">
                    <StatusBadge status={monitor.status} />
                  </td>
                  <td className="px-3.5 py-2.5 text-right tabular-nums text-foreground">{monitor.uptime}%</td>
                  <td className="px-3.5 py-2.5 text-right tabular-nums text-foreground">{monitor.avgLatency || "-"}ms</td>
                  <td className="w-24 px-3.5 py-2.5">
                    <div className="h-6 w-20">
                      <Sparkline
                        data={sparklineData(monitor.avgLatency || 100)}
                        color={monitor.status === "down" ? "#EF4444" : monitor.status === "degraded" ? "#F59E0B" : "#4F8CFF"}
                      />
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5 text-right text-[10px] text-muted-foreground">{monitor.interval}</td>
                  <td className="px-3.5 py-2.5 text-right text-[10px] text-muted-foreground">{monitor.lastChecked}</td>
                  <td className="px-3.5 py-2.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => runCheck(monitor.id)} disabled={runningId === monitor.id}>
                          {runningId === monitor.id ? <CheckCircle2 className="mr-2 h-3.5 w-3.5 animate-pulse" /> : <Zap className="mr-2 h-3.5 w-3.5" />}
                          {runningId === monitor.id ? "Checking..." : "Run check now"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePause(monitor.id)}>
                          {monitor.status === "paused" ? <Play className="mr-2 h-3.5 w-3.5" /> : <Pause className="mr-2 h-3.5 w-3.5" />}
                          {monitor.status === "paused" ? "Resume monitor" : "Pause monitor"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setItems((current) => current.filter((item) => item.id !== monitor.id))} className="text-destructive">
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete monitor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="border-t border-border p-8 text-center text-xs text-muted-foreground">
            No monitors match the current filters.
          </div>
        )}
      </div>
    </div>
  )
}
