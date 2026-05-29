"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { completeOAuthLogin } from "@/lib/api"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const [message, setMessage] = useState("Finishing social login...")

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""))
    const token = params.get("access_token")
    if (!token) {
      setMessage("Social login did not return a session.")
      toast.error("Social login failed")
      router.replace("/login")
      return
    }
    completeOAuthLogin(token)
      .then(() => {
        toast.success("Signed in", { description: "Your social login session is active." })
        router.replace("/dashboard")
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Unable to finish social login")
        toast.error("Social login failed", {
          description: error instanceof Error ? error.message : "Unable to finish social login",
        })
        router.replace("/login")
      })
  }, [router])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-sm text-muted-foreground">
      {message}
    </main>
  )
}
