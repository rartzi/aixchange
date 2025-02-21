"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Stats {
  solutions: {
    total: number;
    active: number;
    pending: number;
  };
  community: {
    members: number;
  };
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex items-center justify-between">
        <div className="max-w-xl">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-primary font-semibold">🚀 Now in Beta</span>
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-4">
            Accelerate Your AI Innovation Journey
          </h1>
          <h2 className="text-4xl font-bold text-gradient-primary mb-6">
            1000 Tiny Innovations Start Here
          </h2>
          <p className="text-muted-foreground text-xl mb-8">
            (AI)Xplore unites a dynamic (AI)Xchange, hands-on (AI)Xperiment, and thriving community 
            to turn everyday ideas into breakthrough AI solutions.
          </p>
          <div className="flex gap-4">
            <Link
              href="/solutions"
              className="btn-primary text-lg"
            >
              Browse Solutions
            </Link>
            <Link
              href={`/register?callbackUrl=${encodeURIComponent(pathname)}`}
              className="btn-secondary text-lg"
            >
              Join Community
            </Link>
          </div>
        </div>
        <div className="relative w-[500px] h-[500px]">
          <Image
            src="/robot-surfer.jpg"
            alt="AI Robot Surfing"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain rounded-2xl"
            priority
            quality={90}
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How (AI)Xplore Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Discover</h3>
              <p className="text-muted-foreground">
                Browse our (AI)Xchange of AI solutions and find the perfect match for your needs
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Experiment</h3>
              <p className="text-muted-foreground">
                Test and customize solutions in our (AI)Xperiment environment with zero setup required
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Innovate</h3>
              <p className="text-muted-foreground">
                Deploy your solutions and contribute back to the community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose (AI)Xplore</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-card border border-border card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">Vibrant Community</h3>
              <p className="text-muted-foreground">
                Join a network of AI innovators, participate in hackathons, and share knowledge through weekly sessions.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-card border border-border card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">Innovation Hub</h3>
              <p className="text-muted-foreground">
                Access our (AI)Xperiment, development tools, and resources to build and test solutions quickly.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-card border border-border card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">(AI)Xchange</h3>
              <p className="text-muted-foreground">
                Browse, deploy, and monetize AI solutions with our app-store-like (AI)Xchange experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">
                {isLoading ? (
                  <span className="opacity-50">Loading...</span>
                ) : (
                  stats?.community.members ?? 0
                )}
              </div>
              <div className="text-white/80">Community Members</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">
                {isLoading ? (
                  <span className="opacity-50">Loading...</span>
                ) : (
                  stats?.solutions.total ?? 0
                )}
              </div>
              <div className="text-white/80">AI Solutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-bold text-card-foreground mb-4">
            Ready to Join the AI Innovation Wave?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your journey today and be part of the next generation of AI innovation.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={`/register?callbackUrl=${encodeURIComponent(pathname)}`}
              className="btn-primary text-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/solutions"
              className="btn-secondary text-lg"
            >
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">(AI)Xplore</h3>
              <p className="text-muted-foreground">
                Transforming ideas into AI innovations, one solution at a time.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/solutions"
                    className="text-muted-foreground hover:text-primary"
                  >
                    (AI)Xchange
                  </Link>
                </li>
                <li>
                  <Link 
                    href="https://n8n.aixplore.odsp.astrazeneca.net" 
                    className="text-muted-foreground hover:text-primary"
                  >
                    (AI)Xperiment
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/events" 
                    className="text-muted-foreground hover:text-primary"
                  >
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Community</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><Link href="/docs" className="text-muted-foreground hover:text-primary">Documentation</Link></li>
                <li><Link href="/support" className="text-muted-foreground hover:text-primary">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} (AI)Xplore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
