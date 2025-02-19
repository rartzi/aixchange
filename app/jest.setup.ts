import '@testing-library/jest-dom';

// Mock FormData since it's not available in jsdom
global.FormData = class FormData {
  private data: Record<string, any> = {};

  append(key: string, value: any) {
    this.data[key] = value;
  }

  get(key: string) {
    return this.data[key];
  }

  entries() {
    return Object.entries(this.data);
  }
} as any;

// Mock Next.js Request and Response
const originalURL = global.URL;
global.Request = class MockRequest extends originalURL {
  constructor(input: string | URL, init?: RequestInit) {
    super(typeof input === 'string' ? input : input.toString());
    Object.assign(this, init);
  }
} as any;

global.Response = class MockResponse {
  constructor(public body?: any, public init?: ResponseInit) {}
  json() {
    return Promise.resolve(this.body);
  }
  status: number = 200;
  ok: boolean = true;
  headers = new Headers();
} as any;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '';
  },
}));

// Mock Next.js server components
jest.mock('next/headers', () => ({
  cookies() {
    return {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };
  },
  headers() {
    return new Headers();
  },
}));