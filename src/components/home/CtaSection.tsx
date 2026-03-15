import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="absolute top-0 right-1/2 -mr-96 pt-32 hidden lg:block">
        <svg width="404" height="392" fill="none" viewBox="0 0 404 392" className="text-gray-100 opacity-50">
          <defs>
            <pattern id="8228f071-bcee-4ec8-90cb-a25ccaf10931" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
            </pattern>
          </defs>
          <rect width="404" height="392" fill="url(#8228f071-bcee-4ec8-90cb-a25ccaf10931)"></rect>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-brand-primary rounded-3xl shadow-xl overflow-hidden">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20 lg:flex lg:items-center">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Ready to make an impact?
              </h2>
              <p className="mt-4 max-w-3xl text-lg relative z-10 text-brand-subtle">
                Join our global community today. Sign up takes less than 2 minutes, and you can start participating in surveys immediately.
              </p>
              <div className="mt-10 sm:flex">
                <div className="rounded-md shadow">
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg transition"
                  >
                    Create Free Account
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-hover hover:bg-brand-accent1 md:py-4 md:text-lg transition"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
