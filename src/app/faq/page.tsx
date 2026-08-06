export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">FAQs</h1>
        <div className="mt-6 space-y-4 text-slate-600">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">How do I register as an artisan?</h2>
            <p className="mt-2">Go to Register and select Artisan Registration to complete your profile.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Can customers book services directly?</h2>
            <p className="mt-2">Yes. Customers can browse categories and request artisans once logged in.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
