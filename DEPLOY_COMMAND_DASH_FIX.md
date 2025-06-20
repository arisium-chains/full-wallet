# 🎯 Deploy Command Shows Dash (-) - Almost Fixed!

## Progress Made ✅
Your build log now shows:
```
Executing user deploy command: -
```

This is much better than `npx wrangler deploy`! You successfully cleared most of the deploy command.

## Issue: Deploy Command Still Has a Dash
The deploy command field still contains a single dash (`-`) character, which is causing:
```
/bin/sh: 0: -c requires an argument
```

## Solution: Remove the Dash

### Steps:
1. **Go back to Cloudflare Pages Dashboard**
2. **Settings** → **Builds & deployments**
3. **Find the "Deploy command" field**
4. **You'll see it contains just**: `-`
5. **Click in the field and delete the dash**
6. **The field should be COMPLETELY EMPTY** (no characters at all)
7. **Save changes**

### What you should see after fixing:
- Deploy command field: *(completely blank - no dash, no space, nothing)*
- Build should complete without trying to execute a deploy command

## Expected Success Log:
```
Success: Build command completed
Publishing to Cloudflare Pages... ✅
Deployment successful! ✅
```

## You're Very Close!
Just remove that single dash character and your deployment will work perfectly!