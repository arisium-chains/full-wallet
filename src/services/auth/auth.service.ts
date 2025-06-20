/**
 * Unified Authentication Service
 * 
 * Manages multiple authentication providers and provides a unified interface
 */

import { LineAuthProvider } from './providers/line-provider';
import { TelegramAuthProvider } from './providers/telegram-provider';
import { getClientEnvironmentConfig, getAvailableProviders } from '@/src/config/client-env.config';
import type { 
  IAuthProvider,
  AuthProviderType,
  AuthResult,
  ProviderConfig,
  ProviderAvailability,
  AuthEnvironmentConfig
} from '@/src/interfaces/auth.interfaces';

export class AuthService {
  private providers: Map<AuthProviderType, IAuthProvider> = new Map();
  private initialized = false;

  constructor() {
    // Register available providers
    this.providers.set('line', new LineAuthProvider());
    this.providers.set('telegram', new TelegramAuthProvider());
  }

  /**
   * Initialize all available providers
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const clientConfig = getClientEnvironmentConfig();
    const availableProviderNames = getAvailableProviders();
    const initPromises: Promise<void>[] = [];

    // Initialize each available provider
    for (const providerName of availableProviderNames) {
      const providerType = providerName as AuthProviderType;
      const provider = this.providers.get(providerType);
      
      if (provider) {
        const providerConfig: ProviderConfig = {
          provider: providerType,
          ...this.getProviderSpecificConfig(providerType, clientConfig)
        };

        initPromises.push(
          provider.initialize(providerConfig).catch((error) => {
            console.warn(`Failed to initialize ${providerType} provider:`, error);
          })
        );
      }
    }

    await Promise.allSettled(initPromises);
    this.initialized = true;
    
    console.log('AuthService initialized with providers:', this.getAvailableProviders());
  }

  /**
   * Get list of available (initialized and configured) providers
   */
  getAvailableProviders(): AuthProviderType[] {
    return Array.from(this.providers.entries())
      .filter(([_, provider]) => provider.isAvailable && provider.isConfigured())
      .map(([type, _]) => type);
  }

  /**
   * Get provider availability status
   */
  getProviderAvailability(): ProviderAvailability {
    return {
      line: this.isProviderAvailable('line'),
      telegram: this.isProviderAvailable('telegram')
    };
  }

  /**
   * Check if a specific provider is available
   */
  isProviderAvailable(providerType: AuthProviderType): boolean {
    const provider = this.providers.get(providerType);
    return !!(provider && provider.isAvailable && provider.isConfigured());
  }

  /**
   * Authenticate with a specific provider
   */
  async login(providerType: AuthProviderType): Promise<AuthResult> {
    const provider = this.providers.get(providerType);
    
    if (!provider) {
      return {
        success: false,
        provider: providerType,
        error: `Provider ${providerType} not found`
      };
    }

    if (!provider.isAvailable || !provider.isConfigured()) {
      return {
        success: false,
        provider: providerType,
        error: `Provider ${providerType} is not available or configured`
      };
    }

    try {
      const result = await provider.login();
      
      // If authentication is successful, send data to backend
      if (result.success && result.userData && result.token) {
        return await this.authenticateWithBackend(result);
      }
      
      return result;
    } catch (error) {
      console.error(`Authentication failed for provider ${providerType}:`, error);
      return {
        success: false,
        provider: providerType,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  /**
   * Logout from a specific provider
   */
  async logout(providerType?: AuthProviderType): Promise<void> {
    if (providerType) {
      // Logout from specific provider
      const provider = this.providers.get(providerType);
      if (provider) {
        provider.logout();
      }
    } else {
      // Logout from all providers
      for (const provider of this.providers.values()) {
        provider.logout();
      }
    }

    // Clear backend session
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Backend logout failed:', error);
    }
  }

  /**
   * Get the default provider based on availability and configuration
   */
  getDefaultProvider(): AuthProviderType | null {
    const availableProviders = this.getAvailableProviders();
    
    // Return LINE as default if available, otherwise first available provider
    if (availableProviders.includes('line')) {
      return 'line';
    }
    
    // Return first available provider
    return availableProviders[0] || null;
  }

  /**
   * Send authentication result to backend for verification and session creation
   */
  private async authenticateWithBackend(authResult: AuthResult): Promise<AuthResult> {
    try {
      const response = await fetch(`/api/auth/${authResult.provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          provider: authResult.provider,
          authData: JSON.parse(authResult.token || '{}')
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          provider: authResult.provider,
          error: data.error || 'Backend authentication failed'
        };
      }

      return {
        success: true,
        provider: authResult.provider,
        userData: authResult.userData
      };
    } catch (error) {
      console.error('Backend authentication error:', error);
      return {
        success: false,
        provider: authResult.provider,
        error: 'Failed to communicate with authentication server'
      };
    }
  }


  /**
   * Get provider-specific configuration
   */
  private getProviderSpecificConfig(
    providerType: AuthProviderType, 
    config: any
  ): Partial<ProviderConfig> {
    switch (providerType) {
      case 'line':
        return {
          clientId: config.line.liffId
        };
      case 'telegram':
        return {
          botUsername: config.telegram.botUsername
        };
      default:
        return {};
    }
  }
}

// Create and export a singleton instance
export const authService = new AuthService();