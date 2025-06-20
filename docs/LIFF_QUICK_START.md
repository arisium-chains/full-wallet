# 🚀 LIFF Quick Start Guide

## 📋 **Checklist: LIFF Configuration**

### ✅ **Step 1: LINE Developers Console**
- [ ] Go to: https://developers.line.biz/
- [ ] Login with LINE account
- [ ] Create Provider (if needed)

### ✅ **Step 2: Create LINE Login Channel**
- [ ] Click "Create a new channel"
- [ ] Select "LINE Login"
- [ ] Fill in details:
  ```
  Channel name: ARIS Wallet Login
  App types: ✅ Web app
  Email: [your email]
  ```

### ✅ **Step 3: Configure Channel Settings**

#### **Basic Settings Tab:**
- [ ] Copy **Channel ID** → This becomes `LINE_CLIENT_ID`
- [ ] Copy **Channel Secret** → This becomes `LINE_CLIENT_SECRET`

#### **LINE Login Tab:**
- [ ] **Callback URL:** Add exactly this:
  ```
  https://localhost:3000/api/auth/line/callback
  ```
- [ ] **Scope:** Check these boxes:
  - [ ] ✅ `profile`
  - [ ] ✅ `openid`
  - [ ] ✅ `email`

### ✅ **Step 4: Create LIFF App**
- [ ] Go to "LIFF" tab
- [ ] Click "Add"
- [ ] Configure:
  ```
  LIFF app name: ARIS Wallet App
  Size: Full
  Endpoint URL: https://localhost:3000/login
  Scope: ✅ profile ✅ openid ✅ email
  ```
- [ ] Copy **LIFF ID** → This becomes `NEXT_PUBLIC_LIFF_ID`

### ✅ **Step 5: Update Environment**

#### **Option A: Use Interactive Helper**
```bash
npm run setup-liff
```

#### **Option B: Manual Update**
Edit `.env.local`:
```env
LINE_CLIENT_ID=your-channel-id
LINE_CLIENT_SECRET=your-channel-secret
NEXT_PUBLIC_LIFF_ID=your-liff-id
```

### ✅ **Step 6: Test Configuration**
```bash
# Validate environment
npm run validate-env

# Start development server
npm run dev

# Test login
# Open: http://localhost:3000/login
# Click LINE login button
```

---

## 🎯 **Common Configuration Values**

| Setting | Value | Notes |
|---------|-------|-------|
| **Callback URL** | `https://localhost:3000/api/auth/line/callback` | Exact URL required |
| **LIFF Endpoint** | `https://localhost:3000/login` | Must match your login page |
| **LIFF Size** | `Full` | For full-screen app experience |
| **Scopes** | `profile`, `openid`, `email` | Required for user authentication |

---

## 🔧 **Development vs Production**

### **Development (localhost)**
```
Callback URL: https://localhost:3000/api/auth/line/callback
LIFF Endpoint: https://localhost:3000/login
Allowed Domains: localhost:3000
```

### **Production (your domain)**
```
Callback URL: https://your-domain.com/api/auth/line/callback
LIFF Endpoint: https://your-domain.com/login
Allowed Domains: your-domain.com
```

---

## 🚨 **Troubleshooting**

### **LIFF initialization failed**
- ✅ Check LIFF ID format: `1234567890-abcdefgh`
- ✅ Verify endpoint URL matches exactly
- ✅ Ensure LIFF app is published

### **Callback URL mismatch**
- ✅ Verify callback URL is exact: `https://localhost:3000/api/auth/line/callback`
- ✅ No trailing slashes or extra characters
- ✅ Must use `https://` even for localhost

### **Scope permission denied**
- ✅ Check that `profile`, `openid`, `email` are enabled
- ✅ User must accept permissions during login
- ✅ Scopes must match between channel and LIFF app

### **Environment variables not loading**
- ✅ Restart development server after changing `.env.local`
- ✅ Check for typos in variable names
- ✅ No spaces around `=` sign

---

## 🎉 **Success Indicators**

When everything is working correctly:

1. **Environment validation passes:**
   ```bash
   npm run validate-env
   # Shows: ✅ All LINE OAuth variables configured
   ```

2. **Login page loads without errors:**
   ```
   http://localhost:3000/login
   # LINE login button appears and is clickable
   ```

3. **LIFF initializes successfully:**
   ```
   # Browser console shows no LIFF errors
   # Login button becomes active
   ```

4. **Authentication flow works:**
   ```
   Click LINE login → LINE OAuth page → Redirect back to app
   ```

---

## 📞 **Need Help?**

If you encounter issues:

1. **Run diagnostics:**
   ```bash
   npm run validate-env
   npm run setup-liff
   ```

2. **Check browser console** for JavaScript errors

3. **Verify LINE Developer Console** settings match this guide

4. **Test with a fresh browser tab** (clear cache if needed)

Ready to configure? Start with: **`npm run setup-liff`** 🚀