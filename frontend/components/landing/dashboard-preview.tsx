"use client"

import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { LatencyChart, Sparkline } from "@/components/charts"
import { latencyData, sparklineData } from "@/lib/mock-data"
import { StatusBadge, MethodBadge } from "@/components/status-badge"

export function LandingDashboardPreview() {
  return (
    <div className="bg-[#0C0D0E] w-full rounded overflow-hidden border border-white/5">
      {/* Fake topbar */}
      <div className="h-9 border-b border-white/5 bg-[#090A0B] flex items-center px-3 gap-2 select-none">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/5" />
        </div>
        <div className="ml-3 text-[11px] text-[#9CA3AF] font-mono truncate">
          watcher.dev/dashboard
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-[#9CA3AF]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4F8CFF]" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-12">
        {/* Mini sidebar */}
        <div className="col-span-3 lg:col-span-2 border-r border-white/5 bg-[#090A0B] hidden md:flex flex-col py-3 px-2 gap-0.5">
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
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer select-none ${
                i.active ? "bg-[#1E2024] text-white" : "text-[#9CA3AF] hover:bg-[#1E2024]/50 hover:text-[#F3F4F6]"
              }`}
            >
              {i.label}
            </div>
          ))}
        </div>

        <div className="col-span-12 md:col-span-9 lg:col-span-10 p-4 space-y-3 bg-[#0C0D0E]">
          {/* Stat row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: CheckCircle2, label: "Uptime", value: "99.94%", color: "text-[#4F8CFF]" },
              { icon: Activity, label: "Monitors", value: "24", color: "text-[#4F8CFF]" },
              { icon: Clock, label: "Avg Latency", value: "184ms", color: "text-[#F3F4F6]" },
              { icon: AlertTriangle, label: "Incidents", value: "2", color: "text-[#AFCBFF]" },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="rounded border border-white/5 bg-[#151618] p-2.5">
                  <div className="flex items-center justify-between select-none">
                    <div className="text-[10px] text-[#9CA3AF] font-medium">{s.label}</div>
                    <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                  </div>
                  <div className="mt-1 text-lg font-bold tabular-nums tracking-tight text-[#F3F4F6]">{s.value}</div>
                  <div className="h-5 -mb-1 mt-1">
                    <Sparkline data={sparklineData(50)} color="#4F8CFF" />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Chart + monitors */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2 rounded border border-white/5 bg-[#151618] p-3">
              <div className="flex items-center justify-between mb-2 select-none">
                <div>
                  <div className="text-xs font-semibold text-[#F3F4F6]">Latency (last 24h)</div>
                  <div className="text-[10px] text-[#9CA3AF]">P50 · P95 · P99 across regions</div>
                </div>
                <div className="flex gap-2 text-[9px] text-[#9CA3AF]">
                  <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#4F8CFF]" />P50</span>
                  <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#4F8CFF]" />P95</span>
                  <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />P99</span>
                </div>
              </div>
              <LatencyChart data={latencyData} height={170} />
            </div>

            <div className="rounded border border-white/5 bg-[#151618] overflow-hidden">
              <div className="px-3 py-2 border-b border-white/5 select-none">
                <div className="text-xs font-semibold text-[#F3F4F6]">Monitors</div>
                <div className="text-[10px] text-[#9CA3AF]">Top services</div>
              </div>
              <div className="divide-y divide-white/5 text-xs">
                {[
                  { name: "Auth Service", method: "GET", status: "operational" as const, ms: 138 },
                  { name: "Payments API", method: "POST", status: "operational" as const, ms: 192 },
                  { name: "Notifications", method: "POST", status: "down" as const, ms: 0 },
                  { name: "Public Gateway", method: "GET", status: "operational" as const, ms: 64 },
                ].map((m) => (
                  <div key={m.name} className="px-3 py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-2">
                      <MethodBadge method={m.method} />
                      <span className="truncate text-[#F3F4F6] font-medium">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono tabular-nums text-[10px] text-[#9CA3AF]">
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
