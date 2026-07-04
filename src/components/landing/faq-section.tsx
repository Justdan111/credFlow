'use client';

import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'Do I need to be online to record a debt or payment?',
    a: 'Right now CredFlow needs an internet connection to sync your data across devices. Offline mode is on our roadmap and coming later this year.',
  },
  {
    q: 'Which payment providers do you support?',
    a: 'You can record payments made via Paystack, Flutterwave, OPay, bank transfer, or cash today. Direct auto-matching for Paystack and Flutterwave is shipping soon.',
  },
  {
    q: 'How is my customer data protected?',
    a: 'All data is encrypted in transit and at rest. We follow industry standard security practices and never share your customer records with third parties.',
  },
  {
    q: 'Can I invite my team?',
    a: 'Team seats and role-based permissions are coming soon on the Growth and Business plans. Everyone in your business will get their own login with the right access.',
  },
  {
    q: 'Do you work with NGN and other currencies?',
    a: 'CredFlow is built for Naira first — that&apos;s our primary supported currency today. Multi-currency support for businesses that trade across borders is on the roadmap.',
  },
  {
    q: 'What happens after the free trial?',
    a: 'You keep all your data. If you don’t upgrade, your account moves to the Starter plan (free, up to 50 customers). No credit card is required to start.',
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 sm:py-32 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold mt-4 leading-[1.05] tracking-[-0.02em]">
            Questions, answered.
          </h2>
        </motion.div>

        <div className="divide-y divide-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-5 text-left group"
                >
                  <span className="text-base sm:text-lg font-medium group-hover:text-foreground transition-colors">
                    {f.q}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover:border-foreground/40">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-6 pr-14">
                    {f.a}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
