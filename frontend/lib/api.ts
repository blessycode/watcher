import type {
  APIKey,
  AlertChannel,
  Check,
  CheckLog,
  CreateMonitorInput,
  CreateProjectInput,
  Incident,
  Monitor,
  MonitorHeader,
  Project,
  StatusPage,
  User,
} from "@/lib/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
const TOKEN_KEY = "watcher_access_token"
const USER_KEY = "watcher_current_user"

type RequestOptions = RequestInit & { auth?: boolean }

function getToken() {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function hasAuthToken() {
  return Boolean(getToken())
}

function setToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token)
  }
}

function setCachedUser(user: User) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function getCachedUser(): User | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")
  if (options.auth !== false) {
    const token = getToken()
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })
  if (!response.ok) {
    if (response.status === 401 && options.auth !== false) {
      clearAuthToken()
    }
    let message = `Request failed with ${response.status}`
    try {
      const body = await response.json()
      if (Array.isArray(body.detail)) {
        message = body.detail
          .map((item: any) => {
            const field = Array.isArray(item.loc) ? item.loc.filter((part: string) => part !== "body").join(".") : ""
            return field ? `${field}: ${item.msg}` : item.msg
          })
          .join("; ")
      } else if (typeof body.detail === "string") {
        message = body.detail
      }
    } catch {
      // Keep the HTTP fallback message.
    }
    throw new Error(message)
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

async function authenticate(path: "/auth/login" | "/auth/register", body: object): Promise<User> {
  const token = await request<{ access_token: string }>(path, {
    method: "POST",
    body: JSON.stringify(body),
    auth: false,
  })
  setToken(token.access_token)
  const user = await getCurrentUser()
  setCachedUser(user)
  return user
}

export async function login(email: string, password: string): Promise<User> {
  return authenticate("/auth/login", { email, password })
}

export async function register(input: { name: string; email: string; password: string; confirm_password: string }): Promise<User> {
  if (input.password !== input.confirm_password) throw new Error("Passwords do not match")
  return authenticate("/auth/register", { name: input.name, email: input.email, password: input.password })
}

export function getOAuthStartUrl(provider: "github" | "google") {
  return `${API_BASE_URL}/auth/oauth/${provider}/start`
}

export async function completeOAuthLogin(accessToken: string): Promise<User> {
  setToken(accessToken)
  return getCurrentUser()
}

export async function logout(): Promise<{ ok: true }> {
  try {
    return await request<{ ok: true }>("/auth/logout", { method: "POST" })
  } finally {
    clearAuthToken()
  }
}

export async function getCurrentUser(): Promise<User> {
  const user = await request<User>("/auth/me")
  setCachedUser(user)
  return user
}

export async function getProjects(): Promise<Project[]> {
  return request<Project[]>("/projects")
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  return request<Project>("/projects", { method: "POST", body: JSON.stringify(input) })
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return request<Project>(`/projects/${id}`)
}

export async function updateProject(id: string, input: Partial<CreateProjectInput>): Promise<Project> {
  return request<Project>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(input) })
}

export async function deleteProject(id: string): Promise<{ id: string; deleted: true }> {
  return request<{ id: string; deleted: true }>(`/projects/${id}`, { method: "DELETE" })
}

export async function getMonitors(): Promise<Monitor[]> {
  return request<Monitor[]>("/monitors")
}

export async function createMonitor(input: CreateMonitorInput): Promise<Monitor> {
  return request<Monitor>("/monitors", { method: "POST", body: JSON.stringify(input) })
}

export async function getMonitorById(id: string): Promise<Monitor | undefined> {
  return request<Monitor>(`/monitors/${id}`)
}

export async function updateMonitor(id: string, input: Partial<CreateMonitorInput>): Promise<Monitor> {
  return request<Monitor>(`/monitors/${id}`, { method: "PUT", body: JSON.stringify(input) })
}

export async function deleteMonitor(id: string): Promise<{ id: string; deleted: true }> {
  return request<{ id: string; deleted: true }>(`/monitors/${id}`, { method: "DELETE" })
}

export async function runMonitorCheck(id: string): Promise<Check> {
  return request<Check>(`/monitors/${id}/check-now`, { method: "POST" })
}

export async function getMonitorChecks(id: string): Promise<Check[]> {
  return request<Check[]>(`/monitors/${id}/checks`)
}

