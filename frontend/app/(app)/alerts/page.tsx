"use client"

import { Mail, MessageSquare, Webhook, Bell, Plus, Send, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAlertChannel, deleteAlertChannel, getAlertChannels, testAlertChannel } from "@/lib/api"
import type { AlertChannel } from "@/lib/types"

const iconByType: any = { email: Mail, slack: MessageSquare, discord: MessageSquare, webhook: Webhook, telegram: Send }

export default function AlertsPage() {
  const [channels, setChannels] = useState<AlertChannel[]>([])
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ type: "email" as AlertChannel["type"], destination: "" })
  const [error, setError] = useState("")

  async function load() {
    try {
      setChannels(await getAlertChannels())
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load alert channels")
    }
  }
  useEffect(() => { load() }, [])

  async function submit() {
    const channel = await createAlertChannel(draft)
    setChannels((current) => [channel, ...current])
    setOpen(false)
    setDraft({ type: "email", destination: "" })
  }

  async function remove(id: string) {
    await deleteAlertChannel(id)
    setChannels((current) => current.filter((channel) => channel.id !== id))
  }

  async function test(id: string) {
    await testAlertChannel(id)
    await load()
  }

  return (
    <div className="space-y-4 text-[#F3F4F6]">
      <PageHeader title="Alerts" description="Configure how Watcher notifies your team." actions={<Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="inline-flex h-7 items-center gap-1 rounded bg-[#4F8CFF] px-3 text-[11px] text-white"><Plus className="h-3 w-3" /> Add alert channel</button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Add alert channel</DialogTitle></DialogHeader><div className="space-y-3"><div className="space-y-1.5"><Label>Type</Label><Select value={draft.type} onValueChange={(value: any) => setDraft((d) => ({ ...d, type: value }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["email", "slack", "discord", "webhook", "telegram"].map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div><div className="space-y-1.5"><Label>Destination</Label><Input value={draft.destination} onChange={(event) => setDraft((d) => ({ ...d, destination: event.target.value }))} placeholder="engineering@example.com or webhook URL" /></div><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Create</Button></div></div></DialogContent></Dialog>} />
      {error && <div className="rounded border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}
      <div><div className="mb-2.5 text-[12px] font-bold">Alert channels</div><div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">{channels.map((channel) => {
        const Icon = iconByType[channel.type] ?? Bell
        return <div key={channel.id} className="rounded border border-white/5 bg-[#151618] p-3.5"><div className="flex items-start justify-between"><div className="flex items-center gap-2.5"><div className="flex h-7 w-7 items-center justify-center rounded bg-[#4F8CFF]/10 text-[#4F8CFF]"><Icon className="h-3.5 w-3.5" /></div><div><div className="text-[12px] font-semibold capitalize">{channel.type}</div><div className="max-w-[180px] truncate font-mono text-[10px] text-[#9CA3AF]">{channel.destination}</div></div></div><span className={`rounded border border-white/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase ${channel.is_active ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#9CA3AF]/10 text-[#9CA3AF]"}`}>{channel.is_active ? "Active" : "Inactive"}</span></div><div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5 text-[10px]"><span className="text-[#9CA3AF]">Last triggered {channel.last_triggered_at ? new Date(channel.last_triggered_at).toLocaleString() : "never"}</span><div className="flex gap-1"><button onClick={() => test(channel.id)} className="rounded px-2 py-1 text-[#4F8CFF] hover:bg-white/5">Test</button><button onClick={() => remove(channel.id)} className="rounded px-2 py-1 text-red-400 hover:bg-white/5"><Trash2 className="h-3 w-3" /></button></div></div></div>
      })}</div>{!channels.length && <div className="rounded border border-white/5 bg-[#151618] p-8 text-center text-xs text-[#9CA3AF]">No alert channels yet.</div>}</div>
      <div className="rounded border border-white/5 bg-[#151618] p-3.5"><div className="mb-3 flex items-center gap-2"><Bell className="h-3.5 w-3.5 text-[#4F8CFF]" /><div className="text-[12px] font-bold">Incident delivery</div></div><p className="text-xs text-[#9CA3AF]">When an incident opens or resolves, Watcher records an alert delivery for every active channel.</p></div>
    </div>
  )
}
