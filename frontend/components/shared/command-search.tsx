"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function CommandSearch({ value, onChange, placeholder = "Search..." }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-8 pl-8 text-xs" />
    </div>
  )
}
