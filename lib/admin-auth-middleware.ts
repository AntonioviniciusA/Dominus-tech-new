import type { NextRequest } from "next/server"
import { verifyToken } from "./auth-utils"

export function checkAdminAuth(request: NextRequest): boolean {
  const token = request.cookies.get("admin_token")?.value

  if (!token) {
    return false
  }

  return verifyToken(token)
}
