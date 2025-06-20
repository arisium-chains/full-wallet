/**
 * Static Authentication Service for Cloudflare Pages deployment
 * 
 * Handles authentication entirely on the client-side without API routes
 */

import PocketBase from 'pocketbase';
import { validateTelegramAuthData } from '@/src/server/utils/telegram-auth.util';
import type { AuthProviderType } from '@/src/interfaces/auth.interfaces';

// PocketBase instance for client-side operations
let pb: PocketBase | null = null;

function getPocketBaseClient(): PocketBase {
  if (!pb) {
    const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://157.180.76.38:8090/';
    pb = new PocketBase(pbUrl);
  }
  return pb;
}

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface LineAuthData {
  idToken: {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
  };
}

/**
 * Client-side authentication service for static deployment
 */
export class StaticAuthService {
  private pb: PocketBase;
  private userPassword: string;

  constructor() {
    this.pb = getPocketBaseClient();
    this.userPassword = process.env.NEXT_PUBLIC_USER_PASSWORD || '12345678';
  }

  /**
   * Authenticate with Telegram
   */
  async authenticateWithTelegram(authData: TelegramAuthData): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate Telegram auth data
      const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
      if (botToken) {
        const validation = validateTelegramAuthData(authData, botToken);
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }
      }

      // Create email from Telegram ID
      const email = `telegram_${authData.id}@telegram.local`;
      const name = `${authData.first_name}${authData.last_name ? ' ' + authData.last_name : ''}`;

      // Try to authenticate existing user
      try {
        const authResult = await this.pb.collection('users').authWithPassword(email, this.userPassword);
        console.log('Telegram user authenticated successfully:', authResult);
        return { success: true };
      } catch (error) {
        // User doesn't exist, create new user
        try {
          await this.pb.collection('users').create({
            email,
            emailVisibility: false,
            name,
            password: this.userPassword,
            passwordConfirm: this.userPassword,
          });

          // Authenticate with newly created user
          await this.pb.collection('users').authWithPassword(email, this.userPassword);
          console.log('New Telegram user created and authenticated');
          return { success: true };
        } catch (createError) {
          console.error('Failed to create Telegram user:', createError);
          return { success: false, error: 'Failed to create user account' };
        }
      }
    } catch (error) {
      console.error('Telegram authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Authenticate with LINE
   */
  async authenticateWithLine(authData: LineAuthData): Promise<{ success: boolean; error?: string }> {
    try {
      const { idToken } = authData;
      const email = idToken.email || `line_${idToken.sub}@line.local`;
      const name = idToken.name || `LINE User ${idToken.sub.slice(0, 8)}`;

      // Try to authenticate existing user
      try {
        const authResult = await this.pb.collection('users').authWithPassword(email, this.userPassword);
        console.log('LINE user authenticated successfully:', authResult);
        return { success: true };
      } catch (error) {
        // User doesn't exist, create new user
        try {
          await this.pb.collection('users').create({
            email,
            emailVisibility: !!idToken.email,
            name,
            password: this.userPassword,
            passwordConfirm: this.userPassword,
          });

          // Authenticate with newly created user
          await this.pb.collection('users').authWithPassword(email, this.userPassword);
          console.log('New LINE user created and authenticated');
          return { success: true };
        } catch (createError) {
          console.error('Failed to create LINE user:', createError);
          return { success: false, error: 'Failed to create user account' };
        }
      }
    } catch (error) {
      console.error('LINE authentication error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  /**
   * Create guest user
   */
  async createGuestUser(): Promise<{ success: boolean; error?: string }> {
    try {
      const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const email = `${guestId}@guest.local`;
      const name = `Guest User ${guestId.slice(6, 14)}`;

      // Create guest user
      await this.pb.collection('users').create({
        email,
        emailVisibility: false,
        name,
        password: this.userPassword,
        passwordConfirm: this.userPassword,
      });

      // Authenticate with guest user
      await this.pb.collection('users').authWithPassword(email, this.userPassword);
      console.log('Guest user created and authenticated');
      return { success: true };
    } catch (error) {
      console.error('Guest user creation error:', error);
      return { success: false, error: 'Failed to create guest account' };
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.pb.authStore.model;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.pb.authStore.isValid;
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.pb.authStore.clear();
  }

  /**
   * Get user balance (mock for static deployment)
   */
  async getUserBalance(): Promise<any> {
    const user = this.getCurrentUser();
    if (!user) {
      return {
        walletAddress: "",
        name: "",
        symbol: "",
        decimals: 0,
        value: "",
        displayValue: "",
      };
    }

    // For static deployment, return mock balance
    // In production, this would connect to blockchain services
    return {
      walletAddress: user.walletAddress || "",
      name: "ARIS Token",
      symbol: "ARIS",
      decimals: 18,
      value: "0",
      displayValue: "0.00",
    };
  }
}

// Export singleton instance
export const staticAuthService = new StaticAuthService();