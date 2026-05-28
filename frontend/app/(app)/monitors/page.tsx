"use client"

import Link from "next/link"
import { CheckCircle2, MoreHorizontal, Pause, Play, Plus, Search, Trash2, Zap } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { MethodBadge, StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { deleteMonitor, getMonitors, runMonitorCheck, updateMonitor } from "@/lib/api"
import type { Monitor } from "@/lib/types"

export default function MonitorsPage() {
  const [items, setItems] = useState<Monitor[]>([])
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [method, setMethod] = useState("all")
  const [runningId, setRunningId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      setLoading(true)
      setItems(await getMonitors())
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load monitors")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((monitor) => {
      const haystack = `${monitor.name} ${monitor.url} ${monitor.region}`.toLowerCase()
      return haystack.includes(query.toLowerCase()) && (status === "all" || monitor.status === status) && (method === "all" || monitor.method === method)
    })
  }, [items, method, query, status])

  async function runCheck(id: string) {
    setRunningId(id)
    try {
      await runMonitorCheck(id)
      await load()
    } finally {
      setRunningId(null)
    }
  }

  async function togglePause(monitor: Monitor) {
    await updateMonitor(monitor.id, { is_active: !monitor.is_active })
    await load()
  }

  async function remove(id: string) {
    await deleteMonitor(id)
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div>
      <PageHeader
        title="Monitors"
        description="Every endpoint Watcher is probing in real time."
        actions={<Button size="sm" className="h-7 rounded px-3 text-[11px]" asChild><Link href="/monitors/new"><Plus className="mr-1 h-3 w-3" /> Create Monitor</Link></Button>}
      />
      <div className="mb-3 flex flex-col gap-2 lg:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-8 w-full rounded border border-border bg-background pl-8 pr-3 text-xs outline-none" placeholder="Search monitors, URLs, regions..." />
        </div>
        <Segment value={status} onChange={setStatus} options={["all", "unknown", "operational", "degraded", "down", "paused"]} />
        <Segment value={method} onChange={setMethod} options={["all", "GET", "POST", "PUT", "PATCH", "DELETE"]} />
      </div>
      {error && <div className="mb-3 rounded border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}
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
                <th className="px-3.5 py-2 text-right">Interval</th>
                <th className="px-3.5 py-2 text-right">Last check</th>
                <th className="w-8 px-3.5 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((monitor) => (
                <tr key={monitor.id} className="transition-colors hover:bg-accent/60">
                  <td className="px-3.5 py-2.5"><Link href={`/monitors/${monitor.id}`} className="font-semibold hover:text-primary">{monitor.name}</Link><div className="text-[10px] text-muted-foreground">{monitor.region}</div></td>
                  <td className="px-3.5 py-2.5"><MethodBadge method={monitor.method} /></td>
                  <td className="max-w-[320px] truncate px-3.5 py-2.5 font-mono text-[10.5px] text-muted-foreground">{monitor.url}</td>
                  <td className="px-3.5 py-2.5"><StatusBadge status={monitor.status} /></td>
                  <td className="px-3.5 py-2.5 text-right tabular-nums">{monitor.uptime_percentage}%</td>
                  <td className="px-3.5 py-2.5 text-right tabular-nums">{monitor.avg_latency_ms || "-"}ms</td>
                  <td className="px-3.5 py-2.5 text-right text-[10px] text-muted-foreground">{monitor.interval_seconds}s</td>
                  <td className="px-3.5 py-2.5 text-right text-[10px] text-muted-foreground">{monitor.last_checked_at ? new Date(monitor.last_checked_at).toLocaleString() : "not checked"}</td>
                  <td className="px-3.5 py-2.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-accent"><MoreHorizontal className="h-3.5 w-3.5" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => runCheck(monitor.id)} disabled={runningId === monitor.id}>{runningId === monitor.id ? <CheckCircle2 className="mr-2 h-3.5 w-3.5 animate-pulse" /> : <Zap className="mr-2 h-3.5 w-3.5" />}Run check now</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePause(monitor)}>{monitor.is_active ? <Pause className="mr-2 h-3.5 w-3.5" /> : <Play className="mr-2 h-3.5 w-3.5" />}{monitor.is_active ? "Pause monitor" : "Resume monitor"}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => remove(monitor.id)} className="text-destructive"><Trash2 className="mr-2 h-3.5 w-3.5" />Delete monitor</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && <div className="border-t border-border p-8 text-center text-xs text-muted-foreground">{loading ? "Loading monitors..." : "No monitors found."}</div>}
      </div>
    </div>
  )
}

function Segment({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <div className="flex flex-wrap gap-1.5">{options.map((option) => <button key={option} onClick={() => onChange(option)} className={`h-8 rounded border px-2.5 text-[11px] capitalize ${value === option ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent"}`}>{option === "all" ? "All" : option}</button>)}</div>
}
