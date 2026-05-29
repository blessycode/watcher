import { liveChecks } from "@/lib/mock-data"

export function LiveCheckStream() {
  return (
    <div className="overflow-hidden rounded border border-border bg-card">
      <div className="border-b border-border px-3 py-2 text-xs font-semibold">Live check stream</div>
      <div className="divide-y divide-border font-mono text-[11px]">
        {liveChecks.slice(0, 8).map((check, index) => (
          <div key={index} className="grid grid-cols-[70px_1fr_70px_60px] gap-2 px-3 py-2">
            <span className="text-muted-foreground">{check.time}</span>
            <span className="truncate font-sans text-foreground">{check.monitor}</span>
            <span className={check.status >= 500 ? "text-red-400" : "text-blue-400"}>{check.status}</span>
            <span className="text-right text-muted-foreground">{check.latency ? `${check.latency}ms` : "-"}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
