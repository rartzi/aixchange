"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Star, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WinningSolution {
  id: string;
  title: string;
  author: {
    name: string;
    avatar?: string;
  };
  description: string;
  imageUrl?: string;
}

interface PastEvent {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  type: "HACKATHON" | "CHALLENGE" | "COMPETITION" | "WORKSHOP";
  metrics: {
    participants: number;
    submissions: number;
    viewCount: number;
  };
  winners: WinningSolution[];
  endDate: string;
}

const EVENT_TYPES = ["ALL", "HACKATHON", "CHALLENGE", "COMPETITION", "WORKSHOP"] as const;

const PastEventCard = ({ event }: { event: PastEvent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden bg-card"
    >
      <div className="aspect-video relative">
        <Image
          src={event.imageUrl || "/placeholder-image.jpg"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          <p className="text-sm text-white/80 mt-1">{event.type}</p>
        </div>
      </div>

      <div className="p-6">
        {/* Event Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-lg font-semibold">{event.metrics.participants}</div>
            <div className="text-xs text-muted-foreground">Participants</div>
          </div>
          <div className="text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-lg font-semibold">{event.metrics.submissions}</div>
            <div className="text-xs text-muted-foreground">Submissions</div>
          </div>
          <div className="text-center">
            <Star className="h-5 w-5 mx-auto mb-1 text-primary" />
            <div className="text-lg font-semibold">{event.metrics.viewCount}</div>
            <div className="text-xs text-muted-foreground">Views</div>
          </div>
        </div>

        {/* Winning Solutions */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Winning Solutions
          </h4>
          {event.winners.map((winner) => (
            <Card key={winner.id} className="p-4">
              <div className="flex items-start space-x-4">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={winner.imageUrl || "/placeholder-image.jpg"}
                    alt={winner.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium truncate">{winner.title}</h5>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {winner.description}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <div className="relative h-5 w-5 rounded-full overflow-hidden mr-2">
                      <Image
                        src={winner.author.avatar || "/placeholder-image.jpg"}
                        alt={winner.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>{winner.author.name}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-6"
          onClick={() => window.location.href = `/events/${event.id}`}
        >
          View Event Details
        </Button>
      </div>
    </motion.div>
  );
};

export function PastEvents() {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<typeof EVENT_TYPES[number]>("ALL");
  const [filteredEvents, setFilteredEvents] = useState<PastEvent[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    setEvents([
      {
        id: "1",
        title: "AI Innovation Challenge 2024",
        description: "A groundbreaking competition focused on innovative AI solutions",
        type: "COMPETITION",
        imageUrl: "/placeholder-image.jpg",
        metrics: {
          participants: 250,
          submissions: 85,
          viewCount: 1200
        },
        winners: [
          {
            id: "w1",
            title: "Smart City Optimization",
            author: {
              name: "Team Innovators",
              avatar: "/placeholder-image.jpg"
            },
            description: "An AI-powered solution for optimizing city resources and reducing waste.",
            imageUrl: "/placeholder-image.jpg"
          },
          {
            id: "w2",
            title: "Healthcare Assistant",
            author: {
              name: "MedTech Solutions",
              avatar: "/placeholder-image.jpg"
            },
            description: "AI-driven healthcare assistance for improved patient care.",
            imageUrl: "/placeholder-image.jpg"
          }
        ],
        endDate: "2024-12-31"
      },
      {
        id: "2",
        title: "Sustainable AI Hackathon",
        description: "Creating AI solutions for environmental challenges",
        type: "HACKATHON",
        imageUrl: "/placeholder-image.jpg",
        metrics: {
          participants: 180,
          submissions: 60,
          viewCount: 950
        },
        winners: [
          {
            id: "w3",
            title: "EcoPredict",
            author: {
              name: "Green AI Team",
              avatar: "/placeholder-image.jpg"
            },
            description: "Predictive analytics for environmental conservation.",
            imageUrl: "/placeholder-image.jpg"
          }
        ],
        endDate: "2024-11-30"
      }
    ]);
  }, []);

  // Filter events based on search query and selected type
  useEffect(() => {
    let filtered = events;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (selectedType !== "ALL") {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={selectedType}
          onValueChange={(value) => setSelectedType(value as typeof EVENT_TYPES[number])}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <PastEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}