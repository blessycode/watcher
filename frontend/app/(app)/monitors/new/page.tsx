import Link from "next/link"
import { ChevronRight, Globe, Activity } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MethodBadge, StatusBadge } from "@/components/status-badge"

export default function NewMonitorPage() {
  return (
    <div>
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
        <Link href="/monitors" className="hover:text-foreground">Monitors</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">New</span>
      </nav>

      <PageHeader
        title="Create Monitor"
        description="Define an HTTP endpoint for Watcher to probe and track."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Form */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <Section title="Basics" description="What endpoint should we monitor?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field id="name" label="Monitor name" placeholder="Payments API" />
              <div className="space-y-1.5">
                <Label htmlFor="project">Project</Label>
                <Select defaultValue="payments">
                  <SelectTrigger id="project"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banking">Core Banking APIs</SelectItem>
                    <SelectItem value="claims">Claims Platform</SelectItem>
                    <SelectItem value="customer">Customer Portal</SelectItem>
                    <SelectItem value="payments">Payments Infrastructure</SelectItem>
                    <SelectItem value="notify">Notification Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="method">Method</Label>
                <Select defaultValue="GET">
                  <SelectTrigger id="method"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["GET", "POST", "PUT", "DELETE", "PATCH"].map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="url">URL</Label>
                <Input id="url" placeholder="https://api.acme.com/v2/charge" defaultValue="https://api.acme.com/v2/charge" className="font-mono text-sm" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Valid URL
              </span>
              <Button variant="outline" size="sm" className="h-7 ml-auto bg-transparent">Test endpoint</Button>
            </div>
          </Section>

          <Divider />

          <Section title="Assertions" description="What does success look like?">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field id="status" label="Expected status" placeholder="200" defaultValue="200" />
              <div className="space-y-1.5">
                <Label htmlFor="interval">Check interval</Label>
                <Select defaultValue="60">
                  <SelectTrigger id="interval"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[
                      ["30", "Every 30 seconds"],
                      ["60", "Every 1 minute"],
                      ["300", "Every 5 minutes"],
                      ["600", "Every 10 minutes"],
                    ].map(([v, l]) => (
                      <SelectItem key={v} value={v}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Field id="timeout" label="Timeout (ms)" placeholder="5000" defaultValue="5000" />
            </div>
          </Section>

          <Divider />

          <Section title="Routing" description="Where do we run from, and who gets notified?">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="region">Region</Label>
                <Select defaultValue="us-east-1">
                  <SelectTrigger id="region"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1", "global"].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="alert">Alert channel</Label>
                <Select defaultValue="slack">
                  <SelectTrigger id="alert"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slack">Slack — #oncall</SelectItem>
                    <SelectItem value="email">Email — engineering@acme</SelectItem>
                    <SelectItem value="discord">Discord — Watcher</SelectItem>
                    <SelectItem value="pager">PagerDuty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          <Divider />

          <Accordion type="single" collapsible className="border-t border-border -mx-6 px-6 -mb-6 pt-1">
            <AccordionItem value="advanced" className="border-0">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Advanced settings
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-3">
                  <Field id="header-key" label="Custom headers" placeholder='{ "Authorization": "Bearer ..." }' />
                  <Field id="body" label="Request body (JSON)" placeholder='{ "id": "demo" }' />
                  <Field id="retries" label="Failure retries" defaultValue="3" />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border -mx-6 px-6 -mb-6 pb-6">
            <Button variant="outline" asChild className="bg-transparent"><Link href="/monitors">Cancel</Link></Button>
            <Button asChild><Link href="/monitors">Save monitor</Link></Button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4 lg:sticky lg:top-20 self-start">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Preview</div>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <MethodBadge method="GET" />
                <code className="font-mono text-xs text-muted-foreground truncate">api.acme.com/v2/charge</code>
              </div>
              <div className="rounded-lg border border-border p-3 bg-secondary/40">
                <div className="text-sm font-medium">Payments API</div>
                <div className="text-xs text-muted-foreground">Payments Infrastructure</div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <StatusBadge status="operational" />
                  <span className="text-muted-foreground">Every 60s · us-east-1</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Watcher will probe this endpoint and assert <code className="font-mono">status: 200</code> within{" "}
                <code className="font-mono">5000ms</code>.
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-medium text-sm">
              <Activity className="h-4 w-4 text-primary" />
              What we&apos;ll track
            </div>
            <ul className="space-y-1.5 mt-2">
              <li>• HTTP status code matches expected value</li>
              <li>• Response latency under timeout threshold</li>
              <li>• TLS certificate validity and expiry</li>
              <li>• DNS resolution time and failures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3">
        <div className="text-sm font-semibold">{title}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
      {children}
    </div>
  )
}

function Field({ id, label, placeholder, defaultValue }: { id: string; label: string; placeholder?: string; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} placeholder={placeholder} defaultValue={defaultValue} />
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-border -mx-6" />
}
