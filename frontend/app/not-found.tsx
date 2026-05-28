import Link from "next/link"
import { ArrowLeft, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WatcherLogo } from "@/components/watcher-logo"

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 text-foreground">
      <div
        className="absolute inset-x-0 top-[-180px] h-[560px]"
        style={{
          background:
            "radial-gradient(50% 55% at 50% 0%, rgba(143,183,255,0.2), rgba(167,139,250,0.08) 42%, transparent 76%)",
        }}
      />
      <section className="relative max-w-lg text-center">
        <div className="mb-7 flex justify-center">
          <WatcherLogo size="lg" />
        </div>
        <div className="font-mono text-sm text-primary">404</div>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          This route is not being monitored.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          The page you requested does not exist, or the endpoint moved without updating its status page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Return dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-card/70">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go home
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
