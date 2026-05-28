import type {
  APIKey,
  Alert,
  AlertChannel,
  Check,
  Incident,
  Monitor,
  MonitorHeader,
  Project,
  StatusPage,
  User,
} from "@/lib/types"

const now = "2026-05-28T18:18:00.000Z"

export const mockUsers: User[] = [
  {
    id: "usr_01",
    name: "Jordan Davis",
    email: "jordan@acme.com",
    role: "owner",
    avatar_url: null,
    created_at: "2025-09-12T08:24:00.000Z",
  },
  {
    id: "usr_02",
    name: "Maya Chen",
    email: "maya@acme.com",
    role: "admin",
    avatar_url: null,
    created_at: "2025-11-04T11:02:00.000Z",
  },
]

export const mockProjects: Project[] = [
  {
    id: "proj_01",
    user_id: "usr_01",
    name: "Core Banking APIs",
    slug: "core-banking-apis",
    description: "Account, ledger, balance, and transfer APIs with strict SLA reporting.",
    environment: "production",
    created_at: "2025-10-01T08:00:00.000Z",
    updated_at: "2026-05-28T17:52:00.000Z",
  },
  {
    id: "proj_02",
    user_id: "usr_01",
    name: "Claims Platform",
    slug: "claims-platform",
    description: "Claims intake, validation, processing, and underwriting services.",
    environment: "production",
    created_at: "2025-10-16T09:30:00.000Z",
    updated_at: "2026-05-28T17:42:00.000Z",
  },
  {
    id: "proj_03",
    user_id: "usr_02",
    name: "Customer Portal",
    slug: "customer-portal",
    description: "Public-facing auth, profile, search, and support APIs.",
    environment: "production",
    created_at: "2025-11-02T12:18:00.000Z",
    updated_at: "2026-05-28T17:59:00.000Z",
  },
  {
    id: "proj_04",
    user_id: "usr_01",
    name: "Payments Infrastructure",
    slug: "payments-infrastructure",
    description: "Charges, refunds, settlements, ledger exports, and reconciliation jobs.",
    environment: "production",
    created_at: "2025-12-08T07:15:00.000Z",
    updated_at: "2026-05-28T17:55:00.000Z",
  },
  {
    id: "proj_05",
    user_id: "usr_02",
    name: "Notification Services",
    slug: "notification-services",
    description: "Email, push, Slack, Discord, and customer webhook delivery.",
    environment: "staging",
    created_at: "2026-01-19T15:11:00.000Z",
    updated_at: "2026-05-28T18:03:00.000Z",
  },
]

