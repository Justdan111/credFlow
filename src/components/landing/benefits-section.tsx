import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Variants } from 'framer-motion';

const BenefitsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    'Real-time debt tracking and notifications',
    'Automated payment reminders via SMS & email',
    'Risk-based customer segmentation',
    'Detailed financial reports and forecasts',
  ];

  const stats = [
    { label: 'Outstanding Debts', value: '₦2.5M', color: 'primary' },
    { label: 'Collected This Month', value: '₦850K', color: 'success' },
    { label: 'Recovery Rate', value: '94%', color: 'accent' },
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="benefits" className="py-24 sm:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Benefits</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
                Why Choose CredFlow?
              </h2>
              <p className="text-lg text-muted-foreground">
                Trusted by SMEs across Africa to streamline debt management and improve cash flow.
              </p>
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-4 group cursor-pointer"
                >
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                  </div>
                  <p className="text-foreground group-hover:text-primary transition-colors">
                    {benefit}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button variant="default" size="lg">
                Start Your Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right stats cards */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl" />
            
            <div className="relative p-8 space-y-4">
              {stats.map((stat, index) => {
                const colorClasses = {
                  primary: 'border-l-primary text-primary',
                  success: 'border-l-success text-success',
                  accent: 'border-l-accent text-accent',
                };
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                    whileHover={{ scale: 1.02, x: 8 }}
                  >
                    <Card className={`p-5 border-l-4 ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[0]}`}>
                      <p className="font-medium text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`text-3xl font-bold mt-1 ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[1]}`}>
                        {stat.value}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
