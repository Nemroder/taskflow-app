import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, LayoutDashboard, MessageSquare, Zap } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="w-4 h-4" />
            Modern Project Management
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-balance leading-tight">
            Manage Projects with <span className="text-primary">Clarity</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            TaskFlow helps teams organize, track, and collaborate on projects with an intuitive interface inspired by
            the best tools.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Visual Task Boards</h3>
            <p className="text-muted-foreground leading-relaxed">
              Organize tasks with drag-and-drop boards. Track progress with customizable statuses and priorities.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Real-time Chat</h3>
            <p className="text-muted-foreground leading-relaxed">
              Collaborate with your team in real-time. Discuss projects and share updates instantly.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Smart Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get insights into your team's productivity with beautiful charts and statistics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8 p-12 rounded-3xl bg-primary/5 border border-primary/20">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">Ready to streamline your workflow?</h2>
          <p className="text-xl text-muted-foreground">Join thousands of teams already using TaskFlow</p>
          <Link href="/auth/register">
            <Button size="lg" className="gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 TaskFlow. Built with Next.js and Supabase.
        </div>
      </footer>
    </div>
  )
}
