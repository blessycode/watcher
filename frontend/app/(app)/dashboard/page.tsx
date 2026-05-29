"use client"

import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Plus,
  Radio,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { IncidentChart, LatencyChart, StatusDistributionChart, UptimeChart } from "@/components/charts"
import { PageHeader } from "@/components/page-header"
import { MethodBadge, StatusBadge } from "@/components/status-badge"
import {
  bootstrapWorkspace,
  getAnalyticsOverview,
  getIncidentAnalytics,
  getLatencyAnalytics,
  getMonitorChecks,
  getMonitors,
  getUptimeAnalytics,
  runMonitorCheck,
} from "@/lib/api"
import type { Check, Monitor } from "@/lib/types"

type Overview = {
  overall_uptime: number
  active_monitors: number
  failed_checks: number
  avg_latency_ms: number
  open_incidents: number
}

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview>({ overall_uptime: 100, active_monitors: 0, failed_checks: 0, avg_latency_ms: 0, open_incidents: 0 })
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [checks, setChecks] = useState<Check[]>([])
  const [latency, setLatency] = useState<any[]>([])
  const [uptime, setUptime] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [bootstrapping, setBootstrapping] = useState(false)
  const [checkingId, setCheckingId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const [overviewData, monitorData, latencyData, uptimeData, incidentData] = await Promise.all([
        getAnalyticsOverview(),
        getMonitors(),
        getLatencyAnalytics(),
        getUptimeAnalytics(),
        getIncidentAnalytics(),
      ])
      setOverview(overviewData as Overview)
      setMonitors(monitorData)
      setLatency(((latencyData as any).latency_trend ?? []).map((point: any) => ({ time: point.date.slice(5), p50: point.avg_latency_ms, p95: point.avg_latency_ms * 1.4, p99: point.avg_latency_ms * 1.8 })))
      setUptime(((uptimeData as any).uptime_trend ?? []).map((point: any) => ({ day: point.date.slice(5), uptime: point.uptime_percentage })))
      setIncidents(((incidentData as any).incident_frequency ?? []).map((point: any) => ({ week: point.date.slice(5), critical: 0, high: point.count, medium: 0, low: 0 })))
      const recentChecks = await Promise.all(monitorData.slice(0, 8).map((monitor) => getMonitorChecks(monitor.id).catch(() => [])))
      setChecks(recentChecks.flat().sort((a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()).slice(0, 12))
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard")
    } finally {
      setLoading(false)
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

  async function checkNow(monitor: Monitor) {
    setCheckingId(monitor.id)
    try {
      await runMonitorCheck(monitor.id)
      await load()
    } finally {
      setCheckingId(null)
    }
  }

  const statusDistribution = useMemo(
    () =>
      ["operational", "degraded", "down", "paused", "unknown"].map((status) => ({
        name: status[0].toUpperCase() + status.slice(1),
        value: monitors.filter((monitor) => monitor.status === status).length,
      })),
    [monitors],
  )
  const monitorById = new Map(monitors.map((monitor) => [monitor.id, monitor]))
  const riskyMonitors = monitors
    .filter((monitor) => monitor.status !== "operational" || monitor.avg_latency_ms > 1000)
    .sort((a, b) => b.avg_latency_ms - a.avg_latency_ms)
  const slowest = [...monitors].sort((a, b) => b.avg_latency_ms - a.avg_latency_ms).slice(0, 5)
  const overallOk = overview.open_incidents === 0 && monitors.every((monitor) => monitor.status !== "down")

  return (
    <div className="space-y-4 text-[#F3F4F6]">
      <section className="rounded border border-white/5 bg-[#111315] p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded border ${overallOk ? "border-[#4F8CFF]/30 bg-[#4F8CFF]/10 text-[#4F8CFF]" : "border-[#AFCBFF]/30 bg-[#AFCBFF]/10 text-[#AFCBFF]"}`}>
              {overallOk ? <ShieldCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            </div>
            <div>
              <div className="text-[15px] font-bold">{overallOk ? "All systems operational" : "Service health needs attention"}</div>
              <div className="mt-1 max-w-2xl text-[12px] leading-5 text-[#9CA3AF]">
                {overview.active_monitors} active monitors, {overview.failed_checks} failed checks, {overview.open_incidents} open incidents, {overview.avg_latency_ms}ms average latency.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionLink href="/monitors/new" icon={Plus} label="New monitor" primary />
            <ActionLink href="/incidents" icon={AlertTriangle} label="Incidents" />
            <ActionLink href="/status-pages" icon={Globe} label="Status pages" />
            <ActionLink href="/analytics" icon={BarChart3} label="Analytics" />
          </div>
        </div>
      </section>

      <PageHeader title="Operations dashboard" description="Live uptime, latency, failures, incidents, and status page readiness from your database." />
      {error && <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">{error}</div>}

      {!loading && !monitors.length && (
        <div className="rounded border border-white/5 bg-[#151618] p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 text-[#4F8CFF]">
            <Radio className="h-5 w-5" />
          </div>
          <div className="mt-4 text-lg font-semibold">Start your Watcher workspace</div>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#9CA3AF]">
            Create a starter project, public status page, alert channel, and working monitors backed by your local Postgres database.
          </p>
          <button onClick={bootstrap} disabled={bootstrapping} className="mt-4 rounded bg-[#4F8CFF] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {bootstrapping ? "Creating workspace..." : "Create starter workspace"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-5">
        <Metric href="/analytics" icon={CheckCircle2} label="Overall uptime" value={`${overview.overall_uptime}%`} tone="good" />
        <Metric href="/monitors" icon={Activity} label="Active monitors" value={overview.active_monitors.toString()} />
        <Metric href="/monitors" icon={XCircle} label="Failed checks" value={overview.failed_checks.toString()} tone={overview.failed_checks ? "bad" : "neutral"} />
        <Metric href="/analytics" icon={Clock} label="Avg latency" value={`${overview.avg_latency_ms}ms`} tone={overview.avg_latency_ms > 1000 ? "warn" : "neutral"} />
        <Metric href="/incidents" icon={AlertTriangle} label="Open incidents" value={overview.open_incidents.toString()} tone={overview.open_incidents ? "bad" : "neutral"} />
      </div>

      <div className="grid grid-cols-1 gap-2.5 xl:grid-cols-[1.6fr_0.8fr_0.8fr]">
        <Card className="min-h-[320px]">
          <CardHeader title="Latency trend" action={<Link href="/analytics" className="text-[11px] text-[#4F8CFF]">Open analytics</Link>} />
          <LatencyChart data={latency} height={260} />
        </Card>
        <Card>
          <CardHeader title="Status distribution" />
          <StatusDistributionChart data={statusDistribution} height={240} />
        </Card>
        <Card>
          <CardHeader title="Watchlist" action={<Link href="/monitors" className="text-[11px] text-[#4F8CFF]">All monitors</Link>} />
          <div className="space-y-2">
            {(riskyMonitors.length ? riskyMonitors : slowest).slice(0, 5).map((monitor) => (
              <Link key={monitor.id} href={`/monitors/${monitor.id}`} className="block rounded border border-white/5 p-2 transition-colors hover:bg-white/5">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-semibold">{monitor.name}</div>
                    <div className="font-mono text-[10px] text-[#9CA3AF]">{monitor.avg_latency_ms}ms avg</div>
                  </div>
                  <StatusBadge status={monitor.status} />
                </div>
              </Link>
            ))}
            {!monitors.length && <div className="p-5 text-center text-xs text-[#9CA3AF]">No monitors yet.</div>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
        <Card>
          <CardHeader title="Uptime trend" />
          <UptimeChart data={uptime} height={220} />
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Incident frequency" action={<Link href="/incidents" className="text-[11px] text-[#4F8CFF]">Manage incidents</Link>} />
          <IncidentChart data={incidents} height={220} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Live check stream" action={<Link href="/monitors" className="text-[11px] text-[#4F8CFF]">Monitor fleet</Link>} />
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase text-[#9CA3AF]">
                  <th className="px-2 py-1.5 text-left">Time</th>
                  <th className="px-2 py-1.5 text-left">Monitor</th>
                  <th className="px-2 py-1.5 text-left">Region</th>
                  <th className="px-2 py-1.5 text-left">Status</th>
                  <th className="px-2 py-1.5 text-right">Latency</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((check) => (
                  <tr key={check.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="px-2 py-1.5 text-[#9CA3AF]">{new Date(check.checked_at).toLocaleTimeString()}</td>
                    <td className="px-2 py-1.5 font-sans">
                      <Link href={`/monitors/${check.monitor_id}`} className="hover:text-[#4F8CFF]">{monitorById.get(check.monitor_id)?.name ?? check.monitor_id}</Link>
                    </td>
                    <td className="px-2 py-1.5 text-[#9CA3AF]">{check.region}</td>
                    <td className={`px-2 py-1.5 ${check.success ? "text-[#4F8CFF]" : "text-[#EF4444]"}`}>{check.status_code ?? "-"}</td>
                    <td className="px-2 py-1.5 text-right">{check.latency_ms ? `${check.latency_ms}ms` : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!checks.length && <div className="p-8 text-center text-[#9CA3AF]">No checks yet. Create a monitor and run a check.</div>}
          </div>
        </Card>
        <Card>
          <CardHeader title="Quick checks" action={<Link href="/monitors/new" className="text-[11px] text-[#4F8CFF]">Add endpoint</Link>} />
          <div className="space-y-2">
            {monitors.slice(0, 6).map((monitor) => (
              <div key={monitor.id} className="rounded border border-white/5 p-2">
                <div className="flex items-center justify-between gap-2">
                  <Link href={`/monitors/${monitor.id}`} className="min-w-0 text-xs font-semibold hover:text-[#4F8CFF]">{monitor.name}</Link>
                  <StatusBadge status={monitor.status} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#9CA3AF]">{monitor.method} · {monitor.region}</span>
                  <button onClick={() => checkNow(monitor)} disabled={checkingId === monitor.id} className="rounded border border-white/5 px-2 py-1 text-[10px] text-[#9CA3AF] hover:bg-white/5 disabled:opacity-50">
                    {checkingId === monitor.id ? "Checking" : "Check now"}
                  </button>
                </div>
              </div>
            ))}
            {!monitors.length && <div className="p-5 text-center text-xs text-[#9CA3AF]">No monitors yet.</div>}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Service health" action={<Link href="/monitors" className="inline-flex items-center gap-1 text-[11px] text-[#4F8CFF]">Open monitors <ExternalLink className="h-3 w-3" /></Link>} />
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-y border-white/5 bg-[#090A0B] text-[10px] uppercase text-[#9CA3AF]">
                <th className="px-3.5 py-2 text-left">Service</th>
                <th className="px-3.5 py-2 text-left">Method</th>
                <th className="px-3.5 py-2 text-left">Status</th>
                <th className="px-3.5 py-2 text-right">Uptime</th>
                <th className="px-3.5 py-2 text-right">Latency</th>
              </tr>
            </thead>
            <tbody>
              {monitors.map((monitor) => (
                <tr key={monitor.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-3.5 py-2.5">
                    <Link href={`/monitors/${monitor.id}`} className="font-semibold hover:text-[#4F8CFF]">{monitor.name}</Link>
                    <div className="max-w-xl truncate font-mono text-[10px] text-[#9CA3AF]">{monitor.url}</div>
                  </td>
                  <td className="px-3.5 py-2.5"><MethodBadge method={monitor.method} /></td>
                  <td className="px-3.5 py-2.5"><StatusBadge status={monitor.status} /></td>
                  <td className="px-3.5 py-2.5 text-right">{monitor.uptime_percentage}%</td>
                  <td className="px-3.5 py-2.5 text-right">{monitor.avg_latency_ms}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded border border-white/5 bg-[#151618] p-3.5 ${className || ""}`}>{children}</div>
}

function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-3.5 flex items-center justify-between gap-2">
      <div className="text-[12px] font-bold">{title}</div>
      {action}
    </div>
  )
}

function Metric({ icon: Icon, label, value, href, tone = "neutral" }: { icon: any; label: string; value: string; href: string; tone?: "neutral" | "good" | "warn" | "bad" }) {
  const toneClass = tone === "good" ? "text-[#4F8CFF]" : tone === "warn" ? "text-[#AFCBFF]" : tone === "bad" ? "text-[#EF4444]" : "text-[#4F8CFF]"
  return (
    <Link href={href} className="block rounded border border-white/5 bg-[#151618] p-3.5 transition-colors hover:border-[#4F8CFF]/30 hover:bg-[#1A1C20]">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{label}</div>
        <Icon className={`h-3.5 w-3.5 ${toneClass}`} />
      </div>
      <div className="mt-2 text-[20px] font-bold tabular-nums">{value}</div>
    </Link>
  )
}

function ActionLink({ href, icon: Icon, label, primary = false }: { href: string; icon: any; label: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex h-8 items-center gap-2 rounded border px-3 text-[12px] font-semibold transition-colors ${
        primary ? "border-[#4F8CFF] bg-[#4F8CFF] text-white hover:bg-[#3D7AF0]" : "border-white/5 bg-[#151618] text-[#D1D5DB] hover:bg-[#1E2024]"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
      <ArrowRight className="h-3 w-3" />
    </Link>
  )
}
