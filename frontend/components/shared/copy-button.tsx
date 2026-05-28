"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard?.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  return (
    <Button type="button" size="sm" variant="outline" onClick={copy} className="h-7 gap-1.5 text-xs">
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  )
}
