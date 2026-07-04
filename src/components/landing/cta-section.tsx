import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CTASection = () => {
  const router = useRouter();

  return (
    <section className="pt-24 sm:pt-32 pb-24 sm:pb-32 relative overflow-hidden">
      {/* Watercolor wash — mirrors hero */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-20 w-140 h-140 bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute -bottom-20 -left-20 w-125 h-125 bg-accent/12 rounded-full blur-[140px]" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-background to-transparent" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-[-0.03em]"
        >
          Stop chasing.
          <br />
          <span className="text-foreground/50">Start collecting.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto"
        >
          Set up your business in under 5 minutes. No credit card required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Button
            size="lg"
            onClick={() => router.push('/register')}
            className="rounded-full px-7 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all ring-1 ring-inset ring-white/10"
          >
            Start tracking debts
            <ArrowRight className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            Free forever · 14-day Growth trial
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
