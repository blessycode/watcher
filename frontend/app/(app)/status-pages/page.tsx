import Link from "next/link"
import { Plus, Copy, ExternalLink, Globe, Lock } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { statusPages } from "@/lib/mock-data"

export default function StatusPagesPage() {
  return (
    <div>
      <PageHeader
        title="Status Pages"
        description="Branded public and internal status pages for your services."
        actions={
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1.5" /> Create status page
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-medium px-4 py-2.5">Status page</th>
                <th className="text-left font-medium px-4 py-2.5">Project</th>
                <th className="text-left font-medium px-4 py-2.5">Visibility</th>
                <th className="text-right font-medium px-4 py-2.5">Subscribers</th>
                <th className="text-right font-medium px-4 py-2.5">Uptime</th>
                <th className="text-right font-medium px-4 py-2.5">Updated</th>
                <th className="text-right font-medium px-4 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {statusPages.map((s) => (
                <tr key={s.id} className="hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      watcher.dev/status/{s.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.project}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      {s.visibility === "public" ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      {s.visibility}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{s.subscribers.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{s.uptime}%</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{s.updatedAt}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="h-8 px-2">
                        <Link href={`/status/${s.slug}`}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
