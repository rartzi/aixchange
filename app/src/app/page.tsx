"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex items-center justify-between">
        <div className="max-w-xl">
          <h1 className="text-6xl font-bold text-foreground mb-4">
            The Perfect AI Wave is Here.
          </h1>
          <h2 className="text-4xl font-bold text-gradient-primary mb-6">
            AiXplore gets you on board.
          </h2>
          <p className="text-muted-foreground text-xl mb-8">
            AiXplore helps you catch and ride the wave of artificial intelligence innovation.
          </p>
          <Link
            href="/playground"
            className="btn-primary text-lg"
          >
            Try AI Playground
          </Link>
        </div>
        <div className="relative w-[500px] h-[500px]">
          <Image
            src="/robot-surfer.jpg"
            alt="AI Robot Surfing"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain"
            priority
            quality={90}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-card border border-border card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">Community-Driven</h3>
              <p className="text-muted-foreground">
                Connect with AI enthusiasts, share knowledge, and collaborate on innovative projects.
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
                Access cutting-edge AI tools, resources, and a marketplace for solutions.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-card border border-border card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">Solution Marketplace</h3>
              <p className="text-muted-foreground">
                Discover, share, and implement AI solutions tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">200</div>
              <div className="text-white/80">Community Members</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">11</div>
              <div className="text-white/80">AI Solutions</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">10</div>
              <div className="text-white/80">Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-card-foreground mb-8">
            Ready to Transform Your AI Journey?
          </h2>
          <Link
            href="/register"
            className="btn-primary text-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
