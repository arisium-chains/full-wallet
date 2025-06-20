import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/transfer/route'

// Mock dependencies
jest.mock('@/src/server/middlewares/auth.middleware', () => ({
  withAuth: (fn: any) => fn,
}))

jest.mock('@/src/server/services/engine.service', () => ({
  transferToken: jest.fn(),
}))

describe('/api/transfer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    const validTransferData = {
      toAddress: '0x456def789abc012345678901234567890abcdef01',
      tokenAddress: '0x123abc456def789012345678901234567890abcd12',
      amount: '100'
    }

    it('should execute token transfer successfully', async () => {
      const { transferToken } = require('@/src/server/services/engine.service')
      const mockQueueId = 'queue-123-456-789'
      transferToken.mockResolvedValue({ queueId: mockQueueId })

      const { req, res } = createMocks({
        method: 'POST',
        body: validTransferData,
      })

      req.user = {
        id: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c'
      }

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const data = JSON.parse(res._getData())
      expect(data).toEqual({
        message: 'Transfer initiated successfully',
        queueId: mockQueueId
      })
      expect(transferToken).toHaveBeenCalledWith(
        '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c',
        validTransferData.toAddress,
        validTransferData.tokenAddress,
        validTransferData.amount
      )
    })

    it('should return 400 when required fields are missing', async () => {
      const incompleteData = {
        toAddress: '0x456def789abc012345678901234567890abcdef01',
        // Missing tokenAddress and amount
      }

      const { req, res } = createMocks({
        method: 'POST',
        body: incompleteData,
      })

      req.user = {
        id: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c'
      }

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('Missing required fields: toAddress, tokenAddress, amount')
    })

    it('should return 400 when user has no wallet address', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: validTransferData,
      })

      req.user = {
        id: 'user-123',
        walletAddress: null
      }

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('User wallet address not found')
    })

    it('should handle transfer service errors', async () => {
      const { transferToken } = require('@/src/server/services/engine.service')
      transferToken.mockRejectedValue(new Error('Insufficient balance'))

      const { req, res } = createMocks({
        method: 'POST',
        body: validTransferData,
      })

      req.user = {
        id: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c'
      }

      await handler(req, res)

      expect(res._getStatusCode()).toBe(500)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('Transfer failed')
    })

    it('should validate Ethereum addresses', async () => {
      const invalidData = {
        ...validTransferData,
        toAddress: 'invalid-address'
      }

      const { req, res } = createMocks({
        method: 'POST',
        body: invalidData,
      })

      req.user = {
        id: 'user-123',
        walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c'
      }

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toContain('Invalid address')
    })

    it('should require authentication', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: validTransferData,
      })

      // No user object means not authenticated
      delete req.user

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
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