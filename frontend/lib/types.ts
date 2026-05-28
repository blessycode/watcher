export type UserRole = "owner" | "admin" | "member" | "viewer"
export type ProjectEnvironment = "production" | "staging" | "development"
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD"
export type MonitorStatus = "operational" | "degraded" | "down" | "paused"
export type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved"
export type IncidentSeverity = "critical" | "high" | "medium" | "low"
export type AlertChannelType = "email" | "slack" | "discord" | "webhook" | "telegram"
export type AlertDeliveryStatus = "queued" | "sent" | "failed"
export type StatusPageState = "operational" | "degraded" | "partial_outage" | "major_outage"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar_url: string | null
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  slug: string
  description: string
  environment: ProjectEnvironment
  created_at: string
  updated_at: string
}

export interface Monitor {
  id: string
  project_id: string
  name: string
  url: string
  method: HttpMethod
  expected_status: number
  interval_seconds: number
  timeout_seconds: number
  region: string
  is_active: boolean
  status: MonitorStatus
  uptime_percentage: number
  avg_latency_ms: number
  last_checked_at: string
  created_at: string
}

export interface MonitorHeader {
  id: string
  monitor_id: string
  header_key: string
  encrypted_value: string
  is_secret: boolean
}

export interface Check {
  id: string
  monitor_id: string
  status_code: number | null
  success: boolean
  latency_ms: number | null
  error_message: string | null
  region: string
  checked_at: string
}

export interface Incident {
  id: string
  monitor_id: string
  title: string
  status: IncidentStatus
  severity: IncidentSeverity
  reason: string
  root_cause: string | null
  started_at: string
  resolved_at: string | null
  duration: string
  created_at: string
}

export interface AlertChannel {
  id: string
  user_id: string
  type: AlertChannelType
  destination: string
  is_verified: boolean
  is_active: boolean
  last_triggered_at: string | null
  created_at: string
}

export interface Alert {
  id: string
  incident_id: string
  channel: AlertChannelType
  recipient: string
  status: AlertDeliveryStatus
  sent_at: string | null
}

export interface StatusPage {
  id: string
  project_id: string
  name: string
  slug: string
  is_public: boolean
  subscribers: number
  overall_status: StatusPageState
  created_at: string
  updated_at: string
}

export interface APIKey {
  id: string
  user_id: string
  name: string
  key_prefix: string
  masked_key: string
  created_at: string
  last_used_at: string | null
  revoked_at: string | null
}

export interface CreateProjectInput {
  name: string
  slug: string
  description: string
  environment: ProjectEnvironment
}

export interface CreateMonitorInput {
  project_id: string
  name: string
  url: string
  method: HttpMethod
  expected_status: number
  interval_seconds: number
  timeout_seconds: number
  region: string
  is_active: boolean
  headers?: Array<Pick<MonitorHeader, "header_key" | "encrypted_value" | "is_secret">>
}
