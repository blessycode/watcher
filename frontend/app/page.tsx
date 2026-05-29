import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  Github,
  Globe2,
  LineChart,
  MapPinned,
  ShieldCheck,
  Target,
} from "lucide-react"
import { WatcherLogo } from "@/components/watcher-logo"

const navItems = [
  ["Product", "#product"],
  ["Platform", "#platform"],
  ["Workflow", "#workflow"],
  ["Status pages", "#status-pages"],
  ["Docs", "/docs"],
]

const features = [
  {
    icon: Activity,
    title: "Monitor every critical API",
    body: "Track production endpoints, health checks, webhooks, customer-facing services, and internal APIs from one workspace.",
  },
  {
    icon: Clock3,
    title: "Know uptime and latency",
    body: "See whether an endpoint is reachable, how fast it responds, and how performance changes over time.",
  },
  {
    icon: AlertTriangle,
    title: "Catch failures before users complain",
    body: "Watcher separates one-off errors from repeated failures, then opens incidents when a service is truly down.",
  },
  {
    icon: Bell,
    title: "Notify the right people",
    body: "Route incident alerts to your team so downtime, recovery, and follow-up do not get missed.",
  },
  {
    icon: LineChart,
    title: "Understand service health",
    body: "Use uptime, error rate, failure regions, latency trends, and slow endpoints to improve reliability.",
  },
  {
    icon: Globe2,
    title: "Share public status pages",
    body: "Give customers a clean source of truth for current health, incidents, and service availability.",
  },
]

const platformPillars = [
  ["Monitoring", "REST, GraphQL, webhooks, internal services, public websites, auth, payments, and microservices.", Activity],
  ["Incidents", "Convert failures into trackable incidents with severity, recovery, history, and root-cause context.", AlertTriangle],
  ["Analytics", "Track uptime, P50/P95/P99 latency, error rate, slowest endpoints, SLA pressure, and trends.", LineChart],
  ["Developer logs", "Search every check execution by service, status, failure reason, date, region, and latency.", FileText],
  ["Regions", "Compare API behavior across Harare, Johannesburg, London, Frankfurt, New York, and Singapore.", MapPinned],
  ["SLA", "Understand monthly downtime budgets, current compliance, and reliability risk by service.", Target],
]

const faqs = [
  ["Does Watcher host my API?", "No. Watcher watches APIs you already host and tells you when they slow down, fail, or recover."],
  ["What should I monitor?", "Start with health endpoints, public API routes, payment flows, authentication routes, and important webhooks."],
  ["Who is Watcher for?", "Teams that need simple uptime visibility, incident history, alerting, analytics, and public communication around API reliability."],
  ["Can customers see service health?", "Yes. You can publish public status pages for projects you want to expose externally."],
]

