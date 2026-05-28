import type { HttpMethod, IncidentSeverity, IncidentStatus, MonitorStatus, ProjectEnvironment } from "@/lib/types"

export const APP_NAME = "Watcher"

export const APP_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  projects: "/projects",
  monitors: "/monitors",
  newMonitor: "/monitors/new",
  incidents: "/incidents",
  statusPages: "/status-pages",
  alerts: "/alerts",
  analytics: "/analytics",
  settings: "/settings",
  docs: "/docs",
} as const

export const API_ENDPOINTS = {
  login: "POST /auth/login",
  register: "POST /auth/register",
  logout: "POST /auth/logout",
  me: "GET /auth/me",
  projects: "GET /projects",
  monitors: "GET /monitors",
  incidents: "GET /incidents",
  alertChannels: "GET /alert-channels",
  statusPages: "GET /status-pages",
  analyticsOverview: "GET /analytics/overview",
  apiKeys: "GET /api-keys",
} as const

export const HTTP_METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"]
export const ENVIRONMENTS: ProjectEnvironment[] = ["production", "staging", "development"]
export const MONITOR_STATUSES: MonitorStatus[] = ["operational", "degraded", "down", "paused"]
export const INCIDENT_STATUSES: IncidentStatus[] = ["investigating", "identified", "monitoring", "resolved"]
export const INCIDENT_SEVERITIES: IncidentSeverity[] = ["critical", "high", "medium", "low"]

export const REGIONS = [
  "us-east-1",
  "us-west-2",
  "eu-west-1",
  "eu-central-1",
  "ap-southeast-1",
  "ap-northeast-1",
  "global",
] as const

export const INTERVAL_OPTIONS = [
  { label: "30 seconds", value: 30 },
  { label: "1 minute", value: 60 },
  { label: "5 minutes", value: 300 },
  { label: "15 minutes", value: 900 },
] as const
