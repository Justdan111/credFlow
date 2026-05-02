const ScreenshotsSection = () => {
  const previews = [
    { title: 'Dashboard', desc: 'Overview and key metrics' },
    { title: 'Customers', desc: 'Profiles, debts and payments' },
    { title: 'Payments', desc: 'Reconciliation and receipts' },
  ]

  return (
    <section id="screenshots" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Product previews</h2>
          <p className="text-muted-foreground mt-2">Screenshots that show CredFlow in action.</p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {previews.map((p) => (
            <div key={p.title} className="rounded-lg overflow-hidden shadow-sm bg-linear-to-br from-primary/10 to-accent/10 p-6">
              <div className="h-40 bg-linear-to-r from-primary/20 to-accent/20 rounded-md flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm mt-1">{p.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ScreenshotsSection
