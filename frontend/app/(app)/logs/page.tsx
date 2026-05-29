"use client"

import { Activity, FileText, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { getCheckLogs } from "@/lib/api"
import type { CheckLog } from "@/lib/types"

export default function LogsPage() {
  const [logs, setLogs] = useState<CheckLog[]>([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    getCheckLogs().then(setLogs).catch(() => setLogs([]))
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return logs
    return logs.filter((log) =>
      [log.monitor_name, log.project_name, log.region, log.status_code?.toString(), log.error_message]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle)),
    )
  }, [logs, query])

  const failures = logs.filter((log) => !log.success).length
  const avgLatency = Math.round(logs.reduce((sum, log) => sum + (log.latency_ms ?? 0), 0) / Math.max(logs.length, 1))

  return (
    <div className="space-y-4 text-[#F3F4F6]">
      <PageHeader
        title="Developer Logs"
        description="Search every monitor execution with status, latency, region, failure reason, and timestamp."
        actions={<div className="relative w-64"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-8 w-full rounded border border-white/5 bg-[#151618] pl-8 pr-3 text-xs outline-none focus:border-[#4F8CFF]" placeholder="Search logs..." /></div>}
      />

      <div className="grid gap-2.5 md:grid-cols-3">
        <Metric label="Executions" value={logs.length.toString()} sub="latest checks" />
        <Metric label="Failures" value={failures.toString()} sub="matching check history" />
        <Metric label="Average latency" value={`${avgLatency}ms`} sub="across logs" />
      </div>

      <div className="overflow-hidden rounded border border-white/5 bg-[#151618]">
        <div className="flex items-center gap-2 border-b border-white/5 px-3.5 py-3 text-xs font-bold">
          <FileText className="h-3.5 w-3.5 text-[#4F8CFF]" />
          Execution log stream
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-[12px]">
            <thead className="border-b border-white/5 text-[10px] uppercase tracking-wider text-[#9CA3AF]">
              <tr>
                <th className="px-3.5 py-2.5">Time</th>
                <th className="px-3.5 py-2.5">Monitor</th>
                <th className="px-3.5 py-2.5">Project</th>
                <th className="px-3.5 py-2.5">Region</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5 text-right">Latency</th>
                <th className="px-3.5 py-2.5">Reason</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-white/5 last:border-0">
                  <td className="px-3.5 py-2.5 font-mono text-[11px] text-[#9CA3AF]">{new Date(log.checked_at).toLocaleString()}</td>
                  <td className="px-3.5 py-2.5 font-semibold">{log.monitor_name}</td>
                  <td className="px-3.5 py-2.5 text-[#9CA3AF]">{log.project_name}</td>
                  <td className="px-3.5 py-2.5 font-mono text-[#9CA3AF]">{log.region}</td>
                  <td className={`px-3.5 py-2.5 font-mono ${log.success ? "text-[#AFCBFF]" : "text-[#EF4444]"}`}>{log.status_code ?? "ERR"}</td>
                  <td className="px-3.5 py-2.5 text-right font-mono">{log.latency_ms ? `${Math.round(log.latency_ms)}ms` : "-"}</td>
                  <td className="max-w-[280px] truncate px-3.5 py-2.5 text-[#9CA3AF]">{log.error_message || "OK"}</td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={7} className="px-3.5 py-10 text-center text-sm text-[#9CA3AF]">
                    <Activity className="mx-auto mb-2 h-5 w-5 text-[#4F8CFF]" />
                    No check logs yet. Run a monitor check to generate execution logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="rounded border border-white/5 bg-[#151618] p-3.5"><div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{label}</div><div className="mt-1.5 text-[22px] font-bold tabular-nums">{value}</div><div className="text-[10px] text-[#9CA3AF]">{sub}</div></div>
}
