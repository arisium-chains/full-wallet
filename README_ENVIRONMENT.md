# Environment Configuration

This document explains how to set up environment variables for the ARIS Web3 Wallet application.

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Validate your configuration:**
   ```bash
   npm run validate-env
   ```

3. **Configure LINE OAuth** (see detailed guide below)

## Current Configuration Status

Your environment is currently configured with:

✅ **Basic Infrastructure:**
- PocketBase database connection
- ThirdWeb Engine blockchain operations  
- JWT authentication security
- Blockchain explorer integration

⏳ **Pending Configuration:**
- LINE OAuth integration (requires LINE Developer setup)

## LINE OAuth Setup

To enable user authentication, you need to configure LINE OAuth:

### Prerequisites
- LINE Developer account
- LINE Login Channel
- LIFF (LINE Front-end Framework) App

### Quick Setup Steps

1. **Create LINE Developer Account**
   - Go to [LINE Developers Console](https://developers.line.biz/)
   - Create a Provider and LINE Login Channel

2. **Configure Your Channel**
   - Add callback URL: `https://localhost:3000/api/auth/line/callback`
   - Enable scopes: `profile`, `openid`, `email`
   - Add allowed domain: `localhost:3000`

3. **Create LIFF App**
   - Endpoint URL: `https://localhost:3000/login`
   - Size: Full
   - Enable required scopes

4. **Update Environment Variables**
   ```env
   LINE_CLIENT_ID=your-channel-id
   LINE_CLIENT_SECRET=your-channel-secret  
   NEXT_PUBLIC_LIFF_ID=your-liff-app-id
   ```

5. **Validate Configuration**
   ```bash
   npm run validate-env
   ```

### Detailed Setup Guide

For complete step-by-step instructions, see: [LINE OAuth Setup Guide](./docs/LINE_OAUTH_SETUP.md)

## Environment Variables Reference

### Core Configuration
| Variable | Description | Status |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_ENDPOINT` | API base URL | ✅ Configured |
| `NEXT_PUBLIC_BASE_URL` | Application base URL | ✅ Configured |
| `JWT_SECRET` | JWT signing secret | ✅ Configured |

### Database & Storage
| Variable | Description | Status |
|----------|-------------|---------|
| `POCKETBASE_URL` | PocketBase instance URL | ✅ Configured |
| `POCKETBASE_TOKEN` | Admin authentication token | ✅ Configured |
| `USER_PASSWORD` | Default user password | ⚪ Optional |

### Blockchain Integration
| Variable | Description | Status |
|----------|-------------|---------|
| `ENGINE_BASE_URL` | ThirdWeb Engine URL | ✅ Configured |
| `ENGINE_X_BACKEND_WALLET_ADDRESS` | Backend wallet address | ✅ Configured |
| `ENGINE_AUTHORIZATION_TOKEN` | Engine API token | ✅ Configured |
| `ENGINE_CHAIN_ID` | Blockchain chain ID (87878) | ✅ Configured |
| `NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL` | Explorer URL | ✅ Configured |
| `NEXT_PUBLIC_DEFAULT_TOKEN` | Default token address | ⚪ Optional |

### LINE OAuth (Pending)
| Variable | Description | Status |
|----------|-------------|---------|
| `LINE_CLIENT_ID` | LINE Login Channel ID | ⏳ Pending |
| `LINE_CLIENT_SECRET` | LINE Login Channel Secret | ⏳ Pending |
| `NEXT_PUBLIC_LIFF_ID` | LIFF Application ID | ⏳ Pending |

## Security Notes

🔒 **JWT Secret**: Already configured with a cryptographically secure 128-character random string.

🔒 **PocketBase Token**: Your admin token is configured and secure.

⚠️ **Production Deployment**: Remember to:
- Use HTTPS URLs for all endpoints
- Update LINE OAuth callback URLs to production domain
- Review and rotate secrets as needed

## Troubleshooting

### Common Issues

**"LIFF ID not configured" Error:**
- Run `npm run validate-env` to check configuration
- Ensure `NEXT_PUBLIC_LIFF_ID` is set
- Restart development server after changes

**Authentication Fails:**
- Verify LINE OAuth credentials
- Check callback URLs match your configuration
- Ensure required scopes are enabled

**Build Errors:**
- Run `npm run validate-env` to identify missing variables
- Check for typos in variable names
- Ensure no trailing spaces in values

### Getting Help

1. **Validate Environment**: `npm run validate-env`
2. **Check Documentation**: [LINE OAuth Guide](./docs/LINE_OAUTH_SETUP.md)
3. **Review Configuration**: Compare with `.env.example`

## Next Steps

1. **Set up LINE OAuth** following the detailed guide
2. **Test authentication** with `npm run dev`
3. **Verify wallet functionality** works end-to-end
4. **Deploy to production** with proper HTTPS configuration

---

*For technical questions about environment configuration, refer to the troubleshooting section or the detailed setup guides.*