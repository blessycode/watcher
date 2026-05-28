import Link from "next/link"
import { ChevronRight, Pause, Play, MoreHorizontal, RefreshCw, Bell, Globe } from "lucide-react"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, MethodBadge } from "@/components/status-badge"
import { LatencyChart } from "@/components/charts"
import { UptimeBars } from "@/components/uptime-bars"
import { Button } from "@/components/ui/button"
import { monitors, latencyData, incidents } from "@/lib/mock-data"

export default async function MonitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const monitor = monitors.find((m) => m.id === id) ?? monitors[0]
  if (!monitor) notFound()

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/monitors" className="hover:text-foreground">Monitors</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{monitor.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{monitor.name}</h1>
            <StatusBadge status={monitor.status} />
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MethodBadge method={monitor.method} />
            <code className="font-mono text-xs">{monitor.url}</code>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 bg-transparent">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Run check now
          </Button>
          <Button variant="outline" size="sm" className="h-9 bg-transparent">
            <Pause className="h-3.5 w-3.5 mr-1.5" /> Pause
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "Uptime", value: `${monitor.uptime}%` },
          { label: "Avg latency", value: `${monitor.avgLatency || "—"}ms` },
          { label: "P95 latency", value: `${monitor.p95Latency || "—"}ms` },
          { label: "Last response", value: monitor.lastResponseCode.toString() },
          { label: "Failed checks", value: monitor.failedChecks.toString() },
          { label: "Last checked", value: monitor.lastChecked },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1.5 text-xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold">Latency (last 24h)</div>
            <div className="text-xs text-muted-foreground">P50, P95, P99 from {monitor.region}</div>
          </div>
          <LatencyChart data={latencyData} height={240} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">90-day uptime</div>
              <div className="text-xs text-muted-foreground">{monitor.uptime}% over 90 days</div>
            </div>
          </div>
          <UptimeBars className="h-24" />
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>90 days ago</span>
            <span>Today</span>
          </div>

          <div className="mt-5 pt-4 border-t border-border space-y-2">
            <ConfigRow label="Method" value={monitor.method} />
            <ConfigRow label="Region" value={monitor.region} />
            <ConfigRow label="Interval" value={monitor.interval} />
            <ConfigRow label="Expected" value={monitor.expectedStatus.toString()} />
          </div>
        </div>
      </div>

      {/* Recent checks + incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4">
          <div className="mb-3 text-sm font-semibold">Recent checks</div>
          <div className="font-mono text-xs">
            <div className="grid grid-cols-[80px_120px_60px_70px_1fr] gap-2 px-2 py-1.5 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>Time</span>
              <span>Region</span>
              <span>Status</span>
              <span className="text-right">Latency</span>
              <span>Notes</span>
            </div>
            {Array.from({ length: 8 }).map((_, i) => {
              const failed = monitor.status === "down" && i < 3
              return (
                <div key={i} className="grid grid-cols-[80px_120px_60px_70px_1fr] gap-2 px-2 py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">14:32:{String(60 - i * 3).padStart(2, "0")}</span>
                  <span className="text-muted-foreground">{monitor.region}</span>
                  <span className={failed ? "text-red-600" : "text-emerald-600"}>{failed ? 503 : 200}</span>
                  <span className="text-right tabular-nums">{failed ? "—" : `${monitor.avgLatency + i * 4}ms`}</span>
                  <span className="text-muted-foreground truncate">{failed ? "Service Unavailable" : "OK"}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 text-sm font-semibold">Incident timeline</div>
          <div className="space-y-3">
            {incidents.slice(0, 3).map((i) => (
              <div key={i.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-2 w-2 rounded-full ${i.status === "resolved" ? "bg-emerald-500" : "bg-red-500"}`} />
                  <div className="flex-1 w-px bg-border mt-1" />
                </div>
                <div className="pb-3">
                  <div className="text-sm font-medium">{i.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{i.startedAt} · {i.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-4 w-4 text-primary" />
            <div className="text-sm font-semibold">Alert channels</div>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { name: "Slack #oncall", verified: true },
              { name: "Email engineering@acme.com", verified: true },
              { name: "PagerDuty (P1)", verified: false },
            ].map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span>{c.name}</span>
                <span className={`text-xs ${c.verified ? "text-emerald-700" : "text-amber-700"}`}>
                  {c.verified ? "Verified" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-primary" />
            <div className="text-sm font-semibold">Logs preview</div>
          </div>
          <pre className="font-mono text-[11px] bg-secondary/40 border border-border rounded-md p-3 overflow-x-auto leading-relaxed">
{`[14:32:18] GET ${monitor.url}
  → 200 OK · ${monitor.avgLatency}ms · region=${monitor.region}
[14:31:18] GET ${monitor.url}
  → 200 OK · ${monitor.avgLatency + 8}ms · region=${monitor.region}
[14:30:18] GET ${monitor.url}
  → 200 OK · ${monitor.avgLatency - 4}ms · region=${monitor.region}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  )
}
