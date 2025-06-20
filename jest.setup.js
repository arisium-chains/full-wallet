import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    }
  },
  usePathname() {
    return '/wallet'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock LINE LIFF
jest.mock('@line/liff', () => ({
  init: jest.fn(() => Promise.resolve()),
  isLoggedIn: jest.fn(() => false),
  login: jest.fn(),
  getIDToken: jest.fn(() => 'mock-id-token'),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_LIFF_ID = 'test-liff-id'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.POCKETBASE_URL = 'http://localhost:8090'
process.env.ENGINE_BASE_URL = 'http://localhost:3005'

// Global test utilities
global.fetch = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})