export const mockMonitors: Monitor[] = [
  {
    id: "mon_01",
    project_id: "proj_03",
    name: "Auth Service",
    url: "https://api.acme.com/v2/auth/health",
    method: "GET",
    expected_status: 200,
    interval_seconds: 30,
    timeout_seconds: 8,
    region: "us-east-1",
    is_active: true,
    status: "operational",
    uptime_percentage: 99.98,
    avg_latency_ms: 138,
    last_checked_at: "2026-05-28T18:17:52.000Z",
    created_at: "2025-11-03T08:20:00.000Z",
  },
  {
    id: "mon_02",
    project_id: "proj_04",
    name: "Payments API",
    url: "https://api.acme.com/v2/charge",
    method: "POST",
    expected_status: 200,
    interval_seconds: 30,
    timeout_seconds: 10,
    region: "us-east-1",
    is_active: true,
    status: "operational",
    uptime_percentage: 99.94,
    avg_latency_ms: 192,
    last_checked_at: "2026-05-28T18:17:48.000Z",
    created_at: "2025-12-09T10:10:00.000Z",
  },
  {
    id: "mon_03",
    project_id: "proj_02",
    name: "Claims API",
    url: "https://api.acme.com/v1/claims",
    method: "POST",
    expected_status: 201,
    interval_seconds: 60,
    timeout_seconds: 12,
    region: "us-east-1",
    is_active: true,
    status: "operational",
    uptime_percentage: 99.91,
    avg_latency_ms: 248,
    last_checked_at: "2026-05-28T18:17:30.000Z",
    created_at: "2025-10-20T14:40:00.000Z",
  },
  {
    id: "mon_04",
    project_id: "proj_03",
    name: "User Profile API",
    url: "https://api.acme.com/v2/users/profile",
    method: "GET",
    expected_status: 200,
    interval_seconds: 60,
    timeout_seconds: 8,
    region: "ap-southeast-1",
    is_active: true,
    status: "degraded",
    uptime_percentage: 99.42,
    avg_latency_ms: 612,
    last_checked_at: "2026-05-28T18:17:38.000Z",
    created_at: "2025-11-06T09:00:00.000Z",
  },
  {
    id: "mon_05",
    project_id: "proj_05",
    name: "Notification Worker",
    url: "https://workers.acme.com/notify",
    method: "POST",
    expected_status: 200,
    interval_seconds: 30,
    timeout_seconds: 10,
    region: "eu-west-1",
    is_active: true,
    status: "down",
    uptime_percentage: 96.21,
    avg_latency_ms: 0,
    last_checked_at: "2026-05-28T18:17:56.000Z",
    created_at: "2026-01-20T16:25:00.000Z",
  },
  {
    id: "mon_06",
    project_id: "proj_01",
    name: "Public Gateway",
    url: "https://gateway.acme.com/health",
    method: "GET",
    expected_status: 200,
    interval_seconds: 30,
    timeout_seconds: 6,
    region: "global",
    is_active: true,
    status: "operational",
    uptime_percentage: 99.99,
    avg_latency_ms: 64,
    last_checked_at: "2026-05-28T18:17:55.000Z",
    created_at: "2025-10-02T10:00:00.000Z",
  },
  {
    id: "mon_07",
    project_id: "proj_05",
    name: "Webhook Dispatcher",
    url: "https://hooks.acme.com/dispatch",
    method: "POST",
    expected_status: 202,
    interval_seconds: 30,
    timeout_seconds: 10,
    region: "eu-west-1",
    is_active: true,
    status: "degraded",
    uptime_percentage: 98.76,
    avg_latency_ms: 488,
    last_checked_at: "2026-05-28T18:17:49.000Z",
    created_at: "2026-01-21T08:14:00.000Z",
  },
  {
    id: "mon_08",
    project_id: "proj_03",
    name: "Customer Search",
    url: "https://api.acme.com/v2/customers/search",
    method: "GET",
    expected_status: 200,
    interval_seconds: 60,
    timeout_seconds: 12,
    region: "ap-southeast-1",
    is_active: true,
    status: "degraded",
    uptime_percentage: 99.18,
    avg_latency_ms: 704,
    last_checked_at: "2026-05-28T18:17:41.000Z",
    created_at: "2025-11-08T12:45:00.000Z",
  },
]

export const mockMonitorHeaders: MonitorHeader[] = [
  { id: "hdr_01", monitor_id: "mon_02", header_key: "Authorization", encrypted_value: "enc_live_token_9a2", is_secret: true },
  { id: "hdr_02", monitor_id: "mon_02", header_key: "Idempotency-Key", encrypted_value: "enc_mock_key", is_secret: false },
  { id: "hdr_03", monitor_id: "mon_07", header_key: "X-Signature", encrypted_value: "enc_signature", is_secret: true },
]

export const mockChecks: Check[] = mockMonitors.flatMap((monitor, monitorIndex) =>
  Array.from({ length: 18 }).map((_, checkIndex) => {
    const failed = monitor.status === "down" && checkIndex < 8
    const slow = monitor.status === "degraded" && checkIndex % 3 === 0
    const latency = failed ? null : monitor.avg_latency_ms + ((checkIndex % 5) - 2) * 16 + (slow ? 190 : 0)
    return {
      id: `chk_${monitorIndex + 1}_${checkIndex + 1}`,
      monitor_id: monitor.id,
      status_code: failed ? 503 : monitor.expected_status,
      success: !failed,
      latency_ms: latency && latency > 0 ? latency : null,
      error_message: failed ? "upstream queue connection refused" : null,
      region: monitor.region,
      checked_at: new Date(Date.parse(now) - (monitorIndex * 48 + checkIndex * monitor.interval_seconds) * 1000).toISOString(),
    }
  }),
)

