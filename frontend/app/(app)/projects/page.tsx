"use client"

import Link from "next/link"
import { Folder, Plus, Search, X } from "lucide-react"
import { useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { projects as seedProjects } from "@/lib/mock-data"

export default function ProjectsPage() {
  const [projects, setProjects] = useState(seedProjects)
  const [query, setQuery] = useState("")
  const [environment, setEnvironment] = useState("all")
  const [status, setStatus] = useState("all")
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({
    name: "Fraud Decisioning",
    slug: "fraud-decisioning",
    description: "Risk scoring and fraud checks for card and ACH payment flows.",
    environment: "production",
  })

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery = `${project.name} ${project.description} ${project.owner} ${project.slug}`.toLowerCase().includes(query.toLowerCase())
      const matchesEnvironment = environment === "all" || project.environment === environment
      const matchesStatus = status === "all" || project.status === status
      return matchesQuery && matchesEnvironment && matchesStatus
    })
  }, [environment, projects, query, status])

  function createProject() {
    setProjects((current) => [
      {
        id: `proj_mock_${Date.now()}`,
        ...draft,
        monitors: 0,
        uptime: 100,
        incidents: 0,
        status: "operational",
        owner: "Jordan Davis",
        lastCheck: "not checked",
      },
      ...current,
    ])
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Group monitors into products, teams, environments, and SLA boundaries."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 rounded px-3 text-[11px]">
                <Plus className="mr-1 h-3 w-3" /> Create Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create project</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Field label="Project name" value={draft.name} onChange={(name) => setDraft((d) => ({ ...d, name }))} />
                <Field label="Slug" value={draft.slug} onChange={(slug) => setDraft((d) => ({ ...d, slug }))} mono />
                <Field label="Description" value={draft.description} onChange={(description) => setDraft((d) => ({ ...d, description }))} />
                <div className="space-y-1.5">
                  <Label>Environment</Label>
                  <Select value={draft.environment} onValueChange={(value) => setDraft((d) => ({ ...d, environment: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={createProject}>Create project</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-8 w-full rounded border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/70 outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="Search projects..."
          />
        </div>
        <Segment value={environment} onChange={setEnvironment} options={["all", "production", "staging", "development"]} />
        <Segment value={status} onChange={setStatus} options={["all", "operational", "degraded", "down"]} />
      </div>

      {filtered.length ? (
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <article
              key={project.id}
              className="group rounded border border-border bg-card p-3.5 transition-all hover:border-primary/20 hover:bg-accent/40"
            >
              <div className="flex items-start justify-between gap-2">
                <Link href="/monitors" className="flex min-w-0 items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                    <Folder className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-semibold text-foreground transition-colors group-hover:text-primary">
                      {project.name}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">/{project.slug}</div>
                  </div>
                </Link>
                <StatusBadge status={project.status} />
              </div>

              <p className="mt-2.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{project.description}</p>

              <div className="mt-3 grid grid-cols-4 gap-2 border-t border-border pt-3">
                <Stat label="Monitors" value={project.monitors} />
                <Stat label="Uptime" value={`${project.uptime}%`} />
                <Stat label="Incidents" value={project.incidents} />
                <Stat label="Env" value={project.environment} small />
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{project.owner}</span>
                <span>Last check {project.lastCheck}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded border border-border bg-card p-10 text-center">
          <X className="mx-auto h-5 w-5 text-muted-foreground" />
          <div className="mt-3 text-sm font-semibold">No projects found</div>
          <p className="mt-1 text-xs text-muted-foreground">Adjust your filters or create a new project.</p>
        </div>
      )}
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

function Stat({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 truncate font-semibold tabular-nums text-foreground ${small ? "text-[10px]" : "text-[12px]"}`}>{value}</div>
    </div>
  )
}

function Field({ label, value, onChange, mono }: { label: string; value: string; onChange: (value: string) => void; mono?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} className={mono ? "font-mono" : undefined} />
    </div>
  )
}
