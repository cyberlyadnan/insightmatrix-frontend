export default function TrustStats() {
  return (
    <section className="py-16 bg-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          <div>
            <div className="text-4xl font-extrabold text-white tracking-tight">2M+</div>
            <div className="mt-2 text-sm font-medium text-brand-light">Registered Users</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white tracking-tight">$15M</div>
            <div className="mt-2 text-sm font-medium text-brand-light">Rewards Paid Out</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white tracking-tight">120+</div>
            <div className="mt-2 text-sm font-medium text-brand-light">Countries Supported</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-white tracking-tight">4.8/5</div>
            <div className="mt-2 text-sm font-medium text-brand-light">Trustpilot Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
