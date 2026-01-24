'use client';

import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReactNode } from 'react';

interface AnimatedTableProps {
  headers: string[];
  rows: Array<{ id: string | number; cells: ReactNode[] }>;
  className?: string;
}

export function AnimatedTable({ headers, rows, className = '' }: AnimatedTableProps) {
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={tableVariants}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="font-semibold">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <motion.tr
                key={row.id}
                variants={rowVariants}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                className="hover:bg-muted/50 border-b transition-colors"
              >
                {row.cells.map((cell, idx) => (
                  <TableCell key={idx} className="py-4">
                    {cell}
                  </TableCell>
                ))}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
