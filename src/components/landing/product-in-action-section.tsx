import { motion } from 'framer-motion';
import {
  Users,
  Receipt,
  Wallet,
  BarChart3,
  Phone,
  Mail,
  MoreVertical,
  Search,
  Plus,
  ArrowUpRight,
} from 'lucide-react';

const features = [
  {
    label: 'Customers',
    icon: Users,
    title: 'Every customer, one profile.',
    description:
      'Track who owes what, contact history, and payment behavior in a single view. Notes, phone, business — all searchable.',
    preview: <CustomersPreview />,
  },
  {
    label: 'Debts',
    icon: Receipt,
    title: 'Never forget who to call.',
    description:
      'Log debts with due dates. CredFlow highlights what needs attention today — so nothing slips through.',
    preview: <DebtsPreview />,
  },
  {
    label: 'Payments',
    icon: Wallet,
    title: 'Match payments to debts, instantly.',
    description:
      'Record cash, transfer, or mobile money. Every payment updates the balance and generates a receipt automatically.',
    preview: <PaymentsPreview />,
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    title: 'See your cash flow at a glance.',
    description:
      'Collection rate, aging analysis, and risk trends. Know which customers are your growth — and which are your risk.',
    preview: <AnalyticsPreview />,
  },
];

const ProductInActionSection = () => {
  return (
    <section id="product" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20 sm:mb-24"
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
            Product
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold mt-4 leading-[1.05] tracking-[-0.02em]">
            Everything you need to get paid.
          </h2>
          <p className="text-lg text-muted-foreground mt-5">
            Four tools that work together. Built for the way African SMEs actually run.
          </p>
        </motion.div>

        {/* Feature rows */}
        <div className="space-y-24 sm:space-y-32">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isReversed = index % 2 === 1;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  isReversed ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                {/* Text */}
                <div className="max-w-md">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-border bg-muted/40 mb-5">
                    <Icon className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                    <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
                      {feature.label}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-semibold leading-[1.1] tracking-[-0.02em]">
                    {feature.title}
                  </h3>
                  <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <a
                    href="#"
                    className="mt-6 inline-flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all"
                  >
                    Learn more
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Preview */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-linear-to-tr from-primary/10 via-transparent to-accent/5 rounded-2xl blur-2xl opacity-70" />
                  <div className="relative rounded-2xl border border-border/60 bg-card/90 shadow-xl shadow-primary/5 overflow-hidden">
                    {feature.preview}
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

function CustomersPreview() {
  const rows = [
    { name: 'John Mwangi', amt: 'KES 45,000', badge: 'Overdue', tone: 'destructive' },
    { name: 'Sarah Okoye', amt: 'KES 120,000', badge: 'Due soon', tone: 'warning' },
    { name: 'David Otieno', amt: 'KES 8,200', badge: 'Current', tone: 'success' },
    { name: 'Grace Achieng', amt: 'KES 32,500', badge: 'Current', tone: 'success' },
  ];
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold">All customers</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-border/60 text-[10px] text-muted-foreground">
            <Search className="w-3 h-3" /> Search
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-foreground text-background text-[10px] font-medium">
            <Plus className="w-3 h-3" /> Add
          </div>
        </div>
      </div>
      <div className="divide-y divide-border/60">
        {rows.map((r, i) => (
          <div key={i} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
                {r.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-medium">{r.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                  <Phone className="w-2.5 h-2.5" />
                  <Mail className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold">{r.amt}</p>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                  r.tone === 'destructive'
                    ? 'bg-destructive/10 text-destructive'
                    : r.tone === 'warning'
                    ? 'bg-warning/15 text-warning'
                    : 'bg-success/10 text-success'
                }`}
              >
                {r.badge}
              </span>
              <MoreVertical className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DebtsPreview() {
  const debts = [
    { id: '#142', customer: 'John Mwangi', amt: 'KES 45,000', due: '5 days late', tone: 'destructive' },
    { id: '#141', customer: 'Sarah Okoye', amt: 'KES 120,000', due: 'Due today', tone: 'warning' },
    { id: '#140', customer: 'David Otieno', amt: 'KES 8,200', due: 'Due Dec 20', tone: 'muted' },
  ];
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold">Needs attention</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">3 debts require follow-up</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md border border-border/60 text-[10px]">
          Filter
        </div>
      </div>
      <div className="space-y-2">
        {debts.map((d, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-background/60">
            <div
              className={`w-1 h-10 rounded-full ${
                d.tone === 'destructive'
                  ? 'bg-destructive'
                  : d.tone === 'warning'
                  ? 'bg-warning'
                  : 'bg-muted-foreground/30'
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-muted-foreground">{d.id}</p>
                <p className="text-xs font-medium truncate">{d.customer}</p>
              </div>
              <p
                className={`text-[10px] mt-0.5 ${
                  d.tone === 'destructive'
                    ? 'text-destructive'
                    : d.tone === 'warning'
                    ? 'text-warning'
                    : 'text-muted-foreground'
                }`}
              >
                {d.due}
              </p>
            </div>
            <p className="text-xs font-semibold">{d.amt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsPreview() {
  return (
    <div className="p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold">Record payment</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">John Mwangi · Invoice #142</p>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-[10px] text-muted-foreground mb-1.5">Amount</p>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background/60">
            <span className="text-[10px] text-muted-foreground">KES</span>
            <span className="text-sm font-semibold">45,000</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">
              Full balance
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['Cash', 'Transfer', 'M-Pesa'].map((m, i) => (
            <div
              key={i}
              className={`text-center py-2 rounded-md border text-[10px] font-medium ${
                i === 2 ? 'border-foreground bg-foreground text-background' : 'border-border/60 text-muted-foreground'
              }`}
            >
              {m}
            </div>
          ))}
        </div>
        <div className="rounded-md border border-dashed border-border/70 bg-muted/20 p-3 flex items-center gap-2 text-[10px] text-muted-foreground">
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
            <Receipt className="w-3 h-3" />
          </div>
          <div>
            <p className="font-medium text-foreground">Receipt auto-generated</p>
            <p className="text-[9px]">Sent to John via SMS + email</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPreview() {
  const bars = [40, 65, 55, 78, 72, 88, 92, 85, 95];
  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Collection rate
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-semibold tracking-tight">87%</p>
            <p className="text-[11px] text-success font-medium">+12% vs last month</p>
          </div>
        </div>
        <div className="flex gap-1">
          {['7D', '30D', '90D'].map((r, i) => (
            <span
              key={r}
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                i === 1 ? 'bg-foreground text-background' : 'text-muted-foreground'
              }`}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-2 h-24 mb-3">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <div
              className={`rounded-sm ${
                i === bars.length - 1 ? 'bg-primary' : 'bg-primary/25'
              }`}
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/60">
        {[
          { label: 'On time', val: '68%' },
          { label: 'Late', val: '24%' },
          { label: 'Overdue', val: '8%' },
        ].map((s, i) => (
          <div key={i}>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
            <p className="text-xs font-semibold mt-0.5">{s.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductInActionSection;
