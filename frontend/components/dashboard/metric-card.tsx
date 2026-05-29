"use client"

import { TrendingUp } from "lucide-react"
import { Sparkline } from "@/components/charts"
import { cn } from "@/lib/utils"

export function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  context,
  spark,
  color = "#4F8CFF",
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  trend: string
  context: string
  spark: Array<{ x: number; y: number }>
  color?: string
}) {
  return (
    <div className="rounded border border-border bg-card p-3.5 transition-all hover:border-primary/20">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="text-[20px] font-bold tracking-tight text-foreground">{value}</div>
        <div className="h-7 w-14">
          <Sparkline data={spark} color={color} />
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5 text-[10px]">
        <span className={cn("inline-flex items-center gap-0.5 font-semibold text-blue-400")}>
          <TrendingUp className="h-3 w-3" />
          {trend}
        </span>
        <span className="text-muted-foreground">{context}</span>
      </div>
    </div>
  )
}
