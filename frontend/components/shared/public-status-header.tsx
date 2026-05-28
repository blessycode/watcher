import { WatcherLogo } from "@/components/watcher-logo"

export function PublicStatusHeader({ title = "Watcher Status" }: { title?: string }) {
  return (
    <header className="border-b border-border bg-background/80 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <WatcherLogo />
        <span className="text-sm font-semibold">{title}</span>
      </div>
    </header>
  )
}
