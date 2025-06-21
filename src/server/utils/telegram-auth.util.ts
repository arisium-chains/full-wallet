/**
 * Telegram Authentication Utilities
 * 
 * Provides server-side validation for Telegram Login Widget authentication
 * Uses Web Crypto API for Edge Runtime compatibility
 */

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
 * Convert string to Uint8Array
 */
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Convert ArrayBuffer to hex string
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validate Telegram authentication data using bot token
 * This is the official validation method from Telegram's documentation
 */
export async function validateTelegramAuthData(
  authData: TelegramAuthData,
  botToken: string
): Promise<{ valid: boolean; error?: string }> {
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

    // Create secret key from bot token using Web Crypto API
    const botTokenBuffer = stringToUint8Array(botToken);
    const secretKeyBuffer = await crypto.subtle.digest('SHA-256', botTokenBuffer);

    // Generate expected hash using Web Crypto API
    const key = await crypto.subtle.importKey(
      'raw',
      secretKeyBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const dataBuffer = stringToUint8Array(dataString);
    const expectedHashBuffer = await crypto.subtle.sign('HMAC', key, dataBuffer);
    const expectedHash = arrayBufferToHex(expectedHashBuffer);

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
export async function generateTelegramHash(dataString: string, botToken: string): Promise<string> {
  const botTokenBuffer = stringToUint8Array(botToken);
  const secretKeyBuffer = await crypto.subtle.digest('SHA-256', botTokenBuffer);

  const key = await crypto.subtle.importKey(
    'raw',
    secretKeyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const dataBuffer = stringToUint8Array(dataString);
  const hashBuffer = await crypto.subtle.sign('HMAC', key, dataBuffer);
  return arrayBufferToHex(hashBuffer);
}

/**
 * Validate Telegram webhook data (for future use)
 */
export async function validateTelegramWebhook(
  webhookData: any,
  botToken: string,
  secretToken?: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    // If secret token is provided, validate it
    if (secretToken) {
      const key = await crypto.subtle.importKey(
        'raw',
        stringToUint8Array(secretToken),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const dataBuffer = stringToUint8Array(JSON.stringify(webhookData));
      const hashBuffer = await crypto.subtle.sign('HMAC', key, dataBuffer);
      const expectedHeader = `sha256=${arrayBufferToHex(hashBuffer)}`;
      
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