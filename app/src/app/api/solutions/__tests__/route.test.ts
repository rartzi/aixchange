import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { NextRequest } from 'next/server';
import { POST, GET } from '../route';
import { prisma } from '@/lib/db/prisma';

// Mock Prisma client
const mockPrisma = {
  user: {
    findUnique: jest.fn() as any,
    create: jest.fn() as any,
  },
  solution: {
    create: jest.fn() as any,
    findMany: jest.fn() as any,
  },
  auditLog: {
    create: jest.fn() as any,
  },
};

jest.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}));

describe('Solutions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/solutions', () => {
    test('creates a solution with valid metadata', async () => {
      // Mock user exists
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'anonymous-user',
        email: 'test@example.com',
        role: 'USER',
        authProvider: 'EMAIL',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      });

      // Mock solution creation
      mockPrisma.solution.create.mockResolvedValueOnce({
        id: 'test-solution',
        title: 'Test Solution',
        description: 'Test Description',
        version: '1.0.0',
        isPublished: true,
        authorId: 'anonymous-user',
        category: 'Natural Language Processing',
        provider: 'OpenAI',
        launchUrl: 'https://example.com',
        status: 'ACTIVE',
        tokenCost: 100,
        rating: 0,
        tags: ['test', 'ai'],
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        imageUrl: '/placeholder-image.jpg',
        metadata: null,
      });

      const formData = new FormData();
      formData.append('title', 'Test Solution');
      formData.append('description', 'Test Description');
      formData.append('category', 'Natural Language Processing');
      formData.append('provider', 'OpenAI');
      formData.append('launchUrl', 'https://example.com');
      formData.append('tokenCost', '100');
      formData.append('status', 'ACTIVE');
      formData.append('tags', JSON.stringify(['test', 'ai']));
      formData.append('metadata', JSON.stringify({
        resourceConfig: {
          cpu: '2 cores',
          memory: '4GB',
        },
        apiEndpoints: [{
          path: '/api/test',
          method: 'POST',
        }],
      }));

      const request = new NextRequest('http://localhost/api/solutions', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id', 'test-solution');
      expect(mockPrisma.solution.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.auditLog.create).toHaveBeenCalledTimes(1);
    });

    test('validates required fields', async () => {
      const formData = new FormData();
      // Missing required fields
      formData.append('title', 'Test');

      const request = new NextRequest('http://localhost/api/solutions', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error', 'Validation error');
    });
  });

  describe('GET /api/solutions', () => {
    test('retrieves solutions with filters', async () => {
      mockPrisma.solution.findMany.mockResolvedValueOnce([{
        id: 'test-1',
        title: 'Test Solution 1',
        description: 'Test Description',
        version: '1.0.0',
        isPublished: true,
        authorId: 'anonymous-user',
        category: 'Natural Language Processing',
        provider: 'OpenAI',
        launchUrl: 'https://example.com',
        status: 'ACTIVE',
        tokenCost: 100,
        rating: 0,
        tags: ['test'],
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
        imageUrl: '/placeholder-image.jpg',
        metadata: {
          resourceConfig: {
            cpu: '2 cores',
          },
        },
        reviews: [],
        author: {
          name: 'Test User',
          image: null,
        },
      }]);

      const request = new NextRequest(
        'http://localhost/api/solutions?category=Natural Language Processing&provider=OpenAI'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0]).toHaveProperty('category', 'Natural Language Processing');
      expect(mockPrisma.solution.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: 'Natural Language Processing',
            provider: 'OpenAI',
          }),
        })
      );
    });

    test('handles search parameter', async () => {
      const request = new NextRequest(
        'http://localhost/api/solutions?search=test'
      );

      await GET(request);

      expect(mockPrisma.solution.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: { contains: 'test', mode: 'insensitive' } },
              { description: { contains: 'test', mode: 'insensitive' } },
              { tags: { hasSome: ['test'] } },
            ],
          }),
        })
      );
    });
  });
});