import { motion } from 'framer-motion';
import { UserPlus, Receipt, CheckCircle2, Phone, Calendar, TrendingUp } from 'lucide-react';

const QuickStartSection = () => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Add a customer',
      description:
        'Save their name, phone, and business details in seconds. No spreadsheets.',
      preview: (
        <div className="space-y-2">
          <div className="rounded-md border border-border/70 bg-background/80 p-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[9px] font-medium">
              JM
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-1.5 rounded-sm bg-foreground/70 w-20 mb-1" />
              <div className="h-1 rounded-sm bg-muted-foreground/40 w-24 flex items-center gap-1">
                <Phone className="w-2 h-2 shrink-0 ml-0.5" />
              </div>
            </div>
            <div className="text-[8px] px-1.5 py-0.5 rounded bg-success/15 text-success font-medium">
              Saved
            </div>
          </div>
          <div className="rounded-md border border-dashed border-border/70 bg-background/40 p-2 flex items-center gap-2 opacity-60">
            <div className="w-6 h-6 rounded-full bg-muted" />
            <div className="flex-1">
              <div className="h-1.5 rounded-sm bg-muted-foreground/30 w-16" />
            </div>
            <span className="text-[8px] text-muted-foreground">+ Add</span>
          </div>
        </div>
      ),
    },
    {
      number: '02',
      icon: Receipt,
      title: 'Record what they owe',
      description:
        'Log the debt, set the due date, and CredFlow tracks the rest for you.',
      preview: (
        <div className="space-y-1.5">
          <div className="rounded-md border border-border/70 bg-background/80 p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-primary" />
              <div>
                <div className="text-[9px] font-medium">Invoice #142</div>
                <div className="text-[8px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-2 h-2" />
                  Due Dec 12
                </div>
              </div>
            </div>
            <div className="text-[10px] font-semibold text-foreground">₦45,000</div>
          </div>
          <div className="rounded-md border border-border/70 bg-background/80 p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-warning" />
              <div>
                <div className="text-[9px] font-medium">Invoice #141</div>
                <div className="text-[8px] text-warning">2 days late</div>
              </div>
            </div>
            <div className="text-[10px] font-semibold">₦120K</div>
          </div>
        </div>
      ),
    },
    {
      number: '03',
      icon: CheckCircle2,
      title: 'Get paid & track it',
      description:
        'Record payments as they come in and watch your cash flow come alive.',
      preview: (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[9px] text-muted-foreground">This month</div>
            <div className="flex items-center gap-1 text-[9px] text-success font-medium">
              <TrendingUp className="w-2.5 h-2.5" />
              +34%
            </div>
          </div>
          <div className="text-sm font-semibold">₦1.8M</div>
          <div className="flex items-end gap-1 h-10">
            {[35, 55, 40, 70, 60, 85, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div
                  className="rounded-sm bg-primary/30"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[8px] text-muted-foreground">
            <span>Mon</span>
            <span>Sun</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
            Quick start
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold mt-4 leading-[1.05] tracking-[-0.02em]">
            Your first collection in 5 minutes.
          </h2>
          <p className="text-lg text-muted-foreground mt-5">
            No setup calls. No training. Just three steps to start recovering what
            you&apos;re owed.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Connector arrow — desktop only, not on last */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-9 -right-4 lg:-right-5 z-10 items-center justify-center text-muted-foreground/40">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </div>
                )}

                <div className="h-full rounded-2xl border border-border bg-card p-6 sm:p-7 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                  {/* Number + divider + icon */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-mono text-muted-foreground tracking-[0.15em]">
                      {step.number}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                      <Icon className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold tracking-tight mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Rich UI mock preview */}
                  <div className="mt-6 rounded-xl border border-border/60 bg-muted/20 p-3 min-h-31">
                    {step.preview}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickStartSection;
