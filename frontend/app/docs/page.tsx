import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  KeyRound,
  Search,
  Server,
  Shield,
  Zap,
} from "lucide-react"
import { WatcherLogo } from "@/components/watcher-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const sections = [
  { id: "quickstart", icon: Zap, title: "Quickstart", body: "Create a project, register an endpoint as a monitor, and run the first check." },
  { id: "projects", icon: BookOpen, title: "Projects", body: "Group monitors by product, client, service, or environment." },
  { id: "monitors", icon: Activity, title: "Monitors", body: "Register hosted APIs with URL, method, expected status, interval, timeout, headers, and region." },
  { id: "checks", icon: CheckCircle2, title: "Checks", body: "Understand how Watcher sends HTTP requests and stores latency/status results." },
  { id: "incidents", icon: AlertTriangle, title: "Incidents", body: "Learn degraded/down logic, auto incident creation, and recovery." },
  { id: "alerts", icon: Bell, title: "Alerts", body: "Configure Resend email delivery and test alert channels." },
  { id: "status-pages", icon: Globe, title: "Status Pages", body: "Publish project health using public status pages." },
  { id: "deployment", icon: Server, title: "Deployment", body: "Render backend, Vercel frontend, Postgres, Redis, Celery, and Resend." },
  { id: "security", icon: Shield, title: "Security", body: "JWT sessions, ownership rules, URL validation, and production SSRF protection." },
]

