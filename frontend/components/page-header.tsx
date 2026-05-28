export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-2 mb-4 select-none">
      <div>
        <h1 className="text-[15px] font-bold tracking-tight text-[#F3F4F6]">{title}</h1>
        {description && (
          <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
