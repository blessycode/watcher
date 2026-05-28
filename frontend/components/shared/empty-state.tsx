import { Inbox } from "lucide-react"

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded border border-border bg-card p-8 text-center">
      <Inbox className="mx-auto h-6 w-6 text-muted-foreground" />
      <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  )
}
