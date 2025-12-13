import { cookies } from "next/headers"

export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) {
    try {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      cookieStore.set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      })
      return sessionId
    } catch (error) {
      console.error("Erro ao definir cookie de sessão:", error)
    }
  }

  return sessionId!
}
