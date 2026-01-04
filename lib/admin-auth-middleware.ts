import type { NextRequest } from "next/server";
import { verifyToken } from "./auth-utils";

export async function checkAdminAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return false;
  }

  const payload = await verifyToken(token);
  return !!payload;
}
