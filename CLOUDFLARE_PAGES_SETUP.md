# Cloudflare Pages Setup for Next.js

## Build Configuration

The project is now optimized for Cloudflare Pages with @cloudflare/next-on-pages adapter.

### Settings in Cloudflare Pages Dashboard:

```
Framework preset: Next.js
Build command: npx @cloudflare/next-on-pages@1
Build output directory: .vercel/output/static
Root directory: /
```

### How it Works:

1. **@cloudflare/next-on-pages** - Transforms Next.js build output for Cloudflare Pages
2. **Build Output** - Creates static assets in `.vercel/output/static`
3. **API Routes** - Converted to Cloudflare Pages Functions automatically
4. **Edge Runtime** - Optimized for Cloudflare's edge network

### Environment Variables:

Set these in Cloudflare Pages dashboard:

```
# PocketBase Configuration
NEXT_PUBLIC_POCKETBASE_URL=your_pocketbase_url
POCKETBASE_URL=your_pocketbase_url
NEXT_PUBLIC_USER_PASSWORD=your_password
USER_PASSWORD=your_password

# LINE Authentication
LINE_CLIENT_ID=your_line_client_id
LINE_CLIENT_SECRET=your_line_client_secret
NEXT_PUBLIC_LIFF_ID=your_liff_id

# Telegram Authentication
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_TOKEN=your_bot_token

# JWT Security
JWT_SECRET=your_jwt_secret

# Blockchain
NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL=https://exp.0xl3.com
```

### Local Development:

```bash
# Regular Next.js development
npm run dev

# Preview with Cloudflare Pages locally
npm run pages:build
npm run pages:preview
```

### Deployment:

1. Push to GitHub
2. Cloudflare Pages will automatically build with the configured settings
3. API routes will be converted to edge functions
4. Static assets will be served from Cloudflare's CDN

### Benefits:

- ✅ No file size limits (handles large files automatically)
- ✅ API routes work as edge functions
- ✅ Better performance on Cloudflare's network
- ✅ Automatic optimization for edge runtime
- ✅ Built-in caching and CDN