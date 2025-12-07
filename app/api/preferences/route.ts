import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"
import { getSessionId } from "@/lib/db/session"

export async function GET() {
  try {
    const sessionId = await getSessionId()

    const result = await turso.execute({
      sql: "SELECT cookies_accepted FROM preferences WHERE session_id = ?",
      args: [sessionId],
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ cookiesAccepted: false })
    }

    return NextResponse.json({
      cookiesAccepted: (result.rows[0].cookies_accepted as number) === 1,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { cookiesAccepted } = await req.json()
    const sessionId = await getSessionId()

    // Verifica se já existe preferência para esta sessão
    const existing = await turso.execute({
      sql: "SELECT id FROM preferences WHERE session_id = ?",
      args: [sessionId],
    })

    if (existing.rows.length > 0) {
      // Atualiza
      await turso.execute({
        sql: "UPDATE preferences SET cookies_accepted = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?",
        args: [cookiesAccepted ? 1 : 0, sessionId],
      })
    } else {
      // Cria nova entrada
      const id = `pref_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      await turso.execute({
        sql: "INSERT INTO preferences (id, session_id, cookies_accepted) VALUES (?, ?, ?)",
        args: [id, sessionId, cookiesAccepted ? 1 : 0],
      })
    }

    return NextResponse.json({ success: true, cookiesAccepted })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

