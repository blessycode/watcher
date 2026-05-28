import { Plus, Search, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { SeverityBadge, IncidentStatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { incidents } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function IncidentsPage() {
  const open = incidents.filter((i) => i.status !== "resolved").length
  const resolved = incidents.filter((i) => i.status === "resolved").length

  return (
    <div>
      <PageHeader
        title="Incidents"
        description="Track outages and degradations from detection to recovery."
        actions={
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1.5" /> Create incident
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <SummaryCard icon={AlertTriangle} iconColor="text-red-600" label="Open" value={open.toString()} sub="1 critical, 1 high" />
        <SummaryCard icon={CheckCircle2} iconColor="text-emerald-600" label="Resolved (30d)" value="14" sub="2 reopened" />
        <SummaryCard icon={Clock} iconColor="text-foreground" label="Mean time to recovery" value="24m" sub="-8m vs. last month" />
      </div>

      <div className="flex flex-col lg:flex-row gap-2 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8 h-9" placeholder="Search incidents…" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All statuses", "All severities", "All projects", "Any time"].map((f) => (
            <Button key={f} variant="outline" size="sm" className="h-9 bg-transparent">{f}</Button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {incidents.map((i) => (
            <div key={i.id} className="p-5 hover:bg-accent/20 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={i.severity} />
                    <IncidentStatusBadge status={i.status} />
                    <span className="text-[11px] text-muted-foreground font-mono">{i.id}</span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold">{i.title}</h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Affected: <span className="text-foreground font-medium">{i.service}</span> ·{" "}
                    {i.affected.join(", ")}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Root cause: <span className="font-medium text-foreground">{i.rootCause}</span>
                  </div>
                </div>
                <div className="text-right text-xs shrink-0">
                  <div className="text-muted-foreground">Started</div>
                  <div className="font-mono">{i.startedAt}</div>
                  <div className="mt-1 text-muted-foreground">Duration</div>
                  <div className="font-semibold text-foreground">{i.duration}</div>
                </div>
              </div>

              {/* Timeline preview */}
              <div className="mt-4 pl-1 border-l-2 border-border space-y-1.5">
                {i.timeline.slice(0, 3).map((t, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs pl-3 -ml-[2px]">
                    <span className="font-mono text-muted-foreground w-12">{t.time}</span>
                    <span className="text-foreground">{t.message}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon: Icon, iconColor, label, value, sub }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div className="mt-1.5 text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  )
}
