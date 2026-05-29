"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getCachedUser, getCurrentUser, hasAuthToken } from "@/lib/api"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkAuth() {
      if (!hasAuthToken()) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`)
        return
      }
      if (getCachedUser()) {
        setReady(true)
      }
      try {
        await getCurrentUser()
        if (!cancelled) setReady(true)
      } catch {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      }
    }

    checkAuth()
    return () => {
      cancelled = true
    }
  }, [pathname, router])

  if (!ready) {
    return <div className="min-h-screen bg-[#0C0D0E] p-8 text-sm text-[#9CA3AF]">Checking session...</div>
  }

  return <>{children}</>
}
