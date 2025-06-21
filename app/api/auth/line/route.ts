export const runtime = 'edge';

import { NextResponse } from "next/server";
import {
  createUserIfNotExists,
  createAuthUser,
} from "@/src/server/services/user.service";
import { getPocketBase } from "@/src/server/libs/pkbase.lib";
import { ClientResponseError } from "pocketbase";

export async function POST(req: Request) {
  const pb = getPocketBase();

  try {
    const { idToken } = await req.json();

    // Validate idToken
    if (
      !idToken ||
      typeof idToken !== "object" ||
      !idToken.sub ||
      !idToken.email
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid or missing idToken fields (sub and email are required)",
        },
        { status: 400 }
      );
    }

    // Authenticate and ensure user exists
    let authUserData;
    try {
      authUserData = await createAuthUser(idToken);
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
        { message: "User authenticated and processed successfully" },
        { status: 200 }
      );
      response.headers.set("Set-Cookie", cookie);
      return response;
    } catch (error) {
      if (error instanceof ClientResponseError) {
        return NextResponse.json(
          {
            error: "Failed to process user authentication with backend.",
            details: error.response,
          },
          { status: error.status || 500 }
        );
      }
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}