export async function getCheckLogs(): Promise<CheckLog[]> {
  return request<CheckLog[]>("/checks")
}

export async function getMonitorAnalytics(id: string) {
  return request(`/monitors/${id}/analytics`)
}

export async function getIncidents(): Promise<Incident[]> {
  return request<Incident[]>("/incidents")
}

export async function getIncidentById(id: string): Promise<Incident | undefined> {
  return request<Incident>(`/incidents/${id}`)
}

export async function updateIncident(id: string, input: Partial<Incident>): Promise<Incident> {
  return request<Incident>(`/incidents/${id}`, { method: "PUT", body: JSON.stringify(input) })
}

export async function resolveIncident(id: string, note?: string): Promise<Incident> {
  return request<Incident>(`/incidents/${id}/resolve`, { method: "PUT", body: JSON.stringify({ root_cause: note }) })
}

export async function getAlertChannels(): Promise<AlertChannel[]> {
  return request<AlertChannel[]>("/alert-channels")
}

export async function createAlertChannel(input: Pick<AlertChannel, "type" | "destination">): Promise<AlertChannel> {
  return request<AlertChannel>("/alert-channels", { method: "POST", body: JSON.stringify(input) })
}

export async function updateAlertChannel(id: string, input: Partial<AlertChannel>): Promise<AlertChannel> {
  return request<AlertChannel>(`/alert-channels/${id}`, { method: "PUT", body: JSON.stringify(input) })
}

export async function deleteAlertChannel(id: string): Promise<{ id: string; deleted: true }> {
  return request<{ id: string; deleted: true }>(`/alert-channels/${id}`, { method: "DELETE" })
}

export async function testAlertChannel(id: string): Promise<{ id: string; status: "sent"; sent_at: string }> {
  return request<{ id: string; status: "sent"; sent_at: string }>(`/alert-channels/${id}/test`, { method: "POST" })
}

export async function getStatusPages(): Promise<StatusPage[]> {
  return request<StatusPage[]>("/status-pages")
}

export async function getStatusPageById(id: string): Promise<StatusPage | undefined> {
  return request<StatusPage>(`/status-pages/${id}`)
}

export async function getPublicStatusPage(slug: string) {
  return request(`/status/${slug}`, { auth: false })
}

export async function createStatusPage(input: Pick<StatusPage, "project_id" | "name" | "slug" | "is_public">): Promise<StatusPage> {
  return request<StatusPage>("/status-pages", { method: "POST", body: JSON.stringify(input) })
}

export async function updateStatusPage(id: string, input: Partial<StatusPage>): Promise<StatusPage> {
  return request<StatusPage>(`/status-pages/${id}`, { method: "PUT", body: JSON.stringify(input) })
}

export async function deleteStatusPage(id: string): Promise<{ id: string; deleted: true }> {
  return request<{ id: string; deleted: true }>(`/status-pages/${id}`, { method: "DELETE" })
}

export async function getAnalyticsOverview() {
  return request("/analytics/overview")
}

export async function getLatencyAnalytics() {
  return request("/analytics/latency")
}

export async function getUptimeAnalytics() {
  return request("/analytics/uptime")
}

export async function getIncidentAnalytics() {
  return request("/analytics/incidents")
}

export async function getErrorAnalytics() {
  return request("/analytics/errors")
}

export async function getApiKeys(): Promise<APIKey[]> {
  return request<APIKey[]>("/api-keys")
}

export async function createApiKey(name: string): Promise<APIKey> {
  return request<APIKey>("/api-keys", { method: "POST", body: JSON.stringify({ name }) })
}

export async function revokeApiKey(id: string): Promise<APIKey> {
  await request<{ id: string; deleted: true }>(`/api-keys/${id}`, { method: "DELETE" })
  return { id, user_id: "", name: "", key_prefix: "", masked_key: "", created_at: new Date().toISOString(), last_used_at: null, revoked_at: new Date().toISOString() }
}

export async function getMonitorHeaders(monitorId: string): Promise<MonitorHeader[]> {
  const monitor = await getMonitorById(monitorId)
  return monitor?.headers ?? []
}

export async function bootstrapWorkspace(): Promise<{ ok: true; created: Record<string, number> }> {
  return request<{ ok: true; created: Record<string, number> }>("/onboarding/bootstrap", { method: "POST" })
}
