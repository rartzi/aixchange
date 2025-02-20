"use client";

import Link from "next/link";

export function Footer() {
  return (
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
                  href="/experiment"
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
              <li>
                <Link 
                  href="/blog" 
                  className="text-muted-foreground hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/docs" 
                  className="text-muted-foreground hover:text-primary"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="/support" 
                  className="text-muted-foreground hover:text-primary"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-muted-foreground hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} (AI)Xplore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}