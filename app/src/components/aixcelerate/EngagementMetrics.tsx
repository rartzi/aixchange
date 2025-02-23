"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Trophy,
  Star,
  TrendingUp,
  Target,
  Award,
  Zap,
  BarChart
} from "lucide-react";

interface PlatformMetrics {
  totalUsers: number;
  activeEvents: number;
  completedEvents: number;
  totalSolutions: number;
  participationRate: number;
  successRate: number;
  growthRate: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  value: number;
  target: number;
  icon: keyof typeof icons;
}

const icons = {
  Users,
  Trophy,
  Star,
  TrendingUp,
  Target,
  Award,
  Zap,
  BarChart,
};

const MetricCard = ({
  title,
  value,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  trend?: string;
  icon: any;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-xl"
    >
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && (
              <span className={`text-sm ${
                trend.startsWith("+")
                  ? "text-green-500"
                  : "text-red-500"
              }`}>
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const Icon = icons[achievement.icon];
  const progress = (achievement.value / achievement.target) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-xl"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{achievement.title}</h3>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{achievement.value}</span>
          <span className="text-muted-foreground">Target: {achievement.target}</span>
        </div>
        <Progress value={progress} />
      </div>
    </motion.div>
  );
};

export function EngagementMetrics() {
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    totalUsers: 0,
    activeEvents: 0,
    completedEvents: 0,
    totalSolutions: 0,
    participationRate: 0,
    successRate: 0,
    growthRate: 0,
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    setMetrics({
      totalUsers: 1500,
      activeEvents: 8,
      completedEvents: 12,
      totalSolutions: 450,
      participationRate: 75,
      successRate: 85,
      growthRate: 25,
    });

    setAchievements([
      {
        id: "1",
        title: "Community Growth",
        description: "Monthly user registration target",
        value: 150,
        target: 200,
        icon: "Users"
      },
      {
        id: "2",
        title: "Event Success",
        description: "Successful event completions",
        value: 12,
        target: 15,
        icon: "Trophy"
      },
      {
        id: "3",
        title: "Solution Quality",
        description: "High-rated solutions",
        value: 85,
        target: 100,
        icon: "Star"
      },
      {
        id: "4",
        title: "Platform Growth",
        description: "Monthly activity increase",
        value: 25,
        target: 30,
        icon: "TrendingUp"
      }
    ]);
  }, []);

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers}
          trend="+12% this month"
          icon={Users}
        />
        <MetricCard
          title="Active Events"
          value={metrics.activeEvents}
          trend="+3 this week"
          icon={Target}
        />
        <MetricCard
          title="Total Solutions"
          value={metrics.totalSolutions}
          trend="+45 this month"
          icon={Zap}
        />
        <MetricCard
          title="Success Rate"
          value={`${metrics.successRate}%`}
          trend="+5% vs last month"
          icon={BarChart}
        />
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Platform Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
}