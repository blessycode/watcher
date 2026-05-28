import Link from "next/link"
import { CheckCircle2, AlertTriangle, Bell } from "lucide-react"
import { WatcherLogo } from "@/components/watcher-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UptimeBars } from "@/components/uptime-bars"
import { statusPages } from "@/lib/mock-data"
import { notFound } from "next/navigation"

const services = [
  { name: "API Gateway", uptime: 99.99, status: "operational" },
  { name: "Authentication Service", uptime: 99.97, status: "operational" },
  { name: "Payments API", uptime: 99.94, status: "operational" },
  { name: "Notifications Worker", uptime: 96.21, status: "down" },
  { name: "Customer Portal", uptime: 99.82, status: "degraded" },
  { name: "Admin Dashboard", uptime: 99.95, status: "operational" },
]

const recentIncidents = [
  {
    title: "Notifications worker timeouts",
    date: "May 28, 2026 · 14:18 UTC",
    status: "investigating",
    update: "We&apos;re aware of elevated 503s on the notifications worker. Engineers are investigating.",
  },
  {
    title: "Resolved: Payments API elevated latency",
    date: "May 27, 2026 · 09:42 UTC",
    status: "resolved",
    update: "A misbehaving deployment was rolled back. Latency has returned to baseline.",
  },
  {
    title: "Resolved: Auth service partial outage",
    date: "May 24, 2026 · 03:11 UTC",
    status: "resolved",
    update: "Issue traced to a downstream provider. We&apos;ve added redundancy.",
  },
]

export default async function PublicStatusPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = statusPages.find((s) => s.slug === slug)
  if (!page) notFound()

  const allOk = services.every((s) => s.status === "operational")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 lg:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-foreground">{page.name}</Link>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            Powered by <WatcherLogo />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 lg:px-6 py-10 lg:py-14">
        <div
          className={`rounded-2xl p-6 border ${
            allOk
              ? "bg-emerald-50/60 border-emerald-200"
              : "bg-amber-50/60 border-amber-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {allOk ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            )}
            <div>
              <div className={`text-lg font-semibold ${allOk ? "text-emerald-900" : "text-amber-900"}`}>
                {allOk ? "All systems operational" : "Some systems experiencing issues"}
              </div>
              <div className={`text-xs ${allOk ? "text-emerald-700/80" : "text-amber-800/80"}`}>
                Last updated {page.updatedAt}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Current status</h2>
              <p className="text-xs text-muted-foreground">90-day uptime per service</p>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent">
              <Bell className="h-3.5 w-3.5 mr-1.5" /> Subscribe
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {services.map((s) => (
              <div key={s.name} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        s.status === "operational"
                          ? "bg-emerald-500"
                          : s.status === "degraded"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium text-sm">{s.name}</span>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      s.status === "operational"
                        ? "text-emerald-700"
                        : s.status === "degraded"
                          ? "text-amber-700"
                          : "text-red-700"
                    }`}
                  >
                    {s.status === "operational"
                      ? "Operational"
                      : s.status === "degraded"
                        ? "Degraded"
                        : "Outage"}
                  </span>
                </div>
                <div className="mt-3">
                  <UptimeBars className="h-7" />
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>90 days ago</span>
                    <span className="tabular-nums">{s.uptime}% uptime</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-base font-semibold mb-3">Recent incidents</h2>
          <div className="space-y-3">
            {recentIncidents.map((i) => (
              <div key={i.title} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{i.title}</div>
                  <span
                    className={`text-[10px] uppercase font-semibold tracking-wider ${
                      i.status === "resolved" ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {i.status}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{i.date}</div>
                <p className="mt-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: i.update }} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-6 text-center">
          <h3 className="text-base font-semibold">Get notified about incidents</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Subscribe via email. Unsubscribe at any time.
          </p>
          <form className="mt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input type="email" placeholder="you@company.com" className="flex-1" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>

      <footer className="border-t border-border mt-10">
        <div className="mx-auto max-w-4xl px-4 lg:px-6 py-5 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 {page.name}</span>
          <span>Status powered by Watcher</span>
        </div>
      </footer>
    </div>
  )
}
