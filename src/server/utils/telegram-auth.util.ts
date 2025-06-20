/**
 * Telegram Authentication Utilities
 * 
 * Provides server-side validation for Telegram Login Widget authentication
 */

import crypto from 'crypto';

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

/**
 * Validate Telegram authentication data using bot token
 * This is the official validation method from Telegram's documentation
 */
export function validateTelegramAuthData(
  authData: TelegramAuthData,
  botToken: string
): { valid: boolean; error?: string } {
  try {
    // Check if auth_date is not too old (within last hour)
    const authAge = Date.now() / 1000 - authData.auth_date;
    if (authAge > 3600) {
      return { 
        valid: false, 
        error: 'Authentication data is too old (>1 hour)' 
      };
    }

    // Create data string for hash verification
    const { hash, ...dataWithoutHash } = authData;
    const dataString = Object.keys(dataWithoutHash)
      .sort()
      .map(key => `${key}=${dataWithoutHash[key as keyof typeof dataWithoutHash]}`)
      .join('\n');

    // Create secret key from bot token
    const secretKey = crypto
      .createHash('sha256')
      .update(botToken)
      .digest();

    // Generate expected hash
    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataString)
      .digest('hex');

    // Compare hashes
    if (hash !== expectedHash) {
      return { 
        valid: false, 
        error: 'Hash verification failed - authentication data may be tampered with' 
      };
    }

    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Create a data string from Telegram auth data (for manual verification)
 */
export function createTelegramDataString(authData: Omit<TelegramAuthData, 'hash'>): string {
  return Object.keys(authData)
    .sort()
    .map(key => `${key}=${authData[key as keyof typeof authData]}`)
    .join('\n');
}

/**
 * Generate expected hash for given data and bot token (utility function)
 */
export function generateTelegramHash(dataString: string, botToken: string): string {
  const secretKey = crypto
    .createHash('sha256')
    .update(botToken)
    .digest();

  return crypto
    .createHmac('sha256', secretKey)
    .update(dataString)
    .digest('hex');
}

/**
 * Validate Telegram webhook data (for future use)
 */
export function validateTelegramWebhook(
  webhookData: any,
  botToken: string,
  secretToken?: string
): { valid: boolean; error?: string } {
  try {
    // If secret token is provided, validate it
    if (secretToken) {
      const expectedHeader = `sha256=${crypto
        .createHmac('sha256', secretToken)
        .update(JSON.stringify(webhookData))
        .digest('hex')}`;
      
      // This would need to be compared with X-Telegram-Bot-Api-Secret-Token header
      // Implementation depends on webhook setup
    }

    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: `Webhook validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}