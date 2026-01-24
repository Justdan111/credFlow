'use client';

import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideUp';
}

export function AnimatedCard({
  children,
  delay = 0,
  className = '',
  animation = 'fadeInUp',
}: AnimatedCardProps) {
  return (
    <Card
      className={`animate-${animation}  hover:border-purple-300 hover:shadow-lg transition-all duration-300 ${className}`}
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: 'both',
      }}
    >
      {children}
    </Card>
  );
}
