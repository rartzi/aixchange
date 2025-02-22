import { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from "@/lib/db/prisma";

const include = {
  _count: {
    select: {
      participants: true,
      solutions: true,
    },
  },
} as const;

type EventWithCounts = Prisma.EventGetPayload<{ include: typeof include }>;

export const eventService = {
  async getAllEvents(): Promise<EventWithCounts[]> {
    try {
      return await prisma.$transaction(async (tx) => {
        return tx.event.findMany({
          orderBy: { createdAt: 'desc' },
          include,
        });
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  },

  async getEventById(id: string): Promise<EventWithCounts | null> {
    try {
      return await prisma.$transaction(async (tx) => {
        return tx.event.findUnique({
          where: { id },
          include,
        });
      });
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw new Error('Failed to fetch event');
    }
  },

  async createEvent(
    data: Prisma.EventCreateInput
  ): Promise<EventWithCounts> {
    try {
      return await prisma.$transaction(async (tx) => {
        return tx.event.create({
          data,
          include,
        });
      });
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  },

  async updateEvent(
    id: string,
    data: Prisma.EventUpdateInput
  ): Promise<EventWithCounts> {
    try {
      return await prisma.$transaction(async (tx) => {
        return tx.event.update({
          where: { id },
          data,
          include,
        });
      });
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      throw new Error('Failed to update event');
    }
  },

  async deleteEvent(id: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.event.delete({
          where: { id },
        });
      });
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      throw new Error('Failed to delete event');
    }
  },
};