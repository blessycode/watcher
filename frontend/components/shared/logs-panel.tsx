export function LogsPanel({ lines }: { lines: string[] }) {
  return (
    <pre className="overflow-auto rounded border border-border bg-[#090A0B] p-3 text-[11px] leading-5 text-slate-300">
      {lines.join("\n")}
    </pre>
  )
}
