import Link from "next/link"
import { ArrowRight, CheckCircle2, Github, PlusCircle, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { WatcherLogo } from "@/components/watcher-logo"

export default function RegisterPage() {
  return (
    <main className="watcher-radial relative min-h-screen overflow-hidden px-4 py-6 text-foreground">
      <div className="absolute right-[-12rem] top-20 h-96 w-96 rounded-full bg-primary/14 blur-3xl" />
      <div className="absolute bottom-[-10rem] left-[-10rem] h-96 w-96 rounded-full bg-violet-400/8 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link href="/">
            <WatcherLogo />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" className="rounded-xl">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <div className="rounded-[2rem] border border-border bg-card/90 p-5 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <PlusCircle className="h-3.5 w-3.5 text-primary" />
                New workspace
              </div>
              <h1 className="mt-5 text-2xl font-semibold tracking-tight">Create your account</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Start monitoring your first endpoint in minutes.</p>

              <div className="mt-7 grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-11 rounded-xl border-border bg-secondary/70 dark:bg-white/[0.03]">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" className="h-11 rounded-xl border-border bg-secondary/70 dark:bg-white/[0.03]">
                  Google
                </Button>
              </div>

              <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                Details
                <div className="h-px flex-1 bg-border" />
              </div>

              <form className="space-y-4" action="/dashboard">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="Jordan Davis" className="h-11 rounded-xl bg-secondary/70 dark:bg-black/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" className="h-11 rounded-xl bg-secondary/70 dark:bg-black/10" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="8+ characters" className="h-11 rounded-xl bg-secondary/70 dark:bg-black/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirm</Label>
                    <Input id="confirm" type="password" placeholder="Repeat" className="h-11 rounded-xl bg-secondary/70 dark:bg-black/10" />
                  </div>
                </div>
                <Button type="submit" className="h-11 w-full rounded-xl font-bold">
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
                By signing up, you agree to the Watcher Terms and Privacy Policy.
              </p>
            </div>
          </div>

          <div>
            <div className="mx-auto max-w-xl lg:mx-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Production-grade onboarding
              </div>
              <h2 className="font-display mt-6 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                Your first monitor should feel instant.
              </h2>
              <p className="mt-5 max-w-md text-pretty text-base leading-7 text-muted-foreground">
                Set up a workspace, add an endpoint, connect alerts, and publish a status page without fighting the UI.
              </p>

              <div className="mt-9 grid gap-3">
                {[
                  ["Create workspace", "Invite teammates and assign ownership."],
                  ["Add endpoint", "Paste a URL, choose method, expected code, interval, and region."],
                  ["Connect alerts", "Route incidents to Slack, Discord, email, or webhooks."],
                  ["Publish status", "Share service health with customers in one click."],
                ].map(([title, description], index) => (
                  <div key={title} className="flex gap-4 rounded-3xl border border-border bg-secondary/70 dark:bg-white/[0.035] p-4">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{title}</div>
                      <div className="mt-1 text-xs leading-5 text-muted-foreground">{description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3 text-xs text-muted-foreground">
                {["No credit card", "Mock demo included", "Open-source core"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

