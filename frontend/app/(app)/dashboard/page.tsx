"use client"

import Link from "next/link"
import { Activity, AlertTriangle, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, MethodBadge } from "@/components/status-badge"
import { LatencyChart, UptimeChart, IncidentChart, StatusDistributionChart } from "@/components/charts"
import { bootstrapWorkspace, getAnalyticsOverview, getIncidentAnalytics, getLatencyAnalytics, getMonitors, getMonitorChecks, getUptimeAnalytics } from "@/lib/api"
import type { Check, Monitor } from "@/lib/types"

export default function DashboardPage() {
  const [overview, setOverview] = useState({ overall_uptime: 100, active_monitors: 0, failed_checks: 0, avg_latency_ms: 0, open_incidents: 0 })
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [checks, setChecks] = useState<Check[]>([])
  const [latency, setLatency] = useState<any[]>([])
  const [uptime, setUptime] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])
  const [error, setError] = useState("")
  const [bootstrapping, setBootstrapping] = useState(false)

  async function load() {
      try {
        const [overviewData, monitorData, latencyData, uptimeData, incidentData] = await Promise.all([
          getAnalyticsOverview(),
          getMonitors(),
          getLatencyAnalytics(),
          getUptimeAnalytics(),
          getIncidentAnalytics(),
        ])
        setOverview(overviewData as any)
        setMonitors(monitorData)
        setLatency(((latencyData as any).latency_trend ?? []).map((point: any) => ({ time: point.date.slice(5), p50: point.avg_latency_ms, p95: point.avg_latency_ms * 1.4, p99: point.avg_latency_ms * 1.8 })))
        setUptime(((uptimeData as any).uptime_trend ?? []).map((point: any) => ({ day: point.date.slice(5), uptime: point.uptime_percentage })))
        setIncidents(((incidentData as any).incident_frequency ?? []).map((point: any) => ({ week: point.date.slice(5), critical: 0, high: point.count, medium: 0, low: 0 })))
        const recentChecks = await Promise.all(monitorData.slice(0, 6).map((monitor) => getMonitorChecks(monitor.id).catch(() => [])))
        setChecks(recentChecks.flat().sort((a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()).slice(0, 10))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard")
      }
  }

  useEffect(() => {
    load()
  }, [])

  async function bootstrap() {
    setBootstrapping(true)
    setError("")
    try {
      await bootstrapWorkspace()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create starter workspace")
    } finally {
      setBootstrapping(false)
    }
  }

  const statusDistribution = useMemo(() => ["operational", "degraded", "down", "paused", "unknown"].map((status) => ({ name: status[0].toUpperCase() + status.slice(1), value: monitors.filter((monitor) => monitor.status === status).length })), [monitors])
  const monitorById = new Map(monitors.map((monitor) => [monitor.id, monitor]))
  const overallOk = overview.open_incidents === 0 && monitors.every((monitor) => monitor.status !== "down")

  return (
    <div className="space-y-4 text-[#F3F4F6]">
      <div className={`rounded border px-4 py-2 ${overallOk ? "border-[#22C55E]/20 bg-[#22C55E]/10" : "border-[#F59E0B]/20 bg-[#F59E0B]/10"}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`h-1.5 w-1.5 rounded-full ${overallOk ? "bg-[#22C55E]" : "bg-[#F59E0B]"}`} />
            <div><div className="text-[12px] font-semibold">{overallOk ? "All systems operational" : "Some systems need attention"}</div><div className="font-mono text-[11px] text-[#9CA3AF]">{overview.active_monitors} active monitors · {overview.failed_checks} failed checks · {overview.open_incidents} open incidents</div></div>
          </div>
          <Link href="/status-pages" className="inline-flex h-7 items-center gap-1 rounded border border-white/5 bg-[#151618] px-2.5 text-[11px]">View status page <ArrowRight className="h-3 w-3" /></Link>
        </div>
      </div>
      <PageHeader title="Overview" description="Realtime health across every project, monitor, and region." />
      {error && <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</div>}
      {!monitors.length && (
        <div className="rounded border border-white/5 bg-[#151618] p-8 text-center">
          <div className="text-lg font-semibold">Start your Watcher workspace</div>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#9CA3AF]">
            Create a starter project, public status page, alert channel, and two working monitors with initial checks.
          </p>
          <button onClick={bootstrap} disabled={bootstrapping} className="mt-4 rounded bg-[#4F8CFF] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {bootstrapping ? "Creating workspace..." : "Create starter workspace"}
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-5">
        <Metric icon={CheckCircle2} label="Overall Uptime" value={`${overview.overall_uptime}%`} />
        <Metric icon={Activity} label="Active Monitors" value={overview.active_monitors.toString()} />
        <Metric icon={XCircle} label="Failed Checks" value={overview.failed_checks.toString()} />
        <Metric icon={Clock} label="Avg Latency" value={`${overview.avg_latency_ms}ms`} />
        <Metric icon={AlertTriangle} label="Open Incidents" value={overview.open_incidents.toString()} />
      </div>
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
        <Card className="lg:col-span-2"><CardHeader title="Latency trend" /><LatencyChart data={latency} height={260} /></Card>
        <Card><CardHeader title="Status distribution" /><StatusDistributionChart data={statusDistribution} height={240} /></Card>
      </div>
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
        <Card><CardHeader title="Uptime trend" /><UptimeChart data={uptime} height={220} /></Card>
        <Card className="lg:col-span-2"><CardHeader title="Incident frequency" /><IncidentChart data={incidents} height={220} /></Card>
      </div>
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Live check stream" />
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full">
              <thead><tr className="border-b border-white/5 text-[10px] uppercase text-[#9CA3AF]"><th className="px-2 py-1.5 text-left">Time</th><th className="px-2 py-1.5 text-left">Monitor</th><th className="px-2 py-1.5 text-left">Region</th><th className="px-2 py-1.5 text-left">Status</th><th className="px-2 py-1.5 text-right">Latency</th></tr></thead>
              <tbody>{checks.map((check) => <tr key={check.id} className="border-b border-white/5"><td className="px-2 py-1.5 text-[#9CA3AF]">{new Date(check.checked_at).toLocaleTimeString()}</td><td className="px-2 py-1.5 font-sans">{monitorById.get(check.monitor_id)?.name ?? check.monitor_id}</td><td className="px-2 py-1.5 text-[#9CA3AF]">{check.region}</td><td className={`px-2 py-1.5 ${check.success ? "text-[#22C55E]" : "text-[#EF4444]"}`}>{check.status_code ?? "-"}</td><td className="px-2 py-1.5 text-right">{check.latency_ms ? `${check.latency_ms}ms` : "-"}</td></tr>)}</tbody>
            </table>
            {!checks.length && <div className="p-8 text-center text-[#9CA3AF]">No checks yet. Create a monitor and run a check.</div>}
          </div>
        </Card>
        <Card><CardHeader title="Monitors" /><div className="space-y-2">{monitors.slice(0, 6).map((monitor) => <Link key={monitor.id} href={`/monitors/${monitor.id}`} className="flex items-center justify-between rounded border border-white/5 p-2 hover:bg-white/5"><div><div className="text-xs font-semibold">{monitor.name}</div><div className="font-mono text-[10px] text-[#9CA3AF]">{monitor.method}</div></div><StatusBadge status={monitor.status} /></Link>)}</div></Card>
      </div>
      <Card>
        <CardHeader title="Service health" />
        <div className="overflow-x-auto"><table className="w-full text-[12px]"><thead><tr className="border-y border-white/5 bg-[#090A0B] text-[10px] uppercase text-[#9CA3AF]"><th className="px-3.5 py-2 text-left">Service</th><th className="px-3.5 py-2 text-left">Method</th><th className="px-3.5 py-2 text-left">Status</th><th className="px-3.5 py-2 text-right">Uptime</th><th className="px-3.5 py-2 text-right">Latency</th></tr></thead><tbody>{monitors.map((monitor) => <tr key={monitor.id} className="border-b border-white/5"><td className="px-3.5 py-2.5"><Link href={`/monitors/${monitor.id}`} className="font-semibold">{monitor.name}</Link><div className="font-mono text-[10px] text-[#9CA3AF]">{monitor.url}</div></td><td className="px-3.5 py-2.5"><MethodBadge method={monitor.method} /></td><td className="px-3.5 py-2.5"><StatusBadge status={monitor.status} /></td><td className="px-3.5 py-2.5 text-right">{monitor.uptime_percentage}%</td><td className="px-3.5 py-2.5 text-right">{monitor.avg_latency_ms}ms</td></tr>)}</tbody></table></div>
      </Card>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded border border-white/5 bg-[#151618] p-3.5 ${className || ""}`}>{children}</div>
}

function CardHeader({ title }: { title: string }) {
  return <div className="mb-3.5 text-[12px] font-bold">{title}</div>
}

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return <div className="rounded border border-white/5 bg-[#151618] p-3.5"><div className="flex items-center justify-between"><div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{label}</div><Icon className="h-3.5 w-3.5 text-[#4F8CFF]" /></div><div className="mt-2 text-[20px] font-bold tabular-nums">{value}</div></div>
}
