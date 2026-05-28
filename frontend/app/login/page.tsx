import Link from "next/link"
import { Activity, ArrowRight, Github, LockKeyhole, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { WatcherLogo } from "@/components/watcher-logo"

export default function LoginPage() {
  return (
    <main className="watcher-radial relative min-h-screen overflow-hidden px-4 py-6 text-foreground">
      <div className="absolute left-1/2 top-16 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link href="/">
            <WatcherLogo />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" className="rounded-xl">
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <LockKeyhole className="h-3.5 w-3.5 text-primary" />
              Secure workspace access
            </div>
            <h1 className="font-display mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
              Return to your command center.
            </h1>
            <p className="mt-5 max-w-md text-pretty text-base leading-7 text-muted-foreground">
              Review incidents, check latency spikes, and keep your public status pages current.
            </p>
            <AuthSignalPanel />
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-7">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Log in</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">Use your Watcher workspace credentials.</p>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-11 rounded-xl border-border bg-secondary/70 dark:bg-white/[0.03]">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" className="h-11 rounded-xl border-border bg-secondary/70 dark:bg-white/[0.03]">
                  <GoogleIcon />
                  Google
                </Button>
              </div>

              <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                Email
                <div className="h-px flex-1 bg-border" />
              </div>

              <form className="space-y-4" action="/dashboard">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="you@company.com" className="h-11 rounded-xl bg-secondary/70 dark:bg-black/10" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs font-medium text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" placeholder="Password" className="h-11 rounded-xl bg-secondary/70 dark:bg-black/10" />
                </div>
                <Button type="submit" className="h-11 w-full rounded-xl font-bold">
                  Log in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                New to Watcher?{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function AuthSignalPanel() {
  return (
    <div className="mt-9 hidden max-w-lg rounded-3xl border border-border bg-secondary/70 dark:bg-white/[0.035] p-4 lg:block">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Radio className="h-4 w-4 text-primary" />
          Live checks
        </div>
        <span className="font-mono text-xs text-muted-foreground">14:32:18 UTC</span>
      </div>
      <div className="mt-4 space-y-2">
        {[
          ["Auth Service", "200", "138ms", true],
          ["Payments API", "200", "192ms", true],
          ["Notification Worker", "503", "timeout", false],
        ].map(([name, code, latency, ok]) => (
          <div key={name as string} className="grid grid-cols-[1fr_44px_68px] items-center gap-2 rounded-2xl border border-border bg-secondary/70 dark:bg-black/10 px-3 py-2.5 text-xs">
            <span className="font-medium">{name as string}</span>
            <span className={ok ? "font-mono text-emerald-300" : "font-mono text-rose-300"}>{code as string}</span>
            <span className="text-right font-mono text-muted-foreground">{latency as string}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="h-3.5 w-3.5 text-primary" />
        24 monitors across 6 projects
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
        fill="#8fb7ff"
      />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" fill="#34d399" />
      <path d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z" fill="#f59e0b" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" fill="#fb7185" />
    </svg>
  )
}

