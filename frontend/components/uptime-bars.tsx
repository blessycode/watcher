"use client"

import { cn } from "@/lib/utils"

const STATES = ["op", "op", "op", "op", "op", "op", "op", "op", "deg", "op"] as const

function generateBars(seed = 1) {
  const arr = []
  for (let i = 0; i < 90; i++) {
    const r = Math.sin(i * seed * 0.7) * 0.5 + 0.5
    let s: "op" | "deg" | "down" = "op"
    if (i === 23 + seed) s = "deg"
    if (i === 47 - seed) s = "down"
    if (i === 12 + seed * 2) s = "deg"
    if (i === 78) s = "deg"
    arr.push(s)
  }
  return arr
}

export function UptimeBars({ className, seed = 1 }: { className?: string; seed?: number }) {
  const bars = generateBars(seed)
  return (
    <div className={cn("flex items-stretch gap-[2px]", className)}>
      {bars.map((s, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 rounded-sm",
            s === "op" && "bg-blue-500/80 hover:bg-blue-500",
            s === "deg" && "bg-blue-400/80 hover:bg-blue-400",
            s === "down" && "bg-red-500/80 hover:bg-red-500",
          )}
          title={`Day ${90 - i} · ${s === "op" ? "100%" : s === "deg" ? "98%" : "92%"} uptime`}
        />
      ))}
    </div>
  )
}
