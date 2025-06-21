# 🚨 IMPORTANT: Fix Build Command in Cloudflare Pages

## The Problem
Your build logs show:
```
Executing user command: npx next build
```

But we need it to remove the cache files!

## Solution: Update Cloudflare Pages Settings

Go to **Cloudflare Pages Dashboard** → **Settings** → **Builds & deployments**

### Change the Build Command:

**FROM:**
```
npx next build
```

**TO:**
```
npm run build
```

OR

```
pnpm run build
```

## Why This Matters
- Our `npm run build` command runs `./build.sh` which removes cache
- Direct `npx next build` doesn't remove the 63.8MB cache file
- Cloudflare Pages has a 25MB file size limit

## Complete Settings:
```
Build command: npm run build  (or pnpm run build)
Build output directory: .next
Root directory: /
Framework preset: Next.js
Node.js version: 18
```

## After Updating:
1. Save settings
2. Trigger new deployment
3. Build should succeed without file size error

The build script will now:
1. Remove cache before build
2. Build the application
3. Remove cache after build
4. Deploy successfully!