import { IncidentStatusBadge, SeverityBadge } from "@/components/status-badge"

export function IncidentCard({ incident, onClick }: { incident: any; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded border border-border bg-card p-3 text-left transition-colors hover:bg-accent/50">
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={incident.severity} />
        <IncidentStatusBadge status={incident.status} />
        <span className="font-mono text-[10px] text-muted-foreground">{incident.id}</span>
      </div>
      <div className="mt-2 text-xs font-semibold">{incident.title}</div>
      <div className="mt-1 text-[10px] text-muted-foreground">{incident.service} · {incident.duration}</div>
    </button>
  )
}
