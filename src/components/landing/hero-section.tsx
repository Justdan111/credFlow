import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Users, TrendingUp, BarChart3, DollarSign } from 'lucide-react';
import type { Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
    const router = useRouter();
  const floatingCards = [
    { icon: Users, label: '250 Customers', color: 'primary', delay: 0.2 },
    { icon: TrendingUp, label: '+45% Collections', color: 'success', delay: 0.3 },
    { icon: BarChart3, label: 'Real-time Analytics', color: 'accent', delay: 0.4 },
    { icon: DollarSign, label: 'Cash Flow Ready', color: 'warning', delay: 0.5 },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Decorative blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 right-0 w-125 h-125 bg-primary rounded-full blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-0 left-0 w-100 h-100 bg-accent rounded-full blur-[100px]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">For African SMEs</span>
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
            >
              Track Customer Debts{' '}
              <span className="text-gradient">Smarter and Faster</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-lg"
            >
              A smart fintech tool for African SMEs to manage customer debts, payment histories, and cash flow with confidence and ease.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="default" size="lg" onClick={() => router.push('/register')}>
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push('/login')}>
                Login to Dashboard
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-semibold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold">500+ SMEs</p>
                <p className="text-muted-foreground">trust CredFlow daily</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right illustration */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-100 lg:h-125"
          >
            {/* Background card */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-accent/5 rounded-3xl border border-primary/10" />
            
            {/* Floating cards grid */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {floatingCards.map((card, index) => {
                  const Icon = card.icon;
                  const colorClasses = {
                    primary: 'bg-primary/10 text-primary border-l-primary',
                    success: 'bg-success/10 text-success border-l-success',
                    accent: 'bg-accent/10 text-accent border-l-accent',
                    warning: 'bg-warning/10 text-warning border-l-warning',
                  };
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: card.delay,
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Card className={`p-4 border-l-4 ${colorClasses[card.color as keyof typeof colorClasses].split(' ').pop()}`}>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${colorClasses[card.color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-semibold">{card.label}</p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-3xl border border-primary/20"
              animate={{ 
                boxShadow: ['0 0 0 0 hsl(var(--primary) / 0)', '0 0 0 20px hsl(var(--primary) / 0)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
