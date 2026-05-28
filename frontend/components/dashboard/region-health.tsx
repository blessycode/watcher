import { regions } from "@/lib/mock-data"

export function RegionHealth() {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {regions.map((region) => (
        <div key={region.name} className="rounded border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground">{region.name}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${region.uptime > 99.5 ? "bg-emerald-500" : region.uptime > 98 ? "bg-amber-500" : "bg-red-500"}`} />
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-lg font-semibold">{region.uptime}%</div>
              <div className="text-[10px] text-muted-foreground">{region.monitors} monitors</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold">{region.latency}ms</div>
              <div className="text-[10px] text-muted-foreground">avg latency</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
