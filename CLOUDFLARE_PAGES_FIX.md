# Cloudflare Pages Deployment Fix

## Issue
The deployment is failing because Cloudflare Pages is trying to run `npx wrangler deploy`, which is for Workers, not Pages.

## Solution

### 1. Update Cloudflare Pages Settings

Go to your Cloudflare Pages project dashboard:
1. Navigate to **Settings** → **Builds & deployments**
2. Update the configuration:
   - **Build command**: `pnpm run build`
   - **Build output directory**: `.next`
   - **Deploy command**: **LEAVE COMPLETELY EMPTY** ⚠️
   - **Framework preset**: Next.js
   - **Node.js version**: 18

### 2. Important Notes

- ✅ Build command should be: `pnpm run build`
- ❌ Deploy command should be: **EMPTY** (delete any value)
- ✅ Build output directory: `.next`

### 3. Why This Works

- Cloudflare Pages automatically handles deployment after build
- No manual deploy command is needed
- Wrangler is for Workers, not Pages

### 4. Verification

After updating settings:
1. Save changes
2. Trigger a new deployment
3. Build should complete successfully
4. Deployment will happen automatically

## Fixed Issues
- Removed invalid `experimental.runtime` from next.config.mjs
- Fixed QR Scanner import error
- Removed all wrangler references

## Still Having Issues?

If deployment still fails:
1. Clear build cache in Cloudflare Pages
2. Ensure environment variables are set
3. Check that deploy command is truly empty