import { cookies } from "next/headers"

/**
 * Gera ou recupera um ID de sessão único para o usuário
 * Usa cookie se disponível, senão gera um novo
 */
export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    cookieStore.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 ano
      path: "/",
    })
  }

  return sessionId
}

