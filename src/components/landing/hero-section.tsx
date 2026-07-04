import { motion } from 'framer-motion';

const tags = [
  'retail',
  'wholesale',
  'services',
  'agriculture',
  'manufacturing',
  'exports',
];

const tiles = [
  { label: 'Dashboard', bg: 'bg-[oklch(0.28_0.09_293)]', text: 'text-white', accent: 'bg-primary/60' },
  { label: 'Customers', bg: 'bg-[oklch(0.94_0.04_75)]', text: 'text-foreground', accent: 'bg-warning/50' },
  { label: 'Debts', bg: 'bg-foreground', text: 'text-background', accent: 'bg-destructive/60' },
  { label: 'Payments', bg: 'bg-[oklch(0.9_0.06_145)]', text: 'text-foreground', accent: 'bg-success/50' },
  { label: 'Analytics', bg: 'bg-[oklch(0.35_0.07_254)]', text: 'text-white', accent: 'bg-info/60' },
  { label: 'Reports', bg: 'bg-[oklch(0.92_0.04_350)]', text: 'text-foreground', accent: 'bg-accent/40' },
  { label: 'Reminders', bg: 'bg-[oklch(0.95_0.03_293)]', text: 'text-foreground', accent: 'bg-primary/30' },
  { label: 'Receipts', bg: 'bg-[oklch(0.22_0.02_264)]', text: 'text-white', accent: 'bg-muted-foreground/40' },
];

const HeroSection = () => {
  return (
    <section className="relative pt-32 sm:pt-40 pb-16 overflow-hidden">
      {/* Subtle top glow only */}
      <div className="absolute inset-x-0 top-0 -z-10 h-96 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-160 h-96 bg-primary/8 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quote */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-5xl sm:text-6xl lg:text-[5rem] leading-[1.05] text-center text-foreground max-w-4xl mx-auto tracking-tight"
        >
          &ldquo;Know exactly who owes you<br className="hidden sm:block" /> — and when they&rsquo;ll pay.&rdquo;
        </motion.h1>

        {/* Attribution */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 text-center text-base sm:text-lg font-semibold text-foreground"
        >
          — Built for African SMEs
        </motion.p>

        {/* Chip pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
        >
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background/60 backdrop-blur-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-default"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom tile row */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55 }}
        className="mt-20 sm:mt-24 max-w-7xl mx-auto px-2 sm:px-3"
      >
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-1.5 sm:gap-2">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.05 }}
              whileHover={{ y: -4 }}
              className={`group relative aspect-3/4 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer ${tile.bg}`}
            >
              {/* Abstract art per tile */}
              <TileArt label={tile.label} accent={tile.accent} textColor={tile.text} />

              {/* Label bottom-left */}
              <div className={`absolute bottom-2 left-2 sm:bottom-3 sm:left-3 ${tile.text}`}>
                <p className="text-[10px] sm:text-xs font-medium tracking-tight">
                  {tile.label}
                </p>
              </div>

              {/* Subtle top-right marker on hover */}
              <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 rounded-full ${tile.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

function TileArt({
  label,
  accent,
  textColor,
}: {
  label: string;
  accent: string;
  textColor: string;
}) {
  const isDark = textColor === 'text-white' || textColor === 'text-background';
  const strokeColor = isDark ? 'stroke-white/25' : 'stroke-foreground/20';
  const fillColor = isDark ? 'fill-white/20' : 'fill-foreground/15';

  if (label === 'Dashboard') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="none">
        <path
          d="M5 90 Q 25 60, 50 65 T 95 30"
          className={strokeColor}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="95" cy="30" r="3" className={fillColor} />
      </svg>
    );
  }
  if (label === 'Customers') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="none">
        {[
          { x: 30, y: 40 },
          { x: 55, y: 55 },
          { x: 40, y: 75 },
          { x: 65, y: 85 },
        ].map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="8" className={fillColor} />
        ))}
      </svg>
    );
  }
  if (label === 'Debts') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="none">
        {[35, 55, 75].map((y, i) => (
          <rect key={i} x="18" y={y} width="64" height="10" rx="2" className={fillColor} />
        ))}
      </svg>
    );
  }
  if (label === 'Payments') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="none">
        <path
          d="M28 65 L 45 82 L 74 50"
          className={strokeColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (label === 'Analytics') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="none">
        {[
          { x: 20, h: 30 },
          { x: 35, h: 50 },
          { x: 50, h: 40 },
          { x: 65, h: 65 },
          { x: 80, h: 55 },
        ].map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={95 - b.h}
            width="8"
            height={b.h}
            rx="1"
            className={fillColor}
          />
        ))}
      </svg>
    );
  }
  if (label === 'Reports') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="none">
        <circle
          cx="50"
          cy="65"
          r="22"
          fill="none"
          strokeWidth="8"
          className={strokeColor}
        />
        <path
          d="M50 43 A 22 22 0 0 1 72 65"
          fill="none"
          strokeWidth="8"
          className={strokeColor}
          strokeOpacity="0.7"
        />
      </svg>
    );
  }
  if (label === 'Reminders') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="none">
        <circle cx="50" cy="60" r="18" fill="none" strokeWidth="2" className={strokeColor} />
        <line
          x1="50"
          y1="60"
          x2="50"
          y2="46"
          className={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="60"
          x2="60"
          y2="63"
          className={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (label === 'Receipts') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 130" preserveAspectRatio="none">
        <path
          d="M28 25 L 72 25 L 72 95 L 62 87 L 50 95 L 38 87 L 28 95 Z"
          fill="none"
          strokeWidth="1.5"
          className={strokeColor}
        />
        <line x1="36" y1="45" x2="64" y2="45" strokeWidth="1.5" className={strokeColor} />
        <line x1="36" y1="58" x2="58" y2="58" strokeWidth="1.5" className={strokeColor} />
        <line x1="36" y1="71" x2="64" y2="71" strokeWidth="1.5" className={strokeColor} />
      </svg>
    );
  }
  return <div className={`absolute inset-0 ${accent} opacity-20`} />;
}

export default HeroSection;
