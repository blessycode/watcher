"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { AlertTriangle, Bell, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { WatcherLogo } from "@/components/watcher-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UptimeBars } from "@/components/uptime-bars"
import { getPublicStatusPage } from "@/lib/api"
import type { Incident, Monitor, StatusPage } from "@/lib/types"

export default function PublicStatusPage() {
  const params = useParams<{ slug: string }>()
  const [page, setPage] = useState<StatusPage | null>(null)
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    getPublicStatusPage(params.slug).then((data: any) => {
      setPage(data.page)
      setMonitors(data.monitors)
      setIncidents(data.incidents)
    }).catch((err) => setError(err instanceof Error ? err.message : "Status page not found"))
  }, [params.slug])

  if (error) return <div className="min-h-screen bg-background p-10 text-center">{error}</div>
  if (!page) return <div className="min-h-screen bg-background p-10 text-center text-muted-foreground">Loading status page...</div>

  const allOk = monitors.every((monitor) => monitor.status === "operational" || monitor.status === "unknown")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border"><div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 lg:px-6"><Link href="/" className="font-semibold">{page.name}</Link><div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">Powered by <WatcherLogo /></div></div></header>
      <section className="mx-auto max-w-4xl px-4 py-10 lg:px-6 lg:py-14">
        <div className={`rounded-2xl border p-6 ${allOk ? "border-blue-200 bg-blue-50/60" : "border-blue-200 bg-blue-50/60"}`}><div className="flex items-center gap-3">{allOk ? <CheckCircle2 className="h-6 w-6 text-blue-600" /> : <AlertTriangle className="h-6 w-6 text-blue-600" />}<div><div className={`text-lg font-semibold ${allOk ? "text-blue-900" : "text-blue-900"}`}>{allOk ? "All systems operational" : "Some systems experiencing issues"}</div><div className="text-xs text-muted-foreground">Last updated {new Date(page.updated_at).toLocaleString()}</div></div></div></div>
        <div className="mt-10"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-base font-semibold">Current status</h2><p className="text-xs text-muted-foreground">90-day uptime per service</p></div><Button variant="outline" size="sm"><Bell className="mr-1.5 h-3.5 w-3.5" /> Subscribe</Button></div><div className="divide-y divide-border rounded-xl border border-border bg-card">{monitors.map((monitor) => <div key={monitor.id} className="px-5 py-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2.5"><span className={`h-2 w-2 rounded-full ${monitor.status === "operational" ? "bg-blue-500" : monitor.status === "degraded" ? "bg-blue-400" : "bg-red-500"}`} /><span className="text-sm font-medium">{monitor.name}</span></div><span className="text-xs font-medium capitalize">{monitor.status}</span></div><div className="mt-3"><UptimeBars className="h-7" /><div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground"><span>90 days ago</span><span className="tabular-nums">{monitor.uptime_percentage}% uptime</span><span>Today</span></div></div></div>)}</div></div>
        <div className="mt-10"><h2 className="mb-3 text-base font-semibold">Recent incidents</h2><div className="space-y-3">{incidents.map((incident) => <div key={incident.id} className="rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between gap-3"><div className="font-medium">{incident.title}</div><span className="text-[10px] font-semibold uppercase tracking-wider">{incident.status}</span></div><div className="mt-0.5 text-xs text-muted-foreground">{new Date(incident.started_at).toLocaleString()}</div><p className="mt-2 text-sm text-muted-foreground">{incident.reason || incident.root_cause || "No update posted."}</p></div>)}</div>{!incidents.length && <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">No incidents reported.</div>}</div>
        <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-6 text-center"><h3 className="text-base font-semibold">Get notified about incidents</h3><p className="mt-1 text-xs text-muted-foreground">Subscribe via email. Unsubscribe at any time.</p><form className="mx-auto mt-4 flex max-w-md flex-col gap-2 sm:flex-row"><Input type="email" placeholder="you@company.com" className="flex-1" /><Button type="submit">Subscribe</Button></form></div>
      </section>
    </div>
  )
}
