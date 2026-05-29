"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, LockKeyhole } from "lucide-react"
import { FormEvent, Suspense, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { WatcherLogo } from "@/components/watcher-logo"
import { getCurrentUser, getOAuthStartUrl, hasAuthToken, login } from "@/lib/api"

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background p-8 text-sm text-muted-foreground">Loading...</main>}>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (hasAuthToken()) {
      getCurrentUser()
        .then(() => router.replace(searchParams.get("next") || "/dashboard"))
        .catch(() => undefined)
    }
    const error = searchParams.get("error")
    if (error) {
      setError(error)
      toast.error("Social login failed", { description: error })
    }
  }, [router, searchParams])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(email, password)
      toast.success("Signed in", {
        description: "Your Watcher session is active.",
      })
      router.push(searchParams.get("next") || "/dashboard")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to log in"
      setError(message)
      toast.error("Login failed", { description: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="watcher-radial relative min-h-screen overflow-hidden px-4 py-6 text-foreground">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link href="/"><WatcherLogo /></Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" className="rounded-xl"><Link href="/register">Create account</Link></Button>
          </div>
        </header>
        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <LockKeyhole className="h-3.5 w-3.5" /> Secure workspace access
            </div>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
              Return to your command center.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Review incidents, check latency spikes, and keep your public status pages current.
            </p>
          </div>
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-7">
              <h2 className="text-2xl font-semibold tracking-tight">Log in</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">Use your Watcher account credentials.</p>
              <div className="mt-7 grid gap-2">
                <Button asChild variant="outline" className="h-11 rounded-xl border-border bg-secondary/70">
                  <a href={getOAuthStartUrl("google")}>Google</a>
                </Button>
              </div>
              <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> Email <div className="h-px flex-1 bg-border" />
              </div>
              <form className="space-y-4" onSubmit={submit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@company.com" className="h-11 rounded-xl bg-secondary/70" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Password" className="h-11 rounded-xl bg-secondary/70" />
                </div>
                {error && <div className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>}
                <Button type="submit" disabled={loading} className="h-11 w-full rounded-xl font-bold">
                  {loading ? "Logging in..." : "Log in"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                New to Watcher? <Link href="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
