import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetMe } from '@/src/hooks/user/useGetMe'

// Mock the user service
jest.mock('@/src/services/user.service', () => ({
  getMe: jest.fn(),
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

describe('useGetMe', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch user data successfully', async () => {
    const { getMe } = require('@/src/services/user.service')
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c',
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z'
    }
    getMe.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useGetMe(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockUser)
    expect(result.current.error).toBe(null)
    expect(getMe).toHaveBeenCalledTimes(1)
  })

  it('should handle authentication error', async () => {
    const { getMe } = require('@/src/services/user.service')
    const errorMessage = 'Unauthorized'
    getMe.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useGetMe(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.data).toBe(undefined)
    expect(result.current.error).toBeTruthy()
  })

  it('should handle user without wallet address', async () => {
    const { getMe } = require('@/src/services/user.service')
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      walletAddress: null,
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z'
    }
    getMe.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useGetMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockUser)
    expect(result.current.data?.walletAddress).toBe(null)
  })

  it('should use correct query key', async () => {
    const { getMe } = require('@/src/services/user.service')
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User'
    }
    getMe.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useGetMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getMe).toHaveBeenCalledTimes(1)
  })

  it('should refetch user data when refetch is called', async () => {
    const { getMe } = require('@/src/services/user.service')
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User'
    }
    getMe.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useGetMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(getMe).toHaveBeenCalledTimes(1)

    // Trigger refetch
    await result.current.refetch()

    expect(getMe).toHaveBeenCalledTimes(2)
  })

  it('should handle network errors gracefully', async () => {
    const { getMe } = require('@/src/services/user.service')
    getMe.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useGetMe(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.data).toBe(undefined)
    expect(result.current.error?.message).toBe('Network error')
  })
})