"use client"

import { Globe2, MapPinned } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { getCheckLogs, getMonitors } from "@/lib/api"
import type { CheckLog, Monitor } from "@/lib/types"

export default function RegionsPage() {
  const [logs, setLogs] = useState<CheckLog[]>([])
  const [monitors, setMonitors] = useState<Monitor[]>([])

  useEffect(() => {
    Promise.all([getCheckLogs(), getMonitors()]).then(([logData, monitorData]) => {
      setLogs(logData)
      setMonitors(monitorData)
    }).catch(() => undefined)
  }, [])

  const regions = useMemo(() => {
    const names = new Set([...logs.map((log) => log.region), ...monitors.map((monitor) => monitor.region)])
    return Array.from(names).filter(Boolean).map((region) => {
      const regionLogs = logs.filter((log) => log.region === region)
      const checks = regionLogs.length
      const failures = regionLogs.filter((log) => !log.success).length
      const uptime = checks ? ((checks - failures) / checks) * 100 : 100
      const latency = Math.round(regionLogs.reduce((sum, log) => sum + (log.latency_ms ?? 0), 0) / Math.max(checks, 1))
      const activeMonitors = monitors.filter((monitor) => monitor.region === region).length
      return { region, checks, failures, uptime, latency, activeMonitors }
    }).sort((a, b) => a.region.localeCompare(b.region))
  }, [logs, monitors])

  return (
    <div className="space-y-4 text-[#F3F4F6]">
      <PageHeader title="Regions" description="Compare availability, failures, latency, and monitor coverage by monitoring region." />

      <div className="grid gap-2.5 md:grid-cols-4">
        <Metric label="Regions" value={regions.length.toString()} sub="with monitors or checks" />
        <Metric label="Checks" value={logs.length.toString()} sub="latest execution logs" />
        <Metric label="Failures" value={logs.filter((log) => !log.success).length.toString()} sub="regional failures" />
        <Metric label="Avg latency" value={`${Math.round(logs.reduce((sum, log) => sum + (log.latency_ms ?? 0), 0) / Math.max(logs.length, 1))}ms`} sub="all regions" />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {regions.map((region) => (
          <article key={region.region} className="rounded border border-white/5 bg-[#151618] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#4F8CFF]/10 text-[#4F8CFF]">
                  <MapPinned className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold capitalize">{region.region}</h2>
                  <p className="text-xs text-[#9CA3AF]">{region.activeMonitors} monitors assigned</p>
                </div>
              </div>
              <span className={`rounded border px-2 py-1 text-[10px] font-semibold uppercase ${region.failures ? "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]" : "border-[#4F8CFF]/30 bg-[#4F8CFF]/10 text-[#AFCBFF]"}`}>
                {region.failures ? "Attention" : "Stable"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
              <SmallStat label="Uptime" value={`${region.uptime.toFixed(1)}%`} />
              <SmallStat label="Latency" value={`${region.latency}ms`} />
              <SmallStat label="Checks" value={region.checks.toString()} />
              <SmallStat label="Failures" value={region.failures.toString()} />
            </div>
          </article>
        ))}
      </div>

      {!regions.length && (
        <div className="rounded border border-white/5 bg-[#151618] px-4 py-12 text-center text-sm text-[#9CA3AF]">
          <Globe2 className="mx-auto mb-2 h-6 w-6 text-[#4F8CFF]" />
          Add monitors with regions and run checks to build regional health intelligence.
        </div>
      )}
    </div>
  )
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="rounded border border-white/5 bg-[#151618] p-3.5"><div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{label}</div><div className="mt-1.5 text-[22px] font-bold tabular-nums">{value}</div><div className="text-[10px] text-[#9CA3AF]">{sub}</div></div>
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-white/5 bg-[#0C0D0E] p-2.5"><div className="text-[9px] uppercase tracking-wider text-[#9CA3AF]">{label}</div><div className="mt-1 font-mono font-semibold">{value}</div></div>
}
