import { slowestEndpoints } from "@/lib/mock-data"

export function SlowestEndpoints() {
  return (
    <div className="space-y-3">
      {slowestEndpoints.map((endpoint) => (
        <div key={endpoint.url} className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold">{endpoint.name}</div>
            <div className="truncate font-mono text-[10px] text-muted-foreground">{endpoint.url}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold">{endpoint.p95}ms</div>
            <div className="text-[10px] text-muted-foreground">p99 {endpoint.p99}ms</div>
          </div>
        </div>
      ))}
    </div>
  )
}
