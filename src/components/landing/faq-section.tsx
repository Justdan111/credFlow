const FAQSection = () => {
  const faqs = [
    {
      q: 'How does billing work?',
      a: 'We bill monthly. Upgrading or downgrading adjusts next invoice prorated accordingly.',
    },
    {
      q: 'Can I import my customer list?',
      a: 'Yes — Growth and Business plans support CSV import for customers and debts.',
    },
    {
      q: 'Is my data secure?',
      a: 'We use encrypted storage and follow industry best-practices for data protection.',
    },
  ]

  return (
    <section id="faq" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <p className="text-muted-foreground mt-2">Answers to common questions about CredFlow.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="p-4 border rounded-md">
              <summary className="font-medium cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
