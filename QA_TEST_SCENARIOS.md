# QA Test Scenarios - Step-by-Step Reproduction Guide

## Test Environment Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add:
# JWT_SECRET=your-secure-secret-key
# NEXT_PUBLIC_API_URL=your-api-url
```

## 1. Authentication Flow Tests

### Test Case 1.1: Unauthenticated Access to Protected Routes
**Steps:**
1. Clear all cookies and localStorage
2. Navigate directly to `/wallet`
3. **Expected**: Redirect to `/login`
4. **Actual**: ✅ Works as expected

### Test Case 1.2: JWT Token Validation
**Steps:**
1. Open browser DevTools > Application > Cookies
2. Modify the `authtoken` cookie value
3. Navigate to `/wallet`
4. **Expected**: Redirect to `/login`
5. **Issue Found**: ⚠️ Uses hardcoded JWT secret

### Test Case 1.3: Token Expiration
**Steps:**
1. Log in successfully
2. Wait for token to expire (check token exp claim)
3. Try to access `/wallet`
4. **Expected**: Redirect to login with session expired message
5. **Actual**: ❌ No expiration handling

## 2. Wallet Operations Tests

### Test Case 2.1: Balance Display with No Data
**Steps:**
1. Mock API to return empty balance
2. Navigate to `/wallet`
3. **Expected**: Show "0.00" balance
4. **Issue**: Shows hardcoded wallet address

### Test Case 2.2: Send Tokens - Invalid Address
**Steps:**
1. Navigate to `/wallet/send`
2. Enter invalid address: "0x123"
3. Enter amount: "1"
4. **Expected**: Show "Invalid Ethereum address format"
5. **Actual**: ✅ Validation works

### Test Case 2.3: Send Tokens - Insufficient Balance
**Steps:**
1. Navigate to `/wallet/send`
2. Enter valid address
3. Enter amount greater than balance
4. **Expected**: Show "Insufficient balance" error
5. **Actual**: ✅ Validation works

### Test Case 2.4: Send to Self
**Steps:**
1. Copy your wallet address
2. Navigate to `/wallet/send`
3. Paste your own address
4. Enter valid amount
5. **Expected**: Show "Cannot send tokens to yourself"
6. **Actual**: ✅ Validation works

## 3. Edge Cases Tests

### Test Case 3.1: Network Failure Simulation
**Steps:**
1. Open DevTools > Network
2. Set to "Offline"
3. Navigate to `/wallet`
4. **Expected**: Show network error with retry option
5. **Actual**: ❌ Infinite loading state

### Test Case 3.2: API Timeout
**Steps:**
1. Use browser extension to delay API responses by 30s
2. Navigate to `/wallet`
3. **Expected**: Timeout error after reasonable time
4. **Actual**: ❌ Waits indefinitely

### Test Case 3.3: Concurrent Requests
**Steps:**
1. Open `/wallet` in multiple tabs
2. Trigger balance refresh in all tabs simultaneously
3. Click "MAX" button rapidly 10 times
4. **Expected**: Debounced requests, no errors
5. **Actual**: ⚠️ Multiple requests fired

## 4. UI/UX Tests

### Test Case 4.1: Mobile Responsiveness
**Steps:**
1. Open Chrome DevTools
2. Toggle device toolbar
3. Test on iPhone SE (375px) and iPad (768px)
4. Check all wallet pages
5. **Issues Found**: 
   - Bottom navigation overlaps content
   - Send form buttons too small on mobile

### Test Case 4.2: Loading States
**Steps:**
1. Throttle network to "Slow 3G"
2. Navigate through all wallet pages
3. **Expected**: Skeleton loaders for all data
4. **Actual**: ✅ Proper loading states

### Test Case 4.3: Keyboard Navigation
**Steps:**
1. Use only Tab key to navigate
2. Try to complete a send transaction
3. **Expected**: All elements reachable and operable
4. **Actual**: ❌ Cannot access QR scanner button

## 5. Security Tests

### Test Case 5.1: XSS Injection
**Steps:**
1. In send form, enter: `<script>alert('XSS')</script>`
2. Submit form
3. **Expected**: Input sanitized, no script execution
4. **Actual**: ✅ React escapes output

### Test Case 5.2: Console Data Exposure
**Steps:**
1. Open DevTools Console
2. Complete a transaction
3. **Expected**: No sensitive data logged
4. **Actual**: ❌ Queue IDs and addresses logged

### Test Case 5.3: LocalStorage Security
**Steps:**
1. Open DevTools > Application > Local Storage
2. Check for sensitive data
3. **Expected**: No tokens or private data
4. **Actual**: ⚠️ Access token stored in plain text

## 6. Performance Tests

### Test Case 6.1: Large Transaction List
**Steps:**
1. Mock API to return 1000 transactions
2. Navigate to `/wallet/activity`
3. Scroll through list
4. **Expected**: Smooth scrolling, pagination
5. **Actual**: ⚠️ Initial load slow, no virtualization

### Test Case 6.2: Memory Leak Detection
**Steps:**
1. Open DevTools > Memory
2. Take heap snapshot
3. Navigate between wallet pages 20 times
4. Take another snapshot
5. **Expected**: Minimal memory growth
6. **Actual**: ⚠️ Memory increases by ~5MB

### Test Case 6.3: Animation Performance
**Steps:**
1. Open DevTools > Performance
2. Record while using the app
3. Check for frame drops
4. **Issues**: Gradient animations cause jank on mobile

## 7. Browser Compatibility Tests

### Test Case 7.1: Safari Compatibility
**Steps:**
1. Test on Safari 14+
2. Check all wallet functionality
3. **Issues Found**: 
   - QR scanner requires permissions
   - Some CSS animations choppy

### Test Case 7.2: Firefox Private Mode
**Steps:**
1. Open Firefox private window
2. Try to log in and use wallet
3. **Expected**: Works with session storage
4. **Actual**: ❌ LocalStorage blocked causes errors

## Automated Test Commands

```bash
# Run unit tests (currently broken due to SWC issue)
npm test

# Run specific test file
npm test -- --testPathPattern=wallet

# Run with coverage
npm run test:coverage

# Manual E2E test setup (recommended)
npx playwright install
npx playwright test
```

## Bug Reproduction Steps

### Critical Bug 1: Hardcoded JWT Secret
**File**: `middleware.ts`, line 26
```typescript
jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
```
**Fix**: Remove fallback value, throw error if not set

### Critical Bug 2: No Wallet Handling
**File**: `app/wallet/page.tsx`, line 53
```typescript
walletAddress || "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c"
```
**Fix**: Redirect to wallet setup if no address

### Critical Bug 3: Console Logging
**File**: `app/api/transfer/route.ts`, line 32
```typescript
console.log('Queue ID:', queueId);
```
**Fix**: Use proper logging library with levels

## Recommended Testing Tools

1. **Playwright** - E2E testing
2. **React Testing Library** - Component testing  
3. **MSW** - API mocking
4. **Lighthouse** - Performance testing
5. **axe-core** - Accessibility testing
6. **BrowserStack** - Cross-browser testing