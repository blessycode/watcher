import {
  checksForMonitor,
  incidentsForMonitor,
  mockAlertChannels,
  mockApiKeys,
  mockChecks,
  mockIncidents,
  mockMonitorHeaders,
  mockMonitors,
  mockProjects,
  mockStatusPages,
  mockUsers,
} from "@/lib/mock-data"
import type {
  APIKey,
  AlertChannel,
  Check,
  CreateMonitorInput,
  CreateProjectInput,
  Incident,
  Monitor,
  MonitorHeader,
  Project,
  StatusPage,
  User,
} from "@/lib/types"

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export async function login(email: string, password: string): Promise<User> {
  await wait()
  const user = mockUsers.find((item) => item.email === email) ?? mockUsers[0]
  if (!email || !password) throw new Error("Email and password are required")
  return clone(user)
}

export async function register(input: { name: string; email: string; password: string; confirm_password: string }): Promise<User> {
  await wait()
  if (input.password !== input.confirm_password) throw new Error("Passwords do not match")
  return clone({
    id: "usr_new",
    name: input.name,
    email: input.email,
    role: "owner",
    avatar_url: null,
    created_at: new Date().toISOString(),
  })
}

export async function logout(): Promise<{ ok: true }> {
  await wait(100)
  return { ok: true }
}

export async function getCurrentUser(): Promise<User> {
  await wait(100)
  return clone(mockUsers[0])
}

export async function getProjects(): Promise<Project[]> {
  await wait()
  return clone(mockProjects)
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  await wait()
  return clone({
    id: `proj_${Date.now()}`,
    user_id: mockUsers[0].id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...input,
  })
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  await wait()
  return clone(mockProjects.find((project) => project.id === id))
}

export async function updateProject(id: string, input: Partial<CreateProjectInput>): Promise<Project> {
  await wait()
  const project = mockProjects.find((item) => item.id === id)
  if (!project) throw new Error("Project not found")
  return clone({ ...project, ...input, updated_at: new Date().toISOString() })
}

export async function deleteProject(id: string): Promise<{ id: string; deleted: true }> {
  await wait()
  return { id, deleted: true }
}

export async function getMonitors(): Promise<Monitor[]> {
  await wait()
  return clone(mockMonitors)
}

export async function createMonitor(input: CreateMonitorInput): Promise<Monitor> {
  await wait()
  return clone({
    id: `mon_${Date.now()}`,
    uptime_percentage: 100,
    avg_latency_ms: 0,
    last_checked_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    status: input.is_active ? "operational" : "paused",
    ...input,
  })
}

export async function getMonitorById(id: string): Promise<Monitor | undefined> {
  await wait()
  return clone(mockMonitors.find((monitor) => monitor.id === id))
}

export async function updateMonitor(id: string, input: Partial<CreateMonitorInput>): Promise<Monitor> {
  await wait()
  const monitor = mockMonitors.find((item) => item.id === id)
  if (!monitor) throw new Error("Monitor not found")
  return clone({ ...monitor, ...input, last_checked_at: monitor.last_checked_at })
}

export async function deleteMonitor(id: string): Promise<{ id: string; deleted: true }> {
  await wait()
  return { id, deleted: true }
}

export async function runMonitorCheck(id: string): Promise<Check> {
  await wait(550)
  const monitor = mockMonitors.find((item) => item.id === id)
  if (!monitor) throw new Error("Monitor not found")
  const success = monitor.status !== "down"
  return clone({
    id: `chk_${Date.now()}`,
    monitor_id: id,
    status_code: success ? monitor.expected_status : 503,
    success,
    latency_ms: success ? Math.max(24, monitor.avg_latency_ms + 11) : null,
    error_message: success ? null : "connection refused",
    region: monitor.region,
    checked_at: new Date().toISOString(),
  })
}

export async function getMonitorChecks(id: string): Promise<Check[]> {
  await wait()
  return clone(checksForMonitor(id))
}

export async function getMonitorAnalytics(id: string) {
  await wait()
  const checks = checksForMonitor(id)
  return clone({
    monitor_id: id,
    checks,
    failures: checks.filter((check) => !check.success).length,
    avg_latency_ms: Math.round(
      checks.reduce((sum, check) => sum + (check.latency_ms ?? 0), 0) / Math.max(1, checks.filter((check) => check.latency_ms).length),
    ),
  })
}

export async function getIncidents(): Promise<Incident[]> {
  await wait()
  return clone(mockIncidents)
}

export async function getIncidentById(id: string): Promise<Incident | undefined> {
  await wait()
  return clone(mockIncidents.find((incident) => incident.id === id))
}

export async function updateIncident(id: string, input: Partial<Incident>): Promise<Incident> {
  await wait()
  const incident = mockIncidents.find((item) => item.id === id)
  if (!incident) throw new Error("Incident not found")
  return clone({ ...incident, ...input })
}

