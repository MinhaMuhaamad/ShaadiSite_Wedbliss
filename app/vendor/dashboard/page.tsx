export default function VendorDashboardPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-input bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">Vendor Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-foreground">Service Provider Control Center</h1>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              Photographers, caterers, decorators, DJs, makeup artists, and venue managers can manage profiles, respond to bookings,
              chat with brides, and upload contracts in one centralized place.
            </p>
            <div className="rounded-3xl bg-muted p-6">             
              <h2 className="text-lg font-semibold text-foreground">What you can do here</h2>
              <ul className="mt-4 space-y-3 text-sm text-foreground/90">
                <li className="rounded-2xl border border-input bg-background p-4 shadow-sm">
                  <strong className="block font-medium">Manage your profile</strong>
                  Update your business details, service categories, pricing, and availability so brides can find you easily.
                </li>
                <li className="rounded-2xl border border-input bg-background p-4 shadow-sm">
                  <strong className="block font-medium">Respond to bookings</strong>
                  View and accept booking requests, confirm availability, and keep event plans moving forward.
                </li>
                <li className="rounded-2xl border border-input bg-background p-4 shadow-sm">
                  <strong className="block font-medium">Chat with brides</strong>
                  Discuss event details, send updates, and clarify requests directly from your dashboard.
                </li>
                <li className="rounded-2xl border border-input bg-background p-4 shadow-sm">
                  <strong className="block font-medium">Upload contracts</strong>
                  Share quotes, agreements, and booking documents securely for every event.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-input bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Service Provider Categories</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Use this dashboard to represent your service category and stay connected with brides who need your expertise.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                'Photographers',
                'Caterers',
                'Decorators',
                'DJs',
                'Makeup Artists',
                'Venue Managers'
              ].map((service) => (
                <div key={service} className="rounded-2xl border border-input bg-background px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{service}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-input bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground">Your next steps</h2>
            <ol className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">1.</span> Complete your vendor profile with images, services, and pricing.
              </li>
              <li>
                <span className="font-medium text-foreground">2.</span> Check booking requests and reply quickly to stay top of mind.
              </li>
              <li>
                <span className="font-medium text-foreground">3.</span> Open conversations with brides and clarify event requirements.
              </li>
              <li>
                <span className="font-medium text-foreground">4.</span> Upload your contracts and keep documents organized per booking.
              </li>
            </ol>
          </article>
        </section>
      </div>
    </main>
  );
}
