"use client"

import { Button } from "@/components/ui/button"

export function FilterBar({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <Button
          key={option}
          type="button"
          size="sm"
          variant={value === option ? "default" : "outline"}
          onClick={() => onChange(option)}
          className="h-7 rounded px-2.5 text-[11px] capitalize"
        >
          {option}
        </Button>
      ))}
    </div>
  )
}
