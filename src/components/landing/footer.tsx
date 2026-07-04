import { Wallet } from 'lucide-react';

const Footer = () => {
  const columns = [
    {
      heading: 'Product',
      links: [
        { label: 'How it works', href: '#how' },
        { label: 'Features', href: '#product' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Roadmap', href: '#roadmap' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
      ],
    },
    {
      heading: 'Socials',
      links: [
        { label: 'X (Twitter)', href: '#' },
        { label: 'LinkedIn', href: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                <Wallet className="w-4 h-4 text-background" strokeWidth={2} />
              </div>
              <span className="font-semibold tracking-tight">CredFlow</span>
            </a>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-55">
              Smart debt tracking for African SMEs.
            </p>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-medium mb-4">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 CredFlow. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for African SMEs · Made with care
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