export const mockIncidents: Incident[] = [
  {
    id: "inc_2486",
    monitor_id: "mon_05",
    title: "Notification worker returning 503s in eu-west-1",
    status: "investigating",
    severity: "critical",
    reason: "5 consecutive failed checks from eu-west-1",
    root_cause: "Downstream queue connection failure",
    started_at: "2026-05-28T17:58:00.000Z",
    resolved_at: null,
    duration: "20m",
    created_at: "2026-05-28T17:58:06.000Z",
  },
  {
    id: "inc_2485",
    monitor_id: "mon_08",
    title: "Customer search latency exceeded P95 threshold",
    status: "monitoring",
    severity: "high",
    reason: "P95 latency crossed 1000ms threshold for 12 minutes",
    root_cause: "Database query plan regression",
    started_at: "2026-05-28T17:22:00.000Z",
    resolved_at: null,
    duration: "56m",
    created_at: "2026-05-28T17:22:10.000Z",
  },
  {
    id: "inc_2484",
    monitor_id: "mon_02",
    title: "Payments API elevated 5xx responses",
    status: "resolved",
    severity: "medium",
    reason: "5xx rate exceeded 2.5% after deploy",
    root_cause: "Bad deployment rolled back",
    started_at: "2026-05-27T09:42:00.000Z",
    resolved_at: "2026-05-27T10:05:00.000Z",
    duration: "23m",
    created_at: "2026-05-27T09:42:12.000Z",
  },
  {
    id: "inc_2483",
    monitor_id: "mon_06",
    title: "TLS certificate near expiry",
    status: "resolved",
    severity: "low",
    reason: "Certificate expiration threshold triggered",
    root_cause: "Cert renewal automation regressed",
    started_at: "2026-05-25T22:12:00.000Z",
    resolved_at: "2026-05-25T23:16:00.000Z",
    duration: "1h 04m",
    created_at: "2026-05-25T22:12:09.000Z",
  },
]

export const mockAlertChannels: AlertChannel[] = [
  { id: "ach_01", user_id: "usr_01", type: "email", destination: "oncall@acme.com", is_verified: true, is_active: true, last_triggered_at: "2026-05-28T17:58:08.000Z", created_at: "2025-10-02T10:10:00.000Z" },
  { id: "ach_02", user_id: "usr_01", type: "slack", destination: "#platform-oncall", is_verified: true, is_active: true, last_triggered_at: "2026-05-28T17:58:09.000Z", created_at: "2025-10-02T10:12:00.000Z" },
  { id: "ach_03", user_id: "usr_01", type: "discord", destination: "Engineering Alerts", is_verified: false, is_active: false, last_triggered_at: null, created_at: "2026-02-02T10:12:00.000Z" },
  { id: "ach_04", user_id: "usr_01", type: "webhook", destination: "https://ops.acme.com/hooks/watcher", is_verified: true, is_active: true, last_triggered_at: "2026-05-28T17:22:14.000Z", created_at: "2026-03-15T11:35:00.000Z" },
  { id: "ach_05", user_id: "usr_01", type: "telegram", destination: "Coming soon", is_verified: false, is_active: false, last_triggered_at: null, created_at: "2026-05-01T09:00:00.000Z" },
]

export const mockAlerts: Alert[] = [
  { id: "alrt_01", incident_id: "inc_2486", channel: "slack", recipient: "#platform-oncall", status: "sent", sent_at: "2026-05-28T17:58:09.000Z" },
  { id: "alrt_02", incident_id: "inc_2486", channel: "email", recipient: "oncall@acme.com", status: "sent", sent_at: "2026-05-28T17:58:10.000Z" },
  { id: "alrt_03", incident_id: "inc_2485", channel: "webhook", recipient: "ops.acme.com", status: "sent", sent_at: "2026-05-28T17:22:14.000Z" },
]

export const mockStatusPages: StatusPage[] = [
  { id: "sp_01", project_id: "proj_01", name: "Acme Cloud Status", slug: "acme-cloud", is_public: true, subscribers: 12483, overall_status: "operational", created_at: "2025-10-05T08:00:00.000Z", updated_at: "2026-05-28T18:16:00.000Z" },
  { id: "sp_02", project_id: "proj_03", name: "Acme Customer Portal", slug: "customer-portal", is_public: true, subscribers: 4218, overall_status: "degraded", created_at: "2025-11-12T08:00:00.000Z", updated_at: "2026-05-28T18:10:00.000Z" },
  { id: "sp_03", project_id: "proj_05", name: "Internal Services", slug: "internal", is_public: false, subscribers: 142, overall_status: "partial_outage", created_at: "2026-01-22T08:00:00.000Z", updated_at: "2026-05-28T18:03:00.000Z" },
]

