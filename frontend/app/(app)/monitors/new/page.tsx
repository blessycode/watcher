"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createMonitor, getProjects, runMonitorCheck } from "@/lib/api"
import type { Project } from "@/lib/types"

export default function NewMonitorPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState({
    project_id: "",
    name: "",
    url: "https://example.com",
    method: "GET",
    expected_status: 200,
    interval_seconds: 60,
    timeout_seconds: 10,
    region: "local",
    is_active: true,
  })

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data)
      if (data[0]) setDraft((current) => ({ ...current, project_id: data[0].id }))
    }).catch((err) => setError(err instanceof Error ? err.message : "Unable to load projects"))
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      const monitor = await createMonitor(draft)
      await runMonitorCheck(monitor.id).catch(() => undefined)
      router.push(`/monitors/${monitor.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create monitor")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/monitors" className="hover:text-foreground">Monitors</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">New</span>
      </nav>
      <PageHeader title="Create Monitor" description="Define an HTTP endpoint for Watcher to probe and track." />
      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5 rounded-xl border border-border bg-card p-6">
          {error && <div className="rounded border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Monitor name"><Input required value={draft.name} onChange={(event) => setDraft((d) => ({ ...d, name: event.target.value }))} placeholder="Payments API" /></Field>
            <Field label="Project"><Select value={draft.project_id} onValueChange={(value) => setDraft((d) => ({ ...d, project_id: value }))}><SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger><SelectContent>{projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}</SelectContent></Select></Field>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-[120px_1fr]">
            <Field label="Method"><Select value={draft.method} onValueChange={(value) => setDraft((d) => ({ ...d, method: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"].map((method) => <SelectItem key={method} value={method}>{method}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="URL"><Input required value={draft.url} onChange={(event) => setDraft((d) => ({ ...d, url: event.target.value }))} className="font-mono text-sm" /></Field>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Field label="Expected status"><Input type="number" value={draft.expected_status} onChange={(event) => setDraft((d) => ({ ...d, expected_status: Number(event.target.value) }))} /></Field>
            <Field label="Interval seconds"><Input type="number" min={30} value={draft.interval_seconds} onChange={(event) => setDraft((d) => ({ ...d, interval_seconds: Number(event.target.value) }))} /></Field>
            <Field label="Timeout seconds"><Input type="number" min={1} value={draft.timeout_seconds} onChange={(event) => setDraft((d) => ({ ...d, timeout_seconds: Number(event.target.value) }))} /></Field>
            <Field label="Region"><Input value={draft.region} onChange={(event) => setDraft((d) => ({ ...d, region: event.target.value }))} /></Field>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="outline" asChild><Link href="/monitors">Cancel</Link></Button>
            <Button type="submit" disabled={saving || !draft.project_id}>{saving ? "Saving..." : "Save monitor"}</Button>
          </div>
        </div>
        <aside className="self-start rounded-xl border border-border bg-card p-4 lg:sticky lg:top-20">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</div>
          <div className="mt-3 rounded-lg border border-border bg-secondary/40 p-3">
            <div className="text-sm font-medium">{draft.name || "Untitled monitor"}</div>
            <code className="mt-1 block truncate font-mono text-xs text-muted-foreground">{draft.method} {draft.url}</code>
            <div className="mt-3 text-xs text-muted-foreground">Expected {draft.expected_status} every {draft.interval_seconds}s from {draft.region}.</div>
          </div>
        </aside>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>
}
