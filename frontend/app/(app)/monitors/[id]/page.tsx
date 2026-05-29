"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight, RefreshCw } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { MethodBadge, StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { getMonitorById, getMonitorChecks, runMonitorCheck } from "@/lib/api"
import type { Check, Monitor } from "@/lib/types"

export default function MonitorDetailPage() {
  const params = useParams<{ id: string }>()
  const [monitor, setMonitor] = useState<Monitor | null>(null)
  const [checks, setChecks] = useState<Check[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState("")

  async function load() {
    try {
      const [monitorData, checkData] = await Promise.all([getMonitorById(params.id), getMonitorChecks(params.id)])
      setMonitor(monitorData ?? null)
      setChecks(checkData)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load monitor")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [params.id])

  async function checkNow() {
    setRunning(true)
    try {
      await runMonitorCheck(params.id)
      await load()
    } finally {
      setRunning(false)
    }
  }

  const failed = checks.filter((check) => !check.success).length
  const last = checks[0]
  const p95 = useMemo(() => {
    const values = checks.map((check) => check.latency_ms).filter((value): value is number => typeof value === "number").sort((a, b) => a - b)
    return values.length ? values[Math.floor(values.length * 0.95)] : 0
  }, [checks])

  if (loading) return <div className="text-sm text-muted-foreground">Loading monitor...</div>
  if (!monitor) return <div className="rounded border border-border bg-card p-8 text-sm">Monitor not found.</div>

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/monitors" className="hover:text-foreground">Monitors</Link><ChevronRight className="h-3 w-3" /><span className="text-foreground">{monitor.name}</span>
      </nav>
      <PageHeader title={monitor.name} description={monitor.url} actions={<Button variant="outline" size="sm" onClick={checkNow} disabled={running}><RefreshCw className="mr-1.5 h-3.5 w-3.5" />{running ? "Checking..." : "Run check now"}</Button>} />
      {error && <div className="rounded border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}
      <div className="flex flex-wrap items-center gap-2"><MethodBadge method={monitor.method} /><StatusBadge status={monitor.status} /><span className="text-xs text-muted-foreground">{monitor.region}</span></div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Stat label="Uptime" value={`${monitor.uptime_percentage}%`} />
        <Stat label="Avg latency" value={`${monitor.avg_latency_ms || 0}ms`} />
        <Stat label="P95 latency" value={`${p95 || 0}ms`} />
        <Stat label="Last response" value={last?.status_code?.toString() ?? "-"} />
        <Stat label="Failed checks" value={failed.toString()} />
        <Stat label="Last checked" value={monitor.last_checked_at ? new Date(monitor.last_checked_at).toLocaleString() : "never"} />
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 text-sm font-semibold">Recent checks</div>
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full">
            <thead><tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground"><th className="px-2 py-1.5 text-left">Time</th><th className="px-2 py-1.5 text-left">Region</th><th className="px-2 py-1.5 text-left">Status</th><th className="px-2 py-1.5 text-right">Latency</th><th className="px-2 py-1.5 text-left">Notes</th></tr></thead>
            <tbody>{checks.map((check) => <tr key={check.id} className="border-b border-border/60"><td className="px-2 py-1.5 text-muted-foreground">{new Date(check.checked_at).toLocaleString()}</td><td className="px-2 py-1.5 text-muted-foreground">{check.region}</td><td className={`px-2 py-1.5 ${check.success ? "text-blue-500" : "text-red-500"}`}>{check.status_code ?? "-"}</td><td className="px-2 py-1.5 text-right">{check.latency_ms ? `${check.latency_ms}ms` : "-"}</td><td className="px-2 py-1.5 text-muted-foreground">{check.error_message || "OK"}</td></tr>)}</tbody>
          </table>
          {!checks.length && <div className="p-8 text-center text-muted-foreground">No checks yet. Run one now.</div>}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1.5 text-xl font-semibold tabular-nums">{value}</div></div>
}
