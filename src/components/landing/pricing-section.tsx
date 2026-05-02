import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const PricingSection = () => {
  const tiers = [
    {
      name: 'Starter',
      price: 'Free',
      bullets: ['Up to 50 customers', 'Basic reports', 'Email support'],
    },
    {
      name: 'Growth',
      price: '₦9,900/mo',
      bullets: ['Up to 2,000 customers', 'Automated reminders', 'CSV import'],
      popular: true,
    },
    {
      name: 'Business',
      price: 'Contact us',
      bullets: ['Unlimited customers', 'Custom reports', 'SLA & onboarding'],
    },
  ]

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Simple pricing for every stage</h2>
          <p className="text-muted-foreground mt-2">Compare plans and pick the one that fits your business.</p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`p-6 rounded-lg ${tier.popular ? 'ring-2 ring-primary' : ''}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <span className="text-2xl font-bold">{tier.price}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {tier.bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
              <div className="mt-6">
                <Button variant={tier.popular ? 'primary' : 'default'}>
                  {tier.popular ? 'Get Growth' : tier.price === 'Free' ? 'Start free' : 'Contact sales'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
