# Cloudflare Pages Deployment Guide

This guide explains how to deploy the ARIS Wallet to Cloudflare Pages with full Next.js support including API routes.

## 🚀 **Quick Deployment Steps**

### **Via Cloudflare Dashboard (Recommended)**

1. **Login to Cloudflare Dashboard**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"

2. **Connect Git Repository**
   - Connect your GitHub/GitLab repository
   - Select the repository containing this project

3. **Configure Build Settings**
   ```
   Framework preset: Next.js
   Build command: pnpm run build
   Build output directory: .next
   Root directory: /
   Node.js version: 18
   ```

   **IMPORTANT**: Do NOT set a deploy command. Cloudflare Pages handles deployment automatically.

4. **Set Environment Variables**
   - Go to Settings → Environment Variables
   - Add all variables from `.env.example`
   - Make sure to use production URLs for PocketBase

### **Environment Variables for Production**

Copy these to Cloudflare Pages environment variables:

```env
# PocketBase Configuration
NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-url.com/
NEXT_PUBLIC_USER_PASSWORD=your_secure_password

# LINE Authentication
NEXT_PUBLIC_LIFF_ID=your_liff_id

# Telegram Authentication
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token

# Blockchain Configuration
NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL=https://exp.0xl3.com
```

### **Configure Bot Domains**

#### **Telegram Bot Configuration**
```
1. Go to @BotFather on Telegram
2. Send: /setdomain
3. Select: @your_bot_username  
4. Enter: yourdomain.pages.dev
```

#### **LINE LIFF Configuration**
```
1. Go to LINE Developers Console
2. Update LIFF app domain to: yourdomain.pages.dev
3. Add to whitelist domains
```

## 🔧 **Project Structure for Cloudflare Pages**

```
├── .next/                   # Next.js build output
├── app/
│   └── api/                 # API routes (fully supported)
├── components/
│   └── auth/                # Authentication components
├── src/
│   ├── services/auth/       # Authentication services
│   └── hooks/user/          # User management hooks
├── next.config.mjs         # Next.js configuration
└── DEPLOYMENT.md          # This file
```

## 📝 **Key Features**

### **1. Full Next.js Support**
- **API Routes**: Complete backend functionality
- **Server-Side Rendering**: Dynamic content support
- **Edge Runtime**: Fast global performance

### **2. Authentication Architecture**
- **Server-Side API**: Secure authentication endpoints
- **PocketBase Integration**: Full database operations
- **JWT Token Management**: Secure session handling

### **3. Environment Variables**
- **Server Secrets**: Secure backend configuration
- **Client Variables**: Public configuration with NEXT_PUBLIC_ prefix

## 🔍 **Troubleshooting**

### **Build Issues**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Build again
npm run build
```

### **Deployment Command Issues**
If you see "npx wrangler deploy" errors:
1. Make sure wrangler is NOT installed: `npm uninstall wrangler`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. In Cloudflare Pages settings, ensure "Deploy command" is empty
4. Only "Build command" should be set to: `pnpm run build`

### **Authentication Issues**
1. **Check environment variables** are set in Cloudflare Pages
2. **Verify bot domains** are configured correctly
3. **Test PocketBase connectivity** from production domain

### **Routing Issues**
- Ensure Next.js is properly configured for production
- Check Cloudflare Pages routing configuration

## 🌐 **Production Checklist**

- [ ] Environment variables configured in Cloudflare Pages
- [ ] Telegram bot domain set to production URL
- [ ] LINE LIFF app domain updated
- [ ] PocketBase CORS configured for production domain
- [ ] Build command set to `pnpm run build`
- [ ] Deploy command is EMPTY (not set)
- [ ] SSL certificate active on custom domain (if used)

## 📊 **Performance Optimization**

Cloudflare Pages provides:
- **Fast Loading**: Optimized Next.js builds
- **Global CDN**: Cloudflare's edge network
- **Caching**: Intelligent caching for static and dynamic content
- **Security**: Built-in DDoS protection

## 🔐 **Security Considerations**

- **Environment Variables**: Sensitive keys protected on server
- **API Routes**: Secure server-side endpoints
- **HTTPS**: Always enforced in production
- **Edge Runtime**: Additional security layer

---

**Deployment Time**: ~2-3 minutes  
**Build Time**: ~30-60 seconds  
**Global Availability**: Immediate via Cloudflare CDN