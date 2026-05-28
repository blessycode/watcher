"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Eye, EyeOff, Plus } from "lucide-react"

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your workspace, security, and integrations."
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-card border border-border w-full justify-start h-auto p-1 overflow-x-auto">
          {[
            ["profile", "Profile"],
            ["workspace", "Workspace"],
            ["channels", "Notification Channels"],
            ["keys", "API Keys"],
            ["webhooks", "Webhooks"],
            ["team", "Team Members"],
            ["billing", "Billing"],
          ].map(([v, l]) => (
            <TabsTrigger key={v} value={v} className="text-sm">{l}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <SettingsCard title="Profile" description="How others will see you in Watcher.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="full" label="Full name" defaultValue="Jordan Davis" />
              <Field id="email" label="Email" defaultValue="jordan@acme.com" />
              <Field id="role" label="Role" defaultValue="Senior SRE" />
              <Field id="tz" label="Timezone" defaultValue="America/Los_Angeles" />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" className="bg-transparent">Cancel</Button>
              <Button>Save changes</Button>
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="workspace" className="mt-6">
          <SettingsCard title="Workspace" description="Watcher workspace details.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="ws-name" label="Workspace name" defaultValue="Acme Corp" />
              <Field id="ws-slug" label="Workspace slug" defaultValue="acme" />
              <Field id="ws-domain" label="Domain" defaultValue="acme.com" />
              <Field id="ws-plan" label="Plan" defaultValue="Pro" />
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="channels" className="mt-6">
          <SettingsCard title="Notification channels" description="Default channels for new monitors.">
            <div className="space-y-2">
              {["Slack #oncall", "Email engineering@acme.com", "PagerDuty (P1)"].map((c) => (
                <div key={c} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                  <span className="text-sm">{c}</span>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              ))}
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="keys" className="mt-6">
          <SettingsCard
            title="API Keys"
            description="Manage tokens for the Watcher API and CLI."
            actions={<Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Create key</Button>}
          >
            <div className="space-y-2">
              <ApiKey name="Production CLI" value="wch_live_a18f...e92c" created="May 12, 2026" />
              <ApiKey name="CI/CD Pipeline" value="wch_live_b3c4...77a1" created="Apr 2, 2026" />
              <ApiKey name="Read-only Dashboard" value="wch_live_8d2a...0f31" created="Feb 18, 2026" />
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <SettingsCard
            title="Webhooks"
            description="Receive realtime events from Watcher."
            actions={<Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Add webhook</Button>}
          >
            <div className="space-y-2">
              {[
                { url: "https://hooks.acme.com/watcher", events: "incidents, checks", status: "Active" },
                { url: "https://example.com/notify", events: "incidents", status: "Active" },
              ].map((w) => (
                <div key={w.url} className="rounded-lg border border-border px-3 py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-xs truncate">{w.url}</div>
                    <div className="text-[11px] text-muted-foreground">{w.events}</div>
                  </div>
                  <span className="text-xs text-emerald-700 shrink-0">{w.status}</span>
                </div>
              ))}
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <SettingsCard
            title="Team members"
            description="People with access to this workspace."
            actions={<Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Invite member</Button>}
          >
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-3 py-2">Member</th>
                    <th className="text-left font-medium px-3 py-2">Email</th>
                    <th className="text-left font-medium px-3 py-2">Role</th>
                    <th className="text-right font-medium px-3 py-2">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Jordan Davis", "jordan@acme.com", "Owner", "Jan 2025"],
                    ["Priya Patel", "priya@acme.com", "Admin", "Feb 2025"],
                    ["Marcus Chen", "marcus@acme.com", "Engineer", "Apr 2025"],
                    ["Sara Lewis", "sara@acme.com", "Engineer", "Sep 2025"],
                  ].map(([n, e, r, j]) => (
                    <tr key={e}>
                      <td className="px-3 py-2.5 font-medium">{n}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{e}</td>
                      <td className="px-3 py-2.5">{r}</td>
                      <td className="px-3 py-2.5 text-right text-muted-foreground text-xs">{j}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <SettingsCard title="Billing" description="Plan, invoices, and payment method.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Current plan", value: "Pro" },
                { label: "Monitors used", value: "24 / 100" },
                { label: "Next invoice", value: "$49 · Jun 28" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="mt-1 text-lg font-semibold">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button>Manage subscription</Button>
              <Button variant="outline" className="bg-transparent">Download invoices</Button>
            </div>
          </SettingsCard>
        </TabsContent>
      </Tabs>
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
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-start justify-between gap-3 p-5 border-b border-border">
        <div>
          <div className="font-semibold">{title}</div>
          {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
        </div>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function Field({ id, label, defaultValue }: { id: string; label: string; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} defaultValue={defaultValue} />
    </div>
  )
}

function ApiKey({ name, value, created }: { name: string; value: string; created: string }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="rounded-lg border border-border p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{name}</div>
        <div className="font-mono text-xs text-muted-foreground truncate">
          {shown ? value.replace("...", "12d8b9f4") : value}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] text-muted-foreground hidden sm:inline">{created}</span>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShown((s) => !s)}>
          {shown ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
