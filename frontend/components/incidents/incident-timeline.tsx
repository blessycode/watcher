export function IncidentTimeline({ timeline }: { timeline: Array<{ time: string; message: string }> }) {
  return (
    <div className="space-y-2 border-l border-border pl-3">
      {timeline.map((event, index) => (
        <div key={index} className="text-xs">
          <div className="font-mono text-[10px] text-muted-foreground">{event.time}</div>
          <div>{event.message}</div>
        </div>
      ))}
    </div>
  )
}
