import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/app/providers/auth-provider'
import { WalletProvider } from '@/app/providers/wallet-provider'
import WalletPage from '@/app/wallet/page'

// Mock all the services
jest.mock('@/src/hooks/user/useGetMe', () => ({
  useGetMe: jest.fn(),
}))

jest.mock('@/src/hooks/user/useGetBalance', () => ({
  useGetBalance: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WalletProvider>
          {children}
        </WalletProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('Wallet Integration Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display complete wallet dashboard with real data', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    const { useGetBalance } = require('@/src/hooks/user/useGetBalance')

    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c'
    }

    const mockBalance = {
      tokens: [
        {
          symbol: 'ARIS',
          balance: '1250.50',
          value: '$150.06',
          contractAddress: '0x123...',
          change: '+12.5%'
        },
        {
          symbol: 'ETH',
          balance: '0.0234',
          value: '$54.78',
          contractAddress: '0x456...',
          change: '+3.2%'
        }
      ],
      totalValue: '$204.84'
    }

    useGetMe.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null
    })

    useGetBalance.mockReturnValue({
      data: mockBalance,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    })

    render(<WalletPage />, { wrapper: createTestWrapper() })

    // Check wallet header
    await waitFor(() => {
      expect(screen.getByText('My Wallet 💳')).toBeInTheDocument()
      expect(screen.getByText('Secured 🔒')).toBeInTheDocument()
    })

    // Check wallet address display
    expect(screen.getByText('0x742d...5b8c')).toBeInTheDocument()

    // Check portfolio balance
    expect(screen.getByText('$204.84')).toBeInTheDocument()

    // Check token balances
    expect(screen.getByText('ARIS')).toBeInTheDocument()
    expect(screen.getByText('1250.50')).toBeInTheDocument()
    expect(screen.getByText('$150.06')).toBeInTheDocument()
    
    expect(screen.getByText('ETH')).toBeInTheDocument()
    expect(screen.getByText('0.0234')).toBeInTheDocument()
    expect(screen.getByText('$54.78')).toBeInTheDocument()

    // Check action buttons
    expect(screen.getByText('Send 📤')).toBeInTheDocument()
    expect(screen.getByText('Receive 📥')).toBeInTheDocument()
    expect(screen.getByText('Activity 📊')).toBeInTheDocument()
  })

  it('should handle loading state properly', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    const { useGetBalance } = require('@/src/hooks/user/useGetBalance')

    useGetMe.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })

    useGetBalance.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: jest.fn()
    })

    render(<WalletPage />, { wrapper: createTestWrapper() })

    // Should show loading skeletons
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
    
    // Should show loading spinners
    const loadingElements = screen.getAllByRole('status')
    expect(loadingElements.length).toBeGreaterThan(0)
  })

  it('should handle error state gracefully', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    const { useGetBalance } = require('@/src/hooks/user/useGetBalance')

    useGetMe.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Authentication failed')
    })

    useGetBalance.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to fetch balance'),
      refetch: jest.fn()
    })

    render(<WalletPage />, { wrapper: createTestWrapper() })

    // Should show error state
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  it('should handle user without wallet address', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    const { useGetBalance } = require('@/src/hooks/user/useGetBalance')

    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      walletAddress: null
    }

    const mockEmptyBalance = {
      tokens: [],
      totalValue: '$0.00'
    }

    useGetMe.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null
    })

    useGetBalance.mockReturnValue({
      data: mockEmptyBalance,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    })

    render(<WalletPage />, { wrapper: createTestWrapper() })

    await waitFor(() => {
      // Should show fallback wallet address
      expect(screen.getByText('0x0000...0000')).toBeInTheDocument()
      
      // Should show zero balance
      expect(screen.getByText('$0.00')).toBeInTheDocument()
      
      // Should still show action buttons
      expect(screen.getByText('Send 📤')).toBeInTheDocument()
      expect(screen.getByText('Receive 📥')).toBeInTheDocument()
    })
  })

  it('should handle balance visibility toggle', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    const { useGetBalance } = require('@/src/hooks/user/useGetBalance')

    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c'
    }

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

    useGetMe.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null
    })

    useGetBalance.mockReturnValue({
      data: mockBalance,
      isLoading: false,
      error: null,
      refetch: jest.fn()
    })

    render(<WalletPage />, { wrapper: createTestWrapper() })

    // Initially should show balance
    await waitFor(() => {
      expect(screen.getByText('$150.06')).toBeInTheDocument()
    })

    // Click hide button
    const hideButton = screen.getByText('Hide')
    fireEvent.click(hideButton)

    // Should hide balance
    expect(screen.getByText('****')).toBeInTheDocument()
    expect(screen.queryByText('$150.06')).not.toBeInTheDocument()

    // Click show button
    const showButton = screen.getByText('Show')
    fireEvent.click(showButton)

    // Should show balance again
    expect(screen.getByText('$150.06')).toBeInTheDocument()
  })

  it('should copy wallet address to clipboard', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    const { useGetBalance } = require('@/src/hooks/user/useGetBalance')

    // Mock clipboard API
    const mockWriteText = jest.fn()
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    })

    const mockUser = {
      id: 'user-123',
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c'
    }

    useGetMe.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null
    })

    useGetBalance.mockReturnValue({
      data: { tokens: [], totalValue: '$0.00' },
      isLoading: false,
      error: null,
      refetch: jest.fn()
    })

    render(<WalletPage />, { wrapper: createTestWrapper() })

    await waitFor(() => {
      const copyButton = screen.getByText('Copy 📋')
      fireEvent.click(copyButton)
    })

    expect(mockWriteText).toHaveBeenCalledWith('0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c')
  })

  it('should refresh balance when refetch is triggered', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    const { useGetBalance } = require('@/src/hooks/user/useGetBalance')

    const mockRefetch = jest.fn()
    const mockUser = {
      id: 'user-123',
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c'
    }

    useGetMe.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null
    })

    useGetBalance.mockReturnValue({
      data: { tokens: [], totalValue: '$0.00' },
      isLoading: false,
      error: null,
      refetch: mockRefetch
    })

    render(<WalletPage />, { wrapper: createTestWrapper() })

    await waitFor(() => {
      expect(screen.getByText('My Wallet 💳')).toBeInTheDocument()
    })

    // The refetch should be called during component initialization
    expect(mockRefetch).toHaveBeenCalled()
  })
})