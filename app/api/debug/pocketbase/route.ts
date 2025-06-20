import { NextResponse } from "next/server";
import { getPocketBaseAdmin } from "@/src/server/libs/pkbase.lib";

export async function GET(req: Request) {
  try {
    const pbAdmin = getPocketBaseAdmin();
    
    // Test admin connection
    const result = {
      isValid: pbAdmin.authStore.isValid,
      baseUrl: pbAdmin.baseUrl,
      hasToken: !!pbAdmin.authStore.token,
    };

    // Try to list collections to see if admin access works
    try {
      const collections = await pbAdmin.collections.getList();
      result.collections = collections.items.map(c => c.name);
    } catch (error) {
      result.collectionsError = error.message;
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      type: error.constructor.name
    }, { status: 500 });
  }
}