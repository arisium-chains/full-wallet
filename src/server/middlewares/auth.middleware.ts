import type { NextRequest, NextResponse } from "next/server";
import { ErrorCode } from "@/src/enums/error-code.enum";
import { ERROR_MESSAGES } from "../constants/error.constant";
import { UnauthorizedException } from "../errors/http-exceptions.error";
import { handleError } from "../utils/handle-error.util";
import { getUserById } from "../services/user.service";

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;


function extractPbAuthCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/pb_auth=([^;]+)/);
  return match ? match[1] : null;
}


function parsePbAuthCookie(pbAuthValue: string): { token: string; userId: string } | null {
  try {
    const decoded = decodeURIComponent(pbAuthValue);
    const parsed = JSON.parse(decoded);
    if (parsed.token && parsed.record?.id) {
      return { token: parsed.token, userId: parsed.record.id };
    }
    return null;
  } catch {
    return null;
  }
}


export const withAuth =
  (handler: RouteHandler) =>
  async (req: NextRequest) => {
    try {
      
      const cookieHeader = req.headers.get("cookie");
      let token: string | null = null;
      let userId: string | null = null;

      const pbAuthValue = extractPbAuthCookie(cookieHeader);
      if (pbAuthValue) {
        const parsed = parsePbAuthCookie(pbAuthValue);
        if (parsed) {
          token = parsed.token;
          userId = parsed.userId;
        }
      }


      if (!token) {
        throw new UnauthorizedException(ERROR_MESSAGES[ErrorCode.UNAUTHORIZED]);
      }


      if (!userId) {
        throw new UnauthorizedException(ERROR_MESSAGES[ErrorCode.INVALID_TOKEN]);
      }
      const user = await getUserById(userId);


      req.user = user;

      req.accessToken = token;


      const response = await handler(req);
      return response;
    } catch (error: unknown) {
      console.error("Auth Middleware Error:", {
        error: error instanceof Error ? error : new Error(String(error)),
      });
      return handleError(error);
    }
  };