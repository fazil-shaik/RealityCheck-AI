import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
            RealityCheck
          </div>
          <div className="flex items-center gap-6">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-stone-400">
                  {session.user.name}
                </span>
                {/* We would likely want a sign out button here, handled by a client component or link */}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-stone-200 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-amber-200/80 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            V 1.0 Public Beta
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent pb-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Validate Your Reality<br />
            <span className="text-stone-500">With AI Precision</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-stone-400 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Instant analysis of ideas, claims, and content. We combine advanced AI with real-time data verification to give you the truth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link
              href={session ? "/dashboard" : "/sign-in"}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg text-white font-medium hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-900/20 w-full sm:w-auto"
            >
              Start Analyzing Now
            </Link>
            <button className="px-8 py-4 bg-stone-900 border border-white/10 rounded-lg text-stone-300 font-medium hover:bg-stone-800 transition-colors w-full sm:w-auto">
              View Demo
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="container mx-auto max-w-6xl mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Real-time Verification",
              description: "Cross-reference claims against millions of trusted sources in milliseconds.",
              icon: (
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )
            },
            {
              title: "AI Analysis",
              description: "Deep learning models understand context, nuance, and potential bias.",
              icon: (
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )
            },
            {
              title: "Detailed Reports",
              description: "Get comprehensive breakdowns with citations and confidence scores.",
              icon: (
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-stone-900/50 border border-white/5 hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center mb-4 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-stone-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
