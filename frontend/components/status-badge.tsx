import { cn } from "@/lib/utils"

type StatusType = "operational" | "degraded" | "down" | "paused"

const statusConfig: Record<StatusType, { label: string; dot: string; text: string; bg: string; ring: string }> = {
  operational: {
    label: "Operational",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
  degraded: {
    label: "Degraded",
    dot: "bg-amber-400",
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
  },
  down: {
    label: "Down",
    dot: "bg-rose-400",
    text: "text-rose-300",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/20",
  },
  paused: {
    label: "Paused",
    dot: "bg-zinc-400",
    text: "text-zinc-300",
    bg: "bg-zinc-500/10",
    ring: "ring-zinc-500/20",
  },
}

export function StatusBadge({ status }: { status: StatusType }) {
  const c = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        c.bg,
        c.text,
        c.ring,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  )
}

const methodColors: Record<string, string> = {
  GET: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  POST: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
  PUT: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  DELETE: "bg-rose-500/10 text-rose-300 ring-rose-500/20",
  PATCH: "bg-violet-500/10 text-violet-300 ring-violet-500/20",
}

export function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wide ring-1 ring-inset",
        methodColors[method] ?? "bg-zinc-500/10 text-zinc-300 ring-zinc-500/20",
      )}
    >
      {method}
    </span>
  )
}

const severityConfig = {
  critical: "bg-rose-500/10 text-rose-300 ring-rose-500/20",
  high: "bg-orange-500/10 text-orange-300 ring-orange-500/20",
  medium: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  low: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
}

export function SeverityBadge({
  severity,
}: {
  severity: "critical" | "high" | "medium" | "low"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset",
        severityConfig[severity],
      )}
    >
      {severity}
    </span>
  )
}

const incidentStatusConfig = {
  investigating: "bg-rose-500/10 text-rose-300 ring-rose-500/20",
  identified: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  monitoring: "bg-sky-500/10 text-sky-300 ring-sky-500/20",
  resolved: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
}

const incidentStatusLabel = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
}

export function IncidentStatusBadge({
  status,
}: {
  status: "investigating" | "identified" | "monitoring" | "resolved"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset",
        incidentStatusConfig[status],
      )}
    >
      {incidentStatusLabel[status]}
    </span>
  )
}
