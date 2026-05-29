"use client"

import { useEffect, useState } from "react"
import { Copy, Plus, Trash2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createApiKey, getApiKeys, getCurrentUser, revokeApiKey } from "@/lib/api"
import type { APIKey, User } from "@/lib/types"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [keys, setKeys] = useState<APIKey[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [newKey, setNewKey] = useState("")

  async function load() {
    const [userData, keyData] = await Promise.all([getCurrentUser(), getApiKeys()])
    setUser(userData)
    setKeys(keyData)
  }

  useEffect(() => { load().catch(() => undefined) }, [])

  async function createKey() {
    const key: any = await createApiKey(name)
    setNewKey(key.key ?? "")
    setKeys((current) => [key, ...current])
    setName("")
  }

  async function remove(id: string) {
    await revokeApiKey(id)
    setKeys((current) => current.filter((key) => key.id !== id))
  }

  return (
    <div className="space-y-4 text-[#F3F4F6]">
      <PageHeader title="Settings" description="Manage your account, security, and API access." />
      <SettingsCard title="Profile" description="Your Watcher account details.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2"><Field label="Full name" value={user?.name ?? ""} /><Field label="Email" value={user?.email ?? ""} /><Field label="Role" value={user?.role ?? ""} /><Field label="Created" value={user ? new Date(user.created_at).toLocaleString() : ""} /></div>
      </SettingsCard>
      <SettingsCard title="API Keys" description="Manage tokens for the Watcher API." actions={<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="inline-flex h-7 items-center gap-1 rounded bg-[#4F8CFF] px-3 text-[11px] text-white"><Plus className="h-3 w-3" /> Create key</button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Create API key</DialogTitle></DialogHeader><div className="space-y-3"><div className="space-y-1.5"><Label>Name</Label><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Production worker" /></div>{newKey && <div className="rounded border border-blue-500/30 bg-blue-500/10 p-3"><div className="text-xs font-semibold text-blue-300">Copy this key now. It will not be shown again.</div><code className="mt-2 block break-all text-xs">{newKey}</code></div>}<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Close</Button><Button onClick={createKey} disabled={!name}>Create</Button></div></div></DialogContent></Dialog>}>
        <div className="space-y-1.5">{keys.map((key) => <div key={key.id} className="flex items-center justify-between gap-3 rounded border border-white/5 bg-[#090A0B]/40 p-3"><div className="min-w-0"><div className="text-[12px] font-semibold">{key.name}</div><div className="truncate font-mono text-[10px] text-[#9CA3AF]">{key.masked_key}</div></div><div className="flex shrink-0 items-center gap-1.5"><span className="hidden text-[10px] text-[#9CA3AF] sm:inline">{new Date(key.created_at).toLocaleDateString()}</span><button onClick={() => navigator.clipboard?.writeText(key.masked_key)} className="inline-flex h-6 w-6 items-center justify-center rounded text-[#9CA3AF] hover:bg-[#1E2024]"><Copy className="h-3 w-3" /></button><button onClick={() => remove(key.id)} className="inline-flex h-6 w-6 items-center justify-center rounded text-red-400 hover:bg-[#1E2024]"><Trash2 className="h-3 w-3" /></button></div></div>)}{!keys.length && <div className="rounded border border-white/5 bg-[#090A0B]/40 p-6 text-center text-xs text-[#9CA3AF]">No API keys yet.</div>}</div>
      </SettingsCard>
    </div>
  )
}

function SettingsCard({ title, description, actions, children }: { title: string; description?: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return <div className="rounded border border-white/5 bg-[#151618]"><div className="flex items-start justify-between gap-3 border-b border-white/5 p-3.5"><div><div className="text-[12px] font-bold">{title}</div>{description && <div className="mt-0.5 text-[10px] text-[#9CA3AF]">{description}</div>}</div>{actions}</div><div className="p-3.5">{children}</div></div>
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="space-y-1"><label className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">{label}</label><input value={value} readOnly className="h-7 w-full rounded border border-white/5 bg-[#0C0D0E] px-2.5 text-[12px]" /></div>
}
