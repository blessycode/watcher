"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#151618",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: 4,
    fontSize: 11,
    padding: "6px 10px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    color: "#F3F4F6",
  },
  labelStyle: { color: "#9CA3AF", fontSize: 10, marginBottom: 2 },
  itemStyle: { color: "#F3F4F6", padding: 0 },
} as const

const AXIS = {
  stroke: "rgba(255, 255, 255, 0.06)",
  fontSize: 10,
  tickLine: false,
  axisLine: false,
  tick: { fill: "#9CA3AF" },
} as const

const GRID = "rgba(255, 255, 255, 0.04)"

export function LatencyChart({ data, height = 240 }: { data: any[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="time" {...AXIS} interval={3} />
        <YAxis {...AXIS} unit="ms" width={48} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Line type="monotone" dataKey="p50" stroke="#4F8CFF" strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="p95" stroke="#4F8CFF" strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="p99" stroke="#EF4444" strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function UptimeChart({ data, height = 220 }: { data: any[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="upGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F8CFF" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#4F8CFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" {...AXIS} interval={4} />
        <YAxis domain={[95, 100]} unit="%" {...AXIS} width={42} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Area type="monotone" dataKey="uptime" stroke="#4F8CFF" strokeWidth={1.5} fill="url(#upGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function IncidentChart({ data, height = 220 }: { data: any[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="week" {...AXIS} />
        <YAxis {...AXIS} width={28} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Bar dataKey="critical" stackId="a" fill="#EF4444" />
        <Bar dataKey="high" stackId="a" fill="#F97316" />
        <Bar dataKey="medium" stackId="a" fill="#AFCBFF" />
        <Bar dataKey="low" stackId="a" fill="#4F8CFF" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function StatusDistributionChart({ data, height = 220 }: { data: any[]; height?: number }) {
  const total = data.reduce((a, b) => a + b.value, 0)
  
  // Align Segment Colors
  const segmentColors: Record<string, string> = {
    "Operational": "#4F8CFF",
    "Degraded": "#AFCBFF",
    "Down": "#EF4444",
    "Paused": "#9CA3AF",
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="64%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((entry, i) => {
                const col = segmentColors[entry.name] || entry.color
                return <Cell key={i} fill={col} />
              })}
            </Pie>
            <Tooltip {...TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-2xl font-bold tabular-nums text-[#F3F4F6]">{total}</div>
          <div className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">monitors</div>
        </div>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        {data.map((d) => {
          const col = segmentColors[d.name] || d.color
          return (
            <div key={d.name} className="flex items-center justify-between text-[12px] gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: col }} />
                <span className="truncate text-[#9CA3AF] font-medium">{d.name}</span>
              </div>
              <span className="font-mono font-semibold tabular-nums text-[#F3F4F6]">{d.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Sparkline({ data, color = "#4F8CFF" }: { data: any[]; color?: string }) {
  // Translate standard colors to theme variables
  let sparkColor = color
  if (color === "#DC2626" || color === "#dc2626" || color === "#E55C5C") sparkColor = "#EF4444"
  if (color === "#2563EB" || color === "#2563eb" || color === "#5E6AD2") sparkColor = "#4F8CFF"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Line type="monotone" dataKey="y" stroke={sparkColor} strokeWidth={1.2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
