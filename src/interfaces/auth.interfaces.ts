/**
 * Authentication Provider Interfaces
 * 
 * Defines the contracts for multiple authentication providers (LINE, Telegram, etc.)
 */

// Supported authentication providers
export type AuthProviderType = 'line' | 'telegram';

// Unified user data interface
export interface AuthUserData {
  id: string;           // Provider-specific user ID
  email?: string;       // Email address (may not be available for all providers)
  name?: string;        // Display name
  firstName?: string;   // First name (for providers that separate names)
  lastName?: string;    // Last name
  username?: string;    // Username (for providers that support it)
  avatar?: string;      // Avatar/profile picture URL
  provider: AuthProviderType;
}

// Authentication result from provider
export interface AuthResult {
  success: boolean;
  provider: AuthProviderType;
  userData?: AuthUserData;
  token?: string;       // Provider-specific token/data
  error?: string;       // Error message if authentication failed
}

// Provider initialization configuration
export interface ProviderConfig {
  provider: AuthProviderType;
  clientId?: string;
  botUsername?: string;
  redirectUrl?: string;
  additionalParams?: Record<string, any>;
}

// Authentication provider interface
export interface IAuthProvider {
  readonly name: AuthProviderType;
  readonly isAvailable: boolean;
  
  // Initialize the provider (load SDKs, setup configurations)
  initialize(config: ProviderConfig): Promise<void>;
  
  // Perform authentication
  login(): Promise<AuthResult>;
  
  // Cleanup and logout
  logout(): void;
  
  // Check if provider is properly configured
  isConfigured(): boolean;
}

// LINE-specific interfaces
export interface LineUserData extends AuthUserData {
  sub: string;          // LINE user ID
  email: string;        // Email is required for LINE
  name?: string;        // Display name
  picture?: string;     // Avatar URL
}

export interface LineAuthData {
  idToken: any;         // LINE ID token object
}

// Telegram-specific interfaces  
export interface TelegramUserData extends AuthUserData {
  id: number;           // Telegram user ID
  first_name: string;   // First name (required)
  last_name?: string;   // Last name
  username?: string;    // Telegram username
  photo_url?: string;   // Avatar URL
  auth_date: number;    // Authentication timestamp
  hash: string;         // Data hash for verification
}

export interface TelegramAuthData {
  user: TelegramUserData;
  auth_date: number;
  hash: string;
}

// Backend authentication request/response interfaces
export interface AuthRequest {
  provider: AuthProviderType;
  authData: LineAuthData | TelegramAuthData;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email?: string;
    name?: string;
    provider: AuthProviderType;
    walletAddress?: string;
  };
  error?: string;
}

// Provider availability check
export interface ProviderAvailability {
  line: boolean;
  telegram: boolean;
}

// Environment configuration for providers
export interface AuthEnvironmentConfig {
  line: {
    clientId?: string;
    clientSecret?: string;
    liffId?: string;
  };
  telegram: {
    botUsername?: string;
    botToken?: string;
  };
  allowedProviders: AuthProviderType[];
  defaultProvider: AuthProviderType;
}