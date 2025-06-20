# LIFF Configuration Template

## Step 5: Update Your Environment Variables

Once you've completed the LINE Developer Console setup, update your `.env.local` file with these values:

```env
# LINE Authentication - REPLACE WITH YOUR ACTUAL VALUES
LINE_CLIENT_ID=1234567890
LINE_CLIENT_SECRET=abcdef1234567890abcdef1234567890  
NEXT_PUBLIC_LIFF_ID=1234567890-abcdefgh
```

## Where to Find These Values:

### LINE_CLIENT_ID
1. Go to your LINE Login channel
2. Click "Basic settings" tab
3. Copy the "Channel ID" number

### LINE_CLIENT_SECRET  
1. Same location as Channel ID
2. Copy the "Channel secret" (long string)
3. ⚠️ Keep this secret secure!

### NEXT_PUBLIC_LIFF_ID
1. Go to "LIFF" tab in your channel
2. Copy the LIFF ID (format: numbers-letters)

## Quick Validation

After updating `.env.local`, run:
```bash
npm run validate-env
```

You should see all LINE OAuth variables show as ✅ Configured.

## Test Your Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000/login

3. Click the LINE login button

4. You should be redirected to LINE OAuth page

## Troubleshooting

**"LIFF initialization failed":**
- Check that LIFF ID is correct
- Ensure endpoint URL matches exactly: https://localhost:3000/login
- Verify LIFF app is published/active

**"Callback URL mismatch":**
- Ensure callback URL is: https://localhost:3000/api/auth/line/callback
- Check for typos or extra spaces

**Development vs Production:**
- For development: use localhost:3000
- For production: replace with your actual domain