import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

type Status = 'shipped' | 'soon' | 'roadmap';

const items: { label: string; status: Status }[] = [
  { label: 'Customer profiles', status: 'shipped' },
  { label: 'Debt tracking', status: 'shipped' },
  { label: 'Payment recording', status: 'shipped' },
  { label: 'Dashboard & KPIs', status: 'shipped' },
  { label: 'Analytics reports', status: 'shipped' },
  { label: 'Receipt generation', status: 'shipped' },
  { label: 'CSV import', status: 'shipped' },
  { label: 'Dark mode', status: 'shipped' },

  { label: 'SMS reminders', status: 'soon' },
  { label: 'M-Pesa integration', status: 'soon' },
  { label: 'Team seats', status: 'soon' },
  { label: 'Bulk actions', status: 'soon' },

  { label: 'WhatsApp reminders', status: 'roadmap' },
  { label: 'Offline mode', status: 'roadmap' },
  { label: 'Multi-currency', status: 'roadmap' },
  { label: 'Audit logs', status: 'roadmap' },
  { label: 'API access', status: 'roadmap' },
  { label: 'Mobile app', status: 'roadmap' },
];

const RoadmapSection = () => {
  return (
    <section id="roadmap" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
            Roadmap
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold mt-4 leading-[1.05] tracking-[-0.02em]">
            Shipped, shipping, on the way.
          </h2>
          <p className="text-lg text-muted-foreground mt-5">
            We build in public. Here&apos;s exactly what&apos;s live, what&apos;s next, and what&apos;s coming later.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-border bg-card/60 p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-3">
            {items.map((item, i) => (
              <RoadmapItem key={i} item={item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

function RoadmapItem({ item }: { item: { label: string; status: Status } }) {
  if (item.status === 'shipped') {
    return (
      <div className="flex items-center gap-2.5 py-1.5">
        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />
        </div>
        <span className="text-sm text-foreground">{item.label}</span>
      </div>
    );
  }
  if (item.status === 'soon') {
    return (
      <div className="flex items-center gap-2.5 py-1.5">
        <div className="w-4 h-4 rounded-full border border-primary/40 bg-primary/10 shrink-0" />
        <span className="text-sm text-foreground/80">{item.label}</span>
        <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
          Soon
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5 py-1.5 opacity-50">
      <div className="w-4 h-4 rounded-full border border-border shrink-0" />
      <span className="text-sm text-muted-foreground">{item.label}</span>
      <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
        On roadmap
      </span>
    </div>
  );
}

export default RoadmapSection;