export default function LandingPage() {
  return (
    <div className="watcher-semantic-glow min-h-screen text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#050608]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
          <Link href="/" aria-label="Watcher home">
            <WatcherLogo />
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] md:flex">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} className="text-zinc-400 transition hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-[13px]">
            <Link href="/login" className="hidden text-zinc-400 transition hover:text-white sm:inline">Log in</Link>
            <Link href="/register" className="rounded-full bg-white px-4 py-2 font-semibold text-black transition hover:bg-zinc-200">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pt-32 lg:px-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(79,140,255,0.16),transparent_34%)]" />
          <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#202832]/80 to-transparent" />
          <div className="relative mx-auto max-w-6xl">
            <div className="max-w-4xl pb-12 pt-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4F8CFF]" />
                Open-source API monitoring
              </div>
              <h1 className="mt-7 text-balance text-[54px] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[76px] lg:text-[90px]">
                API monitoring that keeps teams ahead of downtime.
              </h1>
              <p className="mt-7 max-w-2xl text-[16px] leading-8 text-zinc-400">
                Watcher is an open-source API Reliability Platform for monitoring uptime, latency, incidents, logs, regions, SLA, alerts, and customer-facing status pages.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/register" className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200">
                  Start monitoring
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/docs" className="inline-flex h-11 items-center gap-2 rounded-full border border-[#4F8CFF]/25 bg-[#4F8CFF]/10 px-5 text-sm font-semibold text-white transition hover:bg-[#4F8CFF]/15">
                  Read docs
                </Link>
              </div>
            </div>

            <ProductPreview />
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#080A0F] px-4 py-6 lg:px-6">
          <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-4">
            {[
              ["24/7", "API visibility"],
              ["P95", "latency insight"],
              ["SLA", "reliability budget"],
              ["Public", "status pages"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
                <div className="font-mono text-xl text-white">{value}</div>
                <div className="mt-1 text-sm text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="product" className="px-4 py-24 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="text-sm text-[#4F8CFF]">Product</div>
                <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.045em]">
                  Everything needed for API uptime intelligence.
                </h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <article key={feature.title} className="rounded-2xl border border-white/10 bg-[#111318]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <Icon className="h-5 w-5 text-[#4F8CFF]" />
                      <h3 className="mt-5 font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">{feature.body}</p>
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="border-y border-white/10 bg-[#080A0F] px-4 py-24 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <div className="text-sm text-[#4F8CFF]">Platform</div>
              <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.045em]">
                Beyond uptime checks.
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">
                Watcher connects monitoring, incident response, performance analytics, developer logs, regional visibility, SLA tracking, and status communication into one reliability workflow.
              </p>
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {platformPillars.map(([title, body, Icon]) => (
                <article key={title as string} className="rounded-2xl border border-white/10 bg-[#111318]/80 p-5">
                  <Icon className="h-5 w-5 text-[#4F8CFF]" />
                  <h3 className="mt-5 font-semibold">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{body as string}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="border-y border-white/10 bg-[#080A0F] px-4 py-24 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <div className="text-sm text-[#4F8CFF]">Workflow</div>
              <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.045em]">
                From registered endpoint to incident response.
              </h2>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-4">
              {[
                ["1", "Create project", "Organize services by product, environment, team, or client."],
                ["2", "Add monitor", "Choose the endpoint, expected response, check interval, and region."],
                ["3", "Watch health", "Track uptime, latency, failures, and recovery from the dashboard."],
                ["4", "Respond clearly", "Alert your team and keep customers updated with status pages."],
              ].map(([number, title, body]) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-[#111318]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4F8CFF] font-mono font-bold text-white">{number}</div>
                  <h3 className="mt-6 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="status-pages" className="px-4 py-24 lg:px-6">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="text-sm text-[#4F8CFF]">Status pages</div>
              <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-[-0.045em]">
                Keep customers informed when reliability matters most.
              </h2>
              <p className="mt-5 text-sm leading-7 text-zinc-400">
                Turn internal monitor data into a simple public health page. Show which services are operational, which ones are degraded, and when incidents are resolved.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#111318]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              {[
                ["Current health", "Show live operational, degraded, and down states.", ShieldCheck],
                ["Incident history", "Give users context when a service has been unstable.", AlertTriangle],
                ["Subscriber updates", "Let people follow service health without opening a ticket.", Bell],
                ["Project-level pages", "Publish separate status pages for products, teams, or clients.", Globe2],
              ].map(([title, body, Icon]) => (
                <div key={title as string} className="flex gap-4 border-b border-white/10 py-4 last:border-0">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#4F8CFF]" />
                  <div>
                    <div className="font-semibold">{title as string}</div>
                    <div className="mt-1 font-mono text-xs leading-5 text-zinc-500">{body as string}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-24 lg:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1fr]">
            <div>
              <div className="text-sm text-[#4F8CFF]">FAQ</div>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Before the first monitor.</h2>
            </div>
            <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
              {faqs.map(([question, answer]) => (
                <article key={question} className="p-6">
                  <h3 className="font-semibold">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ProductPreview() {
  return (
    <div className="relative rounded-t-[28px] border border-white/10 bg-[#111318] shadow-2xl shadow-black/60">
      <div className="grid min-h-[430px] overflow-hidden rounded-t-[28px] lg:grid-cols-[220px_1fr_300px]">
        <aside className="hidden border-r border-white/10 bg-black/20 p-5 text-sm text-zinc-500 lg:block">
          <div className="flex items-center gap-2 text-white">
            <img src="/watcher-logo-mark.png" alt="" className="h-5 w-5 rounded" />
            Watcher
          </div>
          <div className="mt-8 space-y-3">
            {["Dashboard", "Projects", "Monitors", "Incidents", "Status Pages", "Alerts"].map((item, index) => (
              <div key={item} className={`rounded px-3 py-2 ${index === 2 ? "bg-white/[0.07] text-white" : ""}`}>{item}</div>
            ))}
          </div>
        </aside>
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <div className="text-sm text-zinc-500">Monitor</div>
              <h3 className="mt-1 text-xl font-semibold">Payments API Health</h3>
            </div>
            <span className="rounded-full border border-[#4F8CFF]/30 bg-[#4F8CFF]/10 px-3 py-1 text-xs text-[#AFCBFF]">Operational</span>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["100%", "uptime"],
              ["184ms", "avg latency"],
              ["0", "open incidents"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="font-mono text-2xl">{value}</div>
                <div className="mt-1 text-xs text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Latency trend</span>
              <span>last 24h</span>
            </div>
            <svg viewBox="0 0 620 180" className="mt-4 h-44 w-full">
              <path d="M0 138 C60 118 92 126 150 96 S250 64 320 82 S420 134 500 70 S580 52 620 40" fill="none" stroke="#4F8CFF" strokeWidth="4" />
              <path d="M0 138 C60 118 92 126 150 96 S250 64 320 82 S420 134 500 70 S580 52 620 40 L620 180 L0 180 Z" fill="rgba(79,140,255,0.13)" />
            </svg>
          </div>
        </div>
        <aside className="hidden border-l border-white/10 bg-black/20 p-6 lg:block">
          <div className="font-mono text-xs text-zinc-500">RECENT INCIDENT</div>
          <div className="mt-8 space-y-4">
            {[
              ["14:18", "Check returned HTTP 503."],
              ["14:19", "Incident opened after 3 failures."],
              ["14:19", "Alert delivered to the response team."],
              ["14:24", "Recovery check resolved incident."],
            ].map(([time, text]) => (
              <div key={text} className="flex gap-3 text-sm">
                <span className="font-mono text-xs text-[#4F8CFF]">{time}</span>
                <span className="text-zinc-400">{text}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050608] px-4 lg:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <WatcherLogo />
          <p className="mt-3 max-w-md text-sm text-zinc-500">Open-source API monitoring, incident intelligence, team alerts, and public status pages.</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-zinc-500">
          <Link href="/docs" className="hover:text-white">Docs</Link>
          <Link href="/login" className="hover:text-white">Login</Link>
          <Link href="/register" className="hover:text-white">Sign up</Link>
          <Link href="https://github.com" className="inline-flex items-center gap-1 hover:text-white">
            <Github className="h-4 w-4" /> Developer GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}
