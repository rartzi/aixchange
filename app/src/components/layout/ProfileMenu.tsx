"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import type { Session } from "next-auth";

interface ProfileMenuProps {
  session: Session;
}

export function ProfileMenu({ session }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
      >
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "Profile"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {session.user?.name?.[0] || session.user?.email?.[0] || "?"}
          </div>
        )}
        <span className="text-sm font-medium hidden md:block">
          {session.user?.name || session.user?.email}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 py-2 bg-card rounded-lg shadow-lg border border-border">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Profile Settings
          </Link>
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          {session.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin Panel
            </Link>
          )}
          <button
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}