import { Card } from '@/components/ui/card'

const TestimonialsSection = () => {
  const items = [
    {
      quote:
        'CredFlow helped us reduce outstanding balances by 42% in three months — their reminders and easy reconciliation are game changers.',
      name: 'Amaka Johnson',
      company: 'Kadi Foods',
    },
    {
      quote:
        'The analytics and export tools make our month-end so much faster. Support was helpful during onboarding.',
      name: 'Samuel Okon',
      company: 'Okon Logistics',
    },
    {
      quote: 'Simple, reliable, and tailored to our SME needs. The payments UI is crisp.',
      name: 'Aisha Bello',
      company: 'Bello Traders',
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">What customers say</h2>
          <p className="text-muted-foreground mt-2">Real results from real businesses using CredFlow.</p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {items.map((t, i) => (
            <Card key={i} className="p-6">
              <blockquote className="text-sm text-foreground">“{t.quote}”</blockquote>
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs">{t.company}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
