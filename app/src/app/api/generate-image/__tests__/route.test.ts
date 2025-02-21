import { POST, GET } from '../route';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Mock OpenAI
jest.mock('openai', () => {
  const mockGenerate = jest.fn();
  return jest.fn().mockImplementation(() => ({
    images: {
      generate: mockGenerate,
    },
  }));
});

// Mock fs
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

// Mock sharp
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    toFormat: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue(undefined),
  }));
});

// Mock NextRequest
class MockNextRequest {
  private url: string;
  private options: RequestInit;

  constructor(url: string, options: RequestInit = {}) {
    this.url = url;
    this.options = options;
  }

  async json() {
    if (!this.options.body) return {};
    return JSON.parse(this.options.body as string);
  }

  get method() {
    return this.options.method;
  }
}

// Mock NextResponse
jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: {
      json: jest.fn().mockImplementation((data, options) => ({
        status: options?.status || 200,
        json: async () => data,
      })),
    },
  };
});

describe('Generate Image API', () => {
  let mockGenerate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXTERNAL_IMAGES_PATH = '/test/path';
    // Get the mocked generate function
    const mockOpenAI = new OpenAI({ apiKey: 'test' });
    mockGenerate = mockOpenAI.images.generate as jest.Mock;
  });

  it('should generate an image successfully', async () => {
    // Mock successful image generation
    mockGenerate.mockResolvedValue({
      data: [{ b64_json: 'mock-base64-data' }],
    });

    // Mock directory check
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const request = new MockNextRequest(
      'http://localhost/api/generate-image',
      {
        method: 'POST',
        body: JSON.stringify({
          description: 'Test description',
          solutionId: 'test-123',
        }),
      }
    ) as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.imageUrl).toMatch(/^\/external-images\/solutions\/.+\.png$/);
    expect(fs.mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('/solutions'),
      { recursive: true }
    );
  });

  it('should return 400 if description is missing', async () => {
    const request = new MockNextRequest(
      'http://localhost/api/generate-image',
      {
        method: 'POST',
        body: JSON.stringify({}),
      }
    ) as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Description is required');
  });

  it('should return 500 if image generation fails', async () => {
    mockGenerate.mockRejectedValue(new Error('DALL-E API error'));

    const request = new MockNextRequest(
      'http://localhost/api/generate-image',
      {
        method: 'POST',
        body: JSON.stringify({
          description: 'Test description',
        }),
      }
    ) as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to generate image');
  });

  it('should return 405 for GET requests', async () => {
    const request = new MockNextRequest(
      'http://localhost/api/generate-image',
      {
        method: 'GET',
      }
    ) as any;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(405);
    expect(data.error).toBe('Method not allowed');
  });

  it('should enhance the prompt with professional context', async () => {
    mockGenerate.mockResolvedValue({
      data: [{ b64_json: 'mock-base64-data' }],
    });

    const request = new MockNextRequest(
      'http://localhost/api/generate-image',
      {
        method: 'POST',
        body: JSON.stringify({
          description: 'A chatbot interface',
        }),
      }
    ) as any;

    await POST(request);

    expect(mockGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: expect.stringContaining('professional'),
        model: 'dall-e-3',
        quality: expect.any(String),
        size: expect.any(String),
      })
    );
  });
});