export async function resolveIncident(id: string, note?: string): Promise<Incident> {
  await wait(350)
  const incident = mockIncidents.find((item) => item.id === id)
  if (!incident) throw new Error("Incident not found")
  return clone({
    ...incident,
    status: "resolved",
    resolved_at: new Date().toISOString(),
    root_cause: note || incident.root_cause || "Resolved from incident console",
  })
}

export async function getAlertChannels(): Promise<AlertChannel[]> {
  await wait()
  return clone(mockAlertChannels)
}

export async function createAlertChannel(input: Pick<AlertChannel, "type" | "destination">): Promise<AlertChannel> {
  await wait()
  return clone({
    id: `ach_${Date.now()}`,
    user_id: mockUsers[0].id,
    is_verified: false,
    is_active: true,
    last_triggered_at: null,
    created_at: new Date().toISOString(),
    ...input,
  })
}

export async function updateAlertChannel(id: string, input: Partial<AlertChannel>): Promise<AlertChannel> {
  await wait()
  const channel = mockAlertChannels.find((item) => item.id === id)
  if (!channel) throw new Error("Alert channel not found")
  return clone({ ...channel, ...input })
}

export async function deleteAlertChannel(id: string): Promise<{ id: string; deleted: true }> {
  await wait()
  return { id, deleted: true }
}

export async function testAlertChannel(id: string): Promise<{ id: string; status: "sent"; sent_at: string }> {
  await wait(500)
  return { id, status: "sent", sent_at: new Date().toISOString() }
}

export async function getStatusPages(): Promise<StatusPage[]> {
  await wait()
  return clone(mockStatusPages)
}

export async function getStatusPageById(id: string): Promise<StatusPage | undefined> {
  await wait()
  return clone(mockStatusPages.find((page) => page.id === id))
}

export async function getPublicStatusPage(slug: string) {
  await wait()
  const page = mockStatusPages.find((item) => item.slug === slug) ?? mockStatusPages[0]
  const monitors = mockMonitors.filter((monitor) => monitor.project_id === page.project_id)
  return clone({ page, monitors, incidents: monitors.flatMap((monitor) => incidentsForMonitor(monitor.id)) })
}

export async function createStatusPage(input: Pick<StatusPage, "project_id" | "name" | "slug" | "is_public">): Promise<StatusPage> {
  await wait()
  return clone({
    id: `sp_${Date.now()}`,
    subscribers: 0,
    overall_status: "operational",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...input,
  })
}

export async function updateStatusPage(id: string, input: Partial<StatusPage>): Promise<StatusPage> {
  await wait()
  const page = mockStatusPages.find((item) => item.id === id)
  if (!page) throw new Error("Status page not found")
  return clone({ ...page, ...input, updated_at: new Date().toISOString() })
}

export async function deleteStatusPage(id: string): Promise<{ id: string; deleted: true }> {
  await wait()
  return { id, deleted: true }
}

export async function getAnalyticsOverview() {
  await wait()
  const failedChecks = mockChecks.filter((check) => !check.success).length
  const activeMonitors = mockMonitors.filter((monitor) => monitor.is_active).length
  return clone({
    overall_uptime: 99.94,
    active_monitors: activeMonitors,
    failed_checks: failedChecks,
    avg_latency_ms: 184,
    open_incidents: mockIncidents.filter((incident) => incident.status !== "resolved").length,
  })
}

export async function getLatencyAnalytics() {
  await wait()
  return getMonitorAnalytics(mockMonitors[0].id)
}

export async function getUptimeAnalytics() {
  await wait()
  return clone(mockMonitors.map((monitor) => ({ monitor_id: monitor.id, uptime_percentage: monitor.uptime_percentage })))
}

export async function getIncidentAnalytics() {
  await wait()
  return clone(mockIncidents)
}

export async function getErrorAnalytics() {
  await wait()
  return clone(mockChecks.filter((check) => !check.success))
}

export async function getApiKeys(): Promise<APIKey[]> {
  await wait()
  return clone(mockApiKeys)
}

export async function createApiKey(name: string): Promise<APIKey> {
  await wait()
  return clone({
    id: `key_${Date.now()}`,
    user_id: mockUsers[0].id,
    name,
    key_prefix: "wtr_live",
    masked_key: "wtr_live_••••••••••••NEW",
    created_at: new Date().toISOString(),
    last_used_at: null,
    revoked_at: null,
  })
}

export async function revokeApiKey(id: string): Promise<APIKey> {
  await wait()
  const key = mockApiKeys.find((item) => item.id === id)
  if (!key) throw new Error("API key not found")
  return clone({ ...key, revoked_at: new Date().toISOString() })
}

export async function getMonitorHeaders(monitorId: string): Promise<MonitorHeader[]> {
  await wait()
  return clone(mockMonitorHeaders.filter((header) => header.monitor_id === monitorId))
}
