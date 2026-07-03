import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"

export async function GET(req: Request) {
  try {
    const result = await turso.execute({
      sql: "SELECT id, name, email, phone FROM clients ORDER BY name",
    })

    const clients = result.rows.map((row) => ({
      id: row.id as string,
      nome: row.name as string,
      email: row.email as string | null,
      telefone: row.phone as string | null,
    }))

    return NextResponse.json(clients)
  } catch (error: any) {
    console.error("[API] /api/pdv/clients error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone } = body

    if (!name) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 })
    }

    const id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    await turso.execute({
      sql: "INSERT INTO clients (id, name, email, phone) VALUES (?, ?, ?, ?)",
      args: [id, name, email || null, phone || null],
    })

    return NextResponse.json({ id, nome: name, email, telefone: phone }, { status: 201 })
  } catch (error: any) {
    console.error("[API] /api/pdv/clients POST error:", error?.message || String(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
