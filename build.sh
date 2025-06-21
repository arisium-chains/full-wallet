#!/bin/bash
# Build script for Cloudflare Pages
# Removes cache to avoid file size limit

echo "Cleaning cache directory..."
rm -rf .next/cache

echo "Building Next.js application..."
npx next build

echo "Removing cache after build..."
rm -rf .next/cache

echo "Build complete!"