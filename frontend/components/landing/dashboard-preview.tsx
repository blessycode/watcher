"use client"

import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { LatencyChart, Sparkline } from "@/components/charts"
import { latencyData, sparklineData } from "@/lib/mock-data"
import { StatusBadge, MethodBadge } from "@/components/status-badge"

export function LandingDashboardPreview() {
  return (
    <div className="bg-background">
      {/* Fake topbar */}
      <div className="h-9 border-b border-border bg-card/60 flex items-center px-3 gap-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <div className="ml-3 text-[11px] text-muted-foreground font-mono truncate">
          watcher.dev/dashboard
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-12">
        {/* Mini sidebar */}
        <div className="col-span-3 lg:col-span-2 border-r border-border bg-card/40 hidden md:flex flex-col py-3 px-2 gap-0.5">
          {[
            { label: "Dashboard", active: true },
            { label: "Projects" },
            { label: "Monitors" },
            { label: "Incidents" },
            { label: "Status Pages" },
            { label: "Alerts" },
            { label: "Analytics" },
            { label: "Settings" },
          ].map((i) => (
            <div
              key={i.label}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium ${
                i.active ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              {i.label}
            </div>
          ))}
        </div>

        <div className="col-span-12 md:col-span-9 lg:col-span-10 p-4 space-y-3">
          {/* Stat row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: CheckCircle2, label: "Uptime", value: "99.94%", color: "text-emerald-400" },
              { icon: Activity, label: "Monitors", value: "24", color: "text-primary" },
              { icon: Clock, label: "Avg Latency", value: "184ms", color: "text-foreground" },
              { icon: AlertTriangle, label: "Incidents", value: "2", color: "text-amber-400" },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="rounded-lg border border-border bg-card p-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                  </div>
                  <div className="mt-1 text-lg font-semibold tabular-nums tracking-tight">{s.value}</div>
                  <div className="h-5 -mb-1">
                    <Sparkline data={sparklineData(50)} color="#8fb7ff" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Chart + monitors */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2 rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-semibold">Latency (last 24h)</div>
                  <div className="text-[10px] text-muted-foreground">P50 · P95 · P99 across regions</div>
                </div>
                <div className="flex gap-3 text-[9px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />P50</span>
                  <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary" />P95</span>
                  <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-400" />P99</span>
                </div>
              </div>
              <LatencyChart data={latencyData} height={170} />
            </div>

            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="px-3 py-2 border-b border-border">
                <div className="text-xs font-semibold">Monitors</div>
                <div className="text-[10px] text-muted-foreground">Top services</div>
              </div>
              <div className="divide-y divide-border text-xs">
                {[
                  { name: "Auth Service", method: "GET", status: "operational" as const, ms: 138 },
                  { name: "Payments API", method: "POST", status: "operational" as const, ms: 192 },
                  { name: "Notifications", method: "POST", status: "down" as const, ms: 0 },
                  { name: "Public Gateway", method: "GET", status: "operational" as const, ms: 64 },
                ].map((m) => (
                  <div key={m.name} className="px-3 py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-2">
                      <MethodBadge method={m.method} />
                      <span className="truncate">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono tabular-nums text-[10px] text-muted-foreground">
                        {m.ms ? `${m.ms}ms` : "—"}
                      </span>
                      <StatusBadge status={m.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
