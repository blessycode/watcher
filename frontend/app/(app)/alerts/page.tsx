import { Mail, MessageSquare, Webhook, Bell, Plus, Send } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"

const channels = [
  {
    id: 1,
    icon: Mail,
    name: "Email",
    target: "engineering@acme.com",
    verified: true,
    lastTriggered: "2h ago",
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: 2,
    icon: MessageSquare,
    name: "Slack",
    target: "#oncall",
    verified: true,
    lastTriggered: "32m ago",
    color: "bg-violet-50 text-violet-700",
  },
  {
    id: 3,
    icon: MessageSquare,
    name: "Discord",
    target: "Watcher / #incidents",
    verified: true,
    lastTriggered: "5h ago",
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    id: 4,
    icon: Webhook,
    name: "Webhook",
    target: "https://hooks.acme.com/watcher",
    verified: true,
    lastTriggered: "1h ago",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 5,
    icon: Send,
    name: "Telegram",
    target: "Not configured",
    verified: false,
    lastTriggered: "—",
    color: "bg-slate-50 text-slate-600",
  },
]

const rules = [
  { name: "Critical incidents", channels: "Slack, PagerDuty", trigger: "Severity = critical", delay: "Immediate" },
  { name: "Latency degradation", channels: "Slack", trigger: "P95 > 1000ms for 5m", delay: "After 5m" },
  { name: "Daily digest", channels: "Email", trigger: "Every day at 09:00", delay: "Scheduled" },
]

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        description="Configure how Watcher notifies your team."
        actions={
          <Button size="sm" className="h-9">
            <Plus className="h-4 w-4 mr-1.5" /> Add alert channel
          </Button>
        }
      />

      <div>
        <div className="text-sm font-semibold mb-3">Alert channels</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {channels.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${c.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
                        {c.target}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold ${
                      c.verified ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {c.verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Last triggered</span>
                  <span className="font-mono">{c.lastTriggered}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Notification rules</div>
            <div className="text-xs text-muted-foreground">When to fire and to which channels</div>
          </div>
          <Button variant="outline" size="sm" className="h-8 bg-transparent">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New rule
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="text-left font-medium px-4 py-2.5">Rule</th>
              <th className="text-left font-medium px-4 py-2.5">Trigger</th>
              <th className="text-left font-medium px-4 py-2.5">Channels</th>
              <th className="text-left font-medium px-4 py-2.5">Delay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rules.map((r) => (
              <tr key={r.name}>
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.trigger}</td>
                <td className="px-4 py-3">{r.channels}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.delay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="h-4 w-4 text-primary" />
          <div className="text-sm font-semibold">Escalation policy</div>
        </div>
        <ol className="space-y-3">
          {[
            { step: 1, who: "On-call engineer (Slack #oncall)", after: "Immediately" },
            { step: 2, who: "Engineering Manager (PagerDuty)", after: "After 10 minutes unacknowledged" },
            { step: 3, who: "VP Engineering (Email + SMS)", after: "After 30 minutes unacknowledged" },
          ].map((s) => (
            <li key={s.step} className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center shrink-0">
                {s.step}
              </div>
              <div>
                <div className="text-sm font-medium">{s.who}</div>
                <div className="text-xs text-muted-foreground">{s.after}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