export const mockApiKeys: APIKey[] = [
  { id: "key_01", user_id: "usr_01", name: "Production worker", key_prefix: "wtr_live", masked_key: "wtr_live_••••••••••••8A2F", created_at: "2026-01-04T08:00:00.000Z", last_used_at: "2026-05-28T17:50:00.000Z", revoked_at: null },
  { id: "key_02", user_id: "usr_01", name: "CI monitor sync", key_prefix: "wtr_ci", masked_key: "wtr_ci_••••••••••••92CC", created_at: "2026-02-18T12:30:00.000Z", last_used_at: "2026-05-27T22:14:00.000Z", revoked_at: null },
]

export function projectForMonitor(monitor: Monitor) {
  return mockProjects.find((project) => project.id === monitor.project_id)
}

export function checksForMonitor(monitorId: string) {
  return mockChecks.filter((check) => check.monitor_id === monitorId)
}

export function incidentsForMonitor(monitorId: string) {
  return mockIncidents.filter((incident) => incident.monitor_id === monitorId)
}

function p95Latency(monitorId: string) {
  const latencies = checksForMonitor(monitorId)
    .map((check) => check.latency_ms)
    .filter((value): value is number => typeof value === "number")
    .sort((a, b) => a - b)
  return latencies[Math.max(0, Math.floor(latencies.length * 0.95) - 1)] ?? 0
}

function p99Latency(monitorId: string) {
  const latencies = checksForMonitor(monitorId)
    .map((check) => check.latency_ms)
    .filter((value): value is number => typeof value === "number")
    .sort((a, b) => a - b)
  return latencies[Math.max(0, Math.floor(latencies.length * 0.99) - 1)] ?? 0
}

function lastResponseCode(monitorId: string, fallback: number) {
  return checksForMonitor(monitorId)[0]?.status_code ?? fallback
}

function relativeLastCheck(value: string) {
  const seconds = Math.max(1, Math.round((Date.parse(now) - Date.parse(value)) / 1000))
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.round(seconds / 60)
  return `${minutes}m ago`
}

export const monitors = mockMonitors.map((monitor) => ({
  id: monitor.id,
  name: monitor.name,
  project: projectForMonitor(monitor)?.name ?? "Unknown project",
  method: monitor.method,
  url: monitor.url,
  status: monitor.status,
  uptime: monitor.uptime_percentage,
  avgLatency: monitor.avg_latency_ms,
  p95Latency: p95Latency(monitor.id),
  failedChecks: checksForMonitor(monitor.id).filter((check) => !check.success).length,
  lastResponseCode: lastResponseCode(monitor.id, monitor.expected_status),
  expectedStatus: monitor.expected_status,
  region: monitor.region,
  interval: `${monitor.interval_seconds}s`,
  timeout: `${monitor.timeout_seconds}s`,
  lastChecked: relativeLastCheck(monitor.last_checked_at),
  isActive: monitor.is_active,
}))

export const projects = mockProjects.map((project) => {
  const projectMonitors = mockMonitors.filter((monitor) => monitor.project_id === project.id)
  const projectIncidents = mockIncidents.filter((incident) =>
    projectMonitors.some((monitor) => monitor.id === incident.monitor_id) && incident.status !== "resolved",
  )
  const status = projectMonitors.some((monitor) => monitor.status === "down")
    ? "down"
    : projectMonitors.some((monitor) => monitor.status === "degraded")
      ? "degraded"
      : "operational"
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    environment: project.environment,
    monitors: projectMonitors.length,
    uptime: projectMonitors.length
      ? +(projectMonitors.reduce((sum, monitor) => sum + monitor.uptime_percentage, 0) / projectMonitors.length).toFixed(2)
      : 100,
    incidents: projectIncidents.length,
    status,
    owner: mockUsers.find((user) => user.id === project.user_id)?.name ?? "Platform Team",
    lastCheck: relativeLastCheck(project.updated_at),
  }
})

export const incidents = mockIncidents.map((incident) => {
  const monitor = mockMonitors.find((item) => item.id === incident.monitor_id)
  return {
    id: incident.id.toUpperCase().replace("_", "-"),
    rawId: incident.id,
    title: incident.title,
    severity: incident.severity,
    status: incident.status,
    service: monitor?.name ?? "Unknown service",
    affected: [monitor ? projectForMonitor(monitor)?.name ?? "Unknown project" : "Unknown project", monitor?.region ?? "global"],
    rootCause: incident.root_cause ?? incident.reason,
    startedAt: new Date(incident.started_at).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    duration: incident.duration,
    timeline: [
      { time: "T+00", message: incident.reason },
      { time: "T+01", message: `${incident.severity} incident opened for ${monitor?.name ?? "service"}` },
      { time: "T+05", message: incident.root_cause ?? "Engineering team reviewing correlated check evidence" },
    ],
  }
})