const monitorPayload = `{
  "project_id": "PROJECT_UUID",
  "name": "Payments API Health",
  "url": "https://api.yourcompany.com/health",
  "method": "GET",
  "expected_status": 200,
  "interval_seconds": 60,
  "timeout_seconds": 5,
  "region": "global",
  "is_active": true,
  "headers": [
    {
      "header_key": "Authorization",
      "encrypted_value": "Bearer your-token",
      "is_secret": true
    }
  ]
}`

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <Link href="/"><WatcherLogo /></Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">/ Documentation</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="bg-transparent">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/monitors/new">New monitor</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center lg:px-6">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            Real implementation docs
          </div>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Watcher Documentation
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
            Practical examples for registering APIs, running checks, detecting incidents, sending Resend alerts, and deploying Watcher on Render and Vercel.
          </p>
          <div className="relative mx-auto mt-7 max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-10 pl-9" placeholder="Search visually: monitors, Resend, Render, status pages" />
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr] lg:px-6">
        <aside className="lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
          <nav className="rounded-lg border border-border bg-card p-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <a key={section.id} href={`#${section.id}`} className="flex items-center gap-2 rounded px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                  <Icon className="h-4 w-4 text-primary" />
                  {section.title}
                </a>
              )
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <a key={section.id} href={`#${section.id}`} className="rounded-lg border border-border bg-card p-4 transition hover:border-primary/35 hover:bg-secondary/60">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="font-semibold">{section.title}</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.body}</p>
                </a>
              )
            })}
          </div>

          <DocSection id="quickstart" title="Quickstart" icon={Zap}>
            <p>
              In Watcher, registering an API means creating a monitor. The monitor stores the target URL and check rules. Checks create history records in Postgres.
            </p>
            <Steps
              items={[
                ["Create an account", "Register or log in. Watcher creates a JWT-backed session in the database."],
                ["Create a project", "Use Projects for products, clients, services, or environments."],
                ["Create a monitor", "Go to /monitors/new and enter your hosted API health endpoint."],
                ["Run Check now", "Watcher sends a real HTTP request with httpx and stores the result in checks."],
                ["Watch incidents", "After repeated failures, Watcher marks the monitor down and opens an incident."],
              ]}
            />
          </DocSection>

          <DocSection id="projects" title="Projects" icon={BookOpen}>
            <p>Projects group monitors and status pages. A user can only access projects they own.</p>
            <Example title="Example project">
{`Name: Core Platform
Slug: core-platform
Environment: production
Description: Auth, billing, worker, and public API health`}
            </Example>
            <Example title="Create project API">
{`POST /projects
Authorization: Bearer <token>

{
  "name": "Core Platform",
  "slug": "core-platform",
  "description": "Production API health",
  "environment": "production"
}`}
            </Example>
          </DocSection>

          <DocSection id="monitors" title="Monitors" icon={Activity}>
            <p>
              A monitor is the API endpoint Watcher tests. In production this should normally be a public health endpoint such as <InlineCode>https://api.yourcompany.com/health</InlineCode>.
            </p>
            <Example title="Good real-world monitor">
{`Name: Payments API Health
URL: https://payments.yourcompany.com/health
Method: GET
Expected status: 200
Interval: 60 seconds
Timeout: 5 seconds
Region: global
Active: true`}
            </Example>
            <Example title="Create monitor JSON">
{monitorPayload}
            </Example>
            <p>
              Secret headers are encrypted before storage and are not exposed back as plain text in frontend responses.
            </p>
          </DocSection>

          <DocSection id="checks" title="Checks" icon={CheckCircle2}>
            <p>
              Manual checks use <InlineCode>POST /monitors/:id/check-now</InlineCode>. Scheduled checks are dispatched by Celery beat and executed by Celery workers.
            </p>
            <Example title="Check result example">
{`{
  "id": "CHECK_UUID",
  "monitor_id": "MONITOR_UUID",
  "status_code": 200,
  "success": true,
  "latency_ms": 184.32,
  "error_message": null,
  "region": "global",
  "checked_at": "2026-05-29T14:00:00Z"
}`}
            </Example>
            <p>Watcher sends requests with Python <InlineCode>httpx</InlineCode>, measures latency, compares status code, stores the check, and updates monitor uptime.</p>
          </DocSection>

          <DocSection id="incidents" title="Incidents" icon={AlertTriangle}>
            <p>Incident rules are intentionally simple and predictable.</p>
            <Steps
              items={[
                ["1 failed check", "Monitor becomes degraded."],
                ["3 consecutive failed checks", "Monitor becomes down and Watcher creates an open incident if one does not already exist."],
                ["Successful recovery check", "Watcher resolves the open incident and records recovery details."],
              ]}
            />
            <Example title="Failure test">
{`URL: https://example.com/not-found
Expected status: 200

Run Check now three times.
Result: degraded -> down -> open incident`}
            </Example>
          </DocSection>

          <DocSection id="alerts" title="Alerts with Resend" icon={Bell}>
            <p>Email alert channels use Resend. Watcher stores each delivery attempt in the alerts table with provider metadata.</p>
            <Example title="Render backend environment">
{`RESEND_API_KEY=re_...
ALERT_EMAIL_FROM=Watcher <alerts@yourdomain.com>
ALERT_EMAIL_REPLY_TO=support@yourdomain.com`}
            </Example>
            <Example title="Create email alert channel">
{`POST /alert-channels
Authorization: Bearer <token>

{
  "type": "email",
  "destination": "oncall@yourcompany.com"
}`}
            </Example>
            <Example title="Test alert channel">
{`POST /alert-channels/:id/test

Expected success:
{
  "status": "sent",
  "provider": "resend",
  "provider_message_id": "..."
}`}
            </Example>
          </DocSection>

          <DocSection id="status-pages" title="Status Pages" icon={Globe}>
            <p>Status pages expose project health publicly. They roll up monitor states for the selected project.</p>
            <Example title="Create status page">
{`POST /status-pages

{
  "project_id": "PROJECT_UUID",
  "name": "Core Platform Status",
  "slug": "core-platform",
  "is_public": true
}`}
            </Example>
            <Example title="Public URL">
{`GET /status/core-platform

Frontend route:
https://your-watcher.vercel.app/status/core-platform`}
            </Example>
          </DocSection>

          <DocSection id="deployment" title="Render + Vercel Deployment" icon={Server}>
            <p>Production Watcher should run as separate web, worker, beat, Postgres, Redis, and frontend services.</p>
            <Example title="Render web service">
{`Build command:
pip install -r requirements.txt && alembic -c alembic.ini upgrade head

Start command:
uvicorn app.main:app --host 0.0.0.0 --port $PORT`}
            </Example>
            <Example title="Render workers">
{`Celery worker:
celery -A app.workers.celery_app.celery_app worker -Q monitoring --loglevel=info

Celery beat:
celery -A app.workers.celery_app.celery_app beat --loglevel=info`}
            </Example>
            <Example title="Vercel frontend">
{`NEXT_PUBLIC_API_URL=https://your-watcher-api.onrender.com`}
            </Example>
          </DocSection>

          <DocSection id="security" title="Security" icon={Shield}>
            <div className="grid gap-3 md:grid-cols-2">
              <Fact icon={KeyRound} title="Sessions" text="Login/register create JWT-backed database sessions. Logout revokes the active session." />
              <Fact icon={Database} title="Ownership" text="Protected routes filter projects, monitors, incidents, alert channels, and status pages by the current user." />
              <Fact icon={Shield} title="SSRF protection" text="Production blocks private IP and localhost monitor targets to avoid internal network probing." />
              <Fact icon={Code2} title="Validation" text="Pydantic validates URLs, methods, statuses, intervals, alert destinations, and update payloads." />
            </div>
          </DocSection>

          <div className="rounded-xl border border-primary/20 bg-primary p-6 text-primary-foreground">
            <div className="text-xl font-semibold">Ready to test a real API?</div>
            <p className="mt-2 max-w-2xl text-sm opacity-90">
              Create a monitor for your hosted API health endpoint, run Check now, then watch the dashboard, checks table, and incident logic update from Postgres.
            </p>
            <Button asChild variant="secondary" className="mt-4">
              <Link href="/monitors/new">Create monitor <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function DocSection({ id, title, icon: Icon, children }: { id: string; title: string; icon: any; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/10 text-primary">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="space-y-4 text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  )
}

function Example({ title, children }: { title: string; children: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#0f172a]">
      <div className="border-b border-white/10 px-4 py-2 text-xs font-semibold text-slate-300">{title}</div>
      <pre className="overflow-x-auto p-4 text-[12px] leading-6 text-slate-200"><code>{children}</code></pre>
    </div>
  )
}

function Steps({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid gap-2">
      {items.map(([title, body], index) => (
        <div key={title} className="flex gap-3 rounded-lg border border-border bg-secondary/50 p-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">{index + 1}</div>
          <div>
            <div className="font-semibold text-foreground">{title}</div>
            <div className="text-sm text-muted-foreground">{body}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Fact({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-3 font-semibold text-foreground">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-foreground">{children}</code>
}
