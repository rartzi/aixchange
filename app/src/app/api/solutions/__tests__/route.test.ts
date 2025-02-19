import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { POST, GET } from '../route';
import { SolutionStatus, type Solution, type User, type Prisma } from '@prisma/client';
import type { SolutionMetadata } from '@/lib/schemas/solution';

// Mock data types
const mockUser = {
  id: 'anonymous-user',
  email: 'test@example.com',
  role: 'USER' as const,
  authProvider: 'EMAIL' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  name: null,
  emailVerified: null,
  image: null,
  authProviderId: null,
  metadata: null,
  password: null,
  lastLogin: null,
} satisfies User;

const mockSolution = {
  id: 'test-solution',
  title: 'Test Solution',
  description: 'Test Description',
  version: '1.0.0',
  isPublished: true,
  authorId: 'anonymous-user',
  category: 'Natural Language Processing',
  provider: 'OpenAI',
  launchUrl: 'https://example.com',
  status: SolutionStatus.ACTIVE,
  tokenCost: 100,
  rating: 0,
  tags: ['test', 'ai'],
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: null,
  imageUrl: '/placeholder-image.jpg',
  metadata: {
    resourceConfig: {
      cpu: '2 cores',
      memory: '4GB',
    },
    apiEndpoints: [{
      path: '/api/test',
      method: 'POST',
    }],
  },
  sourceCodeUrl: null,
} satisfies Solution & { metadata: SolutionMetadata };

// Mock Prisma client
const mockPrisma = {
  user: {
    findUnique: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
  },
  solution: {
    create: jest.fn().mockResolvedValue(mockSolution),
    findMany: jest.fn().mockResolvedValue([mockSolution]),
    count: jest.fn().mockResolvedValue(1),
  },
  auditLog: {
    create: jest.fn().mockResolvedValue({ id: 'test-audit' }),
  },
};

// Mock modules
jest.mock('@/lib/db/prisma', () => ({
  prisma: mockPrisma,
}));

// Mock NextResponse
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      json: (data: unknown, init?: { status?: number }) => {
        const response = new Response(JSON.stringify(data), init);
        Object.defineProperty(response, 'json', {
          value: async () => data,
        });
        return response;
      },
    },
  };
});

interface MockRequestInit extends RequestInit {
  body?: FormData;
}

// Helper to create mock request
function createMockRequest(url: string, init?: MockRequestInit): NextRequest {
  const formData = init?.body as FormData || new FormData();
  
  // Create a base request object
  const baseRequest = new Request(url, {
    method: init?.method || 'GET',
    body: formData,
  });

  // Create the NextRequest mock
  const mockRequest = Object.create(baseRequest, {
    nextUrl: {
      value: new URL(url),
      enumerable: true,
    },
    cookies: {
      value: new Map(),
      enumerable: true,
    },
    formData: {
      value: () => Promise.resolve(formData),
      enumerable: true,
    },
    url: {
      value: url,
      enumerable: true,
    },
  });

  return mockRequest as unknown as NextRequest;
}

describe('Solutions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/solutions', () => {
    test('creates a solution with valid metadata', async () => {
      const formData = new FormData();
      formData.append('title', 'Test Solution');
      formData.append('description', 'Test Description');
      formData.append('category', 'Natural Language Processing');
      formData.append('provider', 'OpenAI');
      formData.append('launchUrl', 'https://example.com');
      formData.append('tokenCost', '100');
      formData.append('status', 'Active');
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

      const request = createMockRequest('http://localhost/api/solutions', {
        method: 'POST',
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.data).toHaveProperty('id', 'test-solution');
      expect(mockPrisma.solution.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.auditLog.create).toHaveBeenCalledTimes(1);
    });

    test('validates required fields', async () => {
      const formData = new FormData();
      // Missing required fields
      formData.append('title', 'Test');

      const request = createMockRequest('http://localhost/api/solutions', {
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
      const request = createMockRequest(
        'http://localhost/api/solutions?category=Natural Language Processing&provider=OpenAI'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0]).toHaveProperty('category', 'Natural Language Processing');
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
      const request = createMockRequest(
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