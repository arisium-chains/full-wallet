/**
 * LINE Authentication Provider
 * 
 * Handles LINE OAuth authentication using LIFF SDK
 */

import liff from '@line/liff';
import type { 
  IAuthProvider, 
  AuthResult, 
  ProviderConfig,
  LineUserData,
  AuthUserData 
} from '@/src/interfaces/auth.interfaces';
import { getClientEnvironmentConfig } from '@/src/config/client-env.config';

export class LineAuthProvider implements IAuthProvider {
  readonly name = 'line' as const;
  private _isAvailable = false;
  private _isInitialized = false;
  private _config: ProviderConfig | null = null;

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  /**
   * Initialize LINE LIFF SDK
   */
  async initialize(config: ProviderConfig): Promise<void> {
    try {
      this._config = config;
      
      // Get LIFF ID from client environment config
      const clientConfig = getClientEnvironmentConfig();
      const liffId = clientConfig.line.liffId;
      
      if (!liffId) {
        throw new Error('LIFF ID not configured in environment variables');
      }

      // Initialize LIFF
      await liff.init({ liffId });
      
      this._isInitialized = true;
      this._isAvailable = true;
      
      console.log('LINE LIFF initialized successfully');
    } catch (error) {
      console.error('LINE LIFF initialization failed:', error);
      this._isAvailable = false;
      throw new Error(`LINE authentication initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Perform LINE authentication
   */
  async login(): Promise<AuthResult> {
    try {
      if (!this._isInitialized || !this._isAvailable) {
        throw new Error('LINE provider not properly initialized');
      }

      // Check if user is already logged in
      if (!liff.isLoggedIn()) {
        // Redirect to LINE login
        liff.login();
        // This will redirect away from the page, so we return a pending state
        return {
          success: false,
          provider: 'line',
          error: 'Redirecting to LINE login...'
        };
      }

      // Get ID token
      const idToken = liff.getIDToken();
      if (!idToken) {
        throw new Error('Failed to get LINE ID token');
      }

      // Parse the ID token to get user data
      const userData = this.parseIdToken(idToken);
      
      return {
        success: true,
        provider: 'line',
        userData,
        token: JSON.stringify({ idToken })
      };
      
    } catch (error) {
      console.error('LINE authentication error:', error);
      return {
        success: false,
        provider: 'line',
        error: error instanceof Error ? error.message : 'LINE authentication failed'
      };
    }
  }

  /**
   * Logout from LINE
   */
  logout(): void {
    try {
      if (this._isInitialized && liff.isLoggedIn()) {
        liff.logout();
      }
    } catch (error) {
      console.error('LINE logout error:', error);
    }
  }

  /**
   * Check if provider is properly configured
   */
  isConfigured(): boolean {
    const clientConfig = getClientEnvironmentConfig();
    const liffId = clientConfig.line.liffId;
    return !!liffId && this._isInitialized;
  }

  /**
   * Parse LINE ID token to extract user data
   */
  private parseIdToken(idToken: any): AuthUserData {
    // The idToken from LIFF contains user information
    // Note: In a real implementation, you might want to verify the token
    
    return {
      id: idToken.sub || '',
      email: idToken.email || '',
      name: idToken.name || '',
      avatar: idToken.picture || '',
      provider: 'line'
    };
  }

  /**
   * Get current login status
   */
  isLoggedIn(): boolean {
    try {
      return this._isInitialized && liff.isLoggedIn();
    } catch {
      return false;
    }
  }

  /**
   * Get LINE profile information
   */
  async getProfile(): Promise<AuthUserData | null> {
    try {
      if (!this.isLoggedIn()) {
        return null;
      }

      const profile = await liff.getProfile();
      
      return {
        id: profile.userId,
        name: profile.displayName,
        avatar: profile.pictureUrl || '',
        provider: 'line'
      };
    } catch (error) {
      console.error('Failed to get LINE profile:', error);
      return null;
    }
  }
}