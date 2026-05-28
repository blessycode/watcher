import { Download, CalendarDays } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  LatencyChart,
  UptimeChart,
  IncidentChart,
} from "@/components/charts"
import {
  latencyData,
  uptimeData,
  incidentFrequency,
  regions,
  slowestEndpoints,
} from "@/lib/mock-data"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Long-term API health, SLA compliance, and regional performance."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 bg-transparent">
              <CalendarDays className="h-4 w-4 mr-1.5" /> Last 30 days
            </Button>
            <Button size="sm" className="h-9">
              <Download className="h-4 w-4 mr-1.5" /> Export report
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "P50 latency", value: "142ms", sub: "-8ms vs prev" },
          { label: "P95 latency", value: "412ms", sub: "+22ms vs prev" },
          { label: "P99 latency", value: "892ms", sub: "+48ms vs prev" },
          { label: "Error rate", value: "0.06%", sub: "-0.02% vs prev" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1.5 text-2xl font-semibold tabular-nums">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold">Latency distribution</div>
            <div className="text-xs text-muted-foreground">P50 / P95 / P99 over time</div>
          </div>
          <LatencyChart data={latencyData} height={260} />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold">Uptime trend</div>
            <div className="text-xs text-muted-foreground">30-day rolling average</div>
          </div>
          <UptimeChart data={uptimeData} height={260} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold">Incident frequency by severity</div>
            <div className="text-xs text-muted-foreground">Last 6 weeks</div>
          </div>
          <IncidentChart data={incidentFrequency} height={240} />
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold">Failure by region</div>
            <div className="text-xs text-muted-foreground">Sorted by error rate</div>
          </div>
          <div className="space-y-3">
            {regions.map((r) => (
              <div key={r.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono">{r.name}</span>
                  <span className="text-muted-foreground tabular-nums">{(100 - r.uptime).toFixed(2)}%</span>
                </div>
                <div className="h-1.5 rounded bg-secondary overflow-hidden">
                  <div
                    className={`h-full ${
                      r.uptime > 99.5 ? "bg-emerald-500" : r.uptime > 98 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${(100 - r.uptime) * 50}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4">
            <div className="text-sm font-semibold">Slowest endpoints</div>
            <div className="text-xs text-muted-foreground">Top P95 latency last 24h</div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2">Endpoint</th>
                <th className="text-right font-medium px-4 py-2">P95</th>
                <th className="text-right font-medium px-4 py-2">P99</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {slowestEndpoints.map((e) => (
                <tr key={e.url}>
                  <td className="px-4 py-2.5">
                    <div className="font-medium">{e.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{e.url}</div>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{e.p95}ms</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{e.p99}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-semibold">SLA summary</div>
          <div className="text-xs text-muted-foreground">Last 30 days</div>
          <div className="mt-4 space-y-3">
            {[
              { name: "Production APIs", target: 99.9, actual: 99.94 },
              { name: "Customer Portal", target: 99.5, actual: 99.82 },
              { name: "Notification Services", target: 99.0, actual: 96.21 },
            ].map((s) => {
              const pass = s.actual >= s.target
              return (
                <div key={s.name} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{s.name}</div>
                    <span
                      className={`text-xs font-semibold ${
                        pass ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {pass ? "Met" : "Breached"}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
                    <span>Target {s.target}%</span>
                    <span className="font-mono tabular-nums text-foreground">{s.actual}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded bg-secondary overflow-hidden">
                    <div
                      className={`h-full ${pass ? "bg-emerald-500" : "bg-red-500"}`}
                      style={{ width: `${s.actual}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
