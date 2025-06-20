#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * 
 * This script validates that all required environment variables are properly configured
 * for LINE OAuth and wallet functionality.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function colorLog(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    colorLog('❌ .env.local file not found!', 'red');
    colorLog('Please copy .env.example to .env.local and configure your values.', 'yellow');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#][^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      envVars[key] = value;
    }
  });

  return envVars;
}

function validateEnvironment() {
  colorLog('\n🔍 Validating Environment Configuration for LINE OAuth & Wallet', 'cyan');
  colorLog('=' .repeat(70), 'cyan');

  const env = loadEnvFile();
  let hasErrors = false;
  let hasWarnings = false;

  // Required variables for basic functionality
  const requiredVars = [
    'NEXT_PUBLIC_API_ENDPOINT',
    'NEXT_PUBLIC_BASE_URL',
    'POCKETBASE_URL',
    'POCKETBASE_TOKEN',
    'ENGINE_BASE_URL',
    'ENGINE_X_BACKEND_WALLET_ADDRESS',
    'ENGINE_AUTHORIZATION_TOKEN',
    'ENGINE_CHAIN_ID',
    'JWT_SECRET',
    'NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL'
  ];

  // LINE OAuth specific variables (will be empty until configured)
  const lineOAuthVars = [
    'LINE_CLIENT_ID',
    'LINE_CLIENT_SECRET',
    'NEXT_PUBLIC_LIFF_ID'
  ];

  // Optional variables
  const optionalVars = [
    'USER_PASSWORD',
    'NEXT_PUBLIC_DEFAULT_TOKEN'
  ];

  colorLog('\n📋 Required Variables:', 'blue');
  requiredVars.forEach(varName => {
    const value = env[varName];
    // Special case for ENGINE_AUTHORIZATION_TOKEN - "changeme-admin-secret" might be the actual value
    if (!value || (value.includes('your-') || (value.includes('changeme') && varName !== 'ENGINE_AUTHORIZATION_TOKEN'))) {
      colorLog(`  ❌ ${varName}: Missing or placeholder value`, 'red');
      hasErrors = true;
    } else {
      colorLog(`  ✅ ${varName}: Configured`, 'green');
    }
  });

  colorLog('\n🔐 LINE OAuth Variables (to be configured):', 'magenta');
  let lineConfigured = 0;
  lineOAuthVars.forEach(varName => {
    const value = env[varName];
    if (!value || value.includes('your-') || value === '%') {
      colorLog(`  ⏳ ${varName}: Not configured yet`, 'yellow');
    } else {
      colorLog(`  ✅ ${varName}: Configured`, 'green');
      lineConfigured++;
    }
  });

  colorLog('\n📦 Optional Variables:', 'blue');
  optionalVars.forEach(varName => {
    const value = env[varName];
    if (!value) {
      colorLog(`  ⚪ ${varName}: Empty (optional)`, 'white');
    } else {
      colorLog(`  ✅ ${varName}: Configured`, 'green');
    }
  });

  // Security checks
  colorLog('\n🔒 Security Validation:', 'yellow');
  
  // JWT Secret validation
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.includes('your-') || jwtSecret.length < 32) {
    colorLog('  ❌ JWT_SECRET: Too weak or placeholder', 'red');
    hasErrors = true;
  } else if (jwtSecret.length < 64) {
    colorLog('  ⚠️  JWT_SECRET: Should be longer (64+ chars recommended)', 'yellow');
    hasWarnings = true;
  } else {
    colorLog('  ✅ JWT_SECRET: Strong and secure', 'green');
  }

  // HTTPS check for production
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  if (baseUrl && !baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) {
    colorLog('  ⚠️  BASE_URL: Should use HTTPS in production', 'yellow');
    hasWarnings = true;
  }

  // Engine authorization check
  const engineAuth = env.ENGINE_AUTHORIZATION_TOKEN;
  if (engineAuth === 'changeme-admin-secret') {
    colorLog('  ⚠️  ENGINE_AUTHORIZATION_TOKEN: Using default value (may be intended)', 'yellow');
    colorLog('     If this is your actual engine config, this warning can be ignored', 'white');
    hasWarnings = true;
  }

  // Summary
  colorLog('\n' + '=' .repeat(70), 'cyan');
  colorLog('📊 VALIDATION SUMMARY:', 'cyan');

  if (hasErrors) {
    colorLog('❌ Configuration has errors that must be fixed!', 'red');
  } else {
    colorLog('✅ Basic configuration is valid!', 'green');
  }

  if (lineConfigured === 0) {
    colorLog('⏳ LINE OAuth not configured yet (this is expected)', 'yellow');
    colorLog('📖 See docs/LINE_OAUTH_SETUP.md for setup instructions', 'blue');
  } else if (lineConfigured < 3) {
    colorLog('⚠️  LINE OAuth partially configured', 'yellow');
  } else {
    colorLog('✅ LINE OAuth fully configured!', 'green');
  }

  if (hasWarnings) {
    colorLog('⚠️  Some warnings found - review above', 'yellow');
  }

  colorLog('\n🚀 Next Steps:', 'cyan');
  if (hasErrors) {
    colorLog('1. Fix the errors marked with ❌', 'red');
    colorLog('2. Run this script again to validate', 'blue');
  } else if (lineConfigured < 3) {
    colorLog('1. Follow LINE OAuth setup guide in docs/LINE_OAUTH_SETUP.md', 'blue');
    colorLog('2. Configure LINE_CLIENT_ID, LINE_CLIENT_SECRET, and NEXT_PUBLIC_LIFF_ID', 'blue');
    colorLog('3. Run this script again to validate', 'blue');
  } else {
    colorLog('1. Start your application: npm run dev', 'green');
    colorLog('2. Test LINE OAuth login functionality', 'green');
    colorLog('3. Create and test wallet operations', 'green');
  }

  colorLog('\n' + '=' .repeat(70), 'cyan');

  if (hasErrors) {
    process.exit(1);
  }
}

// Run validation
validateEnvironment();