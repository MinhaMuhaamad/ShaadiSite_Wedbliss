export default function VendorDashboardPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl border border-input bg-card p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-foreground">Vendor Dashboard</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Welcome to your vendor dashboard. Use the navigation menu to manage your bookings, services, and profile.
          </p>
        </div>
      </div>
    </main>
  );
}
