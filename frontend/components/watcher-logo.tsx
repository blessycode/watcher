export function WatcherLogo({ size = "sm", className }: { size?: "sm" | "lg"; className?: string }) {
  const markSize = size === "lg" ? "h-10 w-10" : "h-7 w-7"
  const textSize = size === "lg" ? "text-xl" : "text-[15px]"

  return (
    <div className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <img
        src="/watcher-logo-mark.png"
        alt=""
        aria-hidden="true"
        className={`${markSize} hidden rounded-md object-cover shadow-[0_0_24px_-10px_rgba(59,130,246,0.95)] dark:block`}
      />
      <img
        src="/watcher-logo-mark-light.png"
        alt=""
        aria-hidden="true"
        className={`${markSize} rounded-md object-cover shadow-[0_0_24px_-10px_rgba(37,99,235,0.55)] dark:hidden`}
      />
      <span className={`font-semibold tracking-tight text-foreground ${textSize}`}>Watcher</span>
    </div>
  )
}
