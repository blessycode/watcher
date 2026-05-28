"use client"

import { AlertTriangle, CheckCircle2, Clock, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { IncidentStatusBadge, SeverityBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { getIncidents, resolveIncident } from "@/lib/api"
import type { Incident } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [severity, setSeverity] = useState("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [note, setNote] = useState("Resolved from Watcher console.")
  const [error, setError] = useState("")

  async function load() {
    try {
      setIncidents(await getIncidents())
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load incidents")
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => incidents.filter((incident) => `${incident.id} ${incident.title} ${incident.reason} ${incident.root_cause}`.toLowerCase().includes(query.toLowerCase()) && (status === "all" || incident.status === status) && (severity === "all" || incident.severity === severity)), [incidents, query, severity, status])
  const selected = incidents.find((incident) => incident.id === selectedId)
  const open = incidents.filter((incident) => incident.status !== "resolved").length
  const resolved = incidents.length - open

  async function resolveSelected() {
    if (!selected) return
    const updated = await resolveIncident(selected.id, note)
    setIncidents((current) => current.map((incident) => incident.id === updated.id ? updated : incident))
  }

  return (
    <div>
      <PageHeader title="Incidents" description="Manage outages from first failed check to resolution." />
      <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <SummaryCard icon={AlertTriangle} iconColor="text-red-400" label="Open incidents" value={open.toString()} sub="Needs attention" />
        <SummaryCard icon={CheckCircle2} iconColor="text-emerald-400" label="Resolved incidents" value={resolved.toString()} sub="All time" />
        <SummaryCard icon={Clock} iconColor="text-muted-foreground" label="Total incidents" value={incidents.length.toString()} sub="From database" />
      </div>
      {error && <div className="mb-3 rounded border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}
      <div className="mb-3 flex flex-col gap-2 lg:flex-row">
        <div className="relative max-w-sm flex-1"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-8 w-full rounded border border-border bg-background pl-8 pr-3 text-xs outline-none" placeholder="Search incidents..." /></div>
        <Segment value={status} onChange={setStatus} options={["all", "investigating", "identified", "monitoring", "resolved"]} />
        <Segment value={severity} onChange={setSeverity} options={["all", "critical", "high", "medium", "low"]} />
      </div>
      <div className="overflow-hidden rounded border border-border bg-card">
        <div className="divide-y divide-border">
          {filtered.map((incident) => <button key={incident.id} onClick={() => setSelectedId(incident.id)} className="block w-full px-3.5 py-3 text-left hover:bg-accent/60"><div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><SeverityBadge severity={incident.severity} /><IncidentStatusBadge status={incident.status} /><span className="font-mono text-[10px] text-muted-foreground">{incident.id}</span></div><h3 className="mt-1.5 text-[13px] font-semibold">{incident.title}</h3><div className="mt-1 text-[11px] text-muted-foreground">{incident.reason || "No reason recorded"}</div><div className="mt-0.5 text-[10px] text-muted-foreground">Root cause: <span className="text-foreground">{incident.root_cause || "pending"}</span></div></div><div className="shrink-0 text-[10px] lg:text-right"><div className="text-muted-foreground">Started</div><div className="font-mono">{new Date(incident.started_at).toLocaleString()}</div><div className="mt-1 text-muted-foreground">Resolved</div><div className="font-semibold">{incident.resolved_at ? new Date(incident.resolved_at).toLocaleString() : "open"}</div></div></div></button>)}
        </div>
        {!filtered.length && <div className="p-8 text-center text-xs text-muted-foreground">No incidents found.</div>}
      </div>
      <Drawer open={Boolean(selected)} onOpenChange={(value) => !value && setSelectedId(null)}>
        <DrawerContent>{selected && <div className="mx-auto w-full max-w-3xl p-4"><DrawerHeader className="px-0"><div className="flex flex-wrap items-center gap-2"><SeverityBadge severity={selected.severity} /><IncidentStatusBadge status={selected.status} /><span className="font-mono text-xs text-muted-foreground">{selected.id}</span></div><DrawerTitle className="mt-2">{selected.title}</DrawerTitle></DrawerHeader><div className="grid gap-4 md:grid-cols-[1fr_280px]"><div className="rounded border border-border bg-card p-3"><div className="text-xs font-semibold">Resolution note</div><Textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 min-h-24 text-xs" /><div className="mt-2 flex justify-end"><Button size="sm" onClick={resolveSelected} disabled={selected.status === "resolved"}>Resolve incident</Button></div></div><aside className="rounded border border-border bg-card p-3 text-xs"><div className="font-semibold">Incident details</div><dl className="mt-3 space-y-2"><Detail label="Status" value={selected.status} /><Detail label="Severity" value={selected.severity} /><Detail label="Started" value={new Date(selected.started_at).toLocaleString()} /><Detail label="Reason" value={selected.reason || "-"} /><Detail label="Root cause" value={selected.root_cause || "pending"} /></dl></aside></div></div>}</DrawerContent>
      </Drawer>
    </div>
  )
}

function Segment({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <div className="flex flex-wrap gap-1.5">{options.map((option) => <button key={option} onClick={() => onChange(option)} className={`h-8 rounded border px-2.5 text-[11px] capitalize ${value === option ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent"}`}>{option}</button>)}</div>
}

function SummaryCard({ icon: Icon, iconColor, label, value, sub }: any) {
  return <div className="rounded border border-border bg-card p-3.5"><div className="flex items-center justify-between"><div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div><Icon className={cn("h-3.5 w-3.5", iconColor)} /></div><div className="mt-1.5 text-[20px] font-bold">{value}</div><div className="text-[10px] text-muted-foreground">{sub}</div></div>
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt><dd className="mt-0.5">{value}</dd></div>
}
