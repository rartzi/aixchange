"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="container mx-auto px-4 py-4 flex justify-between items-center border-b border-border">
      <Link href="/" className="text-primary text-2xl font-bold">
        (AI)Xplore
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="https://n8n.aixplore.odsp.astrazeneca.net"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          (AI)Xperiment
        </Link>
        <Link
          href="https://ghost.aixplore.odsp.astrazeneca.net"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          (AI)Xchange
        </Link>
        <Link
          href="https://ghost.aixplore.odsp.astrazeneca.net"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          (AI)Xclelerate
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 text-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
        <Link href="/login" className="btn-primary">
          Login
        </Link>
        <Link href="/register" className="btn-secondary">
          Register
        </Link>
      </div>
    </nav>
  );
}