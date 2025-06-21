export const runtime = 'edge';

import { NextResponse } from "next/server";
import {
  createUserIfNotExists,
  createAuthUserWithProvider,
} from "@/src/server/services/user.service";
import { getPocketBase } from "@/src/server/libs/pkbase.lib";
import { ClientResponseError } from "pocketbase";
import type { AuthProviderType } from "@/src/interfaces/auth.interfaces";
import { validateTelegramAuthData as validateTelegramHash } from "@/src/server/utils/telegram-auth.util";

/**
 * Dynamic authentication endpoint for multiple providers
 * Handles both LINE and Telegram authentication
 */
export async function POST(
  req: Request,
  { params }: { params: { provider: string } }
) {
  const pb = getPocketBase();
  const provider = params.provider as AuthProviderType;

  // Validate provider
  if (!['line', 'telegram'].includes(provider)) {
    return NextResponse.json(
      { error: `Unsupported authentication provider: ${provider}` },
      { status: 400 }
    );
  }

  try {
    const { authData } = await req.json();

    if (!authData) {
      return NextResponse.json(
        { error: "Missing authentication data" },
        { status: 400 }
      );
    }

    // Validate auth data based on provider
    const validationResult = validateAuthData(provider, authData);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // Authenticate and ensure user exists
    let authUserData;
    try {
      authUserData = await createAuthUserWithProvider(provider, authData);
      if (authUserData) {
        pb.authStore.save(authUserData.token, authUserData.record);
      }

      // Set auth cookie and return response
      const cookie = pb.authStore.exportToCookie();

      if (!authUserData?.record) {
        return NextResponse.json(
          { error: "Authentication process failed internally" },
          { status: 500 }
        );
      }

      await createUserIfNotExists({ userId: authUserData.record.id });

      // Create the response and set the cookie header
      const response = NextResponse.json(
        { 
          message: `User authenticated successfully with ${provider.toUpperCase()}`,
          provider 
        },
        { status: 200 }
      );
      response.headers.set("Set-Cookie", cookie);
      return response;
    } catch (error) {
      if (error instanceof ClientResponseError) {
        return NextResponse.json(
          {
            error: `Failed to process ${provider} authentication with backend.`,
            details: error.response,
          },
          { status: error.status || 500 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error(`Authentication error for ${provider}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Validate authentication data based on provider type
 */
function validateAuthData(provider: AuthProviderType, authData: any): { valid: boolean; error?: string } {
  switch (provider) {
    case 'line':
      return validateLineAuthData(authData);
    case 'telegram':
      return validateTelegramAuthData(authData);
    default:
      return { valid: false, error: `Unknown provider: ${provider}` };
  }
}

/**
 * Validate LINE authentication data
 */
function validateLineAuthData(authData: any): { valid: boolean; error?: string } {
  const { idToken } = authData;
  
  if (!idToken || typeof idToken !== "object") {
    return { valid: false, error: "Invalid or missing LINE idToken" };
  }

  if (!idToken.sub || !idToken.email) {
    return { 
      valid: false, 
      error: "Invalid LINE idToken fields (sub and email are required)" 
    };
  }

  return { valid: true };
}

/**
 * Validate Telegram authentication data
 */
function validateTelegramAuthData(authData: any): { valid: boolean; error?: string } {
  // Basic validation for required fields
  if (!authData.id || !authData.first_name || !authData.auth_date || !authData.hash) {
    return { 
      valid: false, 
      error: "Invalid Telegram auth data - missing required fields" 
    };
  }

  // Get bot token for validation
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn('Telegram bot token not configured - skipping hash validation');
    // Still allow authentication but warn in logs
    return { valid: true };
  }

  // Perform server-side hash validation
  return validateTelegramHash(authData, botToken);
}

/**
 * Logout endpoint for any provider
 */
export async function DELETE(
  req: Request,
  { params }: { params: { provider: string } }
) {
  const pb = getPocketBase();
  
  try {
    // Clear the authentication store
    pb.authStore.clear();
    
    // Create response with cleared cookie
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    
    // Clear the auth cookie
    response.headers.set(
      "Set-Cookie", 
      "pb_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict"
    );
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}