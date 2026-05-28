"use client"

import { CalendarDays, Download } from "lucide-react"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { IncidentChart, LatencyChart, UptimeChart } from "@/components/charts"
import { getAnalyticsOverview, getErrorAnalytics, getIncidentAnalytics, getLatencyAnalytics, getUptimeAnalytics } from "@/lib/api"

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>({})
  const [latency, setLatency] = useState<any[]>([])
  const [uptime, setUptime] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    Promise.all([getAnalyticsOverview(), getLatencyAnalytics(), getUptimeAnalytics(), getIncidentAnalytics(), getErrorAnalytics()]).then(([overviewData, latencyData, uptimeData, incidentData, errorData]: any[]) => {
      setOverview(overviewData)
      setLatency((latencyData.latency_trend ?? []).map((point: any) => ({ time: point.date.slice(5), p50: point.avg_latency_ms, p95: point.avg_latency_ms * 1.4, p99: point.avg_latency_ms * 1.8 })))
      setUptime((uptimeData.uptime_trend ?? []).map((point: any) => ({ day: point.date.slice(5), uptime: point.uptime_percentage })))
      setIncidents((incidentData.incident_frequency ?? []).map((point: any) => ({ week: point.date.slice(5), critical: 0, high: point.count, medium: 0, low: 0 })))
      setErrors(errorData)
    })
  }, [])

  return (
    <div className="space-y-4 text-[#F3F4F6]">
      <PageHeader title="Analytics" description="Long-term API health, SLA compliance, and regional performance." actions={<div className="flex items-center gap-1.5"><button className="inline-flex h-7 items-center gap-1.5 rounded border border-white/5 bg-[#151618] px-2.5 text-[10px] text-[#9CA3AF]"><CalendarDays className="h-3 w-3" /> Last 14 days</button><button className="inline-flex h-7 items-center gap-1 rounded bg-[#4F8CFF] px-3 text-[11px] text-white"><Download className="h-3 w-3" /> Export</button></div>} />
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <Metric label="Overall uptime" value={`${overview.overall_uptime ?? 100}%`} sub="from checks" />
        <Metric label="Avg latency" value={`${overview.avg_latency_ms ?? 0}ms`} sub="all monitors" />
        <Metric label="Error rate" value={`${errors.error_rate ?? 0}%`} sub="failed checks" />
        <Metric label="Open incidents" value={`${overview.open_incidents ?? 0}`} sub="currently active" />
      </div>
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3"><Card className="lg:col-span-2"><CardHeader title="Latency distribution" /><LatencyChart data={latency} height={260} /></Card><Card><CardHeader title="Uptime trend" /><UptimeChart data={uptime} height={260} /></Card></div>
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-3"><Card className="lg:col-span-2"><CardHeader title="Incident frequency" /><IncidentChart data={incidents} height={240} /></Card><Card><CardHeader title="Failures by region" /><div className="space-y-2.5">{(errors.failures_by_region ?? []).map((r: any) => <div key={r.region} className="flex items-center justify-between text-xs"><span className="font-mono text-[#9CA3AF]">{r.region}</span><span>{r.failures}</span></div>)}{!(errors.failures_by_region ?? []).length && <div className="text-xs text-[#9CA3AF]">No regional failures yet.</div>}</div></Card></div>
      <Card><CardHeader title="Slowest endpoints" /><table className="w-full text-[12px]"><tbody>{(errors.slowest_endpoints ?? []).map((e: any) => <tr key={e.monitor_id} className="border-t border-white/5"><td className="px-3.5 py-2.5 font-semibold">{e.name}</td><td className="px-3.5 py-2.5 text-right">{e.avg_latency_ms}ms</td></tr>)}</tbody></table></Card>
    </div>
  )
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="rounded border border-white/5 bg-[#151618] p-3.5"><div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{label}</div><div className="mt-1.5 text-[20px] font-bold tabular-nums">{value}</div><div className="text-[10px] text-[#9CA3AF]">{sub}</div></div>
}
function Card({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={`rounded border border-white/5 bg-[#151618] p-3.5 ${className || ""}`}>{children}</div> }
function CardHeader({ title }: { title: string }) { return <div className="mb-3.5 text-[12px] font-bold">{title}</div> }
