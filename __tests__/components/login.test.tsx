import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import LoginPage from '@/app/login/page'

// Mock LINE LIFF
const mockLiff = {
  init: jest.fn(),
  isLoggedIn: jest.fn(),
  login: jest.fn(),
  getIDToken: jest.fn(),
}

jest.mock('@line/liff', () => mockLiff)

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock useToast hook
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXT_PUBLIC_LIFF_ID = 'test-liff-id'
  })

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_LIFF_ID
  })

  it('should render login page with LINE button', () => {
    mockLiff.init.mockResolvedValue(undefined)
    mockLiff.isLoggedIn.mockReturnValue(false)

    render(<LoginPage />)

    expect(screen.getByText('Welcome to ARIS! 🎓')).toBeInTheDocument()
    expect(screen.getByText('Continue with LINE 💚')).toBeInTheDocument()
    expect(screen.getByText(/Join the coolest Web3 learning adventure/)).toBeInTheDocument()
  })

  it('should initialize LIFF on component mount', async () => {
    mockLiff.init.mockResolvedValue(undefined)
    mockLiff.isLoggedIn.mockReturnValue(false)

    render(<LoginPage />)

    await waitFor(() => {
      expect(mockLiff.init).toHaveBeenCalledWith({ liffId: 'test-liff-id' })
    })
  })

  it('should show error when LIFF ID is not configured', async () => {
    delete process.env.NEXT_PUBLIC_LIFF_ID

    render(<LoginPage />)

    await waitFor(() => {
      expect(screen.getByText('LIFF ID not configured')).toBeInTheDocument()
    })

    const button = screen.getByRole('button', { name: /Continue with LINE/ })
    expect(button).toBeDisabled()
  })

  it('should show loading state when initializing LIFF', () => {
    mockLiff.init.mockReturnValue(new Promise(() => {})) // Never resolves
    
    render(<LoginPage />)

    expect(screen.getByText('Initializing LINE login...')).toBeInTheDocument()
    const button = screen.getByRole('button', { name: /Continue with LINE/ })
    expect(button).toBeDisabled()
  })

  it('should automatically login if user is already logged in', async () => {
    mockLiff.init.mockResolvedValue(undefined)
    mockLiff.isLoggedIn.mockReturnValue(true)
    mockLiff.getIDToken.mockReturnValue('mock-id-token')
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' }),
    })

    render(<LoginPage />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/line', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: 'mock-id-token' }),
      })
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: '🎉 Login Successful!',
      description: 'Welcome aboard! Logged in with LINE',
    })

    expect(mockPush).toHaveBeenCalledWith('/wallet')
  })

  it('should handle LINE login button click when not logged in', async () => {
    mockLiff.init.mockResolvedValue(undefined)
    mockLiff.isLoggedIn.mockReturnValue(false)

    render(<LoginPage />)

    await waitFor(() => {
      expect(mockLiff.init).toHaveBeenCalled()
    })

    const button = screen.getByRole('button', { name: /Continue with LINE/ })
    fireEvent.click(button)

    expect(mockLiff.login).toHaveBeenCalled()
  })

  it('should handle successful authentication', async () => {
    mockLiff.init.mockResolvedValue(undefined)
    mockLiff.isLoggedIn.mockReturnValue(true)
    mockLiff.getIDToken.mockReturnValue('mock-id-token')
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: 'Authentication successful' }),
    })

    render(<LoginPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: '🎉 Login Successful!',
        description: 'Welcome aboard! Logged in with LINE',
      })
    })

    expect(mockPush).toHaveBeenCalledWith('/wallet')
  })

  it('should handle authentication failure', async () => {
    mockLiff.init.mockResolvedValue(undefined)
    mockLiff.isLoggedIn.mockReturnValue(true)
    mockLiff.getIDToken.mockReturnValue('mock-id-token')
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Authentication failed' }),
    })

    render(<LoginPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: '❌ Login Failed',
        description: 'Authentication failed',
        variant: 'destructive',
      })
    })

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should handle missing ID token error', async () => {
    mockLiff.init.mockResolvedValue(undefined)
    mockLiff.isLoggedIn.mockReturnValue(true)
    mockLiff.getIDToken.mockReturnValue(null)

    render(<LoginPage />)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: '❌ Login Failed',
        description: 'Failed to get ID token',
        variant: 'destructive',
      })
    })
  })

  it('should show loading state during authentication', async () => {
    mockLiff.init.mockResolvedValue(undefined)
    mockLiff.isLoggedIn.mockReturnValue(false)

    render(<LoginPage />)

    await waitFor(() => {
      expect(mockLiff.init).toHaveBeenCalled()
    })

    const button = screen.getByRole('button', { name: /Continue with LINE/ })
    
    // Mock a slow authentication response
    global.fetch = jest.fn().mockReturnValue(
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Success' }),
          })
        }, 100)
      })
    )

    mockLiff.isLoggedIn.mockReturnValue(true)
    mockLiff.getIDToken.mockReturnValue('mock-id-token')

    fireEvent.click(button)

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Authenticating with LINE...')).toBeInTheDocument()
    })
  })

  it('should handle LIFF initialization error', async () => {
    mockLiff.init.mockRejectedValue(new Error('LIFF init failed'))

    render(<LoginPage />)

    await waitFor(() => {
      expect(screen.getByText('Failed to initialize LINE login')).toBeInTheDocument()
    })

    const button = screen.getByRole('button', { name: /Continue with LINE/ })
    expect(button).toBeDisabled()
  })
})