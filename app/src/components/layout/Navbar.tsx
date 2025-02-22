"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useSession } from "next-auth/react";
import { ProfileMenu } from "./ProfileMenu";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session, status } = useSession();

  return (
    <nav className="container mx-auto px-4 py-4 flex justify-between items-center border-b border-border">
      <Link href="/" className="text-primary text-2xl font-bold">
        (AI)Xplore
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/solutions"
          className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-300 transition-colors"
        >
          (AI)Xchange
        </Link>
        <Link
          href="/experiment"
          className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-300 transition-colors"
        >
          (AI)Xperiment
        </Link>
        <Link
          href="/community"
          className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-blue-300 transition-colors"
        >
          (AI)Xccelerate
        </Link>
        {/* Admin Navigation */}
        {session?.user?.role === 'ADMIN' && (
          <div className="relative group">
            <Link
              href="/admin/users"
              className="text-lg font-medium text-primary hover:text-primary/90 transition-colors flex items-center gap-1"
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
            <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="py-1">
                <Link
                  href="/admin/users"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                >
                  User Management
                </Link>
                <Link
                  href="/admin/solutions/import"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                >
                  Import Solutions
                </Link>
                <Link
                  href="/admin/solutions/test-import"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                >
                  Test Import
                </Link>
              </div>
            </div>
          </div>
        )}
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
        {status === "loading" ? (
          <div className="w-20 h-10 bg-muted animate-pulse rounded-lg" />
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
              className="px-4 py-2 text-lg font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}