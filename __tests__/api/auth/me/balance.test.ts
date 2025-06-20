import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/auth/me/balance/route'

// Mock dependencies
jest.mock('@/src/server/middlewares/auth.middleware', () => ({
  withAuth: (fn: any) => fn,
}))

jest.mock('@/src/server/services/engine.service', () => ({
  getBalance: jest.fn(),
}))

describe('/api/auth/me/balance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return user balance when wallet address exists', async () => {
      const { getBalance } = require('@/src/server/services/engine.service')
      const mockBalance = {
        tokens: [
          {
            symbol: 'ARIS',
            balance: '1250.50',
            value: '$150.06',
            contractAddress: '0x123...'
          }
        ],
        totalValue: '$150.06'
      }
      getBalance.mockResolvedValue(mockBalance)

      const { req, res } = createMocks({
        method: 'GET',
      })

      // Mock authenticated user with wallet address
      req.user = {
        id: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c'
      }

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data).toEqual(mockBalance)
      expect(getBalance).toHaveBeenCalledWith('0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c')
    })

    it('should return default balance when no wallet address', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      // Mock authenticated user without wallet address
      req.user = {
        id: 'user-123',
        walletAddress: null
      }

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data).toEqual({
        tokens: [],
        totalValue: '$0.00'
      })
    })

    it('should handle engine service errors gracefully', async () => {
      const { getBalance } = require('@/src/server/services/engine.service')
      getBalance.mockRejectedValue(new Error('Engine service unavailable'))

      const { req, res } = createMocks({
        method: 'GET',
      })

      req.user = {
        id: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c'
      }

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('Failed to fetch balance')
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      // No user object means not authenticated
      delete req.user

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
    })
  })

  describe('Unsupported methods', () => {
    it('should return 405 for POST requests', async () => {
      const { req, res } = createMocks({
        method: 'POST',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(405)
    })
  })
})