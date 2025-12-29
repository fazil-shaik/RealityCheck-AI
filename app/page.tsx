import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ModeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-300 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image src="/logo.svg" alt="Reality Check Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold font-heading">Reality
              <span className="text-primary">Check</span></span>
            <span className="text-xl font-bold font-heading text-primary">AI</span>

          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground hidden sm:inline-block">
                  {session.user.name}
                </span>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 md:pt-32 pb-16 px-6 flex-1">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <div
            data-aos="fade-up"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-primary mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            V 1.0 Public Beta
          </div>

          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading tracking-tight text-foreground pb-2">
            Validate Your Reality<br />
            <span className="text-muted-foreground">With AI Precision</span>
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Instant analysis of ideas, claims, and content. We combine advanced AI with real-time data verification to give you the truth.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href={session ? "/dashboard" : "/sign-in"}
              className="px-8 py-4 bg-gradient-to-r from-primary to-orange-600 rounded-lg text-primary-foreground font-medium hover:from-primary/90 hover:to-orange-500 transition-all shadow-lg shadow-primary/25 w-full sm:w-auto"
            >
              Start Analyzing Now
            </Link>
            <button className="px-8 py-4 bg-secondary border border-border rounded-lg text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors w-full sm:w-auto">
              View Demo
            </button>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="container mx-auto max-w-6xl mt-32 relative">
          <div data-aos="fade-up" className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground">How RealityCheck Works</h2>
            <p className="text-muted-foreground text-lg">From idea to brutal truth in three steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Connecting Line (Desktop) */}
            <div data-aos="fade-in" data-aos-duration="1500" className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

            {/* Step 1 */}
            <div data-aos="fade-up" data-aos-delay="0" className="relative group">
              <div className="w-24 h-24 mx-auto bg-card border border-border rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:border-primary/50 transition-colors z-20 relative">
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.854 1.566-2.126A6.016 6.016 0 0015 12.001a6.016 6.016 0 00-6 6.002c0 .983.658 1.854 1.566 2.126V18a3 3 0 00-3 3h9a3 3 0 00-3-3z" />
                </svg>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-bold text-secondary-foreground">1</div>
              </div>
              <div className="text-center px-4">
                <h3 className="text-xl font-bold text-foreground mb-2">Submit Your Idea</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Describe your startup concept, target market, and monetization strategy in plain English.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div data-aos="fade-up" data-aos-delay="200" className="relative group">
              <div className="w-24 h-24 mx-auto bg-card border border-border rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:border-blue-500/50 transition-colors z-20 relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-bold text-secondary-foreground">2</div>
              </div>
              <div className="text-center px-4">
                <h3 className="text-xl font-bold text-foreground mb-2">Agent Swarm Analysis</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  5 specialized AI agents (Market, Tech, Psychology) attack your idea to find hidden risks.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div data-aos="fade-up" data-aos-delay="400" className="relative group">
              <div className="w-24 h-24 mx-auto bg-card border border-border rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:border-emerald-500/50 transition-colors z-20 relative">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
                </svg>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-bold text-secondary-foreground">3</div>
              </div>
              <div className="text-center px-4">
                <h3 className="text-xl font-bold text-foreground mb-2">Get The Verdict</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Receive a deterministic success score (0-100%) and a final <span className="text-emerald-500 font-bold">PROCEED</span>, <span className="text-yellow-500 font-bold">PIVOT</span>, or <span className="text-destructive font-bold">KILL</span> decision.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Feature Grid */}
        <div className="container mx-auto max-w-6xl mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Real-time Verification",
              description: "Cross-reference claims against millions of trusted sources in milliseconds.",
              icon: (
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              )
            },
            {
              title: "AI Analysis",
              description: "Deep learning models understand context, nuance, and potential bias.",
              icon: (
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                </svg>
              )
            },
            {
              title: "Detailed Reports",
              description: "Get comprehensive breakdowns with citations and confidence scores.",
              icon: (
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              )
            }
          ].map((feature, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors shadow-sm">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 border border-border">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </main >

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            All rights reserved @realityCheckAI
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/Fazil-shaik"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/shaik-fazil=basha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-blue-500 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </footer>
    </div >
  );
}
