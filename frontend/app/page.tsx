import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Clock3,
  Github,
  Globe2,
  LineChart,
  Radio,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { WatcherLogo } from "@/components/watcher-logo"

const navItems = [
  ["Product", "#product"],
  ["Docs", "/docs"],
  ["FAQ", "#faq"],
  ["Pricing", "#cta"],
]

const faqs = [
  ["Is Watcher open source?", "Yes. Watcher is structured as an open-source API monitoring platform with a FastAPI backend."],
  ["Can it monitor private APIs?", "The backend validates monitor URLs and can block private targets in production to reduce SSRF risk."],
  ["Does it include status pages?", "Yes. Watcher includes status page management and public status pages backed by your database."],
  ["Is this connected to real checks?", "Yes. The dashboard connects to your local backend, Postgres database, and real HTTP monitor checks."],
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-2xl border border-border bg-card/85 px-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <Link href="/" aria-label="Watcher home">
            <WatcherLogo />
          </Link>
          <nav className="hidden items-center gap-5 text-sm md:flex">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} className="text-muted-foreground transition hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden rounded-xl sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="rounded-xl font-semibold">
              <Link href="/register">Start free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="overflow-hidden">
        <section className="relative px-4 pb-16 pt-32 lg:px-6 lg:pb-24">
          <div className="absolute inset-0 watcher-radial" />
          <div className="absolute left-1/2 top-6 h-96 w-[64rem] -translate-x-1/2 rounded-full bg-primary/14 blur-3xl" />
          <div className="absolute bottom-0 right-[-18rem] h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Open-source API monitoring
              </div>
              <h1 className="mt-7 text-balance text-6xl font-semibold leading-[0.95] tracking-[-0.055em] text-slate-950 dark:text-foreground sm:text-7xl lg:text-[100px]">
                Know when APIs fail before users do.
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-slate-600 dark:text-muted-foreground">
                Watcher tracks uptime, latency, failures, incidents, alerts, and public service health from one focused developer workspace.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 rounded-xl px-6 font-bold glow-primary">
                  <Link href="/register">
                    Start Monitoring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-border bg-secondary/70 dark:bg-white/[0.035] px-6 font-bold">
                  <Link href="/dashboard">
                    <Terminal className="mr-2 h-4 w-4" />
                    View Live Demo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative z-10">
              <HeroConsole />
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/60 px-4 py-6 lg:px-6">
          <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">
            {[
              ["99.94%", "overall uptime"],
              ["24", "active monitors"],
              ["184ms", "average latency"],
              ["2", "open incidents"],
            ].map(([value, label]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-border bg-secondary/70 dark:bg-white/[0.035] px-5 py-4">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-mono text-xl font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="product" className="px-4 py-24 lg:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Product</div>
              <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                One screen for the whole incident story.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
                Watcher is arranged around what happens during a real outage: detect the failure, understand the blast radius, notify the right people, and publish the update.
              </p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-12">
              <ProductCommandCenter />

              <div className="grid gap-4 lg:col-span-5">
                {[
                  ["Monitor", "Endpoint checks with method, headers, regions, and expected status codes.", Activity],
                  ["Investigate", "Recent checks, latency history, logs, and incidents stay beside each other.", LineChart],
                  ["Communicate", "Alert channels and status pages move with the incident timeline.", Bell],
                ].map(([title, body, Icon]) => (
                  <article key={title as string} className="rounded-[1.5rem] border border-border bg-card p-5">
                    <div className="flex items-start gap-4">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold tracking-tight">{title as string}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{body as string}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/60 px-4 py-24 lg:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[2rem] border border-border bg-card p-8">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Workflow</div>
                <h2 className="mt-4 max-w-2xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                  From failed check to customer update.
                </h2>
              </div>
              <div className="grid gap-3">
                {[
                  ["1", "Register endpoint", "Add URL, method, status code, interval, timeout, headers, and region."],
                  ["2", "Detect incident", "Workers confirm repeated failures and create a timeline."],
                  ["3", "Alert and publish", "Notify teams and keep status pages synced."],
                ].map(([number, title, body]) => (
                  <article key={title} className="flex gap-4 rounded-3xl border border-border bg-card p-5">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary font-mono font-bold text-primary-foreground">
                      {number}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-24 lg:px-6">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">FAQ</div>
              <h2 className="mt-4 max-w-xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                Asked before the first monitor.
              </h2>
            </div>
            <div className="divide-y divide-white/10 rounded-[1.75rem] border border-border bg-card">
              {faqs.map(([question, answer]) => (
                <article key={question} className="p-6">
                  <h3 className="text-base font-semibold tracking-tight">{question}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="px-4 pb-24 lg:px-6">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-primary/20 bg-primary p-8 text-primary-foreground sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-bold">
                  <Zap className="h-3.5 w-3.5" />
                  No credit card required
                </div>
                <h2 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                  Stop hearing about outages from customers.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Button asChild size="lg" variant="secondary" className="h-12 rounded-xl px-6 font-bold">
                  <Link href="/register">Create account</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-primary-foreground/20 bg-transparent px-6 font-bold text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href="/docs">Read docs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function HeroConsole() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-primary/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/35">
        <div className="flex h-12 items-center gap-2 border-b border-border bg-secondary/70 dark:bg-white/[0.035] px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">watcher.dev/overview</span>
          <span className="ml-auto hidden rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-200 sm:inline-flex">
            live
          </span>
        </div>
        <div className="grid gap-px bg-border lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-card p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["99.94%", "Uptime", ShieldCheck],
                ["184ms", "Latency", Clock3],
                ["8", "Failed", AlertTriangle],
              ].map(([value, label, Icon]) => (
                <div key={label as string} className="rounded-2xl border border-border bg-secondary/70 dark:bg-white/[0.035] p-4">
                  <Icon className="h-4 w-4 text-primary" />
                  <div className="mt-4 font-mono text-2xl font-semibold">{value as string}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{label as string}</div>
                </div>
              ))}
            </div>
            <FilledLatencyPanel />
          </div>
          <div className="bg-secondary p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Radio className="h-4 w-4 text-primary" />
              Live check stream
            </div>
            <div className="mt-4 space-y-2">
              {[
                ["GET", "Auth Service", "200", "138ms"],
                ["POST", "Payments API", "200", "192ms"],
                ["POST", "Worker", "503", "timeout"],
                ["GET", "Gateway", "200", "64ms"],
              ].map(([method, service, code, time]) => (
                <div key={service} className="grid grid-cols-[44px_1fr_42px_64px] gap-2 rounded-xl bg-secondary/70 dark:bg-white/[0.045] px-3 py-2 text-xs">
                  <span className="font-mono text-primary">{method}</span>
                  <span className="truncate">{service}</span>
                  <span className={code === "503" ? "font-mono text-rose-600 dark:text-rose-300" : "font-mono text-emerald-700 dark:text-emerald-300"}>{code}</span>
                  <span className="text-right font-mono text-muted-foreground">{time}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-rose-300/20 bg-rose-300/10 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-100">
                <AlertTriangle className="h-4 w-4" />
                Incident caught
              </div>
              <p className="mt-2 text-xs leading-5 text-rose-700/80 dark:text-rose-100/70">
                Notification Worker failed in eu-west-1. Slack #oncall notified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilledLatencyPanel() {
  const points = [
    "M 0 86",
    "C 44 72, 62 68, 96 74",
    "S 154 98, 192 70",
    "S 248 32, 292 46",
    "S 358 92, 412 54",
    "S 476 42, 520 62",
  ].join(" ")

  return (
    <div className="mt-4 rounded-2xl border border-border bg-secondary/70 dark:bg-black/15 p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-muted-foreground">Latency over time</span>
        <span className="font-mono text-primary">P95</span>
      </div>
      <svg viewBox="0 0 520 130" className="mt-4 h-40 w-full overflow-visible">
        <defs>
          <linearGradient id="latencyFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(143 183 255)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(143 183 255)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={`${points} L 520 130 L 0 130 Z`} fill="url(#latencyFill)" />
        <path d={points} fill="none" stroke="rgb(143 183 255)" strokeWidth="4" strokeLinecap="round" />
        {[96, 192, 292, 412, 520].map((x, index) => (
          <circle key={x} cx={x} cy={[74, 70, 46, 54, 62][index]} r="5" fill="rgb(143 183 255)" />
        ))}
      </svg>
    </div>
  )
}

function ProductCommandCenter() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/25 lg:col-span-7">
      <div className="flex items-center justify-between border-b border-border bg-secondary/70 dark:bg-white/[0.035] px-5 py-4">
        <div>
          <div className="text-sm font-semibold">Payments Infrastructure</div>
          <div className="mt-1 font-mono text-xs text-muted-foreground">api.acme.com/v2/charge</div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-100">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
          Degraded
        </div>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-[1fr_0.9fr]">
        <div className="bg-card p-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              ["99.91%", "uptime"],
              ["412ms", "p95"],
              ["3", "regions"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-border bg-secondary/70 dark:bg-white/[0.035] p-4">
                <div className="font-mono text-xl font-semibold">{value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-secondary/70 dark:bg-black/15 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">Regional health</span>
              <span className="font-mono text-primary">live</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["us-east-1", "200 OK", "192ms", "w-[78%]", "bg-emerald-300"],
                ["eu-west-1", "503 ERR", "timeout", "w-[34%]", "bg-rose-300"],
                ["ap-south-1", "200 OK", "241ms", "w-[62%]", "bg-primary"],
              ].map(([region, code, latency, width, color]) => (
                <div key={region} className="grid grid-cols-[86px_1fr_74px] items-center gap-3 text-xs">
                  <span className="font-mono text-muted-foreground">{region}</span>
                  <div className="h-2 rounded-full bg-muted dark:bg-white/[0.06]">
                    <div className={`h-full rounded-full ${color} ${width}`} />
                  </div>
                  <span className={code === "503 ERR" ? "text-right font-mono text-rose-600 dark:text-rose-200" : "text-right font-mono text-muted-foreground"}>
                    {latency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-secondary p-5">
          <div className="text-sm font-semibold">Incident timeline</div>
          <div className="mt-5 space-y-4">
            {[
              ["14:18", "Watcher detected 3 failed checks from eu-west-1."],
              ["14:19", "Slack #oncall notified and incident opened."],
              ["14:24", "Payments team acknowledged, investigating upstream provider."],
              ["14:31", "Public status page updated to degraded performance."],
            ].map(([time, event], index) => (
              <div key={time} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={index === 0 ? "h-2.5 w-2.5 rounded-full bg-rose-300" : "h-2.5 w-2.5 rounded-full bg-primary"} />
                  {index < 3 && <span className="mt-2 h-10 w-px bg-border" />}
                </div>
                <div className="-mt-1">
                  <div className="font-mono text-xs text-primary">{time}</div>
                  <div className="mt-1 text-sm leading-5 text-muted-foreground">{event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  const groups = [
    {
      title: "Product",
      links: [
        ["Dashboard", "/dashboard"],
        ["Monitors", "/monitors"],
        ["Incidents", "/incidents"],
        ["Status Pages", "/status-pages"],
        ["Analytics", "/analytics"],
      ],
    },
    {
      title: "Resources",
      links: [
        ["Documentation", "/docs"],
        ["API Reference", "/docs"],
        ["Public Status", "/status/acme-cloud"],
        ["FAQ", "#faq"],
      ],
    },
    {
      title: "Workspace",
      links: [
        ["Projects", "/projects"],
        ["Alerts", "/alerts"],
        ["Settings", "/settings"],
        ["Create Monitor", "/monitors/new"],
        ["Login", "/login"],
      ],
    },
    {
      title: "Company",
      links: [
        ["Security", "/docs"],
        ["Changelog", "/docs"],
        ["Support", "mailto:support@watcher.dev"],
        ["Contact", "mailto:hello@watcher.dev"],
      ],
    },
  ]

  return (
    <footer className="border-t border-border bg-secondary/60 px-4 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 py-14 md:grid-cols-[1.2fr_2fr]">
        <div>
          <WatcherLogo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Open-source API monitoring for teams that need uptime, latency, incidents, alerts, and public status pages in one focused workspace.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            All Watcher systems operational
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-foreground">{group.title}</div>
              <ul className="mt-4 space-y-3">
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>Copyright 2026 Watcher. All rights reserved.</div>
          <div className="flex flex-wrap gap-4">
            <Link href="/docs" className="hover:text-foreground">Privacy</Link>
            <Link href="/docs" className="hover:text-foreground">Terms</Link>
            <Link href="/docs" className="hover:text-foreground">Security</Link>
            <Link href="https://github.com" className="inline-flex items-center gap-1 hover:text-foreground" aria-label="Developer GitHub">
              <Github className="h-3.5 w-3.5" />
              Developer GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

