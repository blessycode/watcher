import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  XCircle,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge, MethodBadge } from "@/components/status-badge"
import {
  LatencyChart,
  UptimeChart,
  IncidentChart,
  StatusDistributionChart,
  Sparkline,
} from "@/components/charts"
import {
  latencyData,
  uptimeData,
  incidentFrequency,
  statusDistribution,
  monitors,
  liveChecks,
  incidents,
  regions,
  slowestEndpoints,
  sparklineData,
} from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40" />
            <span className="relative block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="text-sm font-semibold text-emerald-100">All systems operational</div>
            <div className="text-xs text-emerald-100/70">
              Last checked 8 seconds ago · 24 monitors across 5 regions
            </div>
          </div>
        </div>
        <Button asChild variant="outline" size="sm" className="bg-card/70">
          <Link href="/status-pages">View status page <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
        </Button>
      </div>

      <PageHeader
        title="Overview"
        description="Realtime health across every project, monitor, and region."
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricCard
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          label="Overall Uptime"
          value="99.94%"
          trend="+0.02%"
          trendPositive
          context="vs. last 30 days"
          spark={sparklineData(99)}
          sparkColor="#34d399"
        />
        <MetricCard
          icon={Activity}
          iconColor="text-primary"
          label="Active Monitors"
          value="24"
          trend="+3"
          trendPositive
          context="3 added this week"
          spark={sparklineData(20)}
          sparkColor="#8fb7ff"
        />
        <MetricCard
          icon={XCircle}
          iconColor="text-red-600"
          label="Failed Checks"
          value="8"
          trend="-12"
          trendPositive
          context="vs. last 24h"
          spark={sparklineData(10)}
          sparkColor="#dc2626"
        />
        <MetricCard
          icon={Clock}
          iconColor="text-foreground"
          label="Avg Latency"
          value="184ms"
          trend="-12ms"
          trendPositive
          context="P50 across regions"
          spark={sparklineData(180)}
          sparkColor="#8fa8a2"
        />
        <MetricCard
          icon={AlertTriangle}
          iconColor="text-amber-600"
          label="Open Incidents"
          value="2"
          trend="1 critical"
          context="MTTR 24m"
          spark={sparklineData(2)}
          sparkColor="#d97706"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Latency over time"
            description="P50, P95, P99 — last 24 hours"
            extra={<span className="text-xs text-muted-foreground font-mono">all regions</span>}
          />
          <LatencyChart data={latencyData} height={260} />
        </Card>
        <Card>
          <CardHeader title="Status distribution" description="Across 24 monitors" />
          <StatusDistributionChart data={statusDistribution} height={260} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Uptime trend" description="Last 30 days" />
          <UptimeChart data={uptimeData} height={220} />
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Incident frequency" description="By severity, last 6 weeks" />
          <IncidentChart data={incidentFrequency} height={220} />
        </Card>
      </div>

      {/* Live + recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Live check stream"
            description="Newest results from all regions"
            extra={
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            }
          />
          <div className="font-mono text-xs">
            <div className="grid grid-cols-[80px_1fr_120px_60px_70px] gap-2 px-2 py-1.5 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>Time</span>
              <span>Monitor</span>
              <span>Region</span>
              <span>Status</span>
              <span className="text-right">Latency</span>
            </div>
            <div className="divide-y divide-border">
              {liveChecks.map((c, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[80px_1fr_120px_60px_70px] gap-2 px-2 py-1.5 hover:bg-accent/30"
                >
                  <span className="text-muted-foreground">{c.time}</span>
                  <span className="font-sans truncate">{c.monitor}</span>
                  <span className="text-muted-foreground truncate">{c.region}</span>
                  <span className={c.status >= 400 ? "text-red-600" : "text-emerald-600"}>
                    {c.status}
                  </span>
                  <span className="text-right tabular-nums">
                    {c.latency > 0 ? `${c.latency}ms` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Recent incidents" description="Last 7 days" />
          <div className="divide-y divide-border -mx-4 -mb-4">
            {incidents.slice(0, 4).map((i) => (
              <Link
                key={i.id}
                href={`/incidents`}
                className="block px-4 py-3 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium leading-snug truncate">{i.title}</div>
                  <span
                    className={cn(
                      "text-[10px] font-medium uppercase shrink-0",
                      i.severity === "critical" && "text-red-600",
                      i.severity === "high" && "text-orange-600",
                      i.severity === "medium" && "text-amber-600",
                      i.severity === "low" && "text-blue-600",
                    )}
                  >
                    {i.severity}
                  </span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                  <span className="font-mono">{i.service}</span>
                  <span>·</span>
                  <span>{i.duration}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Slowest + regions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Slowest endpoints" description="By P95 latency" />
          <div className="space-y-3">
            {slowestEndpoints.map((e) => (
              <div key={e.url} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{e.name}</div>
                  <div className="text-[11px] text-muted-foreground font-mono truncate">{e.url}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold tabular-nums">{e.p95}ms</div>
                  <div className="text-[10px] text-muted-foreground">p99 {e.p99}ms</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Region health" description="Aggregated health per region" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {regions.map((r) => (
              <div key={r.name} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs text-muted-foreground">{r.name}</div>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      r.uptime > 99.5
                        ? "bg-emerald-500"
                        : r.uptime > 98
                          ? "bg-amber-500"
                          : "bg-red-500",
                    )}
                  />
                </div>
                <div className="mt-1.5 flex items-end justify-between">
                  <div>
                    <div className="text-lg font-semibold tabular-nums">{r.uptime}%</div>
                    <div className="text-[11px] text-muted-foreground">{r.monitors} monitors</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium tabular-nums">{r.latency}ms</div>
                    <div className="text-[11px] text-muted-foreground">avg latency</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent checks table */}
      <Card>
        <CardHeader
          title="Recent checks"
          description="Latest health probe results"
          extra={
            <Button asChild variant="ghost" size="sm">
              <Link href="/monitors">All monitors <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          }
        />
        <div className="-mx-4 -mb-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-medium px-4 py-2">Monitor</th>
                <th className="text-left font-medium px-4 py-2">Method</th>
                <th className="text-left font-medium px-4 py-2">Endpoint</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
                <th className="text-right font-medium px-4 py-2">Uptime</th>
                <th className="text-right font-medium px-4 py-2">Latency</th>
                <th className="text-right font-medium px-4 py-2">Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monitors.slice(0, 6).map((m) => (
                <tr key={m.id} className="hover:bg-accent/30">
                  <td className="px-4 py-2.5 font-medium">{m.name}</td>
                  <td className="px-4 py-2.5"><MethodBadge method={m.method} /></td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground truncate max-w-xs">{m.url}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{m.uptime}%</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{m.avgLatency || "—"}ms</td>
                  <td className="px-4 py-2.5 text-right text-muted-foreground text-xs">{m.lastChecked}</td>
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
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>{children}</div>
  )
}

function CardHeader({
  title,
  description,
  extra,
}: {
  title: string
  description?: string
  extra?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      {extra}
    </div>
  )
}

function MetricCard({
  icon: Icon,
  iconColor,
  label,
  value,
  trend,
  trendPositive,
  context,
  spark,
  sparkColor,
}: {
  icon: any
  iconColor: string
  label: string
  value: string
  trend: string
  trendPositive?: boolean
  context: string
  spark: any[]
  sparkColor: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
        <div className="w-16 h-8 -mb-1">
          <Sparkline data={spark} color={sparkColor} />
        </div>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-xs">
        <span className={cn("inline-flex items-center gap-0.5 font-medium", trendPositive ? "text-emerald-600" : "text-muted-foreground")}>
          {trendPositive ? <TrendingUp className="h-3 w-3" /> : null}
          {trend}
        </span>
        <span className="text-muted-foreground">{context}</span>
      </div>
    </div>
  )
}
