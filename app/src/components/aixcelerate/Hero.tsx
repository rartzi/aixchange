"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CommunityStats } from "./CommunityStats";

export function Hero() {
  return (
    <section className="relative h-[250px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/robot-surfer.jpg"
          alt="AI Innovation"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Innovation Through Collaboration
            </h1>
            <p className="text-lg text-white/80 mb-4">
              Join the AI revolution. Participate in challenges, showcase your solutions,
              and connect with innovators worldwide.
            </p>
            <div className="flex gap-4">
              <Button
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => window.location.href = '/events'}
              >
                Explore Events
              </Button>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/10"
                onClick={() => window.location.href = '/about'}
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <CommunityStats />
          </motion.div>
        </div>
      </div>
    </section>
  );
}