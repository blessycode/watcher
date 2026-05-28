import Link from "next/link"
import { ChevronRight, Search, BookOpen, Code2, Zap, Bell, Shield, Globe, ArrowRight } from "lucide-react"
import { WatcherLogo } from "@/components/watcher-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const sections = [
  {
    icon: Zap,
    title: "Getting Started",
    items: ["Quickstart", "Install the CLI", "Create your first monitor", "Connect a project"],
  },
  {
    icon: Globe,
    title: "Monitors",
    items: ["HTTP checks", "TCP / DNS checks", "Multi-region probes", "Assertions and timeouts"],
  },
  {
    icon: Bell,
    title: "Alerts & Incidents",
    items: ["Alert channels", "Notification rules", "Escalation policies", "Status page subscribers"],
  },
  {
    icon: Code2,
    title: "API & SDK",
    items: ["REST API reference", "TypeScript SDK", "Webhooks", "Monitors-as-code"],
  },
  {
    icon: Shield,
    title: "Security",
    items: ["Authentication", "Audit logs", "SOC 2 compliance", "IP allowlist"],
  },
  {
    icon: BookOpen,
    title: "Guides",
    items: ["SLA tracking", "On-call workflows", "Public status pages", "Migrating from Pingdom"],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-6xl flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-6">
            <Link href="/"><WatcherLogo /></Link>
            <span className="text-sm text-muted-foreground hidden sm:inline">/ Docs</span>
          </div>
          <Button asChild size="sm" variant="outline" className="bg-transparent">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </header>

      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 lg:px-6 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-balance">
            Watcher Documentation
          </h1>
          <p className="mt-3 text-muted-foreground text-pretty">
            Everything you need to monitor APIs, surface incidents, and keep status pages humming.
          </p>
          <div className="mt-7 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 h-10" placeholder="Search the docs… (e.g. webhooks, SLA, regions)" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 lg:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.title} className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="font-semibold">{s.title}</div>
                </div>
                <ul className="mt-4 space-y-2">
                  {s.items.map((it) => (
                    <li key={it}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 group"
                      >
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                        {it}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-10">
              <div className="text-xs uppercase tracking-wider text-primary font-semibold">Quickstart</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Get running in 60 seconds</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Install the CLI, log in, and create your first monitor. Watcher will start probing your endpoint immediately.
              </p>
              <Button asChild className="mt-5">
                <Link href="#">Read the quickstart <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="bg-[#0f172a] text-slate-200 p-6 lg:p-8 font-mono text-[12.5px] leading-relaxed">
              <pre className="whitespace-pre-wrap">
                <span className="text-slate-500"># Install the Watcher CLI</span>
                {"\n"}
                <span className="text-emerald-300">$</span> npm install -g @watcher/cli
                {"\n\n"}
                <span className="text-slate-500"># Authenticate</span>
                {"\n"}
                <span className="text-emerald-300">$</span> watcher login
                {"\n\n"}
                <span className="text-slate-500"># Create your first monitor</span>
                {"\n"}
                <span className="text-emerald-300">$</span> watcher monitor create \\
                {"\n  "}--name <span className="text-emerald-300">{"'Payments API'"}</span> \\
                {"\n  "}--url <span className="text-emerald-300">{"'https://api.acme.com/health'"}</span> \\
                {"\n  "}--interval 30s
                {"\n\n"}
                <span className="text-blue-300">✓</span> Monitor created · checks running every 30s
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
