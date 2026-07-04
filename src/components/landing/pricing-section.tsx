import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PricingSection = () => {
  const router = useRouter();

  const tiers = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'For sole traders just getting started.',
      features: [
        'Up to 50 customers',
        'Unlimited debts & payments',
        'Basic reports',
        'Email support',
      ],
      cta: 'Start free',
      popular: false,
    },
    {
      name: 'Growth',
      price: '₦9,900',
      period: '/month',
      description: 'For growing businesses that need automation.',
      features: [
        'Up to 2,000 customers',
        'SMS & email reminders',
        'CSV import & export',
        'Analytics dashboard',
        'Priority support',
      ],
      cta: 'Start 14-day trial',
      popular: true,
    },
    {
      name: 'Business',
      price: 'Custom',
      period: 'contact us',
      description: 'For teams with heavy collection volume.',
      features: [
        'Unlimited customers',
        'Team seats & roles',
        'Custom reports',
        'Dedicated onboarding',
        'SLA support',
      ],
      cta: 'Contact sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold mt-4 leading-[1.05] tracking-[-0.02em]">
            Simple pricing.
            <br />
            <span className="text-foreground/50">Grow at your own pace.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 sm:p-8 flex flex-col ${
                tier.popular
                  ? 'border-2 border-primary/50 bg-card shadow-xl shadow-primary/10'
                  : 'border border-border bg-card/60'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium uppercase tracking-widest">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-semibold">{tier.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{tier.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
                  <span className="text-xs text-muted-foreground">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/85">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-primary" strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.popular ? 'default' : 'outline'}
                onClick={() => router.push('/register')}
                className={`rounded-full h-10 w-full ${
                  tier.popular ? 'shadow-md shadow-primary/25 ring-1 ring-inset ring-white/10' : ''
                }`}
              >
                {tier.cta}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
