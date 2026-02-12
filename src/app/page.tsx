import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">GF</span>
            </div>
            <span className="text-lg font-bold text-gray-900">GrantFinder</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
          Find UK business grants
          <br />
          <span className="text-blue-600">matched to your company</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          GrantFinder searches government grant databases and uses your Companies
          House profile to find the most relevant funding opportunities for your
          business.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg">Start finding grants</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" size="lg">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="mx-auto h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Companies House Integration
            </h3>
            <p className="mt-2 text-gray-600">
              Automatically pull your company&apos;s SIC codes, industry
              classification, and profile from Companies House.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="mx-auto h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Multi-Source Search
            </h3>
            <p className="mt-2 text-gray-600">
              Search across UKRI Gateway to Research, Data.gov.uk, and more
              government databases simultaneously.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="mx-auto h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Smart Matching
            </h3>
            <p className="mt-2 text-gray-600">
              Get personalised recommendations based on your industry, company
              type, and business profile.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create an account",
                desc: "Sign up in seconds with your email address.",
              },
              {
                step: "2",
                title: "Link your company",
                desc: "Search for your company on Companies House and link it.",
              },
              {
                step: "3",
                title: "Search grants",
                desc: "Search across multiple government grant databases at once.",
              },
              {
                step: "4",
                title: "Save & apply",
                desc: "Bookmark relevant grants and apply directly through the funding body.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Powered by official UK government data
        </h2>
        <p className="text-gray-600 mb-8">
          We aggregate data from trusted government sources to give you the most
          comprehensive view of available grants.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <span className="font-medium">Companies House</span>
          <span className="text-gray-300">|</span>
          <span className="font-medium">UKRI Gateway to Research</span>
          <span className="text-gray-300">|</span>
          <span className="font-medium">Data.gov.uk</span>
          <span className="text-gray-300">|</span>
          <span className="font-medium">Innovate UK</span>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to find funding for your business?
        </h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          Join GrantFinder today and discover grants you never knew existed.
        </p>
        <Link href="/sign-up">
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Get started for free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>GrantFinder - Find UK business grants matched to your company.</p>
        </div>
      </footer>
    </div>
  );
}
