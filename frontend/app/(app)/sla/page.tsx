"use client"

import { AlertTriangle, Clock3, Target } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { getIncidents, getMonitors } from "@/lib/api"
import type { Incident, Monitor } from "@/lib/types"

const MONTH_MINUTES = 30 * 24 * 60

export default function SLAPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [target, setTarget] = useState(99.9)

  useEffect(() => {
    Promise.all([getMonitors(), getIncidents()]).then(([monitorData, incidentData]) => {
      setMonitors(monitorData)
      setIncidents(incidentData)
    }).catch(() => undefined)
  }, [])

  const uptime = useMemo(() => {
    if (!monitors.length) return 100
    return monitors.reduce((sum, monitor) => sum + monitor.uptime_percentage, 0) / monitors.length
  }, [monitors])
  const downtime = Math.max(0, Math.round(((100 - uptime) / 100) * MONTH_MINUTES))
  const budget = Math.round(((100 - target) / 100) * MONTH_MINUTES)
  const breachRisk = downtime > budget
  const openIncidents = incidents.filter((incident) => incident.status !== "resolved").length

  return (
    <div className="space-y-4 text-[#F3F4F6]">
      <PageHeader
        title="SLA"
        description="Track uptime commitments, downtime budget, incident pressure, and service reliability."
        actions={<select value={target} onChange={(event) => setTarget(Number(event.target.value))} className="h-8 rounded border border-white/5 bg-[#151618] px-3 text-xs outline-none focus:border-[#4F8CFF]"><option value={99}>99.00% target</option><option value={99.5}>99.50% target</option><option value={99.9}>99.90% target</option><option value={99.99}>99.99% target</option></select>}
      />

      <div className="grid gap-2.5 md:grid-cols-4">
        <Metric label="Current SLA" value={`${uptime.toFixed(2)}%`} sub="average monitor uptime" />
        <Metric label="Target SLA" value={`${target}%`} sub="monthly commitment" />
        <Metric label="Downtime used" value={`${downtime}m`} sub={`budget ${budget}m`} />
        <Metric label="Open incidents" value={openIncidents.toString()} sub="active reliability risk" />
      </div>

      <section className={`rounded border p-4 ${breachRisk ? "border-[#EF4444]/30 bg-[#EF4444]/10" : "border-[#4F8CFF]/25 bg-[#4F8CFF]/10"}`}>
        <div className="flex items-start gap-3">
          {breachRisk ? <AlertTriangle className="mt-0.5 h-5 w-5 text-[#EF4444]" /> : <Target className="mt-0.5 h-5 w-5 text-[#4F8CFF]" />}
          <div>
            <h2 className="text-sm font-bold">{breachRisk ? "SLA budget exceeded" : "SLA budget healthy"}</h2>
            <p className="mt-1 text-sm text-[#D1D5DB]">
              Watcher estimates monthly downtime from monitor uptime. Use this to see whether reliability is trending toward a customer-impacting SLA breach.
            </p>
          </div>
        </div>
      </section>

      <div className="rounded border border-white/5 bg-[#151618]">
        <div className="flex items-center gap-2 border-b border-white/5 px-3.5 py-3 text-xs font-bold">
          <Clock3 className="h-3.5 w-3.5 text-[#4F8CFF]" />
          Service SLA summary
        </div>
        <div className="divide-y divide-white/5">
          {monitors.map((monitor) => {
            const serviceDowntime = Math.max(0, Math.round(((100 - monitor.uptime_percentage) / 100) * MONTH_MINUTES))
            return (
              <div key={monitor.id} className="grid gap-3 px-3.5 py-3 text-xs md:grid-cols-[1fr_110px_120px_120px] md:items-center">
                <div>
                  <div className="font-semibold">{monitor.name}</div>
                  <div className="mt-0.5 truncate text-[#9CA3AF]">{monitor.url}</div>
                </div>
                <div className="font-mono">{monitor.uptime_percentage.toFixed(2)}%</div>
                <div className="font-mono text-[#9CA3AF]">{serviceDowntime}m downtime</div>
                <div className="capitalize text-[#AFCBFF]">{monitor.status}</div>
              </div>
            )
          })}
          {!monitors.length && <div className="px-3.5 py-10 text-center text-sm text-[#9CA3AF]">Create monitors to calculate SLA summaries.</div>}
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="rounded border border-white/5 bg-[#151618] p-3.5"><div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{label}</div><div className="mt-1.5 text-[22px] font-bold tabular-nums">{value}</div><div className="text-[10px] text-[#9CA3AF]">{sub}</div></div>
}
