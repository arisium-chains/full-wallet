# ARIS Wallet - Web3 MVP

A modern Web3 wallet application with dual authentication support (LINE + Telegram) built on Next.js 15, React 19, and TypeScript.

## 🚀 **Cloudflare Pages Deployment**

### **Quick Deploy to Cloudflare Pages**

1. **Push to GitHub** ✅ (Already done)
2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project" → "Connect to Git"
   - Select your repository: `arisium-chains/full-wallet`

3. **Build Settings**:
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   Root directory: /
   Node.js version: 18
   Environment variables: [See below]
   ```
   
   **Important**: Deploy via Cloudflare Pages Dashboard (NOT Wrangler CLI)

### **Environment Variables for Production**

Set these in Cloudflare Pages → Settings → Environment variables:

```env
# PocketBase Configuration
NEXT_PUBLIC_POCKETBASE_URL=https://your-production-pocketbase.com/
POCKETBASE_URL=https://your-production-pocketbase.com/
NEXT_PUBLIC_USER_PASSWORD=your_secure_password
USER_PASSWORD=your_secure_password

# LINE Authentication
LINE_CLIENT_ID=your_line_client_id
LINE_CLIENT_SECRET=your_line_client_secret
NEXT_PUBLIC_LIFF_ID=your_liff_id

# Telegram Authentication  
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_TOKEN=your_bot_token

# JWT Security
JWT_SECRET=your_secure_jwt_secret_128_chars_minimum

# Blockchain Configuration
NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL=https://exp.0xl3.com
```

### **Post-Deployment Configuration**

#### **1. Update Bot Domains**

**Telegram Bot:**
```
1. Go to @BotFather on Telegram
2. Send: /setdomain
3. Select: @your_bot_username
4. Enter: your-site.pages.dev
```

**LINE LIFF:**
```
1. Go to LINE Developers Console
2. Update LIFF app domain to: your-site.pages.dev
3. Add to whitelist domains
```

#### **2. Configure PocketBase CORS**

Add your production domain to PocketBase CORS settings:
```
https://your-site.pages.dev
```

## 🛠️ **Local Development**

### **Prerequisites**
- Node.js 18+ 
- npm 8+

### **Setup**
```bash
# Clone repository
git clone https://github.com/arisium-chains/full-wallet.git
cd full-wallet

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Configure your .env.local with development values
# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 🔧 **Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🌟 **Features**

- **Dual Authentication**: LINE OAuth + Telegram Login Widget
- **Guest User Support**: Automatic wallet creation for anonymous users  
- **Web3 Wallet**: Secure digital asset management
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Real-time Updates**: React Query for efficient data fetching

## 📁 **Project Structure**

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes (auth, wallet, etc.)
│   ├── login/             # Login page
│   ├── wallet/            # Wallet dashboard
│   └── providers/         # React providers
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   └── ui/               # UI components
├── src/                  # Source code
│   ├── interfaces/       # TypeScript interfaces
│   ├── services/         # Business logic
│   ├── hooks/            # Custom React hooks
│   └── server/           # Server-side utilities
└── DEPLOYMENT.md         # Detailed deployment guide
```

## 🔐 **Security Features**

- JWT token authentication
- Secure session management  
- CORS protection
- Environment variable validation
- No sensitive data in client build

## 📚 **Documentation**

- [Deployment Guide](./DEPLOYMENT.md) - Comprehensive deployment instructions
- [Environment Setup](./.env.example) - Environment variable reference

## 🆘 **Support**

For deployment issues:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for troubleshooting
- Verify all environment variables are set
- Ensure bot domains are configured correctly

---

**🚀 Ready for production deployment to Cloudflare Pages! All Edge Runtime routes configured.**