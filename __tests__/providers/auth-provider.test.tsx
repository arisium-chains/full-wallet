import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/app/providers/auth-provider'

// Mock the useGetMe hook
jest.mock('@/src/hooks/user/useGetMe', () => ({
  useGetMe: jest.fn(),
}))

// Mock localStorage and window.location
const mockLocalStorage = {
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

const mockSessionStorage = {
  clear: jest.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
})

Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
})

// Test component that uses the auth hook
const TestComponent = () => {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading...' : 'Loaded'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user">{user ? user.email : 'No User'}</div>
      <button onClick={login} data-testid="login-btn">Login</button>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
    </div>
  )
}

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
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.location.href = ''
  })

  it('should provide authentication state when user is authenticated', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User'
    }
    
    useGetMe.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null
    })

    render(<TestComponent />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Loaded')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })
  })

  it('should show not authenticated when user data has error', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    
    useGetMe.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Unauthorized')
    })

    render(<TestComponent />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated')
      expect(screen.getByTestId('user')).toHaveTextContent('No User')
    })
  })

  it('should show loading state when fetching user data', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    
    useGetMe.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    })

    render(<TestComponent />, { wrapper: createWrapper() })

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading...')
  })

  it('should redirect to LINE OAuth when login is called', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    
    useGetMe.mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    })

    render(<TestComponent />, { wrapper: createWrapper() })

    const loginBtn = screen.getByTestId('login-btn')
    fireEvent.click(loginBtn)

    expect(window.location.href).toBe('/api/auth/line')
  })

  it('should clear session and redirect when logout is called', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User'
    }
    
    useGetMe.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null
    })

    render(<TestComponent />, { wrapper: createWrapper() })

    const logoutBtn = screen.getByTestId('logout-btn')
    fireEvent.click(logoutBtn)

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken')
    expect(mockSessionStorage.clear).toHaveBeenCalled()
    expect(window.location.href).toBe('/login')
  })

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Capture console.error to prevent error output in test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleSpy.mockRestore()
  })

  it('should update authentication state when user data changes', async () => {
    const { useGetMe } = require('@/src/hooks/user/useGetMe')
    
    // Start with no user
    useGetMe.mockReturnValue({
      data: null,
      isLoading: false,
      error: null
    })

    const { rerender } = render(<TestComponent />, { wrapper: createWrapper() })

    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated')

    // Update to have user
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User'
    }
    
    useGetMe.mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null
    })

    rerender(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })
  })
})