import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { IncidentSeverity, MonitorStatus } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function formatLatency(value: number | null | undefined) {
  if (value === null || value === undefined) return "timeout"
  if (value >= 1000) return `${(value / 1000).toFixed(2)}s`
  return `${Math.round(value)}ms`
}

export function formatInterval(seconds: number) {
  if (seconds < 60) return `${seconds}s`
  return `${Math.round(seconds / 60)}m`
}

export function formatPercent(value: number) {
  return `${value.toFixed(value >= 99.9 ? 2 : 1)}%`
}

export function statusLabel(status: MonitorStatus) {
  return {
    operational: "Operational",
    degraded: "Degraded",
    down: "Down",
    paused: "Paused",
  }[status]
}

export function severityLabel(severity: IncidentSeverity) {
  return {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  }[severity]
}

export function statusColor(status: MonitorStatus) {
  return {
    operational: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    degraded: "text-blue-300 bg-blue-500/10 border-blue-500/20",
    down: "text-red-400 bg-red-500/10 border-red-500/20",
    paused: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  }[status]
}

export function severityColor(severity: IncidentSeverity) {
  return {
    critical: "text-red-400 bg-red-500/10 border-red-500/20",
    high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    medium: "text-blue-300 bg-blue-500/10 border-blue-500/20",
    low: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  }[severity]
}

export function responseStatusLabel(code: number | null) {
  if (!code) return "No response"
  if (code >= 200 && code < 300) return "OK"
  if (code >= 300 && code < 400) return "Redirect"
  if (code >= 400 && code < 500) return "Client error"
  if (code >= 500) return "Server error"
  return "Unknown"
}
