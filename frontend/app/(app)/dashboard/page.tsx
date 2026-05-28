"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  XCircle,
  Terminal,
  Zap,
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
  liveChecks as initialLiveChecks,
  incidents,
  regions,
  slowestEndpoints,
  sparklineData,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [checks, setChecks] = useState(initialLiveChecks)
  const [logLines, setLogLines] = useState(initialLogLines)

  // Live check stream ticks
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMon = monitors[Math.floor(Math.random() * monitors.length)]
      const randomRegion = regions[Math.floor(Math.random() * regions.length)].name
      const responseCodes = [200, 200, 200, 200, 200, 200, 201, 204, 301, 404, 500, 503]
      const randomStatus = responseCodes[Math.floor(Math.random() * responseCodes.length)]
      
      const newCheck = {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        monitor: randomMon.name,
        region: randomRegion,
        status: randomStatus,
        latency: randomStatus >= 500 ? 0 : Math.floor(Math.random() * 150) + 50
      }

      setChecks((prev) => [newCheck, ...prev.slice(0, prev.length - 1)])
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  // Terminal log stream
  useEffect(() => {
    const logTemplates = [
      { level: "INFO", msg: "GET /v2/auth/health → 200 OK (138ms) us-east-1" },
      { level: "INFO", msg: "POST /v2/charge → 201 Created (192ms) us-east-1" },
      { level: "WARN", msg: "GET /v2/customers/search → 200 OK (1280ms) ap-southeast-1 [SLOW]" },
      { level: "ERR", msg: "POST /notify → 503 Service Unavailable (0ms) eu-west-1" },
      { level: "INFO", msg: "GET /healthz → 200 OK (28ms) global [CDN]" },
      { level: "INFO", msg: "POST /v1/claims → 200 OK (248ms) us-east-1" },
      { level: "WARN", msg: "POST /dispatch → 200 OK (1120ms) eu-west-1 [SLOW]" },
      { level: "INFO", msg: "GET /health → 200 OK (64ms) us-west-2" },
      { level: "ERR", msg: "POST /notify → 503 Service Unavailable (0ms) eu-west-1 [RETRY 3/3]" },
      { level: "INFO", msg: "webhook.delivered → hooks.acme.com/watcher (INC-2486)" },
      { level: "INFO", msg: "alert.fired → Slack #oncall (critical: notifications-worker)" },
      { level: "INFO", msg: "cert.check → api.acme.com:443 expires in 84d" },
    ]
    const interval = setInterval(() => {
      const template = logTemplates[Math.floor(Math.random() * logTemplates.length)]
      const now = new Date()
      const ts = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`
      setLogLines((prev) => [{ ts, ...template }, ...prev.slice(0, 11)])
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4 text-[#F3F4F6]">
      {/* Status banner */}
      <div className="rounded border border-white/5 bg-[#22C55E]/10 px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shrink-0" />
          <div>
            <div className="text-[12px] font-semibold text-[#F3F4F6]">All systems operational</div>
            <div className="text-[11px] text-[#9CA3AF] font-mono">
              24 monitors · 6 regions · last probe 8s ago · env:<span className="text-[#22C55E]">production</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border border-white/5 bg-[#151618] text-[#9CA3AF]">v2.14.0</span>
          <Link href="/status-pages" className="h-7 border border-white/5 bg-[#151618] hover:bg-[#1E2024] text-[11px] text-[#F3F4F6] px-2.5 rounded inline-flex items-center gap-1 transition-colors">
            View status page <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <PageHeader
        title="Overview"
        description="Realtime health across every project, monitor, and region."
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
        <MetricCard
          icon={CheckCircle2}
          iconColor="text-[#22C55E]"
          label="Overall Uptime"
          value="99.94%"
          trend="+0.02%"
          trendPositive
          context="vs. last 30d"
          spark={sparklineData(99)}
          sparkColor="#22C55E"
        />
        <MetricCard
          icon={Activity}
          iconColor="text-[#4F8CFF]"
          label="Active Monitors"
          value="24"
          trend="+3"
          trendPositive
          context="3 added this week"
          spark={sparklineData(20)}
          sparkColor="#4F8CFF"
        />
        <MetricCard
          icon={XCircle}
          iconColor="text-[#EF4444]"
          label="Failed Checks"
          value="8"
          trend="-12"
          trendPositive
          context="vs. last 24h"
          spark={sparklineData(10)}
          sparkColor="#EF4444"
        />
        <MetricCard
          icon={Clock}
          iconColor="text-[#9CA3AF]"
          label="Avg Latency"
          value="184ms"
          trend="-12ms"
          trendPositive
          context="P50 across regions"
          spark={sparklineData(180)}
          sparkColor="#9CA3AF"
        />
        <MetricCard
          icon={AlertTriangle}
          iconColor="text-[#F59E0B]"
          label="Open Incidents"
          value="2"
          trend="1 critical"
          context="MTTR 24m"
          spark={sparklineData(2)}
          sparkColor="#F59E0B"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Latency over time"
            description="P50, P95, P99 — last 24 hours"
            extra={<span className="text-[10px] text-[#9CA3AF] font-mono">all regions</span>}
          />
          <LatencyChart data={latencyData} height={260} />
        </Card>
        <Card>
          <CardHeader title="Status distribution" description="Across 24 monitors" />
          <StatusDistributionChart data={statusDistribution} height={260} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <Card>
          <CardHeader title="Uptime trend" description="Last 30 days" />
          <UptimeChart data={uptimeData} height={220} />
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Incident frequency" description="By severity, last 6 weeks" />
          <IncidentChart data={incidentFrequency} height={220} />
        </Card>
      </div>

      {/* Live terminal + API trace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        {/* Terminal log panel */}
        <Card className="overflow-hidden">
          <CardHeader
            title="System log"
            extra={
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-[#9CA3AF] font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  streaming
                </span>
                <Terminal className="h-3 w-3 text-[#9CA3AF]" />
              </div>
            }
          />
          <div className="bg-[#0A0C10] rounded border border-white/5 font-mono text-[10px] leading-relaxed p-2.5 max-h-[240px] overflow-y-auto scrollbar-thin">
            {logLines.map((l, i) => (
              <div key={i} className="flex gap-2 py-[2px] hover:bg-white/[0.02]">
                <span className="text-[#9CA3AF]/60 shrink-0 select-none">{l.ts}</span>
                <span className={cn(
                  "shrink-0 w-6 text-right",
                  l.level === "ERR" ? "text-[#EF4444]" : l.level === "WARN" ? "text-[#F59E0B]" : "text-[#9CA3AF]/60"
                )}>{l.level}</span>
                <span className={cn(
                  l.level === "ERR" ? "text-[#EF4444]/80" : l.level === "WARN" ? "text-[#F59E0B]/80" : "text-[#9CA3AF]"
                )}>{l.msg}</span>
              </div>
            ))}
            <div className="flex items-center gap-1 text-[#4F8CFF]/40 mt-1">
              <span className="animate-cursor">▋</span>
            </div>
          </div>
        </Card>

        {/* Latency trace */}
        <Card>
          <CardHeader
            title="Latest trace"
            description="POST /v2/charge"
            extra={<span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-white/5 bg-[#22C55E]/10 text-[#22C55E]">200 OK</span>}
          />
          <div className="space-y-1.5 font-mono text-[10px]">
            {[
              { span: "gateway.ingress", dur: "2ms", pct: 1 },
              { span: "auth.verify_token", dur: "18ms", pct: 9 },
              { span: "rate_limiter.check", dur: "4ms", pct: 2 },
              { span: "payments.validate", dur: "12ms", pct: 6 },
              { span: "payments.process_charge", dur: "124ms", pct: 65 },
              { span: "db.write_transaction", dur: "28ms", pct: 15 },
              { span: "webhook.enqueue", dur: "4ms", pct: 2 },
            ].map((s) => (
              <div key={s.span} className="group">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[#9CA3AF] group-hover:text-[#F3F4F6] transition-colors">{s.span}</span>
                  <span className="text-[#F3F4F6] tabular-nums">{s.dur}</span>
                </div>
                <div className="h-1 rounded-full bg-[#1E2024] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4F8CFF] group-hover:bg-[#4F8CFF]/80 transition-colors"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
              <span className="text-[#9CA3AF]">Total duration</span>
              <span className="text-[#F3F4F6] font-semibold">192ms</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Webhook payload + API request preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        {/* Webhook payload snippet */}
        <Card>
          <CardHeader
            title="Last webhook delivery"
            extra={
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-white/5 bg-[#22C55E]/10 text-[#22C55E]">delivered</span>
                <span className="text-[10px] text-[#9CA3AF] font-mono">32ms</span>
              </div>
            }
          />
          <div className="bg-[#0A0C10] rounded border border-white/5 font-mono text-[10px] p-2.5 text-[#9CA3AF] leading-relaxed overflow-x-auto">
            <div><span className="text-[#9CA3AF]/50">POST</span> <span className="text-[#4F8CFF]">hooks.acme.com/watcher</span></div>
            <div className="mt-1.5 text-[#9CA3AF]/50">{"{"}</div>
            <div className="pl-3"><span className="text-[#A78BFA]">"event"</span>: <span className="text-[#22C55E]">"incident.created"</span>,</div>
            <div className="pl-3"><span className="text-[#A78BFA]">"incident_id"</span>: <span className="text-[#22C55E]">"INC-2486"</span>,</div>
            <div className="pl-3"><span className="text-[#A78BFA]">"severity"</span>: <span className="text-[#22C55E]">"critical"</span>,</div>
            <div className="pl-3"><span className="text-[#A78BFA]">"service"</span>: <span className="text-[#22C55E]">"notifications-worker"</span>,</div>
            <div className="pl-3"><span className="text-[#A78BFA]">"region"</span>: <span className="text-[#22C55E]">"eu-west-1"</span>,</div>
            <div className="pl-3"><span className="text-[#A78BFA]">"status_code"</span>: <span className="text-[#EF4444]">503</span>,</div>
            <div className="pl-3"><span className="text-[#A78BFA]">"timestamp"</span>: <span className="text-[#22C55E]">"2026-05-28T14:18:42Z"</span>,</div>
            <div className="pl-3"><span className="text-[#A78BFA]">"check_id"</span>: <span className="text-[#22C55E]">"chk_9f3b2a1e"</span></div>
            <div className="text-[#9CA3AF]/50">{"}"}</div>
          </div>
        </Card>

        {/* API request preview */}
        <Card>
          <CardHeader
            title="Probe configuration"
            description="Auth Service Health"
            extra={<span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-white/5 bg-[#4F8CFF]/10 text-[#4F8CFF]">GET</span>}
          />
          <div className="bg-[#0A0C10] rounded border border-white/5 font-mono text-[10px] p-2.5 text-[#9CA3AF] leading-relaxed overflow-x-auto">
            <div className="text-[#9CA3AF]/50"># watcher probe config</div>
            <div className="mt-1"><span className="text-[#4F8CFF]">endpoint</span>: <span className="text-[#22C55E]">https://api.acme.com/v2/auth/health</span></div>
            <div><span className="text-[#4F8CFF]">method</span>: GET</div>
            <div><span className="text-[#4F8CFF]">interval</span>: 30s</div>
            <div><span className="text-[#4F8CFF]">timeout</span>: 10s</div>
            <div><span className="text-[#4F8CFF]">expected_status</span>: <span className="text-[#22C55E]">200</span></div>
            <div><span className="text-[#4F8CFF]">regions</span>:</div>
            <div className="pl-3">- us-east-1</div>
            <div className="pl-3">- eu-west-1</div>
            <div className="pl-3">- ap-southeast-1</div>
            <div><span className="text-[#4F8CFF]">headers</span>:</div>
            <div className="pl-3"><span className="text-[#A78BFA]">Authorization</span>: Bearer ${"${WATCHER_TOKEN}"}</div>
            <div className="pl-3"><span className="text-[#A78BFA]">X-Probe-ID</span>: mon_01</div>
            <div><span className="text-[#4F8CFF]">assertions</span>:</div>
            <div className="pl-3">- body.status == <span className="text-[#22C55E]">"ok"</span></div>
            <div className="pl-3">- latency {"<"} <span className="text-[#F59E0B]">500ms</span></div>
          </div>
        </Card>
      </div>

      {/* Live checks + recent incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Live check stream"
            description="Newest results from all regions"
            extra={
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                Live
              </span>
            }
          />
          <div className="font-mono text-xs">
            <div className="grid grid-cols-[80px_1fr_120px_60px_70px] gap-2 px-2 py-1.5 border-b border-white/5 text-[10px] text-[#9CA3AF] font-bold uppercase select-none">
              <span>Time</span>
              <span>Monitor</span>
              <span>Region</span>
              <span>Status</span>
              <span className="text-right">Latency</span>
            </div>
            <div className="divide-y divide-white/5">
              {checks.map((c, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[80px_1fr_120px_60px_70px] gap-2 px-2 py-1.5 hover:bg-[#1E2024]/50 transition-colors"
                >
                  <span className="text-[#9CA3AF]">{c.time}</span>
                  <span className="font-sans truncate font-medium text-[#F3F4F6]">{c.monitor}</span>
                  <span className="text-[#9CA3AF] truncate">{c.region}</span>
                  <span className={c.status >= 500 ? "text-[#EF4444] font-semibold" : c.status >= 400 ? "text-[#F59E0B] font-semibold" : "text-[#22C55E] font-semibold"}>
                    {c.status}
                  </span>
                  <span className="text-right tabular-nums text-[#9CA3AF]">
                    {c.latency > 0 ? `${c.latency}ms` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader title="Recent incidents" description="Last 7 days" />
          <div className="divide-y divide-white/5 -mx-3.5 -mb-3.5">
            {incidents.slice(0, 4).map((i) => (
              <Link
                key={i.id}
                href={`/incidents`}
                className="block px-3.5 py-3 hover:bg-[#1E2024]/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[12px] font-semibold leading-snug truncate text-[#F3F4F6]">{i.title}</div>
                  <span
                    className={cn(
                      "text-[9px] font-mono font-semibold uppercase shrink-0 px-1.5 py-0.5 rounded border border-white/5",
                      i.severity === "critical" && "bg-[#EF4444]/10 text-[#EF4444]",
                      i.severity === "high" && "bg-[#F97316]/10 text-[#F97316]",
                      i.severity === "medium" && "bg-[#F59E0B]/10 text-[#F59E0B]",
                      i.severity === "low" && "bg-[#4F8CFF]/10 text-[#4F8CFF]",
                    )}
                  >
                    {i.severity}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-[#9CA3AF] flex items-center gap-2">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <Card>
          <CardHeader title="Slowest endpoints" description="By P95 latency" />
          <div className="space-y-3">
            {slowestEndpoints.map((e) => (
              <div key={e.url} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold truncate text-[#F3F4F6]">{e.name}</div>
                  <div className="text-[10px] text-[#9CA3AF] font-mono truncate">{e.url}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[12px] font-semibold tabular-nums text-[#F3F4F6]">{e.p95}ms</div>
                  <div className="text-[9px] text-[#9CA3AF]">p99 {e.p99}ms</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Region health" description="Aggregated health per region" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
            {regions.map((r) => (
              <div key={r.name} className="rounded border border-white/5 bg-[#090A0B]/40 p-3 hover:bg-[#1E2024]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10px] text-[#9CA3AF]">{r.name}</div>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      r.uptime > 99.5
                        ? "bg-[#22C55E]"
                        : r.uptime > 98
                          ? "bg-[#F59E0B]"
                          : "bg-[#EF4444]",
                    )}
                  />
                </div>
                <div className="mt-1.5 flex items-end justify-between">
                  <div>
                    <div className="text-lg font-semibold tabular-nums text-[#F3F4F6]">{r.uptime}%</div>
                    <div className="text-[10px] text-[#9CA3AF]">{r.monitors} monitors</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-medium tabular-nums text-[#F3F4F6]">{r.latency}ms</div>
                    <div className="text-[10px] text-[#9CA3AF]">avg latency</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Environment services table */}
      <Card>
        <CardHeader
          title="Service health by environment"
          description="Latest health probe results across environments"
          extra={
            <div className="flex items-center gap-1.5">
              {["Production", "Staging"].map((env) => (
                <span key={env} className={cn(
                  "text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-white/5",
                  env === "Production" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                )}>{env}</span>
              ))}
            </div>
          }
        />
        <div className="-mx-3.5 -mb-3.5 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-y border-white/5 bg-[#090A0B] text-[10px] text-[#9CA3AF] font-bold uppercase">
                <th className="text-left px-3.5 py-2">Service</th>
                <th className="text-left px-3.5 py-2">Endpoint</th>
                <th className="text-left px-3.5 py-2">Env</th>
                <th className="text-left px-3.5 py-2">Method</th>
                <th className="text-left px-3.5 py-2">Status</th>
                <th className="text-right px-3.5 py-2">Response</th>
                <th className="text-right px-3.5 py-2">Uptime</th>
                <th className="text-right px-3.5 py-2">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { svc: "Auth API", endpoint: "/v2/auth/health", env: "prod", method: "GET", code: 200, uptime: 99.98, latency: 138 },
                { svc: "Payments API", endpoint: "/v2/charge", env: "prod", method: "POST", code: 200, uptime: 99.94, latency: 192 },
                { svc: "Gateway", endpoint: "/health", env: "prod", method: "GET", code: 200, uptime: 99.99, latency: 64 },
                { svc: "Worker Queue", endpoint: "/notify", env: "prod", method: "POST", code: 503, uptime: 96.21, latency: 0 },
                { svc: "Auth API", endpoint: "/v2/auth/health", env: "staging", method: "GET", code: 200, uptime: 99.72, latency: 184 },
                { svc: "Payments API", endpoint: "/v2/charge", env: "staging", method: "POST", code: 200, uptime: 99.88, latency: 212 },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-[#1E2024]/50 transition-colors">
                  <td className="px-3.5 py-2.5 font-semibold text-[#F3F4F6]">{r.svc}</td>
                  <td className="px-3.5 py-2.5 font-mono text-[10.5px] text-[#9CA3AF]">{r.endpoint}</td>
                  <td className="px-3.5 py-2.5">
                    <span className={cn(
                      "text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-white/5",
                      r.env === "prod" ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                    )}>{r.env === "prod" ? "production" : "staging"}</span>
                  </td>
                  <td className="px-3.5 py-2.5"><MethodBadge method={r.method} /></td>
                  <td className="px-3.5 py-2.5">
                    <span className={cn(
                      "font-mono text-[11px] font-semibold",
                      r.code >= 500 ? "text-[#EF4444]" : r.code >= 400 ? "text-[#F59E0B]" : "text-[#22C55E]"
                    )}>{r.code}</span>
                  </td>
                  <td className="px-3.5 py-2.5 text-right tabular-nums text-[#F3F4F6]">{r.uptime}%</td>
                  <td className="px-3.5 py-2.5 text-right tabular-nums text-[#F3F4F6]">{r.latency > 0 ? `${r.latency}ms` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

/* ─── Local components ────────────────────────────────── */

const initialLogLines = [
  { ts: "14:32:58.102", level: "INFO", msg: "GET /v2/auth/health → 200 OK (138ms) us-east-1" },
  { ts: "14:32:54.811", level: "INFO", msg: "POST /v2/charge → 201 Created (192ms) us-east-1" },
  { ts: "14:32:51.228", level: "ERR", msg: "POST /notify → 503 Service Unavailable (0ms) eu-west-1" },
  { ts: "14:32:48.442", level: "WARN", msg: "GET /v2/customers/search → 200 OK (1280ms) ap-southeast-1 [SLOW]" },
  { ts: "14:32:44.910", level: "INFO", msg: "GET /healthz → 200 OK (28ms) global [CDN]" },
  { ts: "14:32:41.017", level: "INFO", msg: "webhook.delivered → hooks.acme.com/watcher (INC-2486)" },
  { ts: "14:32:38.322", level: "INFO", msg: "alert.fired → Slack #oncall (critical: notifications-worker)" },
  { ts: "14:32:34.118", level: "INFO", msg: "POST /v1/claims → 200 OK (248ms) us-east-1" },
  { ts: "14:32:31.502", level: "ERR", msg: "POST /notify → 503 Service Unavailable (0ms) eu-west-1 [RETRY 3/3]" },
  { ts: "14:32:28.991", level: "INFO", msg: "cert.check → api.acme.com:443 expires in 84d" },
  { ts: "14:32:24.210", level: "INFO", msg: "GET /health → 200 OK (64ms) us-west-2" },
  { ts: "14:32:20.780", level: "WARN", msg: "POST /dispatch → 200 OK (1120ms) eu-west-1 [SLOW]" },
]

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded border border-white/5 bg-[#151618] p-3.5", className)}>{children}</div>
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
    <div className="flex items-start justify-between gap-3 mb-3.5 select-none">
      <div>
        <div className="text-[12px] font-bold text-[#F3F4F6]">{title}</div>
        {description && <div className="text-[10px] text-[#9CA3AF] mt-0.5">{description}</div>}
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
    <div className="rounded border border-white/5 bg-[#151618] p-3.5 hover:border-white/10 transition-all">
      <div className="flex items-center justify-between select-none">
        <div className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">{label}</div>
        <Icon className={cn("h-3.5 w-3.5", iconColor)} />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="text-[20px] font-bold tabular-nums tracking-tight text-[#F3F4F6]">{value}</div>
        <div className="w-14 h-7 -mb-0.5">
          <Sparkline data={spark} color={sparkColor} />
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] select-none">
        <span className={cn("inline-flex items-center gap-0.5 font-semibold", trendPositive ? "text-[#22C55E]" : "text-[#9CA3AF]")}>
          {trendPositive ? <TrendingUp className="h-3 w-3" /> : null}
          {trend}
        </span>
        <span className="text-[#9CA3AF]">{context}</span>
      </div>
    </div>
  )
}
