export const runtime = 'edge';

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  createUserIfNotExists,
} from "@/src/server/services/user.service";
import PocketBase, { ClientResponseError } from "pocketbase";

/**
 * Guest authentication endpoint
 * Creates anonymous user account and wallet automatically
 */
export async function POST(req: Request) {
  const pb = new PocketBase(process.env.POCKETBASE_URL!);
  const UserPassword = process.env.USER_PASSWORD!;

  try {
    console.log('Creating guest user...');

    // Generate a unique guest email
    const guestId = uuidv4();
    const guestEmail = `guest_${guestId}@guest.local`;
    
    // Create guest user directly without using service layer
    const userData = {
      email: guestEmail,
      emailVisibility: false, // Guest emails should not be visible
      name: `Guest User ${guestId.slice(0, 8)}`,
      password: UserPassword,
      passwordConfirm: UserPassword,
    };

    // Create and authenticate user
    let authUserData;
    try {
      // First create the user
      await pb.collection('users').create(userData);
      // Then authenticate to get the auth token
      authUserData = await pb.collection('users').authWithPassword(guestEmail, UserPassword);
      if (authUserData) {
        pb.authStore.save(authUserData.token, authUserData.record);
      }

      // Set auth cookie and return response
      const cookie = pb.authStore.exportToCookie();

      if (!authUserData?.record) {
        return NextResponse.json(
          { error: "Guest authentication process failed internally" },
          { status: 500 }
        );
      }

      // Create the response and set the cookie header
      const response = NextResponse.json(
        { 
          message: "Guest user created successfully",
          user: {
            id: authUserData.record.id,
            email: guestEmail,
            name: userData.name,
            isGuest: true,
          }
        },
        { status: 200 }
      );
      response.headers.set("Set-Cookie", cookie);
      return response;
    } catch (error) {
      console.error('Guest user creation error:', error);
      if (error instanceof ClientResponseError) {
        return NextResponse.json(
          {
            error: "Failed to create guest user account.",
            details: error.response,
          },
          { status: error.status || 500 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Guest authentication error:', error);
    return NextResponse.json(
      { error: "Internal server error during guest user creation" },
      { status: 500 }
    );
  }
}