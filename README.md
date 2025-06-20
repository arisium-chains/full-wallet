# ARIS Wallet - Web3 MVP

A modern Web3 wallet application with dual authentication support (LINE + Telegram) built on Next.js 15, React 19, and TypeScript.

## 🚀 Features

- **Dual Authentication**: LINE OAuth and Telegram Login Widget support
- **Guest User Support**: Automatic wallet creation for anonymous users
- **Web3 Wallet**: Secure digital asset management with ThirdWeb Engine
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Real-time Updates**: React Query for efficient data fetching
- **Backend Integration**: PocketBase for user management and data persistence
- **Auto-Provisioning**: Automatic wallet creation in both PocketBase and ThirdWeb Engine

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.17.0 or later)
- **npm** or **yarn** package manager
- **Git** for version control

## 🛠️ Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Web3 MVP"
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory and configure the following variables:

#### Required Configuration

```env
# API Configuration - Use relative URLs to avoid CORS issues
NEXT_PUBLIC_API_ENDPOINT=/api
NEXT_PUBLIC_BASE_URL=

# PocketBase Configuration (Backend Database)
POCKETBASE_URL=http://157.180.76.38:8090/
POCKETBASE_TOKEN="your_pocketbase_admin_token"
USER_PASSWORD=your_user_password

# ThirdWeb Engine Configuration (Blockchain Operations)
ENGINE_BASE_URL=http://157.180.76.38:3000
ENGINE_X_BACKEND_WALLET_ADDRESS=0x1E9D7b0fc11E79dbd7d8F9443F6ff3D4c0C36b16
ENGINE_AUTHORIZATION_TOKEN=changeme-admin-secret
ENGINE_CHAIN_ID=87878

# JWT Security
JWT_SECRET=your_128_character_secure_random_string

# Blockchain Explorer
NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL=https://exp.0xl3.com

# Token Configuration
NEXT_PUBLIC_DEFAULT_TOKEN=your_default_token_address
```

#### LINE Authentication Setup

To enable LINE OAuth authentication:

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Create a new LIFF app or use existing
3. Get your Channel ID, Channel Secret, and LIFF ID
4. Add these to your `.env.local`:

```env
# LINE Authentication
LINE_CLIENT_ID=2007610205
LINE_CLIENT_SECRET=48499fcdd760a2c0a57a75980d802f2b
NEXT_PUBLIC_LIFF_ID=2007610205-yJOrxJdk
```

#### Telegram Authentication Setup

To enable Telegram Login Widget:

