import { Mail, MessageSquare, Webhook, Bell, Plus, Send } from "lucide-react"
import { PageHeader } from "@/components/page-header"

const channels = [
  {
    id: 1,
    icon: Mail,
    name: "Email",
    target: "engineering@acme.com",
    verified: true,
    lastTriggered: "2h ago",
    color: "bg-[#4F8CFF]/10 text-[#4F8CFF]",
  },
  {
    id: 2,
    icon: MessageSquare,
    name: "Slack",
    target: "#oncall",
    verified: true,
    lastTriggered: "32m ago",
    color: "bg-[#A78BFA]/10 text-[#A78BFA]",
  },
  {
    id: 3,
    icon: MessageSquare,
    name: "Discord",
    target: "Watcher / #incidents",
    verified: true,
    lastTriggered: "5h ago",
    color: "bg-[#818CF8]/10 text-[#818CF8]",
  },
  {
    id: 4,
    icon: Webhook,
    name: "Webhook",
    target: "https://hooks.acme.com/watcher",
    verified: true,
    lastTriggered: "1h ago",
    color: "bg-[#22C55E]/10 text-[#22C55E]",
  },
  {
    id: 5,
    icon: Send,
    name: "Telegram",
    target: "Not configured",
    verified: false,
    lastTriggered: "—",
    color: "bg-[#9CA3AF]/10 text-[#9CA3AF]",
  },
]

const rules = [
  { name: "Critical incidents", channels: "Slack, PagerDuty", trigger: "Severity = critical", delay: "Immediate" },
  { name: "Latency degradation", channels: "Slack", trigger: "P95 > 1000ms for 5m", delay: "After 5m" },
  { name: "Daily digest", channels: "Email", trigger: "Every day at 09:00", delay: "Scheduled" },
]

export default function AlertsPage() {
  return (
    <div className="space-y-4 text-[#F3F4F6]">
      <PageHeader
        title="Alerts"
        description="Configure how Watcher notifies your team."
        actions={
          <button className="h-7 text-[11px] bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white px-3 rounded inline-flex items-center gap-1 transition-colors">
            <Plus className="h-3 w-3" /> Add alert channel
          </button>
        }
      />

      <div>
        <div className="text-[12px] font-bold text-[#F3F4F6] mb-2.5 select-none">Alert channels</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
          {channels.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.id} className="rounded border border-white/5 bg-[#151618] p-3.5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-7 w-7 rounded flex items-center justify-center ${c.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[#F3F4F6]">{c.name}</div>
                      <div className="text-[10px] text-[#9CA3AF] font-mono truncate max-w-[160px]">
                        {c.target}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border border-white/5 ${
                      c.verified ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                    }`}
                  >
                    {c.verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                  <span className="text-[#9CA3AF]">Last triggered</span>
                  <span className="font-mono text-[#F3F4F6]">{c.lastTriggered}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded border border-white/5 bg-[#151618] overflow-hidden">
        <div className="px-3.5 py-3 border-b border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[12px] font-bold text-[#F3F4F6]">Notification rules</div>
            <div className="text-[10px] text-[#9CA3AF]">When to fire and to which channels</div>
          </div>
          <button className="h-7 px-2.5 rounded border border-white/5 bg-[#151618] hover:bg-[#1E2024] text-[10px] text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> New rule
          </button>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-[#090A0B] text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider select-none border-b border-white/5">
              <th className="text-left px-3.5 py-2">Rule</th>
              <th className="text-left px-3.5 py-2">Trigger</th>
              <th className="text-left px-3.5 py-2">Channels</th>
              <th className="text-left px-3.5 py-2">Delay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rules.map((r) => (
              <tr key={r.name} className="hover:bg-[#1E2024]/50 transition-colors">
                <td className="px-3.5 py-2.5 font-semibold text-[#F3F4F6]">{r.name}</td>
                <td className="px-3.5 py-2.5 text-[#9CA3AF]">{r.trigger}</td>
                <td className="px-3.5 py-2.5 text-[#F3F4F6]">{r.channels}</td>
                <td className="px-3.5 py-2.5 text-[#9CA3AF]">{r.delay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded border border-white/5 bg-[#151618] p-3.5">
        <div className="flex items-center gap-2 mb-3 select-none">
          <Bell className="h-3.5 w-3.5 text-[#4F8CFF]" />
          <div className="text-[12px] font-bold text-[#F3F4F6]">Escalation policy</div>
        </div>
        <ol className="space-y-2.5">
          {[
            { step: 1, who: "On-call engineer (Slack #oncall)", after: "Immediately" },
            { step: 2, who: "Engineering Manager (PagerDuty)", after: "After 10 minutes unacknowledged" },
            { step: 3, who: "VP Engineering (Email + SMS)", after: "After 30 minutes unacknowledged" },
          ].map((s) => (
            <li key={s.step} className="flex items-start gap-2.5">
              <div className="h-5 w-5 rounded-full bg-[#4F8CFF] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {s.step}
              </div>
              <div>
                <div className="text-[12px] font-semibold text-[#F3F4F6]">{s.who}</div>
                <div className="text-[10px] text-[#9CA3AF]">{s.after}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
