import { motion } from 'framer-motion';
import { MessageSquare, NotebookPen, FileSpreadsheet, PhoneOff, Check } from 'lucide-react';

const BeforeAfterSection = () => {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
            Before &amp; after
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold mt-4 leading-[1.05] tracking-[-0.02em]">
            From scattered chaos to
            <br />
            <span className="text-foreground/50">one clean dashboard.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl border border-border bg-muted/20 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Before
              </span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground">Everyone else</span>
            </div>
            <h3 className="text-xl font-semibold mb-6 text-foreground/70">
              Debts everywhere. Answers nowhere.
            </h3>
            <div className="space-y-3">
              {[
                { icon: MessageSquare, text: 'Payment promises buried in WhatsApp threads' },
                { icon: NotebookPen, text: 'Amounts scribbled in notebooks — sometimes lost' },
                { icon: FileSpreadsheet, text: 'Spreadsheets that never quite match reality' },
                { icon: PhoneOff, text: 'Forgotten follow-ups, awkward reminders' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/40 border border-border/40"
                  >
                    <div className="w-8 h-8 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground">
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </div>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative rounded-2xl border border-primary/20 bg-card p-6 sm:p-8 shadow-lg shadow-primary/5"
          >
            <div className="absolute -inset-1 bg-linear-to-tr from-primary/10 via-transparent to-accent/5 rounded-2xl blur-xl opacity-70 -z-10" />
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-primary font-medium">
                After
              </span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground">With CredFlow</span>
            </div>
            <h3 className="text-xl font-semibold mb-6">
              Every debt tracked. Every payment recorded.
            </h3>
            <div className="space-y-3">
              {[
                'One dashboard for every customer, debt, and payment',
                'Automatic reminders — no more awkward chase calls',
                'Receipts sent instantly by SMS and email',
                'Real numbers you can trust for cash flow decisions',
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border border-border/40"
                >
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm text-foreground">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
