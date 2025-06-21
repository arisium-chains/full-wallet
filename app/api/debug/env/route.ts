export const runtime = 'edge';

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  return NextResponse.json({
    POCKETBASE_URL: process.env.POCKETBASE_URL,
    HAS_POCKETBASE_TOKEN: !!process.env.POCKETBASE_TOKEN,
    HAS_USER_PASSWORD: !!process.env.USER_PASSWORD,
    USER_PASSWORD_LENGTH: process.env.USER_PASSWORD?.length,
    POCKETBASE_TOKEN_LENGTH: process.env.POCKETBASE_TOKEN?.length,
  });
}