1. Create a Telegram bot via [@BotFather](https://t.me/BotFather)
2. Use `/newbot` command and follow instructions
3. Get your bot token from BotFather
4. **IMPORTANT**: Set domain for your bot using `/setdomain` command:
   - Send `/setdomain` to @BotFather
   - Choose your bot (`@arisium_wallet_bot`)
   - For local development, enter: `localhost:3000`
   - For production, enter your actual domain (e.g., `yourdomain.com`)
5. Add these to your `.env.local`:

```env
# Telegram Authentication
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=arisium_wallet_bot
TELEGRAM_BOT_TOKEN=8186449279:AAHuhBTeVrkeJHZi3pE3Bp163ROgK-j6H3o
```

#### Authentication Providers Configuration

```env
# Authentication Providers
ALLOWED_AUTH_PROVIDERS=line,telegram
DEFAULT_AUTH_PROVIDER=line
```

### 4. Complete .env.local Example

```env
# API Configuration - Use relative URLs to avoid CORS issues
NEXT_PUBLIC_API_ENDPOINT=/api
NEXT_PUBLIC_BASE_URL=

# PocketBase Configuration
POCKETBASE_URL=http://157.180.76.38:8090/
POCKETBASE_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc0OTAxMzY5NywiaWQiOiI1NmNvN3cyejV3Mno0MW0iLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.kJ5_CnRmCgj_EAA7xlTAs4upHfiNxyx-I_pWlxK1sBk"
USER_PASSWORD=

# thirdweb Engine Configuration
ENGINE_BASE_URL=http://157.180.76.38:3000
ENGINE_X_BACKEND_WALLET_ADDRESS=0x1E9D7b0fc11E79dbd7d8F9443F6ff3D4c0C36b16
ENGINE_AUTHORIZATION_TOKEN=changeme-admin-secret
ENGINE_CHAIN_ID=87878

# LINE Authentication - Configured for ARIS Wallet
LINE_CLIENT_ID=2007610205
LINE_CLIENT_SECRET=48499fcdd760a2c0a57a75980d802f2b
NEXT_PUBLIC_LIFF_ID=2007610205-yJOrxJdk

# Telegram Authentication - Configure these for Telegram login
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=arisium_wallet_bot
TELEGRAM_BOT_TOKEN=8186449279:AAHuhBTeVrkeJHZi3pE3Bp163ROgK-j6H3o

# Authentication Providers Configuration
ALLOWED_AUTH_PROVIDERS=line,telegram
DEFAULT_AUTH_PROVIDER=line

# Token Configuration - Default token address for the chain
NEXT_PUBLIC_DEFAULT_TOKEN=

# JWT Secret - IMPORTANT: Secure random string for token signing
JWT_SECRET=8ba5be2e2631182b29bd5bdb2990d7d932dd4a7f4e8c8c8e8089e6e7997e3e776daf0b5dadd43cd1e3ef44a137231458ba26c599f27ae4e318e010f0a9b7d691

# Blockchain Configuration
NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL=https://exp.0xl3.com
```

## 🏃‍♂️ Running the Project

### Local Development

```bash
# Start development server
npm run dev
# or
yarn dev

# The application will be available at:
# http://localhost:3000 (or next available port)
```

### Production Build

```bash
# Build for production
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
```

### Other Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Run tests
npm test
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

1. Build the project: `npm run build`
2. Upload the `.next` folder and other required files
3. Set environment variables on your hosting platform
4. Start the application: `npm start`

## 🔧 Key Configuration Notes

### Security
- **JWT_SECRET**: Must be a cryptographically secure random string (128+ characters)
- **TELEGRAM_BOT_TOKEN**: Keep secure, provides full bot control
- **LINE_CLIENT_SECRET**: Keep secure, used for OAuth validation

### Authentication Flow
1. User visits the application
2. **Guest Mode**: If no authentication, automatically creates anonymous user with wallet
3. **Social Login**: User can choose LINE or Telegram authentication
4. Completes OAuth flow with chosen provider
5. Backend validates and creates/updates user session
6. User redirected to wallet dashboard

### Guest User System
- **Automatic Creation**: Users get a wallet immediately without authentication
- **Seamless Experience**: No barriers to entry for new users
- **Upgrade Path**: Guest users can later authenticate with LINE/Telegram
- **Full Functionality**: Guest users have complete wallet access

### Provider Requirements
- **LINE**: Requires LIFF app setup and domain configuration
- **Telegram**: Requires bot creation and domain whitelist in BotFather

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── login/             # Login page
│   ├── wallet/            # Wallet dashboard
│   └── providers/         # React providers
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   └── ui/               # UI components
├── src/                  # Source code
│   ├── interfaces/       # TypeScript interfaces
│   ├── services/         # Business logic
│   │   └── auth/         # Authentication services
│   ├── hooks/            # Custom React hooks
│   └── server/           # Server-side utilities
└── __tests__/            # Test files
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors (Access-Control-Allow-Origin)**
   - **Problem**: `Access to XMLHttpRequest at 'http://localhost:3001/api' from origin 'http://localhost:3000' has been blocked by CORS policy`
   - **Solution**: Use relative URLs in environment variables:
     ```env
     NEXT_PUBLIC_API_ENDPOINT=/api
     NEXT_PUBLIC_BASE_URL=
     ```
   - **Root Cause**: Frontend and backend running on different ports
   - **Fix**: Restart dev server after updating `.env.local`

2. **Environment Variables Not Loading**
   - Ensure `.env.local` is in project root
   - Restart development server after changes
   - Check for typos in variable names

3. **Telegram Authentication Not Available**
   - **"Bot domain invalid" error**: Use `/setdomain` command in @BotFather and set domain to `localhost:3000` for development
   - Verify `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` is set correctly (`arisium_wallet_bot`)
   - Check bot token is valid: `8186449279:AAHuhBTeVrkeJHZi3pE3Bp163ROgK-j6H3o`
   - Ensure bot is configured for web login with @BotFather

4. **LINE Authentication Fails**
   - Verify LIFF app domain configuration
   - Check LIFF ID and Channel credentials
   - Ensure domain is whitelisted in LINE console

5. **Build Errors**
   - Run `npm install` to update dependencies
   - Check TypeScript errors: `npm run type-check`
   - Verify all environment variables are set

6. **SSL Protocol Errors**
   - **Problem**: `net::ERR_SSL_PROTOCOL_ERROR`
   - **Solution**: Ensure environment URLs use `http://` not `https://` for localhost
   - Use relative URLs to avoid protocol mismatch

7. **PocketBase Authentication Issues**
   - **Problem**: `Missing or invalid collection context` or `The request requires valid record authorization token`
   - **Root Cause**: Admin token required for User_Wallet collection operations
   - **Current Status**: 
     - ✅ **Guest user creation works** - Basic user accounts can be created without admin token
     - ❌ **Wallet provisioning requires admin token** - User_Wallet collection needs admin permissions
   - **Solution**: Leave `POCKETBASE_TOKEN=""` for basic operations, add valid admin token for wallet features
   - **Debug**: Check `/api/debug/pocketbase` to verify admin token validity

### Debug Mode

Add these to your `.env.local` for debugging:

```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [ThirdWeb Documentation](https://thirdweb.com/docs)
- [PocketBase Documentation](https://pocketbase.io/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Built with ❤️ for the Web3 community**