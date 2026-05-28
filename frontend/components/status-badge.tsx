import { cn } from "@/lib/utils"

type StatusType = "operational" | "degraded" | "down" | "paused" | "unknown"

const statusConfig: Record<StatusType, { label: string; dot: string; text: string; bg: string; border: string }> = {
  operational: {
    label: "Operational",
    dot: "bg-[#22C55E]",
    text: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
    border: "border-white/5",
  },
  degraded: {
    label: "Degraded",
    dot: "bg-[#F59E0B]",
    text: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
    border: "border-white/5",
  },
  down: {
    label: "Down",
    dot: "bg-[#EF4444]",
    text: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
    border: "border-white/5",
  },
  paused: {
    label: "Paused",
    dot: "bg-[#9CA3AF]",
    text: "text-[#9CA3AF]",
    bg: "bg-white/5",
    border: "border-white/5",
  },
  unknown: {
    label: "Unknown",
    dot: "bg-[#9CA3AF]",
    text: "text-[#9CA3AF]",
    bg: "bg-white/5",
    border: "border-white/5",
  },
}

export function StatusBadge({ status }: { status: StatusType | string }) {
  const c = statusConfig[(status as StatusType)] ?? statusConfig.unknown
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-medium tracking-wide transition-colors",
        c.bg,
        c.text,
        c.border,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", c.dot)} />
      {c.label}
    </span>
  )
}

const methodColors: Record<string, string> = {
  GET:    "bg-[#4F8CFF]/10 text-[#4F8CFF] border-white/5",
  POST:   "bg-[#22C55E]/10 text-[#22C55E] border-white/5",
  PUT:    "bg-[#F59E0B]/10 text-[#F59E0B] border-white/5",
  DELETE: "bg-[#EF4444]/10 text-[#EF4444] border-white/5",
  PATCH:  "bg-[#A78BFA]/10 text-[#A78BFA] border-white/5",
}

export function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded border px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wide",
        methodColors[method] ?? "bg-white/5 text-[#9CA3AF] border-white/5",
      )}
    >
      {method}
    </span>
  )
}

const severityConfig: Record<string, string> = {
  critical: "bg-[#EF4444]/10 text-[#EF4444] border-white/5",
  high:     "bg-[#F97316]/10 text-[#F97316] border-white/5",
  medium:   "bg-[#F59E0B]/10 text-[#F59E0B] border-white/5",
  low:      "bg-[#4F8CFF]/10 text-[#4F8CFF] border-white/5",
}

export function SeverityBadge({
  severity,
}: {
  severity: "critical" | "high" | "medium" | "low"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        severityConfig[severity],
      )}
    >
      {severity}
    </span>
  )
}

const incidentStatusConfig: Record<string, string> = {
  investigating: "bg-[#EF4444]/10 text-[#EF4444] border-white/5",
  identified:    "bg-[#F59E0B]/10 text-[#F59E0B] border-white/5",
  monitoring:    "bg-[#4F8CFF]/10 text-[#4F8CFF] border-white/5",
  resolved:      "bg-[#22C55E]/10 text-[#22C55E] border-white/5",
}

const incidentStatusLabel: Record<string, string> = {
  investigating: "Investigating",
  identified:    "Identified",
  monitoring:    "Monitoring",
  resolved:      "Resolved",
}

export function IncidentStatusBadge({
  status,
}: {
  status: "investigating" | "identified" | "monitoring" | "resolved"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        incidentStatusConfig[status],
      )}
    >
      {incidentStatusLabel[status]}
    </span>
  )
}
