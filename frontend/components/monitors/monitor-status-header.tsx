import { StatusBadge } from "@/components/status-badge"

export function MonitorStatusHeader({ monitor }: { monitor: any }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold">{monitor.name}</h1>
        <p className="font-mono text-xs text-muted-foreground">{monitor.url}</p>
      </div>
      <StatusBadge status={monitor.status} />
    </div>
  )
}
