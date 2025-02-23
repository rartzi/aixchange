"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Lightbulb, Calendar } from "lucide-react";

interface CommunityMetrics {
  totalUsers: number;
  totalEvents: number;
  totalSolutions: number;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  delay,
}: {
  title: string;
  value: number;
  icon: any;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-xl font-bold text-white">{value.toLocaleString()}</div>
          <div className="text-xs text-white/80">{title}</div>
        </div>
      </div>
    </motion.div>
  );
};

export function CommunityStats() {
  const [metrics, setMetrics] = useState<CommunityMetrics>({
    totalUsers: 0,
    totalEvents: 0,
    totalSolutions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/community/stats");
        if (!response.ok) throw new Error("Failed to fetch metrics");
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 w-fit">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white/10 h-10 w-40 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-fit">
      <StatCard
        title="Community Members"
        value={metrics.totalUsers}
        icon={Users}
        delay={0.3}
      />
      <StatCard
        title="Total Events"
        value={metrics.totalEvents}
        icon={Calendar}
        delay={0.4}
      />
      <StatCard
        title="Total Solutions"
        value={metrics.totalSolutions}
        icon={Lightbulb}
        delay={0.5}
      />
    </div>
  );
}