# Critical Security and Functionality Fixes

## 1. JWT Secret Security Fix

### Issue: Hardcoded JWT secret fallback
**File**: `middleware.ts`

```typescript
// CURRENT (INSECURE)
jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

// FIXED VERSION
const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error('JWT_SECRET environment variable is not set')
}
jwt.verify(token, jwtSecret)
```

## 2. Remove Hardcoded Wallet Address

### Issue: Fallback to hardcoded address
**File**: `app/wallet/page.tsx`

```typescript
// CURRENT (line 49-54)
const walletAddress = useMemo(() => {
  return walletState.walletAddress || 
         balanceData?.walletAddress || 
         userData?.walletAddress || 
         "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c" // REMOVE THIS
}, [walletState.walletAddress, balanceData?.walletAddress, userData?.walletAddress])

// FIXED VERSION
const walletAddress = useMemo(() => {
  return walletState.walletAddress || 
         balanceData?.walletAddress || 
         userData?.walletAddress || 
         null
}, [walletState.walletAddress, balanceData?.walletAddress, userData?.walletAddress])

// Add redirect logic after the useMemo
useEffect(() => {
  if (!isLoading && isAuthenticated && !walletAddress) {
    router.push('/wallet/setup')
  }
}, [isLoading, isAuthenticated, walletAddress, router])
```

## 3. Secure Token Storage

### Issue: Access token in localStorage
**File**: `app/providers/auth-provider.tsx`

```typescript
// CURRENT (VULNERABLE TO XSS)
const logout = () => {
  localStorage.removeItem('accessToken')
  sessionStorage.clear()
  setIsAuthenticated(false)
  window.location.href = '/login'
}

// FIXED VERSION - Use httpOnly cookies
const logout = async () => {
  try {
    await fetch('/api/auth/logout', { 
      method: 'POST',
      credentials: 'include' 
    })
  } catch (error) {
    console.error('Logout error:', error)
  }
  setIsAuthenticated(false)
  window.location.href = '/login'
}
```

## 4. Remove Sensitive Console Logs

### Issue: Logging sensitive data
**File**: `app/api/transfer/route.ts`

```typescript
// CURRENT (line 31-33)
(queueId) => {
  console.log('Queue ID:', queueId); // REMOVE
}

// FIXED VERSION
(queueId) => {
  // Use proper logging service in production
  if (process.env.NODE_ENV === 'development') {
    console.log('Transfer initiated:', { queueId })
  }
}
```

## 5. Add Network Error Handling

### Issue: No offline detection
**File**: Create new `hooks/useNetworkStatus.ts`

```typescript
import { useState, useEffect } from 'react'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial state
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
```

## 6. Add Request Timeout Configuration

### Issue: No timeout configuration
**File**: `src/libs/axios.lib.ts`

```typescript
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add retry logic with exponential backoff
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config
    
    if (!config || !config.retry) {
      config.retry = 0
    }
    
    if (config.retry >= 3) {
      return Promise.reject(error)
    }
    
    if (error.code === 'ECONNABORTED' || !error.response) {
      config.retry += 1
      const delay = Math.pow(2, config.retry) * 1000
      
      await new Promise(resolve => setTimeout(resolve, delay))
      return axiosInstance(config)
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance
```

## 7. Add ARIA Labels for Accessibility

### Issue: Missing accessibility attributes
**File**: `app/wallet/page.tsx`

```typescript
// Add ARIA labels to buttons
<Button
  onClick={copyAddress}
  disabled={isLoading}
  className="..."
  aria-label="Copy wallet address to clipboard"
>
  <Copy className="h-4 w-4 mr-2" />
  Copy 📋
</Button>

// Add ARIA live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {isLoading ? "Loading balance..." : totalPortfolioValue}
</div>
```

## 8. Fix Memory Leak in QR Scanner

### Issue: Event listeners not cleaned up
**File**: `components/ui/qr-scanner.tsx`

```typescript
useEffect(() => {
  let scanner: QrScanner | null = null

  if (isOpen && videoRef.current) {
    scanner = new QrScanner(
      videoRef.current,
      result => {
        onScan(result.data)
        setIsOpen(false)
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
      }
    )
    
    scanner.start().catch(err => {
      console.error('QR Scanner error:', err)
      setError('Camera access denied')
    })
  }

  // Cleanup function
  return () => {
    if (scanner) {
      scanner.destroy()
      scanner = null
    }
  }
}, [isOpen, onScan])
```

## 9. Add Error Boundary

### Issue: No error boundary for unexpected errors
**File**: Create new `components/ErrorBoundary.tsx`

```typescript
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
              <h2 className="text-2xl font-bold">Something went wrong</h2>
              <p className="text-gray-600">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
```

## 10. Add Rate Limiting Middleware

### Issue: No rate limiting on API endpoints
**File**: Create new `server/middlewares/rate-limit.middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(limit: number = 10, windowMs: number = 60000) {
  return (handler: Function) => {
    return async (req: NextRequest, ...args: any[]) => {
      const ip = req.headers.get('x-forwarded-for') || 'unknown'
      const now = Date.now()
      
      const record = requestCounts.get(ip) || { count: 0, resetTime: now + windowMs }
      
      if (now > record.resetTime) {
        record.count = 0
        record.resetTime = now + windowMs
      }
      
      record.count++
      requestCounts.set(ip, record)
      
      if (record.count > limit) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        )
      }
      
      return handler(req, ...args)
    }
  }
}
```

## Implementation Priority

1. **Immediate (Security Critical)**:
   - Fix JWT secret configuration
   - Remove sensitive console logs
   - Secure token storage

2. **High Priority (Functionality)**:
   - Handle missing wallet addresses
   - Add network error handling
   - Fix memory leaks

3. **Medium Priority (UX)**:
   - Add accessibility features
   - Implement error boundaries
   - Add request timeouts

4. **Low Priority (Enhancement)**:
   - Add rate limiting
   - Optimize animations
   - Implement virtual scrolling