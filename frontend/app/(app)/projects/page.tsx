import Link from "next/link"
import { Plus, Search, MoreHorizontal, Folder } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { projects } from "@/lib/mock-data"

export default function ProjectsPage() {
  return (
    <div>
      <PageHeader
        title="Projects"
        description="Group monitors into logical services and teams."
        actions={
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1.5" /> Create Project
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8 h-9" placeholder="Search projects…" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 bg-transparent">All teams</Button>
          <Button variant="outline" size="sm" className="h-9 bg-transparent">All statuses</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Link
            key={p.id}
            href="/monitors"
            className="rounded-xl border border-border bg-card p-5 hover:shadow-sm hover:border-foreground/20 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Folder className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate group-hover:text-primary transition-colors">
                    {p.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{p.owner}</div>
                </div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{p.description}</p>

            <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-border">
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Monitors</div>
                <div className="text-sm font-semibold tabular-nums mt-0.5">{p.monitors}</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Uptime</div>
                <div className="text-sm font-semibold tabular-nums mt-0.5">{p.uptime}%</div>
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Incidents</div>
                <div className="text-sm font-semibold tabular-nums mt-0.5">{p.incidents}</div>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground">Last check {p.lastCheck}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
