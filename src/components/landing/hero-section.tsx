import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUpRight, Search, Bell, Users, Wallet, TrendingUp, LayoutDashboard, Receipt, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden">
      {/* Layered watercolor wash */}
      <div className="absolute inset-0 -z-10">
        {/* Main violet wash — top right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6 }}
          className="absolute -top-32 -right-20 w-180 h-180 bg-primary/25 rounded-full blur-[160px]"
        />
        {/* Secondary wash — top left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.15 }}
          className="absolute -top-10 -left-32 w-140 h-140 bg-primary/15 rounded-full blur-[140px]"
        />
        {/* Accent wash — mid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.3 }}
          className="absolute top-60 left-1/3 w-125 h-125 bg-accent/12 rounded-full blur-[150px]"
        />
        {/* Fade to background */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-background" />

        {/* Subtle grain noise for watercolor feel */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.15] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="hero-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0.35 0 0 0 0 0.15 0 0 0 0 0.55 0 0 0 0.6 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#hero-noise)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-background/70 backdrop-blur-md border border-primary/15 px-3.5 py-1.5 rounded-full mb-8 shadow-xs shadow-primary/5"
        >
          <span className="text-xs font-medium text-foreground/80 tracking-wide">
            Built for African SMEs
          </span>
        </motion.div>

        {/* Headline — bigger, tighter */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-[5.5rem] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground"
        >
          Know who owes you.
          <br />
          <span className="text-foreground/50">And when they&apos;ll pay.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-7 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Stop chasing debts across WhatsApp threads and notebooks. CredFlow gives you
          one dashboard for customer debts, payments, and cash flow — so you always
          know who to call next.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Button
            size="lg"
            onClick={() => router.push('/register')}
            className="rounded-full px-7 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all ring-1 ring-inset ring-white/10"
          >
            Start tracking debts
            <ArrowRight className="w-4 h-4" />
          </Button>
          <a
            href="#how"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See how it works
            <span className="transition-transform group-hover:translate-y-0.5">↓</span>
          </a>
        </motion.div>

        {/* Dashboard placeholder — detailed mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-20 sm:mt-24"
        >
          <div className="relative mx-auto max-w-6xl">
            {/* Soft glow behind */}
            <div className="absolute -inset-8 bg-linear-to-tr from-primary/25 via-accent/10 to-primary/25 rounded-[2rem] blur-3xl opacity-70" />

            {/* Frame */}
            <div className="relative rounded-2xl border border-border/60 bg-card/90 backdrop-blur-xs shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-muted/40">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-warning/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-success/40" />
                </div>
                <div className="mx-auto flex items-center gap-1.5 px-3 py-1 rounded-md bg-background/60 border border-border/60 text-[10px] text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-success" />
                  app.credflow.co/dashboard
                </div>
              </div>

              {/* App layout: sidebar + main */}
              <div className="flex min-h-110 sm:min-h-130">
                {/* Sidebar */}
                <div className="hidden sm:flex w-48 border-r border-border/60 bg-muted/20 flex-col py-5 px-3 gap-1">
                  <div className="flex items-center gap-2 px-2 pb-4 mb-2 border-b border-border/60">
                    <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                      <Wallet className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-semibold tracking-tight">CredFlow</span>
                  </div>
                  {[
                    { icon: LayoutDashboard, label: 'Dashboard', active: true },
                    { icon: Users, label: 'Customers' },
                    { icon: Receipt, label: 'Debts' },
                    { icon: Wallet, label: 'Payments' },
                    { icon: BarChart3, label: 'Analytics' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[11px] ${
                        item.active
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Main */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
                  {/* Top bar */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 max-w-xs flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border/60 bg-background/60 text-[10px] text-muted-foreground">
                      <Search className="w-3 h-3" />
                      Search customers, debts…
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md border border-border/60 flex items-center justify-center">
                        <Bell className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium text-primary">
                        AK
                      </div>
                    </div>
                  </div>

                  {/* Page title */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                        Dashboard
                      </p>
                      <h3 className="text-base sm:text-lg font-semibold tracking-tight">
                        Welcome back, Amina
                      </h3>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-[10px] text-primary">
                      <TrendingUp className="w-3 h-3" />
                      +12% this week
                    </div>
                  </div>

                  {/* Metric cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Outstanding', value: 'KES 2.4M', trend: '+8%', color: 'text-foreground' },
                      { label: 'Overdue', value: '8', trend: '3 new', color: 'text-destructive' },
                      { label: 'Collected', value: '45%', trend: '+12%', color: 'text-success' },
                    ].map((m, i) => (
                      <div key={i} className="rounded-lg border border-border/60 bg-background/60 p-3">
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                          {m.label}
                        </p>
                        <p className={`text-sm sm:text-base font-semibold mt-1 ${m.color}`}>
                          {m.value}
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{m.trend}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart + list side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 flex-1">
                    {/* Chart */}
                    <div className="sm:col-span-3 rounded-lg border border-border/60 bg-background/60 p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-medium">Collections trend</p>
                        <p className="text-[9px] text-muted-foreground">Last 30 days</p>
                      </div>
                      <svg viewBox="0 0 300 100" className="w-full flex-1" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="oklch(0.588 0.233 293)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="oklch(0.588 0.233 293)" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,80 L30,72 L60,78 L90,60 L120,55 L150,45 L180,50 L210,35 L240,30 L270,20 L300,15 L300,100 L0,100 Z"
                          fill="url(#chart-fill)"
                        />
                        <path
                          d="M0,80 L30,72 L60,78 L90,60 L120,55 L150,45 L180,50 L210,35 L240,30 L270,20 L300,15"
                          fill="none"
                          stroke="oklch(0.588 0.233 293)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Recent list */}
                    <div className="sm:col-span-2 rounded-lg border border-border/60 bg-background/60 p-3">
                      <div className="flex items-center justify-between mb-2.5">
                        <p className="text-[10px] font-medium">Needs attention</p>
                        <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        {[
                          { name: 'John Mwangi', amt: 'KES 45K', status: '5d late' },
                          { name: 'Sarah Okoye', amt: 'KES 120K', status: '2d late' },
                          { name: 'David Otieno', amt: 'KES 8.2K', status: 'Due today' },
                        ].map((r, i) => (
                          <div key={i} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[8px] font-medium shrink-0">
                                {r.name.charAt(0)}
                              </div>
                              <p className="text-[10px] truncate">{r.name}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] font-medium">{r.amt}</p>
                              <p className="text-[8px] text-destructive/80">{r.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder ribbon — corner */}
            <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/80 backdrop-blur-md border border-border/60 text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
              <span className="w-1 h-1 rounded-full bg-warning animate-pulse" />
              Preview mock
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
