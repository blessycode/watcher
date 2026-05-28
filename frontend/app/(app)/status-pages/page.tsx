"use client"

import Link from "next/link"
import { Plus, Copy, ExternalLink, Globe, Lock } from "lucide-react"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createStatusPage, getProjects, getStatusPages } from "@/lib/api"
import type { Project, StatusPage } from "@/lib/types"

export default function StatusPagesPage() {
  const [pages, setPages] = useState<StatusPage[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ project_id: "", name: "", slug: "", is_public: true })
  const [error, setError] = useState("")

  async function load() {
    try {
      const [pageData, projectData] = await Promise.all([getStatusPages(), getProjects()])
      setPages(pageData)
      setProjects(projectData)
      if (projectData[0]) setDraft((current) => ({ ...current, project_id: current.project_id || projectData[0].id }))
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load status pages")
    }
  }

  useEffect(() => { load() }, [])

  async function submit() {
    const page = await createStatusPage(draft)
    setPages((current) => [page, ...current])
    setOpen(false)
  }

  const projectName = (id: string) => projects.find((project) => project.id === id)?.name ?? id

  return (
    <div>
      <PageHeader title="Status Pages" description="Public and internal status pages for your services." actions={<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button size="sm" className="h-9"><Plus className="mr-1.5 h-4 w-4" /> Create status page</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Create status page</DialogTitle></DialogHeader><div className="space-y-3"><Field label="Name"><Input value={draft.name} onChange={(event) => setDraft((d) => ({ ...d, name: event.target.value, slug: d.slug || event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }))} /></Field><Field label="Slug"><Input value={draft.slug} onChange={(event) => setDraft((d) => ({ ...d, slug: event.target.value }))} className="font-mono" /></Field><Field label="Project"><Select value={draft.project_id} onValueChange={(value) => setDraft((d) => ({ ...d, project_id: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}</SelectContent></Select></Field><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Create</Button></div></div></DialogContent></Dialog>} />
      {error && <div className="mb-3 rounded border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground"><th className="px-4 py-2.5 text-left font-medium">Status page</th><th className="px-4 py-2.5 text-left font-medium">Project</th><th className="px-4 py-2.5 text-left font-medium">Visibility</th><th className="px-4 py-2.5 text-right font-medium">Subscribers</th><th className="px-4 py-2.5 text-right font-medium">Overall</th><th className="px-4 py-2.5 text-right font-medium">Updated</th><th className="px-4 py-2.5 text-right font-medium">Actions</th></tr></thead><tbody className="divide-y divide-border">{pages.map((page) => <tr key={page.id} className="hover:bg-accent/30"><td className="px-4 py-3"><div className="font-medium">{page.name}</div><div className="font-mono text-[11px] text-muted-foreground">/status/{page.slug}</div></td><td className="px-4 py-3 text-muted-foreground">{projectName(page.project_id)}</td><td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">{page.is_public ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}{page.is_public ? "public" : "private"}</span></td><td className="px-4 py-3 text-right tabular-nums">{page.subscribers.toLocaleString()}</td><td className="px-4 py-3 text-right tabular-nums">{page.overall_status}</td><td className="px-4 py-3 text-right text-xs text-muted-foreground">{new Date(page.updated_at).toLocaleString()}</td><td className="px-4 py-3 text-right"><div className="inline-flex gap-1"><Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => navigator.clipboard?.writeText(`${location.origin}/status/${page.slug}`)}><Copy className="h-3.5 w-3.5" /></Button><Button asChild variant="ghost" size="sm" className="h-8 px-2"><Link href={`/status/${page.slug}`}><ExternalLink className="h-3.5 w-3.5" /></Link></Button></div></td></tr>)}</tbody></table></div>
        {!pages.length && <div className="p-8 text-center text-xs text-muted-foreground">No status pages yet.</div>}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>
}
