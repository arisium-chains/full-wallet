export const runtime = 'edge';

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { Balance } from "@/src/interfaces/user.interface";
import { withAuth } from "@/src/server/middlewares/auth.middleware";
import { getBalance } from "@/src/server/services/engine.service";
import { handleError } from "@/src/server/utils/handle-error.util";

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { user } = req;

    if (!user?.walletAddress) {
      const defaultBalance: Balance = {
        walletAddress: "",
        name: "",
        symbol: "",
        decimals: 0,
        value: "",
        displayValue: "",
      };
      return NextResponse.json(defaultBalance);
    }

    const balance = await getBalance(user.walletAddress);

    return NextResponse.json(balance.result);
  } catch (error: unknown) {
    console.error("Balance Route Error:", {
      error: error instanceof Error ? error : new Error(String(error)),
    });
    return handleError(error);
  }
});