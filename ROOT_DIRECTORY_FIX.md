# 🚨 Fix "Root Directory Not Found" Error

## Error
```
Failed: root directory not found
```

## Problem
The "Root directory (build path)" setting in Cloudflare Pages is incorrect.

## Solution

### Update Cloudflare Pages Settings:

Go to **Settings** → **Builds & deployments** and set:

```
Root directory (build path): /
Build command: pnpm run build
Build output directory: .next
Deploy command: true
Framework preset: Next.js
Node.js version: 18
```

### Critical Settings:

1. **Root directory**: `/` (forward slash - means project root)
   - ❌ NOT empty
   - ❌ NOT `/Users/...` 
   - ❌ NOT `./`
   - ✅ Just `/`

2. **Build output directory**: `.next`

3. **Build command**: `pnpm run build`

## Why This Happens:
- Root directory tells Cloudflare where your project files are in the repo
- `/` means the project is at the repository root
- If it's set to something else, Cloudflare can't find your files

## After Fixing:
1. Save settings
2. Trigger new deployment
3. Build should start successfully
4. Look for "Executing user build command: pnpm run build"

The build should proceed normally after setting root directory to `/`.