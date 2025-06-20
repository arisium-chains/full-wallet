#!/usr/bin/env node

/**
 * LIFF Setup Helper Script
 * 
 * This interactive script helps you configure LIFF step by step
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ANSI colors
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function updateEnvFile(lineClientId, lineClientSecret, liffId) {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    colorLog('❌ .env.local file not found!', 'red');
    return false;
  }

  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update the LINE OAuth variables
  envContent = envContent.replace(/LINE_CLIENT_ID=.*/, `LINE_CLIENT_ID=${lineClientId}`);
  envContent = envContent.replace(/LINE_CLIENT_SECRET=.*/, `LINE_CLIENT_SECRET=${lineClientSecret}`);
  envContent = envContent.replace(/NEXT_PUBLIC_LIFF_ID=.*/, `NEXT_PUBLIC_LIFF_ID=${liffId}`);
  
  fs.writeFileSync(envPath, envContent);
  return true;
}

async function main() {
  colorLog('\n🎯 LIFF Configuration Helper', 'cyan');
  colorLog('=' .repeat(50), 'cyan');
  
  colorLog('\nThis helper will guide you through configuring LIFF for your ARIS Wallet.', 'white');
  colorLog('Make sure you have completed the LINE Developer Console setup first!\n', 'yellow');

  // Check if they've done the setup
  const setupDone = await question(colorLog('Have you created a LINE Login Channel and LIFF app? (y/n): ', 'blue'));
  
  if (setupDone.toLowerCase() !== 'y') {
    colorLog('\n📖 Please complete the LINE Developer Console setup first:', 'yellow');
    colorLog('1. Go to: https://developers.line.biz/', 'white');
    colorLog('2. Create a Provider and LINE Login Channel', 'white');
    colorLog('3. Create a LIFF app', 'white');
    colorLog('4. Run this script again\n', 'white');
    rl.close();
    return;
  }

  colorLog('\n✅ Great! Now let\'s configure your environment variables.\n', 'green');

  // Get LINE_CLIENT_ID
  colorLog('📝 Step 1: LINE Channel ID', 'cyan');
  colorLog('   Location: LINE Developers Console > Your Channel > Basic settings', 'white');
  const lineClientId = await question('   Enter your LINE_CLIENT_ID (Channel ID): ');
  
  if (!lineClientId || lineClientId.length < 8) {
    colorLog('   ❌ Invalid Channel ID. Should be a number like 1234567890', 'red');
    rl.close();
    return;
  }

  // Get LINE_CLIENT_SECRET
  colorLog('\n📝 Step 2: LINE Channel Secret', 'cyan');
  colorLog('   Location: Same page as Channel ID', 'white');
  const lineClientSecret = await question('   Enter your LINE_CLIENT_SECRET (Channel Secret): ');
  
  if (!lineClientSecret || lineClientSecret.length < 20) {
    colorLog('   ❌ Invalid Channel Secret. Should be a long string', 'red');
    rl.close();
    return;
  }

  // Get LIFF_ID
  colorLog('\n📝 Step 3: LIFF App ID', 'cyan');
  colorLog('   Location: LINE Developers Console > Your Channel > LIFF tab', 'white');
  const liffId = await question('   Enter your NEXT_PUBLIC_LIFF_ID (LIFF ID): ');
  
  if (!liffId || !liffId.includes('-')) {
    colorLog('   ❌ Invalid LIFF ID. Should be format: 1234567890-abcdefgh', 'red');
    rl.close();
    return;
  }

  // Confirm configuration
  colorLog('\n📋 Configuration Summary:', 'cyan');
  colorLog(`   LINE_CLIENT_ID: ${lineClientId}`, 'white');
  colorLog(`   LINE_CLIENT_SECRET: ${lineClientSecret.substring(0, 8)}...`, 'white');
  colorLog(`   NEXT_PUBLIC_LIFF_ID: ${liffId}`, 'white');

  const confirm = await question('\n✅ Save this configuration to .env.local? (y/n): ');
  
  if (confirm.toLowerCase() === 'y') {
    const success = await updateEnvFile(lineClientId, lineClientSecret, liffId);
    
    if (success) {
      colorLog('\n🎉 Configuration saved successfully!', 'green');
      colorLog('\n🚀 Next steps:', 'cyan');
      colorLog('1. Run: npm run validate-env', 'white');
      colorLog('2. Run: npm run dev', 'white');
      colorLog('3. Test login at: http://localhost:3000/login', 'white');
      colorLog('4. Click the LINE login button to test', 'white');
    } else {
      colorLog('\n❌ Failed to save configuration', 'red');
    }
  } else {
    colorLog('\n⏭️  Configuration not saved. Run this script again when ready.', 'yellow');
  }

  rl.close();
}

main().catch(console.error);