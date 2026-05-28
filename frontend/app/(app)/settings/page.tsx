"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Copy, Eye, EyeOff, Plus } from "lucide-react"

const tabs = [
  { id: "profile", label: "Profile" },
  { id: "workspace", label: "Workspace" },
  { id: "channels", label: "Notification Channels" },
  { id: "keys", label: "API Keys" },
  { id: "webhooks", label: "Webhooks" },
  { id: "team", label: "Team Members" },
  { id: "billing", label: "Billing" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="text-[#F3F4F6]">
      <PageHeader
        title="Settings"
        description="Manage your workspace, security, and integrations."
      />

      {/* Tab navigation */}
      <div className="flex items-center gap-0.5 border-b border-white/5 mb-4 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 text-[11px] font-medium whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
              activeTab === t.id
                ? "text-[#F3F4F6] border-[#4F8CFF]"
                : "text-[#9CA3AF] border-transparent hover:text-[#F3F4F6]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <SettingsCard title="Profile" description="How others will see you in Watcher.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field id="full" label="Full name" defaultValue="Jordan Davis" />
            <Field id="email" label="Email" defaultValue="jordan@acme.com" />
            <Field id="role" label="Role" defaultValue="Senior SRE" />
            <Field id="tz" label="Timezone" defaultValue="America/Los_Angeles" />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="h-7 px-3 rounded border border-white/5 bg-[#151618] hover:bg-[#1E2024] text-[11px] text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">Cancel</button>
            <button className="h-7 text-[11px] bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white px-3 rounded transition-colors">Save changes</button>
          </div>
        </SettingsCard>
      )}

      {activeTab === "workspace" && (
        <SettingsCard title="Workspace" description="Watcher workspace details.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field id="ws-name" label="Workspace name" defaultValue="Acme Corp" />
            <Field id="ws-slug" label="Workspace slug" defaultValue="acme" />
            <Field id="ws-domain" label="Domain" defaultValue="acme.com" />
            <Field id="ws-plan" label="Plan" defaultValue="Pro" />
          </div>
        </SettingsCard>
      )}

      {activeTab === "channels" && (
        <SettingsCard title="Notification channels" description="Default channels for new monitors.">
          <div className="space-y-1.5">
            {["Slack #oncall", "Email engineering@acme.com", "PagerDuty (P1)"].map((c) => (
              <div key={c} className="flex items-center justify-between rounded border border-white/5 bg-[#090A0B]/40 px-3 py-2">
                <span className="text-[12px] text-[#F3F4F6]">{c}</span>
                <button className="text-[10px] text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">Edit</button>
              </div>
            ))}
          </div>
        </SettingsCard>
      )}

      {activeTab === "keys" && (
        <SettingsCard
          title="API Keys"
          description="Manage tokens for the Watcher API and CLI."
          actions={
            <button className="h-7 text-[11px] bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white px-3 rounded inline-flex items-center gap-1 transition-colors">
              <Plus className="h-3 w-3" /> Create key
            </button>
          }
        >
          <div className="space-y-1.5">
            <ApiKey name="Production CLI" value="wch_live_a18f...e92c" created="May 12, 2026" />
            <ApiKey name="CI/CD Pipeline" value="wch_live_b3c4...77a1" created="Apr 2, 2026" />
            <ApiKey name="Read-only Dashboard" value="wch_live_8d2a...0f31" created="Feb 18, 2026" />
          </div>
        </SettingsCard>
      )}

      {activeTab === "webhooks" && (
        <SettingsCard
          title="Webhooks"
          description="Receive realtime events from Watcher."
          actions={
            <button className="h-7 text-[11px] bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white px-3 rounded inline-flex items-center gap-1 transition-colors">
              <Plus className="h-3 w-3" /> Add webhook
            </button>
          }
        >
          <div className="space-y-1.5">
            {[
              { url: "https://hooks.acme.com/watcher", events: "incidents, checks", status: "Active" },
              { url: "https://example.com/notify", events: "incidents", status: "Active" },
            ].map((w) => (
              <div key={w.url} className="rounded border border-white/5 bg-[#090A0B]/40 px-3 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] truncate text-[#F3F4F6]">{w.url}</div>
                  <div className="text-[10px] text-[#9CA3AF]">{w.events}</div>
                </div>
                <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded border border-white/5 bg-[#22C55E]/10 text-[#22C55E] shrink-0">{w.status}</span>
              </div>
            ))}
          </div>
        </SettingsCard>
      )}

      {activeTab === "team" && (
        <SettingsCard
          title="Team members"
          description="People with access to this workspace."
          actions={
            <button className="h-7 text-[11px] bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white px-3 rounded inline-flex items-center gap-1 transition-colors">
              <Plus className="h-3 w-3" /> Invite member
            </button>
          }
        >
          <div className="rounded border border-white/5 overflow-hidden -mx-3.5 -mb-3.5">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-[#090A0B] text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider select-none border-b border-white/5">
                  <th className="text-left px-3.5 py-2">Member</th>
                  <th className="text-left px-3.5 py-2">Email</th>
                  <th className="text-left px-3.5 py-2">Role</th>
                  <th className="text-right px-3.5 py-2">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Jordan Davis", "jordan@acme.com", "Owner", "Jan 2025"],
                  ["Priya Patel", "priya@acme.com", "Admin", "Feb 2025"],
                  ["Marcus Chen", "marcus@acme.com", "Engineer", "Apr 2025"],
                  ["Sara Lewis", "sara@acme.com", "Engineer", "Sep 2025"],
                ].map(([n, e, r, j]) => (
                  <tr key={e} className="hover:bg-[#1E2024]/50 transition-colors">
                    <td className="px-3.5 py-2.5 font-semibold text-[#F3F4F6]">{n}</td>
                    <td className="px-3.5 py-2.5 text-[#9CA3AF]">{e}</td>
                    <td className="px-3.5 py-2.5 text-[#F3F4F6]">{r}</td>
                    <td className="px-3.5 py-2.5 text-right text-[#9CA3AF] text-[10px]">{j}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SettingsCard>
      )}

      {activeTab === "billing" && (
        <SettingsCard title="Billing" description="Plan, invoices, and payment method.">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
            {[
              { label: "Current plan", value: "Pro" },
              { label: "Monitors used", value: "24 / 100" },
              { label: "Next invoice", value: "$49 · Jun 28" },
            ].map((s) => (
              <div key={s.label} className="rounded border border-white/5 bg-[#090A0B]/40 p-3">
                <div className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">{s.label}</div>
                <div className="mt-1.5 text-[16px] font-bold tabular-nums text-[#F3F4F6]">{s.value}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="h-7 text-[11px] bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white px-3 rounded transition-colors">Manage subscription</button>
            <button className="h-7 px-3 rounded border border-white/5 bg-[#151618] hover:bg-[#1E2024] text-[11px] text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">Download invoices</button>
          </div>
        </SettingsCard>
      )}
    </div>
  )
}

function SettingsCard({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded border border-white/5 bg-[#151618]">
      <div className="flex items-start justify-between gap-3 p-3.5 border-b border-white/5">
        <div>
          <div className="text-[12px] font-bold text-[#F3F4F6]">{title}</div>
          {description && <div className="text-[10px] text-[#9CA3AF] mt-0.5">{description}</div>}
        </div>
        {actions}
      </div>
      <div className="p-3.5">{children}</div>
    </div>
  )
}

function Field({ id, label, defaultValue }: { id: string; label: string; defaultValue?: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">{label}</label>
      <input
        id={id}
        defaultValue={defaultValue}
        className="w-full h-7 px-2.5 rounded border border-white/5 bg-[#0C0D0E] text-[12px] text-[#F3F4F6] focus:outline-none focus:ring-1 focus:ring-[#4F8CFF]/40"
      />
    </div>
  )
}

function ApiKey({ name, value, created }: { name: string; value: string; created: string }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="rounded border border-white/5 bg-[#090A0B]/40 p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[12px] font-semibold text-[#F3F4F6]">{name}</div>
        <div className="font-mono text-[10px] text-[#9CA3AF] truncate">
          {shown ? value.replace("...", "12d8b9f4") : value}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-[#9CA3AF] hidden sm:inline">{created}</span>
        <button
          onClick={() => setShown((s) => !s)}
          className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-[#1E2024] text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors"
        >
          {shown ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
        </button>
        <button className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-[#1E2024] text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
          <Copy className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