export const liveChecks = mockChecks.slice(0, 14).map((check) => {
  const monitor = mockMonitors.find((item) => item.id === check.monitor_id)
  return {
    time: new Date(check.checked_at).toLocaleTimeString("en", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    monitor: monitor?.name ?? "Unknown monitor",
    region: check.region,
    status: check.status_code ?? 0,
    latency: check.latency_ms ?? 0,
  }
})

export const regions = ["us-east-1", "us-west-2", "eu-west-1", "eu-central-1", "ap-southeast-1", "global"].map((region) => {
  const regionMonitors = mockMonitors.filter((monitor) => monitor.region === region)
  return {
    name: region,
    monitors: regionMonitors.length,
    uptime: regionMonitors.length
      ? +(regionMonitors.reduce((sum, monitor) => sum + monitor.uptime_percentage, 0) / regionMonitors.length).toFixed(2)
      : 100,
    latency: regionMonitors.length
      ? Math.round(regionMonitors.reduce((sum, monitor) => sum + monitor.avg_latency_ms, 0) / regionMonitors.length)
      : 0,
  }
})

export const slowestEndpoints = mockMonitors
  .map((monitor) => ({
    name: monitor.name,
    url: new URL(monitor.url).pathname,
    p95: p95Latency(monitor.id),
    p99: p99Latency(monitor.id),
  }))
  .sort((a, b) => b.p95 - a.p95)
  .slice(0, 5)

export const statusPages = mockStatusPages.map((page) => {
  const project = mockProjects.find((item) => item.id === page.project_id)
  const projectMonitors = mockMonitors.filter((monitor) => monitor.project_id === page.project_id)
  return {
    id: page.id,
    name: page.name,
    slug: page.slug,
    project: project?.name ?? "Unknown project",
    visibility: page.is_public ? "public" : "internal",
    subscribers: page.subscribers,
    uptime: projectMonitors.length
      ? +(projectMonitors.reduce((sum, monitor) => sum + monitor.uptime_percentage, 0) / projectMonitors.length).toFixed(2)
      : 100,
    updatedAt: relativeLastCheck(page.updated_at),
  }
})

export const latencyData = Array.from({ length: 24 }).map((_, i) => {
  const base = 132 + Math.sin(i / 3) * 18
  const spike = i === 14 ? 86 : i === 22 ? 42 : 0
  return {
    time: `${String(i).padStart(2, "0")}:00`,
    p50: Math.round(base + spike * 0.4),
    p95: Math.round(base * 2.25 + spike),
    p99: Math.round(base * 3.6 + spike * 1.5),
  }
})

export const uptimeData = Array.from({ length: 30 }).map((_, i) => {
  const dip = i === 12 ? 1.2 : i === 22 ? 2.1 : i === 27 ? 3.6 : 0
  return {
    day: `D${i + 1}`,
    uptime: Math.max(95, +(99.98 - dip + ((i % 4) * 0.01)).toFixed(2)),
  }
})

export const incidentFrequency = Array.from({ length: 6 }).map((_, i) => ({
  week: `W${i + 1}`,
  critical: [0, 1, 0, 0, 1, 1][i],
  high: [1, 0, 2, 1, 1, 1][i],
  medium: [2, 3, 1, 2, 1, 2][i],
  low: [3, 2, 4, 3, 2, 3][i],
}))

export const statusDistribution = [
  { name: "Operational", value: mockMonitors.filter((monitor) => monitor.status === "operational").length, color: "#4F8CFF" },
  { name: "Degraded", value: mockMonitors.filter((monitor) => monitor.status === "degraded").length, color: "#F59E0B" },
  { name: "Down", value: mockMonitors.filter((monitor) => monitor.status === "down").length, color: "#EF4444" },
  { name: "Paused", value: mockMonitors.filter((monitor) => monitor.status === "paused").length, color: "#9CA3AF" },
]

export function sparklineData(base: number) {
  return Array.from({ length: 16 }).map((_, i) => ({
    x: i,
    y: Math.max(0, base + Math.sin(i / 2) * 6 + ((i % 4) - 1.5) * 2),
  }))
}
