"use client";

import { Hero } from "@/components/aixcelerate/Hero";
import { CommunityHub } from "@/components/aixcelerate/CommunityHub";
import { motion } from "framer-motion";

export default function AIXceleratePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-transparent via-gray-50/30 to-gray-100/50 dark:from-transparent dark:via-gray-900/30 dark:to-gray-900/50">
      <Hero />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent mb-4">
              Community Hub
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect, learn, and grow with our vibrant AI community. Join discussions,
              explore our knowledge base, and participate in exciting events.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="transform hover:-translate-y-2 transition-transform duration-300"
        >
          <CommunityHub />
        </motion.div>
      </main>
    </div>
  );
}