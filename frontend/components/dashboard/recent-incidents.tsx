import { incidents } from "@/lib/mock-data"
import { SeverityBadge } from "@/components/status-badge"

export function RecentIncidents() {
  return (
    <div className="rounded border border-border bg-card">
      <div className="border-b border-border px-3 py-2 text-xs font-semibold">Recent incidents</div>
      <div className="divide-y divide-border">
        {incidents.slice(0, 5).map((incident) => (
          <div key={incident.id} className="px-3 py-2">
            <div className="flex items-start justify-between gap-2">
              <div className="truncate text-xs font-semibold">{incident.title}</div>
              <SeverityBadge severity={incident.severity} />
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground">{incident.service} · {incident.duration}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
