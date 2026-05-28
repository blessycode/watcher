import Link from "next/link"
import { MethodBadge, StatusBadge } from "@/components/status-badge"

export function MonitorCard({ monitor }: { monitor: any }) {
  return (
    <Link href={`/monitors/${monitor.id}`} className="block rounded border border-border bg-card p-3.5 transition-all hover:border-primary/20 hover:bg-accent/40">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold">{monitor.name}</div>
          <div className="truncate font-mono text-[10px] text-muted-foreground">{monitor.url}</div>
        </div>
        <StatusBadge status={monitor.status} />
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
        <MethodBadge method={monitor.method} />
        <span>{monitor.uptime}% uptime</span>
        <span>{monitor.avgLatency || "-"}ms</span>
      </div>
    </Link>
  )
}
