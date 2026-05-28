"use client"

import Link from "next/link"
import { Folder, Plus, Search, Trash2, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProject, deleteProject, getMonitors, getProjects } from "@/lib/api"
import type { Monitor, Project } from "@/lib/types"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [query, setQuery] = useState("")
  const [environment, setEnvironment] = useState("all")
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [draft, setDraft] = useState({ name: "", slug: "", description: "", environment: "production" })

  async function load() {
    try {
      const [projectData, monitorData] = await Promise.all([getProjects(), getMonitors()])
      setProjects(projectData)
      setMonitors(monitorData)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load projects")
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => projects.filter((project) => `${project.name} ${project.description} ${project.slug}`.toLowerCase().includes(query.toLowerCase()) && (environment === "all" || project.environment === environment)), [environment, projects, query])

  async function submit() {
    const project = await createProject(draft)
    setProjects((current) => [project, ...current])
    setDraft({ name: "", slug: "", description: "", environment: "production" })
    setOpen(false)
  }

  async function remove(id: string) {
    await deleteProject(id)
    setProjects((current) => current.filter((project) => project.id !== id))
  }

  return (
    <div>
      <PageHeader title="Projects" description="Group monitors into products, teams, environments, and SLA boundaries." actions={<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button size="sm" className="h-7 rounded px-3 text-[11px]"><Plus className="mr-1 h-3 w-3" /> Create Project</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Create project</DialogTitle></DialogHeader><div className="space-y-3"><Field label="Project name" value={draft.name} onChange={(name) => setDraft((d) => ({ ...d, name, slug: d.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }))} /><Field label="Slug" value={draft.slug} onChange={(slug) => setDraft((d) => ({ ...d, slug }))} mono /><Field label="Description" value={draft.description} onChange={(description) => setDraft((d) => ({ ...d, description }))} /><div className="space-y-1.5"><Label>Environment</Label><Select value={draft.environment} onValueChange={(value) => setDraft((d) => ({ ...d, environment: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="production">Production</SelectItem><SelectItem value="staging">Staging</SelectItem><SelectItem value="development">Development</SelectItem></SelectContent></Select></div><div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Create project</Button></div></div></DialogContent></Dialog>} />
      <div className="mb-3 flex flex-col gap-2 sm:flex-row">
        <div className="relative max-w-sm flex-1"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-8 w-full rounded border border-border bg-background pl-8 pr-3 text-xs outline-none" placeholder="Search projects..." /></div>
        <Segment value={environment} onChange={setEnvironment} options={["all", "production", "staging", "development"]} />
      </div>
      {error && <div className="mb-3 rounded border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}
      {filtered.length ? <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((project) => {
        const projectMonitors = monitors.filter((monitor) => monitor.project_id === project.id)
        const uptime = projectMonitors.length ? Math.round(projectMonitors.reduce((sum, monitor) => sum + monitor.uptime_percentage, 0) / projectMonitors.length * 100) / 100 : 100
        return <article key={project.id} className="group rounded border border-border bg-card p-3.5 transition-all hover:border-primary/20 hover:bg-accent/40"><div className="flex items-start justify-between gap-2"><Link href="/monitors" className="flex min-w-0 items-center gap-2.5"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/10 text-primary"><Folder className="h-3.5 w-3.5" /></div><div className="min-w-0"><div className="truncate text-[12px] font-semibold group-hover:text-primary">{project.name}</div><div className="font-mono text-[10px] text-muted-foreground">/{project.slug}</div></div></Link><button onClick={() => remove(project.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></div><p className="mt-2.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">{project.description || "No description"}</p><div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3"><Stat label="Monitors" value={projectMonitors.length} /><Stat label="Uptime" value={`${uptime}%`} /><Stat label="Env" value={project.environment} small /></div><div className="mt-3 text-[10px] text-muted-foreground">Updated {new Date(project.updated_at).toLocaleString()}</div></article>
      })}</div> : <div className="rounded border border-border bg-card p-10 text-center"><X className="mx-auto h-5 w-5 text-muted-foreground" /><div className="mt-3 text-sm font-semibold">No projects found</div><p className="mt-1 text-xs text-muted-foreground">Create a project to start adding monitors.</p></div>}
    </div>
  )
}

function Segment({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <div className="flex flex-wrap gap-1.5">{options.map((option) => <button key={option} onClick={() => onChange(option)} className={`h-8 rounded border px-2.5 text-[11px] capitalize ${value === option ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:bg-accent"}`}>{option}</button>)}</div>
}

function Stat({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return <div><div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div><div className={`mt-0.5 truncate font-semibold tabular-nums ${small ? "text-[10px]" : "text-[12px]"}`}>{value}</div></div>
}

function Field({ label, value, onChange, mono }: { label: string; value: string; onChange: (value: string) => void; mono?: boolean }) {
  return <div className="space-y-1.5"><Label>{label}</Label><Input value={value} onChange={(event) => onChange(event.target.value)} className={mono ? "font-mono" : undefined} /></div>
}
