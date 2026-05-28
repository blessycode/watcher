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
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 11,
    padding: "6px 8px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    color: "var(--foreground)",
  },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 10, marginBottom: 2 },
  itemStyle: { color: "var(--foreground)", padding: 0 },
} as const

const AXIS = {
  stroke: "var(--border)",
  fontSize: 10,
  tickLine: false,
  axisLine: false,
  tick: { fill: "var(--muted-foreground)" },
} as const

const GRID = "var(--border)"

export function LatencyChart({ data, height = 240 }: { data: any[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="time" {...AXIS} interval={3} />
        <YAxis {...AXIS} unit="ms" width={48} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Line type="monotone" dataKey="p50" stroke="var(--success)" strokeWidth={1.6} dot={false} />
        <Line type="monotone" dataKey="p95" stroke="var(--primary)" strokeWidth={1.8} dot={false} />
        <Line type="monotone" dataKey="p99" stroke="var(--destructive)" strokeWidth={1.6} dot={false} />
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
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID} strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" {...AXIS} interval={4} />
        <YAxis domain={[95, 100]} unit="%" {...AXIS} width={42} />
        <Tooltip {...TOOLTIP_STYLE} />
        <Area type="monotone" dataKey="uptime" stroke="var(--primary)" strokeWidth={1.8} fill="url(#upGrad)" />
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
        <Bar dataKey="critical" stackId="a" fill="#f43f5e" />
        <Bar dataKey="high" stackId="a" fill="#fb923c" />
        <Bar dataKey="medium" stackId="a" fill="#f59e0b" />
        <Bar dataKey="low" stackId="a" fill="#38bdf8" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function StatusDistributionChart({ data, height = 220 }: { data: any[]; height?: number }) {
  const total = data.reduce((a, b) => a + b.value, 0)
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
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip {...TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-2xl font-semibold tabular-nums">{total}</div>
          <div className="text-[11px] text-muted-foreground">monitors</div>
        </div>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-sm gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-sm shrink-0" style={{ backgroundColor: d.color }} />
              <span className="truncate">{d.name}</span>
            </div>
            <span className="font-mono tabular-nums text-muted-foreground">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Sparkline({ data, color = "var(--primary)" }: { data: any[]; color?: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
        <Line type="monotone" dataKey="y" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
