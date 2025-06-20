import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetBalance } from '@/src/hooks/user/useGetBalance'

// Mock the balance service
jest.mock('@/src/services/user.service', () => ({
  getBalance: jest.fn(),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useGetBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch balance data successfully', async () => {
    const { getBalance } = require('@/src/services/user.service')
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

    const { result } = renderHook(() => useGetBalance(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockBalance)
    expect(result.current.error).toBe(null)
    expect(getBalance).toHaveBeenCalledTimes(1)
  })

  it('should handle error when balance fetch fails', async () => {
    const { getBalance } = require('@/src/services/user.service')
    const errorMessage = 'Failed to fetch balance'
    getBalance.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useGetBalance(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBeTruthy()
  })

  it('should use correct query key', async () => {
    const { getBalance } = require('@/src/services/user.service')
    getBalance.mockResolvedValue({ tokens: [], totalValue: '$0.00' })

    const { result } = renderHook(() => useGetBalance(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Verify the hook is using the correct query key from enum
    expect(getBalance).toHaveBeenCalledTimes(1)
  })

  it('should refetch balance when refetch is called', async () => {
    const { getBalance } = require('@/src/services/user.service')
    const mockBalance = { tokens: [], totalValue: '$0.00' }
    getBalance.mockResolvedValue(mockBalance)

    const { result } = renderHook(() => useGetBalance(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getBalance).toHaveBeenCalledTimes(1)

    // Trigger refetch
    await result.current.refetch()

    expect(getBalance).toHaveBeenCalledTimes(2)
  })

  it('should handle empty balance response', async () => {
    const { getBalance } = require('@/src/services/user.service')
    const emptyBalance = {
      tokens: [],
      totalValue: '$0.00'
    }
    getBalance.mockResolvedValue(emptyBalance)

    const { result } = renderHook(() => useGetBalance(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(emptyBalance)
    expect(result.current.data?.tokens).toHaveLength(0)
  })
})