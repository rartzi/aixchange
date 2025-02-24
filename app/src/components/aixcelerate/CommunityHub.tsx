"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Calendar } from "lucide-react";

const CommunityCard = ({
  title,
  description,
  icon: Icon,
  linkText,
  linkUrl,
  color,
  delay,
}: {
  title: string;
  description: string;
  icon: any;
  linkText: string;
  linkUrl: string;
  color: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${color} rounded-2xl p-8 text-white shadow-xl hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-4 bg-white/20 rounded-xl">
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <p className="text-white/90 text-lg mb-8 min-h-[80px] leading-relaxed">{description}</p>
      <Button
        variant="outline"
        size="lg"
        className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white text-lg font-medium"
        onClick={() => window.open(linkUrl, linkUrl.startsWith('http') ? '_blank' : '_self')}
      >
        {linkText} →
      </Button>
    </motion.div>
  );
};

export function CommunityHub() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <CommunityCard
        title="Events"
        description="Discover upcoming events, challenges, and opportunities to showcase your solutions."
        icon={Calendar}
        linkText="Explore Events"
        linkUrl="/events"
        color="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
        delay={0.2}
      />
      <CommunityCard
        title="Blog"
        description="Explore insightful articles, tutorials, and updates from our community of AI innovators."
        icon={BookOpen}
        linkText="Visit Blog"
        linkUrl="https://ghost.aixlore.osdsp.astrazeneca.net"
        color="bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
        delay={0.3}
      />
      <CommunityCard
        title="Discussion Forums"
        description="Join our vibrant community discussions, share ideas, and connect with fellow innovators."
        icon={MessageSquare}
        linkText="Join Discussions"
        linkUrl="https://zulip.aixlore.osdsp.astrazeneca.net"
        color="bg-gradient-to-br from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800"
        delay={0.4}
      />
    </div>
  );
}