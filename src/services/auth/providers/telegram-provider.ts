/**
 * Telegram Authentication Provider
 * 
 * Handles Telegram OAuth authentication using Telegram Login Widget
 */

import type { 
  IAuthProvider, 
  AuthResult, 
  ProviderConfig,
  TelegramUserData,
  AuthUserData 
} from '@/src/interfaces/auth.interfaces';
import { getClientEnvironmentConfig } from '@/src/config/client-env.config';

// Telegram Login Widget callback data
interface TelegramAuthResponse {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export class TelegramAuthProvider implements IAuthProvider {
  readonly name = 'telegram' as const;
  private _isAvailable = false;
  private _isInitialized = false;
  private _config: ProviderConfig | null = null;
  private _botUsername: string | null = null;

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  /**
   * Initialize Telegram Login Widget
   */
  async initialize(config: ProviderConfig): Promise<void> {
    try {
      this._config = config;
      
      // Get bot username from client environment config
      const clientConfig = getClientEnvironmentConfig();
      const botUsername = clientConfig.telegram.botUsername;
      
      if (!botUsername) {
        throw new Error('Telegram bot username not configured in environment variables');
      }

      this._botUsername = botUsername;
      
      // Load Telegram Login Widget script if not already loaded
      await this.loadTelegramScript();
      
      this._isInitialized = true;
      this._isAvailable = true;
      
      console.log('Telegram authentication initialized successfully');
    } catch (error) {
      console.error('Telegram authentication initialization failed:', error);
      this._isAvailable = false;
      throw new Error(`Telegram authentication initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Perform Telegram authentication by creating login widget
   */
  async login(): Promise<AuthResult> {
    try {
      if (!this._isInitialized || !this._isAvailable || !this._botUsername) {
        throw new Error('Telegram provider not properly initialized');
      }

      // Return a promise that resolves when user completes authentication
      return new Promise((resolve) => {
        this.createLoginWidget((authData) => {
          if (authData) {
            const userData = this.convertTelegramDataToAuthUserData(authData);
            resolve({
              success: true,
              provider: 'telegram',
              userData,
              token: JSON.stringify(authData)
            });
          } else {
            resolve({
              success: false,
              provider: 'telegram',
              error: 'Telegram authentication was cancelled or failed'
            });
          }
        });
      });
      
    } catch (error) {
      console.error('Telegram authentication error:', error);
      return {
        success: false,
        provider: 'telegram',
        error: error instanceof Error ? error.message : 'Telegram authentication failed'
      };
    }
  }

  /**
   * Logout from Telegram (no specific logout needed for Telegram widgets)
   */
  logout(): void {
    // Telegram Login Widget doesn't require explicit logout
    // User session is managed by the backend
    console.log('Telegram logout completed');
  }

  /**
   * Check if provider is properly configured
   */
  isConfigured(): boolean {
    const clientConfig = getClientEnvironmentConfig();
    const botUsername = clientConfig.telegram.botUsername;
    return !!botUsername && this._isInitialized;
  }

  /**
   * Load Telegram Login Widget script
   */
  private async loadTelegramScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.getElementById('telegram-login-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'telegram-login-script';
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Telegram Login Widget script'));
      
      document.head.appendChild(script);
    });
  }

  /**
   * Create Telegram Login Widget button
   */
  private createLoginWidget(onAuth: (authData: TelegramAuthResponse | null) => void): void {
    if (!this._botUsername) {
      onAuth(null);
      return;
    }

    // Create a unique callback function name
    const callbackName = `telegramLoginCallback_${Date.now()}`;
    
    // Set up global callback function
    (window as any)[callbackName] = (authData: TelegramAuthResponse) => {
      // Clean up the global callback
      delete (window as any)[callbackName];
      onAuth(authData);
    };

    // Create the widget button
    const widget = document.createElement('script');
    widget.async = true;
    widget.src = 'https://telegram.org/js/telegram-widget.js?22';
    widget.setAttribute('data-telegram-login', this._botUsername);
    widget.setAttribute('data-size', 'large');
    widget.setAttribute('data-onauth', `${callbackName}(user)`);
    widget.setAttribute('data-request-access', 'write');

    // Find the telegram login container and append widget
    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.innerHTML = ''; // Clear previous widgets
      container.appendChild(widget);
    } else {
      console.error('Telegram login container not found');
      onAuth(null);
    }
  }

  /**
   * Convert Telegram auth response to unified AuthUserData
   */
  private convertTelegramDataToAuthUserData(telegramData: TelegramAuthResponse): AuthUserData {
    return {
      id: telegramData.id.toString(),
      name: `${telegramData.first_name}${telegramData.last_name ? ' ' + telegramData.last_name : ''}`,
      firstName: telegramData.first_name,
      lastName: telegramData.last_name,
      username: telegramData.username,
      avatar: telegramData.photo_url,
      provider: 'telegram'
    };
  }

  /**
   * Create a custom login button that triggers the widget
   */
  createCustomLoginButton(
    container: HTMLElement, 
    onAuth: (authData: TelegramAuthResponse | null) => void
  ): void {
    if (!this._botUsername) {
      onAuth(null);
      return;
    }

    // Create button element
    const button = document.createElement('button');
    button.className = 'telegram-login-button';
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
      Continue with Telegram
    `;

    button.onclick = () => {
      this.createLoginWidget(onAuth);
    };

    container.appendChild(button);
  }

  /**
   * Validate Telegram auth data (basic client-side validation)
   * Full validation should be done on the backend
   */
  static validateAuthData(authData: TelegramAuthResponse): boolean {
    // Basic validation - check required fields
    return !!(
      authData.id &&
      authData.first_name &&
      authData.auth_date &&
      authData.hash &&
      // Check if auth_date is not too old (within last hour)
      (Date.now() / 1000 - authData.auth_date) < 3600
    );
  }
}