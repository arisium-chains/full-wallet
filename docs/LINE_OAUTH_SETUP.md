# LINE OAuth Setup Guide

This guide will walk you through setting up LINE OAuth authentication for the wallet application.

## Prerequisites

- LINE Developer account
- Access to LINE Developers Console
- Domain/server where the app will be hosted

## Step 1: LINE Developers Console Setup

### 1.1 Create a Provider (if you don't have one)
1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Log in with your LINE account
3. Click "Create a new provider"
4. Enter provider name and details

### 1.2 Create a LINE Login Channel
1. In your provider dashboard, click "Create a new channel"
2. Select "LINE Login" as the channel type
3. Fill in the required information:
   - **Channel name**: Your app name (e.g., "ARIS Wallet")
   - **Channel description**: Brief description of your wallet app
   - **App type**: Web app
   - **Email address**: Your contact email

4. **Important Settings**:
   - **App types**: Check "Web app"
   - **Permitted scope**: 
     - ✅ profile (to get user profile info)
     - ✅ openid (for ID token)
     - ✅ email (to get user email)

### 1.3 Configure Channel Settings
1. Go to the "LINE Login" tab in your channel
2. **Callback URL**: Add your callback URL
   ```
   https://your-domain.com/api/auth/line/callback
   ```
   For development:
   ```
   https://localhost:3000/api/auth/line/callback
   ```

3. **Allowed domains**: Add your domain
   ```
   your-domain.com
   localhost:3000  (for development)
   ```

## Step 2: Create LIFF App

### 2.1 Create LIFF App
1. In your channel dashboard, go to the "LIFF" tab
2. Click "Add" to create a new LIFF app
3. Configure LIFF settings:
   - **LIFF app name**: Your app name
   - **Size**: Full
   - **Endpoint URL**: 
     ```
     https://your-domain.com/login
     ```
     For development:
     ```
     https://localhost:3000/login
     ```
   - **Scope**: 
     - ✅ profile
     - ✅ openid
     - ✅ email
   - **Bot link feature**: Optional (enable if you have a LINE bot)

### 2.2 Additional LIFF Settings
- **Module mode**: Disable (not needed for full-size apps)
- **Use server-to-server API**: Enable if you need server-side API calls

## Step 3: Get Credentials

### 3.1 Channel Credentials
From your LINE Login channel dashboard:

1. **Channel ID**: Found in "Basic settings" tab
   ```
   Example: 1234567890
   ```

2. **Channel Secret**: Found in "Basic settings" tab
   ```
   Example: abcdef1234567890abcdef1234567890
   ```

### 3.2 LIFF App ID
From your LIFF app:
1. Go to LIFF tab
2. Copy the LIFF ID
   ```
   Example: 1234567890-abcdefgh
   ```

## Step 4: Configure Environment Variables

Update your `.env.local` file:

```env
# LINE Authentication
LINE_CLIENT_ID=1234567890
LINE_CLIENT_SECRET=abcdef1234567890abcdef1234567890
NEXT_PUBLIC_LIFF_ID=1234567890-abcdefgh

# Make sure your base URL is correct
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_API_ENDPOINT=https://your-domain.com/api

# Generate a secure JWT secret (use a random generator)
JWT_SECRET=your-super-secure-random-jwt-secret-key-64-characters-minimum
```

## Step 5: Test the Setup

### 5.1 Development Testing
1. Start your development server
2. Navigate to `/login` or `/wallet-login`
3. Click the LINE login button
4. You should be redirected to LINE OAuth
5. After authorization, you should be redirected back to your app

### 5.2 Production Testing
1. Deploy your app to your production domain
2. Update the LINE channel settings with your production URLs
3. Test the complete flow

## Step 6: Security Considerations

### 6.1 JWT Secret
- **Generate a cryptographically secure random string**
- **Minimum 64 characters recommended**
- **Use a password generator or crypto.randomBytes()**

Example generation methods:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

### 6.2 Environment Security
- ✅ Never commit `.env.local` to version control
- ✅ Use different credentials for development and production
- ✅ Regularly rotate secrets
- ✅ Use HTTPS in production
- ✅ Validate redirect URLs

## Troubleshooting

### Common Issues

#### 1. "LIFF ID not configured" Error
- Check that `NEXT_PUBLIC_LIFF_ID` is set in `.env.local`
- Ensure the LIFF ID format is correct (numbers-letters)
- Restart your development server after changing env vars

#### 2. "Failed to initialize LINE login" Error
- Verify your LIFF app endpoint URL matches your app URL
- Check that your domain is in the allowed domains list
- Ensure LIFF app is published and active

#### 3. Authentication Fails
- Verify `LINE_CLIENT_ID` and `LINE_CLIENT_SECRET` are correct
- Check that callback URL is properly configured
- Ensure scope permissions (profile, openid, email) are enabled

#### 4. Redirect Issues
- Verify `NEXT_PUBLIC_BASE_URL` matches your actual domain
- Check that callback URLs are properly configured in LINE console
- Ensure HTTPS is used in production

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify network requests in developer tools
3. Check server logs for authentication errors
4. Validate environment variables are loaded correctly

## Production Deployment Checklist

- [ ] Update LIFF endpoint URL to production domain
- [ ] Update callback URLs to production domain
- [ ] Add production domain to allowed domains
- [ ] Generate secure JWT secret for production
- [ ] Use HTTPS URLs for all endpoints
- [ ] Test complete authentication flow
- [ ] Verify user profile data is correctly retrieved
- [ ] Test wallet creation after authentication

## Additional Resources

- [LINE Login Documentation](https://developers.line.biz/en/docs/line-login/)
- [LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [LINE Login API Reference](https://developers.line.biz/en/reference/line-login/)