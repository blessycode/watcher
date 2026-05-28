import { Download, CalendarDays } from "lucide-react"
import { PageHeader } from "@/components/page-header"
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
    <div className="space-y-4 text-[#F3F4F6]">
      <PageHeader
        title="Analytics"
        description="Long-term API health, SLA compliance, and regional performance."
        actions={
          <div className="flex items-center gap-1.5">
            <button className="h-7 px-2.5 rounded border border-white/5 bg-[#151618] hover:bg-[#1E2024] text-[10px] text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors inline-flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3" /> Last 30 days
            </button>
            <button className="h-7 text-[11px] bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white px-3 rounded inline-flex items-center gap-1 transition-colors">
              <Download className="h-3 w-3" /> Export report
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { label: "P50 latency", value: "142ms", sub: "-8ms vs prev" },
          { label: "P95 latency", value: "412ms", sub: "+22ms vs prev" },
          { label: "P99 latency", value: "892ms", sub: "+48ms vs prev" },
          { label: "Error rate", value: "0.06%", sub: "-0.02% vs prev" },
        ].map((s) => (
          <div key={s.label} className="rounded border border-white/5 bg-[#151618] p-3.5 hover:border-white/10 transition-all">
            <div className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">{s.label}</div>
            <div className="mt-1.5 text-[20px] font-bold tabular-nums tracking-tight text-[#F3F4F6]">{s.value}</div>
            <div className="text-[10px] text-[#9CA3AF]">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <Card className="lg:col-span-2">
          <CardHeader title="Latency distribution" description="P50 / P95 / P99 over time" />
          <LatencyChart data={latencyData} height={260} />
        </Card>
        <Card>
          <CardHeader title="Uptime trend" description="30-day rolling average" />
          <UptimeChart data={uptimeData} height={260} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <Card className="lg:col-span-2">
          <CardHeader title="Incident frequency by severity" description="Last 6 weeks" />
          <IncidentChart data={incidentFrequency} height={240} />
        </Card>

        <Card>
          <CardHeader title="Failure by region" description="Sorted by error rate" />
          <div className="space-y-2.5">
            {regions.map((r) => (
              <div key={r.name}>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="font-mono text-[#9CA3AF]">{r.name}</span>
                  <span className="text-[#9CA3AF] tabular-nums">{(100 - r.uptime).toFixed(2)}%</span>
                </div>
                <div className="h-1 rounded-full bg-[#1E2024] overflow-hidden">
                  <div
                    className={`h-full ${
                      r.uptime > 99.5 ? "bg-[#22C55E]" : r.uptime > 98 ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                    }`}
                    style={{ width: `${(100 - r.uptime) * 50}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        <Card>
          <CardHeader title="Slowest endpoints" description="Top P95 latency last 24h" />
          <div className="-mx-3.5 -mb-3.5">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-[#090A0B] text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider select-none border-y border-white/5">
                  <th className="text-left px-3.5 py-2">Endpoint</th>
                  <th className="text-right px-3.5 py-2">P95</th>
                  <th className="text-right px-3.5 py-2">P99</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {slowestEndpoints.map((e) => (
                  <tr key={e.url} className="hover:bg-[#1E2024]/50 transition-colors">
                    <td className="px-3.5 py-2.5">
                      <div className="font-semibold text-[#F3F4F6]">{e.name}</div>
                      <div className="text-[10px] text-[#9CA3AF] font-mono">{e.url}</div>
                    </td>
                    <td className="px-3.5 py-2.5 text-right tabular-nums text-[#F3F4F6]">{e.p95}ms</td>
                    <td className="px-3.5 py-2.5 text-right tabular-nums text-[#9CA3AF]">{e.p99}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="SLA summary" description="Last 30 days" />
          <div className="space-y-2.5">
            {[
              { name: "Production APIs", target: 99.9, actual: 99.94 },
              { name: "Customer Portal", target: 99.5, actual: 99.82 },
              { name: "Notification Services", target: 99.0, actual: 96.21 },
            ].map((s) => {
              const pass = s.actual >= s.target
              return (
                <div key={s.name} className="rounded border border-white/5 bg-[#090A0B]/40 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold text-[#F3F4F6]">{s.name}</div>
                    <span
                      className={`text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded border border-white/5 ${
                        pass ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"
                      }`}
                    >
                      {pass ? "Met" : "Breached"}
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-[#9CA3AF] flex items-center justify-between">
                    <span>Target {s.target}%</span>
                    <span className="font-mono tabular-nums text-[#F3F4F6]">{s.actual}%</span>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-[#1E2024] overflow-hidden">
                    <div
                      className={`h-full ${pass ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}
                      style={{ width: `${s.actual}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded border border-white/5 bg-[#151618] p-3.5 ${className || ""}`}>{children}</div>
  )
}

function CardHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-3.5 select-none">
      <div className="text-[12px] font-bold text-[#F3F4F6]">{title}</div>
      {description && <div className="text-[10px] text-[#9CA3AF] mt-0.5">{description}</div>}
    </div>
  )
}
