"use client"

import { AlertTriangle, CheckCircle2, Clock, Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { IncidentStatusBadge, SeverityBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { incidents as seedIncidents } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState(seedIncidents)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [severity, setSeverity] = useState("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [note, setNote] = useState("Root cause confirmed and mitigation deployed.")

  const filtered = useMemo(() => {
    return incidents.filter((incident) => {
      const haystack = `${incident.id} ${incident.title} ${incident.service} ${incident.rootCause}`.toLowerCase()
      return (
        haystack.includes(query.toLowerCase()) &&
        (status === "all" || incident.status === status) &&
        (severity === "all" || incident.severity === severity)
      )
    })
  }, [incidents, query, severity, status])

  const selected = incidents.find((incident) => incident.id === selectedId)
  const open = incidents.filter((incident) => incident.status !== "resolved").length
  const resolved = incidents.length - open

  function resolveSelected() {
    if (!selected) return
    setIncidents((current) =>
      current.map((incident) =>
        incident.id === selected.id
          ? {
              ...incident,
              status: "resolved",
              rootCause: note,
              timeline: [...incident.timeline, { time: "Now", message: `Resolved: ${note}` }],
            }
          : incident,
      ),
    )
  }

  return (
    <div>
      <PageHeader
        title="Incidents"
        description="Manage outages from first failed check to customer-facing resolution."
        actions={
          <Button
            size="sm"
            className="h-7 rounded px-3 text-[11px]"
            onClick={() =>
              setIncidents((current) => [
                {
                  id: `INC-${Math.floor(Math.random() * 9000) + 1000}`,
                  title: "Manual investigation opened",
                  severity: "medium",
                  status: "investigating",
                  service: "Public Gateway",
                  affected: ["Core Banking APIs", "global"],
                  rootCause: "Manual incident created by operator",
                  startedAt: "just now",
                  duration: "0m",
                  timeline: [{ time: "Now", message: "Incident created from Watcher console" }],
                },
                ...current,
              ])
            }
          >
            <Plus className="mr-1 h-3 w-3" /> Create incident
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <SummaryCard icon={AlertTriangle} iconColor="text-red-400" label="Open incidents" value={open.toString()} sub="Needs owner attention" />
        <SummaryCard icon={CheckCircle2} iconColor="text-emerald-400" label="Resolved incidents" value={resolved.toString()} sub="Last 30 days" />
        <SummaryCard icon={Clock} iconColor="text-muted-foreground" label="Mean time to recovery" value="24m" sub="-8m vs. last month" />
      </div>

      <div className="mb-3 flex flex-col gap-2 lg:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-8 w-full rounded border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="Search incidents..."
          />
        </div>
        <Segment value={status} onChange={setStatus} options={["all", "investigating", "identified", "monitoring", "resolved"]} />
        <Segment value={severity} onChange={setSeverity} options={["all", "critical", "high", "medium", "low"]} />
      </div>

      <div className="overflow-hidden rounded border border-border bg-card">
        <div className="divide-y divide-border">
          {filtered.map((incident) => (
            <button
              key={incident.id}
              onClick={() => setSelectedId(incident.id)}
              className="block w-full px-3.5 py-3 text-left transition-colors hover:bg-accent/60"
            >
              <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={incident.severity} />
                    <IncidentStatusBadge status={incident.status} />
                    <span className="font-mono text-[10px] text-muted-foreground">{incident.id}</span>
                  </div>
                  <h3 className="mt-1.5 text-[13px] font-semibold text-foreground">{incident.title}</h3>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    Affected: <span className="font-medium text-foreground">{incident.service}</span> · {incident.affected.join(", ")}
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    Root cause: <span className="font-medium text-foreground">{incident.rootCause}</span>
                  </div>
                </div>
                <div className="shrink-0 text-left text-[10px] lg:text-right">
                  <div className="text-muted-foreground">Started</div>
                  <div className="font-mono text-foreground">{incident.startedAt}</div>
                  <div className="mt-1 text-muted-foreground">Duration</div>
                  <div className="font-semibold text-foreground">{incident.duration}</div>
                </div>
              </div>

              <div className="mt-2.5 space-y-1 border-l border-border pl-3">
                {incident.timeline.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex gap-2.5 text-[10px]">
                    <span className="w-10 shrink-0 font-mono text-muted-foreground">{item.time}</span>
                    <span className="text-foreground">{item.message}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Drawer open={Boolean(selected)} onOpenChange={(value) => !value && setSelectedId(null)}>
        <DrawerContent>
          {selected && (
            <div className="mx-auto w-full max-w-3xl p-4">
              <DrawerHeader className="px-0">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={selected.severity} />
                  <IncidentStatusBadge status={selected.status} />
                  <span className="font-mono text-xs text-muted-foreground">{selected.id}</span>
                </div>
                <DrawerTitle className="mt-2">{selected.title}</DrawerTitle>
              </DrawerHeader>
              <div className="grid gap-4 md:grid-cols-[1fr_280px]">
                <div className="space-y-3">
                  <div className="rounded border border-border bg-card p-3">
                    <div className="text-xs font-semibold">Timeline</div>
                    <div className="mt-3 space-y-2 border-l border-border pl-3">
                      {selected.timeline.map((item, index) => (
                        <div key={index} className="text-xs">
                          <div className="font-mono text-[10px] text-muted-foreground">{item.time}</div>
                          <div className="text-foreground">{item.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded border border-border bg-card p-3">
                    <div className="text-xs font-semibold">Resolution note</div>
                    <Textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 min-h-24 text-xs" />
                    <div className="mt-2 flex justify-end">
                      <Button size="sm" onClick={resolveSelected} disabled={selected.status === "resolved"}>
                        Resolve incident
                      </Button>
                    </div>
                  </div>
                </div>
                <aside className="rounded border border-border bg-card p-3 text-xs">
                  <div className="font-semibold">Incident details</div>
                  <dl className="mt-3 space-y-2">
                    <Detail label="Service" value={selected.service} />
                    <Detail label="Status" value={selected.status} />
                    <Detail label="Severity" value={selected.severity} />
                    <Detail label="Started" value={selected.startedAt} />
                    <Detail label="Duration" value={selected.duration} />
                    <Detail label="Root cause" value={selected.rootCause} />
                  </dl>
                </aside>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function Segment({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`h-8 rounded border px-2.5 text-[11px] capitalize transition-colors ${
            value === option
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

function SummaryCard({ icon: Icon, iconColor, label, value, sub }: any) {
  return (
    <div className="rounded border border-border bg-card p-3.5 transition-all hover:border-primary/20">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className={cn("h-3.5 w-3.5", iconColor)} />
      </div>
      <div className="mt-1.5 text-[20px] font-bold tracking-tight text-foreground">{value}</div>
      <div className="mt-0.5 text-[10px] text-muted-foreground">{sub}</div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  )
}
