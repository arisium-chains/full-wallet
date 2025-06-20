import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/auth/line/route'

// Mock dependencies
jest.mock('@/src/server/services/user.service', () => ({
  createAuthenticatedUser: jest.fn(),
}))

describe('/api/auth/line', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should authenticate user with valid LINE ID token', async () => {
      const { createAuthenticatedUser } = require('@/src/server/services/user.service')
      createAuthenticatedUser.mockResolvedValue({
        user: { id: 'user-123', email: 'test@example.com' },
        token: 'jwt-token-123'
      })

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          idToken: 'valid-line-token'
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data.message).toBe('User authenticated successfully')
      expect(createAuthenticatedUser).toHaveBeenCalledWith('valid-line-token')
    })

    it('should return 400 when idToken is missing', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {},
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('idToken is required')
    })

    it('should return 400 when idToken is invalid format', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          idToken: 'invalid.token'
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('Invalid idToken format')
    })

    it('should handle authentication service errors', async () => {
      const { createAuthenticatedUser } = require('@/src/server/services/user.service')
      createAuthenticatedUser.mockRejectedValue(new Error('Authentication failed'))

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          idToken: 'valid-line-token'
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('Authentication failed')
    })
  })

  describe('Unsupported methods', () => {
    it('should return 405 for GET requests', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
    })
  })
})