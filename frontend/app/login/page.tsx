"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Github } from "lucide-react"
import { FormEvent, Suspense, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCurrentUser, getOAuthStartUrl, hasAuthToken, login } from "@/lib/api"

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black p-8 text-sm text-zinc-500">Loading...</main>}>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (hasAuthToken()) {
      getCurrentUser()
        .then(() => router.replace(searchParams.get("next") || "/dashboard"))
        .catch(() => undefined)
    }
    const oauthError = searchParams.get("error")
    if (oauthError) {
      setError(oauthError)
      toast.error("Social login failed", { description: oauthError })
    }
  }, [router, searchParams])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(email, password)
      toast.success("Signed in", { description: "Your Watcher session is active." })
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
    <AuthFrame>
      <div className="mx-auto w-full max-w-[520px]">
        <AuthMark />
        <div className="mt-7 text-center">
          <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-white">Log in to Watcher</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-white hover:underline">Sign up.</Link>
          </p>
        </div>

        <SocialButtons />
        <Divider />

        <form className="space-y-5" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[13px] font-medium text-zinc-400">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@company.com"
              className="h-12 rounded-2xl border-white/10 bg-white/[0.09] px-4 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] placeholder:text-zinc-500 focus-visible:border-white/20 focus-visible:ring-white/15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[13px] font-medium text-zinc-400">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Enter your password"
                className="h-12 rounded-2xl border-white/10 bg-white/[0.09] px-4 pr-11 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] placeholder:text-zinc-500 focus-visible:border-white/20 focus-visible:ring-white/15"
              />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</div>}

          <Button type="submit" disabled={loading} className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.10] text-[14px] font-bold text-white hover:bg-white/[0.14] disabled:opacity-50">
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="mt-8 text-center text-xs text-zinc-500">
          By signing in, you agree to our{" "}
          <Link href="/docs" className="text-zinc-300 underline underline-offset-2">Terms</Link>{" "}
          and{" "}
          <Link href="/docs" className="text-zinc-300 underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </div>
    </AuthFrame>
  )
}

function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_62%,rgba(79,140,255,0.10),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(79,140,255,0.22),transparent_34%)]" />
      <div className="absolute -left-40 bottom-[-22rem] h-[44rem] w-[44rem] rotate-[-34deg] rounded-[45%] bg-[radial-gradient(circle_at_70%_30%,rgba(79,140,255,0.66),rgba(79,140,255,0.14)_34%,transparent_64%)] blur-[1px] opacity-80" />
      <div className="absolute right-[-14rem] top-[-18rem] h-[48rem] w-[48rem] rotate-[24deg] rounded-[45%] bg-[radial-gradient(circle_at_38%_62%,rgba(79,140,255,0.62),rgba(79,140,255,0.10)_36%,transparent_66%)] blur-[1px] opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88),rgba(0,0,0,0.42)_48%,rgba(0,0,0,0.82))]" />
      <Link href="/" className="absolute left-6 top-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>
      <div className="relative z-10 w-full">{children}</div>
    </main>
  )
}

function AuthMark() {
  return (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-black/35 shadow-2xl shadow-black/50 backdrop-blur">
      <img src="/watcher-logo-mark.png" alt="Watcher" className="h-8 w-8 rounded-lg object-cover" />
    </div>
  )
}

function SocialButtons() {
  return (
    <div className="mt-7 grid gap-3 sm:grid-cols-2">
      <a href={getOAuthStartUrl("google")} className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.10] text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/[0.14]">
        <span className="text-lg font-black">G</span>
        Log in with Google
      </a>
      <a href={getOAuthStartUrl("github")} className="inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.10] text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-white/[0.14]">
        <Github className="h-4 w-4" />
        Log in with GitHub
      </a>
    </div>
  )
}

function Divider() {
  return (
    <div className="my-8 flex items-center gap-4 text-sm text-zinc-500">
      <div className="h-px flex-1 bg-white/10" />
      or
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}
