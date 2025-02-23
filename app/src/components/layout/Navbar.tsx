"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useSession } from "next-auth/react";
import { ProfileMenu } from "./ProfileMenu";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <nav className="relative bg-gradient-to-r from-gray-50/80 via-white/90 to-gray-50/80 dark:from-gray-900/90 dark:via-gray-800/95 dark:to-gray-900/90 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
          (AI)Xplore
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/solutions"
            className="text-lg font-medium text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-300 transition-colors"
          >
            (AI)Xchange
          </Link>
          <Link
            href="/experiment"
            className="text-lg font-medium text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-300 transition-colors"
          >
            (AI)Xperiment
          </Link>
          <Link
            href="/aixcelerate"
            className="text-lg font-medium text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-blue-300 transition-colors"
          >
            (AI)Xcelerate
          </Link>
          {/* Admin Navigation */}
          {session?.user?.role === 'ADMIN' && (
            <div className="relative group">
              <Link
                href="/admin/users"
                className="text-lg font-medium bg-gradient-to-r from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/20 px-4 py-2 rounded-md text-primary dark:text-blue-300 hover:from-primary/30 hover:to-primary/20 dark:hover:from-primary/40 dark:hover:to-primary/30 transition-all flex items-center gap-1"
              >
                Admin
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="py-1">
                  <Link
                    href="/admin/users"
                    className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-primary/10 dark:hover:bg-primary/20"
                  >
                    User Management
                  </Link>
                  <Link
                    href="/admin/solutions"
                    className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-primary/10 dark:hover:bg-primary/20"
                  >
                    Solutions Management
                  </Link>
                  <Link
                    href="/admin/events"
                    className="block px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-primary/10 dark:hover:bg-primary/20"
                  >
                    Events Management
                  </Link>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5 text-gray-800 dark:text-gray-100"
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
                className="w-5 h-5 text-gray-800 dark:text-gray-100"
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
          {status === "loading" ? (
            <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          ) : session ? (
            <ProfileMenu session={session} />
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-lg font-medium bg-primary text-white hover:bg-primary/90 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-lg font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}