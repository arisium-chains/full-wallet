/**
 * Client-side Environment Configuration
 * 
 * This file provides access to environment variables that are safe for client-side use.
 * Only NEXT_PUBLIC_ prefixed variables are available on the client side.
 */

export interface ClientEnvironmentConfig {
  line: {
    liffId: string | undefined;
  };
  telegram: {
    botUsername: string | undefined;
  };
  api: {
    baseUrl: string | undefined;
    endpoint: string | undefined;
  };
  blockchain: {
    explorerUrl: string | undefined;
    defaultToken: string | undefined;
  };
}

/**
 * Get client-side environment configuration
 * These variables are replaced at build time by Next.js
 */
export function getClientEnvironmentConfig(): ClientEnvironmentConfig {
  return {
    line: {
      liffId: process.env.NEXT_PUBLIC_LIFF_ID,
    },
    telegram: {
      botUsername: process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME,
    },
    api: {
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
    },
    blockchain: {
      explorerUrl: process.env.NEXT_PUBLIC_EXP_BLOCKSCOUNT_URL,
      defaultToken: process.env.NEXT_PUBLIC_DEFAULT_TOKEN,
    }
  };
}

/**
 * Check if LINE authentication is configured
 */
export function isLineConfigured(): boolean {
  const config = getClientEnvironmentConfig();
  return !!config.line.liffId;
}

/**
 * Check if Telegram authentication is configured
 */
export function isTelegramConfigured(): boolean {
  const config = getClientEnvironmentConfig();
  return !!config.telegram.botUsername;
}

/**
 * Get available authentication providers
 */
export function getAvailableProviders(): string[] {
  const providers: string[] = [];
  
  if (isLineConfigured()) {
    providers.push('line');
  }
  
  if (isTelegramConfigured()) {
    providers.push('telegram');
  }
  
  return providers;
}